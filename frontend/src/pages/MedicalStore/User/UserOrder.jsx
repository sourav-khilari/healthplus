import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import { useGetMyOrdersQuery } from "../../redux/api/orderApiSlice";

const UserOrder = () => {
  const { data: orders, isLoading, error } = useGetMyOrdersQuery();

  return (
    <div className="container mx-auto p-4 mt-[10rem] bg-white">
      <h2 className="text-2xl font-semibold mb-4 text-blue-800">My Orders</h2>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error?.data?.error || error.error}</Message>
      ) : (
        <table className="w-full bg-white shadow-lg border border-blue-200">
          <thead>
            <tr className="bg-blue-100 text-blue-700">
              <td className="py-2 px-4">IMAGE</td>
              <td className="py-2 px-4">ID</td>
              <td className="py-2 px-4">DATE</td>
              <td className="py-2 px-4">TOTAL</td>
              <td className="py-2 px-4">PAID</td>
              <td className="py-2 px-4">DELIVERED</td>
              <td className="py-2 px-4"></td>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="border-t border-blue-200">
                <td className="py-2 px-4">
                  <img
                    src={order.orderItems[0].image}
                    alt={order.user}
                    className="w-[6rem] mb-5 rounded-lg"
                  />
                </td>
                <td className="py-2 px-4">{order._id}</td>
                <td className="py-2 px-4">
                  {order.createdAt.substring(0, 10)}
                </td>
                <td className="py-2 px-4">${order.totalPrice}</td>

                <td className="py-2 px-4">
                  {order.isPaid ? (
                    <p className="p-1 text-center bg-blue-400 text-white w-[6rem] rounded-full">
                      Completed
                    </p>
                  ) : (
                    <p className="p-1 text-center bg-red-400 text-white w-[6rem] rounded-full">
                      Pending
                    </p>
                  )}
                </td>

                <td className="py-2 px-4">
                  {order.isDelivered ? (
                    <p className="p-1 text-center bg-blue-400 text-white w-[6rem] rounded-full">
                      Completed
                    </p>
                  ) : (
                    <p className="p-1 text-center bg-red-400 text-white w-[6rem] rounded-full">
                      Pending
                    </p>
                  )}
                </td>

                <td className="py-2 px-4">
                  <Link to={`/order/${order._id}`}>
                    <button className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
                      View Details
                    </button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserOrder;
