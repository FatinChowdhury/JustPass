import { React, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Landing.css";

const Landing = () => {
  const [link, setLink] = useState("");
  const navigate = useNavigate();
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      setLink(link);
      try {
        const url = new URL(link);
        navigate(url.pathname);
      } catch (err) {
        navigate(`/booking-details/${link}`);
      }
    }
  };
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
            <a className="login-here" href="/login">
              Login
            </a>
          </p>
          <p>Have a Booking URL?</p>
          <input
            type="text"
            className="input-text"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter Booking ID or URL"
          />
        </div>
      </div>
    </div>
  );
};

export default Landing;