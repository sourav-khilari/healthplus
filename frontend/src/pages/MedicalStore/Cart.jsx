import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaTrash } from "react-icons/fa";
import { addToCart, removeFromCart } from "./redux/features/cart/cartSlice";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    navigate("/login?redirect=/shipping");
  };

  return (
    <>
      <div className="container mx-auto mt-8 p-4 bg-white rounded-lg shadow-lg">
        {cartItems.length === 0 ? (
          <div className="text-center text-blue-700">
            Your cart is empty{" "}
            <Link to="/shop" className="text-blue-500 underline">
              Go To Shop
            </Link>
          </div>
        ) : (
          <>
            <div className="flex flex-col">
              <h1 className="text-2xl font-semibold mb-4 text-blue-700">
                Shopping Cart
              </h1>

              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center mb-4 p-4 border-b border-gray-300"
                >
                  <div className="w-[5rem] h-[5rem]">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>

                  <div className="flex-1 ml-4">
                    <Link
                      to={`/product/${item._id}`}
                      className="text-blue-500 hover:underline"
                    >
                      {item.name}
                    </Link>
                    <div className="mt-2 text-gray-600">{item.brand}</div>
                    <div className="mt-2 text-gray-900 font-bold">
                      $ {item.price}
                    </div>
                  </div>

                  <div className="w-24">
                    <select
                      className="w-full p-2 border rounded text-blue-500"
                      value={item.qty}
                      onChange={(e) =>
                        addToCartHandler(item, Number(e.target.value))
                      }
                    >
                      {[...Array(item.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <button
                      className="text-red-500"
                      onClick={() => removeFromCartHandler(item._id)}
                    >
                      <FaTrash className="ml-2 mt-1" />
                    </button>
                  </div>
                </div>
              ))}

              <div className="mt-8 w-full md:w-[40rem] bg-blue-50 p-4 rounded-lg">
                <h2 className="text-xl font-semibold mb-2 text-blue-700">
                  Items ({cartItems.reduce((acc, item) => acc + item.qty, 0)})
                </h2>

                <div className="text-2xl font-bold text-blue-900">
                  ${" "}
                  {cartItems
                    .reduce((acc, item) => acc + item.qty * item.price, 0)
                    .toFixed(2)}
                </div>

                <button
                  className="bg-blue-600 text-white mt-4 py-2 px-4 rounded-full text-lg w-full hover:bg-blue-700"
                  disabled={cartItems.length === 0}
                  onClick={checkoutHandler}
                >
                  Proceed To Checkout
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Cart;
