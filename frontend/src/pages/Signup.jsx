import React, { useState } from "react";
import "./SignUp.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faLock,
  faEye,
  faEyeSlash,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import axios from "axios";
import { useGoogleLogin } from '@react-oauth/google';
import { backendUrl } from "../App";
import { useAuth } from "../context/AuthContext"; // Import useAuth

const SignUp = () => {
  // Destructure login from useAuth hook
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);

    if (
      !formData.fname ||
      !formData.lname ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setMessage("Please fill in all fields.");
      setIsSuccess(false);
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match.");
      setIsSuccess(false);
      setIsLoading(false);
      return;
    }

    try {
      localStorage.setItem("email", formData.email);
      const response = await axios.post(
        `${backendUrl}/api/user/register`,
        formData
      );

      if (response.status === 201) {
        setMessage("Registration successful! Redirecting to OTP verification...");
        setIsSuccess(true);
        
        // Use login from useAuth to set the token globally
        if (response.data.token) {
          login(response.data.token);
        }

        setTimeout(() => {
          window.location.href = "/verify";
        }, 1500);
      } else {
        setMessage("Registration failed. Please try again.");
        setIsSuccess(false);
      }
    } catch (error) {
      console.error("Registration error:", error);
      const errorMessage =
        error.response?.data?.message ||
        "An unexpected error occurred. Please try again later.";
      setMessage(errorMessage);
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setMessage("Signing up with Google...");
      setIsLoading(true);
      try {
        const response = await axios.post(`${backendUrl}/api/user/google`, {
          token: tokenResponse.access_token,
        });

        if (response.status === 200) {
          setMessage("Google Sign-up successful! Redirecting...");
          setIsSuccess(true);
          
          // Set global auth state via useAuth
          login(response.data.token);
          
          localStorage.setItem("email", response.data.user.email);
          localStorage.setItem("userId", response.data.user._id);
          
          setTimeout(() => {
            window.location.href = "/";
          }, 1500);
        } else {
          setMessage("Google Sign-up failed on server. Please try again.");
          setIsSuccess(false);
        }
      } catch (error) {
        console.error("Backend Google Auth Error:", error.response?.data || error.message);
        const errorMessage =
          error.response?.data?.message ||
          "An error occurred during Google Sign-up. Please try again.";
        setMessage(errorMessage);
        setIsSuccess(false);
      } finally {
        setIsLoading(false);
      }
    },
    onError: (errorResponse) => {
      console.error("Google Login Error:", errorResponse);
      setMessage("Google Sign-up failed. Please try again.");
      setIsSuccess(false);
      setIsLoading(false);
    },
  });

  const handleLoginRedirect = () => {
    window.location.href = "/signin";
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <p id="signup-heading">Create Account</p>
        <form className="signup-form" onSubmit={handleSubmit}>
          {/* ... existing form fields remain the same ... */}
          <div className="signup-field-group">
            <div className="signup-field">
              <input
                type="text"
                className="signup-input-field"
                placeholder="First Name"
                autoComplete="off"
                name="fname"
                value={formData.fname}
                onChange={handleChange}
                required
              />
              <FontAwesomeIcon icon={faUser} className="signup-input-icon" />
            </div>
            <div className="signup-field">
              <input
                type="text"
                className="signup-input-field"
                placeholder="Last Name"
                autoComplete="off"
                name="lname"
                value={formData.lname}
                onChange={handleChange}
                required
              />
              <FontAwesomeIcon icon={faUser} className="signup-input-icon" />
            </div>
          </div>
          <div className="signup-field">
            <input
              type="email"
              className="signup-input-field"
              placeholder="username@domain.com"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <FontAwesomeIcon icon={faEnvelope} className="signup-input-icon" />
          </div>
          <div className="signup-field">
            <input
              type={showPassword ? "text" : "password"}
              className="signup-input-field"
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <FontAwesomeIcon icon={faLock} className="signup-input-icon" />
            <span className="signup-password-toggle-icon" onClick={handleTogglePassword}>
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </span>
          </div>
          <div className="signup-field">
            <input
              type={showPassword ? "text" : "password"}
              className="signup-input-field"
              placeholder="Confirm Password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            <FontAwesomeIcon icon={faLock} className="signup-input-icon" />
            <span className="signup-password-toggle-icon" onClick={handleTogglePassword}>
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </span>
          </div>

          {message && (
            <p className={`signup-message ${isSuccess ? "success" : "error"}`}>
              {message}
            </p>
          )}

          <div className="signup-button-group">
            <button className="signup-button1" type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} spin className="mr-2" /> Registering...
                </>
              ) : (
                "Register"
              )}
            </button>
            <button
              className="signup-google-signup-button"
              type="button"
              onClick={() => {
                setIsLoading(true);
                googleLogin();
              }}
              disabled={isLoading}
            >
              <FontAwesomeIcon icon={faGoogle} />
              Sign up with Google
            </button>
            <button
              className="signup-button2"
              type="button"
              onClick={handleLoginRedirect}
              disabled={isLoading}
            >
              Already have an account? Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;