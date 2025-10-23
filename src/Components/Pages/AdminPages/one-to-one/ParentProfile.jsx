import React, { useEffect, useState, useCallback } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import Select from "react-select";
import { useNotification } from "../contexts/NotificationContext";
import Swal from "sweetalert2";
import { useAccountsInfo } from "../contexts/AccountsInfoContext";
import { FaSave, FaEdit } from "react-icons/fa";
const ParentProfile = () => {
  const [editParent, setEditParent] = useState(false);
  const [editEmergency, setEditEmergency] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { adminInfo, setAdminInfo } = useNotification();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const { formData, setFormData, emergency, setEmergency, handleUpdate } = useAccountsInfo();

  const [commentsList, setCommentsList] = useState([]);
  const [comment, setComment] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const commentsPerPage = 5; // Number of comments per page

  // Pagination calculations
  const indexOfLastComment = currentPage * commentsPerPage;
  const indexOfFirstComment = indexOfLastComment - commentsPerPage;
  const currentComments = commentsList.slice(indexOfFirstComment, indexOfLastComment);
  const totalPages = Math.ceil(commentsList.length / commentsPerPage);

  const goToPage = (page) => {
    if (page < 1) page = 1;
    if (page > totalPages) page = totalPages;
    setCurrentPage(page);
  };

  const handleModalChange = (e) => {
    const { name, value } = e.target;
    setNewParent((prev) => ({ ...prev, [name]: value }));
  };

  const relationOptions = [
    { value: "Mother", label: "Mother" },
    { value: "Father", label: "Father" },
    { value: "Guardian", label: "Guardian" },
  ];
  const [newParent, setNewParent] = useState({
    parentFirstName: "",
    parentLastName: "",
    parentEmail: "",
    parentPhoneNumber: "",
    relationToChild: "",
    howDidYouHear: "",
  });

  const [dialCodes, setDialCodes] = useState(["+1", "+1"]);
  const [dialCodesEmergency, setDialCodesEmergency] = useState(["+1", "+1"]);
  const [countries, setCountries] = useState(["us", "us"]);
  const [countriesEmergency, setCountriesEmergency] = useState(["us", "us"]);
  const [dialCodeEmergency, setDialCodeEmergency] = useState("+1");
  const [dialCode, setDialCode] = useState("+1");
  const [country, setCountry] = useState("us");
  const [countryEmergency, setCountryEmergency] = useState("us");

  const hearOptions = [
    { value: "Social Media", label: "Social Media" },
    { value: "Friend", label: "Friend" },
    { value: "Flyer", label: "Flyer" },
  ];

  // Handle text input
  const handleChange = (index, e) => {
    const { name, value } = e.target;
    setFormData((prev) =>
      prev.map((parent, i) =>
        i === index ? { ...parent, [name]: value } : parent
      )
    );
  };

  // Handle react-select changes
  const handleSelectChange = (index, selected, { name }) => {
    setFormData((prev) =>
      prev.map((parent, i) =>
        i === index ? { ...parent, [name]: selected?.value || "" } : parent
      )
    );
  };

  // Handle phone input changes
  const handlePhoneChange = (index, e) => {
    const value = e.target.value;
    setFormData((prev) =>
      prev.map((parent, i) =>
        i === index ? { ...parent, parentPhoneNumber: value } : parent
      )
    );
  };


  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const past = new Date(timestamp);
    const diff = Math.floor((now - past) / 1000); // in seconds

    if (diff < 60) return `${diff} sec${diff !== 1 ? 's' : ''} ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)} min${Math.floor(diff / 60) !== 1 ? 's' : ''} ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hour${Math.floor(diff / 3600) !== 1 ? 's' : ''} ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} day${Math.floor(diff / 86400) !== 1 ? 's' : ''} ago`;

    // fallback: return exact date if older than 7 days
    return past.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const fetchComments = useCallback(async () => {
    const token = localStorage.getItem("adminToken");
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/book-membership/comment/list`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const resultRaw = await response.json();
      const result = resultRaw.data || [];
      setCommentsList(result);
    } catch (error) {
      console.error("Failed to fetch comments:", error);

      Swal.fire({
        title: "Error",
        text: error.message || error.error || "Failed to fetch comments. Please try again later.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  }, []);
  const handleChangeDial = (index, value, data) => {
    setDialCodes((prev) =>
      prev.map((code, i) => (i === index ? "+" + data.dialCode : code))
    );
  };
  const handleChangeEmergency = (index, value, data) => {
    setDialCodesEmergency((prev) =>
      prev.map((code, i) => (i === index ? "+" + data.dialCode : code))
    );
  };


  const handleSubmitComment = async (e) => {
    const token = localStorage.getItem("adminToken");
    e.preventDefault();

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);

    const raw = JSON.stringify({
      "comment": comment
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    try {
      Swal.fire({
        title: "Creating ....",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });


      const response = await fetch(`${API_BASE_URL}/api/admin/book-membership/comment/create`, requestOptions);

      const result = await response.json();

      if (!response.ok) {
        Swal.fire({
          icon: "error",
          title: "Failed to Add Comment",
          text: result.message || "Something went wrong.",
        });
        return;
      }


      Swal.fire({
        icon: "success",
        title: "Comment Created",
        text: result.message || " Comment has been  added successfully!",
        showConfirmButton: false,
      });


      setComment('');
      fetchComments();
    } catch (error) {
      console.error("Error creating member:", error);
      Swal.fire({
        icon: "error",
        title: "Network Error",
        text:
          error.message || "An error occurred while submitting the form.",
      });
    }
  }
  // Add parent from modal
  const handleAddParent = () => {
    setFormData((prev) => [...prev, newParent]);
    setShowModal(false);
    setNewParent({
      parentFirstName: "",
      parentLastName: "",
      parentEmail: "",
      parentPhoneNumber: "",
      relationToChild: "",
      howDidYouHear: "",
    });
    setDialCode("+1");
    setCountry("us");
  };
  const handleCountryChange = (index, countryData) => {
    setCountries((prev) =>
      prev.map((country, i) =>
        i === index ? countryData.countryCode : country
      )
    );
    setDialCodes((prev) =>
      prev.map((code, i) =>
        i === index ? "+" + countryData.dialCode : code
      )
    );
  };
  const handleCountryChangeEmergency = (index, countryData) => {
    setCountriesEmergency((prev) =>
      prev.map((country, i) =>
        i === index ? countryData.countryCode : country
      )
    );
    setDialCodesEmergency((prev) =>
      prev.map((code, i) =>
        i === index ? "+" + countryData.dialCode : code
      )
    );
  };

  useEffect(() => {
    if (emergency.sameAsAbove && formData.length > 0) {
      const firstParent = formData[0];
      setEmergency(prev => ({
        ...prev,
        emergencyFirstName: firstParent.parentFirstName || "",
        emergencyLastName: firstParent.parentLastName || "",
        emergencyPhoneNumber: firstParent.parentPhoneNumber || "",
        emergencyRelation: firstParent.relationToChild || "", // or whatever default you want
      }));
    }
  }, [emergency.sameAsAbove, formData]);

  const handleUpdateParent = () => {
    console.log('clicked')
    handleUpdate("parents", formData)
  }

  useEffect(() => {
    fetchComments();
  }, [fetchComments])

  return (
    <>
      <div className="">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">

          <button
            type="button"
            onClick={() => setShowModal(true)}

            className="bg-[#237FEA] md:absolute right-0 -top-0 text-sm px-4 py-2 rounded-xl text-white hover:bg-[#1e6fd2] transition"
          >
            Add Parent
          </button>
        </div>

        {/* Render multiple parent sections */}
        {formData.map((parent, index) => (
          <div key={index} className="bg-white p-6  rounded-2xl shadow-sm rounded-2xl mb-6">
            {/* Header with Edit Toggle */}
            <div className="flex items-center gap-2">

            <h2
              onClick={() =>
                setEditParent((prev) => ({
                  ...prev,
                  [index]: !prev[index],
                }))
              }
            className="text-xl font-bold text-[#282829] flex gap-2 items-center cursor-pointer"
            >
              {editParent?.[index] ? "Editing Parent" : `Parent Information ${index + 1}`}

              
            </h2>
            {editParent?.[index]
                ? <FaSave onClick={handleUpdateParent} />
                : <FaEdit />}
            </div>

            {/* Name Fields */}
            <div className="md:flex gap-6 mb-4 mt-3">
              <div className="md:w-1/2">
                <label className="block text-[16px] font-semibold">
                  First name
                </label>
                <input
                  name="parentFirstName"
                  className="w-full mt-2 border border-gray-300 rounded-xl px-4 py-3 text-base"
                  value={parent.parentFirstName || ""}
                  readOnly={!editParent?.[index]}
                  onChange={(e) => handleChange(index, e)}
                />
              </div>

              <div className="md:w-1/2">
                <label className="block text-[16px] font-semibold">
                  Last name
                </label>
                <input
                  name="parentLastName"
                  className="w-full mt-2 border border-gray-300 rounded-xl px-4 py-3 text-base"
                  value={parent.parentLastName || ""}
                  readOnly={!editParent?.[index]}
                  onChange={(e) => handleChange(index, e)}
                />
              </div>
            </div>

            {/* Email + Phone */}
            <div className="md:flex gap-6  mb-4">
              <div className="md:w-1/2">
                <label className="block text-[16px] font-semibold">Email</label>
                <input
                  type="email"
                  name="parentEmail"
                  className="w-full mt-2 border border-gray-300 rounded-xl px-4 py-3 text-base"
                  value={parent.parentEmail || ""}
                  readOnly={!editParent?.[index]}
                  onChange={(e) => handleChange(index, e)}
                />
              </div>

              <div className="md:w-1/2">
                <label className="block text-[16px] font-semibold">
                  Phone number
                </label>
                <div className="flex items-center border border-gray-300 rounded-xl px-4 py-3 mt-2">
                  <PhoneInput
                    country={countries[index]}
                    value={dialCodes[index]}
                    onChange={(val, data) => handleChangeDial(index, val, data)}
                    onCountryChange={(data) => handleCountryChange(index, data)}
                    disableDropdown={false}
                    disableCountryCode={true}
                    countryCodeEditable={false}
                    inputStyle={{
                      display: "none",
                    }}
                    buttonClass="!bg-white !border-none !p-0"
                  />
                  <input
                    type="tel"
                    name="parentPhoneNumber"
                    value={parent.parentPhoneNumber || ""}
                    onChange={(e) => handlePhoneChange(index, e)}
                    readOnly={!editParent?.[index]}
                    placeholder="Enter phone number"
                    className="border-none focus:outline-none flex-1"
                  />
                </div>
              </div>
            </div>

            {/* Relation + How Did You Hear */}
            <div className="md:flex gap-6 mt-2">
              <div className="md:w-1/2">
                <label className="block text-[16px] font-semibold">
                  Relation to child
                </label>
                <Select
                  options={relationOptions}
                  placeholder="Select Relation"
                  className="mt-2"
                  name="relationToChild"
                  classNamePrefix="react-select"
                  value={relationOptions.find(
                    (o) => o.value === parent.relationToChild
                  )}
                  onChange={(selected, actionMeta) =>
                    handleSelectChange(index, selected, actionMeta)
                  }
                  isDisabled={!editParent?.[index]}
                />
              </div>

              <div className="md:w-1/2">
                <label className="block text-[16px] font-semibold">
                  How did you hear about us?
                </label>
                <Select
                  options={hearOptions}
                  placeholder="Select from drop down"
                  className="mt-2"
                  name="howDidYouHear"
                  classNamePrefix="react-select"
                  value={hearOptions.find(
                    (o) => o.value === parent.howDidYouHear
                  )}
                  onChange={(selected, actionMeta) =>
                    handleSelectChange(index, selected, actionMeta)
                  }
                  isDisabled={!editParent?.[index]}
                />
              </div>
            </div>
          </div>
        ))}


        {showModal && (
          <div className="fixed inset-0 bg-[#000000b8] bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-5/12  shadow-lg relative">
              <h3 className="text-lg font-semibold mb-4 text-[#282829]">
                Add New Parent
              </h3>

              {/* Name Fields */}
              <div className="md:flex gap-6  mb-4">
                <div className="md:w-1/2">
                  <label className="block text-sm font-semibold">First name</label>
                  <input
                    name="parentFirstName"
                    className="w-full mt-1 border border-gray-300 rounded-xl px-3 py-3 text-base"
                    value={newParent.parentFirstName}
                    onChange={handleModalChange}
                  />
                </div>
                <div className="md:w-1/2">
                  <label className="block text-sm font-semibold">Last name</label>
                  <input
                    name="parentLastName"
                    className="w-full mt-1 border border-gray-300 rounded-xl px-3 py-3 text-base"
                    value={newParent.parentLastName}
                    onChange={handleModalChange}
                  />
                </div>
              </div>

              {/* Email + Phone */}
              <div className="md:flex gap-6  mb-4">
                <div className="md:w-1/2">
                  <label className="block text-sm font-semibold">Email</label>
                  <input
                    type="email"
                    name="parentEmail"
                    className="w-full mt-1 border border-gray-300 rounded-xl px-3 py-3 text-base"
                    value={newParent.parentEmail}
                    onChange={handleModalChange}
                  />
                </div>

                <div className="md:w-1/2">
                  <label className="block text-sm font-semibold">Phone</label>
                  <div className="flex items-center border border-gray-300 rounded-xl px-3 py-3 mt-1">
                    <PhoneInput
                      country={country}
                      value={dialCode}
                      onChange={handleChangeDial}
                      onCountryChange={handleCountryChange}
                      disableDropdown={false}
                      disableCountryCode={true}
                      countryCodeEditable={false}
                      inputStyle={{
                        width: "0px",
                        opacity: 0,
                        position: "absolute",
                        pointerEvents: "none",
                      }}
                      buttonClass="!bg-white !border-none !p-0"
                    />
                    <span className="text-gray-600 mr-2">{dialCode}</span>
                    <input
                      type="tel"
                      name="parentPhoneNumber"
                      value={newParent.parentPhoneNumber}
                      onChange={handlePhoneChange}
                      placeholder="Enter number"
                      className="border-none focus:outline-none flex-1"
                    />
                  </div>
                </div>
              </div>

              {/* Relation + How Did You Hear */}
              <div className="md:flex gap-6 mb-6">
                <div className="md:w-1/2">
                  <label className="block text-sm font-semibold">
                    Relation to child
                  </label>
                  <Select
                    options={relationOptions}
                    name="relationToChild"
                    className="mt-1"
                    classNamePrefix="react-select"
                    placeholder="Select"
                    value={relationOptions.find(
                      (o) => o.value === newParent.relationToChild
                    )}
                    onChange={handleSelectChange}
                  />
                </div>
                <div className="md:w-1/2">
                  <label className="block text-sm font-semibold">
                    How did you hear?
                  </label>
                  <Select
                    options={hearOptions}
                    name="howDidYouHear"
                    className="mt-1"
                    classNamePrefix="react-select"
                    placeholder="Select"
                    value={hearOptions.find(
                      (o) => o.value === newParent.howDidYouHear
                    )}
                    onChange={handleSelectChange}
                  />
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex justify-end gap-3">
                <button
                  className="px-4 py-2 bg-gray-200 rounded-xl hover:bg-gray-300 transition"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-[#237FEA] text-white rounded-xl hover:bg-[#1e6fd2] transition"
                  onClick={handleAddParent}
                >
                  Save Parent
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="bg-white p-6 rounded-3xl mt-5 shadow-sm space-y-6">
        <h2
          onClick={() => setEditEmergency((prev) => !prev)}
          className="text-xl font-bold text-[#282829] flex gap-2 items-center cursor-pointer"
        >
          {editEmergency ? "Editing Emergency Contact Details" : "Emergency Contact Details"}
          {editEmergency
            ? <FaSave />
            : <FaEdit />}
        </h2>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            disabled={!editEmergency}
            checked={emergency.sameAsAbove}
            onChange={() =>
              setEmergency(prev => ({
                ...prev,
                sameAsAbove: !prev.sameAsAbove
              }))
            }
          />
          <label className="text-base font-semibold text-gray-700">
            Fill same as above
          </label>
        </div>

        <div className="md:flex gap-6">
          <div className="md:w-1/2">
            <label className="block text-[16px] font-semibold">First name</label>
            <input
              className="w-full mt-2 border border-gray-300 rounded-xl px-4 py-3 text-base"
              placeholder="Enter first name"
              readOnly={!editEmergency}
              value={emergency.emergencyFirstName}
              onChange={e =>
                setEmergency(prev => ({
                  ...prev,
                  emergencyFirstName: e.target.value
                }))
              }
            />
          </div>
          <div className="md:w-1/2">
            <label className="block text-[16px] font-semibold">Last name</label>
            <input
              className="w-full mt-2 border border-gray-300 rounded-xl px-4 py-3 text-base"
              placeholder="Enter last name"
              value={emergency.emergencyLastName}
              readOnly={!editEmergency}
              onChange={e =>
                setEmergency(prev => ({
                  ...prev,
                  emergencyLastName: e.target.value
                }))
              }
            />
          </div>
        </div>

        <div className="md:flex gap-6">
          <div className="md:w-1/2">
            <label className="block text-[16px] font-semibold">Phone number</label>
            <div className="flex items-center border border-gray-300 rounded-xl px-4 py-3 mt-2">
              {/* Flag Dropdown */}
              <PhoneInput
                country={countryEmergency}
                value={dialCodeEmergency}

                onChange={handleChangeEmergency}
                onCountryChange={handleCountryChangeEmergency}
                disableDropdown={false}
                disableCountryCode={true}
                countryCodeEditable={false}
                inputStyle={{
                  width: "0px",
                  maxWidth: '20px',
                  height: "0px",
                  opacity: 0,
                  pointerEvents: "none", // ✅ prevents blocking typing
                  position: "absolute",
                }}
                buttonClass="!bg-white !border-none !p-0"
              />
              <input
                type="tel"
                readOnly={!editEmergency}
                value={emergency.emergencyPhoneNumber}
                onChange={(e) =>
                  setEmergency((prev) => ({
                    ...prev,
                    emergencyPhoneNumber: e.target.value,
                  }))
                }
                className='border-none focus:outline-none' placeholder="Enter phone number"
              />

            </div>
          </div>
          <div className="md:w-1/2">
            <label className="block text-[16px] font-semibold">Relation to child</label>
            <Select
              options={relationOptions}
              isDisabled={!editEmergency}
              value={relationOptions.find(option => option.value === emergency.emergencyRelation)}
              onChange={selectedOption =>
                setEmergency(prev => ({
                  ...prev,
                  emergencyRelation: selectedOption?.value || ""
                }))
              }
              placeholder="Select Relation"
              className="mt-2"
              classNamePrefix="react-select"
            />
          </div>
        </div>
      </div>

      <div className="bg-white my-10 rounded-3xl p-6 space-y-4">
        <h2 className="text-[24px] font-semibold">Comment</h2>

        {/* Input section */}
        <div className="flex items-center gap-2">
          <img
            src={adminInfo?.profile ? `${adminInfo.profile}` : '/demo/synco/members/dummyuser.png'}
            alt="User"
            className="w-14 h-14 rounded-full object-cover"
          />
          <input
            type="text"
            name='comment'
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment"
            className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-[16px] font-semibold outline-none md:w-full w-5/12"
          />
          <button
            className="bg-[#237FEA] p-3 rounded-xl text-white hover:bg-blue-600"
            onClick={handleSubmitComment}
          >
            <img src="/demo/synco/icons/sent.png" alt="" />
          </button>
        </div>

        {/* Comment list */}
        {commentsList && commentsList.length > 0 ? (
          <div className="space-y-4">
            {currentComments.map((c, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-4 text-sm">
                <p className="text-gray-700 text-[16px] font-semibold mb-1">{c.comment}</p>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        c?.bookedByAdmin?.profile
                          ? `${c?.bookedByAdmin?.profile}`
                          : '/demo/synco/members/dummyuser.png'
                      }
                      onError={(e) => {
                        e.currentTarget.onerror = null; // prevent infinite loop
                        e.currentTarget.src = '/demo/synco/members/dummyuser.png';
                      }}
                      alt={c?.bookedByAdmin?.firstName}
                      className="w-10 h-10 rounded-full object-cover mt-1"
                    />
                    <div>
                      <p className="font-semibold text-[#237FEA] text-[16px]">{c?.bookedByAdmin?.firstName}</p>
                    </div>
                  </div>
                  <span className="text-gray-400 text-[16px] whitespace-nowrap mt-1">
                    {formatTimeAgo(c.createdAt)}
                  </span>
                </div>
              </div>
            ))}

            {/* Pagination controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-4">
                <button
                  className="px-3 py-1 rounded-lg border border-gray-300 hover:bg-gray-100"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    className={`px-3 py-1 rounded-lg border ${currentPage === i + 1 ? 'bg-blue-500 text-white border-blue-500' : 'border-gray-300 hover:bg-gray-100'}`}
                    onClick={() => goToPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  className="px-3 py-1 rounded-lg border border-gray-300 hover:bg-gray-100"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        ) : (
          <p className="text-center">No Comments yet.</p>
        )}
      </div>

    </>
  );
};

export default ParentProfile;
