import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import UserContext from "../../src/context/UserContext";
import { NavLink } from "react-router-dom";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [productIds, setProductIds] = useState([]);

  const { user } = useContext(UserContext);

  const fetchCartItems = async () => {
    if (!user?._id) {
      setLoading(false);
      console.log("No user ID found, skipping cart fetch");
      return;
    }

    try {
      const response = await axios.get(`http://localhost:8000/user/getCart/${user._id}`, {
        withCredentials: true,
      });

      const cartData = response.data.data || [];
      console.log("Cart items fetched:", cartData);
      setCartItems(cartData);

      // Extract product IDs from the fetched data
      const ids = cartData
        .filter((item) => item.productId)
        .map((item) => item.productId._id);
      setProductIds(ids);
    } catch (error) {
      console.error("Error fetching cart items:", error);
      setError("Failed to fetch cart items. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, [user?._id]);

  const removeCartItem = async (cartItemId) => {
    try {
      await axios.delete(`http://localhost:8000/deleteCart/${cartItemId}`, {
        withCredentials: true,
      });
      setCartItems((prev) => prev.filter((item) => item._id !== cartItemId));
      setProductIds((prev) =>
        prev.filter((id, index) => cartItems[index]._id !== cartItemId)
      );
    } catch (error) {
      console.error("Error removing item:", error);
      setError("Failed to remove item. Please try again.");
    }
  };

  const calculateTotal = () =>
    cartItems.reduce((total, item) => {
      return total + (item.productId?.price || 0) * (item.quantity || 1);
    }, 0);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded-lg">
      <h1 className="text-2xl font-bold mb-4">🛒 Your Cart</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {!user ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">Please log in to view your cart.</p>
          <button
            onClick={() => (window.location.href = "/login")}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Go to Login
          </button>
        </div>
      ) : loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2">Loading cart items...</span>
        </div>
      ) : cartItems.length === 0 ? (
        <p className="text-gray-500 text-center py-8">Your cart is empty.</p>
      ) : (
        <>
          <ul className="space-y-4">
            {cartItems.map((item) =>
              item.productId ? (
                <li
                  key={item._id}
                  className="border p-4 rounded shadow-sm flex gap-4 items-center hover:shadow-md transition-shadow"
                >
                  <img
                    src={item.productId.images?.[0]?.url}
                    alt={item.productId.name || "Product"}
                    className="w-24 h-24 object-cover rounded"
                    onError={(e) => {
                      e.target.src = "/placeholder-image.jpg";
                    }}
                  />
                  <div className="flex-grow">
                    <h2 className="text-xl font-semibold">{item.productId.name}</h2>
                    <p className="text-gray-600 text-sm">{item.productId.description}</p>
                    <p className="text-lg font-medium">₹{item.productId.price}</p>
                    <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                    <p className="text-sm font-medium">
                      Subtotal: ₹{(item.productId.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                  <button
                    onClick={() => removeCartItem(item._id)}
                    className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors"
                  >
                    Remove
                  </button>
                </li>
              ) : null
            )}
          </ul>

          <div className="mt-6 border-t pt-4">
            <div className="flex justify-between items-center text-xl font-bold">
              <span>Total: ₹{calculateTotal().toFixed(2)}</span>
              <NavLink
                to="/checkout"
                state={{ productIds }}
                className="bg-green-500 text-white py-2 px-6 rounded hover:bg-green-600 transition-colors"
              >
                Checkout
              </NavLink>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
