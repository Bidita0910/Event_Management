import React, { useState } from "react";
import * as XLSX from "xlsx";
import { db } from "../firebase";
import { ref, push, update } from "firebase/database";
import "./UploadQuestions.css";

const UploadQuestions = ({ examId, onDone }) => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    const handleUpload = async () => {
        if (!file) {
            alert("Please select an Excel file");
            return;
        }

        setUploading(true);

        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const workbook = XLSX.read(e.target.result, { type: "binary" });
                const sheet = workbook.Sheets[workbook.SheetNames[0]];
                const rows = XLSX.utils.sheet_to_json(sheet);

                if (rows.length === 0) {
                    alert("Excel file is empty");
                    setUploading(false);
                    return;
                }

                const questionRef = ref(db, `examQuestions/${examId}`);

                for (const row of rows) {
                    if (!row.question || !row.correctAnswer) continue;

                    await push(questionRef, {
                        question: row.question,
                        options: {
                            A: row.optionA,
                            B: row.optionB,
                            C: row.optionC,
                            D: row.optionD
                        },
                        correctAnswer: row.correctAnswer,
                        explanation: row.explanation || "",
                        marks: Number(row.marks) || 1
                    });
                }

                await update(ref(db, `exams/${examId}`), {
                    questionsUploaded: true
                });

                alert("Questions uploaded successfully");
                onDone();
            } catch (err) {
                console.error(err);
                alert("Invalid Excel format");
            } finally {
                setUploading(false);
            }
        };

        reader.readAsBinaryString(file);
    };

    return (
        <div className= "upload-box" >
        <h3>Upload Questions(Excel) </h3>

            < input
    type = "file"
    accept = ".xlsx, .xls"
    onChange = {(e) => setFile(e.target.files[0])}
      />

    < button onClick = { handleUpload } disabled = { uploading } >
        { uploading? "Uploading...": "Upload" }
        </button>
        </div>
  );
};

export default UploadQuestions;
