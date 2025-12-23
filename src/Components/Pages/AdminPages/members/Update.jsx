import CreatableSelect from "react-select/creatable";
import Select from 'react-select';

import React, { useEffect, useState, useCallback } from "react";
import Swal from "sweetalert2";
import { useMembers } from "../contexts/MemberContext";
import RoleModal from "./RoleModal";
import { useLocation, useNavigate } from "react-router-dom";
import Loader from '../contexts/Loader'
import { verifyToken } from '../../../verifyToken';
import { usePermission } from "../Common/permission";
import { useNotification } from "../contexts/NotificationContext";

const Update = () => {
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const useQuery = () => new URLSearchParams(useLocation().search);
  const query = useQuery();
  const id = query.get("id");
  const [error, setError] = useState("");
  const MyRole = localStorage.getItem("role");
  const { checkPermission } = usePermission();
  const { setAdminInfo } = useNotification();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    bio: "",
    position: "",
    passwordHint: "",
    country: "",
    city: "",
    postalCode: "",
    role: null,
    profile: null,
    countryId: "",
  });

  const [admins,setAdmins] = useState([]);
  const [editAddress, setEditAddress] = useState(false);
  const [fileuploaded, setFileuploaded] = useState(false);

  const [loading, setLoading] = useState(false);
  const [country, setCountry] = useState([]);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isImageremove, setIsImageremove] = useState(false);


  const [originalData, setOriginalData] = useState(formData);
  const [editPersonal, setEditPersonal] = useState(false);
  // console.log('formData', formData)
  const [isImageValid, setIsImageValid] = useState(false);
  const FALLBACK = "/members/dummyuser.png";
  const {
    roleOptions,
    fetchRoles,
    showRoleModal,
    setShowRoleModal,
    setRoleName,
    setPermissions,
  } = useMembers();

  const fetchMembersById = useCallback(async () => {
    const token = localStorage.getItem("adminToken");
    if (!token) return false;

    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/admin/${id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const resultRaw = await response.json();
      // console.log('resultRaw', resultRaw)

      if (!resultRaw.status) {
        setError(resultRaw.message || "Invalid ID");
        return false;
      }

      const result = resultRaw.data || {};
      setFormData(result);

      if (result?.profileImageUrl) {
        setPhotoPreview(result.profileImageUrl);
      }

      setError("");
      return true;
    } catch (error) {
      console.error("Failed to fetch members:", error);
      setError("Something went wrong. Please try again.");
      return false;
    } finally {
      setLoading(false);
    }
  }, [id]);
  const fetchCountry = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/location/country`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await response.json();

      const formatted = result.data;
      setCountry(formatted);
    } catch (error) {
      console.error("Failed to fetch roles:", error);
    }
  }
    const fetchMembers = useCallback(async () => {
          const token = localStorage.getItem("adminToken");
          if (!token) return;
  
          setLoading(true);
          try {
              const response = await fetch(`${API_BASE_URL}/api/admin/reassign/data`, {
                  method: "GET",
                  headers: {
                      Authorization: `Bearer ${token}`,
                  },
              });
  
              const resultRaw = await response.json();
              const result = resultRaw.data || [];
              setAdmins(result);
          } catch (error) {
              console.error("Failed to fetch members:", error);
          } finally {
              setLoading(false);
          }
      }, []);


  useEffect(() => {
    fetchMembersById();
    fetchRoles();
    fetchCountry();
    fetchMembers();
  }, [fetchMembersById]);

  const token = localStorage.getItem("adminToken");


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileuploaded(true);
      setFormData((prev) => ({ ...prev, profile: file })); // this is the image to upload
      setPhotoPreview(URL.createObjectURL(file)); // this is the preview
    }
  };


  // console.log('localStorageRole', localStorage.role)
  // console.log('localStorageId', JSON.parse(localStorage.adminInfo).id)
  // console.log('MyID', formData.id)
  // console.log('MyIDOptions', roleOptions)

  const handleRoleChange = (selected) => {
    if (!selected) return;

    // Normalize to consistent format
    const normalized = {
      id: selected.value,
      role: selected.label,
      label: selected.label,
      value: selected.value,
    };

    setFormData((prev) => ({ ...prev, role: normalized }));
  };


  const handleRoleCreateModal = (inputValue) => {
    setRoleName(inputValue);
    setPermissions([]);
    setShowRoleModal(true);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setOriginalData(formData); // update backup on save
    setEditPersonal(false);
    setEditAddress(false);
    const requiredFields = ["firstName", "lastName", "email", "city", "postalCode"];
    const missing = requiredFields.filter((f) => !formData[f]);

    if (missing.length > 0) {
      Swal.fire({
        icon: "error",
        title: "Missing Fields",
        text: `Please fill in: ${missing.join(", ")}`,
      });
      return;
    }
    const data = new FormData();
    data.append("firstName", formData.firstName);
    if (formData.lastName) {
      data.append("lastName", formData.lastName);
    }
    data.append("country", formData?.countryId || formData.country);
    data.append("city", formData.city);
    data.append("postalCode", formData.postalCode);
    data.append("position", formData.position);
    data.append("phoneNumber", formData.phoneNumber);
    data.append("email", formData.email);
    data.append("role", formData.role?.id || formData.role?.value);

    if (formData.profile && fileuploaded) {
      data.append("profile", formData.profile);
    }
    if (isImageremove == true) {
      data.append("removedImage", true);
    }
    if (!formData.countryId) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Information',
        text: 'Please select a country and fill out all address fields.',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK',
      }); return;
    }

    try {
      Swal.fire({
        title: "Updating Member...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const response = await fetch(`${API_BASE_URL}/api/admin/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      const result = await response.json();
      const verified = await verifyToken(token);

      // console.log('🔍 Verification result:', verified);
      if (!response.ok) {
        Swal.fire({
          icon: "error",
          title: "Failed to Update Member",
          text: result.message || "Something went wrong.",
        });
        return;
      }

      Swal.fire({
        icon: "success",
        title: result.message || "Member Updated",
        text: result.message || "New member was Updated successfully!",
        timer: 2000,
        showConfirmButton: false,
      });
      const storedAdmin = localStorage.getItem("adminInfo");
      const parsedAdmin = JSON.parse(storedAdmin);
      setAdminInfo(parsedAdmin);
      navigate('/members/List')


      setPhotoPreview(null);

    } catch (error) {
      console.error("Error Updating member:", error);
      Swal.fire({
        icon: "error",
        title: "Network Error",
        text: error.message || "An error occurred while submitting the form.",
      });
    }
  };
  const handleDelete = async () => {
    const { value: action } = await Swal.fire({
      title: "Delete Options",
      html: `
      <div class="text-left">
        <p class="text-gray-700 font-medium mb-2 text-center">Choose how you want to proceed:</p>
        <button id="deleteAllBtn" class="swal2-confirm swal2-styled" style="background-color:#d33;margin-bottom:10px;width:100%;">
         Permanently Delete (Delete All Related Data)
        </button>
        <button id="assignBtn" class="swal2-confirm swal2-styled" style="background-color:#3085d6;width:100%;">
         Assign Data to Another Admin
        </button>
      </div>
    `,
      showCancelButton: true,
      cancelButtonText: "Cancel",
      showConfirmButton: false, // Hide the default confirm button
      didOpen: () => {
        const deleteAllBtn = Swal.getPopup().querySelector("#deleteAllBtn");
        const assignBtn = Swal.getPopup().querySelector("#assignBtn");

        deleteAllBtn.addEventListener("click", () => {
          Swal.close();
          performDelete("permanent");
        });

        assignBtn.addEventListener("click", () => {
          Swal.close();
          showAssignDropdown();
        });
      },
    });
  };

  // Step 2: Show dropdown of admins to assign
  const showAssignDropdown = async () => {
    const { value: selectedAdmin } = await Swal.fire({
      title: "Assign Data",
      html: `
      <select id="adminSelect" class="swal2-input border border-gray-200">
        <option value="">-- Select Admin --</option>
        ${admins
          .map(
            (a) => `<option value="${a.id}">${a.email}</option>`
          )
          .join("")}
      </select>
    `,
      confirmButtonText: "Assign",
      showCancelButton: true,
      cancelButtonText: "Cancel",
      preConfirm: () => {
        const select = Swal.getPopup().querySelector("#adminSelect");
        if (!select.value) {
          Swal.showValidationMessage("Please select an admin to assign data to");
          return false;
        }
        return select.value;
      },
    });

    if (selectedAdmin) {
      performDelete("assign", selectedAdmin);
    }
  };

  // Step 3: Perform delete API call
  const performDelete = async (actionType, assignAdminId = null) => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      Swal.fire("Error", "No token found. Please login again.", "error");
      return;
    }

    Swal.fire({
      title: actionType === "assign" ? "Assigning data..." : "Deleting...",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      const payload =
        actionType === "assign"
          ? { transferToAdminId: assignAdminId }
          : { permanent: true };

      const response = await fetch(`${API_BASE_URL}/api/admin/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        Swal.fire(
          "Success",
          actionType === "assign"
            ? "Data has been assigned successfully."
            : "Admin and related data permanently deleted.",
          "success"
        );
        navigate("/members/List");
      } else {
        Swal.fire("Error", result.message || "Something went wrong.", "error");
      }
    } catch (error) {
      Swal.fire("Error", "Network or server error occurred.", "error");
      console.error("Delete error:", error);
    }
  };



  
  const handleTogglePersonal = () => {
    if (!editPersonal) {
      setOriginalData(formData); // backup
      setEditPersonal(true);
    } else {
      setFormData(originalData); // restore
      setEditPersonal(false);
    }
  };
  const handleToggleAddress = () => {
    if (!editAddress) {
      setOriginalData(formData); // backup
      setEditAddress(true);
    } else {
      setFormData(originalData); // restore
      setEditAddress(false);
    }
  };
  const handleSuspend = async (status) => {
    const isSuspending = status === 1; // 1 = suspend, 0 = activate
    const statusText = isSuspending ? 'suspend' : 'active';

    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: `You are about to ${statusText} this member.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: `Yes, ${statusText} it!`,
    });

    if (!confirm.isConfirmed) return;

    const token = localStorage.getItem("adminToken");
    if (!token) {
      return Swal.fire("Error", "No token found. Please login again.", "error");
    }

    Swal.fire({
      title: `${statusText.charAt(0).toUpperCase() + statusText.slice(1)}...`,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/${id}/status?status=${statusText}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (response.ok) {
        Swal.fire(
          `${statusText.charAt(0).toUpperCase() + statusText.slice(1)}  !`,
          `Member has been ${statusText}ed successfully.`,
          "success"
        );
        navigate('/members/List');
      } else {
        Swal.fire("Error", result.message || `Failed to ${statusText} the member.`, "error");
      }
    } catch (err) {
      console.error(`${statusText} error:`, err);
      Swal.fire("Error", "Network or server error occurred.", "error");
    }
  };

  const [isImageError, setIsImageError] = useState(false);


  const localStorageRole = localStorage.role; // e.g., "Super Admin"
  const localStorageId = JSON.parse(localStorage.adminInfo).id; // e.g., 7

  // Filter role options
  const filteredRoleOptions =
    localStorageId === formData.id
      ? roleOptions.filter((role) => role.label !== localStorageRole)
      : roleOptions;
  const countryOptions = country.map(item => ({
    value: item.id,
    label: item.name // <-- make sure this is a string!
  }));


  if (loading) return <Loader />;
  if (!id) return null;
  if (error) return <p className="text-red-500 text-center mt-5">{error}</p>;
console.log('formData',formData)
console.log('editPersonal',editPersonal)
  // console.log('isImageremove', isImageremove)
  return (
    <div className="md:max-w-[1043px] w-full mx-auto md:p-4 space-y-8">
      <h2
        onClick={() => navigate('/members/List')}
        className="text-2xl font-semibold flex items-center gap-2 cursor-pointer hover:opacity-80 mb-6"
      >
        <img src="/images/icons/arrow-left2.png" alt="Back" />
        Go Back
      </h2>

      <form className="space-y-8"
        onSubmit={(e) => handleSubmit(e)}

      >
        <div className="md:flex items-center justify-between bg-white p-6 rounded-4xl border border-[#E2E1E5]">
          <div className="md:flex items-center gap-4">
            <div className="relative cursor-pointer w-20 h-20 md:w-[113px] md:h-[113px]">
              <img
                src={
                  photoPreview
                    ? photoPreview
                    : formData.profile
                      ? `${formData.profile}`
                      : FALLBACK
                }
                alt="avatar"
                className="w-full h-full rounded-full object-cover border"
                onLoad={() => setIsImageValid(true)}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = FALLBACK;
                  setIsImageValid(false); // mark image as invalid
                }}
              />
              {editPersonal && (
                <>
                  {(photoPreview || formData.profile) && isImageValid && (
                    <img
                      src="/images/icons/cancel.png"
                      alt="Cross"
                      className="absolute top-[-15px] right-[-15px] rounded-full object-cover border cursor-pointer"
                      onClick={() => {
                        Swal.fire({
                          title: 'Are you sure?',
                          text: "Do you want to remove your picture?",
                          icon: 'warning',
                          showCancelButton: true,
                          confirmButtonColor: '#3085d6',
                          cancelButtonColor: '#d33',
                          confirmButtonText: 'Yes, remove it!',
                          cancelButtonText: 'Cancel'
                        }).then((result) => {
                          if (result.isConfirmed) {
                            setFormData((prev) => ({ ...prev, profile: null }));
                            setPhotoPreview(null);
                            setIsImageremove(true);
                            setIsImageValid(false); // hide cross after removal
                            Swal.fire('Removed!', 'Your picture has been removed.', 'success');
                          }
                        });
                      }}
                    />
                  )}
                </>
              )}

              { editPersonal && (
                <>
                  <div className="absolute bottom-1 md:right-0 bg-black bg-opacity-30 text-white text-xs px-2 py-0.5 whitespace-nowrap rounded-full">
                    Edit Image
                  </div>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </>
              )}
            </div>




            <div>
              <h2
                className="text-[28px] font-semibold pb-1 truncate max-w-[250px] block"
                title={`${formData.firstName || formData.name || ''} ${formData.lastName || ''}`}
              >
                {formData.firstName || formData.name || ''} {formData.lastName}
              </h2>

              <p className="text-[#717073] font-medium md:text-[18px] text-sm truncate md:max-w-[600px] max-w-[200px] block">
                {formData.email || ''}
                <br />
                <span className="block mt-2">{formData.role?.role || '-'} | {formData.position || ''}</span>
              </p>
            </div>
          </div>
          <button type="button" className="text-sm text-[#717073] border flex gap-3 py-2 items-center border-[#E2E1E5] p-3 rounded-full  hover:bg-blue-50"
            onClick={handleTogglePersonal}
          >
            {editPersonal ? "Cancel" : "Edit Profile"} <img src="/members/editPencil.png" className="w-5" alt="" />
          </button>
        </div>

        <div className="bg-white p-6 rounded-4xl border border-[#E2E1E5]">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-[24px]">Personal Information</h3>
            <button type="button" className="text-sm text-[#717073] border flex gap-3 py-2 items-center border-[#E2E1E5] p-3 rounded-full  hover:bg-blue-50"
              onClick={handleTogglePersonal}
            >
              {editPersonal ? "Cancel" : "Edit"} <img src="/members/editPencil.png" className="w-5" alt="" />
            </button>
          </div>
          <div className="md:grid grid-cols-1 sm:grid-cols-2 gap-4">
            {editPersonal ? (
              <>
                {[
                  {
                    name: "firstName",
                    label: "First Name",
                    placeholder: "First Name",
                    preventNumbers: true,
                  },
                  {
                    name: "lastName",
                    label: "Last Name",
                    placeholder: "Last Name",
                    preventNumbers: true,
                  },
                  {
                    name: "email",
                    label: "Email",
                    placeholder: "Email",
                  },
                  {
                    name: "phoneNumber",
                    label: "Phone Number",
                    placeholder: "Phone",
                    numeric: true,
                  },
                  {
                    name: "position",
                    label: "Position",
                    placeholder: "Position",
                    preventNumbers: true,
                  },
                  {
                    name: "passwordHint",
                    label: "Password Hint",
                    placeholder: "Password",
                    readOnly: true,
                  },
                ].map(({ name, label, placeholder, preventNumbers, numeric, readOnly }) => (
                  <div key={name}>
                    <label className="block text-sm font-semibold text-[#282829]">{label}</label>
                    <input
                      name={name}
                      value={formData[name] || ""}
                      onChange={(e) => {
                        let value = e.target.value;

                        if (numeric) {
                          // Only allow digits
                          value = value.replace(/\D/g, "");
                        } else if (preventNumbers) {
                          // Remove any digits (also handles paste)
                          value = value.replace(/\d/g, "");
                        }

                        setFormData((prev) => ({ ...prev, [name]: value }));
                      }}
                      onKeyPress={(e) => {
                        if (preventNumbers && /\d/.test(e.key)) e.preventDefault();
                      }}
                      readOnly={readOnly}
                      placeholder={placeholder}
                      inputMode={numeric ? "numeric" : undefined}
                      pattern={numeric ? "[0-9]*" : undefined}
                      className="w-full mt-2 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                  </div>
                ))}
              </>
            ) : (
              <>
                {[
                  { label: "First Name:", value: formData.firstName || "Enter First Name" },
                  { label: "Last Name:", value: formData.lastName || "Enter Last Name" },
                  { label: "Email:", value: formData.email || "Enter Your Email" },
                  {
                    label: "Phone:", value: formData.phoneNumber ? `+${formData.phoneNumber}`
                      : "Enter Your Mobile Number"
                  }, {
                    label: "Bio:",
                    value: (
                      <>
                        {formData.role?.role || "-"} <br />
                        {formData.position || "Enter Your Bio"}
                      </>
                    ),
                  },
                  { label: "Password:", value: formData.passwordHint },
                ].map(({ label, value }, idx) => (
                  <div key={idx}>
                    <span className="block text-[#717073] font-medium text-sm">{label}</span>
                    <span className="font-medium text-[#282829] text-[20px]">{value}</span>
                  </div>
                ))}
              </>
            )}
          </div>

        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#E2E1E5]">
          {/* Header */}
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-[24px]">Address</h3>
            <button
              type="button"
              className="text-sm text-[#717073] border flex gap-3 py-2 items-center border-[#E2E1E5] p-3 rounded-full hover:bg-blue-50"
              onClick={handleToggleAddress}
            >
              {editAddress ? "Cancel" : "Edit"}

              <img src="/members/editPencil.png" className="w-5" alt="" />
            </button>
          </div>

          {/* Content */}
          <div className="md:grid grid-cols-1 sm:grid-cols-2 gap-4">
            {editAddress ? (
              <>
                {/* Country (react-select, handled separately) */}
                <div>
                  <label className="block text-sm font-semibold text-[#282829] mb-1">
                    Country
                  </label>
                  <Select
                    name="country"
                    value={
                      countryOptions.find(
                        (option) => option.value === formData.countryId
                      ) || null
                    }
                    onChange={(selectedOption) =>
                      handleChange({
                        target: {
                          name: "countryId",
                          value: selectedOption ? selectedOption.value : null,
                        },
                      })
                    }
                    options={countryOptions}
                    placeholder="Select Country"
                    className="mt-0"
                    classNamePrefix="react-select"
                  />
                </div>

                {[
                  {
                    name: "city",
                    label: "City",
                    placeholder: "City",
                    preventNumbers: true,
                  },
                  {
                    name: "postalCode",
                    label: "Postal Code",
                    placeholder: "Postal Code",
                    type: "text", // ✅ keep as text
                    fullWidth: true,
                  },
                ].map(({ name, label, placeholder, preventNumbers, type, fullWidth }) => (
                  <div key={name} className={fullWidth ? "sm:col-span-2" : ""}>
                    <label className="block text-sm font-semibold text-[#282829] mb-1">
                      {label}
                    </label>
                    <input
                      name={name}
                      type={type || "text"}
                      value={formData[name] || ""}

                      onChange={(e) => {
                        let val = e.target.value;

                        if (preventNumbers) {
                          // ✅ City only letters + spaces
                          val = val.replace(/[^a-zA-Z\s]/g, "");
                        }

                        if (name === "postalCode") {
                          // ✅ Allow everything (letters, numbers, spaces, special chars)
                          val = val.toUpperCase();
                        }

                        handleChange({
                          target: { name, value: val }
                        });
                      }}
                      placeholder={placeholder}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ))}

              </>
            ) : (
              <>
                {[
                  {
                    label: "Country:",
                    value: formData.country?.name || "Enter Country Name",
                  },
                  {
                    label: "City:",
                    value: formData.city || "Enter City Name",
                  },
                  {
                    label: "Postal Code:",
                    value: formData.postalCode && formData.postalCode !== "null"
                      ? formData.postalCode
                      : "Enter Postal Code", fullWidth: true,
                  },
                ].map(({ label, value, fullWidth }, idx) => (
                  <div key={idx} className={fullWidth ? "sm:col-span-2" : ""}>
                    <span className="block text-[#717073] font-medium text-sm">
                      {label}
                    </span>
                    <span className="font-medium text-[#282829] text-[20px]">
                      {value}
                    </span>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-[#E2E1E5]">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-[24px]">Permissions</h3>
          </div>
          <div className="mb-4 md:w-4/12 md:mt-0 mt-4">
            <label className="block text-[14px] font-semibold mb-2">Role Name</label>

            {MyRole === 'Super Admin' ? (
              <CreatableSelect
                options={filteredRoleOptions}
                value={
                  formData.role
                    ? {
                      label: formData.role.label || formData.role.role,
                      value: formData.role.value || formData.role.id,
                    }
                    : null
                }
                onChange={handleRoleChange}
                onCreateOption={handleRoleCreateModal}
                formatCreateLabel={(inputValue) => (
                  <span className="text-blue-600">
                    Create role: <strong>{inputValue}</strong>
                  </span>
                )}
                placeholder="Select or create role"
                classNamePrefix="react-select"
              />
            ) : (
              <input
                type="text"
                value={
                  formData.role?.label ||
                  formData.role?.role ||
                  formData.role?.value ||
                  formData.role?.id || ''
                }
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
              />
            )}
            
          </div>

        </div>

        <div className="flex justify-center  gap-2">
          <div className="flex gap-2">
            {MyRole === 'Super Admin' && (
              <button
                type="button"
                onClick={() => handleSuspend(formData.status === 'suspend' ? 0 : 1)}
                className="btn border cursor-pointer border-[#E2E1E5] text-[#717073] px-8 py-2 font-semibold rounded-lg text-[14px]"
              >
                {formData.status === 'suspend' ? 'Activate' : 'Suspend'}
              </button>
            )}
            {checkPermission(
              { module: "member", action: "delete" }) && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="btn cursor-pointer border border-[#E2E1E5] text-[#717073] px-8 py-2 font-semibold rounded-lg text-[14px]"
                >
                  Delete
                </button>
              )}
          </div>



          <button type="submit" className="btn bg-[#237FEA] text-white cursor-pointer px-8 py-2 font-semibold rounded-lg text-[14px]" >Update</button>
        </div>
      </form >
      {showRoleModal && (
        <RoleModal
          visible={showRoleModal}
          onClose={() => setShowRoleModal(false)}
          onRoleCreated={(newRole) => {
            setFormData((prev) => ({ ...prev, role: newRole }));
            fetchRoles();
          }}
        />

      )}
    </div >
  );
};

export default Update;
