import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom"; // Import necessary hooks and components
import axiosInstance from "../../axios/axios_interceptor.js";

const UserPosts = () => {
  const { role } = useParams(); // Fetch the role from the URL params
  const navigate = useNavigate(); // Hook for programmatic navigation
  const [userPosts, setUserPosts] = useState([]);

  useEffect(() => {
    // Check if the role is valid before fetching posts
    if (role !== "user" && role !== "admin") {
      // Redirect to error page if the role is invalid
      navigate("/error");
      return;
    }

    const fetchUserPosts = async () => {
      try {
        let response;

        // Fetch posts based on the role
        if (role === "admin") {
          response = await axiosInstance.get("/admin/getUserPosts"); // Admin endpoint
        } else {
          response = await axiosInstance.get("/user/getUserPosts"); // User endpoint
        }

        setUserPosts(response.data.data); // Update state with the fetched posts
      } catch (error) {
        console.error("Error fetching user posts", error);
      }
    };

    fetchUserPosts();
  }, [role, navigate]); // Re-fetch when the role or navigate changes

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
              <Link
                to={`/${role}/getPostById/${post._id}`} // Dynamic route based on role
                className="text-blue-500"
              >
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
