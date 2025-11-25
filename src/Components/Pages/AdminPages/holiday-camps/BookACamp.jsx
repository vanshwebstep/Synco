import { useEffect, useState, useCallback } from "react";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { Search } from "lucide-react";
import { useNotification } from "../contexts/NotificationContext";
import { useMembers } from "../contexts/MemberContext";
import { ChevronDown, ChevronUp, X } from "lucide-react";

import Swal from "sweetalert2";
const BookACamp = () => {
    const [formData, setFormData] = useState({
        student: {},
        parent: [
            { firstName: "", lastName: "", email: "", phone: "", relation: "Mother" },
        ],
        emergency: {},
        general: {},
    });
    const [selectedKeyInfo, setSelectedKeyInfo] = useState(null);

    const [isOpen, setIsOpen] = useState(false);

    const { keyInfoData, fetchKeyInfo } = useMembers();
    function htmlToArray(html) {
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = html;

        const items = [];

        function traverse(node) {
            node.childNodes.forEach((child) => {
                if (child.nodeName === "LI") {
                    const text = child.textContent.trim();
                    if (text) items.push(text);
                } else if (child.nodeName === "OL" || child.nodeName === "UL") {
                    traverse(child);
                } else if (child.nodeType !== 3) {
                    traverse(child);
                }
            });
        }

        traverse(tempDiv);

        if (items.length === 0) {
            const plainText = tempDiv.textContent.trim();
            if (plainText) items.push(plainText);
        }

        return items;
    }

    const keyInfoArray = htmlToArray(keyInfoData?.keyInformation);
    const keyInfoOptions = keyInfoArray.map((item) => ({
        value: item,
        label: item,
    }));


    const selectedLabel =
        keyInfoOptions.find((opt) => opt.value === selectedKeyInfo)?.label ||
        "Key Information";
    const token = localStorage.getItem("adminToken");
    const { adminInfo } = useNotification();
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const [sameAsAbove, setSameAsAbove] = useState(false);
    const [showPayment, setShowPayment] = useState(false);

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

    const handleChange = (section, field, value, index = null) => {
        setFormData((prev) => {
            if (section === "parent") {
                const updatedParents = [...prev.parent];
                updatedParents[index][field] = value;
                return { ...prev, parent: updatedParents };
            }

            const updatedSection = { ...prev[section], [field]: value };


            if (section === "student" && field === "dob") {
                updatedSection.age = calculateAge(value);
            }

            return { ...prev, [section]: updatedSection };
        });
    };

    const [paymentData, setPaymentData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        billingAddress: "",
        cardNumber: "",
        expiryDate: "",
        securityCode: "",
    });

    const handlePaymentChange = (e) => {
        setPaymentData({ ...paymentData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Add payment processing logic here
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
    const handleSubmitComment = async (e) => {

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
                title: "Creating ",
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

    useEffect(() => {
        fetchComments();
    }, [])

    const addParent = () => {
        setFormData((prev) => ({
            ...prev,
            parent: [
                ...prev.parent,
                { firstName: "", lastName: "", email: "", phone: "", relation: "Other" },
            ],
        }));
    };

    const handleSameAsAbove = () => {
        setSameAsAbove((prev) => {
            const newValue = !prev;
            if (newValue) {
                // Copy first parent's data to emergency
                setFormData((prevData) => ({
                    ...prevData,
                    emergency: { ...prevData.parent[0] },
                }));
            } else {
                setFormData((prevData) => ({
                    ...prevData,
                    emergency: {},
                }));
            }
            return newValue;
        });
    };

    const calculateAge = (dob) => {
        if (!dob) return "";
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };


    const generalInputs = [
        { name: "Venue", placeholder: "Select Venue", type: "text", label: "Venue" },
        { name: "numberOfStudents", placeholder: "Choose number of students", type: "number", label: "Number of students" },
        { name: "holidayCamps", placeholder: "Choose holiday camp(s)", type: "select", label: "Select Camp(s)", options: ["", "Camp 1", "Camp 2"] },
        { name: "discount", placeholder: "Apply discount", type: "select", label: "Apply Discount", options: ["Select A Discount Code", "IVH4654G#22"] },
    ];

    const studentInputs = [
        { name: "firstName", placeholder: "Enter First Name", type: "text", label: "First Name" },
        { name: "lastName", placeholder: "Enter Last Name", type: "text", label: "Last Name" },
        { name: "dob", placeholder: "Date of Birth", type: "date", label: "Date Of Birth" },
        { name: "age", placeholder: "Automatic Entry", type: "text", label: "Age" },
        { name: "gender", placeholder: "Gender", type: "select", options: ["Male", "Female"], label: "Gender" },
        { name: "medical", placeholder: "Enter Medical Information", type: "text", label: "Medical Information" },
        { name: "class", placeholder: "Class", type: "select", options: ["4-7 Years", "5-9 Years"], label: "Class" },
        { name: "time", placeholder: "Automatic Entry", type: "text", label: "Time" },
    ];

    const parentInputs = [
        { name: "firstName", placeholder: "Enter First Name", type: "text", label: "First Name" },
        { name: "lastName", placeholder: "Enter Last Name", type: "text", label: "Last Name" },
        { name: "email", placeholder: "Enter Email", type: "email", label: "Email" },
        { name: "phone", placeholder: "Phone Number", type: "phone", label: "Phone Number" },
        { name: "relation", placeholder: "Relation", type: "select", options: ["Mother", "Father"], label: "Relation To Child" },
        { name: "referral", placeholder: "How did you hear about us?", type: "select", options: ["Friend", "Website", "Other"], label: "How Did You Hear About Us" },
    ];

    const emergencyInputs = [
        { name: "firstName", placeholder: "Enter First Name", type: "text", label: "First Name" },
        { name: "lastName", placeholder: "Enter Last Name", type: "text", label: "Last Name" },
        { name: "phone", placeholder: "Phone Number", type: "phone", label: "Phone Number" },
        { name: "relation", placeholder: "Relation", type: "select", options: ["Mother", "Father"], label: "Relation To Child" },
    ];

    const renderInputs = (inputs, section, index = null) => (
        <div className={`grid ${section === "general" ? "md:grid-cols-1" : "md:grid-cols-2"} gap-4`}>
            {inputs.map((input, idx) => (
                <div key={idx}>
                    <label className="block text-[16px] font-semibold">{input.label}</label>


                    {["text", "email", "number", "textarea"].includes(input.type) &&
                        (input.type === "textarea" ? (
                            <textarea
                                placeholder={input.placeholder}

                                value={
                                    section === "parent"
                                        ? formData.parent[index]?.[input.name] || ""
                                        : formData[section]?.[input.name] || ""
                                }
                                onChange={(e) => handleChange(section, input.name, e.target.value, index)}
                                className="w-full mt-2 border border-gray-300 rounded-xl px-4 py-3 text-base"
                            />
                        ) : (
                            <div
                                className={`flex items-center border border-gray-300 rounded-xl px-4 py-3 mt-2 ${input.name === "Venue" || input.name === "address" ? "gap-2" : ""
                                    }`}
                            >
                                {(input.name === "Venue" || input.name === "address") && (
                                    <Search className="w-5 h-5 text-gray-500 flex-shrink-0" />
                                )}
                                <input
                                    type={input.type}
                                    placeholder={input.placeholder}
                                    disabled={input.name == "age"}
                                    value={
                                        section === "parent"
                                            ? formData.parent[index]?.[input.name] || ""
                                            : formData[section]?.[input.name] || ""
                                    }
                                    onChange={(e) => handleChange(section, input.name, e.target.value, index)}
                                    className="w-full text-base border-none focus:outline-none bg-transparent"
                                />
                            </div>
                        ))}

                    {/* SELECT */}
                    {input.type === "select" && (
                        <Select
                            options={input.options.map((opt) => ({ value: opt, label: opt }))}
                            value={
                                section === "parent"
                                    ? formData.parent[index]?.[input.name]
                                        ? { value: formData.parent[index][input.name], label: formData.parent[index][input.name] }
                                        : null
                                    : formData[section]?.[input.name]
                                        ? { value: formData[section][input.name], label: formData[section][input.name] }
                                        : null
                            }
                            onChange={(selected) =>
                                handleChange(section, input.name, selected?.value || "", index)
                            }
                            className="mt-2"
                            styles={{
                                control: (base) => ({
                                    ...base,
                                    borderRadius: "12px",
                                    padding: "5px",
                                    borderColor: "#d1d5db",
                                }),
                            }}
                        />
                    )}


                    {input.type === "date" && (
                        <div className="mt-2">
                            <DatePicker
                                withPortal
                                selected={

                                    section === "parent"
                                        ? formData.parent[index]?.[input.name]
                                            ? new Date(formData.parent[index][input.name])
                                            : null
                                        : formData[section]?.[input.name]
                                            ? new Date(formData[section][input.name])
                                            : null
                                }
                                onChange={(date) => handleChange(section, input.name, date, index)}
                                className="w-full mt-2 border border-gray-300 rounded-xl px-4 py-3 text-base"
                                showYearDropdown
                                scrollableYearDropdown
                                yearDropdownItemNumber={100}
                                dateFormat="dd/MM/yyyy"
                                maxDate={new Date(new Date().setFullYear(new Date().getFullYear() - 3))} // Minimum age: 3 years
                                minDate={new Date(new Date().setFullYear(new Date().getFullYear() - 100))} // Max age: 100 years
                                placeholderText="Select date of birth"
                            />
                        </div>
                    )}


                    {input.type === "phone" && (
                        <div className="flex items-center border border-gray-300 rounded-xl px-4 py-3 mt-2">
                            <PhoneInput
                                country="us"
                                value={
                                    section === "parent"
                                        ? formData.parent[index]?.dialCode || ""
                                        : formData[section]?.dialCode || ""
                                }
                                onChange={(val, data) => {
                                    handleChange(section, "dialCode", val, index);
                                    handleChange(section, "country", data?.countryCode, index);
                                }}
                                disableDropdown={true}
                                disableCountryCode={true}
                                countryCodeEditable={false}
                                inputStyle={{ display: "none" }}
                                buttonClass="!bg-white !border-none !p-0"
                            />
                            <input
                                type="tel"
                                placeholder="Enter phone number"
                                value={
                                    section === "parent"
                                        ? formData.parent[index]?.[input.name] || ""
                                        : formData[section]?.[input.name] || ""
                                }
                                onChange={(e) => handleChange(section, input.name, e.target.value, index)}
                                className="border-none focus:outline-none flex-1"
                            />
                        </div>
                    )}
                </div>
            ))}
        </div>
    );

    return (
        <div className="md:p-6 min-h-screen">
            <div className="flex justify-between mb-5">
                <h2
                className="flex gap-2 items-center text-2xl font-bold"
                    onClick={() => {
                        navigate(`/`)
                    }}>
                    <img
                        src="/demo/synco/icons/arrow-left.png"
                        alt="Back"
                        className="w-5 h-5 md:w-6 md:h-6"
                    />
                    Book a Holiday Camp
                </h2>
                <ul className="flex gap-4 items-center">
                    <li className="max-w-[40px]"><img src="/demo/synco/images/icon1.png" alt="" /></li>
                    <li className="max-w-[40px]"><img src="/demo/synco/images/calendar-circle.png" alt="" /></li>
                    <li className="max-w-[40px]"><img src="/demo/synco/images/calendar-circle-2.png" alt="" /></li>
                </ul>
            </div>
            <div className="flex flex-col md:flex-row gap-6">

                <div className="md:w-[30%]">
                    <section className="bg-white rounded-2xl p-4">
                        <h3 className="text-xl font-bold text-[#282829] pb-4">Enter Information</h3>
                        {renderInputs(generalInputs, "general")}


                    </section>

                </div>

                <div className="md:w-[70%] space-y-5">
                    <section className="bg-white rounded-2xl p-4">
                        <h3 className="text-xl font-bold text-[#282829] pb-4">Student Information</h3>
                        {renderInputs(studentInputs, "student")}
                    </section>

                    <section className="bg-white rounded-2xl p-4">
                        <div className="flex justify-between items-center pb-4">
                            <h3 className="text-xl font-bold text-[#282829]">Parent Information</h3>
                            <button
                                type="button"
                                disabled={formData.parent.length == 3}
                                onClick={addParent}
                                className="bg-[#237FEA] text-sm px-4 py-2 rounded-xl text-white hover:bg-[#1e6fd2] transition"
                            >
                                + Add Parent
                            </button>
                        </div>
                        {formData.parent.map((_, index) => (
                            <div key={index} className="border border-gray-200 rounded-xl p-4 mb-4 ">
                                <h4 className="font-semibold text-gray-700 mb-3">Parent {index + 1}</h4>
                                {renderInputs(parentInputs, "parent", index)}
                            </div>
                        ))}
                    </section>

                    <section className="bg-white rounded-2xl p-4">
                        <div className="pb-4">
                            <h3 className="text-xl font-bold text-[#282829]">Emergency Contact Details</h3>
                            <div className="flex items-center gap-2 mt-3">
                                <input
                                    type="checkbox"
                                    checked={sameAsAbove}
                                    onChange={handleSameAsAbove}
                                    className="cursor-pointer w-4 h-4"
                                />
                                <label className="text-base font-semibold text-gray-700">
                                    Fill same as above
                                </label>
                            </div>
                        </div>
                        {renderInputs(emergencyInputs, "emergency")}
                    </section>

                    <div
                        onClick={() => setIsOpen(!isOpen)}
                        className="flex items-center justify-between text-[20px] p-3 border border-gray-200 rounded-xl cursor-pointer bg-white shadow-md hover:border-gray-400 transition"
                    >
                        <span
                            className={`${selectedKeyInfo ? "font-medium text-gray-900" : "text-gray-500"
                                }`}
                        >
                            {selectedLabel}
                        </span>
                        {isOpen ? (
                            <ChevronUp className="w-5 h-5 text-gray-500" />
                        ) : (
                            <ChevronDown className="w-5 h-5 text-gray-500" />
                        )}
                    </div>

                    <div className="flex justify-end gap-4 mt-6">
                        <button className="px-8 py-2 border border-[#717073] text-[#717073] rounded-md">Cancel</button>
                        <button onClick={() => setShowPayment(true)} className="bg-[#237FEA] text-sm px-8 py-2 rounded-md text-white hover:bg-[#1e6fd2] transition">
                            Make Payment
                        </button>
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
                </div>
            </div>

            {showPayment && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-5">
                    <div className="bg-white rounded-2xl max-h-[90vh] overflow-auto w-full max-w-lg p-6 relative shadow-lg">

                        <button
                            onClick={() => setShowPayment(null)}
                            className="absolute top-7 left-6 text-gray-400 hover:text-gray-600"
                        >
                            <X />
                        </button>

                        <h2 className="text-center text-lg font-semibold mb-4 border-b border-[#E2E1E5] pb-4">Payment</h2>


                        <div
                            className="bg-blue-500 text-white rounded-xl p-4 mb-6 text-left font-medium"
                            style={{ backgroundImage: "url('/demo/synco/frames/holidayCamp.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}
                        >
                            <p>Holiday Camp (1 Student)</p>
                            <p className="text-2xl font-bold">£39.99</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">

                            <div>
                                <h3 className="text-[#282829] font-semibold text-[20px] mb-2">Personal Details</h3>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="flex flex-col">
                                        <label htmlFor="firstName" className="text-[#282829] text-[16px] font-semibold">First Name</label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            id="firstName"
                                            value={paymentData.firstName}
                                            onChange={handlePaymentChange}
                                            className="w-full mt-2 border border-gray-300 rounded-xl px-4 py-2 text-base"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <label htmlFor="lastName" className="text-[#282829] text-[16px] font-semibold">Last Name</label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            id="lastName"
                                            value={paymentData.lastName}
                                            onChange={handlePaymentChange}
                                            className="w-full mt-2 border border-gray-300 rounded-xl px-4 py-2 text-base"
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col mt-2">
                                    <label htmlFor="email" className="text-[#282829] text-[16px] font-semibold mb-1">Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        id="email"
                                        value={paymentData.email}
                                        onChange={handlePaymentChange}
                                        className="w-full border border-gray-300 rounded-xl px-4 py-2 text-base"
                                    />
                                </div>

                                <div className="flex flex-col mt-2">
                                    <label htmlFor="billingAddress" className="text-[#282829] text-[16px] font-semibold mb-1">Billing Address</label>
                                    <input
                                        type="text"
                                        name="billingAddress"
                                        id="billingAddress"
                                        value={paymentData.billingAddress}
                                        onChange={handlePaymentChange}
                                        className="w-full border border-gray-300 rounded-xl px-4 py-2 text-base"
                                    />
                                </div>
                            </div>

                            {/* Bank Details */}
                            <div>
                                <h3 className="[text-[#282829] font-semibold text-[20px] mb-2">Bank Details</h3>
                                <div className="flex flex-col">
                                    <label htmlFor="cardNumber" className="text-[#282829] text-[16px] font-semibold mb-1">Card Number</label>
                                    <input
                                        type="text"
                                        name="cardNumber"
                                        id="cardNumber"
                                        value={paymentData.cardNumber}
                                        onChange={handlePaymentChange}
                                        className="w-full border border-gray-300 rounded-xl px-4 py-2 text-base"
                                    />
                                </div>

                                <div className="grid grid-cols-1 gap-2 mt-2">
                                    <div className="flex flex-col">
                                        <label htmlFor="expiryDate" className="text-[#282829] text-[16px] font-semibold mb-1">Expiry Date</label>
                                        <input
                                            type="text"
                                            name="expiryDate"
                                            id="expiryDate"
                                            value={paymentData.expiryDate}
                                            onChange={handlePaymentChange}
                                            className="w-full border border-gray-300 rounded-xl px-4 py-2 text-base"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <label htmlFor="securityCode" className="text-[#282829] text-[16px] font-semibold mb-1">Security Code</label>
                                        <input
                                            type="text"
                                            name="securityCode"
                                            id="securityCode"
                                            value={paymentData.securityCode}
                                            onChange={handlePaymentChange}
                                            className="w-full border border-gray-300 rounded-xl px-4 py-2 text-base"
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-blue-500 text-white rounded-lg py-2 mt-4 hover:bg-blue-600 transition"
                            >
                                Make Payment
                            </button>
                        </form>

                    </div>
                </div>
            )}

        </div>
    );
};

export default BookACamp;
