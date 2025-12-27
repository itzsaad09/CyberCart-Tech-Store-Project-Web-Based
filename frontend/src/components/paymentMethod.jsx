import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { currency, backendUrl } from "../App";
import "./paymentMethod.css";
import axios from "axios";

const PaymentMethod = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract data passed from shippingDetails.jsx
  const { cartData, shippingInfo } = location.state || {};
  const token = localStorage.getItem("userToken");
  const userId = localStorage.getItem("userId");

  // --- NEW: Delivery State ---
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryTimeSlot, setDeliveryTimeSlot] = useState("");

  // Predefined time slots
  const timeSlots = [
    "08:00 AM - 09:00 AM",
    "09:00 AM - 10:00 AM",
    "10:00 AM - 11:00 AM",
    "11:00 AM - 12:00 PM",
    "12:00 PM - 01:00 PM",
    "01:00 PM - 02:00 PM",
    "02:00 PM - 03:00 PM",
    "03:00 PM - 04:00 PM",
    "04:00 PM - 05:00 PM",
    "05:00 PM - 06:00 PM",
    "06:00 PM - 07:00 PM",
    "07:00 PM - 08:00 PM",
    "08:00 PM - 09:00 PM",
    "09:00 PM - 10:00 PM",
    "10:00 PM - 11:00 PM",
    "11:00 PM - 12:00 AM",
  ];

  // Logic for 3-day gap and 1-week choice window
  const getDeliveryLimits = () => {
    const today = new Date();
    const min = new Date();
    min.setDate(today.getDate() + 3);
    const max = new Date();
    max.setDate(today.getDate() + 10);

    return {
      minStr: min.toISOString().split("T")[0],
      maxStr: max.toISOString().split("T")[0],
    };
  };

  const { minStr, maxStr } = getDeliveryLimits();

  useEffect(() => {
    if (!cartData || !shippingInfo) {
      console.warn(
        "Missing cartData or shippingInfo in PaymentMethod. Redirecting to cart."
      );
      navigate("/cart");
    }
  }, [location.state, cartData, shippingInfo, navigate]);

  const cartItemsArray = cartData?.cart || [];
  const checkedBill = cartData?.checkedBill || 0;
  const shippingFees = cartData?.shippingFees || 0;
  const finalTotalBill = cartData?.finalTotalBill || checkedBill + shippingFees;

  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState("cash_on_delivery");
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  });

  const handlePaymentMethodChange = (e) => {
    setSelectedPaymentMethod(e.target.value);
  };

  const handleCardDetailsChange = (e) => {
    const { name, value } = e.target;
    setCardDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    // Validation for new delivery fields
    if (!deliveryDate || !deliveryTimeSlot) {
      alert("Please select a delivery date and time slot.");
      return;
    }

    if (selectedPaymentMethod === "credit_card") {
      if (
        !cardDetails.cardNumber ||
        !cardDetails.cardName ||
        !cardDetails.expiryDate ||
        !cardDetails.cvv
      ) {
        alert("Please fill in all card details.");
        return;
      }
    }

    try {
      const response = await axios.post(
        `${backendUrl}/api/order/place`,
        {
          userId,
          cartItemsArray,
          checkedBill,
          shippingFees,
          finalTotalBill,
          shippingInfo,
          paymentMethod: selectedPaymentMethod,
          cardDetails:
            selectedPaymentMethod === "credit_card" ? cardDetails : {},
          deliveryDate,
          deliveryTimeSlot,
        },
        {
          headers: {
            token: token,
          },
        }
      );
      alert("Order Placed Successfully!");
      localStorage.removeItem("cartData");
      window.location.href = "/myorders";
    } catch (error) {
      console.error(
        "Error placing order:",
        error.response ? error.response.data : error.message
      );
      alert(
        error.response?.data?.message ||
          "Failed to place order. Please try again."
      );
    }
  };

  return (
    <>
      <div className="payment-method-container">
        <form onSubmit={handlePlaceOrder} className="payment-form">
          <h1 className="payment-title">Payment Method</h1>

          {/* Order Summary Section */}
          <div className="order-summary-section">
            <h2 className="section-title">Order Summary</h2>
            <div className="order-items">
              {cartItemsArray.length > 0 ? (
                cartItemsArray.map((item) => (
                  <div
                    key={`${item.productId}_${item.color || item.id}`}
                    className="order-item-detail"
                  >
                    <span>
                      {item.name} (x{item.quantity})
                    </span>
                    <span>
                      {currency}
                      {(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))
              ) : (
                <p>No items in order summary.</p>
              )}
            </div>
            <div className="order-totals">
              <div className="total-row">
                <span>Subtotal:</span>
                <span>
                  {currency}
                  {checkedBill.toFixed(2)}
                </span>
              </div>
              <div className="total-row">
                <span>Shipping:</span>
                <span>
                  {currency}
                  {shippingFees.toFixed(2)}
                </span>
              </div>
              <div className="total-row final-total">
                <span>Total:</span>
                <span>
                  {currency}
                  {finalTotalBill.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Shipping Address Display */}
          {shippingInfo && (
            <div className="shipping-address-display">
              <h2 className="section-title">Shipping Address</h2>
              <p>{shippingInfo.fullName}</p>
              <p>{shippingInfo.addressLine1}</p>
              {shippingInfo.addressLine2 && <p>{shippingInfo.addressLine2}</p>}
              <p>
                {shippingInfo.city}, {shippingInfo.stateProvince}{" "}
                {shippingInfo.postalCode}
              </p>
              <p>{shippingInfo.country}</p>
              <p>Phone: {shippingInfo.phoneNumber}</p>
            </div>
          )}

          {/* Payment Method Selection */}
          <div className="payment-selection-section">
            <h2 className="section-title">Select Payment Method</h2>
            <div className="payment-options">
              <label className="payment-option">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="credit_card"
                  checked={selectedPaymentMethod === "credit_card"}
                  onChange={handlePaymentMethodChange}
                />
                Credit/Debit Card
              </label>
              <label className="payment-option">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cash_on_delivery"
                  checked={selectedPaymentMethod === "cash_on_delivery"}
                  onChange={handlePaymentMethodChange}
                />
                Cash on Delivery (COD)
              </label>
            </div>
          </div>

          {/* Credit Card Details Form */}
          {selectedPaymentMethod === "credit_card" && (
            <div className="card-details-section">
              <h2 className="section-title">Card Details</h2>
              <div className="form-group">
                <label htmlFor="cardNumber">Card Number</label>
                <input
                  type="text"
                  id="cardNumber"
                  name="cardNumber"
                  value={cardDetails.cardNumber}
                  onChange={handleCardDetailsChange}
                  placeholder="XXXX XXXX XXXX XXXX"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="cardName">Cardholder Name</label>
                <input
                  type="text"
                  id="cardName"
                  name="cardName"
                  value={cardDetails.cardName}
                  onChange={handleCardDetailsChange}
                  placeholder="Name on Card"
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="expiryDate">Expiry Date (MM/YY)</label>
                  <input
                    type="text"
                    id="expiryDate"
                    name="expiryDate"
                    value={cardDetails.expiryDate}
                    onChange={handleCardDetailsChange}
                    placeholder="MM/YY"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="cvv">CVV</label>
                  <input
                    type="password"
                    id="cvv"
                    name="cvv"
                    value={cardDetails.cvv}
                    onChange={handleCardDetailsChange}
                    placeholder="XXX"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* --- ADDED: Delivery Time Select below Payment --- */}
          <div
            className="delivery-schedule-section"
            style={{
              marginTop: "20px",
              padding: "15px",
              border: "1px solid #ddd",
              borderRadius: "8px",
            }}
          >
            <h2 className="section-title">Schedule Delivery</h2>
            <div className="form-row" style={{ display: "flex", gap: "15px" }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label>Delivery Date</label>
                <input
                  type="date"
                  min={minStr}
                  max={maxStr}
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  required
                  style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label>Time Slot</label>
                <select
                  value={deliveryTimeSlot}
                  onChange={(e) => setDeliveryTimeSlot(e.target.value)}
                  required
                  style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                >
                  <option value="">Select Slot</option>
                  {timeSlots.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Place Order Button */}
          <button
            type="submit"
            className="place-order-button"
            style={{ marginTop: "20px" }}
          >
            Place Order
          </button>
        </form>
      </div>
    </>
  );
};

export default PaymentMethod;
