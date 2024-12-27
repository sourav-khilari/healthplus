import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import CommentForm from "../components/CommentForm";
import CommentCard from "../components/CommentCard";

// Axios Instance
const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api/v1", // Change to your backend URL
  withCredentials: true, // For handling cookies
});

const PostDetails = () => {
  const { id } = useParams(); // Extract post ID from URL
  const [post, setPost] = useState(null);

  // Fetch post details when component mounts
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axiosInstance.get(`/user/getPostById/${id}`);
        setPost(response.data.data); // Set post data to state
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };
    fetchPost();
  }, [id]);

  // Handle adding a new comment
  const handleAddComment = async (newComment) => {
    if (!newComment) {
      alert("Please add a comment!");
      return;
    }

    try {
      const response = await axiosInstance.post(`/posts/${id}/comments`, {
        comment: newComment,
      });

      // Update post's comments state by adding the new comment
      setPost({
        ...post,
        comments: [...post.comments, response.data.comment],
      });
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <div className="container mx-auto mt-6">
      {post ? (
        <>
          <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
          <img src={post.image} alt={post.title} className="w-full mb-4" />
          <p>{post.discription}</p>

          <h2 className="text-xl mt-6">Comments</h2>
          {post.comments.length === 0 ? (
            <p>No comments yet</p>
          ) : (
            post.comments.map((comment) => (
              <CommentCard key={comment._id} comment={comment} />
            ))
          )}

          <CommentForm onAddComment={handleAddComment} />
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default PostDetails;
