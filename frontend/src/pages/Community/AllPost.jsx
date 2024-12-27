import { useEffect, useState } from "react";
import { Post } from "../index"; // Assuming Post is a component that takes post data as props
import { setposts } from "../../store/postSlice"; // Assuming you're using Redux for global state management
import { useDispatch, useSelector } from "react-redux"; // Import useSelector
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api/v1", // Change to your backend URL
  withCredentials: true, // For handling cookies
});

const AllPost = () => {
  const dispatch = useDispatch();
  const [allPosts, setAllPosts] = useState([]);

  // Retrieve role from Redux store will it work?????
  // if yes then need to add it to the rest of the pages
  //else if you find any other way to describe the role and
  //navigate to the proper route add it
  const role = useSelector((state) => state.user.role); // Assuming user role is stored in user slice

  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        let response;

        // Conditional API request based on the role
        if (role === "user") {
          response = await axiosInstance.get("/user/getAllPosts");
        } else if (role === "doctor") {
          response = await axiosInstance.get("/doctor/getAllPosts");
        } else {
          // Handle case where role is not set or is invalid
          console.error("Role is not set correctly.");
          return;
        }

        // Update local state
        setAllPosts(response.data.allPosts);

        // Dispatch to Redux store
        dispatch(setposts({ allPosts: response.data.allPosts }));
      } catch (error) {
        console.error("Error fetching all posts:", error);
      }
    };

    fetchAllPosts();
  }, [dispatch, role]); // role as a dependency to re-fetch if it changes

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
          description={post.description}
          image={post.image}
        />
      ))}
    </div>
  );
};

export default AllPost;
