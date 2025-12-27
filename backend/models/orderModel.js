import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User",
    required: true 
  },
  items: { type: Array, required: true },
  amount: { type: Number, required: true },
  shippingCharges: { type: Number, required: true },
  address: { type: Object, required: true },
  status: { type: String, default: "Order Placed" },
  paymentMethod: { type: String, required: true },

  deliveryDate: {
    type: Date,
    required: [true, "Delivery date is required"],
    validate: {
      validator: function (value) {
        const today = new Date();
        const minDate = new Date();
        const maxDate = new Date();

        minDate.setDate(today.getDate() + 3);
        maxDate.setDate(today.getDate() + 10);

        minDate.setHours(0, 0, 0, 0);
        maxDate.setHours(23, 59, 59, 999);

        return value >= minDate && value <= maxDate;
      },
      message:
        "Delivery date must be between 3 and 7 days from the order date.",
    },
  },
  deliveryTimeSlot: {
    type: String,
    required: [true, "Delivery time slot is required"],
  },

  cardDetails: { type: Object, default: {} },
  payment: { type: Boolean, required: true, default: false },
  statusHistory: [
    {
      _id: false,
      status: { type: String, required: true },
      timestamp: { type: Date, default: Date.now },
    },
  ],
});

orderSchema.pre("save", function (next) {
  if (this.isNew) {
    this.statusHistory.push({ status: this.status, timestamp: new Date() });
  }
  next();
});

const orderModel =
  mongoose.models.Order || mongoose.model("Order", orderSchema);
export default orderModel;
