import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { ref, get, set, child } from "firebase/database";
import { useParams, useNavigate } from "react-router-dom";
// import "./User/StartExam.css";
import "./ExamPreview.css";

const ExamPreview = () => {
    const { examId } = useParams();
    const navigate = useNavigate();
    const [exam, setExam] = useState(null); 
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [showAnswer, setShowAnswer] = useState(false);

    // ✅ NEW STATES
    const [answers, setAnswers] = useState({});
    const [submitting, setSubmitting] = useState(false);

    // ================= LOAD EXAM =================
    useEffect(() => {
        const loadPreview = async () => {
            try {
                const examSnap = await get(ref(db, `exams/${examId}`));
                const quesSnap = await get(ref(db, `examQuestions/${examId}`));

                if (!examSnap.exists() || !quesSnap.exists()) {
                    alert("Exam not found");
                    navigate("/admin-dashboard");
                    return;
                }

                const quesList = Object.entries(quesSnap.val()).map(
                    ([id, q]) => ({
                        id,
                        ...q
                    })
                );

                setExam(examSnap.val());
                setQuestions(quesList);
            } catch (err) {
                console.error("Preview load error:", err);
            } finally {
                setLoading(false);
            }
        };

        loadPreview();
    }, [examId, navigate]);

    // ================= ANSWER SELECT =================
    const handleAnswerSelect = (option) => {
        setAnswers(prev => ({
            ...prev,
            [questions[currentIndex].id]: option
        }));
    };

    // ================= SUBMIT PREVIEW =================
    const submitPreviewExam = async () => {
        const currentUser = auth.currentUser;
        if (!currentUser) {
            alert("Not authenticated");
            return;
        }

        setSubmitting(true);

        try {
            // ✅ VERIFY ADMIN ROLE FROM DATABASE
            const adminCheck = await get(
                ref(db, `admins/${currentUser.uid}`)
            );

            if (!adminCheck.exists()) {
                alert("Only admins can submit preview exams.");
                setSubmitting(false);
                return;
            }

            // ✅ CALCULATE SCORE
            let score = 0;

            questions.forEach(q => {
                if (answers[q.id] === q.correctAnswer) {
                    score += Number(q.marks || 1);
                }
            });

            // ✅ SAVE USING ADMIN UID ONLY
            await set(
                ref(db, `adminExamAttempts/${examId}/${currentUser.uid}`),
                {
                    answers,
                    score,
                    totalQuestions: questions.length,
                    submittedAt: Date.now(),
                    mode: "preview",
                    role: "admin"
                }
            );

            alert("Preview submitted successfully!");

        } catch (err) {
            console.error(err);
            alert("Submission failed");
        }

        setSubmitting(false);
    };


    // ================= LOADING =================
    if (loading) {
        return (
            <p style={{ textAlign: "center", marginTop: "50px" }}>
                Loading preview...
            </p>
        );
    }

    const q = questions[currentIndex];

    return (
        <div className="start-exam-container">

            <div className="exam-header">
                <h2>{exam.examName} (Preview Mode)</h2>
            </div>

            {/* ===== QUESTION NAVIGATION BAR ===== */}
            <div className="question-navbar">
                {questions.map((question, index) => (
                    <button
                        key={index}
                        className={`nav-question-btn
              ${currentIndex === index ? "active" : ""}
              ${answers[question.id] ? "answered" : ""}
            `}
                        onClick={() => setCurrentIndex(index)}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>

            {/* ===== QUESTION CARD ===== */}
            <div className="question-card">
                <h3>
                    Q{currentIndex + 1}. {q.question}
                </h3>

                {["A", "B", "C", "D"].map(opt => (
                    <div
                        key={opt}
                        className={`option
              ${answers[q.id] === opt ? "selected" : ""}
              ${showAnswer && q.correctAnswer === opt ? "correct" : ""}
            `}
                        onClick={() => handleAnswerSelect(opt)}
                    >
                        {opt}. {q.options[opt]}
                    </div>
                ))}

                {showAnswer && (
                    <p className="explanation">
                        <strong>Explanation:</strong> {q.explanation}
                    </p>
                )}
            </div>

            {/* ===== NAVIGATION ===== */}
            <div className="navigation">
                <button
                    disabled={currentIndex === 0}
                    onClick={() => setCurrentIndex(prev => prev - 1)}
                >
                    Previous
                </button>

                {currentIndex === questions.length - 1 ? (
                    <button
                        className="submit-btn"
                        onClick={submitPreviewExam}
                        disabled={submitting}
                    >
                        {submitting ? "Submitting..." : "Submit Preview"}
                    </button>
                ) : (
                    <button onClick={() => setCurrentIndex(prev => prev + 1)}>
                        Next
                    </button>
                )}
            </div>

            <div style={{ marginTop: "20px", textAlign: "center" }}>
                <button onClick={() => setShowAnswer(!showAnswer)}>
                    {showAnswer ? "Hide Answer" : "Show Answer"}
                </button>

                <button
                    className="close-btn"
                    onClick={() => navigate("/admin-dashboard")}
                    style={{ marginLeft: "10px" }}
                >
                    Back to Manage Exams
                </button>
            </div>

        </div>
    );
};

export default ExamPreview;
