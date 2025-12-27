import React, { useState } from "react";
import "./ForgotPassword.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const [message, setMessage] = useState("");

  const [isSuccess, setIsSuccess] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  /**
   * Handles changes to the email input field.
   * @param {Object} e - The event object from the input change.
   */
  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  /**
   * Handles the form submission to initiate the password reset process.
   * Performs client-side validation and redirects to the verify page.
   * @param {Object} e - The event object from the form submission.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);
    setIsSuccess(false);

    if (!email || !email.includes("@") || !email.includes(".")) {
      setMessage("Please enter a valid email address.");
      setIsSuccess(false);
      setIsLoading(false);
      return;
    }

    try {
      localStorage.setItem("email", email);
      window.location.href = "/verify";
    } catch (error) {
      console.error("Forgot password error:", error);

      setMessage("An unexpected error occurred. Please try again later.");

      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handles navigation back to the sign-in page.
   */
  const handleSignInRedirect = () => {
    window.location.href = "/signin";
  };

  return (
    <div className="forgotpassword-container">
      <div className="forgotpassword-card">
        <form className="forgotpassword-form" onSubmit={handleSubmit}>
          <p id="forgotpassword-heading">Forgot Password</p>
          <p className="forgotpassword-subheading">
            Enter your email address to receive a one time password.
          </p>
          <div className="forgotpassword-field">
            <FontAwesomeIcon
              icon={faEnvelope}
              className="forgotpassword-input-icon"
            />
            <input
              type="email"
              className="forgotpassword-input-field"
              placeholder="username@domain.com"
              name="email"
              value={email}
              onChange={handleChange}
              autoComplete="off"
              required
            />
          </div>
          {/* Message Display */}
          {message && (
            <p
              className={`forgotpassword-message ${
                isSuccess ? "success" : "error"
              }`}
            >
              {message}
            </p>
          )}
          <div className="forgotpassword-btn">
            <button
              className="forgotpassword-button1"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Get OTP"}
            </button>
          </div>
          <button
            className="forgotpassword-button2"
            type="button"
            onClick={handleSignInRedirect}
          >
            Back to Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
