import React, { useEffect, useRef, useState } from 'react';
// import Create from './Create';
import { useNavigate } from 'react-router-dom';
import { Check } from "lucide-react";
import Loader from '../../../../contexts/Loader';
import { useVenue } from '../../../../contexts/VenueContext';
import { usePayments } from '../../../../contexts/PaymentPlanContext';
import { useTermContext } from '../../../../contexts/termDatesSessionContext';
import Swal from "sweetalert2"; // make sure it's installed
import PlanTabs from '../../../Weekly Classes/Find a class/PlanTabs';
import { format, parseISO } from "date-fns";
import { FiSearch } from "react-icons/fi";
import { ChevronLeft, ChevronRight } from "lucide-react";
import PhoneInput from "react-phone-input-2";
import 'react-phone-input-2/lib/style.css';
import DatePicker from "react-datepicker";
import Select from "react-select";
import { useLocation } from 'react-router-dom';
import { useClassSchedule } from '../../../../contexts/ClassScheduleContent';

import 'react-datepicker/dist/react-datepicker.css';
import 'react-phone-input-2/lib/style.css';
const List = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { classId } = location.state || {};

    console.log('classId', classId)
    const { fetchClassSchedulesByID, singleClassSchedulesOnly } = useClassSchedule()

    useEffect(() => {
        const fetchData = async () => {
            if (classId) {
                await fetchClassSchedulesByID(classId);
            }
        };
        fetchData();
    }, [classId, fetchClassSchedulesByID]);

    const [showModal, setShowModal] = useState(false);
    const [selectedPlans, setSelectedPlans] = useState([]);
    const [congestionNote, setCongestionNote] = useState(null);
    const [numberOfStudents, setNumberOfStudents] = useState('')
    const [selectedDate, setSelectedDate] = useState(null);


    const relationOptions = [
        { value: "Mother", label: "Mother" },
        { value: "Father", label: "Father" },
        { value: "Guardian", label: "Guardian" },
    ];
    const ClassOptions = [
        { value: "4–7 years", label: "4–7 years" },
        { value: "7–10 years", label: "7-10 years" },
        { value: "10-12 years ", label: "10-12 years" },
    ];

    const hearOptions = [
        { value: "social", label: "Social Media" },
        { value: "friend", label: "Friend" },
        { value: "flyer", label: "Flyer" },
    ];
    const keyInfoOptions = [
        { value: "keyInfo 1", label: "keyInfo 1" },
        { value: "keyInfo 2", label: "keyInfo 2" },
        { value: "keyInfo 3", label: "keyInfo 3" },
    ];
    const [clickedIcon, setClickedIcon] = useState(null);
    const [selectedRelation, setSelectedRelation] = useState(null);
    const [selectedKeyInfo, setSelectedKeyInfo] = useState(null);
    const [selectedHearOptions, setSelectedHearOptions] = useState(null);

    const handleIconClick = (icon, plan = null) => {
        setClickedIcon(icon);
        setCongestionNote(null)
        if (icon === 'currency') {
            setSelectedPlans(plan || []); // default to empty array
        }
        else if (icon == 'group') {
            setCongestionNote(plan)
        }
        else if (icon == 'p') {
            setCongestionNote(plan)
        }
        else if (icon == 'calendar') {
            setCongestionNote(plan)
        }
        setShowModal(true);
    };


    const { fetchPackages, packages } = usePayments()
    const { fetchTermGroup, termGroup } = useTermContext()

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const { venues, formData, setFormData, isEditVenue, setIsEditVenue, deleteVenue, fetchVenues, loading } = useVenue()
    const [selectedUserIds, setSelectedUserIds] = useState([]);
    const toggleCheckbox = (userId) => {
        setSelectedUserIds((prev) =>
            prev.includes(userId)
                ? prev.filter((id) => id !== userId)
                : [...prev, userId]
        );
    };
    const isAllSelected = venues.length > 0 && selectedUserIds.length === venues.length;

    const toggleSelectAll = () => {
        if (isAllSelected) {
            setSelectedUserIds([]);
        } else {
            const allIds = venues.map((user) => user.id);
            setSelectedUserIds(allIds);
        }
    };


    const handleDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'This action will permanently delete the venue.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
        }).then((result) => {
            if (result.isConfirmed) {
                console.log('DeleteId:', id);

                deleteVenue(id); // Call your delete function here

            }
        });
    };

    const [openForm, setOpenForm] = useState(false);

    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    // useEffect(() => {
    //     fetchVenues();
    //     fetchPackages();
    //     fetchTermGroup();
    // }, [fetchVenues, fetchPackages, fetchTermGroup]);

    const today = new Date();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [fromDate, setFromDate] = useState(new Date(currentDate.getFullYear(), currentDate.getMonth(), 11));
    const [toDate, setToDate] = useState(null);

    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();

    const getDaysArray = () => {
        const startDay = new Date(year, month, 1).getDay(); // Sunday = 0
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const days = [];

        const offset = startDay === 0 ? 6 : startDay - 1;

        for (let i = 0; i < offset; i++) {
            days.push(null);
        }

        for (let i = 1; i <= daysInMonth; i++) {
            days.push(new Date(year, month, i));
        }

        return days;
    };

    const calendarDays = getDaysArray();

    const goToPreviousMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
        setFromDate(null);
        setToDate(null);
    };

    const goToNextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
        setFromDate(null);
        setToDate(null);
    };

    const isSameDate = (d1, d2) =>
        d1 &&
        d2 &&
        d1.getDate() === d2.getDate() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getFullYear() === d2.getFullYear();



    const handleDateClick = (date) => {
        if (selectedDate && isSameDate(date, selectedDate)) {
            setSelectedDate(null); // Unselect if clicked again
        } else {
            setSelectedDate(date);
        }
    };

    const modalRef = useRef(null);
    const PRef = useRef(null);
    useEffect(() => {
        function handleClickOutside(event) {
            const activeRef = clickedIcon === "group" ? modalRef : PRef;

            if (
                activeRef.current &&
                !activeRef.current.contains(event.target)
            ) {
                setShowModal(false); // Close the modal
            }
        }

        if (showModal) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showModal, clickedIcon, setShowModal]);
    const [selectedClass, setSelectedClass] = useState();

    if (loading) {
        return (
            <>
                <Loader />
            </>
        )
    }
    const allTermRanges = Array.isArray(congestionNote)
        ? congestionNote.flatMap(group =>
            group.terms.map(term => ({
                start: new Date(term.startDate),
                end: new Date(term.endDate),
                exclusions: (Array.isArray(term.exclusionDates)
                    ? term.exclusionDates
                    : JSON.parse(term.exclusionDates || '[]')
                ).map(date => new Date(date)),
            }))
        )
        : [];
    // or `null`, `undefined`, or any fallback value

    // Usage inside calendar cell:
    const isInRange = (date) => {
        return allTermRanges.some(({ start, end }) =>
            date >= start && date <= end
        );
    };

    const isExcluded = (date) => {
        return allTermRanges.some(({ exclusions }) =>
            exclusions.some(ex => ex.toDateString() === date?.toDateString())
        );
    };
    const [dob, setDob] = useState('');
    const [age, setAge] = useState('');
    const [time, setTime] = useState('');
    const [phone, setPhone] = useState('');
    const [emergencyPhone, setEmergencyPhone] = useState('');
    const [sameAsAbove, setSameAsAbove] = useState(false);

    // 🔁 Calculate Age Automatically
    const handleDOBChange = (e) => {
        const birthDate = new Date(e.target.value);
        setDob(e.target.value);
        const today = new Date();
        let ageNow = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            ageNow--;
        }
        setAge(ageNow);

        // Placeholder Time logic
        const hour = today.getHours();
        setTime(hour < 12 ? "Morning" : "Afternoon");
    };

    // 🔁 Sync Emergency Contact
    const handleSameAsAbove = (e) => {
        const checked = e.target.checked;
        setSameAsAbove(checked);
        if (checked) {
            setEmergencyPhone(phone);
        } else {
            setEmergencyPhone('');
        }
    };
    console.log('congestionNote', congestionNote)
    return (
        <div className="pt-1 bg-gray-50 min-h-screen">
            <div className={`flex pe-4 justify-between items-center mb-4 ${openForm ? 'md:w-3/4' : 'w-full'}`}>

                <h2 onClick={() => {
                    navigate('/configuration/weekly-classes/find-a-class');
                }}
                    className="text-xl md:text-2xl font-semibold flex items-center gap-2 md:gap-3 cursor-pointer hover:opacity-80 transition-opacity duration-200"
                >
                    <img
                        src="/demo/synco/icons/arrow-left.png"
                        alt="Back"
                        className="w-5 h-5 md:w-6 md:h-6"
                    />
                    <span className="truncate">
                        Book a FREE Trial
                    </span>
                </h2>
                <div className="flex gap-3 items-center">
                    <img
                        src="/demo/synco/members/booktrial1.png"
                        className="bg-gray-700 rounded-full hover:bg-[#0DD180] transition"
                        alt=""
                    />
                    <img
                        src="/demo/synco/members/booktrial2.png"
                        className="bg-gray-700 rounded-full hover:bg-[#0DD180] transition"
                        alt=""
                    />
                    <img
                        src="/demo/synco/members/booktrial3.png"
                        className="bg-gray-700 rounded-full hover:bg-[#0DD180] transition"
                        alt=""
                    />

                </div>
            </div>
            <div className="md:flex w-full gap-4">
                <div className="md:min-w-[508px] md:max-w-[508px] text-base space-y-5">
                    {/* Search */}
                    <div className="space-y-3 bg-white p-6 rounded-3xl shadow-sm ">
                        <h2 className="text-[24px] font-semibold">Enter Trial Information</h2>
                        <div className="">
                            <label htmlFor="" className="text-base font-semibold">Venue</label>
                            <div className="relative mt-2 ">
                                <input
                                    type="text"
                                    placeholder="Select venue"
                                    value={singleClassSchedulesOnly?.venue?.name}
                                    readOnly
                                    className="w-full border border-gray-300 rounded-xl px-3 text-[16px] py-3 pl-9 focus:outline-none"

                                />
                                <FiSearch className="absolute left-3 top-4 text-[20px]" />
                            </div>
                        </div>
                        <div className="mb-5">
                            <label htmlFor="" className="text-base font-semibold">Number of students</label>
                            <div className="relative mt-2 ">

                                <input
                                    type="number"
                                    value={numberOfStudents}
                                    onChange={(e) => {
                                        const val = Number(e.target.value);
                                        if ([1, 2, 3].includes(val) || e.target.value === "") {
                                            setNumberOfStudents(e.target.value);
                                        }
                                        // Do nothing if invalid
                                    }}
                                    placeholder="Choose number of students"
                                    className="w-full border border-gray-300 rounded-xl px-3 text-[16px] py-3 focus:outline-none"
                                />

                            </div>
                        </div>
                    </div>

                    <div className="space-y-3 bg-white p-6 rounded-3xl shadow-sm ">
                        <div className="">
                            <h2 className="text-[24px] font-semibold">Select trial Date </h2>

                            <div className="rounded p-4 mt-6 text-center text-base w-full max-w-md mx-auto">
                                {/* Header */}
                                <div className="flex justify-around items-center mb-3">
                                    <button
                                        onClick={goToPreviousMonth}
                                        className="w-8 h-8 rounded-full bg-white text-black hover:bg-black hover:text-white border border-black flex items-center justify-center"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>
                                    <p className="font-semibold text-[20px]">
                                        {currentDate.toLocaleString("default", { month: "long" })} {year}
                                    </p>
                                    <button
                                        onClick={goToNextMonth}
                                        className="w-8 h-8 rounded-full bg-white text-black hover:bg-black hover:text-white border border-black flex items-center justify-center"
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Day Labels */}
                                <div className="grid grid-cols-7 text-xs gap-1 text-[18px] text-gray-500 mb-1">
                                    {["M", "T", "W", "T", "F", "S", "S"].map((day) => (
                                        <div key={day} className="font-medium text-center">
                                            {day}
                                        </div>
                                    ))}
                                </div>

                                {/* Calendar Weeks */}
                                <div className="flex flex-col  gap-1">
                                    {Array.from({ length: Math.ceil(calendarDays.length / 7) }).map((_, weekIndex) => {
                                        const week = calendarDays.slice(weekIndex * 7, weekIndex * 7 + 7);


                                        return (
                                            <div
                                                key={weekIndex}
                                                className={`grid grid-cols-7 text-[18px] gap-1 py-1 rounded `}
                                            >
                                                {week.map((date, i) => {
                                                    const isSelected = isSameDate(date, selectedDate);
                                                    return (
                                                        <div
                                                            key={i}
                                                            onClick={() => date && handleDateClick(date)}
                                                            className={`w-8 h-8 flex text-[18px] items-center justify-center mx-auto text-base rounded-full cursor-pointer
                      ${isSelected
                                                                    ? "bg-blue-600 text-white font-bold"
                                                                    : "text-gray-800"
                                                                }
                    `}
                                                        >
                                                            {date ? date.getDate() : ""}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex-1 bg-white transition-all duration-300">
                    <div className="max-w-5xl mx-auto bg-[#f9f9f9] p-6 space-y-6">
                        {/* Student Info */}
                        <div className="bg-white p-6 rounded-3xl shadow-sm space-y-6">
                            <h2 className="text-[20px] font-semibold">Student information</h2>

                            {/* Row 1 */}
                            <div className="flex gap-4">
                                <div className="w-1/2">
                                    <label className="block text-[16px] font-semibold">First name</label>
                                    <input className="w-full mt-2 border border-gray-300 rounded-xl px-4 py-3 text-base" placeholder="Enter first name" />
                                </div>
                                <div className="w-1/2">
                                    <label className="block text-[16px] font-semibold">Last name</label>
                                    <input className="w-full mt-2 border border-gray-300 rounded-xl px-4 py-3 text-base" placeholder="Enter last name" />
                                </div>
                            </div>

                            {/* Row 2 */}
                            <div className="flex gap-4">
                                <div className="w-1/2">
                                    <label className="block text-[16px] font-semibold">Date of birth</label>
                                    <DatePicker
                                        selected={dob}
                                        onChange={(date) => handleDOBChange(date)}
                                        className="w-full mt-2 border border-gray-300 rounded-xl px-4 py-3 text-base"
                                    />
                                </div>
                                <div className="w-1/2">
                                    <label className="block text-[16px] font-semibold">Age</label>
                                    <input
                                        type="text"
                                        value={age}
                                        readOnly
                                        className="w-full bg-white mt-2 bg-gray-100 border border-gray-300 rounded-xl px-4 py-3 text-base"
                                        placeholder="Automatic entry"
                                    />
                                </div>
                            </div>

                            {/* Row 3 */}
                            <div className="flex gap-4">
                                <div className="w-1/2">
                                    <label className="block text-[16px] font-semibold">Gender</label>
                                    <input className="w-full mt-2 border border-gray-300 rounded-xl px-4 py-3 text-base" placeholder="Enter gender" />
                                </div>
                                <div className="w-1/2">
                                    <label className="block text-[16px] font-semibold">Medical information</label>

                                    <Select
                                        options={relationOptions}
                                        value={selectedRelation}
                                        onChange={setSelectedRelation}
                                        placeholder="Enter medical information"
                                        className="mt-2"
                                        classNamePrefix="react-select"
                                    />
                                </div>
                            </div>

                            {/* Row 4 */}
                            <div className="flex gap-4">
                                <div className="w-1/2">
                                    <label className="block text-[16px] font-semibold">Class</label>

                                    <Select
                                        // options={ClassOptions}
                                        value={singleClassSchedulesOnly?.className}
                                        onChange={setSelectedClass}
                                        placeholder="Select Class"
                                        className="mt-2"
                                        classNamePrefix="react-select"
                                    />
                                </div>
                                <div className="w-1/2">
                                    <label className="block text-[16px] font-semibold">Time</label>
                                    <input
                                        type="text"
                                        value={time}
                                        readOnly
                                        className="w-full mt-2 bg-gray-100 border border-gray-300 rounded-xl px-4 py-3 text-base"
                                        placeholder="Automatic entry"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Parent Info */}
                        <div className="bg-white p-6 rounded-3xl shadow-sm space-y-6">
                            <div className="flex justify-between items-start">
                                <h2 className="text-[20px] font-semibold">Parent information</h2>
                                <button className="text-white text-[14px] px-4 py-2 bg-blue-600 rounded-xl hover:bg-blue-700">Add Parent</button>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-1/2">
                                    <label className="block text-[16px] font-semibold">First name</label>
                                    <input className="w-full mt-2 border border-gray-300 rounded-xl px-4 py-3 text-base" placeholder="Enter first name" />
                                </div>
                                <div className="w-1/2">
                                    <label className="block text-[16px] font-semibold">Last name</label>
                                    <input className="w-full mt-2 border border-gray-300 rounded-xl px-4 py-3 text-base" placeholder="Enter last name" />
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-1/2">
                                    <label className="block text-[16px] font-semibold">Email</label>
                                    <input type="email" className="w-full mt-2 border border-gray-300 rounded-xl px-4 py-3 text-base" placeholder="Enter email address" />
                                </div>
                                <div className="w-1/2">
                                    <label className="block text-[16px] font-semibold">Phone number</label>
                                    <PhoneInput
                                        country={'gb'}
                                        value={phone}
                                        onChange={setPhone}
                                        inputClass="!w-full !h-full !border-0"
                                        containerClass="w-full mt-2 border border-gray-300 rounded-xl px-2 py-3 custom-phone"
                                        inputStyle={{ width: '100%', border: 'none', height: '48px' }}
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-1/2">
                                    <label className="block text-[16px] font-semibold">Relation to child</label>

                                    <Select
                                        options={relationOptions}
                                        value={selectedRelation}
                                        onChange={setSelectedRelation}
                                        placeholder="Select Relation"
                                        className="mt-2"
                                        classNamePrefix="react-select"
                                    />
                                </div>
                                <div className="w-1/2">
                                    <label className="block text-[16px] font-semibold">How did you hear about us?</label>

                                    <Select
                                        options={hearOptions}
                                        value={selectedHearOptions}
                                        onChange={setSelectedHearOptions}
                                        placeholder="Select from drop down"
                                        className="mt-2"
                                        classNamePrefix="react-select"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Emergency Contact */}
                        <div className="bg-white p-6 rounded-3xl shadow-sm space-y-6">
                            <h2 className="text-[20px] font-semibold">Emergency contact details</h2>

                            <div className="flex items-center gap-2">
                                <input type="checkbox" className=" w-4 h-4 rounded-md" checked={sameAsAbove} onChange={handleSameAsAbove} />
                                <label className="text-base font-semibold text-gray-700">Fill same as above</label>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-1/2">
                                    <label className="block text-[16px] font-semibold">First name</label>
                                    <input className="w-full mt-2 border border-gray-300 rounded-xl px-4 py-3 text-base" placeholder="Enter first name" />
                                </div>
                                <div className="w-1/2">
                                    <label className="block text-[16px] font-semibold">Last name</label>
                                    <input className="w-full mt-2 border border-gray-300 rounded-xl px-4 py-3 text-base" placeholder="Enter last name" />
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-1/2">
                                    <label className="block text-[16px] font-semibold">Phone number</label>
                                    <PhoneInput
                                        country={'gb'}
                                        value={emergencyPhone}
                                        onChange={setEmergencyPhone}
                                        inputClass="!w-full !h-full !border-0"
                                        containerClass="w-full mt-2 border border-gray-300 rounded-xl px-2 py-3"
                                        inputStyle={{ width: '100%', border: 'none', height: '48px' }}
                                    />
                                </div>
                                <div className="w-1/2">
                                    <label className="block text-[16px] font-semibold">Relation to child</label>
                                    <Select
                                        options={relationOptions}
                                        value={selectedRelation}
                                        onChange={setSelectedRelation}
                                        placeholder="Select Relation"
                                        className="mt-2"
                                        classNamePrefix="react-select"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="w-full">
                            <Select
                                options={keyInfoOptions}
                                value={selectedKeyInfo}
                                onChange={setSelectedKeyInfo}
                                placeholder="Key Information"
                                className="react-select-container text-[20px]"
                                classNamePrefix="react-select "
                                styles={{
                                    control: (base, state) => ({
                                        ...base,
                                        borderRadius: '1.5rem',
                                        borderColor: state.isFocused ? '#ccc' : '#E5E7EB', // light gray
                                        boxShadow: 'none',
                                        padding: '4px 8px',
                                        minHeight: '48px',
                                    }),
                                    placeholder: (base) => ({
                                        ...base,
                                        color: '#000000ff', // tailwind text-gray-400
                                        fontWeight: 600,
                                    }),
                                    dropdownIndicator: (base) => ({
                                        ...base,
                                        color: '#9CA3AF',
                                    }),
                                    indicatorSeparator: () => ({ display: 'none' }),
                                }}
                            />
                        </div>
                        <div className="flex justify-end gap-4">
                            <button
                                type="button"
                                className="flex items-center justify-center gap-1 border border-[#717073] text-[#717073] px-12 text-[18px]  py-2 rounded-lg font-semibold bg-none"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="bg-[#237FEA] text-white font-semibold border  border-[#237FEA] px-6 py-3 rounded-lg"
                            >
                                Book FREE Trial
                            </button>

                        </div>
                        <div className="bg-white rounded-3xl p-6 space-y-4">
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
                </div>

            </div>

        </div>
    );
};

export default List;
