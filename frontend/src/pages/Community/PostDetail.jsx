import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../axios/axios_interceptor.js";
import CommentForm from "./CommentForm";
import CommentCard from "./CommentCard";
import "../../styles/PostDetails.css";

const PostDetails = () => {
  const { id, role } = useParams(); // Extract post ID and role from URL params
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch post details when component mounts, depending on the role
  useEffect(() => {
    const fetchPost = async () => {
      try {
        let response;

        if (role === "admin") {
          // Admin route for fetching the post
          response = await axiosInstance.get(`/admin/getPostById/${id}`);
        } else {
          response = await axiosInstance.get(`/users/getPostById/${id}`);
        }

        if (response.data?.data) {
          setPost(response.data.data); // Set post data to state
          setError(null); // Clear any previous errors
        } else {
          setError("Post not found.");
        }
      } catch (err) {
        console.error("Error fetching post:", err);
        setError("Failed to load post. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, role]); // Depend on both id and role to refetch post if params change

  // Handle adding a new comment
  const handleAddComment = async (newComment) => {
    if (!newComment) {
      alert("Please add a comment!");
      return;
    }

    try {
      let response;

      if (role === "admin") {
        response = await axiosInstance.post(`/admin/posts/${id}/comments`, {
          comment: newComment,
        });
      } else {
        response = await axiosInstance.post(`/user/posts/${id}/comments`, {
          comment: newComment,
        });
      }

      // Update post's comments state by adding the new comment
      setPost((prevPost) => ({
        ...prevPost,
        comments: [...prevPost.comments, response.data.comment],
      }));
    } catch (err) {
      console.error("Error adding comment:", err);
      setError("Failed to add comment. Please try again.");
    }
  };

  if (loading) {
    return <div className="post-details-loading">Loading post...</div>;
  }

  if (error) {
    return <div className="post-details-error">{error}</div>;
  }

  return (
    <div className="post-details-container">
      {post ? (
        <>
          <h1 className="post-details-title">{post.title}</h1>
          {post.image && (
            <img
              src={post.image}
              alt={post.title}
              className="post-details-image"
            />
          )}
          <p className="post-details-description">{post.description}</p>

          <h2 className="post-details-comments-title">Comments</h2>
          {post.comments?.length === 0 ? (
            <p className="post-details-no-comments">No comments yet</p>
          ) : (
            post.comments.map((comment) => (
              <CommentCard key={comment._id} comment={comment} />
            ))
          )}

          <CommentForm onAddComment={handleAddComment} />
        </>
      ) : (
        <p className="post-details-not-found">Post not found.</p>
      )}
    </div>
  );
};

export default PostDetails;
