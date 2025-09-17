import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Check, X, ChevronLeft, ChevronRight } from "lucide-react";
import { FiSearch } from "react-icons/fi";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { format } from "date-fns";
import { evaluate } from "mathjs";
import PhoneInput from "react-phone-input-2";
import DatePicker from "react-datepicker";
import Select from "react-select";

import PlanTabs from "../PlanTabs";
import Loader from "../../../../contexts/Loader";
import { useVenue } from "../../../../contexts/VenueContext";
import { usePayments } from "../../../../contexts/PaymentPlanContext";
import { useTermContext } from "../../../../contexts/termDatesSessionContext";
import { useClassSchedule } from "../../../../contexts/ClassScheduleContent";
import { useBookFreeTrial } from "../../../../contexts/BookAFreeTrialContext";

import "react-datepicker/dist/react-datepicker.css";
import "react-phone-input-2/lib/style.css";

const List = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { createBookMembership, createBookMembershipByfreeTrial } = useBookFreeTrial()
    const [expression, setExpression] = useState('');
    const [numberOfStudents, setNumberOfStudents] = useState('1')

    const [result, setResult] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const { classId, TrialData } = location.state || {};
    const popup1Ref = useRef(null);
    const popup2Ref = useRef(null);
    const popup3Ref = useRef(null);
    const [showPopup, setShowPopup] = useState(false);
    const [directDebitData, setDirectDebitData] = useState([]);
    const [payment, setPayment] = useState({
        firstName: "",
        lastName: "",
        email: "",
        billingAddress: "",
        referenceId: "",
        cardHolderName: "",
        cv2: "",
        expiryDate: "",
        pan: "",
        authorise: false,
    });
    console.log('TrialData', TrialData)
    console.log('classId', classId)
    const { fetchFindClassID, singleClassSchedulesOnly } = useClassSchedule() || {};
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
    const [emergency, setEmergency] = useState({
        sameAsAbove: false,
        emergencyFirstName: "",
        emergencyLastName: "",
        emergencyPhoneNumber: "",
        emergencyRelation: "",
    });
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
    const finalClassId = classId || TrialData?.classScheduleId;
    const allPaymentPlans =
        singleClassSchedulesOnly?.venue?.paymentPlans?.map((plan) => ({
            label: `${plan.title} (${plan.students} student${plan.students > 1 ? "s" : ""})`,
            value: plan.id,
            joiningFee: plan.joiningFee,
            all: plan,
        })) || [];
    const paymentPlanOptions = numberOfStudents
        ? allPaymentPlans.filter((plan) => plan.all.students === Number(numberOfStudents))
        : allPaymentPlans;


    const handleNumberChange = (e) => {
        const val = e.target.value === "" ? "" : Number(e.target.value);
        if (val === "" || [1, 2, 3].includes(val)) {
            setNumberOfStudents(val);

            // If currently selected plan doesn't match new number, reset it
            if (membershipPlan && membershipPlan.all.students !== val) {
                setMembershipPlan(null);
            }
        }
    };
    const handlePlanChange = (plan) => {
        setMembershipPlan(plan);
        if (plan) {
            setNumberOfStudents(plan.all.students); // Update numberOfStudents to match plan
        }
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
    useEffect(() => {
        if (paymentPlanOptions.length) {
            setMembershipPlan(paymentPlanOptions[0]);
        }
    }, [singleClassSchedulesOnly]);

    useEffect(() => {
        if (TrialData) {
            console.log('stp1')
            if (Array.isArray(TrialData.students) && TrialData.students.length > 0) {
                console.log('stp2')
                setStudents(TrialData.students);
            }
            console.log('stp3')
            if (Array.isArray(TrialData.parents) && TrialData.parents.length > 0) {
                setParents(
                    TrialData.parents.map((p, idx) => ({
                        id: idx + 1,
                        ...p,
                    }))
                );
            }
            if (Array.isArray(TrialData.emergency) && TrialData.emergency.length > 0) {
                setEmergency({
                    sameAsAbove: false,
                    ...TrialData.emergency[0],
                });
            }
        }
    }, [TrialData]);
    console.log('TrialData', students)

    useEffect(() => {
        if (!finalClassId) {
            navigate("/configuration/weekly-classes/find-a-class", { replace: true });
        }
    }, [finalClassId, navigate]);

    useEffect(() => {
        const fetchData = async () => {
            if (finalClassId) {
                await fetchFindClassID(finalClassId);
            }
        };
        fetchData();
    }, [finalClassId, fetchFindClassID]);
    const [activePopup, setActivePopup] = useState(null);
    const togglePopup = (id) => {
        setActivePopup((prev) => (prev === id ? null : id));
    };
    const [openForm, setOpenForm] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedPlans, setSelectedPlans] = useState([]);
    const [congestionNote, setCongestionNote] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [membershipPlan, setMembershipPlan] = useState(null);
    const today = new Date();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [fromDate, setFromDate] = useState(new Date(currentDate.getFullYear(), currentDate.getMonth(), 11));
    const [toDate, setToDate] = useState(null);

    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();


    const [clickedIcon, setClickedIcon] = useState(null);
    const [selectedKeyInfo, setSelectedKeyInfo] = useState(null);
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const { venues, isEditVenue, setIsEditVenue, deleteVenue, fetchVenues, loading } = useVenue() || {};
    const [selectedUserIds, setSelectedUserIds] = useState([]);
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
    const handleCancel = () => {
        Swal.fire({
            title: "Are you sure?",
            text: "Your changes will not be saved!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, leave",
            cancelButtonText: "Stay here",
        }).then((result) => {
            if (result.isConfirmed) {
                navigate("/configuration/weekly-classes/find-a-class");
            }
        });
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



    const handleInputChange = (index, field, value) => {
        const updatedStudents = [...students];
        updatedStudents[index][field] = value;
        setStudents(updatedStudents);
    };





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

        const filteredPayment = Object.fromEntries(
            Object.entries(payment || {}).filter(
                ([, value]) => value !== null && value !== "" && value !== undefined
            )
        );

        // Transform payment fields
        const transformedPayment = { ...filteredPayment };

        // Handle expiry date
        if (transformedPayment.expiryDate || transformedPayment["expiry date"]) {
            const rawExpiry =
                transformedPayment.expiryDate || transformedPayment["expiry date"];
            transformedPayment.expiryDate = rawExpiry.replace("/", ""); // "12/12" -> "1212"
            delete transformedPayment["expiry date"]; // remove old key if exists
        }

        // Handle PAN
        if (transformedPayment.pan) {
            transformedPayment.pan = transformedPayment.pan.replace(/\s+/g, ""); // remove spaces
        }

        setIsSubmitting(true);

        const payload = {
            venueId: singleClassSchedulesOnly?.venue?.id,
            classScheduleId: singleClassSchedulesOnly?.id,
            startDate: selectedDate,
            totalStudents: students.length,
            keyInformation: selectedKeyInfo,
            students,
            parents,
            emergency,
            paymentPlanId: membershipPlan?.value ?? null, // only value

            ...(Object.keys(transformedPayment).length > 0 && { payment: transformedPayment }),
        };
        try {
            if (TrialData) {
                await createBookMembershipByfreeTrial(payload, TrialData.id);
            } else {
                await createBookMembership(payload);
            }
            console.log("Final Payload:", JSON.stringify(payload, null, 2));
            // Optionally show success alert or reset form
        } catch (error) {
            console.error("Error while submitting:", error);
            // Optionally show error alert
        } finally {
            setIsSubmitting(false); // Stop loading
        }
        console.log("Final Payload:", JSON.stringify(payload, null, 2));
        // send to API with fetch/axios
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
        if (singleClassSchedulesOnly?.venue?.paymentPlans?.length > 0) {
            const cleanedPlans = singleClassSchedulesOnly.venue.paymentPlans.map(plan => ({
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
    }, [singleClassSchedulesOnly]);

    // ✅ now it runs when data is fetched


    const buttons = [
        ['AC', '±', '%', '÷',],
        ["7", "8", "9", "×"],
        ["4", "5", "6", "−"],
        ["1", "2", "3", "+"],
        ["", "0", ".", "="],

    ];
    const relationOptions = [
        { value: "Mother", label: "Mother" },
        { value: "Father", label: "Father" },
        { value: "Guardian", label: "Guardian" },
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
    const genderOptions = [
        { value: "male", label: "Male" },
        { value: "female", label: "Female" },
        { value: "other", label: "Other" },
    ];
    if (loading) return <Loader />;

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
                        Book a Membership
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
                        <h2 className="text-[24px] font-semibold">   Information</h2>
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
                                    onChange={handleNumberChange}
                                    placeholder="Choose number of students"
                                    className="w-full border border-gray-300 rounded-xl px-3 text-[16px] py-3 focus:outline-none"
                                />

                            </div>
                        </div>
                        <div className="mb-5">
                            <label htmlFor="" className="text-base font-semibold">Membership Plan </label>
                            <div className="relative mt-2 ">

                                <Select
                                    options={paymentPlanOptions}
                                    value={membershipPlan}
                                    onChange={handlePlanChange}
                                    placeholder="Choose Plan"
                                    className="mt-2"
                                    classNamePrefix="react-select"
                                    isClearable
                                    isDisabled={!numberOfStudents}
                                />

                            </div>
                        </div>
                        <div className="mb-5">
                            <label htmlFor="" className="text-base font-semibold">Joining Fee</label>
                            <div className="relative mt-2 ">
                                <input
                                    type="text"
                                    placeholder="Choose Joining fee"
                                    value={membershipPlan?.joiningFee != null ? `£${membershipPlan.joiningFee}` : ""}
                                    readOnly
                                    className="w-full border border-gray-300 rounded-xl px-3 text-[16px] py-3  focus:outline-none"
                                />
                                {/* <Select
                                    options={[{ label: "None", value: "none" }]} // Replace with your relationOptions
                                    value={null}
                                    onChange={() => { }}
                                    placeholder="Choose Joining fee"
                                    className="mt-2"
                                    classNamePrefix="react-select"
                                /> */}

                            </div>
                        </div>
                    </div>

                    <div className="space-y-3 bg-white p-6 rounded-3xl shadow-sm ">
                        <div className="">
                            <h2 className="text-[24px] font-semibold">Select start date </h2>
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

                    <div className="w-full max-w-xl mx-auto">
                        <button
                            type="button"
                            disabled={!membershipPlan}
                            onClick={() => setIsOpen(!isOpen)}
                            className={`bg-[#237FEA] text-white text-[18px]  font-semibold border w-full border-[#237FEA] px-6 py-3 rounded-lg flex items-center justify-center  ${membershipPlan
                                ? "bg-[#237FEA] border border-[#237FEA]"
                                : "bg-gray-400 border-gray-400 cursor-not-allowed"
                                }`}
                        >
                            Membership Plan Breakdown

                            <img
                                src={isOpen ? "/demo/synco/members/dash.png" : "/demo/synco/members/add.png"}
                                alt={isOpen ? "Collapse" : "Expand"}
                                className="ml-2 w-5 h-5 inline-block"
                            />

                        </button>

                        {isOpen && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="bg-white mt-4 rounded-2xl shadow p-6   font-semibold  space-y-4 text-[16px]"
                            >
                                <div className="flex justify-between text-[#333]">
                                    <span>Membership Plan</span>
                                    <span>
                                        {membershipPlan.all.duration} {membershipPlan.all.interval}
                                        {membershipPlan.all.duration > 1 ? 's' : ''}
                                    </span>
                                </div>
                                <div className="flex justify-between text-[#333]">
                                    <span>Monthly Subscription Fee</span>
                                    <span>£{membershipPlan.all.priceLesson} p/m</span>
                                </div>
                                <div className="flex justify-between text-[#333]">
                                    <span>One-off Joining Fee</span>
                                    <span>£{membershipPlan.all.joiningFee}</span>
                                </div>
                                <div className="flex justify-between text-[#333]">
                                    <span>Number of lessons pro-rated</span>
                                    <span>2</span>
                                </div>
                                <div className="flex justify-between text-[#333]">
                                    <span>Price per class per child</span>
                                    <span>£11.33</span>
                                </div>
                                <div className="flex justify-between text-[#000]">
                                    <span>Cost of pro-rated lessons</span>
                                    <span>£23.66</span>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>

                <div className="flex-1 bg-white transition-all duration-300">
                    <div className="max-w-full mx-auto bg-[#f9f9f9] px-6 ">

                        <div className="space-y-10">
                            {students.map((student, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: index * 0.1 }}
                                    className="bg-white p-6 rounded-3xl shadow-sm space-y-6"
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
                                                Date of Birth
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
                                                minDate={new Date(new Date().setFullYear(new Date().getFullYear() - 100))} // Max age: 100 years
                                                placeholderText="Select date of birth"

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
                                                placeholder="Select medical info"
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
                                        }`}
                                >
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
                                                    // Allow only alphabets and spaces
                                                    const value = e.target.value.replace(/[^A-Za-z\s]/g, "");
                                                    handleParentChange(index, "parentFirstName", value);
                                                }}
                                                onKeyPress={(e) => {
                                                    if (!/[A-Za-z\s]/.test(e.key)) e.preventDefault(); // block numbers & special chars
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
                                                    // Allow only alphabets and spaces
                                                    const value = e.target.value.replace(/[^A-Za-z\s]/g, "");
                                                    handleParentChange(index, "parentLastName", value);
                                                }}
                                                onKeyPress={(e) => {
                                                    if (!/[A-Za-z\s]/.test(e.key)) e.preventDefault(); // block numbers & special chars
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
                            <Select
                                options={keyInfoOptions}
                                value={keyInfoOptions.find(option => option.value === selectedKeyInfo)}
                                onChange={(selectedOption) => setSelectedKeyInfo(selectedOption?.value || '')}
                                placeholder="Key Information"
                                className="react-select-container text-[20px]"
                                classNamePrefix="react-select"
                                styles={{
                                    control: (base, state) => ({
                                        ...base,
                                        borderRadius: '1rem',
                                        borderColor: state.isFocused ? '#ccc' : '#E5E7EB',
                                        boxShadow: 'none',
                                        padding: '8px 8px',
                                        minHeight: '48px',
                                    }),
                                    placeholder: (base) => ({
                                        ...base,
                                        color: '#000000ff',
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
                                onClick={handleCancel}

                                type="button"
                                className="flex items-center justify-center gap-1 border border-[#717073] text-[#717073] px-12 text-[18px]  py-2 rounded-lg font-semibold bg-none"
                            >
                                Cancel
                            </button>


                            <button
                                type="button"
                                onClick={() => {
                                    if (!membershipPlan || !selectedDate) {
                                        let msg = "";
                                        if (!membershipPlan && !selectedDate) msg = "Please select Membership Plan and  Date";
                                        else if (!membershipPlan) msg = "Please select Membership Plan";
                                        else if (!selectedDate) msg = "Please select  Date";

                                        Swal.fire({
                                            icon: "warning",
                                            title: "Required Fields",
                                            text: msg,
                                        });
                                        return;
                                    }

                                    // If both are selected, proceed
                                    setShowPopup(true);
                                }}
                                className={`text-white font-semibold text-[18px] px-6 py-3 rounded-lg ${isSubmitting || membershipPlan && selectedDate
                                    ? "bg-[#237FEA] border border-[#237FEA]"
                                    : "bg-gray-400 border-gray-400 cursor-not-allowed"
                                    }`}
                            >
                                {isSubmitting ? "Submitting..." : "Setup Direct Debit"}
                            </button>


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
                        {showPopup && (
                            <div className="fixed inset-0 bg-[#00000066] flex justify-center items-center z-50">
                                <div className="bg-white rounded-2xl max-w-[541px] min-w-[541px] max-h-[90%] overflow-y-scroll space-y-6 relative scrollbar-hide">
                                    <button
                                        className="absolute top-3 p-6 left-4 text-xl font-bold"
                                        onClick={() => setShowPopup(false)}
                                    >
                                        <img src="/demo/synco/icons/cross.png" alt="Close" />
                                    </button>

                                    <div className="text-center">
                                        <h2 className="font-semibold  text-[24px] mb-2 py-6  border-b border-gray-400 ">Direct Debit Details</h2>

                                    </div>
                                    <div className="text-left directDebitBg p-6 mb-4 m-6 rounded-2xl ">
                                        <p className="text-white text-[16px]">{membershipPlan?.label || ''}</p>
                                        <p className="font-bold text-white text-[24px]">
                                            {membershipPlan?.joiningFee != null && `£${membershipPlan?.joiningFee}`}
                                        </p>
                                    </div>
                                    <div className="space-y-2 px-6 pb-6">
                                        <h3 className="font-semibold text-[20px]">Personal Details</h3>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <label className="block text-[16px] font-semibold">First name</label>
                                                <input
                                                    className="w-full mt-2 border border-gray-300 rounded-xl px-4 py-3 text-base"
                                                    type="text"
                                                    value={payment.firstName}
                                                    onChange={(e) => setPayment({ ...payment, firstName: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[16px] font-semibold">Last name </label>
                                                <input
                                                    type="text"
                                                    className="w-full mt-2 border border-gray-300 rounded-xl px-4 py-3 text-base"
                                                    value={payment.lastName}
                                                    onChange={(e) => setPayment({ ...payment, lastName: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-[16px] font-semibold">Email address </label>
                                            <input
                                                type="email"
                                                className="w-full mt-2 border border-gray-300 rounded-xl px-4 py-3 text-base"
                                                value={payment.email}
                                                onChange={(e) => setPayment({ ...payment, email: e.target.value })}
                                            />
                                        </div>       <div>
                                            <label className="block text-[16px] font-semibold">Billing address </label>
                                            <input
                                                type="text"
                                                className="w-full mt-2 border border-gray-300 rounded-xl px-4 py-3 text-base"
                                                value={payment.billingAddress}
                                                onChange={(e) => setPayment({ ...payment, billingAddress: e.target.value })}
                                            />
                                        </div>

                                        <h3 className="font-semibold text-[20px] pt-2">Bank Details</h3>

                                        <div className="flex gap-6 mt-3">
                                            <label className="flex items-center gap-2">
                                                <input
                                                    type="radio"
                                                    name="paymentType"
                                                    value="rrn"
                                                    checked={payment.paymentType === "rrn"}
                                                    onChange={(e) => setPayment({ ...payment, paymentType: e.target.value })}
                                                />
                                                <span>Gocardless</span>
                                            </label>
                                            <label className="flex items-center gap-2">
                                                <input
                                                    type="radio"
                                                    name="paymentType"
                                                    value="card"
                                                    checked={payment.paymentType === "card"}
                                                    onChange={(e) => setPayment({ ...payment, paymentType: e.target.value })}
                                                />
                                                <span>Access Pay Suite</span>
                                            </label>
                                        </div>


                                        {payment.paymentType === "rrn" && (
                                            <div className="mt-4">
                                                <label className="block text-[16px] font-semibold">Reference Number</label>
                                                <input
                                                    required={payment.paymentType === "rrn"}
                                                    type="text"
                                                    placeholder="Enter Reference No."
                                                    className="w-full mt-2 border border-gray-300 rounded-xl px-4 py-3 text-base"
                                                    value={payment.referenceId}
                                                    onChange={(e) =>
                                                        setPayment({
                                                            ...payment,
                                                            referenceId: e.target.value, // ✅ allow all input
                                                        })
                                                    }
                                                />
                                            </div>
                                        )}
                                        {payment.paymentType === "card" && (
                                            <div className="mt-5">
                                                <div>
                                                    <label className="block text-[16px] font-semibold">Card Holder Name</label>
                                                    <input
                                                        required={payment.paymentType === "card"}
                                                        type="text"
                                                        placeholder=""
                                                        className="w-full mt-2 border border-gray-300 rounded-xl px-4 py-3 text-base"
                                                        value={payment.cardHolderName}
                                                        onChange={(e) =>
                                                            setPayment({
                                                                ...payment,
                                                                cardHolderName: e.target.value, // ✅ no filtering
                                                            })
                                                        }
                                                    />
                                                </div>
                                                <div class="flex gap-4">
                                                    <div class="w-full">
                                                        <label className="block text-[16px] font-semibold">Expiry Date</label>

                                                        <input
                                                            required={payment.paymentType === "card"}
                                                            type="text"
                                                            inputMode="numeric"
                                                            placeholder="MM/YY"
                                                            maxLength={5}
                                                            className="w-full mt-2 border border-gray-300 rounded-xl px-4 py-3 text-base"
                                                            value={payment.expiryDate}
                                                            onChange={(e) => {
                                                                let value = e.target.value.replace(/\D/g, ""); // only digits
                                                                if (value.length >= 3) {
                                                                    value = value.slice(0, 2) + "/" + value.slice(2, 4);
                                                                }
                                                                setPayment({ ...payment, expiryDate: value });
                                                            }}
                                                        />
                                                    </div>
                                                    <div class="w-full">

                                                        <label className="block text-[16px] font-semibold">CV2</label>

                                                        <input
                                                            required={payment.paymentType === "card"}
                                                            type="password"
                                                            inputMode="numeric"
                                                            placeholder="123"
                                                            maxLength={4} // 3 (Visa/MC) or 4 (Amex)
                                                            className="w-full mt-2 border border-gray-300 rounded-xl px-4 py-3 text-base"
                                                            value={payment.cv2}
                                                            onChange={(e) =>
                                                                setPayment({
                                                                    ...payment,
                                                                    cv2: e.target.value.replace(/\D/g, ""), // only digits
                                                                })
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                                <div className="mt-4">
                                                    <label className="block text-[16px] font-semibold">PAN</label>
                                                    <input
                                                        type="text"
                                                        required={payment.paymentType === "card"}
                                                        inputMode="numeric"
                                                        placeholder="**** **** **** ****"
                                                        maxLength={19}
                                                        className="w-full mt-2 border border-gray-300 rounded-xl px-4 py-3 text-base tracking-widest"
                                                        value={payment.pan}
                                                        onChange={(e) => {
                                                            let value = e.target.value.replace(/\D/g, ""); // only digits
                                                            value = value.replace(/(.{4})/g, "$1 ").trim(); // format as XXXX XXXX XXXX XXXX
                                                            setPayment({ ...payment, pan: value });
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                        <div className="flex items-center space-x-2 pt-2">
                                            <input
                                                type="checkbox"
                                                className=" border border-gray-300 rounded-xl px-4 py-3 text-base"

                                                checked={payment.authorise}
                                                onChange={(e) => setPayment({ ...payment, authorise: e.target.checked })}
                                            />
                                            <label className="block text-[16px] font-semibold">I can authorise Direct Debits on this account myself</label>
                                        </div>
                                    </div>
                                    <div className="w-full mx-auto flex justify-center" >
                                        <button
                                            type="button"
                                            disabled={
                                                isSubmitting || // disable while submitting
                                                !payment.authorise ||
                                                (payment.paymentType === "rrn" && !payment.referenceId) ||
                                                (payment.paymentType === "card" &&
                                                    (!payment.cardHolderName || !payment.expiryDate || !payment.cv2 || !payment.pan))
                                            }
                                            onClick={async () => {
                                                setIsSubmitting(true); // start loading
                                                try {
                                                    setDirectDebitData([...directDebitData, payment]);
                                                    setShowPopup(false);
                                                    await handleSubmit(payment); // await if handleSubmit is async
                                                } finally {
                                                    setIsSubmitting(false); // stop loading after submit
                                                }
                                            }}
                                            className={`w-full max-w-[90%] mx-auto my-3 text-white text-[16px] py-3 rounded-lg font-semibold ${isSubmitting ||
                                                !payment.authorise ||
                                                (payment.paymentType === "rrn" && !payment.referenceId) ||
                                                (payment.paymentType === "card" &&
                                                    (!payment.cardHolderName || !payment.expiryDate || !payment.cv2 || !payment.pan))
                                                ? "bg-gray-400 cursor-not-allowed"
                                                : "bg-[#237FEA] cursor-pointer"
                                                }`}
                                        >
                                            {isSubmitting ? "Submitting..." : "Set up Direct Debit"}
                                        </button>

                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

            </div>

        </div>
    );
};

export default List;
