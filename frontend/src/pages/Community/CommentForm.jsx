import { useState } from "react";
import axiosInstance from "../../axios/axios_interceptor.js";
import { useParams, useNavigate } from "react-router-dom"; // Updated to use react-router-dom

const CommentForm = () => {
  const { postId, role } = useParams(); // Extract postId and role from URL params
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return; // Prevent empty comments

    setLoading(true);
    setError(null);

    try {
      // Conditional API call based on role
      const endpoint =
        role === "admin" ? "/admin/addcomment" : "/users/addcomment";
      await axiosInstance.post(endpoint, { postId, comment });

      setComment(""); // Clear the comment field after submission
      navigate(`/Community/PostDetail/${postId}/${role}`); // Redirect to the Post Detail page
    } catch (error) {
      console.error("Error adding comment:", error);
      setError("Failed to add comment. Please try again.");
    } finally {
      setLoading(false); // Reset the loading state
    }
  };

  return (
    <form onSubmit={handleCommentSubmit} className="comment-form">
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Add a comment..."
        required
        className="textarea"
      />
      <div className="flex justify-between items-center">
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Submitting..." : "Submit Comment"}
        </button>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
    </form>
  );
};

export default CommentForm;
