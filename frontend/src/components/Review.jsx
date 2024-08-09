import { React, useState } from "react";
import "../styles/Review.css";
import delete_icon from "../assets/delete_icon.png";

function Review({ review, onDelete }) {
  const [isDropdownActive, setIsDropdownActive] = useState(false);
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
    <div
      className="review-container"
      onMouseEnter={() => setIsDropdownActive(true)} // Show delete button on hover
      onMouseLeave={() => setIsDropdownActive(false)} // Hide delete button when not hovering
    >
      <div className="review-title">
        <p>{review.reviewer} </p>
        <p>{review.rating}&#11088;</p>
      </div>

      <p className="review-listing">
        {review.listing ? review.listing.name : "NO LISTING DETECTED"}
      </p>
      <p className="review-content">{review.comment}</p>
      <p className="review-date">{formattedDate}</p>
      <button
        className={`delete-button ${isDropdownActive ? "active" : ""}`}
        onClick={() => onDelete(review.id)}
      >
        <img className="delete-image" src={delete_icon} alt="Delete" />
      </button>
    </div>
  );
}

export default Review;
