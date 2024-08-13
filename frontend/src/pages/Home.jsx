import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import ListingColumn from "../components/ListingColumn";
import FileUploader from "../components/FileUploader";
import ConfirmationMenu from "../components/reusable/ConfirmationMenu";
import "../styles/Home.css";

function Home() {
  const [allReviews, setAllReviews] = useState([]);
  const [sortedReviews, setSortedReviews] = useState([]);
  const [groupedReviews, setGroupedReviews] = useState({});
  const [sortCriteria, setSortCriteria] = useState("newest");
  const [showConfirmation, setShowConfirmation] = useState(false); // State for showing confirmation
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
    api
      .get("/api/reviews/")
      .then((res) => res.data)
      .then((data) => {
        setAllReviews(data);
        console.log(data);
      })
      .catch((err) => alert(`Error While Getting Reviews: \n${err}`));
  };

  const deleteAllReviews = () => {
    setShowConfirmation(false);
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
        <h1>
          {allReviews.length} Reviews from {Object.keys(groupedReviews).length}{" "}
          Listings Sorted by:
          <select onChange={handleSortChange} value={sortCriteria}>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="highest">Rating ↑</option>
            <option value="lowest">Rating ↓</option>
            <option value="best">Sentiment ↑</option>
            <option value="worst">Sentiment ↓</option>
          </select>
        </h1>
        <div className="header-buttons-div">
          <button
            className="delete-all-button"
            onClick={() => setShowConfirmation(true)}
          >
            CLEAR ALL DATA
          </button>
          <button className="logout-button" onClick={handleLogout}>
            Log Out
          </button>
        </div>
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
      {showConfirmation && (
        <ConfirmationMenu
          message="Are you sure you want to clear all data? This action cannot be undone."
          onConfirm={deleteAllReviews}
          onCancel={() => setShowConfirmation(false)}
        />
      )}
    </div>
  );
}

export default Home;
