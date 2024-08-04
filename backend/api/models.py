from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Listing(models.Model):
    listing_id = models.CharField(max_length=100)
    name = models.CharField(max_length=51)
    image = models.CharField(max_length=200)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="listings")

    def __str__(self):
        return self.name

class Review(models.Model):
    review_id = models.BigIntegerField()
    rating = models.IntegerField()
    comment = models.TextField()
    reviewer = models.CharField(max_length=50)
    listing = models.ForeignKey(Listing, null=True, on_delete=models.CASCADE)
    date = models.DateTimeField()
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="reviews")

    def __str__(self):
        return f"Review from {self.reviewer} | {self.rating} Stars | {self.comment}"