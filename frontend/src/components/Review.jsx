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
    desire: "😕",
    love: "💕",
    annoyance: "😒",
    excitement: "🎉",
    pride: "💪",
    disappointment: "☹️",
    disgust: "🤢",
    confusion: "🤔",
    curiosity: "🤓",
    sadness: "☹️",
    anger: "😡",
    amusement: "😄",
    fear: "😨",
    surprise: "😮",
    remorse: "🤕",
    nervousness: "😬",
    grief: "😭",
    embarrassment: "🙈",
  };

  const sentimentColorMap = {
    love: "positive",
    admiration: "positive",
    joy: "positive",
    approval: "positive",
    gratitude: "positive",
    excitement: "positive",
    optimism: "positive",
    caring: "positive",
    pride: "positive",
    relief: "positive",
    amusement: "positive",

    curiosity: "neutral",
    realization: "neutral",
    surprise: "neutral",
    neutral: "neutral",
    confusion: "neutral",
    desire: "neutral",

    nervousness: "negative",
    remorse: "negative",
    sadness: "negative",
    embarrassment: "negative",
    grief: "negative",
    fear: "negative",
    disapproval: "negative",
    disappointment: "negative",
    annoyance: "negative",
    disgust: "negative",
    anger: "negative",
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
