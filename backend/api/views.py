from django.contrib.auth.models import User
from django.http import JsonResponse
from django.utils.dateparse import parse_datetime
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .serializers import UserSerializer, ReviewSerializer, ListingSerializer
from .models import Review, Listing
import json
from haralyzer import HarParser
import base64
import re

from transformers import pipeline
import warnings
import os
from dotenv import load_dotenv
import google.generativeai as genai

warnings.filterwarnings("ignore", category=FutureWarning)
sentiment_classifier = pipeline(task="text-classification", model="SamLowe/roberta-base-go_emotions", device=0, top_k=None)

load_dotenv('../../.env')   
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
genai.configure(api_key=os.environ["GEMINI_API_KEY"])
model = genai.GenerativeModel(
  model_name="gemini-1.5-flash",
  system_instruction="You are an analyst for Airbnb reviews.  You always point out 5 areas in which the Airbnb is doing well, 5 areas in which the Airbnb can be improved, and the reasoning for each point. You always respond with a JSON without any newlines. You always use the keys \"strengths\" for areas doing well, \"weaknesses\" for areas that can improve, and \"area\" and \"reason\" for the area and reasoning.",
)

class CreateReviewList(generics.ListCreateAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Review.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(user=self.request.user)
        else:
            print(serializer.errors)

class UpdateListingName(generics.UpdateAPIView):
    serializer_class = ListingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Listing.objects.filter(user=self.request.user)

class DeleteReview(generics.DestroyAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Review.objects.filter(user=self.request.user)
    
    def perform_destroy(self, instance):
        listing = instance.listing
        if listing:
            listing.summary_up_to_date = False
            listing.save()
        super().perform_destroy(instance)
    
class DeleteAllReviews(generics.GenericAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated]

    def delete(self, _):
        all_reviews = Review.objects.filter(user=self.request.user)
        all_reviews.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class ProcessHarFile(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        current_user = request.user
        filtered_entries = self.filter_entries(request)
        decoded_json = self.decode_json(filtered_entries)
        extracted_review_data = self.extract_review_data(decoded_json)
        self.save_review_data(current_user, extracted_review_data)
        self.classify_review_sentiment(current_user)
        return JsonResponse({'count': len(extracted_review_data)})

    def filter_entries(self, request):
        har_file = request.FILES['har-file'].read().decode('utf-8')
        har_data = json.loads(har_file)
        har_parser = HarParser(har_data)
        entries = har_parser.har_data['entries']

        filtered_entries = []
        for entry in entries:
            if 'https://www.airbnb.com/api/v3/GetUserProfileReviews' in entry['request']['url']:
                filtered_entries.append(entry['response']['content']['text'])

        return filtered_entries
    
    def is_base64(self, s):
            s = re.sub(r'[^A-Za-z0-9+/=]', '', s)
            return base64.b64encode(base64.b64decode(s)).decode('utf-8') == s
    
    def decode_json(self, filtered_entries):
        decoded_json = []
        for entry in filtered_entries:
            if self.is_base64(entry):
                decoded_bytes = base64.b64decode(entry)
                decoded_str = decoded_bytes.decode('utf-8')
                json_data = json.loads(decoded_str)
            else:
                json_data = json.loads(entry)
            decoded_json.append(json_data)
        return decoded_json
    
    def extract_review_data(self, decoded_json):
        extracted_review_data = []
        for key in decoded_json:
            reviews = key['data']['presentation']['userProfileContainer']['userProfileReviews']['reviews']
            for review in reviews:

                review_id = review['id']
                rating = review['rating']
                comment = review['comments']
                reviewer = review['reviewer']['smartName']
                listing = review['listing']
                if listing != None:
                    listing_id = listing['id']
                    listing_name = listing['name']
                    listing_image = listing['pictureUrl']
                else:
                    listing_id = None
                    listing_name = None
                    listing_image = None
                date = parse_datetime(review['createdAt'])

                extracted_review_data.append({
                    'review_id': review_id,
                    'rating': rating,
                    'comment': comment,
                    'reviewer': reviewer,
                    'listing_id': listing_id,
                    'listing_name': listing_name,
                    'listing_image': listing_image,
                    'date': date
                })
        return extracted_review_data
    
    def find_or_create_review_listing(self, current_user, review_data):
        listing = None
        if review_data['listing_id'] != None:
            # Gets existing listing or creates a new one if it exists
            listing_id = review_data['listing_id']
            listing_name = review_data['listing_name']
            listing_image = review_data['listing_image']
            listing, _ = Listing.objects.get_or_create(
                listing_id = listing_id,
                user = current_user,
                defaults={
                    'name': listing_name,
                    'image': listing_image,
                }
            )
        return listing

    def save_review_data(self, current_user, extracted_review_data):
        listings_changed = []
        for review_data in extracted_review_data:
            review_exists = Review.objects.filter(
                review_id=review_data['review_id'],
                user=current_user
            ).exists()
            if not review_exists:
                listing = self.find_or_create_review_listing(current_user, review_data)
                if listing:
                    listings_changed.append(listing)
                Review.objects.create(
                    review_id=review_data['review_id'],
                    user=current_user,
                    rating=review_data['rating'],
                    comment=review_data['comment'],
                    reviewer=review_data['reviewer'],
                    listing=listing,
                    date=review_data['date'],
                    sentiment=None,
                )
        self.update_listing_summary_status(listings_changed)


    def update_listing_summary_status(self, listings_changed):
        for listing in listings_changed:
            listing.summary_up_to_date = False
            listing.save()

    def classify_review_sentiment(self, current_user):
        reviews = Review.objects.filter(user=current_user, sentiment__isnull=True)
        comments = [review.comment for review in reviews]
        model_output = sentiment_classifier(comments)
        for index, review in enumerate(reviews):
            review.sentiment = model_output[index][0]['label']
            review.save()

class GenerateListingSummary(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, *args, **kwargs):
        listing_key = self.kwargs.get('pk')
        listing = Listing.objects.get(pk = listing_key, user=self.request.user)
        reviews = Review.objects.filter(listing=listing)
        review_input = ''.join(f"<review>{review.comment}</review>" for review in reviews)
        response = model.generate_content(review_input)
        json_data = json.loads(response.text)
        listing.summary = json_data
        listing.summary_up_to_date = True
        listing.save()
        return JsonResponse({'summary': json_data})
    