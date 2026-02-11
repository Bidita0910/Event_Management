import React, { useState, useEffect } from "react";
import "./VendorDashboard.css";
import { ref, get } from "firebase/database";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { db } from "../firebase";
import AddItem from "./AddItem";
import YourItems from "./YourItems";

const VendorDashboard = () => {
    const navigate = useNavigate();

    const [activeSection, setActiveSection] = useState("dashboard");
    const [userData, setUserData] = useState(null);
    const [vendorId, setVendorId] = useState(null);

    useEffect(() => {

        const unsubscribe = onAuthStateChanged(auth, async (user) => {

            if (!user) {
                navigate("/login");
                return;
            }

            // ✅ store vendorId here
            setVendorId(user.uid);

            const vendorRef = ref(db, `users/${user.uid}`);
            const snapshot = await get(vendorRef);

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
        <div className="vendor-dashboard-container">

            <div className="vendor-dashboard-wrapper">

                {/* SIDEBAR */}
                <div className="vendor-sidebar">

                    <div>
                        <div className="vendor-info">
                            <h3>
                                Welcome {userData ? userData.name : "Loading..."}
                            </h3>
                            <p>Email: {userData ? userData.email : ""}</p>
                            <p>Vendor Panel</p>
                        </div>

                        <div className="vendor-menu">
                            <button
                                className={activeSection === "dashboard" ? "active" : ""}
                                onClick={() => setActiveSection("dashboard")}
                            >
                                Dashboard
                            </button>

                            <button
                                className={activeSection === "items" ? "active" : ""}
                                onClick={() => setActiveSection("items")}
                            >
                                Your Items
                            </button>

                            <button
                                className={activeSection === "addItem" ? "active" : ""}
                                onClick={() => setActiveSection("addItem")}
                            >
                                Add New Item
                            </button>

                            <button
                                className={activeSection === "transactions" ? "active" : ""}
                                onClick={() => setActiveSection("transactions")}
                            >
                                Transactions
                            </button>
                        </div>
                    </div>

                    <div className="vendor-logout">
                        <button onClick={handleLogout}>Logout</button>
                    </div>

                </div>

                {/* CONTENT */}
                <div className="vendor-content">

                    {activeSection === "dashboard" && (
                        <>
                            <h2>Vendor Dashboard</h2>
                            <p>Welcome to Vendor Panel</p>
                        </>
                    )}

                    {activeSection === "items" && vendorId && (
                        <YourItems vendorId={vendorId} />
                    )}

                    {activeSection === "addItem" && vendorId && (
                        <AddItem vendorId={vendorId} />
                    )}

                    {activeSection === "transactions" && (
                        <>
                            <h2>Transactions</h2>
                            <p>Transaction history will appear here.</p>
                        </>
                    )}

                </div>

            </div>

        </div>
    );
};

export default VendorDashboard;
