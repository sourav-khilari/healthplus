import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { PayPalButtons } from "@paypal/react-paypal-js";
import axios from "axios";
import Loader from "../components/Loader";
import Messsage from "../components/Message";
const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api/v1", // Change to your backend URL
  withCredentials: true, // For handling cookies
});

const Order = () => {
  const { id: orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingPay, setLoadingPay] = useState(false);
  const [loadingDeliver, setLoadingDeliver] = useState(false);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get(`/orders/${orderId}`);
      setOrder(data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setLoading(false);
    }
  };

  const handlePayment = async (details) => {
    try {
      setLoadingPay(true);
      await axiosInstance.put(`/orders/${orderId}/pay`, details);
      setLoadingPay(false);
      fetchOrderDetails();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setLoadingPay(false);
    }
  };

  const handleDelivery = async () => {
    try {
      setLoadingDeliver(true);
      await axiosInstance.put(`/orders/${orderId}/deliver`);
      setLoadingDeliver(false);
      fetchOrderDetails();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setLoadingDeliver(false);
    }
  };

  const createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [{ amount: { value: order.totalPrice } }],
    });
  };

  const onApprove = (data, actions) => {
    return actions.order.capture().then((details) => handlePayment(details));
  };

  const onError = (err) => setError(err.message);

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  if (loading) return <Loader />;
  if (error) return <Messsage variant="danger">{error}</Messsage>;

  return (
    <div className="container flex flex-col md:flex-row gap-4 p-4">
      <div className="md:w-2/3 border rounded-lg shadow-lg p-4 bg-white">
        {order.orderItems.length === 0 ? (
          <Messsage>Order is empty</Messsage>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b-2">
                <tr>
                  <th className="p-2">Image</th>
                  <th className="p-2">Product</th>
                  <th className="p-2 text-center">Quantity</th>
                  <th className="p-2">Unit Price</th>
                  <th className="p-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.orderItems.map((item, index) => (
                  <tr key={index}>
                    <td className="p-2">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover"
                      />
                    </td>
                    <td className="p-2">
                      <Link
                        to={`/fetchProductById/${item.product}`}
                        className="text-blue-600 hover:underline"
                      >
                        {item.name}
                      </Link>
                    </td>
                    <td className="p-2 text-center">{item.qty}</td>
                    <td className="p-2 text-center">${item.price}</td>
                    <td className="p-2 text-center">
                      $ {(item.qty * item.price).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <div className="md:w-1/3 border rounded-lg shadow-lg p-4 bg-white">
        <h2 className="text-xl font-bold mb-2">Order Summary</h2>
        <div className="flex justify-between mb-2">
          <span>Items</span>
          <span>$ {order.itemsPrice}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Shipping</span>
          <span>$ {order.shippingPrice}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Tax</span>
          <span>$ {order.taxPrice}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Total</span>
          <span>$ {order.totalPrice}</span>
        </div>

        {!order.isPaid && (
          <div>
            {loadingPay && <Loader />}
            <PayPalButtons
              createOrder={createOrder}
              onApprove={onApprove}
              onError={onError}
            />
          </div>
        )}

        {loadingDeliver && <Loader />}
        {order.isPaid && !order.isDelivered && (
          <button
            type="button"
            className="bg-pink-500 text-white w-full py-2 mt-4 rounded-lg"
            onClick={handleDelivery}
          >
            Mark As Delivered
          </button>
        )}
      </div>
    </div>
  );
};

export default Order;
