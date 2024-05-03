import React, { useState } from "react";
import {  useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./login.css";

import logo from "./logo.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [invalidCreds, setInvalidCreds] = useState(false);
  const [userRole, setUserRole] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Error! Please fill in all mandatory fields.");
      return;
    }

    try {
      console.log("REACT_APP_URL2:", process.env.REACT_APP_URL2);
      const response = await axios.post(`${process.env.REACT_APP_URL2}/login`, {
        email,
        password,
      });

      if (response.status === 200) {
        const data = response.data;
        localStorage.setItem("token", data.token);
        if (data.success) {
          console.log("Login successful!", data);
          setUserRole(data.role);
          switch (data.role) {
            case "Employee":
              navigate("/employeeHome", { state: { id: email } });
              break;
            case "ProjectManager":
              navigate("/projManagerHome", { state: { id: email } });
              break;
            case "HRManager":
              navigate("/HrManagerHome", { state: { id: email } });
              break;
            case "SuperAdmin":
              navigate("/superAdminHome", { state: { id: email } });
              break;
            default:
              console.error("Unknown role:", data.role);
          }
        } else {
          setInvalidCreds(true);
          setError("Invalid credentials. Please enter them again.");
          console.error("Login failed:", data.message);
        }
      } else {
        setInvalidCreds(true);
        setError("Invalid credentials. Please enter again.");
        console.error("Login failed:", response.statusText);
      }
    } catch (error) {
      setInvalidCreds(true);
      setError("Invalid credentials. Please enter again.");
      console.error("Error during login:", error.message);
    }
  };

  return (
    <div className="login-container">
      {/* Image Container */}
      <div className="image-container">
        <h1 className="white-text">
          The Future <br></br>Through Tech
        </h1>
      </div>

      {/* Login Form Container */}
      <div className="login-form-container">
        {/* Logo Container */}
        <div className="logo-container">
          <img src={logo} alt="Logo" className="logo-image" />
          <span className="logo-text">Devsinc</span>
        </div>

        {/* Welcome Back and Email Information Container */}
        <div className="welcome-container">
          <form onSubmit={handleLogin} className="login-form">
            <div className="login-header">
              <h1>Welcome Back</h1>
              <p>Enter your email and password to access your account</p>
            </div>
            {/* <div className="mb-3"> */}
            <div className={`mb-3 ${invalidCreds ? "error" : ""}`}>
              <label htmlFor="email">
                <div className="email-pw-text">
                  <span>Email</span>
                </div>
              </label>
              <input
                name="email"
                type="email"
                placeholder="Enter your email"
                // className="form-control"
                className={`form-control ${invalidCreds ? "error-border" : ""}`}
                autoComplete="off"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {/* <div className="mb-3"> */}
            <div className={`mb-3 ${invalidCreds ? "error" : ""}`}>
              <label htmlFor="password">
                <div className="email-pw-text">
                  <span>Password</span>
                </div>
              </label>
              <input
                name="password"
                type="password"
                placeholder="Enter your password"
                // className="form-control"
                className={`form-control ${invalidCreds ? "error-border" : ""}`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {invalidCreds && (
              <div className="error-message-login">
                <p>{error}</p>
              </div>
            )}
            {/* Remember Me Checkbox */}
            <div className="checkbox">
              <input
                type="checkbox"
                id="rememberMe"
                name="rememberMe"
                className="form-check-input"
              />
              <label htmlFor="rememberMe" className="form-check-label">
                Remember Me
              </label>
            </div>
            <div className="login-button">
              <button className="btn rounded" type="submit">
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
