import React, { useEffect } from "react";
import "../../../index.css";

const GiftAid = () => {
  // Function to store the value with expiry
  const updateLocalStorageWithExpiry = (event) => {
    const checkbox = event.target;
    const value = checkbox.checked ? "Y" : "N";
    const expiry = new Date().getTime() + 24 * 60 * 60 * 1000; // Current time + 1 day in milliseconds
    const data = { value, expiry };

    localStorage.setItem("giftaidclaim", JSON.stringify(data));
  };

  // Function to retrieve the value with expiry
  const getLocalStorageWithExpiry = (key) => {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) return null;

    const item = JSON.parse(itemStr);
    const now = new Date().getTime();

    if (now > item.expiry) {
      localStorage.removeItem(key); // Remove expired item
      return null;
    }
    return item.value;
  };

  // Set initial state based on localStorage with expiry
  useEffect(() => {
    const checkbox = document.getElementById("teal-checkbox");
    const storedValue = getLocalStorageWithExpiry("giftaidclaim");
    if (storedValue === "Y") {
      checkbox.checked = true;
    } else {
      checkbox.checked = false;
    }
  }, []); // Empty dependency array to run only on component mount

  return (
    <div className="md:p-8 rounded-lg max-w-3xl text-center">
      <h1 className="text-2xl font-bold mb-4 text-[#02343F]">
        Increase The Value Of Your Donation With Gift Aid
      </h1>
      <div className="flex items-center justify-center mb-4">
        <div className="flex items-center">
          <img
            src="/gift-aid-step.png"
            alt="Donation Bag"
            className="w-full h-full mr-2"
          />
        </div>
      </div>
      <p className="text-lg font-medium mb-4">
        If you are a UK taxpayer the value of your gift can increase by <br />
        <span className="text-[#02343F] font-bold">
          25% at no extra cost to you!
        </span>
      </p>
      <div className="mb-4 bg-[#02343F] text-white max-w-xl mx-auto py-4">
        <input
          id="teal-checkbox"
          type="checkbox"
          className="w-6 h-6 accent-white align-middle"
          onChange={updateLocalStorageWithExpiry} // Corrected handler
        />
        <label
          htmlFor="teal-checkbox"
          className="ms-2 text-md font-medium text-gray-900 dark:text-gray-300"
        >
          Claim Gift Aid on my donation
        </label>
      </div>
      <p className="text-sm text-gray-600 mb-2 text-justify max-w-2xl">
        I am a UK taxpayer and I understand that if I pay less Income and/or
        Capital Gains Tax than the amount of Gift Aid claimed on all my
        donations in the relevant tax year, it is my responsibility to pay any
        difference.
      </p>
      <p className="text-sm text-gray-600">
        I understand that Gift Aid will fund administrative costs as well as our
        charitable programmes.
      </p>
    </div>
  );
};

export default GiftAid;
