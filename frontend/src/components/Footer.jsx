import React from "react";
import { motion } from "framer-motion";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { Link } from "react-router-dom";
import "../styles/components/Footer.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: "Product",
      links: [
        { name: "Features", url: "/features" },
        { name: "Pricing", url: "/pricing" },
        { name: "API", url: "/api" },
      ],
    },
    {
      title: "Resources",
      links: [
        { name: "Documentation", url: "/docs" },
        { name: "Community", url: "/community" },
        { name: "Contact", url: "/contact" },
      ],
    },
  ];

  const socialLinks = [
    { icon: <FaGithub />, url: "https://github.com/AtharvaNarkhede1/" },
    { icon: <FaLinkedin />, url: "https://linkedin.com/in/AtharvaNarkhede" },
  ];

  return (
    <footer className="footer">
      <div className="footer-glow" />
      <div className="footer-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="footer-brand"
        >
          <h3 className="footer-logo">
            EXCEL <span>EASY</span>
          </h3>
          <p className="footer-description">
            Empower your data journey with seamless, modern visualization.
          </p>
          <div className="footer-social">
            {socialLinks.map((social, idx) => (
              <motion.a
                key={idx}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                className="social-icon"
              >
                {social.icon}
              </motion.a>
            ))}
          </div>
        </motion.div>
        <div className="footer-links">
          {footerLinks.map((section, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="footer-section"
            >
              <h4 className="footer-heading">{section.title}</h4>
              <ul className="footer-list">
                {section.links.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    <Link to={link.url} className="footer-link">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="footer-bottom"
      >
        <div className="footer-bottom-container">
          <p>© {currentYear} EXCEL EASY. All rights reserved.</p>
          <div className="footer-legal">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
          </div>
        </div>
      </motion.div>
    </footer>
  );
};

export default Footer;