import React, { useState } from "react";
import "../../../index.css";
import PAFModal from "../steps/personalForm/PAF.jsx";

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
  const [addCity, setAddCity] = useState(false);
  const [NewCity, setNewCity] = useState("");
  const [refData, setRefData] = useState("");

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };
  const handlePaymentSelection = (event) => {
    const paymentMethod = event.target.id;
    console.log("Payment method selected:", paymentMethod);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedFormData = {
      ...formData,
      address1: document.getElementById("address-1").value,
      address2: document.getElementById("address-2").value,
      postcode: document.getElementById("postCode").value,
      city: document.getElementById("city")?.value || NewCity,
      city_id: "22",
      country: String(document.getElementById("countries").value),
    };

    // Update state with complete form data
    setFormData(updatedFormData);
    console.log("Form data submitted:", updatedFormData);
  };

  const apiUrl = import.meta.env.PUBLIC_ICHARMS_URL;
  const apiToken = import.meta.env.PUBLIC_ICHARMS_API_KEY;
  const updateReferenceId = async () => {
    function randomStr(len, arr) {
      let ans = "";
      for (let i = len; i > 0; i--) {
        ans += arr[Math.floor(Math.random() * arr.length)];
      }
      return ans;
    }
    const referenceId = randomStr(32, "12345abcde");
    if (!apiToken || !apiUrl) {
      console.error("API Token or URL is not defined");
      return;
    }
    try {
      const response = await fetch(
        `${apiUrl}payment/reference/${referenceId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${apiToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Response status:", response);

      if (!response.ok) {
        throw new Error(`Unexpected response: ${response.status}`);
      }
      const refData = await response.json();
      const refId = refData.reference_id;
      setRefData(refId);
      console.log("Reference ID updated successfully:", refId);
      updateTransaction(refId);
    } catch (err) {
      console.error("Error in updating reference ID:", err.message);
    }
  };
  const updateTransaction = async (refId) => {
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
    const sessionId = generateSessionId();
    const apiToken = import.meta.env.PUBLIC_ICHARMS_API_KEY;
    if (!apiToken || !apiUrl) {
      console.error("API Token or URL is not defined");
      return;
    }
    try {
      const response = await fetch(`${apiUrl}payment/transaction`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          auth: 0,
          session_id: sessionId,
          reference_no: refId,
          guest_details: formData,
        }),
      });
      console.log(
        `data after what we send  session_id= ${sessionId} , reference_no= ${refId} , guest_details `,
        formData
      );

      if (!response.ok) {
        throw new Error(
          `Unexpected response: ${response.status} - ${response.statusText}`
        );
      }
      console.log("Response status:", response);
      const data = await response.json();
      console.log("Transaction created:", data);
    } catch (err) {
      console.error("Error in updating transaction ID:", err.message);
    }
  };

  return (
    <>
      <button onClick={updateReferenceId}>click me </button>
      <form
        onSubmit={handleSubmit}
        className="flex justify-center items-center"
      >
        <div className="rounded-lg md:p-8 px-2 w-full max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center text-[#02343F]">
            Enter Your Personal Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="w-full">
              <label
                htmlFor="title"
                className="block text-gray-700 font-bold mb-2"
              >
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
              <label
                htmlFor="first_name"
                className="block text-gray-700 font-bold mb-2"
              >
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
              <label
                htmlFor="last_name"
                className="block text-gray-700 font-bold mb-2"
              >
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
              <label
                htmlFor="phone"
                className="block text-gray-700 font-bold mb-2"
              >
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
              <label
                htmlFor="email"
                className="block text-gray-700 font-bold mb-2"
              >
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
            NewCity={NewCity}
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
                  className={`flex items-center flex-col bg-gray-50 border `}
                >
                  <input
                    type="radio"
                    id={paymentMethod}
                    name="paymentMethod"
                    className="relative md:right-[-80px] top-2"
                    // checked={formData.paymentMethod === paymentMethod}
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
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              Submit
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default PersonalDetailsForm;
