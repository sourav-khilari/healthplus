import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
<<<<<<< HEAD
import axiosInstance from "../../axios/axios_interceptor.js";
import CommentForm from "./CommentForm";
import CommentCard from "./CommentCard";

const PostDetails = () => {
  const { id, role } = useParams(); // Extract post ID and role from URL params
  // const navigate = useNavigate(); // Use navigate to programmatically change the route
=======
import axios from "axios";
import CommentForm from "./CommentForm";
import CommentCard from "./CommentCard";

// Axios Instance
const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api/v1", // Change to your backend URL
  withCredentials: true, // For handling cookies
});

const PostDetails = () => {
  const { id } = useParams(); // Extract post ID from URL
>>>>>>> ae0507c8ba6ac7a8e84e8ef42488dbb392155bbe
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

<<<<<<< HEAD
  // Fetch post details when component mounts, depending on the role
  useEffect(() => {
    const fetchPost = async () => {
      try {
        let response;

        if (role === "admin") {
          // Admin route for fetching the post
          response = await axiosInstance.get(`/admin/getPostById/${id}`);
        } else {
          // User route for fetching the post
          response = await axiosInstance.get(`/user/getPostById/${id}`);
        }

        setPost(response.data?.data); // Set post data to state
=======
  // Fetch post details when component mounts
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await axiosInstance.get(`/users/getPostById/${id}`);
        setPost(data?.data); // Set post data to state
>>>>>>> ae0507c8ba6ac7a8e84e8ef42488dbb392155bbe
        setError(null); // Clear any previous errors
      } catch (err) {
        console.error("Error fetching post:", err);
        setError("Failed to load post. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
<<<<<<< HEAD
  }, [id, role]); // Depend on both id and role to refetch post if params change
  // Log the comments to verify structure
  useEffect(() => {
    if (post?.comments) {
      console.log(post.comments);
    }
  }, [post]);
=======
  }, [id]);

>>>>>>> ae0507c8ba6ac7a8e84e8ef42488dbb392155bbe
  // Handle adding a new comment
  const handleAddComment = async (newComment) => {
    if (!newComment) {
      alert("Please add a comment!");
      return;
    }

    try {
<<<<<<< HEAD
      let response;

      if (role === "admin") {
        // Admin route for posting comments
        response = await axiosInstance.post(`/admin/posts/${id}/comments`, {
          comment: newComment,
        });
      } else {
        // User route for posting comments
        response = await axiosInstance.post(`/users/posts/${id}/comments`, {
          comment: newComment,
        });
      }
=======
      const { data } = await axiosInstance.post(`/user/posts/${id}/comments`, {
        comment: newComment,
      });
>>>>>>> ae0507c8ba6ac7a8e84e8ef42488dbb392155bbe

      // Update post's comments state by adding the new comment
      setPost((prevPost) => ({
        ...prevPost,
<<<<<<< HEAD
        comments: [...prevPost.comments, response.data.comment],
=======
        comments: [...prevPost.comments, data.comment],
>>>>>>> ae0507c8ba6ac7a8e84e8ef42488dbb392155bbe
      }));
    } catch (err) {
      console.error("Error adding comment:", err);
      setError("Failed to add comment. Please try again.");
    }
  };

  // UI for loading or error state
  if (loading) {
    return <div>Loading post...</div>; // Replace with a spinner or skeleton if preferred
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto mt-6">
      {post ? (
        <>
          <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
          {post.image && (
            <img
              src={post.image}
              alt={post.title}
              className="w-full rounded-lg mb-4"
            />
          )}
<<<<<<< HEAD
          <p className="text-gray-700 mb-6">{post.description}</p>
=======
          <p className="text-gray-700 mb-6">{post.discription}</p>
>>>>>>> ae0507c8ba6ac7a8e84e8ef42488dbb392155bbe

          <h2 className="text-xl font-semibold mt-6 mb-4">Comments</h2>
          {post.comments?.length === 0 ? (
            <p className="text-gray-500">No comments yet</p>
          ) : (
            post.comments.map((comment) => (
<<<<<<< HEAD
              <CommentCard key={comment._id} comment={comment} role={role} />
=======
              <CommentCard key={comment._id} comment={comment} />
>>>>>>> ae0507c8ba6ac7a8e84e8ef42488dbb392155bbe
            ))
          )}

          <CommentForm onAddComment={handleAddComment} />
        </>
      ) : (
        <p>Post not found.</p>
      )}
    </div>
  );
};

export default PostDetails;
