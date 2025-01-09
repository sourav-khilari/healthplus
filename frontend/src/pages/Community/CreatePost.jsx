import { useState } from "react";
import axiosInstance from "../../axios/axios_interceptor.js";
import { useNavigate } from "react-router-dom";
import "../../styles/CreatePost.css"; // Import custom styles

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
      const response = await axiosInstance.post("/users/createPost", formData);
      navigate(`/users/posts/${response.data.data._id}`);
    } catch (error) {
      console.error("Error creating post:", error);
      // Optionally, add user feedback like toast notifications here
    }
  };

  return (
    <div className="create-post-container">
      <h1 className="create-post-title">Create a Post</h1>
      <form onSubmit={handleSubmit} className="create-post-form">
        <div className="form-group">
          <label htmlFor="title" className="form-label">
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-input"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="form-textarea"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="image" className="form-label">
            Image
          </label>
          <input
            id="image"
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            className="form-input"
          />
        </div>
        <button type="submit" className="form-btn">
          Create Post
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
