import { useState, useEffect } from "react";
import { useVenue } from "../../../contexts/VenueContext";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";

const Create = ({ groups, termGroup, onClose }) => {


  const { formData, setFormData, createVenues, isEditVenue, updateVenues, setIsEditVenue } = useVenue();


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
  const [selectedSub, setSelectedSub] = useState(null);
  const [selectedTermIds, setSelectedTermIds] = useState([]);
  const validateForm = () => {
    if (!formData.area?.trim()) return 'Area is required';
    if (!formData.name?.trim()) return 'Name of Venue is required';
    if (!formData.address?.trim()) return 'Address is required';
    if (!formData.facility) return 'Please select Facility (Indoor/Outdoor)';
    if (formData.hasParking && !formData.parkingNote?.trim()) return 'Please add a Parking Note';
    if (formData.isCongested && !formData.howToEnterFacility?.trim()) return 'Please add a Congestion Note';
    if (selectedTermIds.length === 0) return 'Please select at least one Term Date Linkage';
    return null; // ✅ valid
  };

  const handleSubmit = () => {
    const err = validateForm();
    if (err) {
      Swal.fire({
        title: 'Validation Error',
        text: err,
        icon: 'error',
        confirmButtonText: 'OK',
      });
      return; // stop here
    }

    // Success flow
    // console.log("Venue Submitted:", formData);
    createVenues(formData);
    setFormData({
      area: "", name: "", address: "", facility: "",
      hasParking: false, isCongested: false, parkingNote: "",
      howToEnterFacility: "", termGroupId: [], paymentGroupId: ""
    });
    onClose();
  };


  const handleCancel = () => {
    setFormData({
      area: "", name: "", address: "", facility: "",
      hasParking: false, isCongested: false, parkingNote: "",
      howToEnterFacility: "", termGroupId: [], paymentGroupId: ""
    });
    onClose();

  };

  // console.log('formData', formData)
  const toggleValue = (list, setList, value) => {
    setList((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };
  const handleUpdate = (id) => {
    const err = validateForm();
    if (err) {
      Swal.fire({
        title: 'Validation Error',
        text: err,
        icon: 'error',
        confirmButtonText: 'OK',
      });
      return; // stop here, don't close
    }

    // ✅ success flow only
    console.log('formData.termGroupId', formData.termGroupId)
    let termGroupId = formData.termGroupId;
    if (typeof termGroupId === 'string') {
      try {
        termGroupId = JSON.parse(termGroupId);
      } catch (e) {
        console.error("Invalid JSON for termGroupId:", termGroupId);
        termGroupId = [];
      }
    }
    // Now it's [1, 10]
    updateVenues(id, formData);

    setFormData({
      area: "", name: "", address: "", facility: "",
      hasParking: false, isCongested: false, parkingNote: "",
      howToEnterFacility: "", termGroupId: [], paymentGroupId: ""
    });
    onClose();
    // console.log("Venue Updated:", formData);
  };





  const handleSaveTerm = () => {
    setFormData((prev) => ({
      ...prev,
      termGroupId: selectedTermIds, // now just an array
    }));
    setShowTermDropdown(false);
  };

  const handleSaveSub = () => {
    setFormData((prev) => ({
      ...prev,
      paymentGroupId: selectedSub, // now just an array
    }));
    setShowSubDropdown(false);
  };



  const termOptions = Array.isArray(termGroup)
    ? termGroup.map((group) => {
      if (!group?.id || !group?.name) return null;

      const label = `${group.name.replace(/^(Saturday|Sunday|Tuesday)\s?/i, "")}`.trim();

      return {
        id: group.id,
        label,
      };
    }).filter(Boolean)
    : [];


  const toggleTermId = (id) => {
    setSelectedTermIds((prev) => {
      const current = Array.isArray(prev) ? prev : [];
      return current.includes(id)
        ? current.filter(i => i !== id)
        : [...current, id];
    });
  };


  const dropdownVariants = {
    hidden: { opacity: 0, scale: 0.95, y: -10 },
    visible: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95, y: -10 },
  };

  const subOptions = Array.isArray(groups)
    ? groups.map(pkg => {
      if (!pkg?.id || !pkg?.name) return null;
      return { id: pkg.id, label: pkg.name };
    }).filter(Boolean)
    : [];

  // console.log(subOptions);


  useEffect(() => {
    // Handle subscription group ID
    if (formData?.paymentGroupId != null) {
      try {
        const parsed = Array.isArray(formData.paymentGroupId)
          ? formData.paymentGroupId
          : JSON.parse(formData.paymentGroupId);
        setSelectedSub(parsed);
      } catch {
        setSelectedSub(null);
      }
    }

    // Handle term group ID
    if (formData?.termGroupId != null) {
      try {
        const parsed = Array.isArray(formData.termGroupId)
          ? formData.termGroupId
          : JSON.parse(formData.termGroupId);
        setSelectedTermIds(parsed);
      } catch {
        setSelectedTermIds([]);
      }
    }
  }, [formData]);

  // ✅ First one (line ~140):
const labels = Array.isArray(termOptions) && Array.isArray(selectedTermIds)
  ? termOptions
      .filter(opt => opt && selectedTermIds.includes(opt.id))
      .map(opt => opt.label)
      .filter(Boolean)
  : [];

  return (
    <div className="max-w-md mx-auto">
      <h2 onClick={() => {
        onClose(); // ✅ call the function
        setIsEditVenue(false);
        setFormData({
          area: "",
          name: "",
          address: "",
          facility: "",
          parking: false,
          congestion: false,
          parkingNote: "",
          entryNote: "",
          termDateLinkage: "",
          subscriptionLinkage: ""
        });
      }} className="md:text-[24px] cursor-pointer hover:opacity-80 font-semibold mb-4 flex gap-2 items-center border-[#E2E1E5] border-b p-5"><img src="/demo/synco/members/Arrow - Left.png" className="w-6" alt="" />{isEditVenue ? 'Edit Venue' : 'Add New Venue'}</h2>
      <form className="space-y-2  p-5 pt-1">

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
              name="hasParking"
              checked={formData.hasParking}
              onChange={(e) => {
                const { checked } = e.target;
                setFormData((prev) => ({
                  ...prev,
                  hasParking: checked,
                  parkingNote: checked ? prev.parkingNote : '',
                }));
              }}
              className="sr-only"
            />
            <div
              className={`w-10 h-6 flex items-center rounded-full p-1 transition-all duration-300
      ${formData.hasParking ? 'bg-[#5372FF] justify-end' : 'bg-gray-300 justify-start'}`}
            >
              <div className="w-4 h-4 bg-white rounded-full shadow-md"></div>
            </div>
          </label>

          {/* Congestion Toggle */}
          <label className="flex items-center gap-2 cursor-pointer">
            <span className="block font-semibold text-[16px]">Congestion</span>
            <input
              type="checkbox"
              name="isCongested"
              checked={formData.isCongested}
              onChange={(e) => {
                const { checked } = e.target;
                setFormData((prev) => ({
                  ...prev,
                  isCongested: checked,
                  howToEnterFacility: checked ? prev.howToEnterFacility : '',
                }));
              }}
              className="sr-only"
            />
            <div
              className={`w-10 h-6 flex items-center rounded-full p-1 transition-all duration-300
      ${formData.isCongested ? 'bg-[#5372FF] justify-end' : 'bg-gray-300 justify-start'}`}
            >
              <div className="w-4 h-4 bg-white rounded-full shadow-md"></div>
            </div>
          </label>
        </div>

        {/* Conditionally Render Textareas */}
        {formData.hasParking && (
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
        )}


        <div>
          <label className="block font-semibold text-[16px] pb-2">How to enter facility</label>
          <textarea
            name="howToEnterFacility"
            value={formData.howToEnterFacility}
            onChange={handleInputChange}
            className="w-full border bg-[#FAFAFA] border-[#E2E1E5] rounded-xl p-4 text-sm"
            rows={3}
            placeholder="Add notes"
          />
        </div>



        <div className="space-y-6 max-w-md">

          {/* TERM DATE */}
          <div className="w-full max-w-xl">
            <label className="block font-semibold text-[16px] pb-2">
              Term Date Linkage
            </label>
            <div
              onClick={() => setShowTermDropdown(!showTermDropdown)}
              className="w-full border border-[#E2E1E5] rounded-xl p-4 text-sm text-[#717073] bg-white cursor-pointer"
            >
              {labels.length > 0
                ? labels.join(", ")
                : "Select Term Date Linkage"}
            </div>

            <AnimatePresence>
              {showTermDropdown && (
                <motion.div
                  className="w-full bg-white rounded-2xl shadow p-4 space-y-2 mt-2"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={dropdownVariants}
                  transition={{ duration: 0.2 }}
                >
                  <p className="font-semibold text-[17px]">Select Term Date Group</p>
                  {termOptions.map((group) => (
                    <label key={group.id} className="flex items-center gap-2 text-[15px]">
                      <input
                        type="checkbox"
                        checked={Array.isArray(selectedTermIds) && selectedTermIds.includes(group.id)}
                        onChange={() => toggleTermId(group.id)}
                        className="accent-blue-600"
                      />
                      {group.label}
                    </label>
                  ))}

                  <button
                    type="button"
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
          <div className="w-full">
            <label className="block font-semibold text-[16px] pb-2">
              Subscription Plan Linkage
            </label>
            <div
              onClick={() => setShowSubDropdown(!showSubDropdown)}
              className="w-full border border-[#E2E1E5] rounded-xl p-4 text-sm text-[#717073] bg-white cursor-pointer"
            >
              {selectedSub
                ? subOptions.find(opt => opt.id === selectedSub)?.label
                : "Select Subscription Plan"}
            </div>

            <AnimatePresence>
              {showSubDropdown && (
                <motion.div
                  className="w-full bg-white rounded-2xl shadow p-4 space-y-2 mt-2"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={dropdownVariants}
                  transition={{ duration: 0.2 }}
                >
                  <p className="font-semibold text-[17px]">Select Available Subscription Plan</p>
                  {subOptions?.map((plan) => (
                    <label key={plan.id} className="flex items-center gap-2 text-[15px] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedSub === plan.id}
                        onChange={() => setSelectedSub(plan.id)}
                        className="accent-blue-600"
                      />
                      {plan.label}
                    </label>
                  ))}

                  <button
                    type="button"
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

        {/* BUTTONS */}
        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={handleCancel}
            className="w-1/2 mr-2 py-3 font-semibold border border-[#E2E1E5] rounded-xl text-[18px] text-[#717073] hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => {
              if (isEditVenue) {
                handleUpdate(formData.id);
              } else {
                handleSubmit();
              }
            }}
            className="w-1/2 ml-2 py-3 font-semibold bg-[#237FEA] text-white rounded-xl text-[18px] hover:bg-blue-700"
          >
            {isEditVenue ? 'Update' : 'Add'}
          </button>
        </div>

      </form>
    </div>
  );
};

export default Create;
