import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import ListingColumn from "../components/ListingColumn";
import FileUploader from "../components/FileUploader";
import ConfirmationMenu from "../components/reusable/ConfirmationMenu";
import LoadingIndicator from "../components/reusable/LoadingIndicator";
import info_icon from "../assets/info_icon.png";
import delete_all_icon from "../assets/delete_all_icon.png";
import logout_icon from "../assets/logout_icon.png";
import menu_icon from "../assets/menu_icon.png";
import up_icon from "../assets/up_icon.png";
import "../styles/Home.css";

function Home() {
  const [allReviews, setAllReviews] = useState([]);
  const [sortedReviews, setSortedReviews] = useState([]);
  const [groupedReviews, setGroupedReviews] = useState({});
  const [sortCriteria, setSortCriteria] = useState("newest");
  const [showHeaderMenu, setShowHeaderMenu] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false); // State for showing confirmation
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const sentimentSortingMap = {
    love: 28,
    admiration: 27,
    joy: 26,
    approval: 25,
    gratitude: 24,
    excitement: 23,
    optimism: 22,
    caring: 21,
    pride: 20,
    relief: 19,
    amusement: 18,

    desire: 17,
    curiosity: 16,
    realization: 15,
    surprise: 14,
    neutral: 13,
    confusion: 12,

    nervousness: 11,
    remorse: 10,
    sadness: 9,
    embarrassment: 8,
    grief: 7,
    fear: 6,
    disapproval: 5,
    disappointment: 4,
    annoyance: 3,
    disgust: 2,
    anger: 1,
  };

  useEffect(() => {
    getReviews();
  }, []);

  useEffect(() => {
    setSortedReviews(sortReviews(allReviews));
  }, [allReviews, sortCriteria]);

  useEffect(() => {
    setGroupedReviews(groupReviews(sortedReviews));
  }, [sortedReviews]);

  const getReviews = () => {
    setLoading(true);
    api
      .get("/api/reviews/")
      .then((res) => res.data)
      .then((data) => {
        setAllReviews(data);
      })
      .catch((err) => alert(`Error While Getting Reviews: \n${err}`))
      .finally(() => setLoading(false));
  };

  const deleteAllReviews = () => {
    setShowDeleteConfirmation(false);
    api
      .delete("/api/reviews/delete-all/")
      .then((res) => {
        if (res.status !== 204) alert("Failed to delete all reviews");
        setAllReviews([]);
      })
      .catch((err) => alert(`Error While Deleting All Reviews:\n${err}`));
  };

  const sortReviews = (reviews) => {
    let sorted = [];
    if (sortCriteria === "newest") {
      sorted = [...reviews].sort((a, b) => new Date(b.date) - new Date(a.date));
    }
    if (sortCriteria === "oldest") {
      sorted = [...reviews].sort((a, b) => new Date(a.date) - new Date(b.date));
    }
    if (sortCriteria === "highest") {
      sorted = [...reviews].sort((a, b) => b.rating - a.rating);
    }
    if (sortCriteria === "lowest") {
      sorted = [...reviews].sort((a, b) => a.rating - b.rating);
    }
    if (sortCriteria === "best") {
      sorted = [...reviews].sort(
        (a, b) =>
          sentimentSortingMap[b.sentiment] - sentimentSortingMap[a.sentiment]
      );
    }
    if (sortCriteria === "worst") {
      sorted = [...reviews].sort(
        (a, b) =>
          sentimentSortingMap[a.sentiment] - sentimentSortingMap[b.sentiment]
      );
    }
    return sorted;
  };

  const groupReviews = () => {
    return sortedReviews.reduce((acc, review) => {
      const listing_id = review.listing
        ? review.listing.listing_id
        : "NO LISTING";
      if (listing_id) {
        if (!acc[listing_id]) {
          acc[listing_id] = [];
        }
        acc[listing_id].push(review);
      }
      return acc;
    }, {});
  };

  const removeSpecificReview = (id) => {
    setAllReviews((prevReviews) =>
      prevReviews.filter((review) => review.id !== id)
    );
  };

  const handleSortChange = (e) => {
    setSortCriteria(e.target.value);
  };

  const handleLogout = () => {
    navigate("/logout");
  };

  return (
    <div className="container">
      <div className="header-section">
        {loading ? (
          <div
            className="header-title"
            style={{ display: "flex", alignItems: "center" }}
          >
            Loading Reviews...
            <LoadingIndicator />
          </div>
        ) : (
          <div className="header-title">
            <b>{allReviews.length} Reviews</b> from{" "}
            <b>{Object.keys(groupedReviews).length} Listings</b> Sorted by:
            <select
              className="sort-selector"
              onChange={handleSortChange}
              value={sortCriteria}
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="highest">Rating ↑</option>
              <option value="lowest">Rating ↓</option>
              <option value="best">Emotion ↑</option>
              <option value="worst">Emotion ↓</option>
            </select>
          </div>
        )}

        <img
          className="menu-button"
          src={menu_icon}
          onClick={() => setShowHeaderMenu(true)}
        />
        {showHeaderMenu && (
          <div className="header-menu">
            <img
              src={up_icon}
              onClick={() => {
                setShowHeaderMenu(false);
              }}
            />
            <img src={info_icon} />
            <img
              src={delete_all_icon}
              onClick={() => setShowDeleteConfirmation(true)}
            />
            <img src={logout_icon} onClick={handleLogout} />
          </div>
        )}
      </div>
      <div className="reviews-section">
        {Object.values(groupedReviews).map((reviews) => (
          <ListingColumn
            reviews={reviews}
            onDelete={removeSpecificReview}
            refreshReviews={getReviews}
            key={reviews[0].listing ? reviews[0].listing.id : 0}
          />
        ))}
        <FileUploader refreshReviews={getReviews} />
      </div>
      {showDeleteConfirmation && (
        <ConfirmationMenu
          message="Are you sure you want to DELETE all data? This CANNOT be undone."
          onConfirm={deleteAllReviews}
          onCancel={() => setShowDeleteConfirmation(false)}
        />
      )}
    </div>
  );
}

export default Home;
