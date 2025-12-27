import React, { useState } from 'react';
import './ChangePassword.css'; // Import the CSS file
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { backendUrl } from '../App';

const ChangePassword = () => {
    // State to hold the new password and confirmation
    const [formData, setFormData] = useState({
        newPassword: "",
        confirmNewPassword: "",
    });
    // State to manage the visibility of the password fields
    const [showPassword, setShowPassword] = useState(false);
    // State to store feedback messages for the user
    const [message, setMessage] = useState("");
    // State to determine if the message is a success or error message
    const [isSuccess, setIsSuccess] = useState(false);
    // State to show a loading indicator on the button during API calls
    const [isLoading, setIsLoading] = useState(false);

    /**
     * Handles changes to input fields and updates the form data state.
     * @param {Object} e - The event object from the input change.
     */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    /**
     * Toggles the visibility of password input fields.
     */
    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };

    /**
     * Performs a basic client-side check for password strength.
     * This should ideally be complemented by server-side validation.
     * @param {string} password - The password string to check.
     * @returns {boolean} - True if the password meets basic strength criteria, false otherwise.
     */
    const isStrongPassword = (password) => {
        // This is a basic check. You should align this with your backend's strength requirements.
        return password.length >= 8 &&
               /[A-Z]/.test(password) &&
               /[a-z]/.test(password) &&
               /[0-9]/.test(password) &&
               /[^A-Za-z0-9]/.test(password);
    };

    /**
     * Handles the form submission to change the user's password.
     * Performs client-side validation, makes an API call, and handles responses.
     * @param {Object} e - The event object from the form submission.
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(""); // Clear previous messages
        setIsLoading(true); // Start loading
        setIsSuccess(false); // Reset success status

        // Client-side validation
        if (!formData.newPassword || !formData.confirmNewPassword) {
            setMessage("Please fill in all fields.");
            setIsSuccess(false);
            setIsLoading(false);
            return;
        }

        if (formData.newPassword !== formData.confirmNewPassword) {
            setMessage("New passwords do not match.");
            setIsSuccess(false);
            setIsLoading(false);
            return;
        }

        if (!isStrongPassword(formData.newPassword)) {
            setMessage("Password is not strong enough. It must be at least 8 characters long and include uppercase, lowercase, number, and special character.");
            setIsSuccess(false);
            setIsLoading(false);
            return;
        }

        const email = localStorage.getItem("email"); // Retrieve email from local storage
        const password = formData.newPassword;
        const confirmPassword = formData.confirmNewPassword;

        try {
            // Make API call to change password
            const response = await axios.post(backendUrl + "/api/user/recover", {
                email: email,
                password,
                confirmPassword
            });

            if (response.status === 200) {
                setMessage("Your password has been successfully changed! Redirecting to login...");
                setIsSuccess(true);
                // Redirect to login page after a short delay
                setTimeout(() => {
                    handleLoginRedirect();
                }, 2000);
            } else {
                setMessage("Failed to change password. Please try again.");
                setIsSuccess(false);
            }
        } catch (error) {
            console.error("Change password error:", error);
            // Handle specific error messages from the backend
            if (error.response && error.response.data && error.response.data.message) {
                setMessage(error.response.data.message);
            } else {
                setMessage("An unexpected error occurred. Please try again later.");
            }
            setIsSuccess(false);
        } finally {
            setIsLoading(false); // Stop loading
        }
    };

    /**
     * Handles navigation back to the sign-in page.
     */
    const handleLoginRedirect = () => {
        window.location.href = '/signin';
    };

    return (
        <div className="changepassword-container">
            <div className="changepassword-card">
                <form className="changepassword-form" onSubmit={handleSubmit}>
                    <p id="changepassword-heading">Change Password</p>
                    <p className="changepassword-subheading">
                        Enter your new password below.
                    </p>
                    {/* New Password Field */}
                    <div className="changepassword-field changepassword-password-field">
                        <FontAwesomeIcon icon={faLock} className="changepassword-input-icon" />
                        <input
                            type={showPassword ? "text" : "password"}
                            className="changepassword-input-field"
                            placeholder="New Password"
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleChange}
                            required
                        />
                        <FontAwesomeIcon
                            icon={showPassword ? faEyeSlash : faEye}
                            className="changepassword-password-toggle-icon"
                            onClick={handleTogglePassword}
                        />
                    </div>
                    {/* Confirm New Password Field */}
                    <div className="changepassword-field changepassword-password-field">
                        <FontAwesomeIcon icon={faLock} className="changepassword-input-icon" />
                        <input
                            type={showPassword ? "text" : "password"}
                            className="changepassword-input-field"
                            placeholder="Confirm New Password"
                            name="confirmNewPassword"
                            value={formData.confirmNewPassword}
                            onChange={handleChange}
                            required
                        />
                        <FontAwesomeIcon
                            icon={showPassword ? faEyeSlash : faEye}
                            className="changepassword-password-toggle-icon"
                            onClick={handleTogglePassword}
                        />
                    </div>
                    {/* Message Display */}
                    {message && (
                        <p className={`changepassword-message ${isSuccess ? "success" : "error"}`}>
                            {message}
                        </p>
                    )}
                    <div className="changepassword-btn">
                        <button
                            className="changepassword-button1"
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Changing...' : 'Change Password'}
                        </button>
                    </div>
                    <button
                        className="changepassword-button2"
                        type="button"
                        onClick={handleLoginRedirect}
                    >
                        Back to Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChangePassword;
