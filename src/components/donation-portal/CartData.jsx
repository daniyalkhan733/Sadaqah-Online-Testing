import React, { useState } from "react";
import "../../index.css";

const CartData = (props) => {
  const [isCartVisible, setIsCartVisible] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiUrl = import.meta.env.PUBLIC_ICHARMS_URL;
  const apiToken = import.meta.env.PUBLIC_ICHARMS_API_KEY;
  const generateSessionId = () => {
    const existingSessionData = localStorage.getItem("sessionIdData");

    if (existingSessionData) {
      const { sessionId, expiry } = JSON.parse(existingSessionData);

      // Check if the stored session ID is still valid
      if (new Date().getTime() < expiry) {
        return sessionId;
      }
    }

    // Generate a new session ID if none exists or if expired
    const timestamp = new Date().getTime();
    const randomPart = Math.random().toString(36).substring(2, 15);
    const newSessionId = `session-${timestamp}-${randomPart}`;
    const expiryTime = timestamp + 24 * 60 * 60 * 1000; // 1 day in milliseconds

    // Store the new session ID and expiry in localStorage
    localStorage.setItem(
      "sessionIdData",
      JSON.stringify({ sessionId: newSessionId, expiry: expiryTime })
    );

    return newSessionId;
  };
  const fetchCart = async () => {
    setLoading(true);
    const sessionId = generateSessionId();

    try {
      const response = await fetch(`${apiUrl}cart/cart`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ session_id: sessionId }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      setCartItems(data.cart || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  const toggleCartVisibility = () => {
    const newVisibility = !isCartVisible;
    setIsCartVisible(newVisibility);

    if (newVisibility) {
      console.log("Opening cart...", newVisibility);
      fetchCart(); // Fetch cart data when opening the cart
    }
  };
  const removeCartItem = async (cartId) => {
    // console.log(event.target);
    // const cartId = event.target.getAttribute("data-cart-id");
    console.log("Removing item with ID:", cartId);

    try {
      const response = await fetch(`${apiUrl}cart/delete`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cart_id: cartId }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      fetchCart();
    } catch (err) {
      setError(err.message);
    }
  };
  const increaseQuantity = async (event) => {
    const cartId = event.target.getAttribute("data-cart-id");
    const currentQuantity = parseInt(
      event.target.getAttribute("data-cart-quantity"),
      10
    );
    const newQuantity = currentQuantity + 1;

    updateCartQuantity(cartId, newQuantity);
  };
  const decreaseQuantity = async (event) => {
    const cartId = event.target.getAttribute("data-cart-id");
    const currentQuantity = parseInt(
      event.target.getAttribute("data-cart-quantity"),
      10
    );
    const newQuantity = currentQuantity - 1;

    if (newQuantity > 0) {
      updateCartQuantity(cartId, newQuantity);
    } else {
      removeCartItem(cartId);
    }
  };
  const updateCartQuantity = async (cartId, newQuantity) => {
    try {
      const response = await fetch(`${apiUrl}cart/quantity`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cart_id: cartId, quantity: newQuantity }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      fetchCart();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      {/* Cart Toggle Button */}
      <div className="fixed top-24 right-4 z-50">
        <button
          onClick={toggleCartVisibility}
          className="bg-teal-900 text-white p-3 rounded-full relative hover:bg-teal-800"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            ></path>
          </svg>
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {/* {cartItems.length ? cartItems.length : 1} */}
            {props.cartCount}
          </span>
        </button>
      </div>

      {/* Cart Modal */}
      {isCartVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-lg">
            <div className="flex flex-col h-full">
              <div className="bg-teal-900 p-4 text-white flex justify-between items-center">
                <h2 className="text-xl font-semibold">Your Cart</h2>
                <button
                  onClick={toggleCartVisibility}
                  className="text-white hover:text-gray-200"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {loading && <div>Loading...</div>}
                {error && (
                  <div className="text-red-600 text-center">Error: {error}</div>
                )}
                {!loading && !error && cartItems.length === 0 && (
                  <p className="text-center text-gray-600">
                    Your cart is empty.
                  </p>
                )}
                {!loading && !error && cartItems.length > 0 && (
                  <ul className="space-y-4">
                    {cartItems.map((item) => (
                      <li
                        key={item.cart_id}
                        className="flex flex-col gap-4 border p-4 rounded-lg"
                      >
                        <div className="flex items-center space-x-4">
                          <img
                            src={item.program_image}
                            alt={item.program_name}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold text-teal-900">
                              {item.program_name}
                            </h3>
                            <p className="text-gray-600">
                              £{item.donation_amount * item.quantity}
                            </p>
                            <div className="flex items-center space-x-2 mt-2">
                              <button
                                onClick={decreaseQuantity}
                                className="decrease-quantity bg-gray-200 px-2 py-1 rounded"
                                data-action="decrease-quantity"
                                data-cart-id={item.cart_id}
                                data-cart-quantity={item.quantity}
                              >
                                -
                              </button>
                              <span className="quantity">{item.quantity}</span>
                              <button
                                onClick={increaseQuantity}
                                className="increase-quantity bg-gray-200 px-2 py-1 rounded"
                                data-action="increase-quantity"
                                data-cart-id={item.cart_id}
                                data-cart-quantity={item.quantity}
                              >
                                +
                              </button>

                              <button
                                onClick={(event) => {
                                  const button = event.currentTarget; // Use currentTarget to get the button
                                  removeCartItem(button.dataset.cartId); // Pass the cart ID
                                }}
                                className="remove-cart-item ml-4 text-red-500 hover:text-red-600"
                                data-action="remove-cart-item"
                                data-cart-id={item.cart_id}
                              >
                                <span>
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="border-t p-4 bg-gray-50">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold">Total:</span>
                  <span className="text-lg font-bold text-teal-900">
                    £
                    {cartItems
                      .reduce(
                        (total, item) =>
                          total + item.donation_amount * item.quantity,
                        0
                      )
                      .toFixed(2)}
                  </span>
                </div>
                <a href="/donation-portal/checkout">
                  <button className="w-full bg-teal-900 text-white py-3 rounded-md hover:bg-teal-800">
                    Proceed to Checkout
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartData;
