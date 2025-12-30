import express from "express";
import { adminLogin, register, verify, resendVerificationCode, login, recoverPassword, getUser, googleAuth, userDisplay, getShippingDetails, addShippingDetails, editShippingDetails, deleteShippingDetails } from "../controllers/userController.js";
import userAuth from "../middleware/userAuth.js";
import adminAuth from "../middleware/adminAuth.js";

const userRoute = express.Router();

userRoute.post("/admin", adminLogin);
userRoute.post("/register", register);
userRoute.post("/verify", verify);
userRoute.post("/resend", resendVerificationCode);
userRoute.post("/login", login);
userRoute.post("/recover", recoverPassword);
userRoute.get("/user/:userId", userAuth, getUser);
// userRoute.get("/display/:userId", userDisplay);
userRoute.post("/google", googleAuth);
userRoute.get("/allusers", adminAuth, userDisplay);
userRoute.get("/shipping/:userId", getShippingDetails);
userRoute.post("/addshipping", addShippingDetails);
userRoute.put("/editshipping", userAuth, editShippingDetails);
userRoute.delete("/deleteshipping", userAuth, deleteShippingDetails);

export default userRoute;