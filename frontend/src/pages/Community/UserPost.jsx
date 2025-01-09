import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom"; // Import necessary hooks and components
import axiosInstance from "../../axios/axios_interceptor.js";
import "../../styles/UserPost.css"
const UserPost = () => {
  const { role } = useParams(); // Fetch the role from the URL params
  const navigate = useNavigate(); // Hook for programmatic navigation
  const [userPosts, setUserPosts] = useState([]);

  useEffect(() => {
    // Check if the role is valid before fetching posts
    if (role !== "user" && role !== "admin") {
      // Redirect to error page if the role is invalid
      navigate("/error");
      return;
    }

    const fetchUserPosts = async () => {
      try {
        let response;

        // Fetch posts based on the role
        if (role === "admin") {
          response = await axiosInstance.get("/admin/getUserPosts"); // Admin endpoint
        } else {
          response = await axiosInstance.get("/users/getUserPosts"); // User endpoint
        }

        // Ensure unique posts are returned
        const uniquePosts = Array.from(
          new Set(response.data.data.map((a) => a._id))
        ).map((id) => response.data.data.find((a) => a._id === id));
        setUserPosts(uniquePosts); // Update state with the unique posts
      } catch (error) {
        console.error("Error fetching user posts", error);
      }
    };

    fetchUserPosts();
  }, [role, navigate]); // Re-fetch when the role or navigate changes

  return (
    <div className="user-post-container">
      <h1 className="user-post-title">Your Posts</h1>
      {userPosts.length === 0 ? (
        <p className="user-post-empty-message">
          You have not created any posts yet.
        </p>
      ) : (
        <div className="user-post-grid">
          {userPosts.map((post) => (
            <div key={post._id} className="user-post-card">
              <h3 className="user-post-card-title">{post.title}</h3>
              <p className="user-post-card-description">{post.discription}</p>
              <Link
                to={`/Community/PostDetail/${post._id}/${role}`} // Dynamic route based on role
                className="user-post-card-link"
              >
                View Post
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserPost;
