import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axios/axios_interceptor.js";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [pendingHospitals, setPendingHospitals] = useState([]);
  const [approvedHospitals, setApprovedHospitals] = useState([]);
  const [rejectedHospitals, setRejectedHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [
          usersRes,
          pendingHospitalsRes,
          approvedHospitalsRes,
          rejectedHospitalsRes,
        ] = await Promise.all([
          axiosInstance.get("/superadmin/getUser"),
          axiosInstance.get("/superadmin/getPendingHospitals"),
          axiosInstance.get("/superadmin/getApprovedHospitals"),
          axiosInstance.get("/superadmin/getRejectedHospitals"),
        ]);

        setUsers(usersRes.data.data || []);
        setPendingHospitals(pendingHospitalsRes.data.data || []);
        setApprovedHospitals(approvedHospitalsRes.data.data || []);
        setRejectedHospitals(rejectedHospitalsRes.data.data || []);
      } catch (err) {
        setError("Failed to fetch data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleNavigation = (page) => {
    navigate(`/admindashboard/${page}`);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500 text-center">{error}</p>;
  }

  return (
    <div className="admin-dashboard container mx-auto p-6">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {/* Users */}
        <button
          className="bg-gradient-to-r from-blue-500 to-blue-700 text-white py-6 px-8 rounded-lg shadow-lg border-2 border-blue-700 hover:scale-105 transform transition-all"
          onClick={() => handleNavigation("users")}
        >
          <h3 className="text-2xl font-semibold mb-2">Users</h3>
          <p className="text-lg">Total: {users.length}</p>
        </button>

        {/* Pending Hospitals */}
        <button
          className="bg-gradient-to-r from-yellow-500 to-yellow-700 text-white py-6 px-8 rounded-lg shadow-lg border-2 border-yellow-700 hover:scale-105 transform transition-all"
          onClick={() => handleNavigation("pendingHospitals")}
        >
          <h3 className="text-2xl font-semibold mb-2">Pending Hospitals</h3>
          <p className="text-lg">Total: {pendingHospitals.length}</p>
        </button>

        {/* Approved Hospitals */}
        <button
          className="bg-gradient-to-r from-green-500 to-green-700 text-white py-6 px-8 rounded-lg shadow-lg border-2 border-green-700 hover:scale-105 transform transition-all"
          onClick={() => handleNavigation("approvedHospitals")}
        >
          <h3 className="text-2xl font-semibold mb-2">Approved Hospitals</h3>
          <p className="text-lg">Total: {approvedHospitals.length}</p>
        </button>

        {/* Rejected Hospitals */}
        <button
          className="bg-gradient-to-r from-red-500 to-red-700 text-white py-6 px-8 rounded-lg shadow-lg border-2 border-red-700 hover:scale-105 transform transition-all"
          onClick={() => handleNavigation("rejectedHospitals")}
        >
          <h3 className="text-2xl font-semibold mb-2">Rejected Hospitals</h3>
          <p className="text-lg">Total: {rejectedHospitals.length}</p>
        </button>

        {/* Community */}
        <button
          className="bg-gradient-to-r from-purple-500 to-purple-700 text-white py-6 px-8 rounded-lg shadow-lg border-2 border-purple-700 hover:scale-105 transform transition-all"
          onClick={() => navigate("/Community/admin")}
        >
          <h3 className="text-2xl font-semibold mb-2">Community</h3>
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
