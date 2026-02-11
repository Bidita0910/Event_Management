import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword,sendEmailVerification } from "firebase/auth";
import { ref, set } from "firebase/database";
import "./AdminRegistration.css";

const ADMIN_SECRET_KEY = "EXAM_ADMIN_2026"; // change this

const AdminRegistration = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    secretKey: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.secretKey !== ADMIN_SECRET_KEY) {
      alert("Invalid Admin Secret Key");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      // 1️⃣ Create Auth account
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const user = userCredential.user;

      // 2️⃣ Store admin data in DB
      await set(ref(db, `admins/${user.uid}`), {
        username: formData.username,
        email: formData.email,
        role: "admin",
        createdAt: new Date().toISOString()
      });

      // 3️⃣ Send verification email
      await sendEmailVerification(user);

      alert("Admin registered successfully. Verification email sent.");

      navigate("/login");

    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="admin-register-container">
      <div className="admin-register-card">

        <h2 className="title">Admin Registration</h2>
        <p className="subtitle">Restricted Access</p>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            name="username"
            placeholder="Admin Username"
            value={formData.username}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Admin Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="secretKey"
            placeholder="Admin Secret Key"
            value={formData.secretKey}
            onChange={handleChange}
            required
          />

          <button type="submit">Register</button>
        </form>

      </div>
    </div>
  );
};

export default AdminRegistration;
