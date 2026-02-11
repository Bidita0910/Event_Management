import React from "react";
import "./Home.css";
import examIllustration from "./exam-illustration.png";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">

      <nav className="navbar">
        <div className="logo">YOUR WEBSITE</div>

        <ul className="nav-items">
          <li>Home</li>
          <li>About Us</li>
          <li>Work</li>
          <li>Info</li>
        </ul>

        {/* 👇 Get Started → Login */}
        <button 
          className="nav-btn"
          onClick={() => navigate("/login")}
        >
          Get Started
        </button>
      </nav>

      <section className="hero-section">
        <div className="hero-left">
          <h1>
            Event <br />
            Management System
          </h1>

          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Sed eget libero feugiat, faucibus libero id, scelerisque quam.
          </p>

          <button className="hero-btn">Read More</button>
        </div>

        <div className="hero-right">
          <img src={examIllustration} alt="Online Examination" />
        </div>
      </section>

    </div>
  );
};
export default Home;
