import { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Import the Link component
import axiosInstance from "../../axios/axios_interceptor.js"; // Axios instance for API calls
import { useParams } from "react-router-dom";
import "../../styles/AllPost.css";
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
      // const endpoint =
      //   role === "admin"
      //     ? `/admin/getAllPosts?page=${page}`
      //     : role==="superadmin"? `superadmin/getAllPosts?page=${page}`: `/users/getAllPosts?page=${page}`;
      //const endpoint = `/ ${role === "superadmin" ? "superadmin" : role === "admin" ? "admin" : "users"}/getAllPosts?page=${page}`
      const endpoint = role === "admin"
        ? `/admin/getAllPosts?page=${page}`
        : role === "superadmin"
          ? `/admin/getAllPosts?page=${page}`
          : `/users/getAllPosts?page=${page}`;

      const response = await axiosInstance.get(endpoint);
      const posts = response.data?.data || [];

      if (posts.length > 0) {
        setAllPosts((prevPosts) => [...prevPosts, ...posts]);
        console.log("All Posts\n", allPosts);
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
    return <div className="loading-message">Loading posts...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <div className="posts-container">
      {allPosts.length > 0 ? (
        allPosts.map((post) => (
          <Link
            key={post._id} // Make sure to set the key for each Link
            to={`/Community/PostDetail/${post._id}/${role}`} // This will create a URL with role and post ID
            className="post-card"
          >
            <div className="post-content">
              <h2 className="post-title">{post.title}</h2>
              <p className="post-description">{post.description}</p>
              <img
                src={post.image || "/placeholder.jpg"}
                alt={post.title}
                className="post-image"
              />
            </div>
          </Link>
        ))
      ) : (
        <div className="no-posts-message">No posts available.</div>
      )}

      {loading && <div className="loading-message">Loading more posts...</div>}
      {hasMore && !loading && (
        <button onClick={loadMorePosts} className="load-more-button">
          Load More
        </button>
      )}
      {!hasMore && (
        <div className="no-more-posts-message">No more posts to display.</div>
      )}
    </div>
  );
};

export default AllPost;
