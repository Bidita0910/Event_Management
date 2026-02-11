import React, { useEffect, useState } from "react";
import { db,auth } from "../firebase";
import { ref, get } from "firebase/database";
import { useNavigate } from "react-router-dom";
import "./UserAssessments.css";
import { onAuthStateChanged } from "firebase/auth";

const UserAssessments = () => {
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {

        const unsubscribe = onAuthStateChanged(auth, async (user) => {

            if (!user) {
                setLoading(false);
                return;
            }

            setLoading(true);

            try {
                // ✅ 1. Get user profile
                const userSnap = await get(ref(db, `users/${user.uid}`));

                if (!userSnap.exists()) {
                    console.log("User profile not found");
                    setExams([]);
                    return;
                }

                const userProfile = userSnap.val();

                // ✅ 2. Get exams
                const examSnap = await get(ref(db, "exams"));

                if (!examSnap.exists()) {
                    setExams([]);
                    return;
                }

                const examsData = examSnap.val();
                const examList = [];

                // ✅ 3. Filter exams
                for (const [examId, exam] of Object.entries(examsData)) {

                    if (
                        exam.board !== userProfile.board ||
                        exam.classYear !== userProfile.classYear ||
                        exam.preparingFor !== userProfile.preparingFor ||
                        exam.status !== "active"
                    ) continue;

                    // check attempt
                    const attemptSnap = await get(
                        ref(db, `examAttempts/${examId}/${user.uid}`)
                    );

                    examList.push({
                        id: examId,
                        ...exam,
                        attemptStatus: attemptSnap.exists()
                            ? (attemptSnap.val().status || "submitted")
                            : "not_attempted"
                    });
                }

                setExams(examList);

            } catch (err) {
                console.error("Assessment load error:", err);
            } finally {
                setLoading(false);
            }
        });

        return () => unsubscribe();

    }, []);

    const startExam = (examId) => {
        navigate(`/exam/${examId}`);
    };

    if (loading) {
        return <p style={{ textAlign: "center" }}>Loading exams...</p>;
    }

    return (
        <div className="assessments-container">
            <h2 className="title">Available Exams</h2>

            {exams.length === 0 ? (
                <p className="empty">No exams available for your profile</p>
            ) : (
                <div className="exam-list">
                    {exams.map((exam) => (
                        <div className="exam-card" key={exam.id}>
                            <h3>{exam.examName}</h3>

                            <p><strong>Duration:</strong> {exam.duration} mins</p>
                            <p><strong>Total Marks:</strong> {exam.totalMarks}</p>

                            {exam.attemptStatus === "submitted" ? (
                                <button className="disabled" disabled>
                                    Attempted
                                </button>
                            ) : (
                                <button onClick={() => startExam(exam.id)}>
                                    Start Exam
                                </button>
                            )}
                        </div>
                    ))}

                </div>
            )}
        </div>
    );
};

export default UserAssessments;
