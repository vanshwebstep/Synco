// src/components/ParentProfile.jsx

import React from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
const parents = [
    {
        id: "p1",
        parentFirstName: "John",
        parentLastName: "Doe",
        parentEmail: "john.doe@example.com",
        parentPhoneNumber: "+447911123456",
        relationToChild: "father",
        howDidYouHear: "facebook",
    },
    {
        id: "p2",
        parentFirstName: "Jane",
        parentLastName: "Doe",
        parentEmail: "jane.doe@example.com",
        parentPhoneNumber: "+447911654321",
        relationToChild: "mother",
        howDidYouHear: "google",
    },
];
const emergency = {
    sameAsAbove: false,
    emergencyFirstName: "Emily",
    emergencyLastName: "Smith",
    emergencyPhoneNumber: "+447700900900",
    emergencyRelation: "aunt",
};
const relationOptions = [
    { value: "father", label: "Father" },
    { value: "mother", label: "Mother" },
    { value: "guardian", label: "Guardian" },
    { value: "aunt", label: "Aunt" },
    { value: "uncle", label: "Uncle" },
];

const hearOptions = [
    { value: "facebook", label: "Facebook" },
    { value: "google", label: "Google" },
    { value: "friend", label: "Friend Referral" },
    { value: "flyer", label: "Flyer" },
    { value: "other", label: "Other" },
];

const ParentProfile = () => {
    return (
        <>
            <div className="md:flex w-full gap-4">
                <div className="transition-all duration-300 flex-1 ">
                    <div className="space-y-6">
                        {parents.map((parent, index) => (
                            <div
                                key={parent.id}
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
                                            value={relationOptions.find((o) => o.value === parent.relationToChild)?.label || ""}
                                            readOnly
                                        />
                                    </div>
                                    <div className="w-1/2">
                                        <label className="block text-[16px] font-semibold">How did you hear about us?</label>
                                        <input
                                            className="w-full mt-2 border border-gray-300 rounded-xl px-4 py-3 text-base"
                                            value={hearOptions.find((o) => o.value === parent.howDidYouHear)?.label || ""}
                                            readOnly
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

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
                                    value={relationOptions.find((o) => o.value === emergency.emergencyRelation)?.label || ""}
                                    readOnly
                                />
                            </div>
                        </div>
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
                            <button className="bg-[#237FEA] p-3 rounded-xl text-white hover:bg-blue-600">
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
                <div className="md:min-w-[508px] md:max-w-[508px] text-base space-y-5">
                    {/* Card Wrapper */}
                    <div className="rounded-3xl bg-black overflow-hidden shadow-md border border-gray-200">
                        {/* Header */}
                        <div className="bg-[#FECF2F] m-2 px-6 rounded-3xl py-3 flex items-center justify-between">
                            <div>
                                <div className="text-[20px] font-bold text-[#1F2937]">Account Status</div>
                                <div className="text-[16px] font-semibold text-[#1F2937]">Trials</div>
                            </div>
                            <div className="bg-[#343A40] flex items-center gap-2  text-white text-[14px] px-3 py-2 rounded-xl">
                                <img src="/demo/synco/icons/x-circle-contained.png" alt="" /> Not Attended
                            </div>
                        </div>

                        {/* Content */}
                        <div className="bg-[#2E2F3E] text-white px-6 py-6 space-y-6">
                            {/* Avatar & Account Holder */}
                            <div className="flex items-center gap-4">
                                <img
                                    src="https://cdn-icons-png.flaticon.com/512/147/147144.png"
                                    alt="avatar"
                                    className="w-18 h-18 rounded-full"
                                />
                                <div>
                                    <div className="text-[24px] font-semibold leading-tight">Account Holder</div>
                                    <div className="text-[16px] text-gray-300">John Doe / Father</div>
                                </div>
                            </div>

                            {/* Details */}
                            <div className="space-y-4">
                                <div>
                                    <div className="text-[20px] font-bold tracking-wide">Venue</div>
                                    <div className="inline-block bg-[#007BFF] text-white text-[14px] px-3 py-1 rounded-md mt-1">
                                        Acton
                                    </div>
                                </div>

                                <div>
                                    <div className="text-[16px] text-gray-400">Students</div>
                                    <div className="text-[14px] text-white mt-1">1</div>
                                </div>

                                <div>
                                    <div className="text-[16px] text-gray-400">Date of Booking</div>
                                    <div className="text-[14px] text-white mt-1">Nov 18 2021, 17:00</div>
                                </div>

                                <div>
                                    <div className="text-[16px] text-gray-400">Date of Trial</div>
                                    <div className="text-[14px] text-white mt-1">Nov 18 2021</div>
                                </div>

                                <div>
                                    <div className="text-[16px] text-gray-400">Booking Source</div>
                                    <div className="text-[14px] text-white mt-1">Online</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </>
    );
};

export default ParentProfile;
