import React, { useEffect, useRef, useState } from 'react';
// import Create from './Create';
import { useNavigate } from 'react-router-dom';
import { Check } from "lucide-react";
import PlanTabs from '../PlanTabs';

import Loader from '../../../../contexts/Loader';
import { useVenue } from '../../../../contexts/VenueContext';
import { usePayments } from '../../../../contexts/PaymentPlanContext';
import { useTermContext } from '../../../../contexts/termDatesSessionContext';
import Swal from "sweetalert2"; // make sure it's installed
import { format, parseISO } from "date-fns";
import { motion } from "framer-motion";
import { X } from "lucide-react"; // Optional: Use any icon or ✖️ if no icon lib
import { ChevronDown, ChevronUp } from "lucide-react";

import { evaluate } from 'mathjs';

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
import { useBookFreeTrial } from '../../../../contexts/BookAFreeTrialContext';
const List = () => {
    useEffect(() => {
        window.scrollTo(0, 0); // scrolls to top on mount
    }, []);
    const [expression, setExpression] = useState('');
    const [result, setResult] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const { classId } = location.state || {};
    const popup1Ref = useRef(null);
    const popup2Ref = useRef(null);
    const popup3Ref = useRef(null);
    const { pathname } = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    console.log('classId', classId)
    const { fetchFindClassID, singleClassSchedulesOnly, loading } = useClassSchedule() || {};
    const { createBookFreeTrials } = useBookFreeTrial()
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {

        const fetchData = async () => {
            if (classId) {
                await fetchFindClassID(classId);
            }
        };
        fetchData();
    }, [classId, fetchFindClassID]);
    const [activePopup, setActivePopup] = useState(null);
    const togglePopup = (id) => {
        setActivePopup((prev) => (prev === id ? null : id));
    };
    const [showModal, setShowModal] = useState(false);
    const [selectedPlans, setSelectedPlans] = useState([]);
    const [congestionNote, setCongestionNote] = useState(null);
    const [numberOfStudents, setNumberOfStudents] = useState('1')
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
        { value: "Social Media", label: "Social Media" },
        { value: "Friend", label: "Friend" },
        { value: "Flyer", label: "Flyer" },
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
    const { venues, formData, setFormData, isEditVenue, setIsEditVenue, deleteVenue, fetchVenues } = useVenue() || {};
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
    const formatLocalDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-indexed
        const day = String(date.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`; // e.g., "2025-08-10"
    };

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

    const isSameDate = (d1, d2) => {
        const date1 = typeof d1 === "string" ? new Date(d1) : d1;
        const date2 = typeof d2 === "string" ? new Date(d2) : d2;

        return (
            date1 &&
            date2 &&
            date1.getDate() === date2.getDate() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getFullYear() === date2.getFullYear()
        );
    };


    const handleDateClick = (date) => {
        const formattedDate = formatLocalDate(date); // safe from timezone issues

        if (selectedDate === formattedDate) {
            setSelectedDate(null);
        } else {
            setSelectedDate(formattedDate);
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
    const [age, setAge] = useState(null);
    const [time, setTime] = useState('');
    const [phone, setPhone] = useState('');
    const [emergencyPhone, setEmergencyPhone] = useState('');
    const [sameAsAbove, setSameAsAbove] = useState(false);

    // 🔁 Calculate Age Automatically
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



    // 🔁 Sync Emergency Contact

    const [students, setStudents] = useState([
        {
            studentFirstName: '',
            studentLastName: '',
            dateOfBirth: null,
            age: '',
            gender: '',
            medicalInformation: '',
            // Add other fields if needed
        },
    ]);

    const handleInputChange = (index, field, value) => {
        const updatedStudents = [...students];
        updatedStudents[index][field] = value;
        setStudents(updatedStudents);
    };

    useEffect(() => {
        const newStudents = Array.from({ length: numberOfStudents }).map(() => ({
            studentFirstName: "",
            studentLastName: "",
            dateOfBirth: null,
            age: "",
            gender: "",
            medicalInformation: null,
            class: singleClassSchedulesOnly?.className,
            time: singleClassSchedulesOnly?.startTime,
        }));
        setStudents(newStudents);
    }, [numberOfStudents]);


    const [parents, setParents] = useState([
        {
            id: Date.now(),
            parentFirstName: '',
            parentLastName: '',
            parentEmail: '',
            parentPhoneNumber: '',
            relationToChild: '',
            howDidYouHear: ''

        }
    ]);
    const handleAddParent = () => {
        setParents((prev) => [
            ...prev,
            {
                id: Date.now(),
                parentFirstName: '',
                parentLastName: '',
                parentEmail: '',
                parentPhoneNumber: '',
                relationToChild: '',
                howDidYouHear: ''
            },
        ]);
    };

    const handleRemoveParent = (id) => {
        setParents((prev) => prev.filter((p) => p.id !== id));
    };

    const handleStudentChange = (index, field, value) => {
        const updated = [...students];
        updated[index][field] = value;

        // Calculate age if dateOfBirth
        if (field === "dateOfBirth") {
            const birth = new Date(value);
            const today = new Date();
            updated[index].age = today.getFullYear() - birth.getFullYear();
        }

        setStudents(updated);
    };
    const handleParentChange = (index, field, value) => {
        const updated = [...parents];
        updated[index][field] = value;
        setParents(updated);
    };

    const handleEmergencyChange = (studentIndex, field, value) => {
        const updated = [...students];
        updated[studentIndex].emergency[field] = value;
        setStudents(updated);
    };

    const handleSameAsAbove = (studentIndex) => {
        const updated = [...students];
        const primaryParent = updated[studentIndex].parents[0];
        if (primaryParent) {
            updated[studentIndex].emergency = {
                parentFirstName: primaryParent.parentFirstName,
                parentLastName: primaryParent.parentLastName,
                parentPhoneNumber: primaryParent.parentPhoneNumber,
                relationToChild: primaryParent.relationToChild?.label || "",
                sameAsAbove: true
            };
        }
        setStudents(updated);
    };
    const handlePhoneChange = (index, value) => {
        const updated = [...parents];
        updated[index].phone = value;
        setParents(updated);
    };
    const [emergency, setEmergency] = useState({
        sameAsAbove: false,
        emergencyFirstName: "",
        emergencyLastName: "",
        emergencyPhoneNumber: "",
        emergencyRelation: "",
    });
    useEffect(() => {
        if (emergency.sameAsAbove && parents.length > 0) {
            const firstParent = parents[0];
            setEmergency(prev => ({
                ...prev,
                emergencyFirstName: firstParent.parentFirstName || "",
                emergencyLastName: firstParent.parentLastName || "",
                emergencyPhoneNumber: firstParent.parentPhoneNumber || "",
                emergencyRelation: firstParent.relationToChild || "", // or whatever default you want
            }));
        }
    }, [emergency.sameAsAbove, parents]);
    const handleSubmit = async () => {
        if (!selectedDate) {
            Swal.fire({
                icon: "warning",
                title: "Trial Date Required",
                text: "Please select a trial date before submitting.",
            });
            return;
        }
        setIsSubmitting(true); // Start loading

        const payload = {
            keyInformation: selectedKeyInfo,
            venueId: singleClassSchedulesOnly?.venue?.id,
            classScheduleId: singleClassSchedulesOnly?.id,
            trialDate: selectedDate,
            totalStudents: students.length,
            students,
            parents,
            emergency,
        };

        try {
            await createBookFreeTrials(payload); // assume it's a promise
            console.log("Final Payload:", JSON.stringify(payload, null, 2));
            // Optionally show success alert or reset form
        } catch (error) {
            console.error("Error while submitting:", error);
            // Optionally show error alert
        } finally {
            setIsSubmitting(false); // Stop loading
        }
    };


    const handleClick = (val) => {
        if (val === 'AC') {
            setExpression('');
            setResult('');
        } else if (val === '⌫') {
            setExpression((prev) => prev.slice(0, -1));
        } else if (val === '=') {
            try {
                const replacedExpr = expression
                    .replace(/×/g, '*')
                    .replace(/÷/g, '/')
                    .replace(/−/g, '-');
                const evalResult = evaluate(replacedExpr);
                setResult(evalResult.toLocaleString());
            } catch {
                setResult('Error');
            }
        } else if (val === '±') {
            if (result) {
                const toggled = parseFloat(result.replace(/,/g, '')) * -1;
                setExpression(toggled.toString());
                setResult(toggled.toLocaleString());
            } else if (expression) {
                // Match the last number in expression
                const match = expression.match(/(-?\d+\.?\d*)$/);
                if (match) {
                    const number = match[0];
                    const toggled = parseFloat(number) * -1;
                    setExpression((prev) =>
                        prev.replace(new RegExp(`${number}$`), toggled.toString())
                    );
                }
            }
        } else {
            setExpression((prev) => prev + val);
            setResult('');
        }
    };
    const renderExpression = () => {
        const tokens = expression.split(/([+\u2212×÷%])/g); // \u2212 is the unicode minus (−)
        return tokens.map((token, i) => {
            const isOperator = ['+', '−', '×', '÷', '%'].includes(token);
            return (
                <span key={i} className={isOperator ? 'text-[#F94D5C]' : ''}>
                    {token || 0}
                </span>
            );
        });
    };

    console.log('"2025-08-01"', selectedDate)

    const buttons = [
        ['AC', '±', '%', '÷',],
        ["7", "8", "9", "×"],
        ["4", "5", "6", "−"],
        ["1", "2", "3", "+"],
        ["", "0", ".", "="],

    ];
    const handleClickOutside = (e) => {
        if (
            activePopup === 1 && popup1Ref.current && !popup1Ref.current.contains(e.target)
            || activePopup === 2 && popup2Ref.current && !popup2Ref.current.contains(e.target)
            || activePopup === 3 && popup3Ref.current && !popup3Ref.current.contains(e.target)
        ) {
            togglePopup(null);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [activePopup]);
    useEffect(() => {
        if (singleClassSchedulesOnly?.venue?.paymentGroups?.length > 0) {
            const cleanedPlans = singleClassSchedulesOnly.venue?.paymentGroups[0]?.paymentPlans.map(plan => ({
                id: plan.id,
                title: plan.title,
                price: plan.price,
                interval: plan.interval,
                students: plan.students,
                duration: plan.duration,
                joiningFee: plan.joiningFee,
                holidayCampPackage: plan.HolidayCampPackage,
                termsAndCondition: plan.termsAndCondition,
            }));
            console.log('cleanedPlans', cleanedPlans);
            setSelectedPlans(cleanedPlans);
        } else {
            console.log('cleanedPlans not found');
        }
    }, [singleClassSchedulesOnly]); // ✅ now it runs when data is fetched
    console.log('singleClassSchedulesOnly?.venue?', singleClassSchedulesOnly)

    const genderOptions = [
        { value: "male", label: "Male" },
        { value: "female", label: "Female" },
        { value: "other", label: "Other" },
    ];
    const sessionDates = singleClassSchedulesOnly?.venue?.termGroups?.flatMap(group =>
        group.terms.flatMap(term =>
            term.sessionsMap.map(s => s.sessionDate)
        )
    ) || [];

    const selectedLabel =
        keyInfoOptions.find((opt) => opt.value === selectedKeyInfo)?.label ||
        "Key Information";
    const sessionDatesSet = new Set(sessionDates);
    if (loading) {
        return (
            <>
                <Loader />
            </>
        )
    }

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
                <div className="flex gap-3 relative items-center">
                    <img
                        src="/demo/synco/members/booktrial1.png"
                        className={` rounded-full  hover:bg-[#0DD180] transition cursor-pointer ${activePopup === 1 ? 'bg-[#0DD180]' : 'bg-gray-700'} `}
                        onClick={() => togglePopup(1)}
                    />
                    {activePopup === 1 && (
                        <div ref={popup1Ref} className="  absolute min-w-[850px] bg-opacity-30 flex right-2 items-center top-15 justify-center z-50">
                            <div className="flex items-center justify-center w-full px-2 py-6 sm:px-2 md:py-2">
                                <div className="bg-white rounded-3xl p-4 sm:p-6 w-full max-w-4xl shadow-2xl">
                                    {/* Header */}
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#E2E1E5] pb-4 mb-4 gap-2">
                                        <h2 className="font-semibold text-[20px] sm:text-[24px]">Payment Plan Preview</h2>
                                        <button className="text-gray-400 hover:text-black text-xl font-bold">
                                            <img src="/demo/synco/icons/cross.png" onClick={() => togglePopup(null)} alt="close" className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <PlanTabs selectedPlans={selectedPlans} />
                                </div>
                            </div>
                        </div>
                    )}
                    <img
                        onClick={() => togglePopup(2)}
                        src="/demo/synco/members/booktrial2.png"
                        className={` rounded-full  hover:bg-[#0DD180] transition cursor-pointer ${activePopup === 2 ? 'bg-[#0DD180]' : 'bg-gray-700'} `}
                        alt=""
                    />
                    {activePopup === 2 && (
                        <div ref={popup2Ref} className="absolute right-0 top-20 z-50 flex items-center justify-center min-w-[320px]">
                            <div className="bg-[#464C55] rounded-2xl p-4 w-[468px] shadow-2xl text-white">
                                {/* Display */}
                                <div className="text-right min-h-[80px] mb-4">
                                    <div className="text-[24px] text-gray-300 break-words">
                                        {renderExpression()}

                                    </div>
                                    <div className="text-[56px] font-bold text-white leading-snug">
                                        {result !== "" && result}
                                    </div>
                                </div>

                                {/* Buttons */}
                                <div className="grid grid-cols-4 gap-3">
                                    {buttons.flat().map((btn, i) => {
                                        const isOperator = ['÷', '±', '×', '−', '+', '%', '=', 'AC'].includes(btn);
                                        const iconMap = {
                                            '÷': '/demo/synco/calcIcons/divide.png',
                                            '%': '/demo/synco/calcIcons/percentage.png',
                                            '⌫': '/demo/synco/calcIcons/np.png',
                                            '×': '/demo/synco/calcIcons/multiply.png',
                                            '−': '/demo/synco/calcIcons/sub.png',
                                            '+': '/demo/synco/calcIcons/add.png',
                                            '=': '/demo/synco/calcIcons/equal.png',
                                            '±': '/demo/synco/calcIcons/NP.png',
                                        };

                                        const showRed = ['+', '−', '×', '÷', '%'].includes(btn) && expression.includes(btn);

                                        return (
                                            <button
                                                key={i}
                                                onClick={() => btn && handleClick(btn)}
                                                className={`
                py-4 rounded-2xl text-[36px] font-semibold flex items-center justify-center h-16 transition-all duration-150
                ${isOperator ? 'bg-[#81858B] text-white' : 'bg-white text-black hover:bg-gray-100'}
                ${showRed ? 'text-[#F94D5C]' : ''}
                ${btn === '' ? 'opacity-0 pointer-events-none' : ''}
            `}
                                            >
                                                {iconMap[btn] ? (
                                                    <img src={iconMap[btn]} alt={btn} className="w-5 h-5 object-contain" />
                                                ) : (
                                                    btn
                                                )}
                                            </button>
                                        );
                                    })}

                                </div>

                            </div>
                        </div>

                    )}




                    <img
                        src="/demo/synco/members/booktrial3.png"
                        alt=""
                        onClick={() => togglePopup(3)}
                        className={` rounded-full  hover:bg-[#0DD180] transition cursor-pointer ${activePopup === 3 ? 'bg-[#0DD180]' : 'bg-gray-700'} `}
                    />
                    {activePopup === 3 && (
                        <div ref={popup3Ref} className="absolute top-full z-99 mt-8 right-0 w-100 p-4 bg-white rounded-2xl shadow-lg text-sm leading-relaxed text-gray-700">
                            <div className="font-semibold mb-2 text-[18px]">Phone Script</div>
                            <textarea
                                readOnly
                                className="w-full  min-h-[100px] max-w-[375px]  min-w-[375px]  resize text-[16px]  leading-relaxed bg-transparent focus:outline-none"
                                defaultValue="In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface."
                            />
                        </div>

                    )}

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
                                <div className="flex flex-col gap-1">
                                    {Array.from({ length: Math.ceil(calendarDays.length / 7) }).map((_, weekIndex) => {
                                        const week = calendarDays.slice(weekIndex * 7, weekIndex * 7 + 7);

                                        return (
                                            <div
                                                key={weekIndex}
                                                className="grid grid-cols-7 text-[18px] gap-1 py-1 rounded"
                                            >
                                                {week.map((date, i) => {
                                                    if (!date) {
                                                        return <div key={i} />;
                                                    }

                                                    const formattedDate = formatLocalDate(date);
                                                    const isAvailable = sessionDatesSet.has(formattedDate); // check if this date is valid session
                                                    const isSelected = isSameDate(date, selectedDate);

                                                    return (
                                                        <div
                                                            key={i}
                                                            onClick={() => isAvailable && handleDateClick(date)}
                                                            className={`w-8 h-8 flex text-[18px] items-center justify-center mx-auto text-base rounded-full
    ${isAvailable ? "cursor-pointer bg-sky-200" : "cursor-not-allowed opacity-40 bg-white"}
    ${isSelected ? "selectedDate text-white font-bold" : ""}
  `}
                                                        >
                                                            {date.getDate()}
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
                    <div className="max-w-full mx-auto bg-[#f9f9f9] px-6 ">

                        <div className="space-y-10   ">
                            {students.map((student, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: index * 0.1 }}
                                    className="bg-white mb-10 p-6 rounded-3xl shadow-sm space-y-6"
                                >
                                    <h2 className="text-[20px] font-semibold">
                                        Student {index + 1} Information
                                    </h2>

                                    {/* Row 1 */}
                                    <div className="flex gap-4">
                                        <div className="w-1/2">
                                            <label className="block text-[16px] font-semibold">First name</label>
                                            <input
                                                className="w-full mt-2 border border-gray-300 rounded-xl px-4 py-3 text-base"
                                                placeholder="Enter first name"
                                                value={student.studentFirstName}
                                                onChange={(e) =>
                                                    handleInputChange(index, 'studentFirstName', e.target.value)
                                                }
                                            />
                                        </div>
                                        <div className="w-1/2">
                                            <label className="block text-[16px] font-semibold">Last name</label>
                                            <input
                                                className="w-full mt-2 border border-gray-300 rounded-xl px-4 py-3 text-base"
                                                placeholder="Enter last name"
                                                value={student.studentLastName}
                                                onChange={(e) =>
                                                    handleInputChange(index, 'studentLastName', e.target.value)
                                                }
                                            />
                                        </div>
                                    </div>

                                    {/* Row 2 */}
                                    <div className="flex gap-4">
                                        <div className="w-1/2">
                                            <label className="block text-[16px] font-semibold">
                                                Date of birth
                                            </label>
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
                                                type="text"
                                                value={student.age}
                                                readOnly
                                                className="w-full mt-2 border border-gray-300 rounded-xl px-4 py-3 text-base"
                                                placeholder="Automatic entry"
                                            />
                                        </div>
                                    </div>


                                    {/* Row 3 */}
                                    <div className="flex gap-4">
                                        <div className="w-1/2">
                                            <label className="block text-[16px] font-semibold">Gender</label>
                                            <Select
                                                className="w-full mt-2 text-base"
                                                classNamePrefix="react-select"
                                                placeholder="Select gender"
                                                value={genderOptions.find((option) => option.value === student.gender) || null}
                                                onChange={(selectedOption) =>
                                                    handleInputChange(index, "gender", selectedOption ? selectedOption.value : "")
                                                }
                                                options={genderOptions}
                                            />
                                        </div>
                                        <div className="w-1/2">
                                            <label className="block text-[16px] font-semibold">
                                                Medical information
                                            </label>
                                            <Select
                                                options={[
                                                    { label: 'None', value: 'None' },
                                                    { label: 'Peanut Allergy', value: 'Peanut Allergy' },
                                                    { label: 'Asthma', value: 'Asthma' },
                                                ]}
                                                value={
                                                    student.medicalInformation
                                                        ? { label: student.medicalInformation, value: student.medicalInformation }
                                                        : null
                                                }
                                                onChange={(option) =>
                                                    handleInputChange(index, 'medicalInformation', option.value)
                                                }
                                                placeholder="Enter medical info"
                                                className="mt-2"
                                                classNamePrefix="react-select"
                                            />
                                        </div>
                                    </div>

                                    {/* Row 4 */}
                                    <div className="flex gap-4">
                                        <div className="w-1/2">
                                            <label className="block text-[16px] font-semibold">Class</label>
                                            <input
                                                type="text"
                                                value={singleClassSchedulesOnly?.className}
                                                readOnly
                                                className="w-full mt-2 border border-gray-300 rounded-xl px-4 py-3 text-base"
                                                placeholder="Automatic entry"
                                            />
                                        </div>
                                        <div className="w-1/2">
                                            <label className="block text-[16px] font-semibold">Time</label>
                                            <input
                                                type="text"
                                                value={singleClassSchedulesOnly?.startTime}
                                                readOnly
                                                className="w-full mt-2 border border-gray-300 rounded-xl px-4 py-3 text-base"
                                                placeholder="Automatic entry"
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <div className="space-y-6 ">
                            {parents.map((parent, index) => (
                                <motion.div
                                    key={parent.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                    className={`bg-white mb-10 p-6 rounded-3xl shadow-sm space-y-6 relative ${students.length < 1 ? "" : "mt-10"
                                        }`}                                >
                                    {/* Top Header Row */}
                                    <div className="flex justify-between  items-start">
                                        <h2 className="text-[20px] font-semibold">Parent information</h2>

                                        <div className="flex items-center gap-2">
                                            {index === 0 && (
                                                <button
                                                    onClick={handleAddParent}
                                                    disabled={parents.length >= 5}
                                                    className="text-white text-[14px] px-4 py-2 bg-blue-600 rounded-xl hover:bg-blue-700 disabled:opacity-50"
                                                >
                                                    Add Parent
                                                </button>
                                            )}
                                            {index > 0 && (
                                                <button
                                                    onClick={() => handleRemoveParent(parent.id)}
                                                    className="text-gray-500 hover:text-red-600"
                                                >
                                                    <X className="w-5 h-5" />
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Row 1 */}
                                    <div className="flex gap-4">
                                        <div className="w-1/2">
                                            <label className="block text-[16px] font-semibold">First name</label>
                                            <input
                                                className="w-full mt-2 border border-gray-300 rounded-xl px-4 py-3 text-base"
                                                placeholder="Enter first name"
                                                value={parent.parentFirstName}
                                                onChange={(e) => {
                                                    // Remove numbers if typed or pasted
                                                    const value = e.target.value.replace(/\d/g, "");
                                                    handleParentChange(index, "parentFirstName", value);
                                                }}
                                                onKeyPress={(e) => {
                                                    if (/\d/.test(e.key)) e.preventDefault(); // block typing numbers
                                                }}
                                            />
                                        </div>

                                        <div className="w-1/2">
                                            <label className="block text-[16px] font-semibold">Last name</label>
                                            <input
                                                className="w-full mt-2 border border-gray-300 rounded-xl px-4 py-3 text-base"
                                                placeholder="Enter last name"
                                                value={parent.parentLastName}
                                                onChange={(e) => {
                                                    // Remove numbers if typed or pasted
                                                    const value = e.target.value.replace(/\d/g, "");
                                                    handleParentChange(index, "parentLastName", value);
                                                }}
                                                onKeyPress={(e) => {
                                                    if (/\d/.test(e.key)) e.preventDefault(); // block typing numbers
                                                }}
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
                                                onChange={(e) => handleParentChange(index, "parentEmail", e.target.value)}
                                            />
                                        </div>
                                        <div className="w-1/2">
                                            <label className="block text-[16px] font-semibold">Phone number</label>
                                            <PhoneInput
                                                country={"gb"}
                                                value={parent.parentPhoneNumber}
                                                onChange={(val) => handleParentChange(index, "parentPhoneNumber", val)}
                                                inputClass="!w-full !h-full !border-0"
                                                containerClass="w-full mt-2 border border-gray-300 rounded-xl px-2 py-3 custom-phone"
                                                inputStyle={{ width: "100%", border: "none", height: "48px" }}
                                            />
                                        </div>
                                    </div>

                                    {/* Row 3 */}
                                    <div className="flex gap-4">
                                        <div className="w-1/2">
                                            <label className="block text-[16px] font-semibold">Relation to child</label>
                                            <Select
                                                options={relationOptions}
                                                placeholder="Select Relation"
                                                className="mt-2"
                                                classNamePrefix="react-select"
                                                value={relationOptions.find((o) => o.value === parent.relationToChild)}
                                                onChange={(selected) =>
                                                    handleParentChange(index, "relationToChild", selected.value)
                                                }
                                            />
                                        </div>
                                        <div className="w-1/2">
                                            <label className="block text-[16px] font-semibold">How did you hear about us?</label>
                                            <Select
                                                options={hearOptions}
                                                placeholder="Select from drop down"
                                                className="mt-2"
                                                classNamePrefix="react-select"
                                                value={hearOptions.find((o) => o.value === parent.howDidYouHear)}
                                                onChange={(selected) =>
                                                    handleParentChange(index, "howDidYouHear", selected.value)
                                                }
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                        <div className="bg-white p-6 rounded-3xl shadow-sm space-y-6">
                            <h2 className="text-[20px] font-semibold">Emergency contact details</h2>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={emergency.sameAsAbove}
                                    onChange={() =>
                                        setEmergency(prev => ({
                                            ...prev,
                                            sameAsAbove: !prev.sameAsAbove
                                        }))
                                    }
                                />
                                <label className="text-base font-semibold text-gray-700">
                                    Fill same as above
                                </label>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-1/2">
                                    <label className="block text-[16px] font-semibold">First name</label>
                                    <input
                                        className="w-full mt-2 border border-gray-300 rounded-xl px-4 py-3 text-base"
                                        placeholder="Enter first name"
                                        value={emergency.emergencyFirstName}
                                        onChange={e =>
                                            setEmergency(prev => ({
                                                ...prev,
                                                emergencyFirstName: e.target.value
                                            }))
                                        }
                                    />
                                </div>
                                <div className="w-1/2">
                                    <label className="block text-[16px] font-semibold">Last name</label>
                                    <input
                                        className="w-full mt-2 border border-gray-300 rounded-xl px-4 py-3 text-base"
                                        placeholder="Enter last name"
                                        value={emergency.emergencyLastName}
                                        onChange={e =>
                                            setEmergency(prev => ({
                                                ...prev,
                                                emergencyLastName: e.target.value
                                            }))
                                        }
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-1/2">
                                    <label className="block text-[16px] font-semibold">Phone number</label>
                                    <PhoneInput
                                        country={'gb'}
                                        value={emergency.emergencyPhoneNumber}
                                        onChange={value =>
                                            setEmergency(prev => ({
                                                ...prev,
                                                emergencyPhoneNumber: value
                                            }))
                                        }
                                        inputClass="!w-full !h-full !border-0"
                                        containerClass="w-full mt-2 border border-gray-300 rounded-xl px-2 py-3"
                                        inputStyle={{ width: '100%', border: 'none', height: '48px' }}
                                    />
                                </div>
                                <div className="w-1/2">
                                    <label className="block text-[16px] font-semibold">Relation to child</label>
                                    <Select
                                        options={relationOptions}
                                        value={relationOptions.find(option => option.value === emergency.emergencyRelation)}
                                        onChange={selectedOption =>
                                            setEmergency(prev => ({
                                                ...prev,
                                                emergencyRelation: selectedOption?.value || ""
                                            }))
                                        }
                                        placeholder="Select Relation"
                                        className="mt-2"
                                        classNamePrefix="react-select"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="w-full my-10">
                            {/* Placeholder (acts like a select box) */}
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

                            {/* Options (bullet style) */}
                            {isOpen && (
                                <div className="mt-3 space-y-2 e sha rounded-xl p-3 bo0">
                                    {keyInfoOptions.map((option) => (
                                        <div
                                            key={option.value}
                                            className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition 
          ${selectedKeyInfo === option.value
                                                    ? ""
                                                    : "hover:bg-gray-50 border border-transparent"
                                                }`}
                                            onClick={() => {
                                                setSelectedKeyInfo(option.value);
                                                // close after select
                                            }}
                                        >
                                            {/* Custom Bullet */}
                                            <span
                                                className={`w-3 h-3 rounded-full bg-gradient-to-r 
            ${selectedKeyInfo === option.value
                                                        ? "from-blue-500 to-blue-400 shadow-sm"
                                                        : "from-gray-400 to-gray-300"
                                                    }`}
                                            ></span>

                                            {/* Label */}
                                            <span
                                                className={`${selectedKeyInfo === option.value
                                                        ? "font-semibold text-blue-700"
                                                        : "text-gray-700"
                                                    }`}
                                            >
                                                {option.label}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>


                        <div className="bg-white mb-10 rounded-3xl p-6 space-y-4">
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
                        <div className="flex justify-end  pb-10 gap-4">
                            <button
                                type="button"
                                className="flex items-center justify-center gap-1 border border-[#717073] text-[#717073] px-12 text-[18px]  py-2 rounded-lg font-semibold bg-none"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="bg-[#237FEA] text-white  text-[18px]  font-semibold border  border-[#237FEA] px-6 py-3 rounded-lg"
                            >
                                {isSubmitting ? "Submitting..." : "Book FREE Trial"}

                            </button>

                        </div>


                    </div>
                </div>

            </div>

        </div>
    );
};

export default List;
