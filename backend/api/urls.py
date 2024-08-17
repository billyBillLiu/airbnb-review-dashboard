from django.urls import path
from . import views

urlpatterns = [
    path("reviews/", views.CreateReviewList.as_view(), name="review-list"),
    path("reviews/process-har-file/", views.ProcessHarFile.as_view(), name="process-har-file"),
    path("reviews/delete/<int:pk>/", views.DeleteReview.as_view(), name="delete-review"),
    path("reviews/delete-all/", views.DeleteAllReviews.as_view(), name="delete-all-reviews"),
    path("listings/<int:pk>/update/", views.UpdateListingName.as_view(), name='update-listing-name'),
    path("listings/<int:pk>/generate-summary/", views.GenerateListingSummary.as_view(), name="generate-listing-summary"),
]