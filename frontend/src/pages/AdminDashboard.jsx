import { useState, useEffect } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [pendingHospitals, setPendingHospitals] = useState([]);
  const [approvedHospitals, setApprovedHospitals] = useState([]);
  const [rejectedHospitals, setRejectedHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  // Axios Instance
  const axiosInstance = axios.create({
    baseURL: "http://localhost:8000", // Change to your backend URL
    withCredentials: true, // For handling cookies
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [
        usersRes,
        pendingHospitalsRes,
        approvedHospitalsRes,
        rejectedHospitalsRes,
      ] = await Promise.all([
        axiosInstance.get("/api/v1/admin/getUser"),
        axiosInstance.get("/api/v1/admin/getPendingHospitals"),
        axiosInstance.get("/api/v1/admin/getRejectedHospitals"),
        axiosInstance.get("/api/v1/admin/getApprovedHospitals"),
        axiosInstance.post("/api/v1/admin/approveOrDeclineHospital"),
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
  const approveOrDeclineHospital = async (hospitalId, isApproved) => {
    try {
      await axiosInstance.post(`/api/v1/admin/approveOrDeclineHospital`, {
        hospitalId,
        approved: isApproved,
      });
      alert(`Hospital ${isApproved ? "approved" : "rejected"} successfully.`);
      fetchData(); // Re-fetch data to update the UI
    } catch (err) {
      setError("Failed to update hospital status");
      console.error(err);
    }
  };
  const handleUserStatusChange = async (firebaseUid, newStatus) => {
    try {
      await axios.post("/api/v1/admin/updateUserStatus", {
        firebaseUid,
        status: newStatus,
      });
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.firebaseUid === firebaseUid
            ? { ...user, status: newStatus }
            : user
        )
      );
    } catch (err) {
      setError("Failed to update user status");
      console.error(err);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>

      {/* Users Section */}
      <section>
        <h2>Users</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((user) => (
              <tr key={user.firebaseUid}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.status ? "Active" : "Inactive"}</td>
                <td>
                  <button
                    onClick={() =>
                      handleUserStatusChange(user.firebaseUid, !user.status)
                    }
                  >
                    {user.status ? "Deactivate" : "Activate"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Pending Hospitals */}
      <section>
        <h2>Pending Hospitals</h2>
        <ul>
          {pendingHospitals?.map((hospital) => (
            <li key={hospital._id}>
              {hospital.name}
              <div>
                <button
                  onClick={() => approveOrDeclineHospital(hospital._id, true)}
                >
                  Approve
                </button>
                <button
                  onClick={() => approveOrDeclineHospital(hospital._id, false)}
                >
                  Reject
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Approved Hospitals */}
      <section>
        <h2>Approved Hospitals</h2>
        <ul>
          {approvedHospitals?.map((hospital) => (
            <li key={hospital._id}>{hospital.name}</li>
          ))}
        </ul>
      </section>

      {/* Rejected Hospitals */}
      <section>
        <h2>Rejected Hospitals</h2>
        <ul>
          {rejectedHospitals?.map((hospital) => (
            <li key={hospital._id}>{hospital.name}</li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default AdminDashboard;
