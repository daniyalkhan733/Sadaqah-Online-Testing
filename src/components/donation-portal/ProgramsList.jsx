import React, { useState, useEffect } from "react";
import "../../index.css";

const ProgramsList = (props) => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [cartItems, setCartItems] = useState([]);
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
  const apiUrl = import.meta.env.PUBLIC_ICHARMS_URL;
  const apiToken = import.meta.env.PUBLIC_ICHARMS_API_KEY;
  useEffect(() => {
    const newSessionId = generateSessionId();
    setSessionId(newSessionId);
    console.log("Session ID is:", newSessionId);
    const fetchPrograms = async () => {
      try {
        if (!apiUrl || !apiToken) {
          throw new Error("API URL or token is not defined");
        }

        const response = await fetch(`${apiUrl}program-list?limit=1000`, {
          headers: {
            Authorization: `Bearer ${apiToken}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        setPrograms(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPrograms();
  }, []);
  const handleAddToCart = async (event) => {
    setIsLoading(true);

    try {
      const programRate = event.currentTarget.getAttribute("data-program-rate");
      const programId = event.currentTarget.getAttribute("data-program-id");
      const programQuantity = event.currentTarget.getAttribute(
        "data-program-quantity"
      );
      const programCountry = event.currentTarget.getAttribute(
        "data-program-country"
      );

      const cartData = {
        donation_period: "one-off",
        currency: "GBP",
        currency_id: 1,
        category_id: 3,
        program_id: programId,
        country_id: programCountry,
        quantity: programQuantity,
        donation_amount: programRate,
        donation_pound_amount: programRate,
        participant_name: "",
        session_id: sessionId,
      };

      const response = await fetch(`${apiUrl}cart/create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cartData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add to cart");
      }

      const result = await response.json();
    } catch (error) {
      // console.error("Add to Cart Error:", error);
    } finally {
      setIsLoading(false);
    }
    fetchcart();
  };
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  const fetchcart = async () => {
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
      // console.log(data.cart.length);
      props.updateCartCount(data.cart.length);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div className="container mx-auto max-w-6xl px-4">
        <h1 className="text-3xl font-bold text-center mb-10 text-teal-900">
          Select Program
        </h1>
        {isLoading && (
          <div className="loading-overlay">
            <div className="spinner"></div>
          </div>
        )}
        <div className="programs-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {programs.map((program) => (
            <div
              className="program-card rounded-2xl overflow-hidden transition-transform transform hover:scale-105 cursor-pointer"
              key={program.program_id}
            >
              <div className="relative">
                <img
                  src={program.image}
                  alt={program.program_name}
                  className="w-full h-48 object-cover"
                />
                <div className="bg-teal-900 p-4">
                  <h3 className="text-white text-center font-semibold text-lg">
                    {program.program_name}
                  </h3>
                  <p className="text-white text-center text-xl font-bold mt-1">
                    £{program.program_rate}
                  </p>
                  <button
                    onClick={handleAddToCart}
                    className="donate-btn w-full bg-cream mt-2 text-teal-900 py-2 px-4 rounded-md flex items-center justify-center space-x-2 hover:bg-opacity-90 transition-colors"
                    style={{ backgroundColor: "#F5E6D3" }}
                    data-program-rate={program.program_rate}
                    data-program-id={program.program_id}
                    data-program-quantity={1}
                    data-program-country={program.country_id}
                  >
                    Add to Cart
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>

                  {/* Styles for spinner and overlay */}
                  <style>{`
                  .loading-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                  }
                  .spinner {
                    width: 40px;
                    height: 40px;
                    border: 4px solid rgba(0, 0, 0, 0.1);
                    border-top: 4px white solid;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                  }
                  @keyframes spin {
                    from {
                      transform: rotate(0deg);
                    }
                    to {
                      transform: rotate(360deg);
                    }
                  }
                `}</style>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ProgramsList;
