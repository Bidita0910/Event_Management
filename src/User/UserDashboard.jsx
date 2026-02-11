import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { ref, get } from "firebase/database";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

import VendorList from "./VendorList";
import Cart from "./Cart";
import GuestList from "./GuestList";
import Checkout from "./Checkout";
import OrderStatus from "./OrderStatus";

import "./UserDashboard.css";

const UserDashboard = () => {

  const [userData, setUserData] = useState(null);
  const [activeSection, setActiveSection] = useState("dashboard");
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {

      if (!user) return;

      const snapshot = await get(ref(db, `users/${user.uid}`));

      if (snapshot.exists()) {
        setUserData(snapshot.val());
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <div className="dashboard-container">

      {/* ===== SIDEBAR ===== */}
      <aside className="sidebar">
        <div className="user-info">
          <h3>Welcome, {userData?.username}</h3>
          <p>Email: {userData?.email}</p>
        </div>

        <ul className="menu">

          <li
            className={activeSection === "dashboard" ? "active" : ""}
            onClick={() => setActiveSection("dashboard")}
          >
            Dashboard
          </li>

          <li
            className={activeSection === "vendor" ? "active" : ""}
            onClick={() => setActiveSection("vendor")}
          >
            Vendor
          </li>

          <li
            className={activeSection === "cart" ? "active" : ""}
            onClick={() => setActiveSection("cart")}
          >
            Cart
          </li>

          <li onClick={() => setActiveSection("guest")}>Guest List</li>


          <li
            className={activeSection === "orders" ? "active" : ""}
            onClick={() => setActiveSection("orders")}
          >
            Order Status
          </li>

          <li className="logout" onClick={handleLogout}>
            Logout
          </li>

        </ul>

      </aside>

      {/* ===== MAIN CONTENT ===== */}
      <main className="main-content">

        {activeSection === "dashboard" && (
          <h1>Welcome to User Dashboard</h1>
        )}

        {activeSection === "vendor" && (
          <VendorList setActiveSection={setActiveSection} />
        )}

        {activeSection === "cart" && (
          <Cart setActiveSection={setActiveSection} />
        )}

        {activeSection === "guest`" && < GuestList />}

        {activeSection === "checkout" && (
          <Checkout />
        )}

        {activeSection === "orders" && (
          <OrderStatus />
        )}

      </main>

    </div>
  );
};

export default UserDashboard;
