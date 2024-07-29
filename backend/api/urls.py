from django.urls import path
from . import views

urlpatterns = [
    path("reviews/", views.ReviewListCreate.as_view(), name="review-list"),
    path("reviews/process-har-file/", views.ProcessHarFile.as_view(), name="process-har-file"),
    path("reviews/delete/<int:pk>/", views.ReviewDelete.as_view(), name="delete-review"),
    path("reviews/delete-all/", views.DeleteAllReviews.as_view(), name="delete-all-reviews"),
    
]