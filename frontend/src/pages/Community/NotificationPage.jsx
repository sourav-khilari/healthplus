import { useState, useEffect } from "react";
import axiosInstance from "../../axios/axios_interceptor.js"; // Ensure consistent axios instance
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../styles/NotificationPage.css"; // Custom styles for the notifications page

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

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
  }, []); // Empty dependency array to fetch notifications on component mount

  return (
    <div className="notifications-page">
      <h2>Notifications</h2>

      {loading ? (
        <p>Loading notifications...</p> // Replace with a spinner or skeleton loader if needed
      ) : (
        <>
          {notifications.length === 0 ? (
            <p>No notifications available.</p> // Message when there are no notifications
          ) : (
            <ul className="notifications-list">
              {notifications.map((notification) => (
                <li key={notification.id} className="notification-item">
                  <div className="notification-content">
                    <p>{notification.message}</p>{" "}
                    {/* Display the notification message */}
                    <span className="notification-time">
                      {/* Format and display the notification timestamp */}
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
