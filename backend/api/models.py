from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Review(models.Model):
    id = models.BigIntegerField(primary_key=True)
    rating = models.IntegerField()
    comment = models.TextField()
    reviewer = models.CharField(max_length=255)
    listing_id = models.IntegerField()
    date = models.DateTimeField()
    reviewee = models.ForeignKey(User, on_delete=models.CASCADE, related_name="reviews")

    def __str__(self):
        return f"{self.reviewer_name} - {self.rating} stars - {self.comment}"