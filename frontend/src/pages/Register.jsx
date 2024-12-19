import  { useState } from "react";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
// import "./Register.css";

const Register = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const auth = getAuth();

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      console.log("User registered:", userCredential.user);
      setSuccess(true);
      setError(null);
    } catch (err) {
      console.error("Error during registration:", err);
      setError(err.message);
      setSuccess(false);
    }
  };

  return (
    <div className="register-container">
      <h1>Register</h1>
      <form onSubmit={handleRegister} className="register-form">
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit" className="register-button">
          Register
        </button>
      </form>
      {error && <p className="error-message">Error: {error}</p>}
      {success && <p className="success-message">Registration successful!</p>}
    </div>
  );
};

export default Register;
