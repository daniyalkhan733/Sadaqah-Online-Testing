import React, { useState } from "react";
import "../../../index.css";
import PAFModal from "../steps/personalForm/PAF.jsx";

const API_CONFIG = {
  baseUrl: import.meta.env.PUBLIC_ICHARMS_URL,
  token: import.meta.env.PUBLIC_ICHARMS_API_KEY,
  timeout: 10000,
};
  
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

const generateReferenceId = () => {
  const chars = "12345abcde";
  let referenceId = "";
  for (let i = 0; i < 32; i++) {
    referenceId += chars[Math.floor(Math.random() * chars.length)];
  }
  return referenceId;
};

const PersonalDetailsForm = () => {
  const [formData, setFormData] = useState({
    title: "Mr",
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    address1: "",
    address2: "",
    postcode: "",
    city: "",
    city_id: "",
    country: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [addCity, setAddCity] = useState(false);
  const [newCity, setNewCity] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handlePaymentSelection = (event) => {
    setSelectedPaymentMethod(event.target.id);
  };

  const makeApiRequest = async (url, options) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          Authorization: `Bearer ${API_CONFIG.token}`,
          "Content-Type": "application/json",
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status} - ${response.statusText}`);
      }

      return await response.json();
    } finally {
      clearTimeout(timeoutId);
    }
  };

  const processPayment = async (completeFormData) => {
    if (!API_CONFIG.token || !API_CONFIG.baseUrl) {
      throw new Error("API configuration is missing");
    }

    const referenceId = generateReferenceId();
    const sessionId = generateSessionId();

    try {
      // Make both API calls in parallel
      const [referenceResponse, transactionResponse] = await Promise.all([
        makeApiRequest(
          `${API_CONFIG.baseUrl}payment/reference/${referenceId}`,
          { method: "GET" }
        ),
        makeApiRequest(
          `${API_CONFIG.baseUrl}payment/transaction`,
          {
            method: "POST",
            body: JSON.stringify({
              auth: 0,
              session_id: sessionId,
              reference_no: referenceId,
              guest_details: completeFormData,
            }),
          }
        ),
      ]);

      return { referenceResponse, transactionResponse };
    } catch (err) {
      console.error("Payment processing error:", err);
      throw new Error("Failed to process payment. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!selectedPaymentMethod) {
        throw new Error("Please select a payment method");
      }

      const completeFormData = {
        ...formData,
        address1: document.getElementById("address-1").value,
        address2: document.getElementById("address-2").value,
        postcode: document.getElementById("postCode").value,
        city: document.getElementById("city")?.value || newCity,
        city_id: "22",
        country: String(document.getElementById("countries").value),
        paymentMethod: selectedPaymentMethod,
      };

      await processPayment(completeFormData);
      // Handle successful submission here (e.g., redirect or show success message)
      console.log("Payment processed successfully");

    } catch (err) {
      setError(err.message);
      console.error("Form submission error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex justify-center items-center">
      <div className="rounded-lg md:p-8 px-2 w-full max-w-3xl mx-auto">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <h2 className="text-2xl font-bold mb-6 text-center text-[#02343F]">
          Enter Your Personal Details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="w-full">
            <label htmlFor="title" className="block text-gray-700 font-bold mb-2">
              Title
            </label>
            <select
              id="title"
              value={formData.title}
              onChange={handleChange}
              className="border-gray-300 rounded py-3 px-2 border shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 w-full"
            >
              <option value="Mr">Mr</option>
              <option value="Mrs">Mrs</option>
              <option value="Ms">Ms</option>
            </select>
          </div>

          <div className="w-full">
            <label htmlFor="first_name" className="block text-gray-700 font-bold mb-2">
              <span className="text-red-600">*</span> First Name
            </label>
            <input
              type="text"
              id="first_name"
              value={formData.first_name}
              onChange={handleChange}
              placeholder="Enter your first name"
              className="border-gray-300 rounded py-3 px-2 border shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 w-full"
              required
            />
          </div>

          <div className="w-full">
            <label htmlFor="last_name" className="block text-gray-700 font-bold mb-2">
              <span className="text-red-600">*</span> Last Name
            </label>
            <input
              type="text"
              id="last_name"
              value={formData.last_name}
              onChange={handleChange}
              placeholder="Enter your last name"
              className="border-gray-300 rounded py-3 px-2 border shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 w-full"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="w-full">
            <label htmlFor="phone" className="block text-gray-700 font-bold mb-2">
              <span className="text-red-600">*</span> Phone
            </label>
            <input
              type="number"
              id="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone no"
              className="border-gray-300 rounded py-3 px-2 border shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 w-full"
              required
            />
          </div>

          <div className="w-full">
            <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
              <span className="text-red-600">*</span> Email
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="border-gray-300 rounded py-3 px-2 border shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 w-full"
              required
            />
          </div>
        </div>

        <hr className="border-t border-black md:mx-[-40px] my-4" />

        <PAFModal
          NewCity={newCity}
          setNewCity={setNewCity}
          addCity={addCity}
          setAddCity={setAddCity}
          client:load
        />

        <hr className="border-t border-black md:mx-[-40px] my-4" />

        <h2 className="text-2xl font-bold mb-6 text-center text-[#02343F]">
          Select Payment Method
        </h2>

        <div className="container mx-auto md:p-6">
          <div className="grid grid-cols-3 gap-6">
            {["stripe", "worldpay", "paypal"].map((paymentMethod) => (
              <div
                key={paymentMethod}
                className={`flex items-center flex-col bg-gray-50 border ${
                  selectedPaymentMethod === paymentMethod ? "border-blue-500" : "border-gray-200"
                }`}
              >
                <input
                  type="radio"
                  id={paymentMethod}
                  name="paymentMethod"
                  className="relative md:right-[-80px] top-2"
                  checked={selectedPaymentMethod === paymentMethod}
                  onChange={handlePaymentSelection}
                  required
                />
                <label
                  htmlFor={paymentMethod}
                  className="flex flex-col items-center space-y-2 cursor-pointer"
                >
                  <img
                    src={`/${paymentMethod}.svg`}
                    alt={`${paymentMethod} logo`}
                    className="w-[100px] h-[100px]"
                  />
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-6">
          <button
            type="submit"
            disabled={loading}
            className={`bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Processing..." : "Submit"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default PersonalDetailsForm;