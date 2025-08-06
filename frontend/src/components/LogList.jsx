import React from "react";
import "../styles/components/LogList.css";
import { FiCheckCircle, FiAlertTriangle, FiXCircle } from "react-icons/fi";

const LogList = ({ logs }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case "success":
        return <FiCheckCircle className="log-status-icon success" />;
      case "error":
        return <FiXCircle className="log-status-icon error" />;
      case "warning":
        return <FiAlertTriangle className="log-status-icon warning" />;
      default:
        return null;
    }
  };

  return (
    <div className="log-list">
      <h4>Recent Activity Logs</h4>
      <div className="log-entries">
        {logs.length === 0 ? (
          <div className="log-empty">
            <i>📭</i>
            <p>No logs available.</p>
          </div>
        ) : (
          logs.map((log, index) => (
            <div key={index} className={`log-entry ${log.new ? "new" : ""}`}>
              <div className="log-meta">
                <div className="log-user">
                  <div className="log-user-avatar">
                    {log.username?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <span className="log-username">{log.username}</span>
                </div>
                <span className="log-timestamp">
                  {new Date(log.timestamp).toLocaleString()}
                </span>
              </div>
              <div className="log-action" data-status={log.status}>
                {getStatusIcon(log.status)}
                <span>{log.action}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LogList;
