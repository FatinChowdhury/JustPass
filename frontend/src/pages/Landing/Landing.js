import { React, useState } from "react";
// import { useNavigate } from "react-router-dom";
import "./Landing.css";

const Landing = () => {
  const [link, setLink] = useState("");
  // const navigate = useNavigate();
  
  return (
    <div className="landing-container">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <div className="logo-container">
            <img src="./JustPass_logo.png" alt="JustPass Logo" className="hero-logo" loading="lazy" />
          </div>
          <div className="hero-text">
            <h1 className="hero-title">
              Just<span className="highlight">Pass</span>
            </h1>
            <p className="hero-subtitle">
              Track your grades and pass that class with confidence!
            </p>
            <p className="hero-description">
              Stay on top of your academic journey with our intuitive grade tracking system. 
              Monitor your progress, set goals, and achieve academic success.
            </p>
            <div className="cta-buttons">
              <a href="/sign-in" className="btn btn-primary">
                Get Started
              </a>
              <a href="/sign-in" className="btn btn-secondary">
                Login
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="features-section">
        <div className="container">
          <h2 className="section-title">Why Choose JustPass?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Track Progress</h3>
              <p>Monitor your grades in real-time and see your academic progress at a glance.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Set Goals</h3>
              <p>Define your target grades and get insights on what you need to achieve them.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📈</div>
              <h3>Visualize Data</h3>
              <p>Beautiful charts and graphs to help you understand your academic performance.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="container">
          <p>&copy; 2024 JustPass. Helping students succeed, one grade at a time.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;