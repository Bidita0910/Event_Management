import React, { useEffect, useState } from "react";
import { db,auth } from "../firebase";
import { ref, get, update } from "firebase/database";
import "./UserProfile.css";
import { onAuthStateChanged } from "firebase/auth";

const UserProfile = () => {
    const [showCorrection, setShowCorrection] = useState(false);
    const [correctionData, setCorrectionData] = useState({
        field: "",
        newValue: "",
        reason: ""
    });

    const [profile, setProfile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [editableData, setEditableData] = useState({
        board: "",
        institution: "",
        preparingFor: "",
        classYear: ""
    });

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) return;
            setLoading(true);   

            const userRef = ref(db, `users/${user.uid}`);
            const snapshot = await get(userRef);

            if (snapshot.exists()) {
                setProfile(snapshot.val());
                setEditableData({
                    board: snapshot.val().board || "",
                    institution: snapshot.val().institution || "",
                    preparingFor: snapshot.val().preparingFor || "",
                    classYear: snapshot.val().classYear || ""
                });
            }
        });

        return () => unsubscribe();
    }, []);


    const handleChange = (e) => {
        setEditableData({
            ...editableData,
            [e.target.name]: e.target.value
        });
    };

    const handleSave = async () => {
        const user = auth.currentUser;
        if (!user) return;

        const userRef = ref(db, `users/${user.uid}`);

        // remove empty values
        const cleanedData = Object.fromEntries(
            Object.entries(editableData).filter(
                ([_, value]) => value && value.trim() !== ""
            )
        );

        if (Object.keys(cleanedData).length === 0) {
            alert("No changes to save");
            setIsEditing(false);
            return;
        }

        await update(userRef, cleanedData);

        // update UI instantly
        setProfile((prev) => ({ ...prev, ...cleanedData }));
        setIsEditing(false);

        alert("Profile updated successfully");
    };
    const handleCorrectionChange = (e) => {
        setCorrectionData({
            ...correctionData,
            [e.target.name]: e.target.value
        });
    };

    const submitCorrectionRequest = async () => {
        const user = auth.currentUser;
        if (!user || !correctionData.field || !correctionData.newValue) {
            alert("Please select field and enter new value");
            return;
        }

        const requestRef = ref(db, "correctionRequests");
        const newRequestRef = ref(db, `correctionRequests/${Date.now()}`);

        await update(newRequestRef, {
            uid: user.uid,
            username: profile.username,
            email: profile.email,
            field: correctionData.field,
            oldValue: profile[correctionData.field] || "Not selected",
            newValue: correctionData.newValue,
            reason: correctionData.reason || "",
            status: "pending",
            createdAt: Date.now()
        });

        alert("Correction request submitted. Waiting for admin response.");

        setShowCorrection(false);
        setCorrectionData({ field: "", newValue: "", reason: "" });
    };
    if (!profile) {
        return <p style={{ textAlign: "center" }}>Loading profile...</p>;
    }

    return (
        <div className="profile-container">
            <div className="profile-card">

                <h2>User Profile</h2>

                <div className="profile-grid">
                    {/* READ ONLY */}
                    <ProfileField label="Username" value={profile.username} />
                    <ProfileField label="Email" value={profile.email} />
                    <ProfileField label="Mobile" value={profile.mobile || "Not provided"} />

                    {/* EDITABLE (CONTROLLED) */}
                    <ProfileInput
                        label="Board"
                        name="board"
                        value={editableData.board}
                        onChange={handleChange}
                        disabled={!isEditing}
                    />

                    <ProfileInput
                        label="Institution"
                        name="institution"
                        value={editableData.institution}
                        onChange={handleChange}
                        disabled={!isEditing}
                    />

                    <ProfileInput
                        label="Preparing For"
                        name="preparingFor"
                        value={editableData.preparingFor}
                        onChange={handleChange}
                        disabled={!isEditing}
                    />

                    <ProfileInput
                        label="Class / Year"
                        name="classYear"
                        value={editableData.classYear}
                        onChange={handleChange}
                        disabled={!isEditing}
                    />

                    {/* READ ONLY */}
                    <ProfileField label="City" value={profile.city || "Not selected"} />
                    <ProfileField label="State" value={profile.state || "Not selected"} />
                </div>

                {!isEditing ? (
                    <button className="edit-btn" onClick={() => setIsEditing(true)}>
                        Edit Profile
                    </button>
                ) : (
                    <><button className="save-btn" onClick={handleSave}>
                        Save Changes
                    </button><button className="correction-btn" onClick={() => setShowCorrection(true)}>
                            Request Correction
                        </button></>

                )}

            </div>
            {showCorrection && (
                <div className="correction-modal">
                    <div className="correction-card">
                        <h3>Correction Request</h3>

                        <label>Field to change</label>
                        <select
                            name="field"
                            value={correctionData.field}
                            onChange={handleCorrectionChange}
                        >
                            <option value="">Select field</option>
                            <option value="city">City</option>
                            <option value="state">State</option>
                            <option value="email">Email</option>
                            <option value="phone">Phone</option>
                        </select>

                        <label>New value</label>
                        <input
                            name="newValue"
                            value={correctionData.newValue}
                            onChange={handleCorrectionChange}
                            placeholder="Enter new value"
                        />

                        <label>Reason (optional)</label>
                        <textarea
                            name="reason"
                            value={correctionData.reason}
                            onChange={handleCorrectionChange}
                            placeholder="Optional"
                        />

                        <div className="modal-actions">
                            <button onClick={submitCorrectionRequest}>Submit</button>
                            <button onClick={() => setShowCorrection(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

const ProfileField = ({ label, value }) => (
    <div className="field">
        <label>{label}</label>
        <input value={value} disabled />
    </div>
);

const ProfileInput = ({ label, name, value, onChange, disabled }) => (
    <div className="field">
        <label>{label}</label>
        <input
            name={name}
            value={value}
            onChange={onChange}
            disabled={disabled}
            placeholder={`Enter ${label}`}
        />
    </div>
);

export default UserProfile;
