import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { backendUrl, currency } from "../App";
import "./TrackOrder.css";

const TrackOrder = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) {
        setError("No order ID provided.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${backendUrl}/api/order/${orderId}`, {
          headers: { token: localStorage.getItem("userToken") },
        });
        if (response.data.success) {
          setOrder(response.data.order);
        } else {
          setError(response.data.message || "Failed to fetch order details.");
        }
      } catch (err) {
        console.error("Error fetching order details:", err);
        setError("Error fetching order details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const orderSteps = [
    { name: "Order Placed", statusKey: "order placed" },
    { name: "Order Confirmed", statusKey: "order confirmed" },
    { name: "Order Packed", statusKey: "order packed" },
    { name: "Ready To Ship", statusKey: "ready to ship" },
    { name: "Shipped", statusKey: "shipped" },
    { name: "Out For Delivery", statusKey: "out for delivery" },
    { name: "Delivered", statusKey: "delivered" },
    { name: "Cancelled", statusKey: "cancelled" },
  ];

  const getStepStatus = (currentOrderStatus, stepStatusKey) => {
    const lowerCaseCurrentStatus = currentOrderStatus.toLowerCase();
    if (lowerCaseCurrentStatus === "cancelled") {
      if (stepStatusKey === "order placed") return "completed";
      return stepStatusKey === "cancelled" ? "completed" : "pending";
    }
    const currentOrderIndex = orderSteps.findIndex(
      (step) => step.statusKey === lowerCaseCurrentStatus
    );
    const stepIndex = orderSteps.findIndex(
      (step) => step.statusKey === stepStatusKey
    );
    if (stepIndex < currentOrderIndex) return "completed";
    if (stepIndex === currentOrderIndex) return "active";
    return "pending";
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  // Helper for just the Delivery Date (No time)
  const formatDateOnly = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading)
    return (
      <div className="track-order-container">Loading order details...</div>
    );
  if (error)
    return <div className="track-order-container error-message">{error}</div>;
  if (!order)
    return <div className="track-order-container">Order not found.</div>;

  const isOrderCancelled = order.status.toLowerCase() === "cancelled";

  return (
    <div className="track-order-container">
      <h1>Track Order #{order._id.slice(-8).toUpperCase()}</h1>

      <div className="order-details-summary">
        <div className="summary-item">
          <strong>Order Total:</strong> {currency}
          {order.amount.toFixed(2)}
        </div>
        <div className="summary-item">
          <strong>Current Status:</strong>{" "}
          <span
            className={`order-status status-${order.status
              .toLowerCase()
              .replace(" ", "-")}`}
          >
            {order.status}
          </span>
        </div>
        <div className="summary-item">
          <strong>Ordered On:</strong>{" "}
          {formatDateTime(order.statusHistory[0]?.timestamp)}
        </div>

        {/* --- NEW DELIVERY SCHEDULE INFO --- */}
        <div className="summary-item delivery-highlight">
          <strong>Scheduled Delivery:</strong>
          <div className="delivery-badge">
            <span>{formatDateOnly(order.deliveryDate)}</span>
            <br />
            <span>{order.deliveryTimeSlot}</span>
          </div>
        </div>
      </div>

      <div className="stepper-box">
        {orderSteps.map((step, index) => {
          if (isOrderCancelled) {
            if (
              step.statusKey !== "order placed" &&
              step.statusKey !== "cancelled"
            )
              return null;
          } else {
            if (step.statusKey === "cancelled") return null;
          }

          const status = getStepStatus(order.status, step.statusKey);
          const isCompleted = status === "completed";
          const isActive = status === "active";
          const stepHistoryEntry = order.statusHistory?.find(
            (entry) => entry.status.toLowerCase() === step.statusKey
          );
          const stepTimestamp = stepHistoryEntry
            ? stepHistoryEntry.timestamp
            : null;

          return (
            <div
              key={step.statusKey}
              className={`stepper-step stepper-${status} ${step.statusKey.replace(
                " ",
                "-"
              )}`}
            >
              <div className="stepper-circle">
                {isCompleted ? (
                  <svg
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    height={16}
                    width={16}
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z" />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>
              {/* Stepper Logic for lines */}
              {!(isOrderCancelled && step.statusKey === "cancelled") &&
                !(index === orderSteps.length - 1 && !isOrderCancelled) && (
                  <div className="stepper-line" />
                )}
              <div className="stepper-content">
                <div className="stepper-title">{step.name}</div>
                <div className="stepper-status">
                  {isCompleted
                    ? "Completed"
                    : isActive
                    ? "In Progress"
                    : "Pending"}
                </div>
                <div className="stepper-time">
                  {stepTimestamp ? formatDateTime(stepTimestamp) : "--"}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="order-items-section">
        <h3>Order Items</h3>
        <div className="order-items-list">
          {order.items?.map((item, index) => (
            <div key={item._id || index} className="order-item-detail-track">
              <img
                src={item.image[0]}
                alt={item.name}
                className="item-image-track"
              />
              <div className="item-info-track">
                <span className="item-name-track">{item.name}</span>
                <span className="item-quantity-price-track">
                  x{item.quantity} - {currency}
                  {(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="shipping-address-section">
        <h3>Shipping Address</h3>
        {order.address ? (
          <div className="shipping-address-details">
            <p>
              <strong>{order.address.fullName}</strong>
            </p>
            <p>{order.address.addressLine1}</p>
            {order.address.addressLine2 && <p>{order.address.addressLine2}</p>}
            <p>
              {order.address.city}, {order.address.stateProvince}{" "}
              {order.address.postalCode}
            </p>
            <p>{order.address.country}</p>
            <p>Phone: {order.address.phoneNumber}</p>
          </div>
        ) : (
          <p>Shipping address not available.</p>
        )}
      </div>
    </div>
  );
};

export default TrackOrder;
