// src/components/ParentProfile.jsx

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

const ParentProfile = ({ ParentProfile }) => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const [selectedDate, setSelectedDate] = useState(null);

    const { loading, cancelFreeTrial, sendCancelFreeTrialmail, rebookFreeTrialsubmit } = useBookFreeTrial() || {};


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
        students,
        venueId,
        classSchedule,
        paymentPlans,
    } = ParentProfile;

    const [rebookFreeTrial, setRebookFreeTrial] = useState({
        bookingId: id || null,
        trialDate: "",
        reasonForNonAttendance: "",
        additionalNote: "",
    });

    console.log('parents', ParentProfile)
    const parents = ParentProfile.parents;
    const [formData, setFormData] = useState({
        bookingId: id,
        cancelReason: "",
        additionalNote: "",
    });
    const studentCount = students?.length || 0;
    const matchedPlan = paymentPlans?.find(plan => plan.students === studentCount);
    const emergency = ParentProfile.emergency;
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
    return (
        <>
            <div className="md:flex w-full gap-4">
                <div className="transition-all duration-300 flex-1 ">
                    <div className="space-y-6">
                        {parents.map((parent, index) => (
                            <div
                                key={parent.parentFirstName}
                                className="bg-white p-6 mb-10 rounded-3xl shadow-sm space-y-6 relative"
                            >
                                {/* Top Header Row */}
                                <div className="flex justify-between items-start">
                                    <h2 className="text-[20px] font-semibold">Parent information</h2>

                                </div>

                                {/* Row 1 */}
                                <div className="flex gap-4">
                                    <div className="w-1/2">
                                        <label className="block text-[16px] font-semibold">First name</label>
                                        <input
                                            className="w-full mt-2 border border-gray-300 rounded-xl px-4 py-3 text-base"
                                            placeholder="Enter first name"
                                            value={parent.parentFirstName}
                                            readOnly
                                        />
                                    </div>
                                    <div className="w-1/2">
                                        <label className="block text-[16px] font-semibold">Last name</label>
                                        <input
                                            className="w-full mt-2 border border-gray-300 rounded-xl px-4 py-3 text-base"
                                            placeholder="Enter last name"
                                            value={parent.parentLastName}
                                            readOnly
                                        />
                                    </div>
                                </div>

                                {/* Row 2 */}
                                <div className="flex gap-4">
                                    <div className="w-1/2">
                                        <label className="block text-[16px] font-semibold">Email</label>
                                        <input
                                            type="email"
                                            className="w-full mt-2 border border-gray-300 rounded-xl px-4 py-3 text-base"
                                            placeholder="Enter email address"
                                            value={parent.parentEmail}
                                            readOnly
                                        />
                                    </div>
                                    <div className="w-1/2">
                                        <label className="block text-[16px] font-semibold">Phone number</label>
                                        <input
                                            className="w-full mt-2 border border-gray-300 rounded-xl px-4 py-3 text-base"
                                            value={parent.parentPhoneNumber}
                                            readOnly
                                        />
                                    </div>
                                </div>

                                {/* Row 3 */}
                                <div className="flex gap-4">
                                    <div className="w-1/2">
                                        <label className="block text-[16px] font-semibold">Relation to child</label>
                                        <input
                                            className="w-full mt-2 border border-gray-300 rounded-xl px-4 py-3 text-base"
                                            value={parent.relationToChild}
                                            readOnly
                                        />
                                    </div>
                                    <div className="w-1/2">
                                        <label className="block text-[16px] font-semibold">How did you hear about us?</label>
                                        <input
                                            className="w-full mt-2 border border-gray-300 rounded-xl px-4 py-3 text-base"
                                            value={parent.howDidYouHear}
                                            readOnly
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {emergency.map((emergency, index) => (
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
                    ))}
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
                        <div className="bg-[#FECF2F] m-2 px-6 rounded-3xl py-3 flex items-center justify-between">
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
                                    {status === 'attend' && (
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
                                    <span>
                                        {status === 'pending'
                                            ? 'Pending'
                                            : status === 'attend'
                                                ? 'Attended'
                                                : status === 'cancelled'
                                                    ? 'Cancelled'
                                                    : 'Not Attended'}
                                    </span>
                                </div>

                            </div>
                        </div>

                        {parents.map((parent, index) => (
                            <div className="bg-[#2E2F3E] text-white px-6 py-6 space-y-6">
                                {/* Avatar & Account Holder */}
                                <div className="flex items-center gap-4">
                                    <img
                                        src={
                                            (status === 'pending' || status === 'attend') && bookedBy?.profile
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
                                            {status === 'pending' || status === 'attend'
                                                ? 'Booked By'
                                                : 'Account Holder'}
                                        </div>
                                        <div className="text-[16px] text-gray-300">
                                            {status === 'pending' || status === 'attend'
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
                                        {status === 'pending' || status === 'attend' ? (
                                            <>
                                                <div className="text-[20px] text-white">Membership Plan</div>

                                                {matchedPlan && (
                                                    <div className="text-[16px] mt-1 text-gray-400">
                                                        {matchedPlan.duration} {matchedPlan.interval} Plan
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

                                    <div className="border-t border-[#495362] py-5">
                                        {status === 'pending' || status === 'attend' ? (
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
                                    {status === 'pending' || status === 'attend' ? (
                                        <>
                                            <div className="border-t border-[#495362] py-5">
                                                <div className=" text-[20px] text-white">Price</div>
                                                <div className="text-[16px]  mt-1 text-gray-400"> £{matchedPlan?.price} </div>
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
                                </div>
                            </div>
                        ))}


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


                                {status !== 'pending' && status !== 'attend' && canRebooking && (
                                    <button
                                        onClick={() => setshowRebookTrial(true)}
                                        className="w-full bg-[#237FEA] text-white rounded-xl py-3 text-[18px] font-medium hover:bg-blue-700 hover:shadow-md transition-shadow duration-300"
                                    >
                                        Rebook FREE Trial
                                    </button>
                                )}

                                {status !== 'attend' && canCancelTrial && (
                                    <button
                                        onClick={() => setshowCancelTrial(true)}
                                        className="w-full border border-gray-300 text-[#717073] text-[18px] rounded-xl py-3 hover:shadow-md transition-shadow duration-300 font-medium"
                                    >
                                        Cancel Trial
                                    </button>
                                )}

                                {status !== 'pending' && status !== 'attend' && (
                                    <button className="w-full border border-gray-300 text-[#717073] text-[18px] rounded-xl py-3 hover:shadow-md transition-shadow duration-300 font-medium">
                                        Book a Membership
                                    </button>
                                )}

                                {status === 'attend' && (
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
        </div >
        </>
    );
};

export default ParentProfile;
