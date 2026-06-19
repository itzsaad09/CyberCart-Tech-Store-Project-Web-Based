import React, { useEffect, useState } from "react";
import "./Categories.css";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { backendUrl, currency } from "../App";
import { useCart } from "../context/CartContext";

function Categories() {
  const location = useLocation();
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {
    cart,
    addToCart,
    incrementQuantity,
    decrementQuantity,
    loading: cartLoading,
    error: cartError,
  } = useCart();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const category = queryParams.get("category");

    const fetchCategoryProducts = async () => {
      if (!category) {
        setCategoryProducts([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const apiUrl = backendUrl + "/api/product/display";
        const response = await axios.get(apiUrl, {
          params: { category: category === "all" ? "" : category },
        });

        if (response.status === 200) {
          const sortedProducts = response.data.products.sort((a, b) => {
            const nameA = a.name.toUpperCase();
            const nameB = b.name.toUpperCase();
            if (nameA < nameB) {
              return -1;
            }
            if (nameA > nameB) {
              return 1;
            }
            return 0;
          });
          setCategoryProducts(sortedProducts);
        } else {
          console.error(
            "Failed to fetch products for category:",
            response.status,
          );
          setError("Failed to fetch products for this category.");
        }
      } catch (err) {
        console.error("Error fetching category products:", err);
        setError("Error fetching products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [location.search]);

  return (
    <>
      <div className="categories-page">
        <h1>
          {new URLSearchParams(location.search).get("category")
            ? `${new URLSearchParams(location.search).get("category")}`
            : "Select a Category"}
        </h1>

        {loading && <p>Loading products...</p>}
        {error && <p className="error-message">{error}</p>}
        {!loading && !error && (
          <div className="container">
            {categoryProducts.length > 0 ? (
              categoryProducts.map((product) => {
                const selectedColor = "Black";

                const cartItemId = `${product._id}_${selectedColor}`;

                const currentQuantity = cart[cartItemId]?.quantity || 0;

                return (
                  <div key={product._id} className="item">
                    <img
                      src={product.image[0]}
                      alt={product.name}
                      className="product-image-category"
                    />
                    <h4>{product.name}</h4>
                    <p>
                      {currency} {product.price}
                    </p>

                    {currentQuantity > 0 ? (
                      <div className="quantity-controls">
                        <button
                          onClick={() =>
                            decrementQuantity(product._id, selectedColor)
                          }
                          disabled={cartLoading}
                        >
                          -
                        </button>
                        <span>{currentQuantity}</span>
                        <button
                          onClick={() =>
                            incrementQuantity(product._id, selectedColor)
                          }
                          disabled={cartLoading}
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() =>
                          addToCart(product._id, 1, selectedColor, product)
                        }
                        disabled={cartLoading}
                      >
                        Add to Cart
                      </button>
                    )}
                  </div>
                );
              })
            ) : (
              <p>No products found for this category.</p>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default Categories;
