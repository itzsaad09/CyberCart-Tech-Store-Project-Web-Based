import express from "express";
import { placeOrder, placeOrderStripe, verifyPayment, allOrders, updateOrderStatus, userOrders, getOrderById } from "../controllers/orderController.js";
import adminAuth from "../middleware/adminAuth.js";
import userAuth from "../middleware/userAuth.js";
import notificationModel from "../models/notificationModel.js";

const orderRoute = express.Router();

// For Admin
orderRoute.get('/list', adminAuth, allOrders)
orderRoute.post('/update', adminAuth, updateOrderStatus)

// For Payment
orderRoute.post('/place', userAuth, placeOrder)
orderRoute.post('/stripe', userAuth, placeOrderStripe)

// For Verifying Payment
orderRoute.post('/verify', userAuth, verifyPayment)

// For User
orderRoute.get('/userorders/:userId', userAuth, userOrders) 
orderRoute.get('/:orderId', userAuth, getOrderById);

// For Notifications
orderRoute.get('/notifications/:userId', userAuth, async (req, res) => {
  try {
    const notifications = await notificationModel.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json({ success: true, notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Mark all as read
orderRoute.post('/notifications/read-all', userAuth, async (req, res) => {
  try {
    const { userId } = req.body;
    await notificationModel.updateMany({ userId, isRead: false }, { isRead: true });
    res.json({ success: true, message: "All notifications marked as read" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default orderRoute;
