import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// Axios Instance
const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api/v1", // Change to your backend URL
  withCredentials: true, // For handling cookies
});

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [discription, setDiscription] = useState("");
  const [image, setImage] = useState(null);
  const navigate = useNavigate();
  //  const userId = useSelector((state) => state.auth.userData._id);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("discription", discription);
    if (image) formData.append("image", image);
    // formData.append("_id", userId);
    try {
      const response = await axiosInstance.post("/user/createPost", formData);
      navigate(`/post/${response.data.data._id}`); // Navigate to the created post's detail page
    } catch (error) {
      console.error("Error creating post", error);
    }
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl mb-4">Create a Post</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input"
            required
          />
        </div>
        <div>
          <label>Description</label>
          <textarea
            value={discription}
            onChange={(e) => setDiscription(e.target.value)}
            className="textarea"
            required
          />
        </div>
        <div>
          <label>Image</label>
          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            className="input"
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Create Post
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
