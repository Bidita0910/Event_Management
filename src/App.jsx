import {getDatabase,ref,set} from "firebase/database";
import VerifyEmail from "./VerifyEmail";
import { app } from "./firebase";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Login from "./login";
import Registration from "./User/Registration";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";
import UserDashboard from "./User/UserDashboard";
import AdminRegistration from "./Admin/AdminRegistration";
import AdminDashboard from "./Admin/AdminDashboard";
import ViewUserDetails from "./Admin/ViewUserDetails";
import StartExam from "./User/StartExam";
import "./App.css";
import ExamSubmitted from "./User/ExamSubmitted";  
import ExamPreview from "./Admin/ExamPreview";
import VendorRegistration from "./Vendor/VendorRegistration";
import VendorDashboard from "./Vendor/VendorDashboard";

const db = getDatabase(app);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/admin-register" element={<AdminRegistration />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin/user/:uid" element={<ViewUserDetails />} />
        <Route path="/exam/:examId" element={<StartExam />} />
        <Route path="/exam-submitted" element={<ExamSubmitted/>}/>
        <Route path="/exam-preview/:examId" element={<ExamPreview/>}/>
        <Route path="/vendor-register" element={<VendorRegistration />}/>
        <Route path="/vendor-dashboard" element={<VendorDashboard />} />

      </Routes>
    </Router>
  );
}

export default App;
