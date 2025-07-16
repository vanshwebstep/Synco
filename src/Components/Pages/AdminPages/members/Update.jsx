import CreatableSelect from "react-select/creatable";
import Select from 'react-select';

import React, { useEffect, useState, useCallback } from "react";
import Swal from "sweetalert2";
import { useMembers } from "../contexts/MemberContext";
import RoleModal from "./RoleModal";
import { useLocation, useNavigate } from "react-router-dom";
import Loader from '../contexts/Loader'
const Update = () => {
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const useQuery = () => new URLSearchParams(useLocation().search);
  const query = useQuery();
  const id = query.get("id");
  const [error, setError] = useState("");
  const MyRole = localStorage.getItem("role");

  const [editPersonal, setEditPersonal] = useState(false);
  const [editAddress, setEditAddress] = useState(false);
  const [loading, setLoading] = useState(false);
  const [country, setCountry] = useState([]);
  const [photoPreview, setPhotoPreview] = useState(null);

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
  console.log('formData', formData)

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
      console.log('resultRaw', resultRaw)

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



  useEffect(() => {
    fetchMembersById();
    fetchRoles();
    fetchCountry();
  }, [fetchMembersById]);

  const token = localStorage.getItem("adminToken");


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

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


    const data = new FormData();
    data.append("firstName", formData.firstName);
    data.append("lastName", formData.lastName);
    data.append("country", formData?.countryId || formData.country);
    data.append("city", formData.city);
    data.append("postalCode", formData.postalCode);
    data.append("position", formData.position);
    data.append("phoneNumber", formData.phoneNumber);
    data.append("email", formData.email);
    data.append("role", formData.role?.id || formData.role?.value);

    if (formData.image) {
      data.append("profile", formData.image);
    }
    if (!formData.countryId) {
      alert("Please select a country and other feilds in Address");
      return;
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
        title: "Member Created",
        text: result.message || "New member was Updated successfully!",
        timer: 2000,
        showConfirmButton: false,
      });

      navigate('/members')


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
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: 'You won’t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });

    if (!confirm.isConfirmed) return;

    const token = localStorage.getItem("adminToken");
    if (!token) {
      Swal.fire("Error", "No token found. Please login again.", "error");
      return;
    }

    Swal.fire({
      title: 'Deleting...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (response.ok) {
        Swal.fire("Deleted!", "Member has been deleted.", "success");
        navigate('/members');
      } else {
        Swal.fire("Error", result.message || "Something went wrong.", "error");
      }
    } catch (error) {
      Swal.fire("Error", "Network or server error occurred.", "error");
      console.error("Delete error:", error);
    }
  };

  const handleSuspend = async () => {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: 'You are about to suspend this member.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, suspend it!',
    });

    if (!confirm.isConfirmed) return;

    const token = localStorage.getItem("adminToken");
    if (!token) {
      return Swal.fire("Error", "No token found. Please login again.", "error");
    }

    Swal.fire({
      title: 'Suspending...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/${id}/status?status=suspend`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (response.ok) {
        Swal.fire("Suspended!", "Member has been suspended successfully.", "success");
        navigate('/members');
      } else {
        Swal.fire("Error", result.message || "Failed to suspend the member.", "error");
      }
    } catch (err) {
      console.error("Suspend error:", err);
      Swal.fire("Error", "Network or server error occurred.", "error");
    }
  };



  const countryOptions = country.map(item => ({
    value: item.id,
    label: item.name // <-- make sure this is a string!
  }));

  if (loading) return <Loader />;
  if (!id) return null;
  if (error) return <p className="text-red-500 text-center mt-5">{error}</p>;



  return (
    <div className="md:max-w-[1043px] w-full mx-auto md:p-4 space-y-8">
      <div className="md:flex items-center justify-between bg-white p-6 rounded-2xl border border-[#E2E1E5]">
        <div className="flex items-center gap-4">
          <div className="relative group cursor-pointer">
            <img
              src={
                formData.profile
                  ? `${API_BASE_URL}/${formData.profile}`
                  : '/SidebarLogos/OneTOOne.png'
                    ? '/SidebarLogos/OneTOOne.png'
                    : "/SidebarLogos/OneTOOne.png"
              }
              alt="avatar"
              className="md:w-[113px] md:h-[113px] w-20 h-20 rounded-full object-cover border"
            />

            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>
          <div>
            <h2 className="text-[28px] font-semibold pb-1">
              {formData.firstName || formData.name || 'NIL'} {formData.lastName}
            </h2>
            <p className="text-[#717073] font-medium md:text-[18px] text-sm">
              {formData.email || 'NIL'}
              <br />
              {formData.role?.role || '-'} | {formData.position || 'NIL'}
            </p>
          </div>
        </div>
        <button className="text-sm text-[#717073] border flex gap-3 py-2 items-center border-[#E2E1E5] p-3 rounded-full  hover:bg-blue-50"
          onClick={() => setEditPersonal(!editPersonal)}
        >
          {editPersonal ? "Cancel" : "Edit Profile"} <img src="members/editPencil.png" className="w-5" alt="" />
        </button>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-[#E2E1E5]">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold text-[24px]">Personal Information</h3>
          <button className="text-sm text-[#717073] border flex gap-3 py-2 items-center border-[#E2E1E5] p-3 rounded-full  hover:bg-blue-50"
            onClick={() => setEditPersonal(!editPersonal)}
          >
            {editPersonal ? "Cancel" : "Edit"} <img src="members/editPencil.png" className="w-5" alt="" />
          </button>
        </div>
        <div className="md:grid grid-cols-1 sm:grid-cols-2 gap-4">
          {editPersonal ? (
            <>
              <div>
                <label className="block text-sm font-semibold text-[#282829]">First Name</label>
                <input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="First Name"
                  className="w-full mt-2 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#282829]">Last Name</label>
                <input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Last Name"
                  className="w-full mt-2 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#282829]">Email</label>
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="w-full mt-2 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#282829]">Phone Number</label>
                <input
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={(e) => {
                    const onlyNums = e.target.value.replace(/\D/g, ''); // Remove all non-digits
                    setFormData((prev) => ({ ...prev, phoneNumber: onlyNums }));
                  }}
                  placeholder="Phone"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  className="w-full mt-2 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>


              <div>
                <label className="block text-sm font-semibold text-[#282829]">Position</label>
                <input
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  placeholder="Position"
                  className="w-full mt-2 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#282829]">Password Hint</label>
                <input
                  name="passwordHint"
                  readOnly
                  value={formData.passwordHint}
                  placeholder="Password"
                  type="text"
                  className="w-full mt-2 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <span className="block text-[#717073] font-medium text-sm">First Name:</span>
                <span className="font-medium text-[#282829] text-[20px]">{formData.firstName || 'Enter First Name'}</span>
              </div>
              <div>
                <span className="block text-[#717073] font-medium text-sm">Last Name:</span>
                <span className="font-medium text-[#282829] text-[20px]">{formData.lastName || 'Enter Last Name'}</span>
              </div>
              <div>
                <span className="block text-[#717073] font-medium text-sm">Email:</span>
                <span className="font-medium text-[#282829] text-[20px]">{formData.email || 'Enter Your Email'}</span>
              </div>
              <div>
                <span className="block text-[#717073] font-medium text-sm">Phone:</span>
                <span className="font-medium text-[#282829] text-[20px]">{formData.phoneNumber || 'Enter Your Mobile Number'}</span>
              </div>
              <div>
                <span className="block text-[#717073] font-medium text-sm">Bio:</span>
                <span className="font-medium text-[#282829] text-[20px]">
                  {formData.role?.role || '-'} <br />
                  {formData.position || 'Enter Your Bio'}
                </span>
              </div>
              <div>
                <span className="block text-[#717073] font-medium text-sm">Password:</span>
                <span className="font-medium text-[#282829] text-[20px]">{formData.passwordHint}</span>
              </div>
            </>
          )}

        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-[#E2E1E5]">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold text-[24px]">Address</h3>
          <button
            className="text-sm text-[#717073] border flex gap-3 py-2 items-center border-[#E2E1E5] p-3 rounded-full hover:bg-blue-50"
            onClick={() => setEditAddress(!editAddress)}
          >
            {editAddress ? "Cancel" : "Edit"} <img src="members/editPencil.png" className="w-5" alt="" />
          </button>
        </div>
        <div className="md:grid grid-cols-1 sm:grid-cols-2 gap-4">
          {editAddress ? (
            <>
              <div>
                <label className="block text-sm font-semibold text-[#282829] mb-1">Country</label>
                <Select
                  name="country"
                  value={countryOptions.find(option => option.value === formData.countryId) || null}
                  onChange={(selectedOption) =>
                    handleChange({
                      target: {
                        name: 'countryId',
                        value: selectedOption ? selectedOption.value : null
                      }
                    })
                  }
                  options={countryOptions}
                  placeholder="Select Country"
                  className="mt-0"
                  classNamePrefix="react-select"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#282829] mb-1">City</label>
                <input
                  name="city"
                  value={formData.city}
                  required
                  onChange={handleChange}
                  placeholder="City"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-[#282829] mb-1">Postal Code</label>
                <input
                  name="postalCode"
                  required
                  value={formData.postalCode}
                  onChange={handleChange}
                  placeholder="Postal Code"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <span className="block text-[#717073] font-medium text-sm">Country:</span>
                <span className="font-medium text-[#282829] text-[20px]">
                  {formData.country?.name || 'Enter Country Name'}
                </span>
              </div>

              <div>
                <span className="block text-[#717073] font-medium text-sm">City:</span>
                <span className="font-medium text-[#282829] text-[20px]">
                  {formData.city || 'Enter City Name'}
                </span>
              </div>

              <div className="sm:col-span-2">
                <span className="block text-[#717073] font-medium text-sm">Postal Code:</span>
                <span className="font-medium text-[#282829] text-[20px]">
                  {formData.postalCode || 'Enter Postal Code'}
                </span>
              </div>
            </>
          )}
        </div>

      </div>



      <div className="bg-white p-6 rounded-2xl border border-[#E2E1E5]">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold text-[24px]">Permissions</h3>
        </div>
        <div className="mb-4 md:w-4/12">
          <label className="block text-[14px] font-semibold mb-2">Role Name</label>

          {MyRole === 'Super Admin' ? (
            <CreatableSelect
              options={roleOptions}
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
        {MyRole === 'Super Admin' && (
          <div className="flex gap-2">
            <button
              onClick={handleSuspend}
              className="btn border cursor-pointer border-[#E2E1E5] text-[#717073] px-8 py-2 font-semibold rounded-lg text-[14px]"
            >
              Suspend
            </button>
            <button
              onClick={handleDelete}
              className="btn cursor-pointer border border-[#E2E1E5] text-[#717073] px-8 py-2 font-semibold rounded-lg text-[14px]"
            >
              Delete
            </button>
          </div>
        )}

        <button className="btn bg-[#237FEA] text-white cursor-pointer px-8 py-2 font-semibold rounded-lg text-[14px]" onClick={handleSubmit}>Save</button>
      </div>
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
    </div>
  );
};

export default Update;
