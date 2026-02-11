import React, { useState } from "react";
import "./VendorRegistration.css";
import { auth, db } from "../firebase";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification
} from "firebase/auth";
import { ref, set } from "firebase/database";
import { useNavigate } from "react-router-dom";

const VendorRegistration = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [category, setCategory] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const userCredential =
        await createUserWithEmailAndPassword(auth, email, password);

      const user = userCredential.user;

      // ✅ Store vendor data in Realtime DB
      await set(ref(db, "users/" + user.uid), {
        name: name,
        email: email,
        role: "vendor",
        category: category
      });

      // ✅ Send verification email (same as user registration)
      await sendEmailVerification(user);

      alert("Verification email sent. Please verify your email before login.");

      navigate("/login");

    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="vendor-register-container">
      <div className="vendor-register-card">

        <h2>Vendor Registration</h2>

        <form onSubmit={handleRegister} className="vendor-form">

          <input
            type="text"
            placeholder="Vendor Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Vendor Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select Vendor Category</option>
            <option value="Catering">Catering</option>
            <option value="Florist">Florist</option>
            <option value="Decoration">Decoration</option>
            <option value="Lighting">Lighting</option>
            <option value="Photography">Photography</option>
          </select>

          <button type="submit">Sign Up</button>
        </form>

        <p className="login-link" onClick={() => navigate("/login")}>
          Already registered? Login
        </p>

      </div>
    </div>
  );
};

export default VendorRegistration;
