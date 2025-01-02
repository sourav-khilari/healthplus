import { useState, useEffect } from "react";
import axios from "axios";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:8000/api/v1/superadmin/getUser"
      );
      setUsers(response.data.data || []);
    } catch (err) {
      setError("Failed to fetch users.");
    } finally {
      setLoading(false);
    }
  };

  const handleUserStatusChange = async (firebaseUid, newStatus) => {
    try {
      await axios.post(
        "http://localhost:8000/api/v1/superadmin/updateUserStatus",
        {
          firebaseUid,
          status: newStatus,
        }
      );
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
    <section className="container mx-auto p-6">
      <h2 className="text-3xl font-semibold mb-4 text-center">
        User Management
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto bg-white shadow-md rounded-lg border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left font-medium text-gray-600">
                Name
              </th>
              <th className="px-4 py-2 text-left font-medium text-gray-600">
                Email
              </th>
              <th className="px-4 py-2 text-left font-medium text-gray-600">
                Role
              </th>
              <th className="px-4 py-2 text-left font-medium text-gray-600">
                Status
              </th>
              <th className="px-4 py-2 text-left font-medium text-gray-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.firebaseUid} className="hover:bg-gray-50">
                <td className="px-4 py-2">{user.name}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2">{user.role}</td>
                <td className="px-4 py-2">
                  <span
                    className={`${
                      user.status ? "text-green-500" : "text-red-500"
                    } font-semibold`}
                  >
                    {user.status ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={() =>
                      handleUserStatusChange(user.firebaseUid, !user.status)
                    }
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300"
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
