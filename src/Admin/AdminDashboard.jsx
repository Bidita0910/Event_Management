import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { ref, get } from "firebase/database";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

import ManageUsers from "./ManageUsers";
import CorrectionRequests from "./CorrectionRequests";
import ManageVendors from "./ManageVendors";
import Results from "./Results";

const AdminDashboard = () => {
  const [adminData, setAdminData] = useState(null);
  const [activeSection, setActiveSection] = useState("dashboard");
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setAdminData(null);
        return;
      }

      try {
        const snapshot = await get(ref(db, `admins/${user.uid}`));

        if (snapshot.exists()) {
          setAdminData(snapshot.val());
        }
      } catch (err) {
        console.error("Admin fetch error:", err);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    if (!window.confirm("Are you sure you want to logout?")) return;
    await signOut(auth);
    navigate("/login");
  };

  return (
    <div className="dashboard-container">

      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="user-info">
          <h3>
            Welcome, {adminData ? adminData.username : "Loading..."}
          </h3>
          <p>Email: {adminData ? adminData.email : ""}</p>
          <span className="admin-badge">ADMIN</span>
        </div>

        <ul className="menu">
          <li
            className={activeSection === "dashboard" ? "active" : ""}
            onClick={() => setActiveSection("dashboard")}
          >
            Dashboard
          </li>

          <li
            className={activeSection === "manage-users" ? "active" : ""}
            onClick={() => setActiveSection("manage-users")}
          >
            Manage Users
          </li>

          <li
            className={activeSection === "manage-vendors" ? "active" : ""}
            onClick={() => setActiveSection("manage-vendors")}
          >
            Manage Vendors
          </li>

          <li
            className={activeSection === "corrections" ? "active" : ""}
            onClick={() => setActiveSection("corrections")}
          >
            Correction Requests
          </li>

          <li
            className={activeSection === "results" ? "active" : ""}
            onClick={() => setActiveSection("results")}
          >
            Results
          </li>

          <li className="logout" onClick={handleLogout}>
            Logout
          </li>
        </ul>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">

        {activeSection === "dashboard" && (
          <h1>Welcome to Admin Dashboard</h1>
        )}

        {activeSection === "manage-users" && <ManageUsers />}

        {activeSection === "manage-vendors" && <ManageVendors />}

        {activeSection === "corrections" && <CorrectionRequests />}

        {activeSection === "results" && <Results />}

      </main>
    </div>
  );
};

export default AdminDashboard;
