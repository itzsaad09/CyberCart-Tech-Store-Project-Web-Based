import React from "react";
import { useLocation } from "react-router-dom";
import "./Menu.css";

function Menu() {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleCategoryChange = (event) => {
    const selectedCategory = event.target.value;
    if (selectedCategory) {
      // Only navigate if a valid option is selected (not the hidden "Categories")
      window.location.href = `/categories?category=${selectedCategory}`;
    }
  };

  return (
    <>
      <div className="menu">
        <button
          className={isActive("/") ? "active" : ""}
          onClick={() => (window.location.href = "/")}
        >
          Home
        </button>

        <button
          className={isActive("/about") ? "active" : ""}
          onClick={() => (window.location.href = "/about")}
        >
          About
        </button>

        <select
          name="categories"
          id="categories"
          onChange={handleCategoryChange}
        >
          <option value="" hidden>
            Categories
          </option>
          <option value="all">All</option>
          <option value="airpods">Airpods</option>
          <option value="charger&cabels">Charger & Cabels</option>
          <option value="gaming">Gaming</option>
          <option value="handsfree">Handsfree</option>
          <option value="headphones">Headphones</option>
          <option value="phoneholder">Phone Holder</option>
          <option value="microphone">Microphone</option>
          <option value="smartwatches">Smart Watches</option>
          <option value="speakers">Speakers</option>
          <option value="tripods">Tripods</option>
        </select>

        <button
          className={isActive("/contact") ? "active" : ""}
          onClick={() => (window.location.href = "/contact")}
        >
          Contact
        </button>

        {/* <button
      className={isActive("/trackorder") ? "active" : ""}
      onClick={() => window.location.href = "/trackorder" }
    >
      Track Order
    </button> */}
      </div>
    </>
  );
}

export default Menu;
