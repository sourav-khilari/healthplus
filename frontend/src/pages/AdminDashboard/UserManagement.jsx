import { useState, useEffect } from "react";
import axiosInstance from "../../axios/axios_interceptor";
import "../../styles/UserManagement.css"; // Import custom styles

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/superadmin/getUser");
      setUsers(response.data.data || []);
    } catch (err) {
      setError("Failed to fetch users.");
    } finally {
      setLoading(false);
    }
  };

  const handleUserStatusChange = async (firebaseUid, newStatus) => {
    try {
      await axiosInstance.post("/superadmin/updateUserStatus", {
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
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <p className="text-center text-xl">Loading users...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <section className="user-management-container">
      <h2 className="title">User Management</h2>

      <div className="table-container">
        <table className="user-table">
          <thead className="table-header">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.firebaseUid} className="table-row">
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <span
                    className={`status-text ${
                      user.status ? "active" : "inactive"
                    }`}
                  >
                    {user.status ? "Active" : "Inactive"}
                  </span>
                </td>
                <td>
                  <button
                    onClick={() =>
                      handleUserStatusChange(user.firebaseUid, !user.status)
                    }
                    className={`status-button ${
                      user.status ? "deactivate" : "activate"
                    }`}
                  >
                    {user.status ? "Deactivate" : "Activate"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default UserManagement;
