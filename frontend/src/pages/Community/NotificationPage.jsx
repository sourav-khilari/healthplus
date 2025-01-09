import { useState, useEffect } from "react";
import axiosInstance from "../../axios/axios_interceptor.js";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../styles/NotificationsPage.css";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch notifications on page load
  const fetchNotifications = async () => {
    try {
      const response = await axiosInstance.get("/user/getNotifications");
      setNotifications(response.data.notifications);
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
    <div className="notifications-page-container">
      <h2 className="notifications-page-title">Notifications</h2>

      {loading ? (
        <p className="notifications-loading">Loading notifications...</p>
      ) : (
        <>
          {notifications.length === 0 ? (
            <p className="notifications-empty">No notifications available.</p>
          ) : (
            <ul className="notifications-list">
              {notifications.map((notification) => (
                <li key={notification.id} className="notification-item">
                  <div className="notification-details">
                    <p className="notification-message">
                      {notification.message}
                    </p>
                    <span className="notification-timestamp">
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
