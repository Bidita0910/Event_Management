import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { ref, get, push, set, remove, update } from "firebase/database";
// import "./GuestList.css";

const GuestList = () => {
  const [guests, setGuests] = useState([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [relation, setRelation] = useState("");
  const [editId, setEditId] = useState(null);

  const user = auth.currentUser;

  // ================= FETCH GUESTS =================
  const fetchGuests = async () => {
    if (!user) return;

    const snapshot = await get(ref(db, `users/${user.uid}/guestList`));

    if (snapshot.exists()) {
      const data = snapshot.val();
      const guestArray = Object.keys(data).map(key => ({
        id: key,
        ...data[key],
      }));
      setGuests(guestArray);
    } else {
      setGuests([]);
    }
  };

  useEffect(() => {
    fetchGuests();
  }, []);

  // ================= ADD / UPDATE =================
  const handleSubmit = async () => {
    if (!name || !phone) {
      alert("Name and Phone required");
      return;
    }

    try {
      if (editId) {
        // UPDATE
        await update(
          ref(db, `users/${user.uid}/guestList/${editId}`),
          { name, phone, email, relation }
        );
        alert("Guest Updated");
        setEditId(null);
      } else {
        // ADD
        const newRef = push(
          ref(db, `users/${user.uid}/guestList`)
        );

        await set(newRef, {
          name,
          phone,
          email,
          relation,
        });

        alert("Guest Added");
      }

      setName("");
      setPhone("");
      setEmail("");
      setRelation("");

      fetchGuests();
    } catch (err) {
      alert(err.message);
    }
  };

  // ================= EDIT =================
  const handleEdit = (guest) => {
    setName(guest.name);
    setPhone(guest.phone);
    setEmail(guest.email);
    setRelation(guest.relation);
    setEditId(guest.id);
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this guest?")) return;

    await remove(
      ref(db, `users/${user.uid}/guestList/${id}`)
    );

    fetchGuests();
  };

  return (
    <div className="guest-container">
      <h2>Guest List</h2>

      {/* ===== FORM ===== */}
      <div className="guest-form">
        <input
          type="text"
          placeholder="Guest Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="text"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="text"
          placeholder="Relation"
          value={relation}
          onChange={(e) => setRelation(e.target.value)}
        />

        <button onClick={handleSubmit}>
          {editId ? "Update Guest" : "Add Guest"}
        </button>
      </div>

      {/* ===== LIST ===== */}
      <div className="guest-list">
        {guests.length === 0 ? (
          <p>No guests added yet.</p>
        ) : (
          guests.map((guest) => (
            <div key={guest.id} className="guest-card">
              <div>
                <h4>{guest.name}</h4>
                <p>{guest.phone}</p>
                <p>{guest.email}</p>
                <small>{guest.relation}</small>
              </div>

              <div className="guest-actions">
                <button onClick={() => handleEdit(guest)}>
                  Edit
                </button>
                <button
                  className="delete"
                  onClick={() => handleDelete(guest.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default GuestList;
