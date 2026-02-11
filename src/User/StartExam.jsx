import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { ref, get, set } from "firebase/database";
import "./StartExam.css";

const StartExam = () => {
  const { examId } = useParams();
  const navigate = useNavigate();

  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);

  // ================= LOAD EXAM =================
  useEffect(() => {
    const loadExam = async () => {
      try {
        const examSnap = await get(ref(db, `exams/${examId}`));
        const quesSnap = await get(ref(db, `examQuestions/${examId}`));

        if (!examSnap.exists() || !quesSnap.exists()) {
          alert("Exam not found");
          navigate("/dashboard");
          return;
        }

        const examData = examSnap.val();

        const quesList = Object.entries(quesSnap.val()).map(
          ([id, q]) => ({
            id,
            ...q
          })
        );

        setExam(examData);
        setQuestions(quesList);
        setTimeLeft(examData.duration * 60); // seconds
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadExam();
  }, [examId, navigate]);

  // ================= TIMER =================
  useEffect(() => {
    if (!timeLeft) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          submitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // ================= ANSWER SELECT =================
  const handleAnswer = (option) => {
    setAnswers({
      ...answers,
      [questions[currentIndex].id]: option
    });
  };

  // ================= SUBMIT =================
  const submitExam = async () => {
    const user = auth.currentUser;
    if (!user) return;

    let score = 0;

    questions.forEach(q => {
      if (answers[q.id] === q.correctAnswer) {
        score += Number(q.marks || 1);
      }
    });

    await set(
      ref(db, `examAttempts/${examId}/${user.uid}`),
      {
        answers,
        score,
        status: "submitted",
        submittedAt: Date.now()
      }
    );

    navigate("/exam-submitted");
  };

  if (loading) {
    return <p style={{ textAlign: "center" }}>Loading exam...</p>;
  }

  const q = questions[currentIndex];

  return (
    <div className="start-exam-container">

      <div className="exam-header">
        <h2>{exam.examName}</h2>
        <div className="timer">
          Time Left: {Math.floor(timeLeft / 60)}:
          {(timeLeft % 60).toString().padStart(2, "0")}
        </div>
      </div>

      <div className="question-card">
        <h3>
          Q{currentIndex + 1}. {q.question}
        </h3>

        {["A", "B", "C", "D"].map(opt => (
          <label key={opt} className="option">
            <input
              type="radio"
              name="option"
              checked={answers[q.id] === opt}
              onChange={() => handleAnswer(opt)}
            />
            <span>{opt}. {q.options[opt]}</span>
          </label>
        ))}
      </div>

      <div className="navigation">
        <button
          disabled={currentIndex === 0}
          onClick={() => setCurrentIndex(prev => prev - 1)}
        >
          Previous
        </button>

        {currentIndex === questions.length - 1 ? (
          <button className="submit-btn" onClick={submitExam}>
            Submit Exam
          </button>
        ) : (
          <button onClick={() => setCurrentIndex(prev => prev + 1)}>
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default StartExam;
