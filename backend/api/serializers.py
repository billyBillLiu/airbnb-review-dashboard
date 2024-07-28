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
        fields = ['listing_id', 'name', 'owner']
        extra_kwargs = {
            'listing_id': {'read_only': True},
            'owner': {'read_only': True}
        }
     
class ReviewSerializer(serializers.ModelSerializer):
    listing = ListingSerializer(read_only=True)
    class Meta:
        model = Review
        fields = ["id", "rating", "comment", "reviewer", "listing", "date", "reviewee"]
        extra_kwargs = {"reviewee": {"read_only": True}}

