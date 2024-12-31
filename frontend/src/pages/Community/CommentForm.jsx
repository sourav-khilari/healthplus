<<<<<<< HEAD
import { useState } from "react";
import axiosInstance from "../../axios/axios_interceptor.js";
import { useParams, useNavigate } from "react-router"; // Import useParams and useNavigate

const CommentForm = () => {
  const { postId, role } = useParams(); // Get postId and role from URL params
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // For redirecting to Post Details page

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return; // Prevent submitting empty comment

    setLoading(true);
    setError(null); // Reset error message
    try {
      // Conditional route based on the role
      if (role === "admin") {
        // If the role is 'admin', post the comment to admin route
        await axiosInstance.post(`/admin/addcomment`, { postId, comment });
      } else {
        // Default route for users
        await axiosInstance.post("/users/addcomment", { postId, comment });
      }

      setComment(""); // Reset comment field after successful submission

      // Navigate to the Post Details page after comment submission
      navigate(`/Community/PostDetail/${postId}/${role}`);
    } catch (error) {
      console.error("Error adding comment", error);
      setError("Failed to add comment. Please try again.");
    } finally {
      setLoading(false); // Reset loading state
=======
import  { useState } from "react";
import axios from "axios";
// Axios Instance
  const axiosInstance = axios.create({
    baseURL: "http://localhost:8000/api/v1", // Change to your backend URL
    withCredentials: true, // For handling cookies
  });

const CommentForm = ({ postId }) => {
  const [comment, setComment] = useState("");

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/users/addcomment", { postId, comment });
      setComment("");
    } catch (error) {
      console.error("Error adding comment", error);
>>>>>>> ae0507c8ba6ac7a8e84e8ef42488dbb392155bbe
    }
  };

  return (
<<<<<<< HEAD
    <form onSubmit={handleCommentSubmit} className="comment-form">
=======
    <form onSubmit={handleCommentSubmit}>
>>>>>>> ae0507c8ba6ac7a8e84e8ef42488dbb392155bbe
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Add a comment..."
        required
        className="textarea"
      />
<<<<<<< HEAD
      <div className="flex justify-between items-center">
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Submitting..." : "Submit Comment"}
        </button>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
=======
      <button type="submit" className="btn btn-primary">
        Submit Comment
      </button>
>>>>>>> ae0507c8ba6ac7a8e84e8ef42488dbb392155bbe
    </form>
  );
};

export default CommentForm;
