import userModel from "../models/userModel.js";
import Product from "../models/productModel.js";

const calculateBill = (cartData) => {
  let totalBill = 0;

  for (const cartItemId in cartData) {
    if (cartData.hasOwnProperty(cartItemId)) {
      const itemDetails = cartData[cartItemId];

      totalBill +=
        (Number(itemDetails.price) || 0) * (Number(itemDetails.quantity) || 0);
    }
  }
  return totalBill;
};

const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity, color } = req.body;

    if (!userId || !productId || !quantity || !color) {
      return res
        .status(400)
        .json({
          message:
            "Missing required fields: userId, productId, quantity, color.",
        });
    }

    const userData = await userModel.findById(userId);
    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let cartData = userData.cartData || {};

    const cartItemId = `${productId}_${color}`;

    if (cartData[cartItemId]) {
      cartData[cartItemId].quantity =
        Number(cartData[cartItemId].quantity) + Number(quantity);
    } else {
      cartData[cartItemId] = {
        productId: productId,
        name: product.name,
        price: Number(product.price),
        quantity: Number(quantity),
        color: color,
        image: product.image,
      };
    }

    userData.cartData = cartData;
    userData.markModified("cartData");

    userData.bill = calculateBill(cartData);
    await userData.save();

    res
      .status(200)
      .json({
        message: "Product added to cart successfully",
        cartData: userData.cartData,
        bill: userData.bill,
      });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateCart = async (req, res) => {
  try {
    const { userId, productId, color, quantity } = req.body;

    if (!userId || !productId || !color || quantity === undefined) {
      return res
        .status(400)
        .json({
          message:
            "Missing required fields: userId, productId, color, quantity.",
        });
    }

    const userData = await userModel.findById(userId);
    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    let cartData = userData.cartData || {};
    const cartItemId = `${productId}_${color}`;

    if (cartData[cartItemId]) {
      if (Number(quantity) <= 0) {
        delete cartData[cartItemId];
      } else {
        cartData[cartItemId].quantity = Number(quantity);
      }

      userData.cartData = cartData;
      userData.markModified("cartData");

      userData.bill = calculateBill(cartData);
      await userData.save();

      res
        .status(200)
        .json({
          message: "Cart updated successfully",
          cartData: userData.cartData,
          bill: userData.bill,
        });
    } else {
      res
        .status(404)
        .json({ message: "Product not found in cart with specified color." });
    }
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteCartItem = async (req, res) => {
  try {
    const { userId, productId, color } = req.body;

    if (!userId || !productId || !color) {
      return res
        .status(400)
        .json({
          message: "Missing required fields: userId, productId, color.",
        });
    }

    const userData = await userModel.findById(userId);
    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    let cartData = userData.cartData || {};
    const cartItemId = `${productId}_${color}`;

    if (cartData[cartItemId]) {
      delete cartData[cartItemId];
      userData.cartData = cartData;
      userData.markModified("cartData");

      userData.bill = calculateBill(cartData);
      await userData.save();

      res
        .status(200)
        .json({
          message: "Product removed from cart successfully",
          cartData: userData.cartData,
          bill: userData.bill,
        });
    } else {
      res.status(404).json({ message: "Product not found in cart." });
    }
  } catch (error) {
    console.error("Error deleting cart item:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const emptyCart = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    const userData = await userModel.findById(userId);
    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    userData.cartData = {};
    userData.markModified("cartData");
    userData.bill = 0;

    await userData.save();

    res
      .status(200)
      .json({ message: "Cart emptied successfully", cartData: {}, bill: 0 });
  } catch (error) {
    console.error("Error emptying cart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getCart = async (req, res) => {
  try {
    const userId = req.query.userId || req.body.userId;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    const userData = await userModel.findById(userId);
    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    const cartData = userData.cartData || {};
    const bill = userData.bill || 0;

    res.status(200).json({ cartData: cartData, bill: bill });
  } catch (error) {
    console.error("Error getting cart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export { addToCart, updateCart, getCart, deleteCartItem, emptyCart };
