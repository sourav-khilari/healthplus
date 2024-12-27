import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
// Axios Instance
const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api/v1", // Change to your backend URL
  withCredentials: true, // For handling cookies
});
const UserPosts = () => {
  const [userPosts, setUserPosts] = useState([]);

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const response = await axiosInstance.get("/users/posts");
        setUserPosts(response.data.data);
      } catch (error) {
        console.error("Error fetching user posts", error);
      }
    };
    fetchUserPosts();
  }, []);

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl mb-4">Your Posts</h1>
      {userPosts.length === 0 ? (
        <p>You have not created any posts yet.</p>
      ) : (
        <div className="mt-6">
          {userPosts.map((post) => (
            <div key={post._id} className="mb-4">
              <h3>{post.title}</h3>
              <p>{post.discription}</p>
              <Link to={`/post/${post._id}`} className="text-blue-500">
                View Post
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserPosts;
