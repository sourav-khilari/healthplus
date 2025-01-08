import { useState } from "react";
import axiosInstance from "../../axios/axios_interceptor.js";
import { useNavigate } from "react-router-dom";

import "../../styles/Login.css"; // Use the same stylesheet as the Login component

const OnlineDoctorLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(""); // for registration
  const [confirmPassword, setConfirmPassword] = useState(""); // for registration
  const [isLogin, setIsLogin] = useState(true); // toggle between login and registration
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axiosInstance.post("/online doctor/login", {
        email,
        password,
      });
      setLoading(false);
      if (response.data.success) {
        navigate("/online doctor/dashboard");
      } else {
        setError("Invalid email or password.");
      }
    } catch (err) {
      setLoading(false);
      setError("An error occurred. Please try again.");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setLoading(false);
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await axiosInstance.post("/online doctor/register", {
        email,
        password,
        name,
      });
      setLoading(false);
      if (response.data.success) {
        navigate("/online doctor/login");
      } else {
        setError("Registration failed. Please try again.");
      }
    } catch (err) {
      setLoading(false);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1 className="login-title">
          {isLogin ? "Online Doctor Login" : "Online Doctor Registration"}
        </h1>
        <div className="form-container">
          {!isLogin && (
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
              required
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
            required
          />
          {!isLogin && (
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input-field"
              required
            />
          )}
          {error && <p className="error-text">{error}</p>}
          <button
            onClick={isLogin ? handleLogin : handleRegister}
            disabled={loading}
            className="email-login-btn"
          >
            {loading
              ? isLogin
                ? "Logging in..."
                : "Registering..."
              : isLogin
              ? "Login"
              : "Register"}
          </button>
          <p className="or-text">or</p>
          <p className="toggle-text">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
          </p>
          <button
            onClick={() => navigate("/online-doctor/register")}
            className="toggle-btn"
          >
            {isLogin ? "Register Here" : "Login Here"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnlineDoctorLogin;
