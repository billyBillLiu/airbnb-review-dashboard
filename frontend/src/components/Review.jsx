import React from "react";
import "../styles/Review.css";

function Review({ review, onDelete }) {
  return (
    <div className="review-container">
      <p className="review-title">
        {review.reviewer} ({review.rating} Stars)
      </p>
      <p className="review-content">{review.comment}</p>
      <p className="review-date">{review.date}</p>
      <button className="delete-button" onClick={() => onDelete(review.id)}>
        Delete
      </button>
    </div>
  );
}

export default Review;
