import  { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import CommentForm from "../components/CommentForm";
import CommentCard from "../components/CommentCard";
// Axios Instance
  const axiosInstance = axios.create({
    baseURL: "http://localhost:8000", // Change to your backend URL
    withCredentials: true, // For handling cookies
  });

const PostDetails = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axiosInstance.get(`/posts/${id}`);
        setPost(response.data.data);
      } catch (error) {
        console.error("Error fetching post", error);
      }
    };
    fetchPost();
  }, [id]);

  return (
    <div className="container mx-auto">
      {post ? (
        <>
          <h1 className="text-3xl mb-4">{post.title}</h1>
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

          <CommentForm postId={id} />
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default PostDetails;
