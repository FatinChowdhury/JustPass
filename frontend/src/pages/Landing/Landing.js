import { React, useState } from "react";
// import { useNavigate } from "react-router-dom";
import "./Landing.css";

const Landing = () => {
  const [link, setLink] = useState("");
  // const navigate = useNavigate();
  return (
    <div className="layout-container">
      <div className="main-content">
        <div className="left-panel">
          <img src="./JustPass_logo.png" alt="Logo" className="logo-image" loading="lazy" />
        </div>
        <div className="right-panel">
          <h1>JustPass</h1>
          <h2><p>Track your grades and pass that class!</p></h2>
          
          <p>
            Need to login?{" "}
            <a className="login-here" href="/sign-in">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Landing;