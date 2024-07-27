import { useState, useEffect } from "react";
import api from "../api";
import Note from "../components/Review";
import "../styles/Home.css";

function Home() {
  const [reviews, setReviews] = useState([]);
  const [file, setFile] = useState(null);

  useEffect(() => {
    getReviews();
  }, []);

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

  const deleteReviews = (id) => {
    api
      .delete(`/api/reviews/delete/${id}`)
      .then((res) => {
        if (res.status === 204) alert("Note Deleted");
        else alert("Failed to delete note");
        getReviews();
      })
      .catch((err) => alert(`Error While Deleting Note: \n${err}`));
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

  return (
    <div className="container">
      <h1>Reviews:</h1>
      <div className="reviews-section">
        {reviews.map((review) => (
          <Note review={review} onDelete={deleteReviews} key={review.id} />
        ))}
      </div>
      <div className="upload-section">
        <h2>Upload .Har File</h2>
        <input type="file" accept=".har" onChange={handleFileChange} />
        <button onClick={handleUpload}>Upload</button>
      </div>
    </div>
  );
}

export default Home;
