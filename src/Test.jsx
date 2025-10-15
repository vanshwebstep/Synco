import React, { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const Test = () => {
  const [country, setCountry] = useState("us"); // default country
  const [dialCode, setDialCode] = useState("+1"); // store selected code silently
  const [number, setNumber] = useState("");

  const handleChange = (value, data) => {
    // When library fires onChange, just update the dial code
    setDialCode("+" + data.dialCode);
  };

  const handleCountryChange = (countryData) => {
    setCountry(countryData.countryCode);
    setDialCode("+" + countryData.dialCode);
  };

  const handleNumberChange = (e) => {
    const numericValue = e.target.value.replace(/\D/g, "");
    setNumber(numericValue);
  };

  return (
    <div className="max-w-sm mx-auto mt-8">
      <label className="block mb-2 text-gray-700 font-semibold">
        Phone Number
      </label>

      <div className="flex items-center border border-gray-300 rounded-xl px-2 py-1">
        {/* Flag Dropdown */}
        <PhoneInput
          country={country}
          value={dialCode}
          onChange={handleChange}
          onCountryChange={handleCountryChange}
          disableDropdown={false}
          disableCountryCode={true}
          countryCodeEditable={false}
          inputStyle={{
            width: "0px",
            height: "0px",
            opacity: 0,
            pointerEvents: "none", // ✅ prevents blocking typing
            position: "absolute",
          }}
          buttonClass="!bg-white !border-none !p-0"
        />

        {/* Custom input for number */}
        <input
          type="tel"
          value={number}
          onChange={handleNumberChange}
          placeholder="Enter phone number"
          className="flex-1 h-10 text-base border-none focus:outline-none pl-2"
        />
      </div>

      {/* Example: Send both values to API */}
      <p className="text-sm text-gray-600 mt-2">
        <strong>Full number for API:</strong> {dialCode}
        {number ? " " + number : ""}
      </p>
    </div>
  );
};

export default Test;
