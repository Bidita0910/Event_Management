import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { ref, get } from "firebase/database";
import "./ViewUserDetails.css";

const ViewUserDetails = () => {
  const { uid } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userRef = ref(db, `users/${uid}`);

    get(userRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          setUser(snapshot.val());
        } else {
          alert("User not found");
          navigate("/admin-dashboard");
        }
      })
      .catch(() => {
        alert("Error loading user details");
      });
  }, [uid, navigate]);

  const getValue = (value) => {
    return value ? value : "Not selected";
  };

  if (!user) {
    return <p style={{ textAlign: "center" }}>Loading...</p>;
  }

  return (
    <div className="view-details-container">
      <div className="view-details-card">

        <h2>User Details</h2>

        <div className="details-grid">
          <Detail label="Username" value={getValue(user.username)} />
          <Detail label="Email" value={getValue(user.email)} />
          <Detail label="Board" value={getValue(user.board)} />
          <Detail label="Preparing For" value={getValue(user.preparingFor)} />
          <Detail label="Class / Year" value={getValue(user.class)} />
          <Detail label="Institution" value={getValue(user.institution)} />
          <Detail label="City" value={getValue(user.city)} />
          <Detail label="State" value={getValue(user.state)} />
        </div>

        <button className="back-btn" onClick={() => navigate("/admin-dashboard")}>
          Back
        </button>

      </div>
    </div>
  );
};

const Detail = ({ label, value }) => (
  <div className="detail-item">
    <span className="label">{label}</span>
    <span className="value">{value}</span>
  </div>
);

export default ViewUserDetails;
