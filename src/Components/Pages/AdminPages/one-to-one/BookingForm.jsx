import React, { useState } from "react";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { Search } from "lucide-react";

const BookingForm = () => {
  const [formData, setFormData] = useState({
    student: {},
    parent: [
      { firstName: "", lastName: "", email: "", phone: "", relation: "Mother" },
    ],
    emergency: {},
    general: {},
  });

  const [sameAsAbove, setSameAsAbove] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  const handleChange = (section, field, value, index = null) => {
    setFormData((prev) => {
      if (section === "parent") {
        const updatedParents = [...prev.parent];
        updatedParents[index][field] = value;
        return { ...prev, parent: updatedParents };
      }
      return {
        ...prev,
        [section]: { ...prev[section], [field]: value },
      };
    });
  };

  const addParent = () => {
    setFormData((prev) => ({
      ...prev,
      parent: [
        ...prev.parent,
        { firstName: "", lastName: "", email: "", phone: "", relation: "Other" },
      ],
    }));
  };

  const handleSameAsAbove = () => {
    setSameAsAbove((prev) => {
      const newValue = !prev;
      if (newValue) {
        // Copy first parent's data to emergency
        setFormData((prevData) => ({
          ...prevData,
          emergency: { ...prevData.parent[0] },
        }));
      } else {
        setFormData((prevData) => ({
          ...prevData,
          emergency: {},
        }));
      }
      return newValue;
    });
  };

  const generalInputs = [
    { name: "location", placeholder: "Search", type: "text", label: "Location" },
    { name: "address", placeholder: "Search Address", type: "text", label: "Address" },
    { name: "date", placeholder: "Date", type: "date", label: "Date" },
    { name: "time", placeholder: "Time", type: "select", label: "Time", options: ["", "10:00 AM", "2:00 PM"] },
    { name: "students", placeholder: "", type: "number", label: "Students" },
    { name: "area", placeholder: "", type: "textarea", label: "Areas To Work On" },
    { name: "coach", placeholder: "Select a coach", type: "select", label: "Select a Coach", options: ["", "Coach John", "Coach Lisa"] },
    { name: "package", placeholder: "Package", type: "select", label: "Package", options: ["", "IVH4654G#22"] },
    { name: "discount", placeholder: "Apply discount", type: "select", label: "Apply Discount", options: ["Select A Discount Code", "IVH4654G#22"] },
  ];

  const studentInputs = [
    { name: "firstName", placeholder: "Enter First Name", type: "text", label: "First Name" },
    { name: "lastName", placeholder: "Enter Last Name", type: "text", label: "Last Name" },
    { name: "dob", placeholder: "Date of Birth", type: "date", label: "Date Of Birth" },
    { name: "age", placeholder: "Automatic Entry", type: "text", label: "Age" },
    { name: "gender", placeholder: "Gender", type: "select", options: ["Male", "Female"], label: "Gender" },
    { name: "medical", placeholder: "Enter Medical Information", type: "text", label: "Medical Information" },
  ];

  const parentInputs = [
    { name: "firstName", placeholder: "Enter First Name", type: "text", label: "First Name" },
    { name: "lastName", placeholder: "Enter Last Name", type: "text", label: "Last Name" },
    { name: "email", placeholder: "Enter Email", type: "email", label: "Email" },
    { name: "phone", placeholder: "Phone Number", type: "phone", label: "Phone Number" },
    { name: "relation", placeholder: "Relation", type: "select", options: ["Mother", "Father"], label: "Relation To Child" },
    { name: "referral", placeholder: "How did you hear about us?", type: "select", options: ["Friend", "Website", "Other"], label: "How Did You Hear About Us" },
  ];

  const emergencyInputs = [
    { name: "firstName", placeholder: "Enter First Name", type: "text", label: "First Name" },
    { name: "lastName", placeholder: "Enter Last Name", type: "text", label: "Last Name" },
    { name: "phone", placeholder: "Phone Number", type: "phone", label: "Phone Number" },
    { name: "relation", placeholder: "Relation", type: "select", options: ["Mother", "Father"], label: "Relation To Child" },
  ];

  const renderInputs = (inputs, section, index = null) => (
    <div className={`grid ${section === "general" ? "md:grid-cols-1" : "md:grid-cols-2"} gap-4`}>
      {inputs.map((input, idx) => (
        <div key={idx}>
          <label className="block text-[16px] font-semibold">{input.label}</label>

          {/* TEXT / EMAIL / NUMBER / TEXTAREA */}
          {["text", "email", "number", "textarea"].includes(input.type) &&
            (input.type === "textarea" ? (
              <textarea
                placeholder={input.placeholder}
                value={
                  section === "parent"
                    ? formData.parent[index]?.[input.name] || ""
                    : formData[section]?.[input.name] || ""
                }
                onChange={(e) => handleChange(section, input.name, e.target.value, index)}
                className="w-full mt-2 border border-gray-300 rounded-xl px-4 py-3 text-base"
              />
            ) : (
              <div
                className={`flex items-center border border-gray-300 rounded-xl px-4 py-3 mt-2 ${
                  input.name === "location" || input.name === "address" ? "gap-2" : ""
                }`}
              >
                {(input.name === "location" || input.name === "address") && (
                  <Search className="w-5 h-5 text-gray-500 flex-shrink-0" />
                )}
                <input
                  type={input.type}
                  placeholder={input.placeholder}
                  value={
                    section === "parent"
                      ? formData.parent[index]?.[input.name] || ""
                      : formData[section]?.[input.name] || ""
                  }
                  onChange={(e) => handleChange(section, input.name, e.target.value, index)}
                  className="w-full text-base border-none focus:outline-none bg-transparent"
                />
              </div>
            ))}

          {/* SELECT */}
          {input.type === "select" && (
            <Select
              options={input.options.map((opt) => ({ value: opt, label: opt }))}
              value={
                section === "parent"
                  ? formData.parent[index]?.[input.name]
                    ? { value: formData.parent[index][input.name], label: formData.parent[index][input.name] }
                    : null
                  : formData[section]?.[input.name]
                  ? { value: formData[section][input.name], label: formData[section][input.name] }
                  : null
              }
              onChange={(selected) =>
                handleChange(section, input.name, selected?.value || "", index)
              }
              className="mt-2"
              styles={{
                control: (base) => ({
                  ...base,
                  borderRadius: "12px",
                  padding: "5px",
                  borderColor: "#d1d5db",
                }),
              }}
            />
          )}

          {/* DATE */}
          {input.type === "date" && (
            <div className="mt-2">
              <DatePicker
                selected={
                  section === "parent"
                    ? formData.parent[index]?.[input.name]
                      ? new Date(formData.parent[index][input.name])
                      : null
                    : formData[section]?.[input.name]
                    ? new Date(formData[section][input.name])
                    : null
                }
                onChange={(date) => handleChange(section, input.name, date, index)}
                dateFormat="dd/MM/yyyy"
                placeholderText={input.placeholder}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base"
              />
            </div>
          )}

          {/* PHONE */}
          {input.type === "phone" && (
            <div className="flex items-center border border-gray-300 rounded-xl px-4 py-3 mt-2">
              <PhoneInput
                country={"gb"}
                value={
                  section === "parent"
                    ? formData.parent[index]?.dialCode || ""
                    : formData[section]?.dialCode || ""
                }
                onChange={(val, data) => {
                  handleChange(section, "dialCode", val, index);
                  handleChange(section, "country", data?.countryCode, index);
                }}
                disableDropdown={false}
                disableCountryCode={true}
                countryCodeEditable={false}
                inputStyle={{ display: "none" }}
                buttonClass="!bg-white !border-none !p-0"
              />
              <input
                type="tel"
                placeholder="Enter phone number"
                value={
                  section === "parent"
                    ? formData.parent[index]?.[input.name] || ""
                    : formData[section]?.[input.name] || ""
                }
                onChange={(e) => handleChange(section, input.name, e.target.value, index)}
                className="border-none focus:outline-none flex-1"
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex flex-col md:flex-row gap-6">
        {/* GENERAL */}
        <div className="md:w-[30%]">
          <section className="bg-white rounded-2xl p-4">
            <h3 className="text-xl font-bold text-[#282829] pb-4">General Information</h3>
            {renderInputs(generalInputs, "general")}
          </section>
        </div>

        {/* STUDENT + PARENT + EMERGENCY */}
        <div className="md:w-[70%] space-y-5">
          <section className="bg-white rounded-2xl p-4">
            <h3 className="text-xl font-bold text-[#282829] pb-4">Student Information</h3>
            {renderInputs(studentInputs, "student")}
          </section>

          <section className="bg-white rounded-2xl p-4">
            <div className="flex justify-between items-center pb-4">
              <h3 className="text-xl font-bold text-[#282829]">Parent Information</h3>
              <button
                type="button"
                onClick={addParent}
                className="bg-[#237FEA] text-sm px-4 py-2 rounded-xl text-white hover:bg-[#1e6fd2] transition"
              >
                + Add Parent
              </button>
            </div>
            {formData.parent.map((_, index) => (
              <div key={index} className="border border-gray-200 rounded-xl p-4 mb-4 ">
                <h4 className="font-semibold text-gray-700 mb-3">Parent {index + 1}</h4>
                {renderInputs(parentInputs, "parent", index)}
              </div>
            ))}
          </section>

          <section className="bg-white rounded-2xl p-4">
            <div className="pb-4">
              <h3 className="text-xl font-bold text-[#282829]">Emergency Contact Details</h3>
              <div className="flex items-center gap-2 mt-3">
                <input
                  type="checkbox"
                  checked={sameAsAbove}
                  onChange={handleSameAsAbove}
                  className="cursor-pointer w-4 h-4"
                />
                <label className="text-base font-semibold text-gray-700">
                  Fill same as above
                </label>
              </div>
            </div>
            {renderInputs(emergencyInputs, "emergency")}
          </section>
        </div>
      </div>

      <div className="flex justify-end gap-4 mt-6">
        <button className="px-8 py-2 border border-[#717073] text-[#717073] rounded-md">Cancel</button>
        <button onClick={() => setShowPayment(true)}   className="bg-[#237FEA] text-sm px-8 py-2 rounded-md text-white hover:bg-[#1e6fd2] transition">
          Make Payment
        </button>
      </div>
    </div>
  );
};

export default BookingForm;
