import { useState, useEffect } from "react";
import axiosInstance from "../../axios/axios_interceptor.js";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams, useNavigate } from "react-router-dom"; // Import useParams and useNavigate
import "../../styles/DeletePostPage.css"; // Custom styles for the delete post page

const DeletePost = () => {
  const { role } = useParams(); // Extract role from URL params
  const navigate = useNavigate(); // For navigation if needed
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Axios instance for making requests
  // Fetch posts based on the role
  const fetchPosts = async () => {
    try {
      let response;

      if (role === "admin") {
        // Fetch posts for admin
        response = await axiosInstance.get("/admin/getAllPosts");
      } else if (role === "user") {
        // Fetch posts for regular user
        response = await axiosInstance.get("/user/getUserPosts");
      } else {
        // Handle invalid role case (e.g., redirect to home page or show an error)
        toast.error("Invalid role.");
        navigate("/Community"); // Navigate to homepage or another page
        return;
      }

      setPosts(response.data.posts); // Assuming the response contains an array of posts
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error(error.response?.data?.message || "Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  // Handle deleting a post
  const handleDeletePost = async (postId) => {
    try {
      let response;

      if (role === "admin") {
        // Admin deletes a post
        response = await axiosInstance.delete(`/admin/posts/${postId}`);
      } else if (role === "user") {
        // Regular user deletes a post
        response = await axiosInstance.delete(`/user/posts/${postId}`);
      } else {
        toast.error("Invalid role.");
        return;
      }

      toast.success(response.data.message || "Post deleted successfully!");
      // Re-fetch the posts after deletion
      fetchPosts();
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error(error.response?.data?.message || "Failed to delete post");
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [role]); // Re-fetch posts if the role changes

  return (
    <div className="delete-post-page">
      <h2>Your Posts</h2>

      {loading ? (
        <p>Loading your posts...</p>
      ) : (
        <>
          {posts.length === 0 ? (
            <p>You have no posts to delete.</p>
          ) : (
            <ul className="posts-list">
              {posts.map((post) => (
                <li key={post.id} className="post-item">
                  <div className="post-content">
                    <h3>{post.title}</h3>
                    <p>{post.content}</p>
                    <span className="post-time">
                      {new Date(post.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDeletePost(post.id)}
                    className="delete-btn"
                  >
                    Delete Post
                  </button>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
};

export default DeletePost;
