import { useEffect, useState } from "react";
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
const AllPost = () => {
  const [allPosts, setAllPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1); // For pagination
  const [hasMore, setHasMore] = useState(true); // Check if more posts are available

  // Fetch posts from the backend
  const fetchAllPosts = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axiosInstance.get(`users/getAllPosts`);
      const posts = response.data?.data || [];

      if (posts.length > 0) {
        setAllPosts((prevPosts) => [...prevPosts, ...posts]);
        setHasMore(posts.length > 0); // Check if more posts exist
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

  // Fetch posts when the component mounts or page changes
  useEffect(() => {
    fetchAllPosts(page);
  }, [page]);

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
