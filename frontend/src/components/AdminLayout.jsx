import React, { useState } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { FiGrid, FiUsers, FiFileText, FiLogOut, FiChevronLeft, FiChevronRight, FiShield } from "react-icons/fi";
import "../styles/components/AdminLayout.css";

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/auth");
    window.location.reload();
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const sidebarVariants = {
    open: { width: "260px" },
    closed: { width: "76px" }
  };

  const navItems = [
    { to: "/admin/dashboard", icon: <FiGrid />, text: "Dashboard" },
    { to: "/admin/users", icon: <FiUsers />, text: "Users" },
    { to: "/admin/files", icon: <FiFileText />, text: "Files" }
  ];

  return (
    <div className="admin-layout">
      <motion.aside
        className="sidebar"
        initial={false}
        animate={sidebarOpen ? "open" : "closed"}
        variants={sidebarVariants}
        transition={{ type: "spring", damping: 22, stiffness: 180 }}
      >
        <div className="sidebar-brand">
          <div className="brand-logo">
            <FiShield size={28} />
          </div>
          {sidebarOpen && <h2 className="brand-title">Admin Console</h2>}
          <button className="toggle-btn" onClick={toggleSidebar}>
            {sidebarOpen ? <FiChevronLeft size={22} /> : <FiChevronRight size={22} />}
          </button>
        </div>

        <nav className="sidebar-nav">
          <ul>
            {navItems.map((item) => (
              <li
                key={item.to}
                className={`nav-item ${location.pathname === item.to ? "active" : ""}`}
              >
                <Link to={item.to} className="nav-link">
                  <span className="nav-icon">{item.icon}</span>
                  {sidebarOpen && <span className="nav-text">{item.text}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            <FiLogOut size={21} />
            {sidebarOpen && <span className="nav-text">Logout</span>}
          </button>
        </div>
      </motion.aside>

      <main className={`main-content ${sidebarOpen ? "" : "collapsed"}`}>
        <div className="content-container">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;