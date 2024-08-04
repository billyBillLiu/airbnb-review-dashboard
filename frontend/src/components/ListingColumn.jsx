import React from "react";
import Review from "../components/Review";
import "../styles/ListingColumn.css";

function ListingColumn({ reviews, onDelete }) {
  const listing = reviews[0].listing ? reviews[0].listing : null;
  return (
    <div className="listing-column">
      <div className="listing-container">
        <a
          href={
            listing ? `https://www.airbnb.com/rooms/${listing.listing_id}` : "#"
          }
          target="_blank"
        >
          <img src={listing ? listing.image : null} />
        </a>
        <p>
          <b>{listing ? listing.name : "NO LISTING"}</b>
        </p>
        <p> ({reviews.length})</p>
      </div>
      <div className="reviews-container">
        {reviews.map((review) => (
          <Review review={review} onDelete={onDelete} key={review.id} />
        ))}
      </div>
    </div>
  );
}

export default ListingColumn;
