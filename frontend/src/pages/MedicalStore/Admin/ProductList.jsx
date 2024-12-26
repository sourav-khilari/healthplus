import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useCreateProductMutation,
  useUploadProductImageMutation,
} from "../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../redux/api/categoryApiSlice";
import { toast } from "react-toastify";
import AdminMenu from "./AdminMenu";
import axios from "axios"

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
  const [loadingImage, setLoadingImage] = useState(false); // Added loading state
  const navigate = useNavigate();

  const [uploadProductImage] = useUploadProductImageMutation();
  const [createProduct] = useCreateProductMutation();
  const { data: categories, isLoading: categoriesLoading } =
    useFetchCategoriesQuery();


  const axiosInstance = axios.create({
    baseURL: "http://localhost:8000/api/v1", // Change to your backend URL
    withCredentials: true, // For handling cookies
  });

  const uploadFileHandler = async (e) => {
    setLoadingImage(true);
    const files = e.target.files;
    setImage((prevImage) => [...prevImage, ...files]);
    setImageUrl((prevImageUrl) => [
      ...prevImageUrl,
      ...Array.from(files).map((file) => URL.createObjectURL(file)),
    ]);
    setLoadingImage(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("123");
    console.log("123");

    console.log("Name:",  name); // true if name is not empty, false otherwise
    console.log("Price:",  price); // true if price is not empty, false otherwise
    console.log("Category:",  category); // true if category is not empty, false otherwise
    console.log("Quantity:",  quantity); // true if quantity is not empty, false otherwise
    console.log("Image length:", image.length); // true if image length is greater than 0, false otherwise



    // Basic validation
    if (!name || !price || !category || !quantity || image.length <= 0) {
      toast.error("Please fill in all fields.");
      return;
    }
    console.log("fill123");
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
      //const { data } = await createProduct(productData).unwrap();
      console.log("before pr123");
      const pr = await axiosInstance.post("/admin/addProduct", productData);
      console.log("after pr123");
      // if (pr.response.error) {
      //   toast.error("Product creation failed. Try again.");
      // } else {
      //   toast.success(`${data.name} is created successfully.`);
      //   navigate("/");
      // }
      toast.success(` is created successfully.`);
    } catch (error) {
      console.error(error);
      toast.error("Product creation failed. Please try again.");
    }
  };


  return (
    <div className="container xl:mx-[9rem] sm:mx-[0]">
      <div className="flex flex-col md:flex-row">
        <AdminMenu />
        <div className="md:w-3/4 p-3">
          <div className="h-12">Create Product</div>




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




          <label
            className="border text-white px-4 block w-full text-center rounded-lg cursor-pointer font-bold py-11"
          >

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


          <div className="p-3">
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

            <div className="flex flex-wrap">
              <div className="one">
                <label htmlFor="quantity">Quantity</label> <br />
                <input
                  type="number"
                  className="p-4 mb-3 w-[30rem] border rounded-lg bg-[#101011] text-white"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>
              <div className="two ml-10">
                <label htmlFor="brand">Brand</label> <br />
                <input
                  type="text"
                  className="p-4 mb-3 w-[30rem] border rounded-lg bg-[#101011] text-white"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                />
              </div>
            </div>

            <label htmlFor="description" className="my-5">
              Description
            </label>
            <textarea
              className="p-2 mb-3 bg-[#101011] border rounded-lg w-[95%] text-white"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>

            <div className="flex justify-between">
              <div>
                <label htmlFor="stock">Count In Stock</label> <br />
                <input
                  type="number"
                  className="p-4 mb-3 w-[30rem] border rounded-lg bg-[#101011] text-white"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="category">Category</label> <br />
                <select
                  className="p-4 mb-3 w-[30rem] border rounded-lg bg-[#101011] text-white"
                  onChange={(e) => setCategory(e.target.value)}
                  disabled={categoriesLoading} // Disable select during loading
                >
                  {categoriesLoading ? (
                    <option>Loading...</option>
                  ) : (
                    categories?.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))
                  )}
                </select>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              className="py-4 px-10 mt-5 rounded-lg text-lg font-bold bg-pink-600"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div >
  );
};

export default ProductList;
