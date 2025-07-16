import React, { useEffect, useState } from "react";
import CreatableSelect from "react-select/creatable";
import Swal from "sweetalert2";
import { useMembers } from "../contexts/MemberContext";
import RoleModal from "./RoleModal";
import { Eye, EyeOff } from "lucide-react"; // or use any icon library

const Create = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [errors, setErrors] = useState({});
  const [phoneError, setPhoneError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

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

    let newValue = value;

    // Phone number specific logic
    if (name === 'phoneNumber') {
      // Allow only digits
      newValue = value.replace(/\D/g, '');


    } else {
      // Clear error for other fields
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }

    // Update form data
    setFormData((prev) => ({ ...prev, [name]: newValue }));
  };


  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, photo: file }));
      setPhotoPreview(URL.createObjectURL(file));
    }
  };
  const validate = () => {
    const newErrors = {};
    const password = formData.password;

    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    } else if (!/[A-Z]/.test(password)) {
      newErrors.password = 'Password must contain at least one uppercase letter.';
    } else if (!/\d/.test(password)) {
      newErrors.password = 'Password must contain at least one number.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
    if (validate()) {
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

        const response = await fetch(`${API_BASE_URL}/api/admin`, {
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
            title: result.message||"Failed to Add Member",
            text: result.message || "Something went wrong.",
          });
          return;
        }

        Swal.fire({
          icon: "success",
          title: result.message || "Member Created",
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
            className={`w-full border ${errors.phoneNumber ? 'border-red-500' : 'border-[#E2E1E5]'
              } rounded-xl px-3 py-2 mt-1 focus:outline-none focus:ring-2 ${errors.phoneNumber ? 'focus:ring-red-500' : 'focus:ring-blue-500'
              }`}
          />
          {errors.phoneNumber && (
            <p className="text-sm text-red-500 mt-1">{errors.phoneNumber}</p>
          )}
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

        <div className="relative">
      <label className="block text-sm font-semibold text-[#282829]">
        Password
      </label>
      <input
        type={showPassword ? "text" : "password"}
        name="password"
        value={formData.password}
        onChange={handleInputChange}
        className="w-full border border-[#E2E1E5] rounded-xl px-3 py-2 mt-1 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-11 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
      >
        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>

      {errors.password && (
        <p className="text-red-500 text-sm mt-1">{errors.password}</p>
      )}
    </div>


        <div>
          <label className="block text-sm font-semibold text-[#282829] mb-1">Profile Picture</label>
          <div className="w-full rounded-lg bg-[#F5F5F5] h-32 flex items-center flex-col gap-3 justify-center cursor-pointer relative overflow-hidden">
            {photoPreview ? (
              <img src={photoPreview} alt="Uploaded" className="h-full object-cover" />
            ) : (
              <>
                <img src="members/addblack.png" className="w-4 block" alt="" />
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
