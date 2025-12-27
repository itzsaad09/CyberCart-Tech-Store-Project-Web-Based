import React, { useState, useEffect } from "react";
import axios from "axios";
import logo from "/src/assets/logo1.png";
import "./Navbar.css";
import Menu from "../components/Menu.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faUser,
  faCartShopping,
  faBars,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { useCart } from "../context/CartContext";
import { backendUrl } from "../App";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const [isMobileView, setIsMobileView] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [showDesktopMenu, setShowDesktopMenu] = useState(false);

  // States for search functionality
  const [allProducts, setAllProducts] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  // States for user dropdown visibility (still local to Navbar)
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  // Get isLoggedIn and logout function from AuthContext
  const { isLoggedIn, logout } = useAuth();

  // Get totalCartItems from the global cart context
  const { totalCartItems } = useCart();

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobileView(window.innerWidth < 992);
      if (window.innerWidth >= 992) {
        setShowMenu(false);
        setShowDesktopMenu(false);
        setShowMobileSearch(false);
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  // Effect to fetch all products when the component mounts
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const response = await axios.get(backendUrl + "/api/product/display");

        if (response.status === 200) {
          setAllProducts(response.data.products);
        } else {
          console.error("Failed to fetch all products:", response.status);
        }
      } catch (error) {
        console.error("Error fetching all products:", error);
      }
    };
    fetchAllProducts();
  }, []);

  // Effect to debounce the search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  // Effect to filter products based on the debounced search query
  useEffect(() => {
    if (debouncedSearchQuery) {
      const filtered = allProducts.filter((product) =>
        product.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
      );
      setSearchResults(filtered);
      setShowSuggestions(true);
    } else {
      setSearchResults([]);
      setShowSuggestions(false);
    }
  }, [debouncedSearchQuery, allProducts]);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
    setShowSuggestions(false);
  };

  const handleSearchInputFocus = () => {
    if (searchQuery) {
      setShowSuggestions(true);
    }
  };

  const handleSearchInputBlur = () => {
    setTimeout(() => {
      setShowSuggestions(false);
    }, 100);
  };

  const handleSuggestionClick = (productName) => {
    setSearchQuery(productName);
    setShowSuggestions(false);
    console.log(`Selected suggestion: ${productName}`);
  };

  // Function to handle user icon click
  const handleUserIconClick = () => {
    if (isLoggedIn) {
      setShowUserDropdown(!showUserDropdown); // Toggle dropdown if logged in
    } else {
      window.location.href = "/signin"; // Redirect to login if not logged in
    }
  };

  // Use the logout function from AuthContext directly
  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <div className="main">
        <div className="item logo-container">
          <img
            className="logo"
            onClick={() => (window.location.href = "/")}
            src={logo}
            alt="Company Logo"
          />
        </div>

        {!isMobileView ? (
          <>
            <div className="item search-container">
              <form onSubmit={handleSearch}>
                <input
                  className="search"
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={handleSearchInputFocus}
                  onBlur={handleSearchInputBlur}
                />
                <button type="submit" className="search-icon-btn">
                  <FontAwesomeIcon
                    className="searchicon"
                    icon={faMagnifyingGlass}
                  />
                </button>
              </form>

              {showSuggestions && searchResults.length > 0 && (
                <div className="search-suggestions-dropdown">
                  {searchResults.map((product) => (
                    <div
                      key={product._id}
                      className="suggestion-item"
                      onClick={() => handleSuggestionClick(product.name)}
                    >
                      <img
                        src={product.image[0]}
                        alt={product.name}
                        className="suggestion-item-image"
                      />
                      <span>{product.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Desktop User Section */}
            <div className="item user-container">
              <div className="container">
                <div className="div1">
                  <div
                    className="inneritem"
                    onMouseEnter={() => isLoggedIn && setShowUserDropdown(true)}
                    onMouseLeave={() =>
                      isLoggedIn && setShowUserDropdown(false)
                    }
                  >
                    <FontAwesomeIcon
                      className="usericon"
                      icon={faUser}
                      onClick={handleUserIconClick}
                    />
                    {isLoggedIn ? (
                      <div className="user-dropdown">
                        {showUserDropdown && (
                          <div className="dropdown-menu">
                            {/* <button
                              className="dropdown-item"
                              onClick={() =>
                                (window.location.href = "/profile")
                              }
                            >
                              My Profile
                            </button> */}
                            {/* <button
                              className="dropdown-item"
                              onClick={() =>
                                (window.location.href = "/track-order")
                              }
                            >
                              Track Order
                            </button> */}
                            <button
                              className="dropdown-item"
                              onClick={() =>
                                (window.location.href = "/myorders")
                              }
                            >
                              My Orders
                            </button>
                            <button
                              className="dropdown-item"
                              onClick={handleLogout}
                            >
                              Logout
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <>
                        <button
                          className="login"
                          onClick={() => (window.location.href = "/signin")}
                        >
                          Login
                        </button>
                        <button
                          className="signup"
                          onClick={() => (window.location.href = "/signup")}
                        >
                          Signup
                        </button>
                      </>
                    )}
                  </div>
                </div>
                <div className="div3">
                  <div className="line"></div>
                </div>
                <div className="div4">
                  <div
                    className="cartsection"
                    onClick={() => (window.location.href = "/cart")}
                  >
                    <div className="cart-icon-wrapper">
                      <FontAwesomeIcon
                        className="carticon"
                        icon={faCartShopping}
                      />
                      {totalCartItems > 0 && (
                        <span className="cart-count">{totalCartItems}</span>
                      )}
                    </div>
                    <button className="cartButton">Cart</button>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Mobile Icons Section */}
            <div className="mobile-icons">
              {showMobileSearch && (
                <div className="mobile-search-container">
                  <form onSubmit={handleSearch} className="mobile-search-form">
                    <input
                      className="mobile-search"
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={handleSearchInputFocus}
                      onBlur={handleSearchInputBlur}
                    />
                    <button type="submit" className="mobile-search-icon-btn">
                      <FontAwesomeIcon icon={faMagnifyingGlass} />
                    </button>
                  </form>

                  {showSuggestions && searchResults.length > 0 && (
                    <div className="mobile-search-suggestions-dropdown">
                      {searchResults.map((product) => (
                        <div
                          key={product._id}
                          className="suggestion-item"
                          onClick={() => handleSuggestionClick(product.name)}
                        >
                          <img
                            src={product.image[0]}
                            alt={product.name}
                            className="suggestion-item-image"
                          />
                          <span>{product.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Mobile Toggle Icons */}
              <FontAwesomeIcon
                className="mobile-search-toggle"
                icon={faMagnifyingGlass}
                onClick={() => setShowMobileSearch(!showMobileSearch)}
              />
              <div
                className="mobile-user-wrapper"
                onClick={handleUserIconClick}
              >
                <FontAwesomeIcon className="mobile-user-icon" icon={faUser} />
                {isLoggedIn && showUserDropdown && (
                  <div className="dropdown-menu mobile-user-dropdown">
                    {/* <button
                      className="dropdown-item"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.location.href = "/profile";
                      }}
                    >
                      My Profile
                    </button> */}
                    {/* <button
                      className="dropdown-item"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.location.href = "/track-order";
                      }}
                    >
                      Track Order
                    </button> */}
                    <button
                      className="dropdown-item"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.location.href = "/myorders";
                      }}
                    >
                      My Orders
                    </button>
                    <button
                      className="dropdown-item"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLogout();
                      }}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
              <div
                className="cart-icon-wrapper"
                onClick={() => (window.location.href = "/cart")}
              >
                <FontAwesomeIcon
                  className="mobile-cart-icon"
                  icon={faCartShopping}
                />
                {totalCartItems > 0 && (
                  <span className="cart-count">{totalCartItems}</span>
                )}
              </div>
              <FontAwesomeIcon
                className="mobile-menu-icon"
                icon={showMenu ? faXmark : faBars}
                onClick={() => setShowMenu(!showMenu)}
              />
            </div>
          </>
        )}
      </div>
      {isMobileView && showMenu && <Menu className="mobile-show-menu" />}
      {isMobileView || showDesktopMenu || (
        <Menu className="desktop-show-menu" />
      )}
    </>
  );
}

export default Navbar;
