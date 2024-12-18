import React, { useEffect, useState } from "react";
import "../../../index.css";

const ContactForm = () => {
  const [preferences, setPreferences] = useState({
    email: "N",
    phone: "N",
    post: "N",
    sms: "N",
  });

  // Load preferences from local storage on component mount
  useEffect(() => {
    const storedPreferences = JSON.parse(localStorage.getItem("contactPreferences"));
    if (storedPreferences) {
      setPreferences(storedPreferences);
    }
  }, []);

  // Save preferences to local storage with expiration
  const savePreferencesToLocalStorage = (updatedPreferences) => {
    const now = new Date();
    const expiry = now.getTime() + 24 * 60 * 60 * 1000; // 1 day from now
    localStorage.setItem(
      "contactPreferences",
      JSON.stringify({
        ...updatedPreferences,
        expiry,
      })
    );
  };

  // Handle checkbox change
  const handleCheckboxChange = (event) => {
    const { id, checked } = event.target;
    const updatedPreferences = {
      ...preferences,
      [id]: checked ? "Y" : "N",
    };
    setPreferences(updatedPreferences);
    savePreferencesToLocalStorage(updatedPreferences);
  };

  return (
    <div className="flex justify-center items-center">
      <div className="bg-white rounded-lg md:p-8 px-2 w-full">
        <h1 className="text-2xl font-bold mb-4 text-center text-[#02343F]">
          Almost there!
        </h1>

        <div className="text-center mb-4">
          <p className="text-gray-700">
            Your support is making a life-saving impact. Stay connected and
            informed with our latest updates.
          </p>
        </div>

        <div className="container mx-auto md:p-6">
          <div className="grid grid-cols-2 gap-6">
            {/* Email Checkbox */}
            <div className="flex items-center flex-col bg-gray-50 border pt-4">
              <input
                type="checkbox"
                id="email"
                className="relative md:right-[-120px]"
                checked={preferences.email === "Y"}
                onChange={handleCheckboxChange}
              />
              <label
                htmlFor="email"
                className="flex flex-col items-center space-y-2 cursor-pointer"
              >
                <img src="/mail.svg" alt="" className="w-[75px] h-[75px]" />
                <span className="text-sm font-medium">Send me updates by email</span>
              </label>
            </div>

            {/* Phone Checkbox */}
            <div className="flex items-center flex-col bg-gray-50 border pt-4">
              <input
                type="checkbox"
                id="phone"
                className="relative md:right-[-120px]"
                checked={preferences.phone === "Y"}
                onChange={handleCheckboxChange}
              />
              <label
                htmlFor="phone"
                className="flex flex-col items-center space-y-2 cursor-pointer"
              >
                <img src="/phone.svg" alt="" className="w-[75px] h-[75px]" />
                <span className="text-sm font-medium">Contact me by Phone</span>
              </label>
            </div>

            {/* Post Checkbox */}
            <div className="flex items-center flex-col bg-gray-50 border pt-4">
              <input
                type="checkbox"
                id="post"
                className="relative md:right-[-120px]"
                checked={preferences.post === "Y"}
                onChange={handleCheckboxChange}
              />
              <label
                htmlFor="post"
                className="flex flex-col items-center space-y-2 cursor-pointer"
              >
                <img src="/post.svg" alt="" className="w-[75px] h-[75px]" />
                <span className="text-sm font-medium">Contact me by Post</span>
              </label>
            </div>

            {/* SMS Checkbox */}
            <div className="flex items-center flex-col bg-gray-50 border pt-4">
              <input
                type="checkbox"
                id="sms"
                className="relative md:right-[-120px]"
                checked={preferences.sms === "Y"}
                onChange={handleCheckboxChange}
              />
              <label
                htmlFor="sms"
                className="flex flex-col items-center space-y-2 cursor-pointer"
              >
                <img src="/sms.svg" alt="" className="w-[75px] h-[75px]" />
                <span className="text-sm font-medium">Send me updates by SMS</span>
              </label>
            </div>
          </div>
        </div>

        <div className="text-center mt-4">
          <p className="text-gray-700 text-md text-justify">
            We take your privacy very seriously and are committed to protecting
            your personal information. To make sure we give you outstanding
            supporter experience we'll sometimes use the information you give
            us to ensure our communications meet your expectations. For more
            information about how we use and protect your data please read our
            Privacy Policy.
          </p>
          <br />
          <p className="text-gray-700 text-md text-justify">
            You can also change how we hear from us at any time by contacting
            our Support Care team,
          </p>
          <div className="flex text-center justify-center">
            <a
              href="mailto:info@technoservesolutions.com"
              className="font-bold justify-center hover:text-[#848378]"
            >
              info@technoservesolutions.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
