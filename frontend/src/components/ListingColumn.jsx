import React from "react";
import Review from "../components/Review";
import api from "../api";
import "../styles/ListingColumn.css";

function ListingColumn({ reviews }) {
  const deleteReview = (id) => {
    api
      .delete(`/api/reviews/delete/${id}/`)
      .then((res) => {
        if (res.status !== 204) alert("Failed to delete review");
        getReviews();
      })
      .catch((err) => alert(`Error While Deleting Review: \n${err}`));
  };

  return (
    <div className="listing-column">
      <h2>
        Listing:{" "}
        {reviews[0].listing ? reviews[0].listing.listing_id : "NO LISTING"}
      </h2>
      <div className="group-container">
        {reviews.map((review) => (
          <Review review={review} onDelete={deleteReview} key={review.id} />
        ))}
      </div>
    </div>
  );
}

export default ListingColumn;
