import { useState } from "react";
import { useVenue } from "../contexts/VenueContext";
import { motion, AnimatePresence } from "framer-motion";
const Create = () => {
  const { formData, setFormData } = useVenue();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  const [showTermDropdown, setShowTermDropdown] = useState(false);
  const [showSubDropdown, setShowSubDropdown] = useState(false);
  const [selectedTerms, setSelectedTerms] = useState([]);
  const [selectedSubs, setSelectedSubs] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Venue Submitted:", formData);

  };
  const toggleValue = (list, setList, value) => {
    setList((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const handleSaveTerm = () => {
    setFormData((prev) => ({
      ...prev,
      termDateLinkage: selectedTerms.join(", "),
    }));
    setShowTermDropdown(false);
  };

  const handleSaveSub = () => {
    setFormData((prev) => ({
      ...prev,
      subscriptionLinkage: selectedSubs.join(", "),
    }));
    setShowSubDropdown(false);
  };

  const termOptions = [
    "Saturdays 2025/2026",
    "Sundays 2025/2026",
    "Sundays 2025/2026 KX",
    "Tuesday 2025/2026 Chelsea",
  ];

  const subOptions = [
    "12 Month (1 Student) £47.99",
    "12 Month (2 Student) £47.99",
    "12 Month (3 Student) £47.99",
    "6 Month (1 Student) £47.99",
    "6 Month (2 Student) £47.99",
    "6Month (3 Student) £47.99",
  ];

  const dropdownVariants = {
    hidden: { opacity: 0, scale: 0.95, y: -10 },
    visible: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95, y: -10 },
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="md:text-[24px] font-semibold mb-4 flex gap-2 items-center border-[#E2E1E5] border-b p-5"><img src="/members/Arrow - Left.png" className="w-6" alt="" />Add New Venue</h2>
      <form onSubmit={handleSubmit} className="space-y-2  p-5 pt-1">

        <div>
          <label className="block font-semibold text-[16px] pb-2">Area</label>
          <input
            type="text"
            name="area"
            value={formData.area}
            onChange={handleInputChange}
            className="w-full border border-[#E2E1E5] rounded-xl p-4 text-sm"
          />
        </div>

        <div>
          <label className="block font-semibold text-[16px] pb-2">Name of Venue</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full border border-[#E2E1E5] rounded-xl p-4 text-sm"
          />
        </div>

        <div>
          <label className="block font-semibold text-[16px] pb-2">Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            className="w-full border border-[#E2E1E5] rounded-xl p-4 text-sm"
          />
        </div>

        <div>
          <label className="block font-semibold text-[16px] pb-2">Facility</label>
          <select
            name="facility"
            value={formData.facility}
            onChange={handleInputChange}
            className="w-full border border-[#E2E1E5] rounded-xl p-4 text-sm text-[#717073]"
          >
            <option value="">Facility</option>
            <option value="Indoor">Indoor</option>
            <option value="Outdoor">Outdoor</option>
          </select>
        </div>

        <div className="flex py-2 items-center justify-between gap-6">
          {/* Parking Toggle */}
          <label className="flex items-center gap-2 cursor-pointer">
            <span className="block font-semibold text-[16px]">Parking</span>
            <input
              type="checkbox"
              name="parking"
              checked={formData.parking}
              onChange={handleInputChange}
              className="sr-only"
            />
            <div
              className={`w-10 h-6 flex items-center rounded-full p-1 transition-all duration-300
        ${formData.parking ? 'bg-[#5372FF] justify-end' : 'bg-gray-300 justify-start'}`}
            >
              <div className="w-4 h-4 bg-white rounded-full shadow-md"></div>
            </div>
          </label>

          {/* Congestion Toggle */}
          <label className="flex items-center gap-2 cursor-pointer">
            <span className="block font-semibold text-[16px]">Congestion</span>
            <input
              type="checkbox"
              name="congestion"
              checked={formData.congestion}
              onChange={handleInputChange}
              className="sr-only"
            />
            <div
              className={`w-10 h-6 flex items-center rounded-full p-1 transition-all duration-300
        ${formData.congestion ? 'bg-[#5372FF] justify-end' : 'bg-gray-300 justify-start'}`}
            >
              <div className="w-4 h-4 bg-white rounded-full shadow-md"></div>
            </div>
          </label>
        </div>



        <div>
          <textarea
            rows={3}
            name="parkingNote"
            value={formData.parkingNote}
            onChange={handleInputChange}
            placeholder="Add a parking note"
            className="w-full border bg-[#FAFAFA] border-[#E2E1E5] rounded-xl p-4 text-sm"
          />
        </div>

        <div>
          <label className="block font-semibold text-[16px] pb-2">How to enter facility</label>
          <textarea
            name="entryNote"
            value={formData.entryNote}
            onChange={handleInputChange}
            className="w-full border bg-[#FAFAFA] border-[#E2E1E5] rounded-xl p-4 text-sm"
            rows={3}
            placeholder="Add notes"
          />
        </div>

        <div className="space-y-6 max-w-md">

          {/* TERM DATE */}
          <div className="relative">
            <label className="block font-semibold text-[16px] pb-2">
              Term Date Linkage
            </label>
            <div
              onClick={() => setShowTermDropdown(!showTermDropdown)}
              className="w-full border border-[#E2E1E5] rounded-xl p-4 text-sm text-[#717073] bg-white cursor-pointer"
            >
              {selectedTerms.length > 0
                ? selectedTerms.join(", ")
                : "Select Term Date Group"}
            </div>

            <AnimatePresence>
              {showTermDropdown && (
                <motion.div
                  className="absolute z-10 mt-2 w-full bg-white rounded-2xl shadow p-4 space-y-2"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={dropdownVariants}
                  transition={{ duration: 0.2 }}
                >
                  <p className="font-semibold text-[17px]">Select Term Date Group</p>
                  {termOptions.map((group) => (
                    <label key={group} className="flex items-center gap-2 text-[15px]">
                      <input
                        type="checkbox"
                        checked={selectedTerms.includes(group)}
                        onChange={() =>
                          toggleValue(selectedTerms, setSelectedTerms, group)
                        }
                        className="accent-blue-600"
                      />
                      {group}
                    </label>
                  ))}
                  <button
                    onClick={handleSaveTerm}
                    className="w-full bg-[#237FEA] hover:bg-blue-700 text-white font-semibold py-2 rounded-lg mt-2"
                  >
                    Save
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* SUBSCRIPTION PLAN */}
          <div className="relative">
            <label className="block font-semibold text-[16px] pb-2">
              Subscription Plan Linkage
            </label>
            <div
              onClick={() => setShowSubDropdown(!showSubDropdown)}
              className="w-full border border-[#E2E1E5] rounded-xl p-4 text-sm text-[#717073] bg-white cursor-pointer"
            >
              {selectedSubs.length > 0
                ? selectedSubs.join(", ")
                : "Select Subscription Plan"}
            </div>

            <AnimatePresence>
              {showSubDropdown && (
                <motion.div
                  className="absolute z-10 mt-2 w-full bg-white rounded-2xl shadow p-4 space-y-2"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={dropdownVariants}
                  transition={{ duration: 0.2 }}
                >
                  <p className="font-semibold text-[17px]">
                    Select Available Subscription Plans
                  </p>
                  {subOptions.map((plan) => (
                    <label key={plan} className="flex items-center gap-2 text-[15px]">
                      <input
                        type="checkbox"
                        checked={selectedSubs.includes(plan)}
                        onChange={() =>
                          toggleValue(selectedSubs, setSelectedSubs, plan)
                        }
                        className="accent-blue-600"
                      />
                      {plan}
                    </label>
                  ))}
                  <button
                    onClick={handleSaveSub}
                    className="w-full bg-[#237FEA] hover:bg-blue-700 text-white font-semibold py-2 rounded-lg mt-2"
                  >
                    Save
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        <div className="flex justify-between mt-6">
          <button
            onClick={() =>
              setFormData({
                area: "", name: "", address: "", facility: "",
                parking: false, congestion: false, parkingNote: "",
                entryNote: "", termDateLinkage: "", subscriptionLinkage: ""
              })
            }
            className="w-1/2 mr-2 py-3 font-semibold border border-[#E2E1E5] rounded-xl text-[18px] text-[#717073] hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="w-1/2 ml-2 py-3 font-semibold bg-[#237FEA] text-white rounded-xl text-[18px] hover:bg-blue-700"
          >
            Add
          </button>
        </div>
      </form>
    </div>
  );
};

export default Create;
