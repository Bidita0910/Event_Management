import React, { useState } from "react";
import { db,auth } from "../firebase";
import { ref, push } from "firebase/database";
import "./CreateExam.css";

const CreateExam = () => {
  const [exam, setExam] = useState({
    examName: "",
    board: "",
    classYear: "",
    preparingFor: "",
    duration: "",
    totalMarks: "",
  });

  const handleChange = (e) => {
    setExam({
      ...exam,
      [e.target.name]: e.target.value
    });
  };

  const handleCreateExam = async (e) => {
    e.preventDefault();

    if (
      !exam.examName ||
      !exam.board ||
      !exam.classYear ||
      !exam.preparingFor
    ) {
      alert("Please fill all required fields");
      return;
    }

    const examData = {
      ...exam,
      duration: Number(exam.duration),
      totalMarks: Number(exam.totalMarks),
      createdBy: auth.currentUser.uid,
      createdAt: Date.now(),
      status: "active"
    };

    await push(ref(db, "exams"), examData);

    alert("Exam created successfully!");

    setExam({
      examName: "",
      board: "",
      classYear: "",
      preparingFor: "",
      duration: "",
      totalMarks: "",
    });
  };

  return (
    <div className="create-exam-container">
      <div className="create-exam-card">
        <h2>Create New Exam</h2>

        <form onSubmit={handleCreateExam} className="exam-form">

          <input
            type="text"
            name="examName"
            placeholder="Exam Name"
            value={exam.examName}
            onChange={handleChange}
          />

          <select name="board" value={exam.board} onChange={handleChange}>
            <option value="">Select Board</option>
            <option value="CBSE">CBSE</option>
            <option value="ICSE">ICSE</option>
            <option value="State Board">State Board</option>
            <option value="Autonomous">Autonomous</option>
          </select>

          <select name="classYear" value={exam.classYear} onChange={handleChange}>
            <option value="">Select Class / Year</option>
            <option value="10">Class 10</option>
            <option value="12">Class 12</option>
            <option value="1st year">1st Year</option>
            <option value="4th year">4th Year</option>
          </select>

          <select
            name="preparingFor"
            value={exam.preparingFor}
            onChange={handleChange}
          >
            <option value="">Preparing For</option>
            <option value="JEE">JEE</option>
            <option value="NEET">NEET</option>
            <option value="GATE">GATE</option>
            <option value="Semester Exam">Semester Exam</option>
          </select>

          <input
            type="number"
            name="duration"
            placeholder="Duration (minutes)"
            value={exam.duration}
            onChange={handleChange}
          />

          <input
            type="number"
            name="totalMarks"
            placeholder="Total Marks"
            value={exam.totalMarks}
            onChange={handleChange}
          />
          <button type="submit">Create Exam</button>
        </form>
      </div>
    </div>
  );
};

export default CreateExam;
