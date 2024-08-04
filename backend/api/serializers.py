from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Review, Listing

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        print(validated_data)
        user = User.objects.create_user(**validated_data)
        return user
    
class ListingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Listing
        fields = ["listing_id", "name", "image", "user"]
        extra_kwargs = {
            'listing_id': {'read_only': True},
            'user': {'read_only': True}
        }
     
class ReviewSerializer(serializers.ModelSerializer):
    listing = ListingSerializer(read_only=True)
    class Meta:
        model = Review
        fields = ["id", "review_id", "rating", "comment", "reviewer", "listing", "date", "user"]
        extra_kwargs = {"user": {"read_only": True}}

