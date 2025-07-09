import React, { useEffect, useState } from "react";
import CreatableSelect from "react-select/creatable";
import Swal from "sweetalert2";
import { useMembers } from "../contexts/MemberContext";

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
    <div className=" bg-gray-50 min-h-screen">
         <h2
                    onClick={() => {
                        if (previewShowModal) {
                            setPreviewShowModal(false);
                        } else {
                            navigate('/holiday-camps/payment-planManager');
                        }
                    }}
                    className="text-2xl font-semibold flex items-center gap-2 cursor-pointer hover:opacity-80"
                >
                    <img src="/icons/arrow-left2.png" alt="Back" />
                    {'Create Discount'}
                </h2>
                <div className="w-100 py-6 ">
<div className="w-60 p-4 bg-white rounded-3xl">
<div>
    <h4 className="text-base font-semibold">Amoutnt Of Products</h4>
    <div className="text-[16px] flex items-center font-semibold">
        <button className="w-4 h-4 me-2 flex items-center justify-center rounded-md border-2 border-gray-500 transition-colors focus:outline-none"></button>
        Discount Code
        </div>
</div>
</div>
</div>
    </div>
  );
};

export default Create;
