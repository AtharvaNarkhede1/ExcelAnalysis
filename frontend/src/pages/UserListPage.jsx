import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiFile, 
  FiDownload, 
  FiTrash2, 
  FiEye, 
  FiX, 
  FiCalendar, 
  FiDatabase,
  FiLoader,
  FiAlertCircle,
  FiFileText
} from "react-icons/fi";
import "../styles/components/UserFileList.css";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const UserFileList = ({ refreshFlag }) => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloadingId, setDownloadingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const fetchUserFiles = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${BASE_URL}/api/history`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFiles(res.data.files);
    } catch (err) {
      setError("Failed to fetch files.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserFiles();
  }, [refreshFlag]);

  const handleFileClick = (file) => {
    setSelectedFile(file);
  };

  const handleCloseTable = () => {
    setSelectedFile(null);
  };

  const handleDownload = async (fileId, fileName) => {
    try {
      setDownloadingId(fileId);
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:5000/api/download/${fileId}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      alert("Download failed. Please try again.");
    } finally {
      setDownloadingId(null);
    }
  };

  const handleDelete = async (fileId) => {
    if (!window.confirm("Are you sure you want to delete this file?")) return;
    try {
      setDeletingId(fileId);
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/files/${fileId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("File deleted successfully.");
      fetchUserFiles();
      if (selectedFile && selectedFile._id === fileId) setSelectedFile(null);
    } catch {
      alert("Failed to delete file.");
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFileExtension = (fileName) => {
    return fileName.split('.').pop().toUpperCase();
  };

  const getRowCount = (file) => {
    return file.data ? file.data.length : 0;
  };

  if (loading) {
    return (
      <div className="user-file-list-container">
        <div className="section-header">
          <div className="header-icon">
            <FiFileText size={24} />
          </div>
          <div className="header-content">
            <h3>Your Uploaded Files</h3>
            <p>Manage and view your data files</p>
          </div>
        </div>
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading your files...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="user-file-list-container">
        <div className="section-header">
          <div className="header-icon">
            <FiFileText size={24} />
          </div>
          <div className="header-content">
            <h3>Your Uploaded Files</h3>
            <p>Manage and view your data files</p>
          </div>
        </div>
        <div className="error-state">
          <FiAlertCircle size={48} />
          <h4>Error Loading Files</h4>
          <p>{error}</p>
          <button className="retry-button" onClick={fetchUserFiles}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="user-file-list-container">
      <div className="section-header">
        <div className="header-icon">
          <FiFileText size={24} />
        </div>
        <div className="header-content">
          <h3>Your Uploaded Files</h3>
          <p>Manage and view your data files</p>
        </div>
        <div className="files-count">
          <span>{files.length} {files.length === 1 ? 'file' : 'files'}</span>
        </div>
      </div>

      {files.length === 0 ? (
        <div className="empty-state">
          <FiFile size={48} />
          <h4>No Files Yet</h4>
          <p>Upload your first Excel file to get started with data visualization</p>
        </div>
      ) : (
        <div className="file-list">
          <AnimatePresence>
            {files.map((file, index) => (
              <motion.div
                key={file._id}
                className={`file-item ${selectedFile?._id === file._id ? "active" : ""}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                onClick={() => handleFileClick(file)}
              >
                <div className="file-main-content">
                  <div className="file-icon">
                    <FiFile size={20} />
                    <span className="file-extension">{getFileExtension(file.fileName)}</span>
                  </div>
                  
                  <div className="file-info">
                    <h4 className="file-name">{file.fileName}</h4>
                    <div className="file-meta">
                      <span className="file-date">
                        <FiCalendar size={14} />
                        {formatDate(file.uploadedAt || new Date())}
                      </span>
                      <span className="file-rows">
                        <FiDatabase size={14} />
                        {getRowCount(file)} rows
                      </span>
                    </div>
                  </div>
                </div>

                <div className="file-actions">
                  <motion.button
                    className="file-action-btn view"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFileClick(file);
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    title="View Data"
                  >
                    <FiEye size={16} />
                  </motion.button>
                  
                  <motion.button
                    className="file-action-btn download"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(file._id, file.fileName);
                    }}
                    disabled={downloadingId === file._id}
                    whileHover={{ scale: downloadingId === file._id ? 1 : 1.05 }}
                    whileTap={{ scale: downloadingId === file._id ? 1 : 0.95 }}
                    title="Download File"
                  >
                    {downloadingId === file._id ? (
                      <FiLoader size={16} className="spinning" />
                    ) : (
                      <FiDownload size={16} />
                    )}
                  </motion.button>
                  
                  <motion.button
                    className="file-action-btn delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(file._id);
                    }}
                    disabled={deletingId === file._id}
                    whileHover={{ scale: deletingId === file._id ? 1 : 1.05 }}
                    whileTap={{ scale: deletingId === file._id ? 1 : 0.95 }}
                    title="Delete File"
                  >
                    {deletingId === file._id ? (
                      <FiLoader size={16} className="spinning" />
                    ) : (
                      <FiTrash2 size={16} />
                    )}
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <AnimatePresence>
        {selectedFile?.data?.length > 0 && (
          <motion.div
            className="file-table-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="file-table-container"
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              transition={{ duration: 0.3 }}
            >
              <div className="file-table-header">
                <div className="table-header-content">
                  <div className="table-icon">
                    <FiDatabase size={20} />
                  </div>
                  <div>
                    <h4>Data Preview</h4>
                    <p>{selectedFile.fileName} • {selectedFile.data.length} rows</p>
                  </div>
                </div>
                <button className="close-button" onClick={handleCloseTable}>
                  <FiX size={20} />
                </button>
              </div>
              
              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th className="row-number">#</th>
                      {Object.keys(selectedFile.data[0]).map((header, idx) => (
                        <th key={idx}>{header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {selectedFile.data.slice(0, 100).map((row, idx) => (
                      <motion.tr
                        key={idx}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2, delay: idx * 0.01 }}
                      >
                        <td className="row-number">{idx + 1}</td>
                        {Object.values(row).map((cell, cIdx) => (
                          <td key={cIdx} title={cell}>
                            {String(cell).length > 50 
                              ? `${String(cell).substring(0, 50)}...` 
                              : String(cell)
                            }
                          </td>
                        ))}
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
                {selectedFile.data.length > 100 && (
                  <div className="table-footer">
                    <p>Showing first 100 rows of {selectedFile.data.length} total rows</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserFileList;
