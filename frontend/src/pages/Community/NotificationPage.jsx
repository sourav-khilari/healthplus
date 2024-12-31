import { useState, useEffect } from "react";
<<<<<<< HEAD
import axiosInstance from "../../axios/axios_interceptor.js";
=======
import axios from "axios";
>>>>>>> ae0507c8ba6ac7a8e84e8ef42488dbb392155bbe
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../styles/NotificationPage.css"; // Custom styles for the notifications page

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

<<<<<<< HEAD
  // Fetch notifications on page load
  const fetchNotifications = async () => {
    try {
      const response = await axiosInstance.get("/user/getNotifications");
=======
  // Axios instance for making requests
  const axiosInstance = axios.create({
    baseURL: "http://localhost:8000/api/v1", // Backend URL
    withCredentials: true, // To send cookies for authentication
  });

  // Fetch notifications on page load
  const fetchNotifications = async () => {
    try {
      const response = await axiosInstance.get("/users/getNotifications");
>>>>>>> ae0507c8ba6ac7a8e84e8ef42488dbb392155bbe
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
<<<<<<< HEAD
  }, []); // Empty dependency array to fetch notifications on component mount
=======
  }, []);
>>>>>>> ae0507c8ba6ac7a8e84e8ef42488dbb392155bbe

  return (
    <div className="notifications-page">
      <h2>Notifications</h2>

      {loading ? (
<<<<<<< HEAD
        <p>Loading notifications...</p> // You can replace this with a spinner or skeleton loader
      ) : (
        <>
          {notifications.length === 0 ? (
            <p>No notifications available.</p> // No notifications message
=======
        <p>Loading notifications...</p>
      ) : (
        <>
          {notifications.length === 0 ? (
            <p>No notifications available.</p>
>>>>>>> ae0507c8ba6ac7a8e84e8ef42488dbb392155bbe
          ) : (
            <ul className="notifications-list">
              {notifications.map((notification) => (
                <li key={notification.id} className="notification-item">
                  <div className="notification-content">
<<<<<<< HEAD
                    <p>{notification.message}</p> {/* Display the notification message */}
                    <span className="notification-time">
                      {/* Display notification timestamp */}
=======
                    <p>{notification.message}</p>
                    <span className="notification-time">
>>>>>>> ae0507c8ba6ac7a8e84e8ef42488dbb392155bbe
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
