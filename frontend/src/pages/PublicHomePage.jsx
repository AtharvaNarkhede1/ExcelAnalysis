import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FiUpload, FiBarChart2, FiLock, FiArrowRight, FiStar } from "react-icons/fi";
import Footer from "../components/Footer";
import "../styles/pages/PublicHomePage.css";

const PublicHomePage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: FiUpload,
      title: "Easy Upload",
      desc: "Drag & drop Excel files for instant processing with smart data detection"
    },
    {
      icon: FiBarChart2,
      title: "Dynamic Visuals",
      desc: "Interactive 2D charts and immersive 3D models of your data"
    },
    {
      icon: FiLock,
      title: "Secure",
      desc: "Enterprise-grade security with end-to-end encrypted data storage"
    }
  ];

  return (
    <div className="public-homepage">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="hero-section"
      >
        {/* Background Elements */}
        <div className="hero-background">
          <div className="bg-blur bg-blur-1"></div>
          <div className="bg-blur bg-blur-2"></div>
        </div>

        <div className="hero-container">
          <div className="hero-grid">
            <div className="hero-content">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="hero-badge"
              >
                <FiStar className="badge-icon" />
                AI-Powered Analytics
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="hero-title"
              >
                Transform{" "}
                <span className="text-gradient">Data</span>{" "}
                Into Insights
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="hero-description"
              >
                Visualize your spreadsheets in stunning 2D/3D formats with our AI-powered analyzer. 
                Turn complex data into beautiful, interactive visualizations in seconds.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="hero-buttons"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary"
                  onClick={() => navigate("/auth")}
                >
                  Get Started
                  <FiArrowRight className="btn-icon" />
                </motion.button>
              </motion.div>
            </div>

            {/* Hero Graphic */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="hero-graphic"
            >
              <div className="data-cube-container">
                <motion.div
                  animate={{ 
                    rotateY: [0, 360],
                    rotateX: [0, 15, 0]
                  }}
                  transition={{ 
                    duration: 20, 
                    repeat: Infinity, 
                    ease: "linear" 
                  }}
                  className="data-cube"
                >
                  <div className="cube-face cube-face-1"></div>
                  <div className="cube-face cube-face-2"></div>
                  <div className="cube-face cube-face-3"></div>
                </motion.div>

                {/* Floating elements */}
                <motion.div
                  animate={{ y: [-10, 10, -10] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="floating-element floating-1"
                ></motion.div>
                <motion.div
                  animate={{ y: [10, -10, 10] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="floating-element floating-2"
                ></motion.div>
                <motion.div
                  animate={{ y: [-5, 15, -5] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                  className="floating-element floating-3"
                ></motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        className="features-section"
      >
        <div className="features-container">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="features-header"
          >
            <h2>Powerful Features</h2>
            <p>Everything you need to transform your data into meaningful insights</p>
          </motion.div>

          <div className="features-grid">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="feature-card"
              >
                <div className="feature-icon">
                  <feature.icon size={24} />
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="cta-section"
      >
        <div className="cta-container">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="cta-content"
          >
            <h3>Ready to transform your data?</h3>
            <p>
              Join thousands of users who are already creating stunning visualizations from their spreadsheets.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="cta-button"
              onClick={() => navigate("/auth")}
            >
              Start Free Trial
              <FiArrowRight className="btn-icon" />
            </motion.button>
          </motion.div>
        </div>
      </motion.section>

      <Footer />
    </div>
  );
};

export default PublicHomePage;
