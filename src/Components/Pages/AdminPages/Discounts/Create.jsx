import React, { useEffect, useState } from "react";
import CreatableSelect from "react-select/creatable";
import Swal from "sweetalert2";
import { useMembers } from "../contexts/MemberContext";
import { useNavigate } from 'react-router-dom';
const Create = () => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const navigate = useNavigate();

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
        <div className="bg-gray-50 min-h-screen p-6">
            {/* Top Navigation */}
            <h2
                onClick={() => navigate('/discounts/list')}
                className="text-2xl font-semibold flex items-center gap-2 cursor-pointer hover:opacity-80 mb-6"
            >
                <img src="/icons/arrow-left2.png" alt="Back" />
                Create Discount
            </h2>

            {/* Main Content Layout */}
            <div className="flex flex-col lg:flex-row gap-6 w-full">
                {/* Left Side: Form */}
                <div className="w-full lg:w-8/12 space-y-6">
                    {/* Amount off products */}
                    <div className="bg-white rounded-3xl p-6 shadow">
                        <h4 className="text-base font-semibold mb-2">Amount off products</h4>
                        <div className="text-[16px] mb-2 flex gap-2 items-center ">
                            <input type="checkbox" className="w-4 h-4 rounded-xl text-blue-600 focus:ring-blue-500" />
                            Discount Code
                        </div>
                        <div className="text-[16px] mb-4 flex gap-2 items-center ">
                            <input type="checkbox" className="w-4 h-4 rounded-xl text-blue-600 focus:ring-blue-500" />
                            Automatic Discount
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold mb-2">Discount code</h3>
                            <div className="flex flex-col md:flex-row gap-4 w-full">
                                <input
                                    type="text"
                                    className="w-full md:flex-1 border border-[#E2E1E5] rounded-xl px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <button className="w-full md:w-auto bg-[#237FEA] text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition text-[16px]">
                                    Generate
                                </button>
                            </div>

                        </div>
                    </div>

                    {/* Value Section */}
                    <div className="bg-white rounded-3xl p-6 shadow">
                        <h4 className="text-base font-semibold mb-4">Value</h4>
                        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 mb-6 w-full">
                            <button className="bg-[#237FEA] text-white py-2 px-4 rounded-xl text-[16px] hover:bg-blue-700 transition w-full md:w-auto">
                                Percentage
                            </button>
                            <button className="bg-[#F5F5F5] text-black py-2 px-4 rounded-xl text-[16px] hover:bg-gray-200 transition w-full md:w-auto">
                                Fixed amount
                            </button>
                            <div className="relative w-full md:max-w-[200px]">
                                <input
                                    type="text"
                                    className="w-full bg-white border border-gray-200 py-2 px-3 rounded-xl text-[16px] pr-8"
                                />
                                <img
                                    className="absolute top-3 right-3 w-4 h-4"
                                    src="/icons/percentIcon.png"
                                    alt="%"
                                />
                            </div>
                        </div>


                        {/* Apply To Section */}
                        <h4 className="text-base font-semibold mb-4">Apply to</h4>
                        <div className="space-y-3">
                            <label className="flex items-center gap-2">
                                <input type="checkbox" className="w-4 h-4" />
                                Weekly classes
                            </label>
                            <div className="pl-6 space-y-2">
                                <label className="flex items-center gap-2">
                                    <input type="radio" name="weeklyOption" />
                                    Joining Fee
                                </label>
                                <label className="flex items-center gap-2">
                                    <input type="radio" name="weeklyOption" />
                                    Per Rate Lessons
                                </label>
                                <label className="flex items-center gap-2">
                                    <input type="radio" name="weeklyOption" />
                                    Uniform Fee
                                </label>
                            </div>
                            <label className="flex items-center gap-2">
                                <input type="checkbox" className="w-4 h-4" />
                                One to one
                            </label>
                            <label className="flex items-center gap-2">
                                <input type="checkbox" className="w-4 h-4" />
                                Holiday camp
                            </label>
                            <label className="flex items-center gap-2">
                                <input type="checkbox" className="w-4 h-4" />
                                Birthday party
                            </label>
                            <hr className="text-gray-200 my-5" />
                            <label className="flex items-center gap-2 mt-4">
                                <input type="checkbox" className="w-4 h-4" />
                                Apply discount once per order
                            </label>
                        </div>
                    </div>

                    {/* Maximum Discount Uses */}
                    <div className="bg-white rounded-3xl p-6 shadow space-y-4">
                        <h4 className="text-base font-semibold">Maximum discount uses</h4>
                        <label className="flex items-center gap-2">
                            <input type="checkbox" className="w-4 h-4" />
                            Limit number of times this discount can be used in total
                        </label>
                        <label className="flex items-center gap-2">
                            <input type="checkbox" className="w-4 h-4" />
                            Limit to one use per customer
                        </label>
                    </div>

                    {/* Active Dates */}
                    <div className="bg-white rounded-3xl p-6 shadow space-y-4">
                        <h4 className="text-base font-semibold">Active dates</h4>
                        <div className="flex flex-col md:flex-row gap-4 w-full">
                            <div className="flex flex-col w-full md:w-3/12">
                                <label className="text-sm font-medium mb-1">Start date</label>
                                <input
                                    type="text"
                                    className="border border-gray-300 rounded-xl px-3 py-2"
                                />
                            </div>
                            <div className="flex flex-col w-full md:w-3/12">
                                <label className="text-sm font-medium mb-1">Start time</label>
                                <input
                                    type="text"
                                    className="border border-gray-300 rounded-xl px-3 py-2"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-2 mt-2">
                            <input type="checkbox" className="w-4 h-4" />
                            <label>Set end date</label>
                        </div>
                    </div>

                    {/* Footer Buttons */}
                    <div className="flex flex-col md:flex-row justify-start gap-4 w-full">
                        <button className="w-full md:w-auto px-6 py-3 bg-none border border-gray-300 font-semibold rounded-xl text-black hover:bg-gray-100 transition">
                            Cancel
                        </button>
                        <button className="w-full md:w-auto px-6 py-3 bg-[#237FEA] text-white rounded-xl font-semibold hover:bg-blue-700 transition">
                            Create
                        </button>
                    </div>

                </div>

                {/* Right Side Summary Box */}
                <div className="w-full lg:w-4/12">
                    <div className="bg-white rounded-3xl p-6 shadow space-y-3">
                        <h4 className="text-[16px] text-[#237FEA] font-semibold">Summary</h4>
                        <p className="text-[20px] font-semibold">SAMBA 10</p>
                        <div className="border-t border-gray-200 pt-2">
                        </div>
                        <div>
                            <h5 className="text-[16px] mb-2 font-semibold text-gray-700">Summary</h5>
                            <p className="text-sm  mb-1  text-gray-600">Amount of products</p>
                            <p className="text-sm text-gray-600">Code</p>
                        </div>
                        <div className="border-t border-gray-200 pt-2">
                        </div>
                        <div>
                            <h5 className="text-[16px] font-semibold mb-2 ">Details</h5>
                            <ul className="list-none text-sm text-gray-600 space-y-1">
                                <li>5%</li>
                                <li>Applies once per order</li>
                                <li>Active from today</li>
                                <li>Weekly classes</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default Create;
