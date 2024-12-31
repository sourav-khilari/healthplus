import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Importing useNavigate for programmatic routing
import axiosInstance from "../../axios/axios_interceptor.js";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

const UserPosts = () => {
  const { role } = useParams(); // Fetch the role from the URL params (if it's passed)
  const navigate = useNavigate(); // Hook to programmatically navigate between routes
  const [userPosts, setUserPosts] = useState([]);

  useEffect(() => {
    // Check if the role is valid before fetching posts
    if (role !== "user" && role !== "admin") {
      // If role is invalid, redirect to a default route or an error page
      navigate("/error");
      return;
    }

    const fetchUserPosts = async () => {
      try {
        let response;

        // Fetch posts based on the role
        if (role === "admin") {
          response = await axiosInstance.get("/admin/getUserPosts"); // Use the appropriate endpoint for admin
        } else {
          response = await axiosInstance.get("/user/getUserPosts"); // Use the user endpoint
        }

        setUserPosts(response.data.data);
      } catch (error) {
        console.error("Error fetching user posts", error);
      }
    };

    fetchUserPosts();
  }, [role, navigate]); // Depend on role and navigate to re-fetch when role changes

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
                to={`/${role}/getPostById/${post._id}`} // Use dynamic route for user/admin
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
