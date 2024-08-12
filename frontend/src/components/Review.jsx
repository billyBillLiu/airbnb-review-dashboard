import { React, useState } from "react";
import api from "../api";
import delete_icon from "../assets/delete_icon.png";
import "../styles/Review.css";

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

  const deleteReview = (id) => {
    api
      .delete(`/api/reviews/delete/${id}/`)
      .then((res) => {
        if (res.status !== 204) alert("Failed to delete review");
        onDelete(id);
      })
      .catch((err) => alert(`Error While Deleting Review: \n${err}`));
  };

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
      <p className="review-date">
        {formattedDate} {review.sentiment ? `[${review.sentiment}]` : ""}
      </p>
      <button
        className={`delete-button ${isDropdownActive ? "active" : ""}`}
        onClick={() => deleteReview(review.id)}
      >
        <img className="delete-icon-image" src={delete_icon} alt="Delete" />
      </button>
    </div>
  );
}

export default Review;
