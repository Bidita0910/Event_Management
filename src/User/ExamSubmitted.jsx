import React from "react";
import { useNavigate } from "react-router-dom";
import "./ExamSubmitted.css";

const ExamSubmitted = () => {
  const navigate = useNavigate();

  return (
    <div className="submitted-container">
      <div className="submitted-card">

        <div className="success-icon">✓</div>

        <h2>Assessment Submitted Successfully</h2>

        <p>
          Thank you for taking this assessment.
          <br />
          Your responses have been recorded successfully.
        </p>

        <p className="note">
          You may safely close this window now.
        </p>

        <button
          className="dashboard-btn"
          onClick={() => navigate("/user-dashboard")}
        >
          Go to Dashboard
        </button>

      </div>
    </div>
  );
};

export default ExamSubmitted;
