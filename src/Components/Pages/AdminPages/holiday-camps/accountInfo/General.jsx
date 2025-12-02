import { useEffect, useState, useCallback } from "react";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { Search } from "lucide-react";
import { useNotification } from "../../contexts/NotificationContext";
import { Mail, MessageSquare } from "lucide-react";
import { useAccountsInfo } from "../../contexts/AccountsInfoContext";
import Swal from "sweetalert2";
import { useLocation } from "react-router-dom";
const General = () => {
    const { data } = useAccountsInfo();
    const [bookingId, setBookingId] = useState([]);

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get("id"); // 
    const [loading, setLoading] = useState([]);
    useEffect(() => {
        if (data?.id) {
            setBookingId(prev => [...prev, data?.id]);
        }
    }, [data]);

    const [formData, setFormData] = useState({
        student:
            data?.students?.length > 0
                ? data.students.map((student) => ({
                    firstName: student?.studentFirstName || "",
                    lastName: student?.studentLastName || "",
                    dob: student?.dateOfBirth ? new Date(student.dateOfBirth) : null,
                    age: student?.age || "",
                    medical: student?.medicalInformation || "",
                    ability: student?.ability || "",
                }))
                : [
                    {
                        firstName: "",
                        lastName: "",
                        dob: null,
                        age: "",
                        medical: "",
                        ability: "",
                    },
                ],

        parent:
            data?.parents?.length > 0
                ? data.parents.map((p) => ({
                    firstName: p?.parentFirstName || "",
                    lastName: p?.parentLastName || "",
                    email: p?.parentEmail || "",
                    phone: p?.parentPhoneNumber || "",
                    referral: p?.howDidYouHear || "",
                }))
                : [
                    {
                        firstName: "",
                        lastName: "",
                        email: "",
                        phone: "",
                        referral: "",
                    },
                ],
    });

    const token = localStorage.getItem("adminToken");
    const { adminInfo } = useNotification();
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


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

    const handleChange = (section, name, value, index = null) => {
        setFormData((prev) => {
            if (section === "parent" && index !== null) {
                const updatedParents = [...prev.parent];
                updatedParents[index] = { ...updatedParents[index], [name]: value };
                return { ...prev, parent: updatedParents };
            }
            return {
                ...prev,
                [section]: { ...prev[section], [name]: value },
            };
        });
    };

    const fetchComments = useCallback(async () => {
        const token = localStorage.getItem("adminToken");
        if (!token) return;

        try {
            const response = await fetch(`${API_BASE_URL}/api/admin/holiday/booking/comment/list`, {
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


            const response = await fetch(`${API_BASE_URL}/api/admin/holiday/booking/comment/create`, requestOptions);

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


    const sendEmail = async () => {
        setLoading(true);
        const token = localStorage.getItem("adminToken");

        const headers = {
            "Content-Type": "application/json",
        };
        // console.log('bookingIds', bookingIds)
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }
        try {
            const response = await fetch(`${API_BASE_URL}/api/admin/holiday/booking/send-email`, {
                method: "POST",
                headers,
                body: JSON.stringify({
                    bookingIds: [id], // make sure bookingIds is an array like [96, 97]
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Failed to send Email");
            }

            await Swal.fire({
                title: "Success!",
                text: result.message || "Mail has been Sent successfully.",
                icon: "success",
                confirmButtonText: "OK",
            });

            return result;

        } catch (error) {
            console.error("Error sending Mail:", error);
            await Swal.fire({
                title: "Error",
                text: error.message || "Something went wrong while sending Mail.",
                icon: "error",
                confirmButtonText: "OK",
            });
            throw error;
        } finally {
            // await fetchOneToOneMembers(data.id);
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchComments();
    }, [])

    const studentInputs = [
        { name: "firstName", placeholder: "Enter First Name", type: "text", label: "First Name" },
        { name: "lastName", placeholder: "Enter Last Name", type: "text", label: "Last Name" },
        { name: "dob", placeholder: "Date of Birth", type: "date", label: "Date Of Birth" },
        { name: "age", placeholder: "Automatic Entry", type: "text", label: "Age" },
        { name: "medical", placeholder: "Enter Medical Information", type: "text", label: "Medical Information" },
        // { name: "ability", placeholder: "", type: "select", options: ["Select Ability Level"], label: "Ability Levels" },
    ];

    const parentInputs = [
        { name: "firstName", placeholder: "Enter First Name", type: "text", label: "First Name" },
        { name: "lastName", placeholder: "Enter Last Name", type: "text", label: "Last Name" },
        { name: "email", placeholder: "Enter Email", type: "email", label: "Email" },
        { name: "phone", placeholder: "Phone Number", type: "phone", label: "Phone Number" },
        { name: "referral", placeholder: "How did you hear about us?", type: "select", options: ["Friend", "Website", "Other"], label: "How Did You Hear About Us" },
    ];

    const renderInputs = (inputs, section, index = null) => {
        const getValue = (inputName) => {
            if (section === "parent") {
                return formData.parent?.[index]?.[inputName] || "";
            }
            if (section === "student") {
                return formData.student?.[index]?.[inputName] || "";
            }
            return formData[section]?.[inputName] || "";
        };

        const setValue = (inputName, value) => {
            handleChange(section, inputName, value, index);
        };

        return (
            <div
                className={`grid ${section === "general" ? "md:grid-cols-1" : "md:grid-cols-2"
                    } gap-4`}
            >
                {inputs.map((input, idx) => (
                    <div key={idx}>
                        <label className="block text-[16px] font-semibold">
                            {input.label}
                        </label>

                        {/* TEXTAREA */}
                        {input.type === "textarea" && (
                            <textarea
                                readOnly
                                placeholder={input.placeholder}
                                value={getValue(input.name)}
                                onChange={(e) => setValue(input.name, e.target.value)}
                                className="w-full mt-2 border border-gray-300 rounded-xl px-4 py-3 text-base"
                            />
                        )}

                        {/* TEXT / EMAIL / NUMBER */}
                        {["text", "email", "number"].includes(input.type) && (
                            <div
                                className={`flex items-center border border-gray-300 rounded-xl px-4 py-3 mt-2 ${input.name === "location" || input.name === "address"
                                    ? "gap-2"
                                    : ""
                                    }`}
                            >
                                {(input.name === "location" || input.name === "address") && (
                                    <Search className="w-5 h-5 text-gray-500 flex-shrink-0" />
                                )}

                                <input
                                    readOnly
                                    type={input.type}
                                    placeholder={input.placeholder}
                                    disabled={input.name === "age"}
                                    value={getValue(input.name)}
                                    onChange={(e) => setValue(input.name, e.target.value)}
                                    className="w-full text-base border-none focus:outline-none bg-transparent"
                                />
                            </div>
                        )}

                        {/* SELECT */}
                        {input.type === "select" && (
                            <Select
                                isDisabled
                                options={input.options.map((opt) => ({
                                    value: opt,
                                    label: opt,
                                }))}
                                value={
                                    getValue(input.name)
                                        ? { value: getValue(input.name), label: getValue(input.name) }
                                        : null
                                }
                                onChange={(selected) =>
                                    setValue(input.name, selected?.value || "")
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

                        {/* DATE */}
                        {input.type === "date" && (
                            <div className="">
                                <DatePicker
                                    withPortal
                                    selected={
                                        getValue(input.name)
                                            ? new Date(getValue(input.name))
                                            : null
                                    }
                                    onChange={(date) => setValue(input.name, date)}
                                    className="w-full mt-2 border border-gray-300 rounded-xl px-4 py-3 text-base"
                                    showYearDropdown
                                    disabled
                                    scrollableYearDropdown
                                    yearDropdownItemNumber={100}
                                    dateFormat="dd/MM/yyyy"
                                    maxDate={
                                        new Date(
                                            new Date().setFullYear(
                                                new Date().getFullYear() - 3
                                            )
                                        )
                                    }
                                    minDate={
                                        new Date(
                                            new Date().setFullYear(
                                                new Date().getFullYear() - 100
                                            )
                                        )
                                    }
                                    placeholderText="Select date of birth"
                                />
                            </div>
                        )}

                        {/* PHONE */}
                        {input.type === "phone" && (
                            <div className="flex items-center border border-gray-300 rounded-xl px-4 py-3 mt-2">
                                <PhoneInput
                                    country={"us"}
                                    value={getValue("dialCode")}
                                    onChange={(val, data) => {
                                        setValue("dialCode", val);
                                        setValue("country", data?.countryCode);
                                    }}
                                    disabled
                                    disableDropdown
                                    disableCountryCode
                                    countryCodeEditable={false}
                                    inputStyle={{ display: "none" }}
                                    buttonClass="!bg-white !border-none !p-0"
                                />

                                <input
                                    readOnly
                                    type="tel"
                                    placeholder="Enter phone number"
                                    value={getValue(input.name)}
                                    onChange={(e) => setValue(input.name, e.target.value)}
                                    className="border-none focus:outline-none flex-1"
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        );
    };


    return (
        <>
            <div className="flex">
                <div className="md:w-[66%] pe-4">
                    {formData.student.map((_, index) => (
                        <section className="bg-white rounded-2xl p-4 mt-2">
                            <h3 className="text-xl font-bold text-[#282829] pb-4">Student Information</h3>
                            {renderInputs(studentInputs, "student", index)}
                        </section>
                    ))}
                    {formData.parent.map((_, index) => (
                        <section className="bg-white rounded-2xl p-4 mt-5">
                            <div className="flex justify-between items-center pb-4">
                                <h3 className="text-xl font-bold text-[#282829]">Parent Information {index + 1}</h3>

                            </div>
                            <div key={index} className="rounded-xl p-4 mb-4 ">
                                {renderInputs(parentInputs, "parent", index)}
                            </div>
                        </section>
                    ))}

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
                                                    <p className="font-semibold text-[#237FEA] text-[16px]">{c?.bookedByAdmin?.firstName} {c?.bookedByAdmin?.lastName}</p>
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
                <div className="md:w-[34%]">
                    <div className="md:max-w-[510px]">

                        <div className="bg-[#363E49] text-white rounded-4xl p-6 space-y-3">

                            {/* Status */}
                            <div
                                className="text-white rounded-2xl p-4 relative overflow-hidden"
                                style={{
                                    backgroundImage: "url('/demo/synco/frames/Active.png')",
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                }}
                            >
                                <p className="text-[20px] text-black font-bold relative z-10">Status</p>
                                <p className="text-sm text-black relative z-10 capitalize">
                                    {data?.status || data?.booking?.payment?.paymentStatus || "N/A"}
                                </p>
                            </div>

                            {/* Coach */}
                            <div className="border-b border-[#495362] pb-3 flex items-center gap-5">
                                <div>
                                    <img src="/demo/synco/members/user2.png" alt="Coach" className="w-20 rounded-full object-cover" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold">Booked In By</h3>
                                    <p className="text-gray-300 text-sm">
                                        {data?.bookedByAdmin
                                            ? `${data.bookedByAdmin?.firstName} ${data.bookedByAdmin?.lastName}`
                                            : "N/A"}
                                    </p>
                                </div>
                            </div>

                            {/* Venue */}
                            <div className="border-b border-[#495362] pb-3">
                                <p className="text-white text-[18px] font-semibold">Venue</p>
                                <span className="inline-block bg-blue-500 text-white text-xs px-2 py-1 rounded-md mt-1">
                                    {data?.holidayVenue?.name || "N/A"}
                                </span>
                            </div>


                            <div className="border-b border-[#495362] pb-3">
                                <p className="text-white text-[18px] font-semibold">No. Of Students</p>
                                <p className="text-[16px] mt-1 text-[#BDC0C3]">
                                    {data?.totalStudents || "N/A"}
                                </p>
                            </div>

                            {/* Date of Class */}
                            <div className="border-b border-[#495362] pb-3">
                                <p className="text-white text-[18px] font-semibold">Days</p>
                                <p className="text-[16px] mt-1 text-[#BDC0C3]">
                                    {data?.holidayCamp?.holidayCampDates[0]?.totalDays}
                                </p>
                            </div>

                            {/* Package */}
                            <div className="border-b border-[#495362] pb-3">
                                <p className="text-white text-[18px] font-semibold">Discounts</p>
                                <p className="text-[16px] mt-1 text-[#BDC0C3]">
                                    {data?.payment?.discount_amount || "N/A"}
                                </p>
                            </div>
                            {/* Price */}
                            <div className="border-b border-[#495362] pb-3">
                                <p className="text-white text-[18px] font-semibold">Price</p>
                                <p className="text-[16px] mt-1 text-[#BDC0C3] font-semibold">
                                    £
                                    {data?.payment?.amount || "0.00"}
                                </p>
                            </div>

                            {/* Source */}
                            <div className=" ">
                                <p className="text-white text-[18px] font-semibold">Source</p>
                                <p className="text-[16px] mt-1 text-[#BDC0C3]">
                                    {data?.marketingChannel || "N/A"}
                                </p>
                            </div>


                        </div>


                        {/* Action Buttons */}
                        <div className="p-6 flex flex-col bg-white rounded-3xl mt-5 items-center space-y-3">
                            <div className="flex w-full justify-between gap-2">
                                <button onClick={() => {
                                    if (bookingId) {
                                        sendEmail();
                                    } else {
                                        Swal.fire({
                                            icon: "warning",
                                            title: "No Students Selected",
                                            text: "Please select at least one Lead before sending an email.",
                                            confirmButtonText: "OK",
                                        });
                                    }
                                }} className="flex-1 flex items-center gap-2 justify-center border border-[#717073] text-[#717073] rounded-xl font-semibold py-3 text-[18px] text-[18px]  hover:bg-gray-50 transition">
                                    <Mail className="w-4 h-4 mr-1" /> Send Email
                                </button>
                                <button className="flex-1 flex items-center gap-2 justify-center border border-[#717073] rounded-xl font-semibold py-3 text-[18px] text-[#717073]  hover:bg-gray-50 transition">
                                    <MessageSquare className="w-4 h-4 mr-1" /> Send Text
                                </button>
                            </div>

                            <button className="w-full bg-[#FF6C6C] text-white my-3 text-[18px] py-3 rounded-xl  font-medium hover:bg-red-600 transition flex items-center justify-center">
                                Cancel Camp
                            </button>


                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default General
