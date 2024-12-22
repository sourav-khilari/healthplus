import { useNavigate } from "react-router-dom";

const UserDashboard = () => {
  const navigate = useNavigate();

  const handleViewSlots = () => {
    navigate("/appointment");
  };

  return (
    <div>
      <h1>Welcome to Your Dashboard</h1>

      <div>
        <button>
          {" "}
          <a href="/findhospital">Find Nearest Hospitals</a>
        </button>
        <button>
          <a href="/findPharmacy"> Find Nearest Pharmacies</a>
        </button>
        <button onClick={handleViewSlots}>View/Manage Appointments</button>
      </div>
    </div>
  );
};

export default UserDashboard;
