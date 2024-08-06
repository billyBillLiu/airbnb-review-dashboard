import { useState } from "react";
import Review from "../components/Review";
import "../styles/ListingColumn.css";
import api from "../api";

function ListingColumn({ reviews, onDelete, onUpdateListing }) {
  const listing = reviews[0].listing ? reviews[0].listing : null;

  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(listing ? listing.name : "");

  const handleTitleChange = (e) => {
    setNewName(e.target.value);
  };

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
        <div>
          {isEditing ? (
            <input
              type="text"
              value={newName}
              onChange={handleTitleChange}
              onBlur={() => {
                setIsEditing(false);
                onUpdateListing(listing.id, newName);
              }}
              autoFocus
            />
          ) : (
            <p onClick={() => setIsEditing(true)}>
              <b>{listing ? listing.name : "NO LISTING"}</b>
            </p>
          )}
        </div>
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
