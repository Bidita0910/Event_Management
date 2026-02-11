import { db } from "../firebase";
import { ref, set } from "firebase/database";
import React, { useState } from "react";
import "./Registration.css";
import { useNavigate } from "react-router-dom";
import {auth} from "../firebase";
import {createUserWithEmailAndPassword,sendEmailVerification} from "firebase/auth";

const Registration = () => {
  const navigate = useNavigate();

  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    setRegisterData({
      ...registerData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (registerData.password !== registerData.confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      registerData.email,
      registerData.password
    );

    const user = userCredential.user;

    // ✅ STORE USING UID (THIS IS THE FIX)
    await set(ref(db, `users/${user.uid}`), {
      username: registerData.username,
      email: registerData.email
    });

    await sendEmailVerification(user);

    alert("Verification link sent to your email");

  } catch (error) {
    alert(error.message);
  }
};
  return (
    <div className="register-page">
      <div className="register-card">

        <h2 className="register-title">Create Account</h2>
        <p className="register-subtitle">Register to get started</p>

        <form className="register-form" onSubmit={handleSubmit}>

          <div className="input-group">
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={registerData.username}
              onChange={handleChange}
              placeholder="Enter your username"
            />
          </div>

          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={registerData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={registerData.password}
              onChange={handleChange}
              placeholder="Create password"
            />
          </div>

          <div className="input-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={registerData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm password"
            />
          </div>

          <button type="submit" className="register-btn">
            Register
          </button>
        </form>

        <div className="login-redirect">
          <p>
            Already have an account?{" "}
            <span className="login-link" onClick={() => navigate("/login")}>
              Login
            </span>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Registration;
