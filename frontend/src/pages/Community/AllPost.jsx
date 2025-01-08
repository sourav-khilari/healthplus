import { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Import the Link component
import axiosInstance from "../../axios/axios_interceptor.js"; // Axios instance for API calls
import { useParams } from "react-router-dom";

const AllPost = () => {
  const [allPosts, setAllPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1); // For pagination
  const [hasMore, setHasMore] = useState(true); // Check if more posts are available
  const { role } = useParams();

  // Fetch posts from the backend
  const fetchAllPosts = async () => {
    try {
      setLoading(true);
      setError(null);

      // Select the correct endpoint based on the role
      const endpoint =
        role === "admin"
          ? `/admin/getAllPosts?page=${page}`
          : `/users/getAllPosts?page=${page}`;

      const response = await axiosInstance.get(endpoint);
      const posts = response.data?.data || [];

      if (posts.length > 0) {
        setAllPosts((prevPosts) => [...prevPosts, ...posts]);
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

  // Fetch posts when the component mounts or the `page` or `role` changes
  useEffect(() => {
    fetchAllPosts();
  }, [page, role]);

  // Load more posts when the user clicks the button
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
          <Link
            key={post._id} // Make sure to set the key for each Link
            to={`/postdetails/${role}/${post._id}`} // This will create a URL with role and post ID
            className="block mb-6 p-4 border rounded-lg hover:shadow-lg hover:bg-gray-50"
          >
            <div className="flex flex-col">
              <h2 className="text-2xl font-semibold">{post.title}</h2>
              <p className="text-gray-600 mt-2">{post.description}</p>
              <img
                src={post.image || "/placeholder.jpg"}
                alt={post.title}
                className="w-full h-60 object-cover mt-4 rounded-lg"
              />
            </div>
          </Link>
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
