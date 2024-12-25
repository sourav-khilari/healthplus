import { Link, useParams } from "react-router-dom";
import { useGetProductsQuery } from "../redux/api/productApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Header from "../components/Header";
import Product from "./Products/Product";

const MedStore = () => {
  const { keyword } = useParams();
  const { data, isLoading, error } = useGetProductsQuery({ keyword });

  return (
    <>
      {!keyword && <Header />}

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message ||
            error?.error ||
            "An unexpected error occurred"}
        </Message>
      ) : (
        <>
          <div className="flex justify-between items-center px-4 mt-16">
            <h1 className="text-4xl font-bold text-blue-700">
              Special Products
            </h1>

            <Link
              to="/shop"
              className="bg-blue-600 text-white font-bold rounded-full py-2 px-10 hover:bg-blue-700 transition"
            >
              Shop Now
            </Link>
          </div>

          <div className="flex flex-wrap justify-center mt-8">
            {data?.products?.map((product) => (
              <div
                key={product._id}
                className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-4"
              >
                <Product product={product} />
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default MedStore;
