import React, { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
} from "react-router-dom";

import Navbar from "./components/navbar";
import Home from "./pages/home";
import EventsPage from "./pages/events";
import EventDetailsPage from "./pages/eventdetails";
import AdminDashboard from "./pages/admindashboard";
import StudentDashboard from "./pages/studentdashboard";
import CreateEvent from "./pages/createevent";
import ManageStudents from "./pages/managestudents";
import ViewRegistrations from "./pages/viewregistrations";
import AdminLogin, {
  ProtectedAdminRoute,
} from "./pages/adminlogin.jsx";

import Feedback from "./pages/feedback.jsx";
import Notifications from "./pages/notifications.jsx";
// ==========================================
// STUDENT LOGIN
// ==========================================

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    alert(
      "Login design is working! Student authentication is not connected yet."
    );
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-brand">
          <div className="brand-icon">🎓</div>
          <h1>CampusConnect</h1>
          <p>Your campus. Your community.</p>
        </div>

        <div className="login-card">
          <h2>Welcome back!</h2>
          <p className="login-subtitle">
            Sign in to connect with your campus.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="login-email">Email address</label>
              <input
                id="login-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>

            <div className="form-group">
              <div className="password-heading">
                <label htmlFor="login-password">Password</label>
                <a href="#forgot-password">
                  Forgot password?
                </a>
              </div>

              <div className="password-input">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />

                <button
                  type="button"
                  className="toggle-password"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <label className="remember-row">
              <input type="checkbox" />
              Remember me
            </label>

            <button type="submit" className="login-button">
              Sign In
            </button>
          </form>

          <p className="signup-text">
            Don't have an account?{" "}
            <Link to="/register">Create account</Link>
          </p>
        </div>

        <p className="login-footer">
          Connecting students, building communities.
        </p>
      </div>
    </div>
  );
}

// ==========================================
// STUDENT REGISTRATION
// ==========================================

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const savedStudents = JSON.parse(
        localStorage.getItem("campusStudents") || "null"
      );

      const students = Array.isArray(savedStudents)
        ? savedStudents
        : [
            {
              id: "CC001",
              name: "Alex Johnson",
              email: "alex@example.com",
              course: "Computer Applications",
            },
            {
              id: "CC002",
              name: "Priya Sharma",
              email: "priya@example.com",
              course: "Information Technology",
            },
            {
              id: "CC003",
              name: "Daniel Smith",
              email: "daniel@example.com",
              course: "Computer Science",
            },
          ];

      const normalizedEmail = email.trim().toLowerCase();

      const emailExists = students.some(
        (student) =>
          student.email?.trim().toLowerCase() ===
          normalizedEmail
      );

      if (emailExists) {
        setError(
          "An account with this email already exists."
        );
        return;
      }

      const trimmedStudentId = studentId.trim();

      const idExists =
        trimmedStudentId &&
        students.some(
          (student) =>
            String(student.id).toLowerCase() ===
            trimmedStudentId.toLowerCase()
        );

      if (idExists) {
        setError("This Student ID is already in use.");
        return;
      }

      const newStudent = {
        id: trimmedStudentId || `CC${Date.now()}`,
        name: name.trim(),
        email: normalizedEmail,
        course: "Not specified",
      };

      const updatedStudents = [...students, newStudent];

      localStorage.setItem(
        "campusStudents",
        JSON.stringify(updatedStudents)
      );

      window.dispatchEvent(
        new Event("campusStudentsUpdated")
      );

      alert(
        "Account created successfully! You can now sign in."
      );

      setName("");
      setEmail("");
      setStudentId("");
      setPassword("");
      setConfirmPassword("");
      setShowPassword(false);
    } catch {
      setError(
        "Unable to save your account. Please try again."
      );
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-brand">
          <div className="register-brand-icon">🎓</div>
          <h1>CampusConnect</h1>
          <p>Your campus. Your community.</p>
        </div>

        <div className="register-card">
          <h2>Create your account</h2>
          <p className="register-subtitle">
            Join your campus community and stay connected.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="register-field">
              <label htmlFor="register-name">
                Full name
              </label>
              <input
                id="register-name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                required
              />
            </div>

            <div className="register-field">
              <label htmlFor="register-email">
                College email
              </label>
              <input
                id="register-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>

            <div className="register-field">
              <label htmlFor="register-student-id">
                Student ID (optional)
              </label>
              <input
                id="register-student-id"
                type="text"
                placeholder="Enter your student ID"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
              />
            </div>

            <div className="register-field">
              <label htmlFor="register-password">
                Password
              </label>

              <div className="register-password-input">
                <input
                  id="register-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  minLength={8}
                  required
                />

                <button
                  type="button"
                  className="register-toggle-password"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div className="register-field">
              <label htmlFor="register-confirm-password">
                Confirm password
              </label>
              <input
                id="register-confirm-password"
                type={showPassword ? "text" : "password"}
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                autoComplete="new-password"
                required
              />
            </div>

            {error && (
              <p className="register-error" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="register-button"
            >
              Create Account
            </button>
          </form>

          <p className="register-login-link">
            Already have an account?{" "}
            <Link to="/login">Sign in</Link>
          </p>
        </div>

        <p className="register-footer">
          Connecting students, building communities.
        </p>
      </div>
    </div>
  );
}

// ==========================================
// MAIN APP AND ROUTES
// ==========================================

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        {/* Public pages */}
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<EventsPage />} />
        <Route
          path="/events/:id"
          element={<EventDetailsPage />}
        />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/feedback" element={<Feedback />} />
        <Route
          path="/notifications"
          element={<Notifications />}
        />

        {/* Admin login */}
        <Route
          path="/admin-login"
          element={<AdminLogin />}
        />

        {/* Protected admin pages */}
        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <AdminDashboard />
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="/admin/create-event"
          element={
            <ProtectedAdminRoute>
              <CreateEvent />
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="/admin/students"
          element={
            <ProtectedAdminRoute>
              <ManageStudents />
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="/admin/registrations"
          element={
            <ProtectedAdminRoute>
              <ViewRegistrations />
            </ProtectedAdminRoute>
          }
        />

        {/* Student dashboard */}
        <Route
          path="/dashboard"
          element={<StudentDashboard />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;