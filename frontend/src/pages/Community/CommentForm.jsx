import { useState } from "react";
import axiosInstance from "../../axios/axios_interceptor.js";
import { useParams, useNavigate } from "react-router-dom";
import "../../styles/CommentForm.css"; // Import custom styles

const CommentForm = () => {
  const { id, role } = useParams();
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const endpoint =
        role === "admin" ? "/admin/addcomment" : "/users/addcomment";
      const postId = id; // Assigning postId directly from params
      await axiosInstance.post(endpoint, { postId, comment });

      setComment("");
      navigate(`/Community/PostDetail/${postId}/${role}`);
    } catch (error) {
      console.error("Error adding comment:", error);
      setError("Failed to add comment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleCommentSubmit} className="comment-form-container">
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Add a comment..."
        required
        className="comment-form-textarea"
      />
      <div className="comment-form-actions">
        <button type="submit" className="comment-form-btn" disabled={loading}>
          {loading ? "Submitting..." : "Submit Comment"}
        </button>
        {error && <p className="comment-form-error">{error}</p>}
      </div>
    </form>
  );
};

export default CommentForm;
