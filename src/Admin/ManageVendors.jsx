import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { ref, get, update, remove } from "firebase/database";
import "./ManageVendors.css";

const ManageVendors = () => {

  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  // ===============================
  // FETCH ALL VENDORS
  // ===============================
  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const snapshot = await get(ref(db, "users"));

      if (!snapshot.exists()) {
        setVendors([]);
        setLoading(false);
        return;
      }

      const data = snapshot.val();

      // filter only vendors
      const vendorList = Object.keys(data)
        .filter(uid => data[uid].role === "vendor")
        .map(uid => ({
          id: uid,
          ...data[uid]
        }));

      setVendors(vendorList);
      setLoading(false);

    } catch (err) {
      console.error("Vendor fetch error:", err);
      setLoading(false);
    }
  };

  // ===============================
  // APPROVE VENDOR
  // ===============================
  const approveVendor = async (uid) => {
    await update(ref(db, `users/${uid}`), {
      status: "approved"
    });

    alert("Vendor approved");
    fetchVendors();
  };

  // ===============================
  // UPDATE MEMBERSHIP
  // ===============================
  const updateMembership = async (uid) => {
    const membership = prompt("Enter membership (basic / premium)");

    if (!membership) return;

    await update(ref(db, `users/${uid}`), {
      membership
    });

    alert("Membership updated");
    fetchVendors();
  };

  // ===============================
  // DELETE VENDOR
  // ===============================
  const deleteVendor = async (uid) => {
    const confirmDelete = window.confirm("Delete this vendor?");
    if (!confirmDelete) return;

    await remove(ref(db, `users/${uid}`));

    alert("Vendor removed");
    fetchVendors();
  };

  // ===============================
  // UI
  // ===============================
  if (loading) return <p className="loading">Loading vendors...</p>;

  return (
    <div className="manage-vendors-container">

      <h2 className="title">Manage Vendors</h2>

      {vendors.length === 0 ? (
        <p className="empty">No vendors found</p>
      ) : (

        <div className="table-wrapper">
          <table className="vendors-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Membership</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {vendors.map(vendor => (
                <tr key={vendor.id}>
                  <td>{vendor.name}</td>
                  <td>{vendor.email}</td>

                  <td>
                    <span className={`status ${vendor.status || "pending"}`}>
                      {vendor.status || "pending"}
                    </span>
                  </td>

                  <td>{vendor.membership || "basic"}</td>

                  <td className="actions">

                    {vendor.status !== "approved" && (
                      <button
                        className="approve-btn"
                        onClick={() => approveVendor(vendor.id)}
                      >
                        Approve
                      </button>
                    )}

                    <button
                      className="edit-btn"
                      onClick={() => updateMembership(vendor.id)}
                    >
                      Update
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => deleteVendor(vendor.id)}
                    >
                      Remove
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

export default ManageVendors;
