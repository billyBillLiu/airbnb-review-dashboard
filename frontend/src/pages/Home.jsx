import { useState, useEffect } from "react";
import api from "../api";
import Review from "../components/Review";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";

function Home() {
  const [reviews, setReviews] = useState([]);
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getReviews();
  }, []);

  const getReviews = () => {
    api
      .get("/api/reviews/")
      .then((res) => res.data)
      .then((data) => {
        setReviews(data);
        // console.log(data);
      })
      .catch((err) => alert(`Error While Getting Reviews: \n${err}`));
  };

  const deleteReviews = (id) => {
    api
      .delete(`/api/reviews/delete/${id}/`)
      .then((res) => {
        if (res.status === 204) alert("Review Deleted");
        else alert("Failed to delete review");
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
        if (res.status === 200) alert("Reviews Processed");
        else alert("Failed to Process File");
        getReviews();
      })
      .catch((err) => alert(`Error While Processing File: \n${err}`));
  };

  const handleLogout = () => {
    navigate("/logout");
  };

  return (
    <div className="container">
      <div className="header-section">
        <h1>Reviews:</h1>
        <button onClick={handleLogout}>Log Out</button>
      </div>
      <div className="reviews-section">
        {reviews.map((review) => (
          <Review review={review} onDelete={deleteReviews} key={review.id} />
        ))}
      </div>
      <div className="footer-section">
        <h2>Upload The .HAR File Retrieved From Your Airbnb Reviews Page</h2>
        <input type="file" accept=".har" onChange={handleFileChange} />
        <button onClick={handleUpload}>Upload</button>
      </div>
    </div>
  );
}

export default Home;
