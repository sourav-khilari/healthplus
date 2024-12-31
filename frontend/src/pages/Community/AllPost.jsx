import { useEffect, useState } from "react";
<<<<<<< HEAD
import PostDetails from "./PostDetail"; // Ensure the correct import path
import axiosInstance from "../../axios/axios_interceptor.js"; // Axios instance for API calls
import { useParams } from "react-router";

=======
import PostDetails from "./PostDetail"; // Fixed naming
import axios from "axios";
import { getAuth } from "firebase/auth";
// Axios Instance
const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api/v1", // Replace with your backend URL
  withCredentials: true, // Handle cookies for session
});
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check for token expiration error
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Prevent infinite retries

      try {
        const auth = await getAuth();
        if (!auth.currentUser) {
          console.log("User is not authenticated. Please log in again.");
          //return Promise.reject(error);
        }
        const newIdToken = await auth.currentUser.getIdToken(true); // Force refresh the token

        // Call refreshToken API to update token in cookies
        await axios.post(
          "http://localhost:8000/api/v1/users/auth/refreshToken", // Refresh token API endpoint
          {},
          {
            headers: {
              Authorization: `Bearer ${newIdToken}`,
            },
            withCredentials: true,
          }
        );
        console.log("interceptor")
        // Retry the original request with updated cookies
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("Error refreshing token:", refreshError);
        //setError("Session expired. Please log in again.");
      }
    }

    return Promise.reject(error);
  }
);
>>>>>>> ae0507c8ba6ac7a8e84e8ef42488dbb392155bbe
const AllPost = () => {
  const [allPosts, setAllPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1); // For pagination
  const [hasMore, setHasMore] = useState(true); // Check if more posts are available
<<<<<<< HEAD
  const { role } = useParams();
=======
>>>>>>> ae0507c8ba6ac7a8e84e8ef42488dbb392155bbe

  // Fetch posts from the backend
  const fetchAllPosts = async () => {
    try {
      setLoading(true);
      setError(null);

<<<<<<< HEAD
      // Select the correct endpoint based on the role
      const endpoint =
        role === "admin"
          ? `/admin/getAllPosts?page=${page}`
          : `/users/getAllPosts?page=${page}`;

      const response = await axiosInstance.get(endpoint);
=======
      const response = await axiosInstance.get(`users/getAllPosts`);
>>>>>>> ae0507c8ba6ac7a8e84e8ef42488dbb392155bbe
      const posts = response.data?.data || [];

      if (posts.length > 0) {
        setAllPosts((prevPosts) => [...prevPosts, ...posts]);
<<<<<<< HEAD
=======
        setHasMore(posts.length > 0); // Check if more posts exist
>>>>>>> ae0507c8ba6ac7a8e84e8ef42488dbb392155bbe
      } else {
        setHasMore(false); // No more posts to load
      }
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError(err.response?.data?.message || "Failed to fetch posts.");
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD
  // Fetch posts when the component mounts or the `page` or `role` changes
  useEffect(() => {
    fetchAllPosts();
  }, [page, role]);
=======
  // Fetch posts when the component mounts or page changes
  useEffect(() => {
    fetchAllPosts(page);
  }, [page]);
>>>>>>> ae0507c8ba6ac7a8e84e8ef42488dbb392155bbe

  // Load more posts when user clicks the button
  const loadMorePosts = () => {
    if (hasMore && !loading) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  // UI for loading, error, or no posts
  if (loading && allPosts.length === 0) {
    return <div>Loading posts...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto mt-6">
      {allPosts.length > 0 ? (
        allPosts.map((post) => (
          <PostDetails
            key={post._id}
            id={post._id}
            title={post.title}
            description={post.description}
            image={post.image || "/placeholder.jpg"} // Add a fallback image
            userId={post.userId} // Post owner details
            comments={post.comments} // Pass comments to PostDetail
          />
        ))
      ) : (
        <div>No posts available.</div>
      )}

      {loading && <div>Loading more posts...</div>}
      {hasMore && !loading && (
        <button
          onClick={loadMorePosts}
          className="bg-blue-500 text-white py-2 px-4 rounded mt-6 mx-auto block"
        >
          Load More
        </button>
      )}
      {!hasMore && <div>No more posts to display.</div>}
    </div>
  );
};

export default AllPost;
