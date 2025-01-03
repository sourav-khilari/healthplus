import { useState, useEffect } from "react";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { Link } from "react-router-dom";
import AdminMenu from "./AdminMenu";
import axios from "axios";

// Create an axios instance
const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api/v1", // Update with your backend URL
  withCredentials: true, // Include credentials if required
});

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const { data } = await axiosInstance.get("/admin/orders");
        setOrders(data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <div className="container mx-auto p-4">
          <AdminMenu />
          <table className="w-full table-auto mt-5 bg-white shadow-lg rounded-lg overflow-hidden">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="py-3 px-4 text-left">ITEMS</th>
                <th className="py-3 px-4 text-left">ID</th>
                <th className="py-3 px-4 text-left">USER</th>
                <th className="py-3 px-4 text-left">DATE</th>
                <th className="py-3 px-4 text-left">TOTAL</th>
                <th className="py-3 px-4 text-left">PAID</th>
                <th className="py-3 px-4 text-left">DELIVERED</th>
                <th className="py-3 px-4 text-left"></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-t">
                  <td className="py-2 px-4">
                    <img
                      src={order.orderItems[0].image}
                      alt={order._id}
                      className="w-[5rem] h-[5rem] object-cover rounded-md"
                    />
                  </td>
                  <td className="py-2 px-4">{order._id}</td>
                  <td className="py-2 px-4">
                    {order.user ? order.user.username : "N/A"}
                  </td>
                  <td className="py-2 px-4">
                    {order.createdAt ? order.createdAt.substring(0, 10) : "N/A"}
                  </td>
                  <td className="py-2 px-4">$ {order.totalPrice}</td>
                  <td className="py-2 px-4">
                    {order.isPaid ? (
                      <p className="p-1 text-center bg-green-400 w-[6rem] rounded-full text-white">
                        Completed
                      </p>
                    ) : (
                      <p className="p-1 text-center bg-red-400 w-[6rem] rounded-full text-white">
                        Pending
                      </p>
                    )}
                  </td>
                  <td className="py-2 px-4">
                    {order.isDelivered ? (
                      <p className="p-1 text-center bg-green-400 w-[6rem] rounded-full text-white">
                        Completed
                      </p>
                    ) : (
                      <p className="p-1 text-center bg-red-400 w-[6rem] rounded-full text-white">
                        Pending
                      </p>
                    )}
                  </td>
                  <td className="py-2 px-4">
                    <Link to={`/order/${order._id}`}>
                      <button className="bg-blue-500 text-white py-1 px-3 rounded-md hover:bg-blue-600">
                        More
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default OrderList;
