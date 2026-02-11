import React, { useState } from "react";
import { auth } from "./firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import "./ForgotPassword.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();

    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset link sent to your email.");
      setEmail("");
    } catch (error) {
      alert("Email not registered or invalid.");
    }
  };

  return (
    <div className="forgot-container">
      <div className="forgot-card">
        <h2>Forgot Password</h2>

        <form onSubmit={handleReset}>
          <input
            type="email"
            placeholder="Enter registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button type="submit" className="reset-btn">
            Send Reset Link
          </button>
        </form>

        <p className="helper-text">
          We will send a password reset link to your email.
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
