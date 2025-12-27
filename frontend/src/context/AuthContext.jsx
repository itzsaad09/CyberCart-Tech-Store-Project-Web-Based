import React, { createContext, useState, useEffect, useContext } from 'react';

// Create the AuthContext
export const AuthContext = createContext(null);

// Create the AuthProvider component
export const AuthProvider = ({ children }) => {
  // State to manage login status
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // State to indicate if the authentication check is complete (important for initial render)
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Effect to check for token on initial component mount
  useEffect(() => {
    // Check if the token exists in localStorage
    const token = localStorage.getItem('userToken'); // Use the same key as your Login component will set
    if (token) {
      // You might want to add a call here to validate the token with your backend
      // For now, we'll assume its presence means logged in
      setIsLoggedIn(true);
    }
    setIsAuthLoading(false); // Mark authentication check as complete
  }, []);

  // Function to handle user login
  const login = (token) => {
    localStorage.setItem('userToken', token); // Store the token
    setIsLoggedIn(true); // Update login status
    // Optionally, you might want to redirect here or let the calling component handle it
  };

  // Function to handle user logout
  const logout = () => {
    localStorage.removeItem('userToken'); // Remove the token
    setIsLoggedIn(false); // Update login status
    localStorage.removeItem('userId');
    localStorage.removeItem('email');
    localStorage.removeItem('token');
    localStorage.removeItem('cartData');
    // Optionally, redirect to login page or home page
    window.location.href = '/signin'; // Redirect to login after logout
  };

  // The context value that will be provided to consumers
  const contextValue = {
    isLoggedIn,
    isAuthLoading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easier consumption of the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
