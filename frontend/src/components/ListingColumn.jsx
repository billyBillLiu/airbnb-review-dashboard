import { useState } from "react";
import Review from "../components/Review";
import "../styles/ListingColumn.css";
import api from "../api";

function ListingColumn({ reviews, onDelete, onUpdateListing }) {
  const listing = reviews[0].listing ? reviews[0].listing : null;

  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(listing ? listing.name : "");
  const [isDropdownActive, setIsDropdownActive] = useState(false); // State to manage dropdown visibility

  const handleNameChange = (e) => {
    setNewName(e.target.value);
  };

  const handleSaveButtonClick = (e) => {
    e.preventDefault();
    setIsEditing(false);
    onUpdateListing(listing.id, newName);
  };

  const handleEditButtonClick = (e) => {
    e.preventDefault();
    setIsEditing(true);
  };

  return (
    <div className="listing-column">
      <div
        className="dropdown"
        onMouseEnter={() => setIsDropdownActive(true)} // Show dropdown on hover
        onMouseLeave={() => setIsDropdownActive(false)} // Hide dropdown when not hovering
      >
        <form onSubmit={handleSaveButtonClick}>
          <div
            className="listing-container"
            style={{
              backgroundImage: listing ? `url(${listing.image})` : "none",
            }}
          >
            <div className="listing-name">
              {isEditing ? (
                <input
                  type="text"
                  value={newName}
                  onChange={handleNameChange}
                  autoFocus
                />
              ) : (
                <div>
                  {listing ? (
                    <a
                      href={`https://www.airbnb.com/rooms/${listing.listing_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <b>{listing.name}</b>
                      <i> ({reviews.length})</i>
                    </a>
                  ) : (
                    <p>
                      <b>NO LISTING DETECTED</b>
                      <i> ({reviews.length})</i>
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className={`dropdown-menu ${isDropdownActive ? "active" : ""}`}>
            {isEditing ? (
              <button className="edit-listing-button" type="submit">
                Save
              </button>
            ) : (
              <button
                className="edit-listing-button"
                onClick={handleEditButtonClick}
              >
                Edit
              </button>
            )}
          </div>
        </form>
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
