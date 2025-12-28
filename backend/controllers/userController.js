import userModel from "../models/userModel.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendVerificationCode, sendWelcomeEmail } from "../middleware/email.js";
import axios from "axios";
import { v2 as cloudinary } from "cloudinary";

// Create Token
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

// Controller Functions for Admin Management
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (
      email !== process.env.ADMIN_EMAIL ||
      password !== process.env.ADMIN_PASS
    ) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }
    const token = jwt.sign(email + password, process.env.JWT_SECRET);
    res.status(200).json({ token: token, message: "Login Successfully" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// Controller Function for Registration
const register = async (req, res) => {
  try {
    const { fname, lname, email, password, confirmPassword } = req.body;

    if (!fname || !lname || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    } else if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email address" });
    } else if (!validator.isStrongPassword(password)) {
      return res.status(400).json({ message: "Password is not strong enough" });
    } else if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    } // Hash password

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const verificationCodeExpiresAt = new Date();
    verificationCodeExpiresAt.setMinutes(
      verificationCodeExpiresAt.getMinutes() + 3
    );

    const newUser = new userModel({
      fname,
      lname,
      email,
      password: hashedPassword,
      verificationCode,
      verificationCodeExpiresAt,
      isVerified: false,
    });

    const user = await newUser.save();

    const subject = "Please verify your email address.";
    await sendVerificationCode(
      fname,
      lname,
      email,
      subject,
      verificationCode,
      verificationCodeExpiresAt
    );

    // User needs to verify email first.
    res.status(201).json({
      userId: user._id,
      email: user.email,
      message:
        "Registration successful. Please check your email for the verification code.",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller Function to verify the code
const verify = async (req, res) => {
  try {
    const { email, verificationCode } = req.body;

    // Find user by email
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check if the provided code matches the one in the database
    if (user.verificationCode !== verificationCode) {
      return res.status(400).json({ message: "Invalid verification code." });
    }

    // Check if the verification code has expired
    if (new Date() > user.verificationCodeExpiresAt) {
      // If expired, remove the code and expiration time from the user document
      user.verificationCode = null;
      user.verificationCodeExpiresAt = null;
      await user.save();
      return res.status(400).json({
        message: "Verification code has expired. Please request a new one.",
      });
    }

    const isFirstVerification = !user.isVerified;

    user.isVerified = true;
    user.verificationCode = null;
    user.verificationCodeExpiresAt = null;
    await user.save();

    // Send a welcome email ONLY if it's the first time verification
    if (isFirstVerification) {
      await sendWelcomeEmail(user.fname, user.lname, user.email);
    }

    // Create a login token after successful verification
    const token = createToken(user._id);

    // After verification, user will still need to log in to get profile completion check
    res.status(200).json({
      token,
      userId: user._id, // Include userId in response
      message:
        "Account successfully verified! You can now log in to your account.",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller Function to resend the verification code
const resendVerificationCode = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    const verificationCodeExpiresAt = new Date();
    verificationCodeExpiresAt.setMinutes(
      verificationCodeExpiresAt.getMinutes() + 3
    );
    user.verificationCode = verificationCode;
    user.verificationCodeExpiresAt = verificationCodeExpiresAt;
    await user.save();
    const subject = "Please verify your email address.";
    await sendVerificationCode(
      user.fname,
      user.lname,
      user.email,
      subject,
      verificationCode,
      verificationCodeExpiresAt
    );
    res.status(200).json({ message: "Verification code sent successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller Function to Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    if (!user.isVerified) {
      return res
        .status(403)
        .json({ message: "Please verify your email address first." });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }
    const token = createToken(user._id);

    res.status(200).json({
      token,
      message: "Login successful.",
      user: {
        _id: user._id,
        email: user.email,
        fname: user.fname,
        lname: user.lname,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller Function to Recover Password
const recoverPassword = async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match." });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    user.password = hashedPassword;
    await user.save();
    const token = createToken(user._id);

    res.status(200).json({ token, message: "Password recovery successful." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller Function to Get User Data
const getUser = async (req, res) => {
  try {
    const { email } = req.query;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    // Only return relevant, non-sensitive public user data
    const userData = {
      _id: user._id,
      fname: user.fname,
      lname: user.lname,
      email: user.email,
      isVerified: user.isVerified,
      shippingDetails: user.shippingDetails,
      billingDetails: user.billingDetails,
    };
    res.status(200).json(userData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller Function for Google Authentication
const googleAuth = async (req, res) => {
  try {
    const { token } = req.body; // Google access_token from frontend

    if (!token) {
      return res
        .status(400)
        .json({ message: "Google access token is required." });
    }

    // 1. Verify the Google access token with Google's API
    const googleResponse = await axios.get(
      `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`
    );
    const googleProfile = googleResponse.data;

    const { email, given_name, family_name, sub: googleId } = googleProfile; // 'sub' is Google's unique user ID

    // 2. Check if a user with this email already exists in your database
    let user = await userModel.findOne({ email });

    if (user) {
      // If user exists, update their Google ID if not already set (optional)
      if (!user.googleId) {
        user.googleId = googleId;
        await user.save();
      }
      // Log them in
      const appToken = createToken(user._id);
      return res.status(200).json({
        user: {
          email: user.email,
          fname: user.fname,
          lname: user.lname,
          isVerified: user.isVerified,
        },
        token: appToken,
        message: "Google login successful.",
      });
    } else {
      // If user does not exist, register them
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8); // Example: random 16-char string
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(generatedPassword, salt);

      const newUser = new userModel({
        fname: given_name || "GoogleUser", // Use Google's first name, or a default
        lname: family_name || "", // Use Google's last name
        email: email,
        password: hashedPassword, // Store a generated password
        googleId: googleId, // Store Google's unique ID
        isVerified: true, // Mark as verified since Google handles email verification
      });

      user = await newUser.save();

      // Send a welcome email for newly registered Google users
      await sendWelcomeEmail(user.fname, user.lname, user.email);

      const appToken = createToken(user._id);
      return res.status(200).json({
        user: {
          email: user.email,
          fname: user.fname,
          lname: user.lname,
          isVerified: user.isVerified,
        },
        token: appToken,
        message: "Google registration successful.",
      });
    }
  } catch (error) {
    console.error(
      "Google Auth Error:",
      error.response ? error.response.data : error.message
    );
    res
      .status(500)
      .json({ message: "Google authentication failed. Please try again." });
  }
};

// Controller Functions for User Display
const userDisplay = async (req, res) => {
  try {
    const users = await userModel.find();
    res.status(200).json({ users: users });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// Controller Function to Get User's Shipping Details
const getShippingDetails = async (req, res) => {
  try {
    const { userId } = req.params; // Get userId from URL parameters

    // Find the user by ID and select only the shippingDetails field
    const user = await userModel.findById(userId).select("shippingDetails");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    // Send back the shipping details array
    res
      .status(200)
      .json({ success: true, shippingDetails: user.shippingDetails });
  } catch (error) {
    console.error("Error fetching shipping details:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch shipping details.",
      error: error.message,
    });
  }
};

// Controller Function to Add Shipping Details
const addShippingDetails = async (req, res) => {
  try {
    const { userId, shippingInfo } = req.body; // Expect userId and the new shippingInfo object

    if (!userId || !shippingInfo) {
      return res.status(400).json({
        success: false,
        message: "User ID and shipping information are required.",
      });
    }

    // Find the user and push the new shippingInfo into the shippingDetails array
    const user = await userModel.findByIdAndUpdate(
      userId,
      { $push: { shippingDetails: shippingInfo } },
      { new: true, runValidators: true } // 'new: true' returns the updated document, 'runValidators: true' ensures schema validation
    );

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    res.status(200).json({
      success: true,
      message: "Shipping details added successfully.",
      user: user,
    });
  } catch (error) {
    console.error("Error adding shipping details:", error);
    // Mongoose validation errors will have a 'name' property of 'ValidationError'
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ success: false, message: error.message, errors: error.errors });
    }
    return res.status(500).json({
      success: false,
      message: "Failed to add shipping details.",
      error: error.message,
    });
  }
};

export {
  adminLogin,
  register,
  verify,
  resendVerificationCode,
  login,
  recoverPassword,
  getUser,
  googleAuth,
  userDisplay,
  getShippingDetails,
  addShippingDetails,
};
