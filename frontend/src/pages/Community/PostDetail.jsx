import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../axios/axios_interceptor.js";
import CommentForm from "./CommentForm";
import CommentCard from "./CommentCard";

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
          // User route for fetching the post
          console.log("id=\n"+id+"\n")
          console.log("id=\n"+role+"\n")
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
        // Admin route for posting comments
        response = await axiosInstance.post(`/admin/posts/${id}/comments`, {
          comment: newComment,
        });
      } else {
        // User route for posting comments
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
          <p className="text-gray-700 mb-6">{post.description}</p>

          <h2 className="text-xl font-semibold mt-6 mb-4">Comments</h2>
          {post.comments?.length === 0 ? (
            <p className="text-gray-500">No comments yet</p>
          ) : (
            post.comments.map((comment) => (
              
              <CommentCard key={comment._id} comment={comment}/>
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
