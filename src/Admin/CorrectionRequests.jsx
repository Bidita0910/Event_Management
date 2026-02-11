import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { ref, get, update } from "firebase/database";
import "./CorrectionRequests.css";

const CorrectionRequests = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const reqRef = ref(db, "correctionRequests");

    get(reqRef)
      .then((snapshot) => {
        if (!snapshot.exists()) {
          setRequests([]);
          return;
        }

        const rawData = snapshot.val();

        // 🔥 OBJECT → ARRAY (MATCH DB STRUCTURE)
        const list = Object.entries(rawData)
          .filter(([_, req]) => !req.status || req.status === "pending")
          .map(([id, req]) => ({
            id,
            uid: req.uid,
            username: req.username,
            email: req.email,
            field: req.field,
            oldValue: req.oldValue,
            newValue: req.newValue,
            reason: req.reason || "—"
          }));

        
        setRequests(list);
      })
      .catch((err) => {
        
        setRequests([]);
      });
  }, []);

  const approveRequest = async (req) => {
    // ✅ Update only the requested field
    await update(ref(db, `users/${req.uid}`), {
      [req.field]: req.newValue
    });

    // ✅ Mark request approved
    await update(ref(db, `correctionRequests/${req.id}`), {
      status: "approved"
    });

    // ✅ Remove from UI
    setRequests((prev) => prev.filter((r) => r.id !== req.id));
  };

  const rejectRequest = async (id) => {
    await update(ref(db, `correctionRequests/${id}`), {
      status: "rejected"
    });

    setRequests((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="correction-container">
      <h2>Correction Requests</h2>

      <p>Total Requests: {requests.length}</p>

      {requests.length === 0 ? (
        <p className="empty">No pending correction requests</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table className="correction-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Field</th>
                <th>Old Value</th>
                <th>New Value</th>
                <th>Reason</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {requests.map((req) => (
                <tr key={req.id}>
                  <td>
                    <strong>{req.username}</strong>
                    <br />
                    <small>{req.email}</small>
                  </td>
                  <td>{req.field}</td>
                  <td>{req.oldValue || "—"}</td>
                  <td className="new">{req.newValue}</td>
                  <td>{req.reason}</td>
                  <td>
                    <button
                      className="approve"
                      onClick={() => approveRequest(req)}
                    >
                      Approve
                    </button>
                    <button
                      className="reject"
                      onClick={() => rejectRequest(req.id)}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      )}
    </div>
  );
};

export default CorrectionRequests;
