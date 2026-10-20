import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";

const API_URL = "http://localhost:3000";

export function ProtectedAdminRoute({ children }) {
  const [status, setStatus] = useState("checking");
  const token = localStorage.getItem("campusAdminToken");

  React.useEffect(() => {
    let active = true;

    async function verifyAdmin() {
      if (!token) {
        if (active) setStatus("denied");
        return;
      }

      try {
        const response = await fetch(`${API_URL}/api/admin/verify`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (active) {
          setStatus(response.ok ? "allowed" : "denied");
        }
      } catch {
        if (active) setStatus("error");
      }
    }

    verifyAdmin();

    return () => {
      active = false;
    };
  }, [token]);

  if (status === "checking") {
    return <p style={{ padding: "40px" }}>Checking admin access...</p>;
  }

  if (status === "error") {
    return (
      <p style={{ padding: "40px" }}>
        Cannot connect to the server. Please check that your backend is running.
      </p>
    );
  }

  if (status !== "allowed") {
    return <Navigate to="/admin-login" replace />;
  }

  return children;
}

export default function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Login failed. Please try again.");
        return;
      }

      if (!data.token) {
        setError("The server did not return a login token.");
        return;
      }

      localStorage.setItem("campusAdminToken", data.token);
      navigate("/admin", { replace: true });
    } catch {
      setError(
        "Unable to connect to the server. Make sure your backend is running."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "85vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        background: "#f3f6fb",
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: "420px",
          padding: "32px",
          borderRadius: "18px",
          background: "#ffffff",
          boxShadow: "0 12px 35px rgba(20, 40, 80, 0.12)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div style={{ fontSize: "42px" }}>🛡️</div>
          <h1 style={{ marginBottom: "8px", color: "#172554" }}>
            Admin Login
          </h1>
          <p style={{ color: "#64748b", margin: 0 }}>
            Sign in to manage CampusConnect
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <label
            htmlFor="admin-username"
            style={{ display: "block", marginBottom: "8px" }}
          >
            Admin username
          </label>
          <input
            id="admin-username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
            style={{
              boxSizing: "border-box",
              width: "100%",
              padding: "13px",
              marginBottom: "20px",
              border: "1px solid #cbd5e1",
              borderRadius: "8px",
            }}
          />

          <label
            htmlFor="admin-password"
            style={{ display: "block", marginBottom: "8px" }}
          >
            Password
          </label>
          <input
            id="admin-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
            style={{
              boxSizing: "border-box",
              width: "100%",
              padding: "13px",
              marginBottom: "20px",
              border: "1px solid #cbd5e1",
              borderRadius: "8px",
            }}
          />

          {error && (
            <p role="alert" style={{ color: "#b91c1c" }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              border: "none",
              borderRadius: "8px",
              background: "#1d4ed8",
              color: "#ffffff",
              fontWeight: "bold",
              cursor: loading ? "wait" : "pointer",
            }}
          >
            {loading ? "Signing in..." : "Sign In as Admin"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "24px" }}>
          <Link to="/" style={{ color: "#1d4ed8" }}>
            Back to Home
          </Link>
        </p>
      </section>
    </main>
  );
}