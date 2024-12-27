import { useEffect, useState } from "react";
import { Post } from "../index"; // Assuming Post is a component that takes post data as props
import { setposts } from "../../store/postSlice"; // Assuming you're using Redux for global state management
import { useDispatch } from "react-redux";
import axios from "axios";
const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api/v1", // Change to your backend URL
  withCredentials: true, // For handling cookies
});

const AllPost = () => {
  const dispatch = useDispatch();
  const [allPosts, setAllPosts] = useState([]);

  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        // Make sure the API endpoint URL is correct
        const response = await axiosInstance.get("users/getallpost");
        console.log(response.data.allPosts);

        // Update local state
        setAllPosts(response.data.allPosts);

        // Dispatch to Redux store
        dispatch(setposts({ allPosts: response.data.allPosts }));
      } catch (error) {
        console.error("Error fetching all posts:", error);
      }
    };

    fetchAllPosts();
  }, [dispatch]); // Empty dependency array ensures the effect runs once on mount

  // If the data hasn't been fetched yet, show loading
  if (allPosts.length === 0) {
    return <div>Loading...</div>;
  }

  // Render posts after data is fetched
  return (
    <div>
      {allPosts.map((post) => (
        <Post
          key={post._id}
          id={post._id}
          title={post.title}
          description={post.discription}
          image={post.image}
        />
      ))}
    </div>
  );
};

export default AllPost;
