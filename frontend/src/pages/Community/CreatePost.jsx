import { useState } from "react";
import axiosInstance from "../../axios/axios_interceptor.js"; // Use the shared axios instance
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    if (image) formData.append("image", image);

    try {
      const response = await axiosInstance.post("/user/createPost", formData);
      navigate(`/user/getPostById/${response.data.data._id}`); // Navigate to the created post's detail page
    } catch (error) {
      console.error("Error creating post:", error);
      // Optionally, add user feedback like toast notifications here
    }
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl mb-4">Create a Post</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="textarea"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="image">Image</label>
          <input
            id="image"
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
