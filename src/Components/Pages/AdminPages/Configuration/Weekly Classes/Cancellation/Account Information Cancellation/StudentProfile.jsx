// src/components/StudentProfile.jsx

import React, { useEffect, useRef, useState } from 'react';

import { motion } from "framer-motion";
import { X } from "lucide-react";
import DatePicker from "react-datepicker";
import Select from "react-select";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { useBookFreeTrial } from '../../../../contexts/BookAFreeTrialContext';
import Loader from '../../../../contexts/Loader';
import { usePermission } from '../../../../Common/permission';
import { addDays } from "date-fns";
const StudentProfile = ({ StudentProfile }) => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const [selectedDate, setSelectedDate] = useState(null);

    const { loading, cancelFreeTrial, sendCancelFreeTrialmail, rebookFreeTrialsubmit, reactivateDataSubmit, addtoWaitingListSubmit, freezerMembershipSubmit } = useBookFreeTrial() || {};
    const [addToWaitingList, setaddToWaitingList] = useState(false);
    const [freezeMembership, setFreezeMembership] = useState(false);
    const [reactivateMembership, setReactivateMembership] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const [showRebookTrial, setshowRebookTrial] = useState(false);
    const [showCancelTrial, setshowCancelTrial] = useState(false);
    const [selectedTime, setSelectedTime] = useState(null);
    const [additionalNote, setAdditionalNote] = useState("");

    const [reason, setReason] = useState("");
    const reasonOptions = [
        { value: "Family emergency - cannot attend", label: "Family emergency - cannot attend" },
        { value: "Health issue", label: "Health issue" },
        { value: "Schedule conflict", label: "Schedule conflict" },
    ];
    const cancelType = [
        { value: "immediate", label: "Cancel Immediately" },
    ];
    const handleCancel = () => {
        console.log("Payload:", formData);
        cancelFreeTrial(formData);
    };

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
        startDate,
        students,
        venueId,
        classSchedule,
        paymentPlan,
        paymentPlans,
    } = StudentProfile;

    const [rebookFreeTrial, setRebookFreeTrial] = useState({
        bookingId: id || null,
        trialDate: "",
        reasonForNonAttendance: "",
        additionalNote: "",
    });

    const [waitingListData, setWaitingListData] = useState({
        bookingId: id,
        classScheduleId: null,
        venueId: classSchedule?.venue?.id || null,
        preferredStartDate: null,
        notes: "",
    });
    const [cancelData, setCancelData] = useState({
        bookingId: id,
        cancellationType: "",      // corresponds to selected radio
        cancelReason: "",          // corresponds to Select value
        cancelDate: null,          // corresponds to DatePicker
        additionalNote: "",        // textarea
    });
    const [cancelWaitingList, setCancelWaitingList] = useState({
        bookingId: id,
        reasonForCancelling: "",           // corresponds to DatePicker
        additionalNote: "",        // textarea
    });
    const [transferData, setTransferData] = useState({
        bookingId: id || null,
        venueId: classSchedule?.venue?.id || null,
        transferReasonClass: "", // optional notes
        classScheduleId: null,        // selected new class
    });
    const [freezeData, setFreezeData] = useState({
        bookingId: id || null,
        freezeStartDate: null,
        freezeDurationMonths: null,
        reactivateOn: null, // optional if you want to capture explicitly
        reasonForFreezing: "",
    });
    const [reactivateData, setReactivateData] = useState({
        bookingId: id || null,
        reactivateOn: null,
        additionalNote: "",
    });
    console.log('parents', StudentProfile)
    const studentsList = StudentProfile?.students || [];
    const parents = StudentProfile.parents || [];
    const [formData, setFormData] = useState({
        bookingId: id,
        cancelReason: "",
        additionalNote: "",
    });
    const studentCount = students?.length || 0;
    const matchedPlan = paymentPlans?.find(plan => plan.students === studentCount);
    const emergency = StudentProfile.emergency || [];
    console.log('matchedPlan', matchedPlan)

    const { checkPermission } = usePermission();

    const canCancelTrial =
        checkPermission({ module: 'cancel-free-trial', action: 'create' })
    const canRebooking =
        checkPermission({ module: 'rebooking', action: 'create' })
    if (loading) return <Loader />;

    const handleInputChange = (e, stateSetter) => {
        const { name, value } = e.target;
        stateSetter((prev) => ({ ...prev, [name]: value }));
    };
    const handleSelectChange = (selected, field, stateSetter) => {
        stateSetter((prev) => ({ ...prev, [field]: selected?.value || null }));
    };
    const handleRadioChange = (value, field, stateSetter) => {
        stateSetter((prev) => ({ ...prev, [field]: value }));
    };


    // Unified handler for DatePicker
    const handleDateChange = (date, field, stateSetter) => {
        if (!date) {
            stateSetter((prev) => ({ ...prev, [field]: null }));
            return;
        }
        const formatted = date.toLocaleDateString("en-CA"); // gives YYYY-MM-DD without timezone shift
        stateSetter((prev) => ({ ...prev, [field]: formatted }));
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

    const newClasses = StudentProfile?.newClasses?.map((cls) => ({
        value: cls.id,
        label: `${cls.className} - ${cls.day} (${cls.startTime} - ${cls.endTime})`,
    }));

    const selectedClass = newClasses?.find(
        (cls) => cls.value === waitingListData?.classScheduleId
    );
    const getStatusBgColor = (status) => {
        switch (status) {
            case "active": return "bg-[#43BE4F]";
            case "frozen": return "bg-[#509EF9]";
            case "canceled": return "bg-[#FC5D5D]";
            case "waiting list": return "bg-[#A4A5A6]";
            default: return "bg-[#A4A5A6]";
        }
    };

    const monthOptions = [
        { value: 1, label: "1 Month" },
        { value: 2, label: "2 Months" },
        { value: 3, label: "3 Months" },
        { value: 4, label: "4 Months" },
        { value: 5, label: "5 Months" },
        { value: 6, label: "6 Months" },
        { value: 12, label: "12 Months" },
    ];
    return (
        <>
            <div className="md:flex w-full gap-4">
                <div className="transition-all duration-300 flex-1 ">
                    <div className="space-y-6">
                        {studentsList?.map((student, index) => (
                            <div
                                key={student.studentFirstName || index}
                                className="bg-white p-6 mb-10 rounded-3xl shadow-sm space-y-6 relative"
                            >
                                {/* Top Header Row */}
                                <div className="flex justify-between items-start">
                                    <h2 className="text-[20px] font-semibold">Student information</h2>

                                </div>

                                {/* Row 1 */}
                                <div className="flex gap-4">
                                    <div className="w-1/2">
                                        <label className="block text-[16px] font-semibold">First name</label>
                                        <input
                                            className="w-full mt-2 border border-gray-300 rounded-xl px-4 py-3 text-base"
                                            placeholder="Enter first name"
                                            value={student.studentFirstName}
                                            readOnly
                                        />
                                    </div>
                                    <div className="w-1/2">
                                        <label className="block text-[16px] font-semibold">Last name</label>
                                        <input
                                            className="w-full mt-2 border border-gray-300 rounded-xl px-4 py-3 text-base"
                                            placeholder="Enter last name"
                                            value={student.studentLastName}
                                            readOnly
                                        />
                                    </div>
                                </div>

                                {/* Row 2 */}
                                <div className="flex gap-4">


                                    <div className="w-1/2">
                                        <label className="block text-[16px] font-semibold">Age</label>
                                        <input
                                            type="email"
                                            className="w-full mt-2 border border-gray-300 rounded-xl px-4 py-3 text-base"
                                            placeholder="Enter email address"
                                            value={student.age}
                                            readOnly
                                        />
                                    </div>
                                    <div className="w-1/2">
                                        <label className="block text-[16px] font-semibold">Date of Birth</label>
                                        <input
                                            className="w-full mt-2 border border-gray-300 rounded-xl px-4 py-3 text-base"
                                            value={student.dateOfBirth}
                                            readOnly
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-4">


                                    <div className="w-1/2">
                                        <label className="block text-[16px] font-semibold">Medical information</label>
                                        <input
                                            type="email"
                                            className="w-full mt-2 border border-gray-300 rounded-xl px-4 py-3 text-base"
                                            placeholder="Enter email address"
                                            value={student.medicalInformation}
                                            readOnly
                                        />
                                    </div>
                                    <div className="w-1/2">
                                        <label className="block text-[16px] font-semibold">Ability Level </label>
                                        <select
                                            name="abilityLevel"
                                            id="abilityLevel"
                                            className="w-full mt-2 text-gray-500 border  border-gray-300 rounded-xl px-4 py-3 text-base"
                                            defaultValue=""
                                        >
                                            <option className="" value="" disabled>
                                                Select Ability level
                                            </option>
                                            <option value="beginner">Beginner</option>
                                            <option value="intermediate">Intermediate</option>
                                            <option value="advanced">Advanced</option>
                                        </select>

                                    </div>
                                </div>

                            </div>
                        ))}
                    </div>
               
                    {/* {emergency?.map((emergency, index) => (
                        <div className="bg-white p-6 rounded-3xl shadow-sm space-y-6">

                            <h2 className="text-[20px] font-semibold">Emergency contact details</h2>

                            <div className="flex items-center gap-2">
                                <input type="checkbox" checked={emergency.sameAsAbove} readOnly disabled />
                                <label className="text-base font-semibold text-gray-700">Fill same as above</label>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-1/2">
                                    <label className="block text-[16px] font-semibold">First name</label>
                                    <input
                                        className="w-full mt-2 border border-gray-300 rounded-xl px-4 py-3 text-base"
                                        value={emergency.emergencyFirstName}
                                        readOnly
                                    />
                                </div>
                                <div className="w-1/2">
                                    <label className="block text-[16px] font-semibold">Last name</label>
                                    <input
                                        className="w-full mt-2 border border-gray-300 rounded-xl px-4 py-3 text-base"
                                        value={emergency.emergencyLastName}
                                        readOnly
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-1/2">
                                    <label className="block text-[16px] font-semibold">Phone number</label>
                                    <input
                                        className="w-full mt-2 border border-gray-300 rounded-xl px-4 py-3 text-base"
                                        value={emergency.emergencyPhoneNumber}
                                        readOnly
                                    />
                                </div>
                                <div className="w-1/2">
                                    <label className="block text-[16px] font-semibold">Relation to child</label>
                                    <input
                                        className="w-full mt-2 border border-gray-300 rounded-xl px-4 py-3 text-base"
                                        value={emergency.emergencyRelation}
                                        readOnly
                                    />
                                </div>
                            </div>

                        </div>
                    ))} */}
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
                        <div
                            className="m-2 px-6 rounded-3xl py-3 flex items-center justify-between bg-no-repeat bg-center"
                            style={{
                                backgroundImage: status === "cancelled"
                                    ? "url('/demo/synco/frames/Cancelled.png')"
                                    : status === "frozen"
                                        ? "url('/demo/synco/frames/Frozen.png')"
                                        : status === "active"
                                            ? "url('/demo/synco/frames/Active.png')"
                                            : status === "request_to_cancel"
                                                ? "url('/demo/synco/frames/reqCancel.png')"
                                                : status === "waiting list"
                                                    ? "url('/demo/synco/frames/Waiting.png')"
                                                    : "url('/demo/synco/frames/Pending.png')",


                                backgroundSize: "contain",
                            }}
                        >
                            <div>
                                <div className="text-[20px] font-bold text-[#1F2937]">Account Status</div>
                                <div className="text-[16px] font-semibold text-[#1F2937] capitalize">
                                    {status ? status.replaceAll("_", " ") : "Unknown"}
                                </div>
                            </div>
                        </div>


                        {parents.map((parent, index) => (
                            <div className="bg-[#2E2F3E] text-white px-6 py-6 space-y-6">
                                {/* Avatar & Account Holder */}
                                <div className="flex items-center gap-4">
                                    <img
                                        src={
                                            (status === 'request_to_cancel' || status === 'cancelled') && bookedBy?.profile
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
                                            {status === 'request_to_cancel' || status === 'cancelled'
                                                ? 'Booked By'
                                                : 'Account Holder'}
                                        </div>
                                        <div className="text-[16px] text-gray-300">
                                            {status === 'request_to_cancel' || status === 'cancelled'
                                                ? `${bookedBy.firstName} ${bookedBy.lastName}`
                                                : `${parent.parentFirstName} / ${parent.relationToChild}`}
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
                                        {status === 'request_to_cancel' || status === 'cancelled' ? (
                                            <>
                                                <div className="text-[20px] text-white">Membership Plan</div>

                                                {paymentPlan && (
                                                    <div className="text-[16px] mt-1 text-gray-400">
                                                        {paymentPlan.title}
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <>
                                                <div className="text-[20px] text-white">Students</div>
                                                <div className="text-[16px] mt-1 text-gray-400">{students?.length || 0}</div>
                                            </>
                                        )}

                                    </div>

                                    {status === 'request_to_cancel' || status === 'cancelled' ? (
                                        <>
                                            <div className="border-t border-[#495362] py-5">
                                                <div className=" text-[20px] text-white">Price</div>
                                                <div className="text-[16px]  mt-1 text-gray-400"> £{paymentPlan?.price} </div>
                                            </div>

                                        </>
                                    ) : (
                                        <>
                                            <div className="border-t border-[#495362] py-5">
                                                <div className=" text-[20px] text-white">Booking Source</div>
                                                <div className="text-[16px]  mt-1 text-gray-400"> {bookedBy?.firstName} {bookedBy?.lastName}</div>
                                            </div>
                                        </>
                                    )}
                                    <div className="border-t border-[#495362] py-5">
                                        {status === 'request_to_cancel' || status === 'cancelled' ? (
                                            <>
                                                <div className=" text-[20px] text-white">Membership Start Date </div>
                                                <div className="text-[16px]  mt-1 text-gray-400"> {formatDate(startDate, true)}</div>

                                            </>
                                        ) : (
                                            <>

                                                <div className=" text-[20px] text-white">Date of Booking</div>
                                                <div className="text-[16px]  mt-1 text-gray-400"> {formatDate(createdAt, true)}</div>
                                            </>
                                        )}

                                    </div>

                                    <div className="border-t border-[#495362] py-5">
                                        <div className=" text-[20px] text-white">Request to Cancel Date </div>
                                        <div className="text-[16px]  mt-1 text-gray-400">{formatDate(trialDate)}</div>
                                    </div>

                                    <div className="border-t border-[#495362] py-5">
                                        <div className=" text-[20px] text-white">ID </div>
                                        <div className="text-[16px]  mt-1 text-gray-400">{bookingId}</div>
                                    </div>
                                    {status === 'request_to_cancel' ? (
                                        <div className="border-t border-[#495362] py-5">
                                            <div className=" text-[20px] text-white">Membership Tenure </div>
                                            <div className="text-[16px]  mt-1 text-gray-400">11 Months (static)</div>
                                        </div>
                                    ) : (
                                        <>

                                            <div className=" text-[20px] text-white">Lifecycle</div>
                                            <div className="text-[16px] mt-1 text-gray-400">
                                                {paymentPlan?.duration} {paymentPlan?.interval}{paymentPlan?.duration > 1 ? "s" : ""}
                                            </div>
                                        </>
                                    )}
                                    <div className="border-t border-[#495362] py-5">
                                        <div className=" text-[20px] text-white">Request Cancellation Reason  </div>
                                        <div className="text-[16px]  mt-1 text-gray-400">{'cancelReason'}</div>
                                    </div>
                                </div>
                            </div>
                        ))}


                    </div>
                    {status !== 'casdsncelled' && (
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
                                {status !== 'cancelled' && (
                                    <>
                                        {status !== 'cancelled' && (
                                            <>
                                                <div className="bg-white rounded-3xl   space-y-4">

                                                    {/* Top Row: Email + Text */}

                                                    {(status === "frozen" || status === "cancelled") && canRebooking && (
                                                        <button
                                                            onClick={() => setReactivateMembership(true)}
                                                            className="w-full bg-[#237FEA] text-white rounded-xl py-3 text-[18px] font-medium hover:bg-blue-700 hover:shadow-md transition-shadow duration-300"
                                                        >
                                                            Reactivate Membership
                                                        </button>
                                                    )}

                                                    {(status === "active" || status === "frozen" || status === "cancelled" || status === "request_to_cancel") && (
                                                        <button
                                                            onClick={() => setaddToWaitingList(true)}
                                                            className={`w-full rounded-xl py-3 text-[18px] font-medium transition-shadow duration-300 
            ${addToWaitingList
                                                                    ? "bg-[#237FEA] text-white shadow-md"   // Active state
                                                                    : "bg-white  border border-gray-300  hover:bg-blue-700 text-[#717073] hover:text-white hover:shadow-md"
                                                                }`}
                                                        >
                                                            Add to the waiting list
                                                        </button>
                                                    )}


                                                    {(status === "active" || status === "request_to_cancel") && canCancelTrial && (
                                                        <button
                                                            onClick={() => setFreezeMembership(true)}
                                                            className="w-full border border-gray-300 text-[#717073] text-[18px] rounded-xl py-3 hover:shadow-md transition-shadow duration-300 font-medium"
                                                        >
                                                            Freeze Membership
                                                        </button>
                                                    )}
                                                    {(status === "active" || status === "request_to_cancel") && canCancelTrial && (
                                                        <button
                                                            onClick={() => setTransferVenue(true)}
                                                            className="w-full border border-gray-300 text-[#717073] text-[18px] rounded-xl py-3 hover:shadow-md transition-shadow duration-300 font-medium"
                                                        >
                                                            Transfer Class
                                                        </button>
                                                    )}
                                                    {status == 'waiting list' && canCancelTrial && (
                                                        <button
                                                            onClick={() => setRemoveWaiting(true)}
                                                            className="w-full border border-gray-300 text-[#717073] text-[18px] rounded-xl py-3 hover:shadow-md transition-shadow duration-300 font-medium"
                                                        >
                                                            Remove Waiting List
                                                        </button>
                                                    )}
                                                    {(status === "active" || status === "frozen" || status === "request_to_cancel") && canCancelTrial && (
                                                        <button
                                                            onClick={() => setshowCancelTrial(true)}
                                                            className={`w-full border text-[18px] rounded-xl py-3 font-medium transition-shadow duration-300
    ${showCancelTrial
                                                                    ? "bg-[#FF6C6C] text-white shadow-md border-transparent"
                                                                    : "border-gray-300 text-[#717073] hover:bg-[#FF6C6C] hover:text-white hover:shadow-md"
                                                                }`}
                                                        >
                                                            Cancel Membership
                                                        </button>

                                                    )}

                                                    {/* {status !== 'pending' && status !== 'attended' && (
                                    <button className="w-full border border-gray-300 text-[#717073] text-[18px] rounded-xl py-3 hover:shadow-md transition-shadow duration-300 font-medium">
                                        Book a Membership
                                    </button>
                                )} */}

                                                    {status === 'attended' && (
                                                        <div className="flex gap-7">
                                                            <button className="flex-1 border bg-[#FF6C6C] border-[#FF6C6C] rounded-xl py-3 flex text-[18px] items-center justify-center hover:shadow-md transition-shadow duration-300 gap-2 text-white font-medium">
                                                                No Membership
                                                            </button>

                                                            <button className="flex-1 border bg-[#237FEA] border-[#237FEA] rounded-xl py-3 flex text-[18px] items-center justify-center gap-2 hover:shadow-md transition-shadow duration-300 text-white font-medium">
                                                                Book a Membership
                                                            </button>
                                                        </div>
                                                    )}


                                                </div>
                                            </>
                                        )}




                                    </>
                                )}
                                {status === 'cancelled' && (
                                    <div className="flex gap-7">
                                        <button className="flex-1 border bg-[#FF6C6C] border-[#FF6C6C] rounded-xl py-3 flex text-[18px] items-center justify-center hover:shadow-md transition-shadow duration-300 gap-2 text-white font-medium">
                                            No Membership
                                        </button>

                                        <button className="flex-1 border bg-[#237FEA] border-[#237FEA] rounded-xl py-3 flex text-[18px] items-center justify-center gap-2 hover:shadow-md transition-shadow duration-300 text-white font-medium">
                                            Book a Membership
                                        </button>
                                    </div>
                                )}

                            </div>
                        </>
                    )}
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
                                        selected={selectedDate}
                                        onChange={handleDateChange}
                                        dateFormat="EEEE, dd MMMM yyyy"
                                        placeholderText="Select a date"
                                        className="w-full mt-2 border border-gray-300 rounded-xl px-4 py-3 text-base"
                                        withPortal
                                    />
                                </div>

                                {/* Time */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-[16px] font-semibold">Time</label>
                                        <DatePicker
                                            selected={selectedTime}
                                            onChange={setSelectedTime}
                                            showTimeSelect
                                            showTimeSelectOnly
                                            timeIntervals={60}
                                            timeCaption="Time"
                                            dateFormat="h:mm aa"
                                            placeholderText="Select Time"
                                            className="w-full mt-2 border border-gray-300 rounded-xl px-4 py-3 text-base"
                                            withPortal
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
                                        onClick={() => console.log("Cancel clicked")}
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
                                <h2 className="font-semibold text-[24px]">Cancel Membership </h2>
                            </div>

                            <div className="space-y-4 px-6 pb-6 pt-4">
                                <div>
                                    <label className="block text-[16px] font-semibold">
                                        Cancellation Type
                                    </label>

                                    {cancelType.map((option) => (
                                        <label key={option.value} className="flex mt-4  items-center mb-2 cursor-pointer">
                                            <label className="flex items-center cursor-pointer space-x-2">
                                                <input
                                                    type="radio"
                                                    name="cancelType"
                                                    value={option.value}
                                                    checked={cancelData.cancellationType === option.value}
                                                    onChange={() => handleRadioChange(option.value, "cancellationType", setCancelData)}
                                                    className="hidden peer"
                                                />
                                                <span className="w-5 h-5 flex items-center justify-center rounded-full border border-gray-400 peer-checked:bg-blue-500 peer-checked:border-blue-500">
                                                    {/* Tick icon */}
                                                    <svg
                                                        className=" w-3 h-3 text-white peer-checked:block"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="3"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </span>
                                                <span className="text-gray-800 text-[16px]">{option.label}</span>
                                            </label>

                                        </label>
                                    ))}
                                </div>
                                <div>
                                    {cancelData.cancellationType !== 'immediately' && (
                                        <>
                                            <label className="block text-[16px] font-semibold">
                                                Cancellation Effective Date
                                            </label>
                                            <DatePicker
                                                withPortal
                                                minDate={addDays(new Date(), 1)} // disables today and all past dates
                                                dateFormat="EEEE, dd MMMM yyyy"
                                                selected={cancelData.cancelDate ? new Date(cancelData.cancelDate) : null}
                                                onChange={(date) => handleDateChange(date, "cancelDate", setCancelData)}
                                                className="w-full mt-2 border border-gray-300 rounded-xl px-4 py-3 text-base"
                                            />
                                        </>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-[16px] font-semibold">
                                        Reason for Cancellation
                                    </label>
                                    <Select
                                        value={reasonOptions.find((opt) => opt.value === cancelData.cancelReason)}
                                        onChange={(selected) => handleSelectChange(selected, "cancelReason", setCancelData)}
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
                                        rows={3}
                                        name="additionalNote"    // <-- MUST match state key
                                        value={cancelData.additionalNote}
                                        onChange={(e) => handleInputChange(e, setCancelData)}
                                        placeholder=""
                                    />
                                </div>

                                {/* Buttons */}
                                <div className="flex justify-end gap-4 pt-4">
                                    <button
                                        onClick={() => cancelMembershipSubmit(cancelData, 'allMembers')}

                                        className="w-1/2  bg-[#FF6C6C] text-white rounded-xl py-3 text-[18px] font-medium hover:shadow-md transition-shadow"
                                    >
                                        Cancel Membership
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                )}
                {addToWaitingList && (
                    <div className="fixed inset-0 bg-[#00000066] flex justify-center items-center z-50">
                        <div className="bg-white rounded-2xl w-[541px] max-h-[90%] overflow-y-auto relative scrollbar-hide">
                            <button
                                className="absolute top-4 left-4 p-2"
                                onClick={() => setaddToWaitingList(false)}
                            >
                                <img src="/demo/synco/icons/cross.png" alt="Close" />
                            </button>

                            <div className="text-center py-6 border-b border-gray-300">
                                <h2 className="font-semibold text-[24px]">Add to Waiting List Form</h2>
                            </div>

                            <div className="space-y-4 px-6 pb-6 pt-4">
                                {/* Current Class */}
                                <div>
                                    <label className="block text-[16px] font-semibold">Current Class</label>
                                    <input
                                        type="text"
                                        className="w-full mt-2 border border-gray-300 rounded-xl px-4 py-3 text-base"
                                        value={classSchedule?.className || "-"}
                                        readOnly
                                    />
                                </div>

                                {/* Venue */}
                                <div>
                                    <label className="block text-[16px] font-semibold">Venue</label>
                                    <input
                                        type="text"
                                        className="w-full mt-2 border border-gray-300 rounded-xl px-4 py-3 text-base"
                                        value={classSchedule?.venue?.name || "-"}
                                        readOnly
                                    />
                                </div>

                                {/* New Class */}
                                <div>
                                    <label className="block text-[16px] font-semibold">Select New Class</label>
                                    <Select
                                        value={
                                            waitingListData.classScheduleId
                                                ? {
                                                    value: waitingListData.classScheduleId,
                                                    label: selectedClass ? selectedClass.label : `Class ${waitingListData.classScheduleId}`
                                                }
                                                : null
                                        } onChange={(selected) => handleSelectChange(selected, "classScheduleId", setWaitingListData)}
                                        options={newClasses}
                                        placeholder="Select Class"
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

                                {/* Preferred Date */}
                                <div>
                                    <label className="block text-[16px] font-semibold">Preferred Start Date (Optional)</label>
                                    <DatePicker
                                        withPortal
                                        minDate={addDays(new Date(), 1)} // disables today and all past dates
                                        selected={waitingListData.preferredStartDate ? new Date(waitingListData.preferredStartDate) : null}
                                        onChange={(date) => handleDateChange(date, "preferredStartDate", setWaitingListData)}
                                        dateFormat="EEEE, dd MMMM yyyy"
                                        className="w-full mt-2 border border-gray-300 rounded-xl px-4 py-3 text-base"
                                    />

                                </div>

                                {/* Notes */}
                                <div>
                                    <label className="block text-[16px] font-semibold">Notes (Optional)</label>
                                    <textarea
                                        className="w-full mt-2 border border-gray-300 rounded-xl px-4 py-3 text-base"
                                        rows={6}
                                        name="notes"

                                        value={waitingListData.notes}
                                        onChange={(e) => handleInputChange(e, setWaitingListData)}
                                    />

                                </div>

                                {/* Button */}
                                <div className="flex gap-4 pt-4">
                                    <button
                                        className="flex-1 bg-[#237FEA] text-white rounded-xl py-3 text-[18px] font-medium hover:shadow-md transition-shadow"
                                        onClick={() => addtoWaitingListSubmit(waitingListData, 'allMembers')}
                                    >
                                        Join Waiting List
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                )}
                {freezeMembership && (
                    <div className="fixed inset-0 bg-[#00000066] flex justify-center items-center z-50">
                        <div className="bg-white rounded-2xl w-[541px] max-h-[90%] overflow-y-auto relative scrollbar-hide">
                            <button
                                className="absolute top-4 left-4 p-2"
                                onClick={() => setFreezeMembership(false)}
                            >
                                <img src="/demo/synco/icons/cross.png" alt="Close" />
                            </button>

                            <div className="text-center py-6 border-b border-gray-300">
                                <h2 className="font-semibold text-[24px]">Freeze Membership Form</h2>
                            </div>

                            <div className="space-y-4 px-6 pb-6 pt-4">
                                {/* Freeze Start Date */}
                                <div>
                                    <label className="block text-[16px] font-semibold">Freeze Start Date</label>
                                    <DatePicker
                                        withPortal
                                        minDate={addDays(new Date(), 1)} // disables today and all past dates
                                        selected={freezeData.freezeStartDate ? new Date(freezeData.freezeStartDate) : null}
                                        onChange={(date) => handleDateChange(date, "freezeStartDate", setFreezeData)}
                                        dateFormat="EEEE, dd MMMM yyyy"
                                        className="w-full mt-2 border border-gray-300 rounded-xl px-4 py-3 text-base"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[16px] font-semibold">Freeze Duration (Months)</label>
                                    <Select
                                        value={monthOptions.find((opt) => opt.value === freezeData.freezeDurationMonths) || null}
                                        onChange={(selected) => handleSelectChange(selected, "freezeDurationMonths", setFreezeData)}
                                        options={monthOptions}
                                        placeholder="Select Duration"
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

                                {/* Reactivate On */}
                                <div>
                                    <label className="block text-[16px] font-semibold">Reactivate On</label>
                                    <DatePicker
                                        withPortal
                                        minDate={addDays(new Date(), 1)} // disables today and all past dates
                                        selected={freezeData.reactivateOn ? new Date(freezeData.reactivateOn) : null}
                                        onChange={(date) => handleDateChange(date, "reactivateOn", setFreezeData)}
                                        dateFormat="EEEE, dd MMMM yyyy"
                                        className="w-full mt-2 border border-gray-300 rounded-xl px-4 py-3 text-base"
                                    />
                                </div>

                                {/* Reason */}
                                <div>
                                    <label className="block text-[16px] font-semibold">
                                        Reason for Freezing (Optional)
                                    </label>
                                    <textarea
                                        name="reasonForFreezing"
                                        className="w-full mt-2 border border-gray-300 rounded-xl px-4 py-3 text-base"
                                        rows={6}
                                        value={freezeData.reasonForFreezing}
                                        onChange={(e) => handleInputChange(e, setFreezeData)}
                                    />
                                </div>

                                {/* Buttons */}
                                <div className="flex w-full justify-end gap-4 pt-4">
                                    <button
                                        className="w-1/2 bg-[#237FEA] text-white rounded-xl py-3 text-[18px] font-medium hover:shadow-md transition-shadow"
                                        onClick={() => freezerMembershipSubmit(freezeData, 'allMembers')}
                                    >
                                        Freeze Membership
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {reactivateMembership && (
                    <div className="fixed inset-0 bg-[#00000066] flex justify-center items-center z-50">
                        <div className="bg-white rounded-2xl w-[541px] max-h-[90%] overflow-y-auto relative scrollbar-hide">
                            <button
                                className="absolute top-4 left-4 p-2"
                                onClick={() => setReactivateMembership(false)}
                            >
                                <img src="/demo/synco/icons/cross.png" alt="Close" />
                            </button>

                            <div className="text-center py-6 border-b border-gray-300">
                                <h2 className="font-semibold text-[24px]">Reactivate Membership</h2>
                            </div>

                            <div className="space-y-4 px-6 pb-6 pt-4">
                                {/* Reactivate On */}
                                <div>
                                    <label className="block text-[16px] font-semibold">Reactivate On</label>
                                    <DatePicker
                                        withPortal
                                        minDate={addDays(new Date(), 1)} // disable today & past dates
                                        selected={
                                            reactivateData?.reactivateOn
                                                ? new Date(reactivateData.reactivateOn)
                                                : null
                                        }
                                        onChange={(date) => handleDateChange(date, "reactivateOn", setReactivateData)}
                                        dateFormat="EEEE, dd MMMM yyyy"
                                        className="w-full mt-2 border border-gray-300 rounded-xl px-4 py-3 text-base"
                                    />
                                </div>

                                {/* Confirm Class */}
                                <div>
                                    <label className="block text-[16px] font-semibold">Confirm Class</label>
                                    <input
                                        type="text"
                                        className="w-full mt-2 border border-gray-300 rounded-xl px-4 py-3 text-base"
                                        value={classSchedule?.className || "-"}
                                        readOnly
                                    />
                                </div>

                                <div className="w-full max-w-xl mx-auto">
                                    <button
                                        type="button"
                                        disabled={!paymentPlan}
                                        onClick={() => setIsOpen(!isOpen)}
                                        className={`bg-[#237FEA] text-white text-[18px]  font-semibold border w-full border-[#237FEA] px-6 py-3 rounded-lg flex items-center justify-center  ${paymentPlan
                                            ? "bg-[#237FEA] border border-[#237FEA]"
                                            : "bg-gray-400 border-gray-400 cursor-not-allowed"
                                            }`}
                                    >
                                        Review Membership Plan

                                        <img
                                            src={isOpen ? "/demo/synco/icons/whiteArrowDown.png" : "/demo/synco/icons/whiteArrowUp.png"}
                                            alt={isOpen ? "Collapse" : "Expand"}
                                            className="ml-2 inline-block"
                                        />

                                    </button>

                                    {isOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="bg-white mt-4 rounded-2xl shadow-lg p-6   font-semibold  space-y-4 text-[16px]"
                                        >
                                            <div className="flex justify-between text-[#333]">
                                                <span>Membership Plan</span>
                                                <span>
                                                    {paymentPlan.duration} {paymentPlan.interval}
                                                    {paymentPlan.duration > 1 ? 's' : ''}
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-[#333]">
                                                <span>Monthly Subscription Fee</span>
                                                <span>£{paymentPlan.price} p/m</span>
                                            </div>
                                            <div className="flex justify-between text-[#333]">
                                                <span>Price per class per child</span>
                                                <span>£{paymentPlan.price}</span>
                                            </div>

                                        </motion.div>
                                    )}
                                </div>
                                {/* Notes */}
                                <div>
                                    <label className="block text-[16px] font-semibold">Additional Notes (Optional)</label>
                                    <textarea
                                        name="additionalNote"
                                        className="w-full mt-2 border border-gray-300 rounded-xl px-4 py-3 text-base"
                                        rows={6}
                                        value={reactivateData.additionalNote}
                                        onChange={(e) => handleInputChange(e, setReactivateData)}
                                    />
                                </div>

                                {/* Button */}
                                <div className="flex gap-4 pt-4">
                                    <button
                                        className="flex-1 bg-[#237FEA] text-white rounded-xl py-3 text-[18px] font-medium hover:shadow-md transition-shadow"
                                        onClick={() => reactivateDataSubmit(reactivateData, 'allMembers')}

                                    >
                                        Reactivate Membership
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
