import  { useState } from "react";
import axios from "axios";
// Axios Instance
  const axiosInstance = axios.create({
    baseURL: "http://localhost:8000", // Change to your backend URL
    withCredentials: true, // For handling cookies
  });

const CommentForm = ({ postId }) => {
  const [comment, setComment] = useState("");

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/add-comment", { postId, comment });
      setComment("");
    } catch (error) {
      console.error("Error adding comment", error);
    }
  };

  return (
    <form onSubmit={handleCommentSubmit}>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Add a comment..."
        required
        className="textarea"
      />
      <button type="submit" className="btn btn-primary">
        Submit Comment
      </button>
    </form>
  );
};

export default CommentForm;
