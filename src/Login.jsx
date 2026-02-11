import { db } from "./firebase";
import { ref, get } from "firebase/database";
import React, { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { auth } from "./firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

const Login = () => {
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    username: "",
    password: ""
  });

  const handleChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 1️⃣ Authenticate user
      const userCredential = await signInWithEmailAndPassword(
        auth,
        loginData.username, // email
        loginData.password
      );

      const user = userCredential.user;

      // 2️⃣ Check email verification
      if (!user.emailVerified) {
        alert("Please verify your email before logging in.");
        return;
      }

      const uid = user.uid;

      // 3️⃣ Check ADMIN role
      const adminRef = ref(db, `admins/${uid}`);
      const adminSnap = await get(adminRef);

      if (adminSnap.exists()) {
        alert("Admin login successful");
        navigate("/admin-dashboard");
        return;
      }

      // 4️⃣ Check USER / VENDOR role
      const userRef = ref(db, `users/${uid}`);
      const userSnap = await get(userRef);

      if (userSnap.exists()) {

        const userData = userSnap.val();

        if (userData.role === "vendor") {
          alert("Vendor login successful");
          navigate("/vendor-dashboard");
          return;
        }

        if (userData.role === "user") {
          alert("User login successful");
          navigate("/dashboard");
          return;
        }
      }


      // 5️⃣ If neither admin nor user
      alert("Access denied. Account not authorized.");
    } catch (error) {
      alert("Invalid email or password");
    }
  };


  return (
    <div className="login-page">
      <div className="login-card">

        <h2 className="login-title">Welcome Back</h2>
        <p className="login-subtitle">Login to continue</p>

        <form className="login-form" onSubmit={handleSubmit}>

          <div className="input-group">
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={loginData.username}
              onChange={handleChange}
              placeholder="Enter your username"
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={loginData.password}
              onChange={handleChange}
              placeholder="Enter your password"
            />
          </div>

          <div className="login-options">
            <span className="forgot-password" onClick={() => navigate("/forgot-password")}>Forgot Password?</span>
          </div>

          <button type="submit" className="login-btn">
            Login
          </button>
        </form>

        <div className="register-section">
          <p>Don't have an account?</p>
          {/* <span className="register-link" onClick={() => navigate("/register")}>
              Register
            </span> */}
          <button onClick={() => navigate("/register")}>
            Register as User
          </button>
          <button onClick={() => navigate("/vendor-register")}>
            Register as Vendor
          </button>
        </div>

      </div>
    </div>
  );
};

export default Login;
