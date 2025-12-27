import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/sidebar";
import "./orders.css";
import { backendUrl, currency } from "../App";

function Orders({ setToken, token }) {
  const [orders, setOrders] = useState([]);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const dismissNotification = () => {
    setNotification(null);
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/order/list", {
        headers: { token },
      });

      if (response.status !== 200) {
        throw new Error("Failed to fetch orders");
      } else {
        setOrders(response.data.orders);
        console.log("Fetched orders:", response.data.orders);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      showNotification("Failed to fetch orders. Please try again.", "error");
    }
  };

  const handleStatusChange = (orderId, newStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order._id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const updateOrderStatus = async (orderId) => {
    const orderToUpdate = orders.find((order) => order._id === orderId);
    if (!orderToUpdate) {
      showNotification("Order not found!", "error");
      return;
    }

    try {
      const response = await axios.post(
        backendUrl + "/api/order/update",
        {
          orderId: orderToUpdate._id,
          status: orderToUpdate.status,
        },
        {
          headers: { token },
        }
      );

      if (response.data.success) {
        showNotification("Order status updated successfully!", "success");
        fetchOrders();
      } else {
        showNotification("Failed to update order status.", "error");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      showNotification("Failed to update order status. Try again.", "error");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const statusOptions = [
    "Order Placed",
    "Order Confirmed",
    "Order Packed",
    "Ready To Ship",
    "Shipped",
    "Out For Delivery",
    "Delivered",
    "Cancelled",
  ];

  return (
    <>
      <Sidebar setToken={setToken} />
      <div className="dashboard">
        <h1>Orders</h1>
      </div>
      <div className="orders-container">
        {orders.length === 0 ? (
          <p className="no-orders-message">No orders to display.</p>
        ) : (
          <div className="orders-table-wrapper">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>User ID</th>
                  <th>Product Image</th>
                  <th>Product Name</th>
                  <th>Quantity</th>
                  <th>Bill Amount</th>
                  <th>Delivery Date</th>
                  <th>Delivery Time Slot</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) =>
                  order.items.map((item, index) => (
                    <tr key={`${order._id}-${index}`}>
                      <td>{order._id}</td>
                      <td>{order.userId}</td>
                      <td>
                        <img
                          src={item.image?.[0]}
                          alt={item.name}
                          className="order-product-image"
                        />
                      </td>
                      <td>{item.name}</td>
                      <td>{item.quantity}</td>
                      <td>
                        <b>{currency}</b>{" "}
                        {(item.price * item.quantity).toFixed(2)}
                      </td>
                      <td>
                        {new Date(order.deliveryDate).toLocaleDateString()}
                      </td>
                      <td>{order.deliveryTimeSlot}</td>

                      {index === 0 ? (
                        <>
                          <td rowSpan={order.items.length}>
                            <select
                              value={order.status}
                              onChange={(e) =>
                                handleStatusChange(order._id, e.target.value)
                              }
                              className="order-status-dropdown"
                            >
                              {statusOptions.map((status) => (
                                <option key={status} value={status}>
                                  {status}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td rowSpan={order.items.length}>
                            <button
                              onClick={() => updateOrderStatus(order._id)}
                              className="update-order-button"
                            >
                              Update
                            </button>
                          </td>
                        </>
                      ) : null}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {notification && (
        <ul className="notifications">
          <li className={`notification-item ${notification.type}`}>
            <div className="notification-content">
              <div className="notification-icon" aria-hidden="true">
                {notification.type === "success" ? (
                  <svg
                    fill="none"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 11.08V12a10 10 0 11-5.93-8.67"></path>
                    <path d="M22 4L12 14.01l-3-3"></path>
                  </svg>
                ) : (
                  <svg
                    fill="none"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <circle cx="12" cy="16" r="1" />
                  </svg>
                )}
              </div>
              <div className="notification-text">{notification.message}</div>
              <button
                onClick={dismissNotification}
                className="notification-icon notification-close"
                aria-label="Dismiss notification"
                type="button"
              >
                <svg
                  fill="none"
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className="notification-progress-bar" />
          </li>
        </ul>
      )}
    </>
  );
}

export default Orders;
