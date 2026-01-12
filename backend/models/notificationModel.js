import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
  message: { type: String, required: true },
  status: { type: String, required: true }, // e.g., "Shipped", "Delivered"
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const notificationModel = mongoose.models.Notification || mongoose.model("Notification", notificationSchema);
export default notificationModel;