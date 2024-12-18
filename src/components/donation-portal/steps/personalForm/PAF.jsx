import React, { useEffect, useState } from "react";
import "../../../../index.css";
import CountrySelector from "./CountrySelector.jsx";

const PAFModal = ({addCity, setAddCity,NewCity, setNewCity}) => {
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);
  const [postCode, setPostCode] = useState("");
  const [showPafButton, setShowPafButton] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");


  // console.log(addCity, "add city");

  const closeModal = () => setIsOpen(false);
  const rowsPerPage = 5;
  // const totalPages = Math.ceil(data.length / rowsPerPage);
  const apiUrl = import.meta.env.PUBLIC_ICHARMS_URL;
  const apiToken = import.meta.env.PUBLIC_ICHARMS_API_KEY;

  useEffect(() => {
    const fetchCountry = async () => {
      try {
        if (!apiUrl || !apiToken) {
          throw new Error("API URL or token is not defined");
        }

        const response = await fetch(`${apiUrl}country`, {
          headers: {
            Authorization: `Bearer ${apiToken}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        setCountries(data.data || []);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchCountry();
  }, []);
  const resetAddressFields = () => {
    // Reset input fields
    document.getElementById("address-1").value = "";
    document.getElementById("address-2").value = "";
    document.getElementById("postCode").value = "";

    // Reset city select
    const citySelect = document.getElementById("city");
    citySelect.selectedIndex = 0;

    // Reset state variables
    setPostCode("");
    setData([]);
    setCities([]);
  };
  const filteredData = data.filter(
    (item) =>
      item.address1 &&
      item.address1.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const fetchPafCode = async (post_code) => {
    try {
      if (!post_code || post_code.trim() === "") {
        setError("Please enter a valid post code");
        return;
      }
      const pafApi = "https://paf.tscube.co.in/paf-test.php";
      const client_ref = "DA4B9237BACCCDF19C0760CAB7AEC4A8359010B0";

      const requestOptions = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "application/json",
        },
      };

      const response = await fetch(
        `${pafApi}?client_ref=${client_ref}&post_code=${post_code}`,
        requestOptions
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      setData(data || []);
      setError(null);
      setSearchTerm("");
    } catch (err) {
      setError(err.message);
      setData([]);
    }
  };

  const fetchCity = async (countryId) => {
    try {
      setLoading(true);
      setError(null);

      // Hide PAF button if country ID is 1
      setShowPafButton(countryId == "1");

      const response = await fetch(`${apiUrl}city/${countryId}`, {
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      const cities = data.data || [];
      setCities(cities);
    } catch (err) {
      setError(err.message);
      setCities([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCountryChange = (e) => {
    const countryId = e.target.value;
    console.log("Selected Country:", e.target.value);
    setSelectedCountry(countryId);
    fetchCity(countryId);
    resetAddressFields();
    setPostCode("");
    setData([]);
  };

  const updateAddress = (item) => {
    document.getElementById("address-1").value = item.address1 || "";
    document.getElementById("address-2").value = item.address2 || "";
    document.getElementById("postCode").value = item.postcode || "";

    const citySelect = document.getElementById("city");
    const cityOption = Array.from(citySelect.options).find(
      (option) =>
        option.text.toLowerCase() === (item.post_town || "").toLowerCase()
    );

    if (cityOption) {
      citySelect.value = cityOption.value;
    } else {
      const newOption = new Option(item.post_town, item.post_town);
      citySelect.add(newOption);
      citySelect.value = item.post_town;
    }

    setIsOpen(false);
  };

  return (
    <>
      <h2 className="text-2xl font-bold mb-6 text-center text-[#02343F]">
        Enter Your Address
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <CountrySelector
          countries={countries}
          selectedCountry={selectedCountry}
          onChange={handleCountryChange}
        />

        <div className="w-full">
          <label
            htmlFor="postCode"
            className="block text-gray-700 font-bold mb-2"
          >
            Post Code/ZIP
          </label>
          <div className="flex rounded-lg shadow-sm">
            <input
              type="text"
              id="postCode"
              name="postCode"
              className="py-3 px-4 block w-full border-gray-200 shadow-sm rounded-s border text-sm"
              placeholder="Enter Post Code"
              value={postCode}
              onChange={(e) => setPostCode(e.target.value)}
              // disabled={!selectedCountry}
            />
            {showPafButton && (
              <div>
                <button
                  onClick={() => {
                    if (postCode.trim()) {
                      fetchPafCode(postCode);
                      setIsOpen(true);
                    } else {
                      alert("Please enter a valid Post Code.");
                    }
                  }}
                  type="button"
                  className="py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-e-md border border-transparent bg-[#02343F] text-white hover:bg-[#02343fa2] focus:outline-none"
                  // disabled={!selectedCountry}
                >
                  PAF
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="w-full">
          <label htmlFor="city" className="block text-gray-700 font-bold mb-2">
            City
          </label>
          {
            addCity?(
              <div className=" flex gap-3">
              <input
              type="text"
              id="firstName"
              placeholder="Add a new city"
              className="border-gray-300 rounded py-3 px-2 border shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 w-full"
              required
              onChange={(e)=>setNewCity(e.target.value)}
            />
            
              </div>
            ):( 
          <select
            id="city"
            name="city"
            onChange={(e) => {
              const countryId = e.target.value;
              if (e.target.value == "add-city") {
                setAddCity(true);
              }
              console.log("Selected Country:", e.target.value);
            }}
            className="border-gray-300 rounded py-3 px-2 border shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 w-full"
            disabled={!selectedCountry || loading}
          >
              <>
                <option value="" disabled>
                  {loading
                    ? "Loading cities..."
                    : cities.length === 0
                    ? "No cities found"
                    : "Select a city"}
                </option>
                {cities.length === 0 ? (
                  <option value="add-city">Add City</option>
                ) : null}
                {cities.map((city) => (
                  <option key={city.city_id} value={city.city_name || ""}>
                    {city.city_name || "Select City"}
                  </option>
                ))}
              </>
          </select>
            )
          }
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg md:py-8 px-2 pb-2 md:pt-0 md:w-full w-5/6 max-w-4xl text-center">
            <h2 className="text-2xl font-bold mb-4 bg-[#02343F] text-white py-4 px-4 rounded-t-md flex items-center justify-between mx-[-9px]">
              <span>New Address</span>
              <button onClick={closeModal} className="ml-auto">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-white"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </h2>

            <p className="pb-4">
              Click select button or double-click on an address to select
            </p>

            {error && (
              <p className="text-red-500 mb-4 font-bold text-xl">
                No Address Found !! Please Enter Manually
              </p>
            )}
            <div>
              <div className="flex flex-col md:flex-row justify-between items-center mb-4">
                <div className="hidden md:block mb-2 md:mb-0">
                  <span>Showing 1 to {filteredData.length} entries</span>
                  <span className="ml-2">entries</span>
                </div>
                <div className="flex items-center w-full md:w-auto">
                  <input
                    type="text"
                    id="search"
                    className="border rounded px-2 py-1 flex-grow mr-1"
                    placeholder="Search by Address 1"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <div className="border rounded-lg p-[6px]">
                    <svg
                      fill="#000000"
                      height="20px"
                      width="20px"
                      version="1.1"
                      id="Capa_1"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 488.4 488.4"
                      xmlSpace="preserve"
                    >
                      <g>
                        <g>
                          <path
                            d="M0,203.25c0,112.1,91.2,203.2,203.2,203.2c51.6,0,98.8-19.4,134.7-51.2l129.5,129.5c2.4,2.4,5.5,3.6,8.7,3.6
            s6.3-1.2,8.7-3.6c4.8-4.8,4.8-12.5,0-17.3l-129.6-129.5c31.8-35.9,51.2-83,51.2-134.7c0-112.1-91.2-203.2-203.2-203.2
            S0,91.15,0,203.25z M381.9,203.25c0,98.5-80.2,178.7-178.7,178.7s-178.7-80.2-178.7-178.7s80.2-178.7,178.7-178.7
            S381.9,104.65,381.9,203.25z"
                          />
                        </g>
                      </g>
                    </svg>
                  </div>
                </div>
              </div>

              <div className="border rounded overflow-x-auto overflow-y-auto h-64 relative">
                <table className="min-w-full table-auto mb-4">
                  <thead className="sticky top-0 bg-white z-10">
                    <tr>
                      <th className="border px-4 py-2">Sr. No</th>
                      <th className="border px-4 py-2">Address 1</th>
                      <th className="border px-4 py-2">Address 2</th>
                      <th className="border px-4 py-2">City</th>
                      <th className="border px-4 py-2">Post Code</th>
                      <th className="border px-4 py-2">Country</th>
                      <th className="border px-4 py-2">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredData.map((item, index) => (
                      <tr key={index}>
                        <td className="border px-4 py-2">
                          {(currentPage - 1) * rowsPerPage + index + 1}
                        </td>
                        <td className="border px-4 py-2">
                          {item.address1 || "N/A"}
                        </td>
                        <td className="border px-4 py-2">
                          {item.address2 || "N/A"}
                        </td>
                        <td className="border px-4 py-2">
                          {item.post_town || "N/A"}
                        </td>
                        <td className="border px-4 py-2">
                          {item.postcode || "N/A"}
                        </td>
                        <td className="border px-4 py-2">United Kingdom</td>

                        <td className="border px-4 py-2">
                          <button
                            onClick={() => updateAddress(item)}
                            className="rounded-xl p-2 bg-[#02343F] text-white"
                          >
                            SELECT
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-center items-center mt-4">
                <div className="flex items-center">
                  <span>Showing 1 to {filteredData.length} entries</span>
                </div>
              </div>
            </div>

            {/* Modal Buttons */}
            <div className="flex justify-center space-x-4 mt-4">
              <button
                onClick={() => {
                  closeModal();
                }}
                className="bg-[#02343F] text-white px-4 py-2 rounded font-bold text-xl"
              >
                Enter Address Manually
              </button>
            </div>
            <div className="flex justify-center space-x-4 mt-4">
              <button
                onClick={closeModal}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rest of the address form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="w-full">
          <label
            htmlFor="address-1"
            className="block text-gray-700 font-bold mb-2"
          >
            Address 1
          </label>
          <input
            type="text"
            id="address-1"
            name="address-1"
            placeholder="Enter your address 1"
            className="border-gray-300 rounded py-3 px-2 border shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 w-full"
            required
          />
        </div>
        <div className="w-full">
          <label
            htmlFor="address-2"
            className="block text-gray-700 font-bold mb-2"
          >
            Address 2
          </label>
          <input
            type="text"
            id="address-2"
            name="address-2"
            placeholder="Enter your address 2"
            className="border-gray-300 rounded py-3 px-2 border shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 w-full"
            required
          />
        </div>
      </div>
    </>
  );
};

export default PAFModal;
