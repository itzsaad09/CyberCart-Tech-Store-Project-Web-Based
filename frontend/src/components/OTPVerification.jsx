import React, { useState, useEffect, useRef } from "react";
import "./OTPVerification.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelopeOpenText,
  faSyncAlt,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { backendUrl } from "../App";

const OTPVerification = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const [message, setMessage] = useState("");

  const [isSuccess, setIsSuccess] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [countdown, setCountdown] = useState(60);

  const [isResendDisabled, setIsResendDisabled] = useState(true);

  const inputRefs = useRef([]);

  const email = localStorage.getItem("email");

  useEffect(() => {
    let timer;
    if (isResendDisabled) {
      timer = setInterval(() => {
        setCountdown((prevCountdown) => {
          if (prevCountdown <= 1) {
            clearInterval(timer);
            setIsResendDisabled(false);
            return 0;
          }
          return prevCountdown - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isResendDisabled]);

  /**
   * Handles OTP input changes and automatically focuses on the next input field.
   * Ensures only single digits are entered.
   * @param {HTMLInputElement} element 
   * @param {number} index 
   */
  const handleOtpChange = (element, index) => {
    if (isNaN(element.value) || element.value.length > 1) {
      setOtp((prevOtp) => {
        const newOtp = [...prevOtp];
        newOtp[index] = prevOtp[index];
        return newOtp;
      });
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    if (element.value !== "" && index < 5) {
      inputRefs.current[index + 1].focus();
    } else if (element.value === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  /**
   * Handles the form submission to verify the OTP.
   * Performs client-side validation and makes an API call to the backend.
   * @param {Object} e - The event object from the form submission.
   */
  const handleVerify = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);

    const otpCode = otp.join("");

    if (otpCode.length !== 6) {
      setMessage("Please enter the complete 6-digit code.");
      setIsSuccess(false);
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(backendUrl + "/api/user/verify", {
        email,
        verificationCode: otpCode,
      });

      const token = Boolean(localStorage.getItem("token"));

      if (response.status === 200) {
        setMessage("Verification successful! Redirecting...");
        setIsSuccess(true);

        if (token) {
          setTimeout(() => {
            window.location.href = "/";
          }, 1500);
        } else {
          setTimeout(() => {
            window.location.href = "/change-password";
          }, 1500);
        }
      } else {
        setMessage("Verification failed. Please try again.");
        setIsSuccess(false);
      }
    } catch (error) {
      console.error("Verification error:", error);

      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setMessage(error.response.data.message);
      } else {
        setMessage("An unexpected error occurred. Please try again later.");
      }
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handles resending the verification code to the user's email.
   * Makes an API call to the backend and resets the countdown timer.
   */
  const handleResend = async () => {
    setMessage("");
    setIsLoading(true);

    try {
      const response = await axios.post(backendUrl + "/api/user/resend", {
        email,
      });

      if (response.status === 200) {
        setMessage("New verification code sent to your email!");
        setIsSuccess(true);

        setCountdown(60);
        setIsResendDisabled(true);
      } else {
        setMessage("Failed to resend code. Please try again.");
        setIsSuccess(false);
      }
    } catch (error) {
      console.error("Resend code error:", error);

      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setMessage(error.response.data.message);
      } else {
        setMessage("An unexpected error occurred. Please try again later.");
      }
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const messageClearTimer = setTimeout(() => {
      setMessage("");
    }, 1400);

    return () => clearTimeout(messageClearTimer);
  }, [message]);

  return (
    <div className="otpverification-container">
      <div className="otpverification-card">
        <form className="otpverification-form" onSubmit={handleVerify}>
          <p id="otpverification-heading">Verify Your Account</p>
          <p className="otpverification-subheading">
            A 6-digit code has been sent to your email address.
          </p>
          <div className="otpverification-input-container">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleOtpChange(e.target, index)}
                onFocus={(e) => e.target.select()}
                ref={(el) => (inputRefs.current[index] = el)}
                className="otpverification-input-field"
              />
            ))}
          </div>
          {/* Message Display */}
          {message && (
            <p
              className={`otpverification-message ${
                isSuccess ? "success" : "error"
              }`}
            >
              {message}
            </p>
          )}
          <button
            className="otpverification-button1"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Verifying..." : "Verify Account"}
          </button>
          <button
            className="otpverification-button2"
            type="button"
            onClick={handleResend}
            disabled={isResendDisabled || isLoading}
          >
            <FontAwesomeIcon icon={faSyncAlt} />
            {isResendDisabled
              ? ` Resend code in ${countdown}s`
              : " Resend Code"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OTPVerification;
