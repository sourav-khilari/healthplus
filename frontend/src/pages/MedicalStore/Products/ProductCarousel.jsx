import { useState, useEffect } from "react";
import axios from "axios"; // Import Axios instance
import Message from "../components/Message";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import moment from "moment";
import {
  FaBox,
  FaClock,
  FaShoppingCart,
  FaStar,
  FaStore,
} from "react-icons/fa";
const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api/v1", // Change to your backend URL
  withCredentials: true, // For handling cookies
});

const ProductCarousel = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  // Fetch products using Axios instance
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get("products/top"); // Adjust the endpoint
        setProducts(response.data); // Assuming the response has data field with product list
        setIsLoading(false);
      } catch (err) {
        setError(err);
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (isLoading) return <Message variant="info">Loading...</Message>;
  if (error)
    return (
      <Message variant="danger">
        {error?.response?.data?.message || error.message}
      </Message>
    );

  return (
    <div className="mb-4 lg:block xl:block md:block">
      {products && products.length > 0 ? (
        <Slider
          {...settings}
          className="xl:w-[50rem] lg:w-[50rem] md:w-[56rem] sm:w-[40rem] sm:block"
        >
          {products.map(
            ({
              image,
              _id,
              name,
              price,
              description,
              brand,
              createdAt,
              numReviews,
              rating,
              quantity,
              countInStock,
            }) => (
              <div key={_id}>
                <img
                  src={image}
                  alt={name}
                  className="w-full rounded-lg object-cover h-[30rem]"
                />

                <div className="mt-4 flex justify-between">
                  <div className="one">
                    <h2 className="text-white">{name}</h2>
                    <p className="text-pink-500">${price}</p> <br /> <br />
                    <p className="w-[25rem] text-gray-300">
                      {description.substring(0, 170)} ...
                    </p>
                  </div>

                  <div className="flex justify-between w-[20rem]">
                    <div className="one text-white">
                      <h1 className="flex items-center mb-6">
                        <FaStore className="mr-2" /> Brand: {brand}
                      </h1>
                      <h1 className="flex items-center mb-6">
                        <FaClock className="mr-2" /> Added:{" "}
                        {moment(createdAt).fromNow()}
                      </h1>
                      <h1 className="flex items-center mb-6">
                        <FaStar className="mr-2" /> Reviews: {numReviews}
                      </h1>
                    </div>

                    <div className="two text-white">
                      <h1 className="flex items-center mb-6">
                        <FaStar className="mr-2" /> Ratings:{" "}
                        {Math.round(rating)}
                      </h1>
                      <h1 className="flex items-center mb-6">
                        <FaShoppingCart className="mr-2" /> Quantity: {quantity}
                      </h1>
                      <h1 className="flex items-center mb-6">
                        <FaBox className="mr-2" /> In Stock: {countInStock}
                      </h1>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
        </Slider>
      ) : (
        <Message variant="info">No products available.</Message>
      )}
    </div>
  );
};

export default ProductCarousel;
