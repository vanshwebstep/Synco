// src/components/StudentProfile.jsx

import React, { useEffect, useRef, useState } from 'react';

import { motion } from "framer-motion";
import { X } from "lucide-react";
import DatePicker from "react-datepicker";
import Select from "react-select";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { useBookFreeTrial } from '../../../../../contexts/BookAFreeTrialContext';
import Loader from '../../../../../contexts/Loader';
import { usePermission } from '../../../../../Common/permission';
import List from '../../Book a Membership/list';
import Swal from "sweetalert2"; // make sure it's installed
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaSave } from "react-icons/fa";

const StudentProfile = ({ StudentProfile }) => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const [selectedDate, setSelectedDate] = useState(null);
    const navigate = useNavigate();

    const [editingIndex, setEditingIndex] = useState(null);
    const { loading, cancelFreeTrial, sendCancelFreeTrialmail, rebookFreeTrialsubmit, noMembershipSubmit, updateBookFreeTrialsFamily } = useBookFreeTrial() || {};


    const [showRebookTrial, setshowRebookTrial] = useState(false);
    const [showCancelTrial, setshowCancelTrial] = useState(false);
    const [noMembershipSelect, setNoMembershipSelect] = useState(false);

    const [selectedTime, setSelectedTime] = useState(null);
    const [additionalNote, setAdditionalNote] = useState("");

    const [reason, setReason] = useState("");
    const reasonOptions = [
        { value: "Family emergency - cannot attend", label: "Family emergency - cannot attend" },
        { value: "Health issue", label: "Health issue" },
        { value: "Schedule conflict", label: "Schedule conflict" },
    ];

    const handleCancel = () => {
         console.log("Payload:", formData);
        cancelFreeTrial(formData);
    };
     console.log('editingIndex', editingIndex)
    const formatDate = (dateString, withTime = false) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        const options = {
            year: "numeric",
            month: "short",
            day: "2-digit",
        };
        if (withTime) {
            return (
                date.toLocaleDateString("en-US", options) +
                ", " +
                date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
            );
        }
        return date.toLocaleDateString("en-US", options);
    };

    const {
        id,
        bookingId,
        trialDate,
        bookedBy,
        status,
        createdAt,
        venueId,
        classSchedule,
        paymentPlans,
    } = StudentProfile;

    const [students, setStudents] = useState(StudentProfile?.students || []);


    const [cancelWaitingList, setCancelWaitingList] = useState({
        bookingId: id,
        noMembershipReason: "",           // corresponds to DatePicker
        noMembershipNotes: "",        // textarea
    });
    const [rebookFreeTrial, setRebookFreeTrial] = useState({
        bookingId: id || null,
        trialDate: "",
        reasonForNonAttendance: "",
        additionalNote: "",
    });

     console.log('parents', StudentProfile)
    const parents = StudentProfile.parents;
    const [formData, setFormData] = useState({
        bookingId: id,
        cancelReason: "",
        additionalNote: "",
    });
    const studentCount = students?.length || 0;
    const matchedPlan = paymentPlans?.find(plan => plan.students === studentCount);
    const emergency = StudentProfile.emergency;
     console.log('matchedPlan', matchedPlan)

    const { checkPermission } = usePermission();

    const canCancelTrial =
        checkPermission({ module: 'cancel-free-trial', action: 'create' })
    const canRebooking =
        checkPermission({ module: 'rebooking', action: 'create' })
    if (loading) return <Loader />;
    const handleDateChange = (date) => {
        setSelectedDate(date);
        setRebookFreeTrial((prev) => ({
            ...prev,
            trialDate: date ? date.toISOString().split("T")[0] : "",
        }));
    };


      const handleDOBChange = (index, date) => {
        const today = new Date();
        let ageNow = today.getFullYear() - date.getFullYear();
        const m = today.getMonth() - date.getMonth();

        if (m < 0 || (m === 0 && today.getDate() < date.getDate())) {
            ageNow--;
        }

        const updatedStudents = [...students];
        updatedStudents[index].dateOfBirth = date;
        updatedStudents[index].age = ageNow;
        setStudents(updatedStudents);
    };
    

    const handleReasonChange = (selectedOption) => {
        setReason(selectedOption);
        setRebookFreeTrial((prev) => ({
            ...prev,
            reasonForNonAttendance: selectedOption ? selectedOption.value : "",
        }));
    };

    const handleNoteChange = (e) => {
        setAdditionalNote(e.target.value);
        setRebookFreeTrial((prev) => ({
            ...prev,
            additionalNote: e.target.value,
        }));
    };
    const handleInputChange = (e, stateSetter) => {
        const { name, value } = e.target;
        stateSetter((prev) => ({ ...prev, [name]: value }));
    };

    const handleStudentDataChange = (index, field, value) => {
        const updatedStudents = [...students];
        updatedStudents[index] = {
            ...updatedStudents[index],
            [field]: value,
        };
        setStudents(updatedStudents);
    };

    const toggleEditStudent = (index) => {
        if (editingIndex === index) {
            // ✅ Save Mode
            setEditingIndex(null);

            const payload = students.map((student, sIndex) => ({
                id: student.id ?? sIndex + 1,
                studentFirstName: student.studentFirstName,
                studentLastName: student.studentLastName,
                dateOfBirth: student.dateOfBirth,
                age: student.age,
                gender: student.gender,
                medicalInformation: student.medicalInformation,
                parents: parents.map((p, pIndex) => ({
                    id: p.id ?? pIndex + 1,
                    ...p,
                })),
                emergencyContacts: emergency.map((e, eIndex) => ({
                    id: e.id ?? eIndex + 1,
                    ...e,
                })),
            }));

            updateBookFreeTrialsFamily(StudentProfile.id, payload);
             console.log("Parent Payload to send:", payload);
        } else {
            // ✏️ Edit Mode
            setEditingIndex(index);
        }
    };

    const handleSelectChange = (selected, field, stateSetter) => {
        stateSetter((prev) => ({ ...prev, [field]: selected?.value || null }));
    };
    const formatStatus = (status) => {
        if (!status) return "-";
        return status
            .split("_")           // split by underscore
            .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // capitalize first letter
            .join(" ");           // join with space
    };
    const handleBookMembership = () => {
        Swal.fire({
            title: "Are you sure?",
            text: "Do you want to book a membership?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#237FEA",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Book it!",
            cancelButtonText: "Cancel",
        }).then((result) => {
            if (result.isConfirmed) {
                // Navigate to your component/route
                navigate("/configuration/weekly-classes/find-a-class/book-a-membership", {
                    state: { TrialData: StudentProfile },
                });
            }
        });
    };
     console.log('students', students)
    return (
        <>
            <div className="md:flex w-full gap-4">
                <div className="transition-all duration-300 flex-1 ">
                    <div className="space-y-6">
                        {students?.map((student, index) => (
                            <div
                                key={student.id || index}
                                className="bg-white p-6 mb-10 rounded-3xl shadow-sm space-y-6 relative"
                            >
                                {/* Header + Pencil/Save */}
                                <div className="flex justify-between items-start">
                                    <h2 className="text-[20px] font-semibold">Student Information</h2>
                                    <button
                                        onClick={() => toggleEditStudent(index)}
                                        className="text-gray-600 hover:text-blue-600"
                                    >
                                        {editingIndex === index ? <FaSave /> : <FaEdit />}
                                    </button>
                                </div>

                                {/* Row 1: First / Last Name */}
                                <div className="flex gap-4">
                                    <div className="w-1/2">
                                        <label className="block text-[16px] font-semibold">First name</label>
                                        <input
                                            type="text"
                                            className="w-full mt-2 border border-gray-300 rounded-xl px-4 py-3 text-base"
                                            value={student.studentFirstName || ""}
                                            readOnly={editingIndex !== index}
                                            onChange={(e) =>
                                                handleStudentDataChange(index, "studentFirstName", e.target.value)
                                            }
                                        />
                                    </div>
                                    <div className="w-1/2">
                                        <label className="block text-[16px] font-semibold">Last name</label>
                                        <input
                                            type="text"
                                            className="w-full mt-2 border border-gray-300 rounded-xl px-4 py-3 text-base"
                                            value={student.studentLastName || ""}
                                            readOnly={editingIndex !== index}
                                            onChange={(e) =>
                                                handleStudentDataChange(index, "studentLastName", e.target.value)
                                            }
                                        />
                                    </div>
                                </div>

                                {/* Row 2: DOB / Age */}
                                <div className="flex gap-4">
                                    <div className="w-1/2">
                                        <label className="block text-[16px] font-semibold">Date of Birth</label>
                                        <DatePicker
                                            withPortal
                                            selected={student.dateOfBirth}
                                            onChange={(date) => handleDOBChange(index, date)}
                                            className="w-full mt-2 border border-gray-300 rounded-xl px-4 py-3 text-base"
                                            showYearDropdown
                                            scrollableYearDropdown
                                            yearDropdownItemNumber={100}
                                            dateFormat="dd/MM/yyyy"
                                            maxDate={new Date(new Date().setFullYear(new Date().getFullYear() - 3))} // Minimum age: 3 years
                                            minDate={new Date(new Date().setFullYear(new Date().getFullYear() - 100))} // Maximum age: 100 years
                                            placeholderText="Select date of birth"
                                            isClearable
                                        />
                                    </div>
                                    <div className="w-1/2">
                                        <label className="block text-[16px] font-semibold">Age</label>
                                        <input
                                            type="number"
                                            className="w-full mt-2 border border-gray-300 rounded-xl px-4 py-3 text-base"
                                            value={student.age || ""}
                                            readOnly
                                            onChange={(e) =>
                                                handleStudentDataChange(index, "age", e.target.value)
                                            }
                                        />
                                    </div>
                                </div>

                                {/* Row 3: Gender / Medical Info */}
                                <div className="flex gap-4">
                                    <div className="w-1/2">
                                        <label className="block text-[16px] font-semibold">Gender</label>
                                        <input
                                            type="text"
                                            className="w-full mt-2 border border-gray-300 rounded-xl px-4 py-3 text-base"
                                            value={student.gender || ""}
                                            readOnly={editingIndex !== index}
                                            onChange={(e) =>
                                                handleStudentDataChange(index, "gender", e.target.value)
                                            }
                                        />
                                    </div>
                                    <div className="w-1/2">
                                        <label className="block text-[16px] font-semibold">
                                            Medical Information
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full mt-2 border border-gray-300 rounded-xl px-4 py-3 text-base"
                                            value={student.medicalInformation || ""}
                                            readOnly={editingIndex !== index}
                                            onChange={(e) =>
                                                handleStudentDataChange(index, "medicalInformation", e.target.value)
                                            }
                                        />
                                    </div>
                                </div>

                                {/* Row 4: Class / Time */}
                                <div className="flex gap-4">
                                    <div className="w-1/2">
                                        <label className="block text-[16px] font-semibold">Class</label>
                                        <input
                                            type="text"
                                            className="w-full mt-2 border border-gray-300 rounded-xl px-4 py-3 text-base"
                                            value={classSchedule.className}
                                            readOnly
                                        />
                                    </div>
                                    <div className="w-1/2">
                                        <label className="block text-[16px] font-semibold">Time</label>
                                        <input
                                            type="text"
                                            className="w-full mt-2 border border-gray-300 rounded-xl px-4 py-3 text-base"
                                            value={classSchedule?.startTime || ""}
                                            readOnly
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}


                    </div>


                    <div className="bg-white rounded-3xl p-6 mt-10 space-y-4">
                        <h2 className="text-[24px] font-semibold">Comment</h2>

                        {/* Input section */}
                        <div className="flex items-center gap-2">
                            <img
                                src="https://i.pravatar.cc/40?img=3" // Replace with actual user image
                                alt="User"
                                className="w-14 h-14 rounded-full object-cover"
                            />
                            <input
                                type="text"
                                placeholder="Add a comment"
                                className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-[16px] font-semibold outline-none"
                            />
                            <button className="bg-[#237FEA] p-3 rounded-xl text-white hover:bg-[#237FEA]">
                                <img src="/demo/synco/icons/sent.png" alt="" />
                            </button>
                        </div>

                        {/* Comment list */}
                        <div className="space-y-4">
                            {[
                                {
                                    name: "Ethan",
                                    time: "8 min ago",
                                    comment: "Not 100% sure she can attend but if she cant she will email us.",
                                    avatar: "https://i.pravatar.cc/40?img=3",
                                },
                                {
                                    name: "Nilio Bagga",
                                    time: "8 min ago",
                                    comment:
                                        "Not 100% sure she can attend but if she cant she will email us. Not 100% sure she can attend but if she cant she will email us.",
                                    avatar: "https://i.pravatar.cc/40?img=12",
                                },
                            ].map((c, i) => (
                                <div
                                    key={i}
                                    className="bg-gray-50 rounded-xl p-4   text-sm"
                                >
                                    <p className="text-gray-700 text-[16px] font-semibold mb-1">{c.comment}</p>
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={c.avatar}
                                                alt={c.name}
                                                className="w-10 h-10 rounded-full object-cover mt-1"
                                            />
                                            <div>

                                                <p className="font-semibold text-[#237FEA] text-[16px]">{c.name}</p>
                                            </div>
                                        </div>
                                        <span className=" text-gray-400 text-[16px] whitespace-nowrap mt-1">
                                            {c.time}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="md:min-w-[508px] bg-white max-h-fit rounded-full md:max-w-[508px] text-base space-y-5">
                    {/* Card Wrapper */}
                    <div className="rounded-3xl bg-[#2E2F3E] overflow-hidden shadow-md border border-gray-200">
                        {/* Header */}
                        <div className="] m-2 px-6 rounded-3xl py-3 flex items-center justify-between bg-no-repeat bg-center"
                            style={{
                                backgroundImage: status === "cancelled"
                                    ? "url('/demo/synco/frames/Cancelled.png')"
                                    : status === "frozen"
                                        ? "url('/demo/synco/frames/Frozen.png')"
                                        : status === "active"
                                            ? "url('/demo/synco/frames/Active.png')"
                                            : status === "waiting list"
                                                ? "url('/demo/synco/frames/Waiting.png')"
                                                : "url('/demo/synco/frames/Pending.png')",


                                backgroundSize: "contain",
                            }}>
                            <div>
                                <div className="text-[20px] font-bold text-[#1F2937]">Account Status</div>
                                <div className="text-[16px] font-semibold text-[#1F2937]">Trials</div>
                            </div>
                            <div className="bg-[#343A40] flex items-center gap-2  text-white text-[14px] px-3 py-2 rounded-xl">
                                <div className="flex items-center gap-2">
                                    {status === 'pending' && (
                                        <img src="/demo/synco/icons/loadingWhite.png" alt="Pending" />
                                    )}
                                    {status === 'not attend' && (
                                        <img src="/demo/synco/icons/x-circle-contained.png" alt="Not Attended" />
                                    )}
                                    {status === 'attended' && (
                                        <img src="/demo/synco/icons/attendedicon.png" alt="Attended" />
                                    )}
                                    {status === 'cancelled' && (
                                        <img src="/demo/synco/icons/x-circle-contained.png" alt="Cancelled" />
                                    )}

                                    {/* Fallback for any other or undefined status */}
                                    {!status && (
                                        <>
                                            <img src="/demo/synco/icons/x-circle-contained.png" alt="Not Attended" />
                                            Not Attended
                                        </>
                                    )}

                                    {/* Status text */}
                                    <span className="capitalize">
                                        {formatStatus(status)}
                                    </span>
                                </div>

                            </div>
                        </div>

                        <div className="bg-[#2E2F3E] text-white px-6 py-6 space-y-6">
                            {/* Avatar & Account Holder */}
                            <div className="flex items-center gap-4">
                                <img
                                    src={
                                        (status === 'pending' || status === 'attended') && bookedBy?.profile
                                            ? `${API_BASE_URL}/${bookedBy.profile}`
                                            : "https://cdn-icons-png.flaticon.com/512/147/147144.png"
                                    }
                                    alt="avatar"
                                    className="w-18 h-18 rounded-full"
                                    onError={(e) => {
                                        e.currentTarget.src = "https://cdn-icons-png.flaticon.com/512/147/147144.png"; // fallback if image fails to load
                                    }}
                                />
                                <div>
                                    <div className="text-[24px] font-semibold leading-tight">
                                        {status === 'pending' || status === 'attended'
                                            ? 'Booked By'
                                            : 'Account Holder'}
                                    </div>
                                    <div className="text-[16px] text-gray-300">
                                        {status === 'pending' || status === 'attended'
                                            ? `${bookedBy.firstName} ${bookedBy.lastName}`
                                            : ``}
                                    </div>
                                </div>
                            </div>

                            {/* Details */}
                            <div className="space-y-4">
                                <div>
                                    <div className="text-[20px] font-bold tracking-wide">Venue</div>
                                    <div className="inline-block bg-[#007BFF] text-white text-[14px] px-3 py-1 rounded-md mt-1">
                                        {classSchedule?.venue?.name || "-"}
                                    </div>
                                </div>

                                <div className="border-t border-[#495362] py-5">

                                    <>
                                        <div className="text-[20px] text-white">Students</div>
                                        <div className="text-[16px] mt-1 text-gray-400">{students?.length || 0}</div>
                                    </>


                                </div>

                                <div className="border-t border-[#495362] py-5">
                                    {status === 'pending' || status === 'attended' ? (
                                        <>
                                            <div className=" text-[20px] text-white">Booking Date</div>
                                            <div className="text-[16px]  mt-1 text-gray-400"> {formatDate(createdAt, true)}</div>

                                        </>
                                    ) : (
                                        <>

                                            <div className=" text-[20px] text-white">Date of Booking</div>
                                            <div className="text-[16px]  mt-1 text-gray-400"> {formatDate(createdAt, true)}</div>
                                        </>
                                    )}

                                </div>

                                <div className="border-t border-[#495362] py-5">
                                    <div className=" text-[20px] text-white">Date of Trial</div>
                                    <div className="text-[16px]  mt-1 text-gray-400">{formatDate(trialDate)}</div>
                                </div>

                                <>
                                    <div className="border-t border-[#495362] py-5">
                                        <div className=" text-[20px] text-white">Booking Source</div>
                                        <div className="text-[16px]  mt-1 text-gray-400"> {bookedBy?.firstName} {bookedBy?.lastName}</div>
                                    </div>
                                </>

                            </div>
                        </div>



                    </div>
                    {status !== 'cancelled' && (
                        <>
                            <div className="bg-white rounded-3xl p-6  space-y-4">

                                {/* Top Row: Email + Text */}
                                <div className="flex gap-7">

                                    <button onClick={() => sendCancelFreeTrialmail([id])} className="flex-1 border border-[#717073] rounded-xl py-3 flex text-[18px] items-center justify-center hover:shadow-md transition-shadow duration-300 gap-2 text-[#717073] font-medium">
                                        <img src="/demo/synco/icons/mail.png" alt="" /> Send Email
                                    </button>

                                    <button className="flex-1 border border-[#717073] rounded-xl py-3 flex  text-[18px] items-center justify-center gap-2 hover:shadow-md transition-shadow duration-300 text-[#717073] font-medium">
                                        <img src="/demo/synco/icons/sendText.png" alt="" /> Send Text
                                    </button>
                                </div>


                                {status?.trim().toLowerCase() !== "pending" &&
                                    status?.trim().toLowerCase() !== "attended" &&
                                    status?.trim().toLowerCase() !== "no_membersip" &&
                                    status?.trim().toLowerCase() !== "rebooked" &&
                                    canRebooking && (
                                        <button
                                            onClick={() => setshowRebookTrial(true)}
                                            className="w-full bg-[#237FEA] text-white rounded-xl py-3 text-[18px] font-medium hover:bg-blue-700 hover:shadow-md transition-shadow duration-300"
                                        >
                                            Rebook FREE Trial
                                        </button>
                                    )}

                                {status !== 'attended' && canCancelTrial && (
                                    <button
                                        onClick={() => setshowCancelTrial(true)}
                                        className="w-full border border-gray-300 text-[#717073] text-[18px] rounded-xl py-3 hover:shadow-md transition-shadow duration-300 font-medium"
                                    >
                                        Cancel Trial
                                    </button>
                                )}

                                {status !== 'pending' && status !== 'attended' && (
                                    <button
                                        onClick={handleBookMembership}
                                        className="w-full border border-gray-300 text-[#717073] text-[18px] rounded-xl py-3 hover:shadow-md transition-shadow duration-300 font-medium"
                                    >
                                        Book a Membership
                                    </button>
                                )}

                                {status === 'attended' && (
                                    <div className="flex gap-7">
                                        <button onClick={() => setNoMembershipSelect(true)} className="flex-1 border bg-[#FF6C6C] border-[#FF6C6C] rounded-xl py-3 flex text-[18px] items-center justify-center hover:shadow-md transition-shadow duration-300 gap-2 text-white font-medium">
                                            No Membership
                                        </button>

                                        <button onClick={handleBookMembership} className="flex-1 border bg-[#237FEA] border-[#237FEA] rounded-xl py-3 flex text-[18px] items-center justify-center gap-2 hover:shadow-md transition-shadow duration-300 text-white font-medium">
                                            Book a Membership
                                        </button>
                                    </div>
                                )}


                            </div>
                        </>
                    )}
                    {status == 'cancelled' && (<button
                        onClick={() => setshowRebookTrial(true)}
                        className="w-full bg-[#237FEA] text-white rounded-xl py-3 text-[18px] font-medium hover:bg-blue-700 hover:shadow-md transition-shadow duration-300"
                    >
                        Rebook FREE Trial
                    </button>)}
                </div>
                {showRebookTrial && (
                    <div className="fixed inset-0 bg-[#00000066] flex justify-center items-center z-50">
                        <div className="bg-white rounded-2xl w-[541px] max-h-[90%] overflow-y-auto relative scrollbar-hide">
                            <button
                                className="absolute top-4 left-4 p-2"
                                onClick={() => setshowRebookTrial(false)}
                            >
                                <img src="/demo/synco/icons/cross.png" alt="Close" />
                            </button>

                            <div className="text-center py-6 border-b border-gray-300">
                                <h2 className="font-semibold text-[24px]">Rebook Free Trial</h2>
                            </div>

                            <div className="space-y-4 px-6 pb-6 pt-4">
                                {/* Venue */}
                                <div>
                                    <label className="block text-[16px] font-semibold">Venue</label>
                                    <input
                                        type="text"
                                        className="w-full mt-2 border border-gray-300 rounded-xl px-4 py-3 text-base"
                                        placeholder="Select Venue"
                                        value={classSchedule?.venue?.name || "-"}
                                        readOnly
                                    />
                                </div>

                                {/* Class */}
                                <div>
                                    <label className="block text-[16px] font-semibold">Class</label>
                                    <input
                                        type="text"
                                        className="w-full mt-2 border border-gray-300 rounded-xl px-4 py-3 text-base"
                                        placeholder="Select Class"
                                        value={classSchedule?.className || "-"}
                                        readOnly
                                    />
                                </div>

                                {/* Date */}
                                <div>
                                    <label className="block text-[16px] font-semibold">Date</label>
                                    <DatePicker
                                        withPortal
                                        selected={selectedDate}
                                        onChange={handleDateChange}
                                        dateFormat="EEEE, dd MMMM yyyy"
                                        placeholderText="Select a date"
                                        className="w-full mt-2 border border-gray-300 rounded-xl px-4 py-3 text-base"
                                    />
                                </div>

                                {/* Time */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-[16px] font-semibold">Time</label>
                                        <DatePicker
                                            withPortal
                                            selected={selectedTime}
                                            onChange={setSelectedTime}
                                            showTimeSelect
                                            showTimeSelectOnly
                                            timeIntervals={60}
                                            timeCaption="Time"
                                            dateFormat="h:mm aa"
                                            placeholderText="Select Time"
                                            className="w-full mt-2 border border-gray-300 rounded-xl px-4 py-3 text-base"
                                        />
                                    </div>

                                    {/* Reason */}
                                    <div>
                                        <label className="block text-[16px] font-semibold">
                                            Reason for Non-Attendance
                                        </label>
                                        <Select
                                            value={reason}
                                            onChange={handleReasonChange}
                                            options={reasonOptions}
                                            placeholder="Select Reason"
                                            className="rounded-lg mt-2"
                                            styles={{
                                                control: (base) => ({
                                                    ...base,
                                                    borderRadius: "0.7rem",
                                                    boxShadow: "none",
                                                    padding: "4px 8px",
                                                    minHeight: "48px",
                                                }),
                                                placeholder: (base) => ({ ...base, fontWeight: 600 }),
                                                dropdownIndicator: (base) => ({ ...base, color: "#9CA3AF" }),
                                                indicatorSeparator: () => ({ display: "none" }),
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Additional Notes */}
                                <div>
                                    <label className="block text-[16px] font-semibold">Additional Notes (Optional)</label>
                                    <textarea
                                        className="w-full mt-2 border border-gray-300 rounded-xl px-4 py-3 text-base"
                                        rows={3}
                                        placeholder="Add any notes here..."
                                        value={additionalNote}
                                        onChange={handleNoteChange}
                                    />
                                </div>

                                {/* Buttons */}
                                <div className="flex gap-4 pt-4">
                                    <button
                                        className="flex-1 border border-gray-400 rounded-xl py-3 text-[18px] font-medium hover:shadow-md transition-shadow"
                                        onClick={() => setshowRebookTrial(false)}
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        className="flex-1 bg-[#237FEA] text-white rounded-xl py-3 text-[18px] font-medium hover:shadow-md transition-shadow"
                                        onClick={() => rebookFreeTrialsubmit(rebookFreeTrial)}
                                    >
                                        Rebook Trial
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                )}
                {showCancelTrial && (
                    <div className="fixed inset-0 bg-[#00000066] flex justify-center items-center z-50">
                        <div className="bg-white rounded-2xl w-[541px] max-h-[90%] overflow-y-auto relative scrollbar-hide">
                            <button
                                className="absolute top-4 left-4 p-2"
                                onClick={() => setshowCancelTrial(false)}
                            >
                                <img src="/demo/synco/icons/cross.png" alt="Close" />
                            </button>

                            <div className="text-center py-6 border-b border-gray-300">
                                <h2 className="font-semibold text-[24px]">Cancel Free Trial</h2>
                            </div>

                            <div className="space-y-4 px-6 pb-6 pt-4">
                                {/* Reason */}
                                <div>
                                    <label className="block text-[16px] font-semibold">
                                        Reason for Cancellation
                                    </label>
                                    <Select
                                        value={reasonOptions.find((opt) => opt.value === formData.cancelReason)}
                                        onChange={(selected) =>
                                            setFormData((prev) => ({ ...prev, cancelReason: selected.value }))
                                        }
                                        options={reasonOptions}
                                        placeholder=""
                                        className="rounded-lg mt-2"
                                        styles={{
                                            control: (base) => ({
                                                ...base,
                                                borderRadius: "0.7rem",
                                                boxShadow: "none",
                                                padding: "4px 8px",
                                                minHeight: "48px",
                                            }),
                                            placeholder: (base) => ({ ...base, fontWeight: 600 }),
                                            dropdownIndicator: (base) => ({ ...base, color: "#9CA3AF" }),
                                            indicatorSeparator: () => ({ display: "none" }),
                                        }}
                                    />
                                </div>

                                {/* Notes */}
                                <div>
                                    <label className="block text-[16px] font-semibold">
                                        Additional Notes (Optional)
                                    </label>
                                    <textarea
                                        className="w-full bg-gray-100 mt-2 border border-gray-300 rounded-xl px-4 py-3 text-base"
                                        rows={3}
                                        value={formData.additionalNote}
                                        onChange={(e) =>
                                            setFormData((prev) => ({ ...prev, additionalNote: e.target.value }))
                                        }
                                        placeholder=""
                                    />
                                </div>

                                {/* Buttons */}
                                <div className="flex justify-end gap-4 pt-4">
                                    <button
                                        onClick={handleCancel}
                                        className="w-1/2 bg-[#FF6C6C] text-white rounded-xl py-3 text-[18px] font-medium hover:shadow-md transition-shadow"
                                    >
                                        Cancel Trial
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                )}
                {noMembershipSelect && (
                    <div className="fixed inset-0 bg-[#00000066] flex justify-center items-center z-50">
                        <div className="bg-white rounded-2xl w-[541px] max-h-[90%] overflow-y-auto relative scrollbar-hide">
                            <button
                                className="absolute top-4 left-4 p-2"
                                onClick={() => setNoMembershipSelect(false)}
                            >
                                <img src="/demo/synco/icons/cross.png" alt="Close" />
                            </button>

                            <div className="text-center py-6 border-b border-gray-300">
                                <h2 className="font-semibold text-[24px]">No Membership Selected  </h2>
                            </div>

                            <div className="space-y-4 px-6 pb-6 pt-4">
                                <div>
                                    <label className="block text-[16px] font-semibold">
                                        Reason for Not Proceeding
                                    </label>
                                    <Select
                                        value={reasonOptions.find((opt) => opt.value === cancelWaitingList.noMembershipReason)}
                                        onChange={(selected) => handleSelectChange(selected, "noMembershipReason", setCancelWaitingList)}
                                        options={reasonOptions}
                                        placeholder=""
                                        className="rounded-lg mt-2"
                                        styles={{
                                            control: (base) => ({
                                                ...base,
                                                borderRadius: "0.7rem",
                                                boxShadow: "none",
                                                padding: "6px 8px",
                                                minHeight: "48px",
                                            }),
                                            placeholder: (base) => ({ ...base, fontWeight: 600 }),
                                            dropdownIndicator: (base) => ({ ...base, color: "#9CA3AF" }),
                                            indicatorSeparator: () => ({ display: "none" }),
                                        }}
                                    />
                                </div>

                                {/* Notes */}
                                <div>
                                    <label className="block text-[16px] font-semibold">
                                        Additional Notes (Optional)
                                    </label>
                                    <textarea
                                        className="w-full bg-gray-100  mt-2 border border-gray-300 rounded-xl px-4 py-3 text-base"
                                        rows={6}
                                        name="noMembershipNotes"    // <-- MUST match state key
                                        value={cancelWaitingList.noMembershipNotes}
                                        onChange={(e) => handleInputChange(e, setCancelWaitingList)}
                                        placeholder=""
                                    />
                                </div>

                                {/* Buttons */}
                                <div className="flex justify-end gap-4 pt-4">
                                    <button
                                        onClick={() => noMembershipSubmit(cancelWaitingList, 'allMembers')}

                                        className="w-1/2  bg-[#FF6C6C] text-white rounded-xl py-3 text-[18px] font-medium hover:shadow-md transition-shadow"
                                    >
                                        Cancel Spot on Waiting List
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                )}
            </div >
        </>
    );
};

export default StudentProfile;
