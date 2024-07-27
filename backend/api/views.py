from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer, ReviewSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Review

from django.http import JsonResponse
from rest_framework.views import APIView
from .models import Review
import json
from haralyzer import HarParser
import base64
import re
from django.utils.dateparse import parse_datetime
from django.views.decorators.csrf import csrf_exempt


class ProcessHarFile(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request, *args, **kwargs):
        har_file = request.FILES['har-file'].read().decode('utf-8')
        har_data = json.loads(har_file)

        har_parser = HarParser(har_data)

        filtered_entries = []
        entries = har_parser.har_data['entries']
        for i in range(0, len(entries), 2):
            entry = entries[i]
            if 'https://www.airbnb.com/api/v3/GetUserProfileReviews' in entry['request']['url']:
                filtered_entries.append(entry['response']['content']['text'])

        def is_base64(s):
            s = re.sub(r'[^A-Za-z0-9+/=]', '', s)
            return base64.b64encode(base64.b64decode(s)).decode('utf-8') == s

        decoded_json = []
        for entry in filtered_entries:
            if is_base64(entry):
                decoded_bytes = base64.b64decode(entry)
                decoded_str = decoded_bytes.decode('utf-8')
                json_data = json.loads(decoded_str)
            else:
                json_data = json.loads(entry)
            decoded_json.append(json_data)

        extracted_review_data = []
        for key in decoded_json:
            reviews = key['data']['presentation']['userProfileContainer']['userProfileReviews']['reviews']
            for review in reviews:
                review_id = review['id']
                rating = review['rating']
                comment = review['comments']
                reviewer = review['reviewer']['smartName']
                listing_id = review['listing']['id']
                date = parse_datetime(review['createdAt'])  # Convert to datetime object
                extracted_review_data.append({
                    'review_id': review_id,
                    'rating': rating,
                    'comment': comment,
                    'reviewer': reviewer,
                    'listing_id': listing_id,
                    'date': date
                })

        # Save to database
        user = request.user
        for review_data in extracted_review_data:
            Review.objects.update_or_create(
                id=review_data['review_id'],
                defaults={
                    'rating': review_data['rating'],
                    'comment': review_data['comment'],
                    'reviewer': review_data['reviewer'],
                    'listing_id': review_data['listing_id'],
                    'date': review_data['date'],
                    'reviewee': user
                }
            )
        return JsonResponse({'count': len(extracted_review_data)})


class ReviewListCreate(generics.ListCreateAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Review.objects.filter(reviewee=user)
    
    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(reviewee=self.request.user)
        else:
            print(serializer.errors)

class ReviewDelete(generics.DestroyAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Review.objects.filter(reviewee=user)


class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
