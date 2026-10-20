import React, { useState } from "react";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Login design is working! Authentication is not connected yet.");
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
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <div className="password-heading">
                <label htmlFor="password">Password</label>
                <a href="#forgot-password">
                  Forgot password?
                </a>
              </div>

              <div className="password-input">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
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

          <div className="login-divider">
            <span>YOUR CAMPUS COMMUNITY</span>
          </div>

          <p className="signup-text">
            Don't have an account?{" "}
            <a href="/register">Create account</a>
          </p>
        </div>

        <p className="login-footer">
          Connecting students, building communities.
        </p>

      </div>
    </div>
  );
}

export default Login;