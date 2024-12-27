import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";
import Rating from "./Rating";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { addToCart } from "../redux/features/cart/cartSlice";
import {
  FaBox,
  FaClock,
  FaShoppingCart,
  FaStar,
  FaStore,
} from "react-icons/fa";
import moment from "moment";
import ProductTabs from "./Tabs";
import HeartIcon from "./HeartIcon";
const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api/v1", // Change to your backend URL
  withCredentials: true, // For handling cookies
});

const Product = () => {
  const { id: productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qty, setQty] = useState(1);
  const [reviewRating, setReviewRating] = useState(0);
  const [comment, setComment] = useState("");

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axiosInstance.get(`/products/${productId}`);
        setProduct(data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch product.");
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const addToCartHandler = () => {
    if (product.countInStock === 0) {
      toast.error("Product is out of stock.");
      return;
    }
    dispatch(addToCart({ ...product, qty }));
    navigate("/cart");
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!userInfo) {
      toast.error("Please log in to submit a review.");
      return;
    }

    try {
      const { data: review } = await axiosInstance.post(
        `/products/${productId}/reviews`,
        { rating: reviewRating, comment },
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );

      setProduct((prevProduct) => ({
        ...prevProduct,
        reviews: [...prevProduct.reviews, review],
        numReviews: prevProduct.numReviews + 1,
      }));

      toast.success("Review created successfully");
      setReviewRating(0);
      setComment("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit review.");
    }
  };

  if (loading) return <Loader />;
  if (error) return <Message variant="danger">{error}</Message>;

  return (
    <>
      <div>
        <Link
          className="text-white font-semibold hover:underline ml-[10rem]"
          to="/"
        >
          Go Back
        </Link>
      </div>
      <div className="flex flex-wrap relative items-between mt-[2rem] ml-[10rem]">
        <div>
          <img
            src={product.image}
            alt={product.name}
            className="w-full xl:w-[50rem] lg:w-[45rem] md:w-[30rem] sm:w-[20rem] mr-[2rem]"
          />
          <HeartIcon product={product} />
        </div>
        <div className="flex flex-col justify-between">
          <h2 className="text-2xl font-semibold">{product.name}</h2>
          <p className="my-4 xl:w-[35rem] lg:w-[35] md:w-[30rem] text-[#B0B0B0]">
            {product.description}
          </p>
          <p className="text-5xl my-4 font-extrabold">${product.price}</p>

          <div className="flex items-center justify-between w-[20rem]">
            <div className="one">
              <h1 className="flex items-center mb-6">
                <FaStore className="mr-2 text-white" /> Brand: {product.brand}
              </h1>
              <h1 className="flex items-center mb-6">
                <FaClock className="mr-2 text-white" /> Added:{" "}
                {moment(product.createdAt).fromNow()}
              </h1>
              <h1 className="flex items-center mb-6">
                <FaStar className="mr-2 text-white" /> Reviews:{" "}
                {product.numReviews}
              </h1>
            </div>
            <div className="two">
              <h1 className="flex items-center mb-6">
                <FaStar className="mr-2 text-white" /> Ratings: {product.rating}
              </h1>
              <h1 className="flex items-center mb-6">
                <FaShoppingCart className="mr-2 text-white" /> Quantity:{" "}
                {product.quantity}
              </h1>
              <h1 className="flex items-center mb-6">
                <FaBox className="mr-2 text-white" /> In Stock:{" "}
                {product.countInStock}
              </h1>
            </div>
          </div>

          <div className="flex justify-between flex-wrap">
            <Rating
              value={product.rating}
              text={`${product.numReviews} reviews`}
            />

            {product.countInStock > 0 && (
              <div>
                <select
                  value={qty}
                  onChange={(e) =>
                    setQty(
                      Math.min(Number(e.target.value), product.countInStock)
                    )
                  }
                  className="p-2 w-[6rem] rounded-lg text-black"
                >
                  {[...Array(product.countInStock).keys()].map((x) => (
                    <option key={x + 1} value={x + 1}>
                      {x + 1}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="btn-container">
            <button
              onClick={addToCartHandler}
              disabled={product.countInStock === 0}
              className="bg-blue-600 text-white py-2 px-4 rounded-lg mt-4 md:mt-0"
            >
              Add To Cart
            </button>
          </div>
        </div>
      </div>

      <div className="mt-[5rem] container flex flex-wrap items-start justify-between ml-[10rem]">
        <ProductTabs
          loadingProductReview={false} // Not needed with Axios implementation
          userInfo={userInfo}
          submitHandler={submitHandler}
          rating={reviewRating}
          setRating={setReviewRating}
          comment={comment}
          setComment={setComment}
          product={product}
        />
      </div>
    </>
  );
};

export default Product;
