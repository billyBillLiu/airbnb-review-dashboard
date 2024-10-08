import { React, useState } from "react";
import api from "../api";
import save_icon from "../assets/save_icon.png";
import edit_icon from "../assets/edit_icon.png";
import pie_icon from "../assets/pie_icon.png";
import "../styles/Listing.css";

function Listing({ listing, onShowOverview, refreshReviews }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(listing ? listing.name : "");
  const [isDropdownActive, setIsDropdownActive] = useState(false);

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
    <div>
      <div
        className="listing-overlay"
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
                  maxLength={50}
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
                    </a>
                  ) : (
                    <p>
                      <b>NO LISTING DETECTED</b>
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
          {listing && (
            <div
              className={`listing-button-menu ${
                isDropdownActive ? "active" : ""
              }`}
            >
              <button
                className="listing-button info"
                type="button"
                onClick={onShowOverview}
              >
                <img
                  className="button-icon"
                  src={pie_icon}
                  alt="Show Overview"
                />
              </button>

              {isEditing ? (
                <button className="listing-button save" type="submit">
                  <img className="button-icon" src={save_icon} alt="Save" />
                </button>
              ) : (
                <button
                  className="listing-button edit"
                  onClick={handleEditButtonClick}
                >
                  <img className="button-icon" src={edit_icon} alt="Edit" />
                </button>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default Listing;
