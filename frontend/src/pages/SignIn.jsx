import React, { useState } from "react";
import "./SignIn.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faLock,
  faEye,
  faEyeSlash,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import axios from "axios";
import { backendUrl } from "../App";
import { useGoogleLogin } from "@react-oauth/google";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const SignIn = () => {
  const { login } = useAuth();
  const { fetchCart } = useCart();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
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

    if (!formData.email || !formData.password) {
      setMessage("Please fill in all fields.");
      setIsSuccess(false);
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${backendUrl}/api/user/login`,
        formData
      );

      if (response.status === 200) {
        const { token, user = {} } = response.data;
        setMessage("Login successful! Redirecting...");
        setIsSuccess(true);

        login(token);
        fetchCart();

        localStorage.setItem("email", formData.email);
        localStorage.setItem("userId", user._id);

        setTimeout(() => {
          window.location.href = "/";
        }, 1500);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Login failed. Please check credentials.";
      setMessage(errorMessage);
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setMessage("Signing in with Google...");
      setIsLoading(true);
      try {
        const response = await axios.post(`${backendUrl}/api/user/google`, {
          token: tokenResponse.access_token,
        });

        if (response.status === 200) {
          setMessage("Google Sign-in successful! Redirecting...");
          setIsSuccess(true);

          login(response.data.token);
          fetchCart();

          localStorage.setItem("email", response.data.user.email);
          localStorage.setItem("userId", response.data.user._id);

          setTimeout(() => {
            window.location.href = "/";
          }, 1500);
        }
      } catch (error) {
        setMessage("An error occurred during Google Sign-in.");
        setIsSuccess(false);
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => {
      setMessage("Google Sign-in failed.");
      setIsLoading(false);
    },
  });

  return (
    <div className="signin-container">
      <div className="signin-card">
        <p id="signin-heading">Login</p>
        <form className="signin-form" onSubmit={handleSubmit}>
          <div className="signin-field-group">
            <div className="signin-field">
              <input
                type="email"
                className="signin-input-field"
                placeholder="Email Address"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <FontAwesomeIcon
                icon={faEnvelope}
                className="signin-input-icon"
              />
            </div>

            <div className="signin-field">
              <input
                type={showPassword ? "text" : "password"}
                className="signin-input-field"
                placeholder="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <FontAwesomeIcon icon={faLock} className="signin-input-icon" />
              <span
                className="signin-password-toggle-icon"
                onClick={handleTogglePassword}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </span>
            </div>
          </div>

          <p
            className="signin-forgot-password-button"
            onClick={() => (window.location.href = "/forgot-password")}
          >
            Forgot Password?
          </p>

          {message && (
            <p
              className={`signin-message ${
                isSuccess ? "signin-success" : "signin-error"
              }`}
            >
              {message}
            </p>
          )}

          <button className="signin-button1" type="submit" disabled={isLoading}>
            {isLoading ? <FontAwesomeIcon icon={faSpinner} spin /> : "Log In"}
          </button>

          <div className="signin-btn">
            <button
              className="signin-google-signin-button"
              type="button"
              onClick={() => {
                setIsLoading(true);
                googleLogin();
              }}
              disabled={isLoading}
            >
              <FontAwesomeIcon icon={faGoogle} className="signin-google-icon" />
              Sign in with Google
            </button>

            <button
              className="signin-button2"
              type="button"
              onClick={() => (window.location.href = "/signup")}
            >
              Don't have an account? Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
