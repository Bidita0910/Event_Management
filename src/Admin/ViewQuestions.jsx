import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { ref, get, update, remove,push } from "firebase/database";
import "./ViewQuestions.css";

const ViewQuestions = ({ examId, onClose }) => {
  const [questions, setQuestions] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [addingNew, setAddingNew] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    question: "",
    options: { A: "", B: "", C: "", D: "" },
    correctAnswer: "A",
    explanation: "",
    marks: 1
  });


  useEffect(() => {
    const fetchQuestions = async () => {
      const snap = await get(ref(db, `examQuestions/${examId}`));

      if (!snap.exists()) {
        setQuestions([]);
        return;
      }

      const list = Object.entries(snap.val()).map(([id, q]) => ({
        id,
        ...q,
        marks: q.marks || 1   // ✅ ensure marks exists
      }));

      setQuestions(list);
    };

    fetchQuestions();
  }, [examId]);

  const startEdit = (q) => {
    setEditingId(q.id);
    setEditData(JSON.parse(JSON.stringify(q)));
  };

  const saveEdit = async (id) => {
    await update(ref(db, `examQuestions/${examId}/${id}`), {
      question: editData.question,
      options: editData.options,
      correctAnswer: editData.correctAnswer,
      explanation: editData.explanation,
      marks: Number(editData.marks) || 1   // ✅ added
    });

    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? editData : q))
    );

    setEditingId(null);
  };

  const deleteQuestion = async (id) => {
    const confirm = window.confirm("Delete this question?");
    if (!confirm) return;

    await remove(ref(db, `examQuestions/${examId}/${id}`));
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const saveNewQuestion = async () => {
    if (!newQuestion.question.trim()) {
      alert("Question cannot be empty");
      return;
    }

    const newRef = ref(db, `examQuestions/${examId}`);

    const pushed = await push(newRef, newQuestion);

    setQuestions(prev => [
      ...prev,
      { id: pushed.key, ...newQuestion }
    ]);

    // reset form
    setNewQuestion({
      question: "",
      options: { A: "", B: "", C: "", D: "" },
      correctAnswer: "A",
      explanation: "",
      marks: 1
    });

    setAddingNew(false);
  };

  return (
    <div className="view-questions-overlay">
      <div className="view-questions-card">
        <h2>Exam Questions</h2>

        {questions.length === 0 ? (
          <p>No questions uploaded yet.</p>
        ) : (
          <table className="questions-table">
            <thead>
              <tr>
                <th>Question</th>
                <th>Options</th>
                <th>Correct</th>
                <th>Explanation</th>
                <th>Marks</th> 
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {addingNew && (
                <tr>
                  <td>
                    <textarea
                      value={newQuestion.question}
                      onChange={(e) =>
                        setNewQuestion({ ...newQuestion, question: e.target.value })
                      }
                    />
                  </td>

                  <td>
                    {["A", "B", "C", "D"].map(opt => (
                      <div key={opt}>
                        <strong>{opt}:</strong>
                        <input
                          value={newQuestion.options[opt]}
                          onChange={(e) =>
                            setNewQuestion({
                              ...newQuestion,
                              options: {
                                ...newQuestion.options,
                                [opt]: e.target.value
                              }
                            })
                          }
                        />
                      </div>
                    ))}
                  </td>

                  <td>
                    <select
                      value={newQuestion.correctAnswer}
                      onChange={(e) =>
                        setNewQuestion({
                          ...newQuestion,
                          correctAnswer: e.target.value
                        })
                      }
                    >
                      <option>A</option>
                      <option>B</option>
                      <option>C</option>
                      <option>D</option>
                    </select>
                  </td>

                  <td>
                    <textarea
                      value={newQuestion.explanation}
                      onChange={(e) =>
                        setNewQuestion({
                          ...newQuestion,
                          explanation: e.target.value
                        })
                      }
                    />
                  </td>

                  <td>
                    <input
                      type="number"
                      value={newQuestion.marks}
                      onChange={(e) =>
                        setNewQuestion({
                          ...newQuestion,
                          marks: e.target.value
                        })
                      }
                      style={{ width: "60px" }}
                    />
                  </td>

                  <td>New</td>
                </tr>
              )}

              {questions.map((q) => (
                <tr key={q.id}>
                  {/* QUESTION */}
                  <td>
                    {editingId === q.id ? (
                      <textarea
                        value={editData.question}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            question: e.target.value
                          })
                        }
                      />
                    ) : (
                      q.question
                    )}
                  </td>

                  {/* OPTIONS */}
                  <td>
                    {["A", "B", "C", "D"].map((opt) => (
                      <div key={opt}>
                        <strong>{opt}:</strong>{" "}
                        {editingId === q.id ? (
                          <input
                            value={editData.options[opt]}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                options: {
                                  ...editData.options,
                                  [opt]: e.target.value
                                }
                              })
                            }
                          />
                        ) : (
                          q.options[opt]
                        )}
                      </div>
                    ))}
                  </td>

                  {/* CORRECT ANSWER */}
                  <td>
                    {editingId === q.id ? (
                      <select
                        value={editData.correctAnswer}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            correctAnswer: e.target.value
                          })
                        }
                      >
                        <option>A</option>
                        <option>B</option>
                        <option>C</option>
                        <option>D</option>
                      </select>
                    ) : (
                      q.correctAnswer
                    )}
                  </td>

                  {/* EXPLANATION */}
                  <td>
                    {editingId === q.id ? (
                      <textarea
                        value={editData.explanation}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            explanation: e.target.value
                          })
                        }
                      />
                    ) : (
                      q.explanation || "—"
                    )}
                  </td>

                  {/* ✅ MARKS COLUMN */}
                  <td>
                    {editingId === q.id ? (
                      <input
                        type="number"
                        min="1"
                        value={editData.marks}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            marks: e.target.value
                          })
                        }
                        style={{ width: "60px" }}
                      />
                    ) : (
                      q.marks
                    )}
                  </td>

                  {/* ACTIONS */}
                  <td className="actions">
                    {editingId === q.id ? (
                      <button
                        className="save-btn"
                        onClick={() => saveEdit(q.id)}
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        className="edit-btn"
                        onClick={() => startEdit(q)}
                      >
                        Edit
                      </button>
                    )}

                    <button
                      className="delete-btn"
                      onClick={() => deleteQuestion(q.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="bottom-actions">
          <button
            className="add-btn"
            onClick={() => {
              if (addingNew) {
                saveNewQuestion();
              } else {
                setAddingNew(true);
              }
            }}
          >
            {addingNew ? "Save Question" : "Add Question"}
          </button>

          <button className="close-btn" onClick={onClose}>
            Close
          </button>
        </div>

      </div>
    </div>
  );
};

export default ViewQuestions;
