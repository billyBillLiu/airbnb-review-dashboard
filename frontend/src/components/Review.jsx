import { React, useState } from "react";
import api from "../api";
import delete_icon from "../assets/delete_icon.png";
import star_icon from "../assets/star_icon.png";
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

  const sentimentEmojiMap = {
    approval: "👍",
    neutral: "😐",
    admiration: "🤩",
    caring: "❤️",
    optimism: "🌞",
    gratitude: "🙏",
    realization: "💡",
    relief: "🙌",
    joy: "😊",
    disapproval: "👎",
    desire: "😍",
    love: "💕",
    annoyance: "😒",
    excitement: "🎉",
    pride: "💪",
    disappointment: "☹️",
    disgust: "🤢",
    confusion: "🤔",
    curiosity: "🤓",
    sadness: "☹️",
    anger: "😠",
    amusement: "😄",
    fear: "😨",
    surprise: "😮",
    remorse: "🤕",
    nervousness: "😬",
    grief: "😭",
    embarrassment: "🙈",
  };

  const sentimentColorMap = {
    admiration: "positive",
    approval: "positive",
    caring: "positive",
    desire: "positive",
    excitement: "positive",
    gratitude: "positive",
    joy: "positive",
    love: "positive",
    optimism: "positive",
    pride: "positive",
    realization: "positive",
    relief: "positive",
    amusement: "positive",

    anger: "negative",
    annoyance: "negative",
    disapproval: "negative",
    disgust: "negative",
    disappointment: "negative",
    fear: "negative",
    sadness: "negative",
    remorse: "negative",
    grief: "negative",
    embarrassment: "negative",
    nervousness: "negative",

    confusion: "neutral",
    curiosity: "neutral",
    neutral: "neutral",
    surprise: "neutral",
  };

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
      <div
        className={`review-sentiment ${sentimentColorMap[review.sentiment]}`}
      >
        {review.sentiment.toUpperCase()} {sentimentEmojiMap[review.sentiment]}{" "}
      </div>
      <div className="review-title">
        <p>{review.reviewer} </p>
        <p>
          {Array.from({ length: review.rating }, (_, index) => (
            <img key={index} className="star-icon" src={star_icon} />
          ))}
          {Array.from({ length: 5 - review.rating }, (_, index) => (
            <img key={index} className="star-icon blank" src={star_icon} />
          ))}
        </p>
      </div>
      <p className="review-content">{review.comment}</p>
      <p className="review-date">{formattedDate}</p>
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
