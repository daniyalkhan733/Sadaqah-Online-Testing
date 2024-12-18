import React, { useState, useEffect } from "react";
import "../../../index.css";

const DonationCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiUrl = import.meta.env.PUBLIC_ICHARMS_URL;
  const apiToken = import.meta.env.PUBLIC_ICHARMS_API_KEY;

  const generateSessionId = () => {
    const existingSessionData = localStorage.getItem("sessionIdData");

    if (existingSessionData) {
      const { sessionId, expiry } = JSON.parse(existingSessionData);

      if (new Date().getTime() < expiry) {
        return sessionId;
      }
    }

    const timestamp = new Date().getTime();
    const randomPart = Math.random().toString(36).substring(2, 15);
    const newSessionId = `session-${timestamp}-${randomPart}`;
    const expiryTime = timestamp + 24 * 60 * 60 * 1000;

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
  const removeCartItem = async (cartId) => {
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
  const updateParticipantNames = async (event) => {
    try {
      const cartIds = JSON.parse(event.target.getAttribute("data-cart-ids"));
      const cartQuantities = JSON.parse(
        event.target.getAttribute("data-cart-quantities")
      );
      const participantDetails = [];

      cartIds.forEach((cartId, cartIndex) => {
        const fallbackQuantity = cartQuantities[cartIndex];
        const quantityButton = document.querySelector(
          `button[data-cart-id="${cartId}"][data-cart-quantity]`
        );

        // Get the item quantity
        const itemQuantity = quantityButton
          ? parseInt(quantityButton.getAttribute("data-cart-quantity"), 10)
          : fallbackQuantity;

        // Ensure quantity is valid
        if (!itemQuantity || isNaN(itemQuantity)) {
          return; // Skip this cartId if quantity is invalid
        }

        // Arrays for plaque names and donation flags
        const plaqueNames = [];
        const donateForSelfFlags = [];

        for (let i = 0; i < itemQuantity; i++) {
          const plaqueInput = document.querySelector(
            `input[type="text"][data-cart-id="${cartId}"][data-index="${i}"]`
          );

          const donateForSelfCheckbox = document.querySelector(
            `input[type="checkbox"][data-cart-id="${cartId}"][data-index="${i}"]`
          );

          const plaqueName = plaqueInput ? plaqueInput.value.trim() : "";
          const isDonateForSelf = donateForSelfCheckbox
            ? donateForSelfCheckbox.checked
            : false;

          if (plaqueName || isDonateForSelf) {
            if (plaqueName) {
              plaqueNames.push(plaqueName);
            }
            donateForSelfFlags.push(isDonateForSelf);
          }
        }

        // Validate and add participant details
        if (plaqueNames.length > 0 || donateForSelfFlags.some((flag) => flag)) {
          participantDetails.push({
            cart_id: cartId,
            participant_name:
              plaqueNames.length > 0 ? plaqueNames.join(", ") : "Self Donation",
            quantity: itemQuantity,
          });
        }
      });

      // Validate if any participant details exist
      if (participantDetails.length === 0) {
        alert(
          'Please fill in plaque names or check "Donate for Yourself" for each item.'
        );
        return;
      }
      console.log("array of data", participantDetails);
      // Prepare the API body
      const requestBody = {
        cart_id: participantDetails.map((detail) => detail.cart_id).join(","),
        participant_name: participantDetails
          .map((detail) => detail.participant_name)
          .join(","),
        quantity: participantDetails.map((detail) => detail.quantity).join(","),
      };
      console.log("array jo api main bhej rahe hai", requestBody);

      const response = await fetch(`${apiUrl}cart/quantity`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseData = await response.json();
      alert("Plaque names updated successfully!");
    } catch (err) {
      console.error("Error updating participant names:", err);
      alert(`Failed to update plaque names: ${err.message}`);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <div className="max-w-2xl mx-auto rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Your Donation Cart
      </h1>

      {error ? (
        <div className="text-red-600 font-medium text-center mb-4">
          Error: {error}
        </div>
      ) : loading ? (
        <p className="text-center text-gray-600">Loading...</p>
      ) : cartItems.length > 0 ? (
        <ul id="cart" className="space-y-4">
          {cartItems.map((item) => (
            <li
              className="flex flex-col gap-4 border border-gray-300 rounded-lg p-4"
              key={item.cart_id}
            >
              <div className="flex items-start gap-4">
                <img
                  src={item.program_image}
                  alt={item.program_name}
                  className="w-24 h-24 object-cover rounded-md"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{item.program_name}</h3>
                  <p className="text-gray-700">
                    Donation Amount: £{item.donation_amount * item.quantity}
                  </p>
                  <p className="text-gray-700">Quantity: {item.quantity}</p>
                  {/* <p className="text-gray-700">Country: {item.country_name}</p> */}
                </div>
              </div>

              {Array.from({ length: item.quantity }).map((_, index) => (
                <div
                  className="flex items-center mb-4"
                  key={`${item.cart_id}-${index}`}
                >
                  <div className="flex items-center w-2/5 justify-center">
                    <span className="text-sm font-medium text-gray-600">
                      Donate For Yourself
                    </span>
                    <label className="inline-flex items-center ml-2 cursor-pointer">
                      <input
                        type="checkbox"
                        data-cart-id={item.cart_id}
                        data-index={index}
                        data-cart-quantity={item.quantity}
                        className="sr-only peer plaque-input"
                      />
                      <div className="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-teal-600"></div>
                    </label>
                  </div>

                  <input
                    type="text"
                    placeholder="Plaque Name"
                    data-cart-id={item.cart_id}
                    data-index={index}
                    className="ml-4 p-2 border rounded w-3/5"
                  />

                  <button
                    onClick={decreaseQuantity}
                    className="decrease-quantity text-red-600 ml-2 w-1/5 text-center"
                    data-cart-id={item.cart_id}
                    data-cart-quantity={item.quantity}
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </li>
          ))}

          <div className="border rounded-lg border-black p-4 text-center">
            <h2>
              Total Donation Amount
              <span className="font-bold">
                {" "}
                : £
                {cartItems
                  .reduce(
                    (total, item) =>
                      total + item.donation_amount * item.quantity,
                    0
                  )
                  .toFixed(2)}{" "}
              </span>
            </h2>
          </div>
          <div className="flex justify-evenly mt-6">
            <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded">
              <a href="/donation-portal">Add Another Program</a>
            </button>
            <button
              onClick={updateParticipantNames}
              data-cart-ids={JSON.stringify(
                cartItems.map((item) => item.cart_id)
              )}
              data-cart-quantities={JSON.stringify(
                cartItems.map((item) => item.quantity)
              )}
              className="bg-teal-600 text-white px-4 py-2 rounded"
            >
              Submit Plaque Names
            </button>
          </div>
        </ul>
      ) : (
        <div>
          <p className="text-center text-gray-600">No items in your cart.</p>
          <div className="flex justify-evenly mt-6">
            <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded">
              <a href="/donation-portal">Add Programs</a>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonationCart;
