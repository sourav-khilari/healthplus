import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../styles/DeletePostPage.css"; // Custom styles for the delete post page

const DeletePostPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Axios instance for making requests
  const axiosInstance = axios.create({
    baseURL: "http://localhost:8000/api/v1", // Backend URL
    withCredentials: true, // To send cookies for authentication
  });

  // Fetch posts of the user
  const fetchUserPosts = async () => {
    try {
      const response = await axiosInstance.get("/users/getUserPosts");
      setPosts(response.data.posts); // Assuming the response contains an array of user posts
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
      const response = await axiosInstance.delete(`/user/posts/${postId}`);
      toast.success(response.data.message || "Post deleted successfully!");
      // Re-fetch the posts after deletion
      fetchUserPosts();
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error(error.response?.data?.message || "Failed to delete post");
    }
  };

  useEffect(() => {
    fetchUserPosts();
  }, []);

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

export default DeletePostPage;
