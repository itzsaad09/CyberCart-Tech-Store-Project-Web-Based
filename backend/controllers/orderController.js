import userModel from "../models/userModel.js";
import productModel from "../models/productModel.js";
import orderModel from "../models/orderModel.js";
import {
  sendOrderPlacedEmail,
  sendOrderShippedEmail,
  sendOrderDeliveredEmail,
} from "../middleware/email.js";

const placeOrder = async (req, res) => {
  try {
    const {
      userId,
      cartItemsArray,
      shippingFees,
      finalTotalBill,
      shippingInfo,
      paymentMethod,
      cardDetails,
      deliveryDate,
      deliveryTimeSlot,
    } = req.body;

    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found. Cannot place order.",
      });
    }

    for (const item of cartItemsArray) {
      const product = await productModel.findById(item.productId);
      if (!product || product.countInStock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Sorry, ${
            product ? product.name : "an item"
          } is out of stock.`,
        });
      }
    }

    const orderData = {
      userId: userId,
      items: cartItemsArray,
      amount: finalTotalBill,
      shippingCharges: shippingFees,
      address: shippingInfo,
      status: "Order Placed",
      paymentMethod: paymentMethod,
      payment: paymentMethod === "cash_on_delivery" ? false : true,
      deliveryDate: new Date(deliveryDate),
      deliveryTimeSlot: deliveryTimeSlot,
    };

    if (paymentMethod === "credit_card" && cardDetails) {
      orderData.cardDetails = {
        cardName: cardDetails.cardName,
        cardNumberLast4: cardDetails.cardNumber.slice(-4),
        expiryDate: cardDetails.expiryDate,
      };
    }

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    const orderDetailsForEmail = {
      id: newOrder._id,
      total: `Rs. ${finalTotalBill}`,
      address: `${shippingInfo.addressLine1 || shippingInfo.address}, ${
        shippingInfo.city
      }`,
    };

    sendOrderPlacedEmail(
      user.fname,
      user.lname,
      user.email,
      orderDetailsForEmail
    );

    const stockUpdateOps = cartItemsArray.map((item) => ({
      updateOne: {
        filter: { _id: item.productId },
        update: { $inc: { countInStock: -item.quantity } },
      },
    }));
    await productModel.bulkWrite(stockUpdateOps);

    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    res.status(200).json({
      success: true,
      message: "Order Placed Successfully",
      orderId: newOrder._id,
    });
  } catch (error) {
    console.error("Error placing order:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to place order",
      error: error.message,
    });
  }
};

const placeOrderStripe = async (req, res) => {
  try {
    res.status(501).json({
      success: false,
      message: "Stripe integration not yet implemented",
    });
  } catch (error) {
    console.error("Error with Stripe payment:", error);
    res.status(500).json({
      success: false,
      message: "Stripe payment failed",
      error: error.message,
    });
  }
};

const verifyPayment = async (req, res) => {
  try {
    res.status(501).json({
      success: false,
      message: "Payment verification not yet implemented",
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({
      success: false,
      message: "Payment verification failed",
      error: error.message,
    });
  }
};

const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching all orders:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    const order = await orderModel.findById(orderId).populate("userId");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const previousStatus = order.status;
    order.status = status;

    if (
      order.statusHistory.length === 0 ||
      order.statusHistory[order.statusHistory.length - 1].status !== status
    ) {
      order.statusHistory.push({ status: status, timestamp: new Date() });
    }

    await order.save();

    const user = order.userId;

    if (user && user.email) {
      if (status === "Shipped") {
        const trackingNumber =
          order.trackingNumber ||
          `CB-${order._id.toString().slice(-6).toUpperCase()}`;
        sendOrderShippedEmail(
          user.fname,
          user.email,
          order._id,
          trackingNumber
        );
      } else if (status === "Delivered") {
        sendOrderDeliveredEmail(user.fname, user.email, order._id);
      }
    } else {
      console.warn(
        `No user email found for Order ID: ${orderId}. Email not sent.`
      );
    }

    res.json({ success: true, message: "Order status updated", order });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update order status",
      error: error.message,
    });
  }
};

const userOrders = async (req, res) => {
  try {
    const userId = req.params.userId;
    const orders = await orderModel.find({ userId });
    res.json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user orders",
      error: error.message,
    });
  }
};

const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await orderModel.findById(orderId);

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found." });
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    console.error("Error fetching order by ID:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch order details.",
      error: error.message,
    });
  }
};

export {
  placeOrder,
  placeOrderStripe,
  verifyPayment,
  allOrders,
  updateOrderStatus,
  userOrders,
  getOrderById,
};
