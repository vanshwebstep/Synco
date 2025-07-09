import React, { useEffect, useState } from "react";
import CreatableSelect from "react-select/creatable";
import Swal from "sweetalert2";
import { useMembers } from "../contexts/MemberContext";
import RoleModal from "./RoleModal";

const Create = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const { roleOptions,
    fetchRoles,
    fetchMembers,
    showRoleModal,
    setShowRoleModal,
    setRoleName,
    setPermissions } = useMembers();
  const [photoPreview, setPhotoPreview] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    phoneNumber: "",
    email: "",
    password: "",
    role: null,
    photo: null,
  });

  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    if (token) fetchRoles();
  }, [token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, photo: file }));
      setPhotoPreview(URL.createObjectURL(file));
    }
  };


  const handleRoleChange = (selected) => {
    if (selected?.isCreate) {
      setShowRoleModal(true);
      return;
    }
    setFormData((prev) => ({ ...prev, role: selected }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.position ||
      !formData.phoneNumber ||
      !formData.email ||
      !formData.password ||
      !formData.role?.value
    ) {
      Swal.fire({
        icon: "warning",
        title: "Missing Information",
        text: "Please fill out all required fields before submitting.",
      });
      return;
    }

    const data = new FormData();
    data.append("name", formData.name);
    data.append("position", formData.position);
    data.append("phoneNumber", formData.phoneNumber);
    data.append("email", formData.email);
    data.append("password", formData.password);
    data.append("role", formData.role?.value);

    if (formData.photo) {
      data.append("profile", formData.photo);
    }

    try {
      Swal.fire({
        title: "Creating Member...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const response = await fetch(`${API_BASE_URL}/api/admin/member`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      const result = await response.json();

      if (!response.ok) {
        Swal.fire({
          icon: "error",
          title: "Failed to Add Member",
          text: result.message || "Something went wrong.",
        });
        return;
      }

      Swal.fire({
        icon: "success",
        title: "Member Created",
        text: result.message || "New member was added successfully!",
        timer: 2000,
        showConfirmButton: false,
      });

      fetchMembers();

      setFormData({
        name: "",
        position: "",
        phoneNumber: "",
        email: "",
        password: "",
        role: null,
        photo: null,
      });
      setPhotoPreview(null);

    } catch (error) {
      console.error("Error creating member:", error);
      Swal.fire({
        icon: "error",
        title: "Network Error",
        text: error.message || "An error occurred while submitting the form.",
      });
    }
  };

  const handleRoleCreateModal = (inputValue) => {
    setRoleName(inputValue);
    setPermissions([]);
    setShowRoleModal(true);
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-[23px] pb-4 font-semibold mb-4 border-[#E2E1E5] border-b p-5">
        Add New Member
      </h2>

      <form className="space-y-4 pt-0 p-5" onSubmit={handleSubmit}>

        <div>
          <label className="block text-sm font-semibold text-[#282829]">Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full border border-[#E2E1E5] rounded-xl px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#282829]">Position</label>
          <input
            type="text"
            name="position"
            value={formData.position}
            onChange={handleInputChange}
            className="w-full border border-[#E2E1E5] rounded-xl px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#282829]">Phone Number</label>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            className="w-full border border-[#E2E1E5] rounded-xl px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#282829]">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full border border-[#E2E1E5] rounded-xl px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#282829] mb-1">Role</label>
          <CreatableSelect
            options={roleOptions}
            value={formData.role}
            onChange={handleRoleChange}
            onCreateOption={handleRoleCreateModal}
            formatCreateLabel={(inputValue) => (
              <span className="text-blue-600">Create role: <strong>{inputValue}</strong></span>
            )}
            placeholder="Select or create role"
            classNamePrefix="react-select"
          />

        </div>

        <div>
          <label className="block text-sm font-semibold text-[#282829]">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className="w-full border border-[#E2E1E5] rounded-xl px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#282829] mb-1">Profile Picture</label>
          <div className="w-full rounded-lg bg-[#F5F5F5] h-32 flex items-center flex-col gap-3 justify-center cursor-pointer relative overflow-hidden">
            {photoPreview ? (
              <img src={photoPreview} alt="Uploaded" className="h-full object-cover" />
            ) : (
              <>
                <img src="/members/addblack.png" className="w-4 block" alt="" />
                <span className="text-sm ml-2 font-semibold block">Add Photo</span>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={handlePhotoUpload}
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full mt-4 bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition"
        >
          Add Member
        </button>
      </form>
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

export default Create;
