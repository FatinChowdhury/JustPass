import { React, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Landing.css";

const Landing = () => {
  const [link, setLink] = useState("");
  const navigate = useNavigate();
  return (
    <div className="layout-container">
      <div className="main-content">
        <div className="left-panel">
          <img src="/logo.png" alt="Logo" className="logo-image" />
        </div>
        <div className="right-panel">
          <h1>myBookings</h1>
          <p>Book your first meeting now!</p>
          <a className="start-button" href="/home">
            Home
          </a>
          <p>
            Need to login?{" "}
            <a className="login-here" href="/sign-in">
              Login
            </a>
          </p>
          <p>Have a Booking URL?</p>
        </div>
      </div>
    </div>
  );
};

export default Landing;