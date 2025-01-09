import { useState, useEffect } from "react";
import axiosInstance from "../../axios/axios_interceptor.js";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams, useNavigate } from "react-router-dom";
import "../../styles/DeletePostPage.css";

const DeletePost = () => {
  const { role } = useParams();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch posts based on the user's role
  const fetchPosts = async () => {
    try {
      let response;

      if (role === "admin") {
        response = await axiosInstance.get("/admin/getAllPosts");
      } else if (role === "user") {
        response = await axiosInstance.get("/user/getUserPosts");
      } else {
        toast.error("Invalid role.");
        navigate("/Community");
        return;
      }

      setPosts(response.data.posts);
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
        response = await axiosInstance.delete(`/admin/posts/${postId}`);
      } else if (role === "user") {
        response = await axiosInstance.delete(`/user/posts/${postId}`);
      } else {
        toast.error("Invalid role.");
        return;
      }

      toast.success(response.data.message || "Post deleted successfully!");
      fetchPosts();
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error(error.response?.data?.message || "Failed to delete post");
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [role]);

  return (
    <div className="delete-post-page-container">
      <h2 className="delete-post-title">Your Posts</h2>

      {loading ? (
        <p className="delete-post-loading">Loading your posts...</p>
      ) : (
        <>
          {posts.length === 0 ? (
            <p className="delete-post-empty">You have no posts to delete.</p>
          ) : (
            <ul className="delete-post-list">
              {posts.map((post) => (
                <li key={post.id} className="delete-post-item">
                  <div className="delete-post-content">
                    <h3 className="delete-post-title">{post.title}</h3>
                    <p className="delete-post-body">{post.content}</p>
                    <span className="delete-post-time">
                      {new Date(post.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDeletePost(post.id)}
                    className="delete-post-btn"
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
