import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../styles/NotificationPage.css"; // Custom styles for the notifications page

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Axios instance for making requests
  const axiosInstance = axios.create({
    baseURL: "http://localhost:8000/api/v1", // Backend URL
    withCredentials: true, // To send cookies for authentication
  });

  // Fetch notifications on page load
  const fetchNotifications = async () => {
    try {
      const response = await axiosInstance.get("/user/getNotifications");
      setNotifications(response.data.notifications); // Assuming the response contains an array of notifications
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast.error(
        error.response?.data?.message || "Failed to load notifications"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="notifications-page">
      <h2>Notifications</h2>

      {loading ? (
        <p>Loading notifications...</p>
      ) : (
        <>
          {notifications.length === 0 ? (
            <p>No notifications available.</p>
          ) : (
            <ul className="notifications-list">
              {notifications.map((notification) => (
                <li key={notification.id} className="notification-item">
                  <div className="notification-content">
                    <p>{notification.message}</p>
                    <span className="notification-time">
                      {new Date(notification.timestamp).toLocaleString()}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
};

export default NotificationsPage;
