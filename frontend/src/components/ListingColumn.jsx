import { useState } from "react";
import api from "../api";
import Review from "../components/Review";
import save_icon from "../assets/save_icon.png";
import edit_icon from "../assets/edit_icon.png";
import "../styles/ListingColumn.css";

function ListingColumn({ reviews, onDelete, refreshReviews }) {
  const listing = reviews[0].listing ? reviews[0].listing : null;

  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(listing ? listing.name : "");
  const [isDropdownActive, setIsDropdownActive] = useState(false); // State to manage dropdown visibility

  const handleUpdateListing = (id, name) => {
    api
      .patch(`/api/listings/${id}/update/`, {
        name: name,
      })
      .then((res) => {
        if (res.status !== 200) alert("Failed to Update Listing");
        refreshReviews();
      })
      .catch((err) => alert(`Error While Updating Listing: \n${err}`));
  };

  const handleNameChange = (e) => {
    setNewName(e.target.value);
  };

  const handleSaveButtonClick = async (e) => {
    e.preventDefault();
    await handleUpdateListing(listing.id, newName);
    setIsEditing(false);
  };

  const handleEditButtonClick = (e) => {
    e.preventDefault();
    setIsEditing(true);
  };

  const handleBlur = (e) => {
    if (!e.relatedTarget || e.relatedTarget.type !== "submit") {
      setIsEditing(false);
    }
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
                  onBlur={handleBlur}
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
        </form>
        {listing && (
          <div className={`dropdown-menu ${isDropdownActive ? "active" : ""}`}>
            {isEditing ? (
              <button className="edit-listing-button save" type="submit">
                <img className="edit-icon-image" src={save_icon} alt="Save" />
              </button>
            ) : (
              <button
                className="edit-listing-button"
                onClick={handleEditButtonClick}
              >
                <img className="edit-icon-image" src={edit_icon} alt="Edit" />
              </button>
            )}
          </div>
        )}
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
