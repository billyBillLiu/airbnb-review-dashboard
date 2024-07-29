import { useState, useEffect } from "react";
import api from "../api";
import Review from "../components/Review";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";

function Home() {
  const [reviews, setReviews] = useState([]);
  const [file, setFile] = useState(null);
  const [sortCriteria, setSortCriteria] = useState("newest");
  const [sortedReviews, setSortedReviews] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getReviews();
  }, []);

  useEffect(() => {
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
    setSortedReviews(sorted);
  }, [reviews, sortCriteria]);

  const getReviews = () => {
    api
      .get("/api/reviews/")
      .then((res) => res.data)
      .then((data) => {
        setReviews(data);
        console.log(data);
      })
      .catch((err) => alert(`Error While Getting Reviews: \n${err}`));
  };

  const deleteReview = (id) => {
    api
      .delete(`/api/reviews/delete/${id}/`)
      .then((res) => {
        if (res.status !== 204) alert("Failed to delete review");
        getReviews();
      })
      .catch((err) => alert(`Error While Deleting Review: \n${err}`));
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }
    const formData = new FormData();
    formData.append("har-file", file);
    api
      .post("/api/reviews/process-har-file/", formData)
      .then((res) => {
        if (res.status !== 200) alert("Failed to Process File");
        getReviews();
      })
      .catch((err) => alert(`Error While Processing File: \n${err}`));
  };

  const handleLogout = () => {
    navigate("/logout");
  };

  const handleSortChange = (e) => {
    setSortCriteria(e.target.value);
  };

  return (
    <div className="container">
      <div className="header-section">
        <h1>{reviews.length} Reviews Displayed:</h1>
        <div>
          <h2>Sort by: </h2>
          <select onChange={handleSortChange} value={sortCriteria}>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="highest">Highest Rating</option>
            <option value="lowest">Lowest Rating</option>
          </select>
        </div>
      </div>
      <div className="reviews-section">
        {sortedReviews.map((review) => (
          <Review review={review} onDelete={deleteReview} key={review.id} />
        ))}
      </div>
      <div className="footer-section">
        <div>
          <h2>Upload The .HAR File Retrieved From Your Airbnb Reviews Page</h2>
          <input type="file" accept=".har" onChange={handleFileChange} />
          <button onClick={handleUpload}>Upload</button>
        </div>
        <button onClick={handleLogout}>Log Out</button>
      </div>
    </div>
  );
}

export default Home;
