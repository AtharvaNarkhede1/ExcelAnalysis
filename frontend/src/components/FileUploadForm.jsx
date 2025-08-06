import React, { useState } from "react";
import axios from "axios";
import { FiUpload, FiX, FiCheckCircle, FiFile, FiAlertCircle } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/components/FileUploadForm.css";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const FileUploadForm = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const validTypes = [
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ];
      if (!validTypes.includes(selectedFile.type)) {
        setErrorMessage("Please upload a valid Excel file (.xls or .xlsx)");
        return;
      }
      if (selectedFile.size > 5 * 1024 * 1024) {
        setErrorMessage("File size must be less than 5MB");
        return;
      }
      setFile(selectedFile);
      setErrorMessage("");
      setUploadStatus(null);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      const event = { target: { files: [droppedFile] } };
      handleFileChange(event);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setErrorMessage("Please select a file first");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setIsUploading(true);
      setUploadStatus(null);
      setUploadProgress(0);
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${BASE_URL}/api/files/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(progress);
          },
        }
      );
      setUploadStatus("success");
      if (onUploadSuccess) {
        onUploadSuccess(response.data);
      }
    } catch (error) {
      console.error("Upload error:", error);
      setUploadStatus("error");
      setErrorMessage(
        error.response?.data?.message ||
          error.message ||
          "Upload failed. Please try again."
      );
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    setUploadStatus(null);
    setErrorMessage("");
    setUploadProgress(0);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="file-upload-container">
      <motion.div
        className="upload-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="upload-header">
          <div className="header-icon">
            <FiUpload size={28} />
          </div>
          <h2>Upload Excel File</h2>
          <p>Drag and drop your file here or click to browse</p>
          <div className="supported-formats">
            <span>Supported formats: .xls, .xlsx</span>
            <span>Maximum size: 5MB</span>
          </div>
        </div>

        <form onSubmit={handleUpload} className="upload-form">
          <div 
            className={`file-drop-zone ${isDragOver ? 'drag-over' : ''} ${file ? 'has-file' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {!file ? (
              <motion.div 
                className="drop-zone-content"
                initial={{ scale: 1 }}
                animate={{ scale: isDragOver ? 1.05 : 1 }}
                transition={{ duration: 0.2 }}
              >
                <div className="upload-icon">
                  <FiUpload size={48} />
                </div>
                <h3>Drop your Excel file here</h3>
                <p>or</p>
                <label className="browse-button">
                  Browse Files
                  <input
                    type="file"
                    accept=".xlsx, .xls"
                    onChange={handleFileChange}
                    disabled={isUploading}
                    className="file-input"
                  />
                </label>
              </motion.div>
            ) : (
              <motion.div 
                className="selected-file"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="file-info">
                  <div className="file-icon">
                    <FiFile size={24} />
                  </div>
                  <div className="file-details">
                    <span className="file-name">{file.name}</span>
                    <span className="file-size">{formatFileSize(file.size)}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={removeFile}
                  className="remove-file-btn"
                  disabled={isUploading}
                >
                  <FiX size={20} />
                </button>
              </motion.div>
            )}
          </div>

          <AnimatePresence>
            {errorMessage && (
              <motion.div 
                className="error-message"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <FiAlertCircle size={16} />
                <span>{errorMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {isUploading && (
              <motion.div 
                className="upload-progress"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="progress-info">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="progress-bar-container">
                  <motion.div
                    className="progress-bar"
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {uploadStatus === "success" && (
              <motion.div 
                className="success-message"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <FiCheckCircle size={20} />
                <span>File uploaded successfully!</span>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            type="submit"
            className={`upload-button ${!file || isUploading ? 'disabled' : ''}`}
            disabled={!file || isUploading}
            whileHover={{ scale: !file || isUploading ? 1 : 1.02 }}
            whileTap={{ scale: !file || isUploading ? 1 : 0.98 }}
            transition={{ duration: 0.2 }}
          >
            {isUploading ? (
              <>
                <div className="loading-spinner"></div>
                Uploading...
              </>
            ) : (
              <>
                <FiUpload size={18} />
                Upload File
              </>
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default FileUploadForm;
