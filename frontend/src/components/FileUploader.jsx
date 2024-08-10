import { useState } from "react";
import "../styles/FileUploader.css";
import upload_icon from "../assets/upload_icon.png";
import api from "../api";

function FileUploader({ onUpdate }) {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    setFileName(selectedFile.name);
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
        onUpdate();
      })
      .catch((err) => alert(`Error While Processing File: \n${err}`));
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
        <img className="uploade-icon-image" src={upload_icon} alt="upload" />
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
