import React from "react";
import '../../../../index.css'
const CountrySelector = ({ countries, onChange, selectedCountry }) => (
    <div className="w-full">
      <label
        htmlFor="countries"
        className="block text-gray-700 font-bold mb-2"
      >
        Select a Country
      </label>
      <select
        id="countries"
        value={selectedCountry}
        onChange={onChange}
        className="border-gray-300 rounded py-3 px-2 border shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 w-full"
      >
        <option value="" disabled>
          {countries.length === 0 ? "Loading..." : "Select a country"}
        </option>
        {countries.map((country) => (
          <option key={country.country_id} value={country.country_id}>
            {country.country_name}
          </option>
        ))}
      </select>
    </div>
  );
  export default CountrySelector;