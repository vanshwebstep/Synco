import React, { useEffect, useState, useCallback } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useNotification } from "../../contexts/NotificationContext";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const CreateLead = () => {
    const { adminInfo } = useNotification();
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        mobile: "",
        postalCode: "",
        childAge: "",
    });
    const navigate = useNavigate();
    const [dialCode, setDialCode] = useState("+1");
    const [country, setCountry] = useState("us");

    const [commentsList, setCommentsList] = useState([]);
    const [comment, setComment] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const commentsPerPage = 5;

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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handlePhoneChange = (value, data) => {
        setDialCode("+" + data.dialCode);
        setCountry(data.countryCode);
        setFormData((prev) => ({ ...prev, mobile: value.replace(data.dialCode, "").trim() }));
    };

    const formatTimeAgo = (timestamp) => {
        const now = new Date();
        const past = new Date(timestamp);
        const diff = Math.floor((now - past) / 1000); // in seconds

        if (diff < 60) return `${diff}s ago`;
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;

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
            const response = await fetch(`${API_BASE_URL}/api/admin/lead/comment/list`, {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
            });

            const result = await response.json();
            setCommentsList(result?.data || []);
        } catch (error) {
            console.error("Failed to fetch comments:", error);
            Swal.fire({
                title: "Error",
                text: error.message || "Failed to fetch comments.",
                icon: "error",
                confirmButtonText: "OK",
            });
        }
    }, [API_BASE_URL]);

    const handleSubmitComment = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("adminToken");
        if (!token || !comment.trim()) return;

        try {
            Swal.fire({
                title: "Creating...",
                text: "Please Wait while we create your comment",
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading(),
            });

            const response = await fetch(`${API_BASE_URL}/api/admin/lead/comment/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ comment }),
            });

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
                text: "Comment has been added successfully!",
                showConfirmButton: false,
                timer: 1500,
            });

            setComment("");
            fetchComments();
        } catch (error) {
            console.error("Error creating comment:", error);
            Swal.fire({
                icon: "error",
                title: "Network Error",
                text: error.message || "An error occurred while submitting.",
            });
        }
    };
    const handleAddLead = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("adminToken");
        if (!token) return;

        try {
            Swal.fire({
                title: "Creating...",
                text: "Please wait while we create your lead",
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading(),
            });

            const response = await fetch(`${API_BASE_URL}/api/admin/lead`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                // ✅ send form data as key-value, not nested under "formData"
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (!response.ok) {
                Swal.fire({
                    icon: "error",
                    title: "Failed to Add Lead",
                    text: result.message || "Something went wrong.",
                });
                return;
            }

            Swal.fire({
                icon: "success",
                title: "Lead Created",
                text: "Lead has been added successfully!",
                showConfirmButton: false,
                timer: 1500,
            });

            // ✅ reset form
            setFormData({
                firstName: "",
                lastName: "",
                email: "",
                mobile: "",
                postalCode: "",
                childAge: "",
            });

            navigate('/one-to-one/central-leads')
        } catch (error) {
            console.error("Error creating lead:", error);
            Swal.fire({
                icon: "error",
                title: "Network Error",
                text: error.message || "An error occurred while submitting.",
            });
        }
    };


    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    return (
        <>
            <h2 onClick={() => navigate('/one-to-one/central-leads/')} className="flex gap-2 items-center font-bold text-[24px] mt-3">
                <img
                    src="/demo/synco/icons/arrow-left.png"
                    alt="Back"
                    className="w-5 h-5 md:w-6 md:h-6"
                />
                Add a New Lead
            </h2>

            <div className="bg-white p-6 rounded-xl mt-5">
                <h3 className="font-bold text-[20px] pb-4">Lead Information</h3>

                {/* Name Fields */}
                <div className="md:flex gap-6 mb-4">
                    <div className="md:w-1/2">
                        <label className="block text-[16px] font-semibold">First Name</label>
                        <input
                            name="firstName"
                            className="w-full mt-1 border border-gray-300 rounded-xl px-3 py-3"
                            value={formData.firstName}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="md:w-1/2">
                        <label className="block text-[16px] font-semibold">Last Name</label>
                        <input
                            name="lastName"
                            className="w-full mt-1 border border-gray-300 rounded-xl px-3 py-3"
                            value={formData.lastName}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>

                {/* Email + Phone */}
                <div className="md:flex gap-6 mb-4">
                    <div className="md:w-1/2">
                        <label className="block text-[16px] font-semibold">Email</label>
                        <input
                            type="email"
                            name="email"
                            className="w-full mt-1 border border-gray-300 rounded-xl px-3 py-3"
                            value={formData.email}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="md:w-1/2">
                        <label className="block text-[16px] font-semibold">Phone</label>
                        <div className="flex items-center border border-gray-300 rounded-xl px-3 py-3 mt-1">
                            <PhoneInput
                                country={country}
                                onChange={handlePhoneChange}
                                disableDropdown={false}
                                disableCountryCode={true}
                                countryCodeEditable={false}
                                inputStyle={{
                                    width: "0px",
                                    maxWidth: '20px',
                                    height: "0px",
                                    opacity: 0,
                                    pointerEvents: "none",
                                    position: "absolute",
                                }}
                                buttonClass="!bg-white !border-none !p-0"
                            />
                            <input
                                type="tel"
                                name="mobile"
                                value={formData.mobile}
                                onChange={handleInputChange}
                                placeholder="Enter number"
                                className="border-none focus:outline-none flex-1"
                            />
                        </div>
                    </div>
                </div>

                {/* Postal Code + Age */}
                <div className="md:flex gap-6 mb-3">
                    <div className="md:w-1/2">
                        <label className="block text-[16px] font-semibold">Postal Code</label>
                        <input
                            type="text"
                            name="postalCode"
                            value={formData.postalCode}
                            onChange={handleInputChange}
                            placeholder="Enter postal code"
                            className="w-full mt-1 border border-gray-300 rounded-xl px-3 py-3"
                        />
                    </div>
                    <div className="md:w-1/2">
                        <label className="block text-[16px] font-semibold">Age of Child</label>
                        <input
                            type="number"
                            name="childAge"
                            value={formData.childAge}
                            onChange={handleInputChange}
                            placeholder="Enter age"
                            className="w-full mt-1 border border-gray-300 rounded-xl px-3 py-3"
                        />
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        className="px-15 py-4 border border-gray-200 text-gray-500 rounded-xl  transition"
                        onClick={() => navigate('/one-to-one/central-leads')}
                    >
                        Cancel
                    </button>
                    <button
                        className="px-15 py-4 bg-[#237FEA] text-white rounded-xl hover:bg-[#1e6fd2] transition"
                        onClick={handleAddLead}
                    >
                        Add Lead
                    </button>
                </div>
            </div>

            <div className="bg-white my-10 rounded-3xl p-6 space-y-4">
                <h2 className="text-[24px] font-semibold">Comment</h2>

                <div className="flex items-center gap-2">
                    <img
                        src={adminInfo?.profile || "/demo/synco/members/dummyuser.png"}
                        alt="User"
                        className="w-14 h-14 rounded-full object-cover"
                    />
                    <input
                        type="text"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Add a comment"
                        className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-[16px] font-semibold outline-none"
                    />
                    <button
                        className="bg-[#237FEA] p-3 rounded-xl text-white hover:bg-blue-600"
                        onClick={handleSubmitComment}
                    >
                        <img src="/demo/synco/icons/sent.png" alt="Send" />
                    </button>
                </div>


                {commentsList.length > 0 ? (
                    <div className="space-y-4">
                        {currentComments.map((c, i) => (
                            <div key={i} className="bg-gray-50 rounded-xl p-4 text-sm">
                                <p className="text-gray-700 text-[16px] font-semibold mb-1">{c.comment}</p>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={
                                                c?.bookedByAdmin?.profile ||
                                                "/demo/synco/members/dummyuser.png"
                                            }
                                            alt={c?.bookedByAdmin?.firstName || "User"}
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                        <p className="font-semibold text-[#237FEA] text-[16px]">
                                            {c?.bookedByAdmin?.firstName}
                                        </p>
                                    </div>
                                    <span className="text-gray-400 text-[16px]">
                                        {formatTimeAgo(c.createdAt)}
                                    </span>
                                </div>
                            </div>
                        ))}

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
                                        className={`px-3 py-1 rounded-lg border ${currentPage === i + 1
                                            ? "bg-blue-500 text-white border-blue-500"
                                            : "border-gray-300 hover:bg-gray-100"
                                            }`}
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

export default CreateLead;
