import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // For navigation
import axios from "axios";
import "../styles/Common.css"; // Import common CSS (you can still use this if you want extra custom styles)

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [pendingHospitals, setPendingHospitals] = useState([]);
  const [approvedHospitals, setApprovedHospitals] = useState([]);
  const [rejectedHospitals, setRejectedHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate(); // Use React Router for navigation

  // Axios Instance
  const axiosInstance = axios.create({
    baseURL: "http://localhost:8000", // Change to your backend URL
    withCredentials: true, // For handling cookies
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [
        usersRes,
        pendingHospitalsRes,
        approvedHospitalsRes,
        rejectedHospitalsRes,
      ] = await Promise.all([
        axiosInstance.get("/api/v1/superadmin/getUser"),
        axiosInstance.get("/api/v1/superadmin/getPendingHospitals"),
        axiosInstance.get("/api/v1/superadmin/getApprovedHospitals"),
        axiosInstance.get("/api/v1/superadmin/getRejectedHospitals"),
      ]);

      setUsers(usersRes.data.data || []);
      setPendingHospitals(pendingHospitalsRes.data.data || []);
      setApprovedHospitals(approvedHospitalsRes.data.data || []);
      setRejectedHospitals(rejectedHospitalsRes.data.data || []);
    } catch (err) {
      setError("Failed to fetch data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Navigate to different sections based on button clicks
  const navigateToPage = (page) => {
    navigate(`/admindashboard/${page}`); // Use navigate instead of useHistory
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500 text-center">{error}</p>;
  }

  return (
    <div className="admin-dashboard container mx-auto p-5">
      <h1 className="text-3xl font-semibold text-center mb-6">
        Admin Dashboard
      </h1>

      {/* Dashboard Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <button
          className="bg-blue-500 text-white p-5 rounded-lg shadow-lg hover:bg-blue-600 transition-all duration-300"
          onClick={() => navigateToPage("users")}
        >
          <h3 className="text-xl font-medium">Users</h3>
          {/* <p>Total Users: {users.length}</p> */}
        </button>

        <button
          className="bg-yellow-500 text-white p-5 rounded-lg shadow-lg hover:bg-yellow-600 transition-all duration-300"
          onClick={() => navigateToPage("pendingHospitals")}
        >
          <h3 className="text-xl font-medium">Pending Hospitals</h3>
          {/* <p>Total Pending: {pendingHospitals.length}</p> */}
        </button>

        <button
          className="bg-green-500 text-white p-5 rounded-lg shadow-lg hover:bg-green-600 transition-all duration-300"
          onClick={() => navigateToPage("approvedHospitals")}
        >
          <h3 className="text-xl font-medium">Approved Hospitals</h3>
          {/* <p>Total Approved: {approvedHospitals.length}</p> */}
        </button>

        <button
          className="bg-red-500 text-white p-5 rounded-lg shadow-lg hover:bg-red-600 transition-all duration-300"
          onClick={() => navigateToPage("rejectedHospitals")}
        >
          <h3 className="text-xl font-medium">Rejected Hospitals</h3>
          {/* <p>Total Rejected: {rejectedHospitals.length}</p> */}
        </button>

        {/* Community Button */}
        <button
          className="bg-purple-500 text-white p-5 rounded-lg shadow-lg hover:bg-purple-600 transition-all duration-300"
          onClick={() => navigate("/Community/admin")}
        >
          <h3 className="text-xl font-medium">Community</h3>
        </button>
      </div>

      {/* Error and Success Messages */}
      {error && <p className="text-red-500 text-center">{error}</p>}
    </div>
  );
};

export default AdminDashboard;
