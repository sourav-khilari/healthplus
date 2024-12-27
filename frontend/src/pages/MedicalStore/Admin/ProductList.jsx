import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFetchCategoriesQuery } from "../redux/api/categoryApiSlice";
import { toast } from "react-toastify";
import AdminMenu from "./AdminMenu";
import axios from "axios";
const ProductList = () => {
  const [image, setImage] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [brand, setBrand] = useState("");
  const [stock, setStock] = useState(0);
  const [imageUrl, setImageUrl] = useState([]);
  const [loadingImage, setLoadingImage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // New state for submit button
  const navigate = useNavigate();

  const { data: categories, isLoading: categoriesLoading } =
    useFetchCategoriesQuery();

  const axiosInstance = axios.create({
    baseURL: "http://localhost:8000/api/v1",
    withCredentials: true,
  });

  const uploadFileHandler = async (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter((file) => file.type.startsWith("image/"));

    if (validFiles.length + image.length > 4) {
      toast.error("You can only upload up to 4 images.");
      return;
    }

    setLoadingImage(true);
    setImage((prevImage) => [...prevImage, ...validFiles]);
    setImageUrl((prevImageUrl) => [
      ...prevImageUrl,
      ...validFiles.map((file) => URL.createObjectURL(file)),
    ]);
    setLoadingImage(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!name || !price || !category || !quantity || image.length === 0) {
      toast.error("Please fill in all fields.");
      return;
    }

    setIsSubmitting(true); // Set loading state
    try {
      const productData = new FormData();
      image.forEach((img, index) => {
        productData.append(`image${index + 1}`, img);
      });
      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("category", category);
      productData.append("quantity", quantity);
      productData.append("brand", brand);
      productData.append("countInStock", stock);

      await axiosInstance.post("/admin/addProduct", productData);
      toast.success("Product created successfully.");
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Product creation failed.");
    } finally {
      setIsSubmitting(false); // Reset loading state
    }
  };

  return (
    <div className="container xl:mx-[9rem] sm:mx-[0]">
      <div className="flex flex-col md:flex-row">
        <AdminMenu />
        <div className="md:w-3/4 p-3">
          <h1 className="h-12 text-2xl font-bold">Create Product</h1>

          {imageUrl.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-3">
              {imageUrl.map((url, index) => (
                <img
                  src={url}
                  alt="product"
                  key={index}
                  className="block w-20 h-20 rounded-md"
                />
              ))}
            </div>
          )}

          <label className="border text-white px-4 block w-full text-center rounded-lg cursor-pointer font-bold py-11">
            {image.length < 4 ? "Upload Images" : "Max 4 images allowed"}
            <input
              type="file"
              name="image"
              accept="image/*"
              multiple
              onChange={uploadFileHandler}
              className={!image ? "hidden" : "text-white"}
            />
          </label>
          {loadingImage && (
            <div className="text-center mt-2 text-pink-600">Uploading...</div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="p-3">
              {/* Input Fields */}
              <div className="flex flex-wrap">
                <div className="one">
                  <label htmlFor="name">Name</label> <br />
                  <input
                    type="text"
                    className="p-4 mb-3 w-[30rem] border rounded-lg bg-[#101011] text-white"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="two ml-10">
                  <label htmlFor="price">Price</label> <br />
                  <input
                    type="number"
                    className="p-4 mb-3 w-[30rem] border rounded-lg bg-[#101011] text-white"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
              </div>

              {/* More Input Fields */}
              {/* ...remaining fields remain unchanged... */}

              <button
                type="submit"
                disabled={isSubmitting}
                className={`py-4 px-10 mt-5 rounded-lg text-lg font-bold bg-pink-600 ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
