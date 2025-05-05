import React from "react";
import { useNavigate } from "react-router-dom";
import "./NavBar.css";

function Dropdown() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/sign-in");
  }
  
  return (
    <div className="dropdown">
        <button className="dropbtn">☰ </button>
        <div className="dropdown-content">
            <a href="/request">Request</a>
            <a href="/booking">Booking</a>
            <a href="/home">History</a>
            <a onClick={handleLogout}>Sign Out</a>
        </div>
    </div>
  );
}

export default Dropdown;