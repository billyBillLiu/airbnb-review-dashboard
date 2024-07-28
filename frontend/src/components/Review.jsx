import React from "react";
import "../styles/Review.css";

function Review({ review, onDelete }) {
  console.log("Review object:", review);

  // Formatting Datetime Object into String
  const date = new Date(review.date);
  const options = {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  const formattedDate = date.toLocaleString("en-US", options);

  return (
    <div className="review-container">
      <div className="review-title">
        <p>{review.reviewer} </p>
        <p>{review.rating}&#11088;</p>
      </div>

      <p className="review-listing">{review.listing.name}</p>
      <p className="review-content">{review.comment}</p>
      <p className="review-date">{formattedDate}</p>
      <button className="delete-button" onClick={() => onDelete(review.id)}>
        Delete
      </button>
    </div>
  );
}

export default Review;
