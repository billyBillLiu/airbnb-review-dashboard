import { useState } from "react";
import api from "../api";
import LoadingIndicator from "./reusable/LoadingIndicator";
import upload_icon from "../assets/upload_icon.png";
import "../styles/FileUploader.css";

function FileUploader({ refreshReviews }) {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    setFileName(selectedFile.name);
  };

  const handleUpload = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("har-file", file);

    api
      .post("/api/reviews/process-har-file/", formData)
      .then((res) => {
        if (res.status !== 200) alert("Failed to Process File");
        refreshReviews();
      })
      .catch((err) => {
        alert(`Error While Processing File: \n${err}`);
      })
      .finally(() => setLoading(false));
  };

  const clearFile = () => {
    setFile(null);
    setFileName(null);
  };

  return (
    <div className="file-upload-container">
      <form
        className="file-upload-form"
        onClick={() => document.querySelector(".input-field").click()}
      >
        <input
          className="input-field"
          type="file"
          accept=".har"
          onChange={handleFileChange}
          hidden
        />
        {loading ? (
          <LoadingIndicator />
        ) : (
          <img src={upload_icon} alt="upload" />
        )}
        <p className="file-name">
          {file ? `[ ${fileName} ]` : "No File Selected"}
        </p>
      </form>
      {file && (
        <div className="file-buttons-div">
          <button className="upload-file-button" onClick={handleUpload}>
            Upload
          </button>
          <button className="clear-file-button" onClick={clearFile}>
            X
          </button>
        </div>
      )}
    </div>
  );
}

export default FileUploader;
