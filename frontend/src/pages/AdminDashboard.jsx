import  { useState, useEffect } from "react";
import axios from "axios";
import "../styles/AdminDashboard.css";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [pendingHospitals, setPendingHospitals] = useState([]);
  const [approvedHospitals, setApprovedHospitals] = useState([]);
  const [rejectedHospitals, setRejectedHospitals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const axiosInstance = axios.create({
    baseURL: "http://localhost:8000/api/v1", // Replace with your backend URL
    withCredentials: true, // Handle cookies
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersRes, pendingRes, approvedRes, rejectedRes] =
        await Promise.all([
          axiosInstance.get("/users"),
          axiosInstance.get("/hospitals/pending"),
          axiosInstance.get("/hospitals/approved"),
          axiosInstance.get("/hospitals/rejected"),
        ]);

      setUsers(usersRes.data.data);
      setPendingHospitals(pendingRes.data.data);
      setApprovedHospitals(approvedRes.data.data);
      setRejectedHospitals(rejectedRes.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const handleUserAction = async (firebaseUid, action) => {
    try {
      const endpoint =
        action === "activate" ? "/users/status" : "/users/delete";
      const payload =
        action === "activate" ? { firebaseUid, status: true } : { firebaseUid };

      await axiosInstance.put(endpoint, payload);
      alert(`User ${action}d successfully`);
      fetchData(); // Refresh data
    } catch (err) {
      alert(`Failed to ${action} user: ${err.response?.data?.message}`);
    }
  };

  const handleHospitalAction = async (hospitalId, action) => {
    try {
      await axiosInstance.put("/hospitals/action", { hospitalId, action });
      alert(`Hospital ${action}d successfully`);
      fetchData(); // Refresh data
    } catch (err) {
      alert(`Failed to ${action} hospital: ${err.response?.data?.message}`);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>

      <section>
        <h2>All Users</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.firebaseUid}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <button
                    onClick={() =>
                      handleUserAction(user.firebaseUid, "activate")
                    }
                  >
                    Activate
                  </button>
                  <button
                    onClick={() => handleUserAction(user.firebaseUid, "delete")}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h2>Pending Hospitals</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingHospitals.map((hospital) => (
              <tr key={hospital._id}>
                <td>{hospital.name}</td>
                <td>{hospital.email}</td>
                <td>{hospital.status}</td>
                <td>
                  <button
                    onClick={() =>
                      handleHospitalAction(hospital._id, "approve")
                    }
                  >
                    Approve
                  </button>
                  <button
                    onClick={() =>
                      handleHospitalAction(hospital._id, "decline")
                    }
                  >
                    Decline
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h2>Approved Hospitals</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {approvedHospitals.map((hospital) => (
              <tr key={hospital._id}>
                <td>{hospital.name}</td>
                <td>{hospital.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h2>Rejected Hospitals</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {rejectedHospitals.map((hospital) => (
              <tr key={hospital._id}>
                <td>{hospital.name}</td>
                <td>{hospital.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default AdminDashboard;
