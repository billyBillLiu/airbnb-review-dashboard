from django.db.models.signals import post_delete
from django.dispatch import receiver
from .models import Review, Listing

@receiver(post_delete, sender=Review)
def delete_listing_if_no_reviews(sender, instance, **kwargs):
    listing = instance.listing
    if listing and not Review.objects.filter(listing=listing).exists():
        listing.delete()