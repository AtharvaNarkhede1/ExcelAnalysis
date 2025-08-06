import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import FileCard from "../components/FileCard";
import "../styles/pages/FileListPage.css";
import { toast } from "react-toastify";
import { FiSearch, FiFolder, FiX } from "react-icons/fi";
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const FileListPage = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${BASE_URL}/api/admin/files`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFiles(res.data.files);
      setLoading(false);
    } catch {
      toast.error("Failed to fetch files");
      setLoading(false);
    }
  };

  const handleDownload = async (fileId, fileName) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${BASE_URL}/api/admin/files/${fileId}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      toast.error("Failed to download file");
    }
  };

  const handleDelete = async (fileId) => {
    toast.info("Deleting file...");
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${BASE_URL}/api/admin/files/${fileId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFiles(files.filter((file) => file._id !== fileId));
      toast.success("File deleted successfully");
      if (selectedFile && selectedFile._id === fileId) setSelectedFile(null);
    } catch {
      toast.error("Failed to delete file");
    }
  };

  const handlePreview = (file) => {
    setSelectedFile(file);
  };

  const handleClosePreview = () => {
    setSelectedFile(null);
  };

  const filteredFiles = files.filter(
    (file) =>
      file.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (file.owner?.username &&
        file.owner.username.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.06,
        duration: 0.34,
        ease: "easeOut",
      },
    }),
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="files-container">
      <motion.div
        className="files-header"
        initial={{ opacity: 0, y: -18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <h2><span className="header-icon"><FiFolder /></span> File Management</h2>
        <div className="search-bar">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by file or owner..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </motion.div>

      <div className="files-grid">
        {filteredFiles.length > 0 ? (
          filteredFiles.map((file, index) => (
            <FileCard
              key={file._id}
              file={file}
              index={index}
              variants={itemVariants}
              onDownload={handleDownload}
              onDelete={handleDelete}
              onClick={() => handlePreview(file)}
            />
          ))
        ) : (
          <motion.div
            className="empty-state"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.36 }}
          >
            <FiFolder className="empty-icon" />
            <p>No files found</p>
          </motion.div>
        )}
      </div>

      {selectedFile && selectedFile.data?.length > 0 && (
        <motion.div
          className="file-preview-modal"
          initial={{ opacity: 0, scale: 0.86, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          <div className="preview-header">
            <h4>Preview: {selectedFile.fileName}</h4>
            <button onClick={handleClosePreview} className="close-button">
              <FiX size={20} />
            </button>
          </div>
          <div className="preview-table-wrapper">
            <table>
              <thead>
                <tr>
                  {Object.keys(selectedFile.data[0]).map((header, idx) => (
                    <th key={idx}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {selectedFile.data.slice(0, 10).map((row, idx) => (
                  <tr key={idx}>
                    {Object.values(row).map((cell, cIdx) => (
                      <td key={cIdx}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default FileListPage;