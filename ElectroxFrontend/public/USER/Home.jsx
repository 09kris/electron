import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
const Home = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartLoading, setCartLoading] = useState(null);

  // Fetch all products
  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:8000/product/all", {
        withCredentials: true,
      });
      setProducts(response.data.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Add product to cart
  const addProductToCart = async (productId) => {
    try {
      setCartLoading(productId);
      const response = await axios.post(
        `http://localhost:8000/addToCart/${productId}/1`,
        {},
        { withCredentials: true }
      );
      console.log("Product added to cart:", response.data);
      alert("✅ Product added to cart!");
    } catch (error) {
      console.error("Error adding product to cart:", error);
      alert(
        error?.response?.data?.message || "❌ Failed to add product to cart"
      );
    } finally {
      setCartLoading(null);
    }
  };

  const GiveOrder = (productId) => {
    navigate(`order/${productId}`);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">All Products</h1>
      <p className="text-gray-600 mb-6">This page displays all available products.</p>

      {loading ? (
        <p>Loading products...</p>
      ) : products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <ul>
          {products.map((item, index) => (
            <li
              key={item._id || index}
              className="border p-4 mb-2 rounded shadow-sm"
            >
              <img
                src={item.images[0].url}
                alt="Not loaded"
                className="w-24 h-24 object-cover mb-2"
              />
              <h2 className="text-xl font-semibold">{item.name}</h2>
              <p>{item.description}</p>
              <p><strong>Price:</strong> ₹{item.price}</p>
              <p><strong>Category:</strong> {item.category}</p>

              <div className="flex gap-4 mt-4">
           <NavLink
                to="/checkout"
                state={ {'productIds':item._id} }
                className="bg-green-500 text-white py-2 px-6 rounded hover:bg-green-600 transition-colors"
              >
                Buy Now
              </NavLink>

                <button
                  className={`${
                    cartLoading === item._id ? "opacity-50" : ""
                  } bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600`}
                  onClick={() => addProductToCart(item._id)}
                  disabled={cartLoading === item._id}
                >
                  {cartLoading === item._id ? "Adding..." : "ADD TO CART"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Home;
