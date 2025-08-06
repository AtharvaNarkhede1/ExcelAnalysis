import React from "react";
import Auth from "../components/Auth";
import Footer from "../components/Footer";
import Squares from "../components/Squares";
import "../styles/pages/AuthPage.css";

const AuthPage = ({ setToken, setRole }) => {
  return (
    <div className="auth-page-container">
      
      <Auth setToken={setToken} setRole={setRole} />
      <Footer />
    </div>
  );
};

export default AuthPage;
