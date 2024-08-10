import { useState, useEffect } from "react";
import api from "../api";
import ListingColumn from "../components/ListingColumn";
import FileUploader from "../components/FileUploader";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";

function Home() {
  const [allReviews, setAllReviews] = useState([]);
  const [sortedReviews, setSortedReviews] = useState([]);
  const [groupedReviews, setGroupedReviews] = useState({});
  const [sortCriteria, setSortCriteria] = useState("newest");
  const navigate = useNavigate();

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

  const deleteReview = (id) => {
    api
      .delete(`/api/reviews/delete/${id}/`)
      .then((res) => {
        if (res.status !== 204) alert("Failed to delete review");
        setAllReviews((prevReviews) =>
          prevReviews.filter((review) => review.id !== id)
        );
      })
      .catch((err) => alert(`Error While Deleting Review: \n${err}`));
  };

  const deleteAllReviews = () => {
    api
      .delete("/api/reviews/delete-all/")
      .then((res) => {
        if (res.status !== 204) alert("Failed to delete all reviews");
        setAllReviews([]);
      })
      .catch((err) => alert(`Error While Deleting All Reviews:\n${err}`));
  };

  const handleUpdateListing = (id, name) => {
    api
      .patch(`/api/listings/${id}/update/`, {
        name: name,
      })
      .then((res) => {
        if (res.status !== 200) alert("Failed to Update Listing");
        getReviews();
      })
      .catch((err) => alert(`Error While Updating Listing: \n${err}`));
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
            <option value="highest">Highest Rating</option>
            <option value="lowest">Lowest Rating</option>
          </select>
        </h1>
        <div className="header-buttons-div">
          <button className="delete-all-button" onClick={deleteAllReviews}>
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
            onDelete={deleteReview}
            onUpdateListing={handleUpdateListing}
            key={reviews[0].listing ? reviews[0].listing.id : 0}
          />
        ))}
        <FileUploader onUpdate={getReviews} />
      </div>
    </div>
  );
}

export default Home;
