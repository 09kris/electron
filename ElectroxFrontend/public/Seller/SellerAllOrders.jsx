import React, { useState, useEffect } from "react";
import axios from "axios";

const SellerAllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:8000/seller/orders", {
        withCredentials: true,
      });
      setOrders(response.data.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">All Orders</h1>
      <p className="text-gray-600 mb-6">This page displays all orders placed by customers.</p>

      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <ul>
          {orders.map((item, index) => (
            <li
              key={item._id || index}
              className="border p-4 mb-2 rounded shadow-sm"
            >
              <p><strong>Order ID:</strong> {item._id}</p>
              <p><strong>Customer:</strong> {item.customerName}</p>
              <p><strong>Total:</strong> ₹{item.totalAmount}</p>
              <p><strong>Status:</strong> {item.status}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SellerAllOrders;
