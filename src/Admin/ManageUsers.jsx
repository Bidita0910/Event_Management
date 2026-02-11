import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { ref, get } from "firebase/database";
import "./ManageUsers.css";
import { useNavigate } from "react-router-dom";

const ManageUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const usersRef = ref(db, "users");

    get(usersRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();

          const verifiedUsers = Object.entries(data)
            .map(([uid, user]) => ({
              uid,
              ...user
            }))
            .filter((user) => user.emailVerified === true || user.emailVerified === undefined);

          setUsers(verifiedUsers);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Loading users...</p>;
  }

  return (
    <div className="manage-users-container">
      <h2>Registered Users</h2>

      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table className="users-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Username</th>
              <th>Email</th>
              <th>UID</th>
              <th>Others</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.uid}>
                <td>{index + 1}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td className="uid">{user.uid}</td>
                <td><button className="view-btn" onClick={() => navigate(`/admin/user/${user.uid}`)}>View Details</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ManageUsers;
