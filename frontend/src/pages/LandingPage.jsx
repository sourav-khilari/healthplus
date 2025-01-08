import { useNavigate } from "react-router-dom";
import "../styles/LandingPage.css";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <h1>Welcome to HealthPlus</h1>
      <p>Select your role to continue</p>

      <div className="landing-buttons">
        {/* User Section */}
        <div className="role-section">
          <h2>For Users</h2>
          <div className="button-group">
            <button
              className="landing-button user-button"
              onClick={() => navigate("/user/login")}
            >
              User Login
            </button>
            <button
              className="landing-button user-button"
              onClick={() => navigate("/user/register")}
            >
              User Register
            </button>
          </div>
        </div>

        {/* Hospital Section */}
        <div className="role-section">
          <h2>For Hospitals</h2>
          <div className="button-group">
            <button
              className="landing-button hospital-button"
              onClick={() => navigate("/hospital/login")}
            >
              Hospital Login
            </button>
            <button
              className="landing-button hospital-button"
              onClick={() => navigate("/hospital/register")}
            >
              Hospital Register
            </button>
          </div>
        </div>

        {/* Doctor Section */}
        <div className="role-section">
          <h2>For Doctors</h2>
          <div className="button-group">
            <button
              className="landing-button doctor-button"
              onClick={() => navigate("/online-doctor/login")}
            >
              Doctor Login
            </button>
            <button
              className="landing-button doctor-button"
              onClick={() => navigate("/online-doctor/register")}
            >
              Doctor Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
