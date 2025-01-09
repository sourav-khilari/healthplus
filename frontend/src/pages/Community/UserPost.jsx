import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom"; // Import necessary hooks and components
import axiosInstance from "../../axios/axios_interceptor.js";

const UserPost = () => {
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
          response = await axiosInstance.get("/users/getUserPosts"); // User endpoint
        }

        // Ensure unique posts are returned
        const uniquePosts = Array.from(
          new Set(response.data.data.map((a) => a._id))
        ).map((id) => response.data.data.find((a) => a._id === id));
        setUserPosts(uniquePosts); // Update state with the unique posts
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {userPosts.map((post) => (
            <div
              key={post._id}
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
              <p className="text-gray-600 mb-4">{post.discription}</p>
              <Link
                to={`/Community/PostDetail/${post._id}/${role} `} // Dynamic route based on role
                className="text-blue-500 hover:underline"
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

export default UserPost;
