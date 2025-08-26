import React, { useEffect, useState } from 'react';
import Create from '../Create';
import { Check } from "lucide-react";
import Loader from '../../../../contexts/Loader';
import { useVenue } from '../../../../contexts/VenueContext';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { useLocation, useNavigate } from "react-router-dom";
import { useClassSchedule } from '../../../../contexts/ClassScheduleContent';
import { useSearchParams } from "react-router-dom";
import Swal from "sweetalert2"; // make sure it's installed

const List = () => {
    const navigate = useNavigate();

    const [searchParams] = useSearchParams();
    const venueId = searchParams.get("id");
    const [sessionStates, setSessionStates] = useState({});
    const [openDropdownSessionId, setOpenDropdownSessionId] = useState(null);



    const { fetchClassSchedules, createClassSchedules, updateClassSchedules, fetchClassSchedulesID, singleClassSchedules, classSchedules, loading, deleteClassSchedule } = useClassSchedule()
    useEffect(() => {
        const fetchData = async () => {
            await fetchClassSchedules();

            if (!venueId) {
                navigate(`/configuration/weekly-classes/venues/`);
                return; // Prevent further execution if no venueId
            }

            await fetchClassSchedulesID(venueId);
        };

        fetchData();
    }, [fetchClassSchedules, venueId, navigate, fetchClassSchedulesID]);

    const filteredSchedules = classSchedules.filter(
        (item) => item.venueId == venueId
    );

    console.log('Filtered Class Schedules:', classSchedules);
    const formatDateToTimeString = (date) => {
        if (!date) return "";
        return format(date, "h:mm aa");
    };


    const [openTerms, setOpenTerms] = useState({});

    const [showModal, setShowModal] = useState(false);
    const [clickedIcon, setClickedIcon] = useState(null);
    const handleIconClick = (icon) => {
        setClickedIcon(icon);
        setShowModal(true);
    };
    const handleEditClick = (classItem) => {
        setFormData(classItem);
        setIsEditing(true);
        setOpenForm(true);
    };
    const toggleTerm = (termId) => {
        setOpenTerms((prev) => ({
            ...prev,
            [termId]: !prev[termId],
        }));
    };

    const [openClassIndex, setOpenClassIndex] = useState(null);

    const toggleSessions = (index) => {
        setOpenClassIndex(openClassIndex === index ? null : index);
    };
    // Reset for new form
    const handleAddNew = () => {
        setFormData({})
        setIsEditing(false);
        setOpenForm(true);
    };

    const [isEditing, setIsEditing] = useState(false);
    const [value, setValue] = useState('Some text');
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const { venues, isEditVenue, setIsEditVenue, fetchVenues } = useVenue()
    const [formData, setFormData] = useState({
        className: '',
        capacity: '',
        day: '',
        startTime: null,
        endTime: null,
        allowFreeTrial: false
    });
    const [selectedUserIds, setSelectedUserIds] = useState([]);
    const toggleCheckbox = (userId) => {
        setSelectedUserIds((prev) =>
            prev.includes(userId)
                ? prev.filter((id) => id !== userId)
                : [...prev, userId]
        );
    };
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const handleChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleSave = () => {
        const payload = {
            ...formData,
            venueId: venueId
        };
        createClassSchedules(payload);
        setFormData({})

        setOpenForm(false);
    };
    const handleEdit = (id) => {
        const payload = {
            ...formData,
            venueId: venueId
        };
        updateClassSchedules(id, payload);
        setFormData({})

        setOpenForm(false);
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


    const [openForm, setOpenForm] = useState(false);
    useEffect(() => {
        fetchVenues();
    }, [fetchVenues]);
    const handleDeleteClick = (item) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'This action will delete the schedule permanently!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
        }).then((result) => {
            if (result.isConfirmed) {
                deleteClassSchedule(item); // only called after confirmation
                Swal.fire({
                    icon: 'success',
                    title: 'Deleted!',
                    text: 'The class schedule has been deleted.',
                    timer: 1500,
                    showConfirmButton: false,
                });
            }
        });
    };


    const handleSessionMapChange = (sessionId, value, sessionMaps) => {
        const [date, groupName] = value.split('|||');
        const matched = sessionMaps.find(
            (s) => s.sessionDate === date && s.sessionPlan.groupName === groupName
        );

        setSessionStates((prev) => ({
            ...prev,
            [sessionId]: {
                selectedKey: value,
                selectedSessionMap: matched,
            },
        }));
    };

    if (loading) {
        return (
            <>
                <Loader />
            </>
        )
    }
    const parseTimeStringToDate = (timeString) => {
        if (!timeString || typeof timeString !== "string") return null;

        const match = timeString.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
        if (!match) return null;

        let [_, hoursStr, minutesStr, meridian] = match;
        let hours = parseInt(hoursStr, 10);
        const minutes = parseInt(minutesStr, 10);

        if (meridian.toUpperCase() === "PM" && hours !== 12) {
            hours += 12;
        }
        if (meridian.toUpperCase() === "AM" && hours === 12) {
            hours = 0;
        }

        const date = new Date();
        date.setHours(hours, minutes, 0, 0);
        return date;
    };

    console.log('singleClassSchedules', singleClassSchedules)
    console.log("filteredSchedules", filteredSchedules)
    console.log('formData', formData)
    return (
        <div className="pt-1 bg-gray-50 min-h-screen">
            <div className={`md:flex pe-4 justify-between items-center mb-4 w-full`}>
                <h2 className="text-[28px] font-semibold">Class Schedule</h2>
                <button
                    onClick={() => handleAddNew()}
                    className="bg-[#237FEA] flex items-center gap-2 cursor-pointer text-white px-4 py-[10px] rounded-xl hover:bg-blue-700 text-[16px] font-semibold"
                >
                    <img src="/demo/synco/members/add.png" className='w-5' alt="" /> Add a Class
                </button>
            </div>

            <div className="md:flex gap-6">
                <div
                    className={`transition-all duration-300 w-full `}>
                    {
                        venues.length > 0 ? (

                            <div className="bg-white rounded-3xl p-6 shadow">
                                <h2 className="font-semibold text-lg text-[18px]">{singleClassSchedules.name || null}</h2>
                                <p className="text-[14px]   mb-4 border-b pb-4 border-gray-200">{singleClassSchedules.address || null}</p>

                                {filteredSchedules.map((item, index) => (
                                    <>
                                        <div
                                            key={index}
                                            className={`flex flex-col md:flex-row justify-between items-center border ${item.highlight ? "border-red-400" : "border-gray-200"
                                                } rounded-xl px-4  pr-16 py-4 mb-3 hover:shadow transition`}
                                        >
                                            {/* Class info block */}
                                            <div className="grid grid-cols-2 md:grid-cols-8 gap-4 w-full text-sm">
                                                <div>
                                                    <p className="font-semibold text-[16px]">Class +{index + 1}</p>
                                                    <p className="text-xs font-semibold text-[16px]">{item.className}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[#717073] font-semibold text-[16px]">Capacity</p>
                                                    <p className="font-semibold text-[#717073]  text-[16px]">{item.capacity}</p>
                                                </div>
                                                <div className='text-[#717073] font-semibold text-[16px]'>
                                                    <p className="text-[#717073]">Day</p>
                                                    <p className="font-semibold">{item.day}</p>
                                                </div>
                                                <div className='text-[#717073] font-semibold text-[16px]'>
                                                    <p className="text-[#717073]">Start time</p>
                                                    <p className="font-semibold">{item.startTime}</p>
                                                </div>
                                                <div className='text-[#717073]  font-semibold text-[16px]'>
                                                    <p className="text-[#717073]">End time</p>
                                                    <p className="font-semibold">{item.endTime}</p>
                                                </div>
                                                <div className='text-[#717073]  font-semibold text-[16px]'>
                                                    <p className="text-[#717073]">Free Trials?</p>
                                                    <p className="font-semibold">{item.allowFreeTrial == true ? 'yes' : 'no'}</p>
                                                </div>
                                                <div className='text-[#717073] font-semibold  text-[16px]'>
                                                    <p className="text-[#717073]">Facility</p>
                                                    <p className="font-semibold">{singleClassSchedules.facility || 'null'}</p>
                                                </div>
                                            </div>

                                            {/* Icons + Button */}
                                            <div className="flex items-center mt-4 md:mt-0 gap-4">
                                                <img
                                                    src="/demo/synco/icons/edit.png"
                                                    alt="Edit"
                                                    className="w-6 h-6 cursor-pointer"
                                                    onClick={() => handleEditClick(item)}
                                                />
                                                <img
                                                    className=" cursor-pointer"
                                                    onClick={() => handleDeleteClick(item.id)}
                                                    src="/demo/synco/icons/deleteIcon.png"
                                                    alt="Delete"
                                                />

                                                <button onClick={() => toggleSessions(index)} className="ml-4 flex font-semibold items-center gap-2 whitespace-nowrap px-4 pr-6 py-2 border rounded-xl text-[16px] font-medium text-[#237FEA] border-blue-500 hover:bg-blue-50">
                                                    {openClassIndex === index ? 'Hide sessions' : 'View sessions'}  <img src="/demo/synco/icons/bluearrowup.png" className={`${openClassIndex === index ? '' : 'rotate-180'} transition-transform`} alt="" />
                                                </button>
                                            </div>

                                        </div>
                                        <AnimatePresence>
                                            {openClassIndex === index && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                    className="overflow-hidden mt-4  rounded-xl"
                                                >
                                                    <div className="space-y-4">
                                                        {item.venue?.termGroups.map((term) => (
                                                            <div key={term.id} className=" rounded-xl w-full">
                                                                <div
                                                                    onClick={() => toggleTerm(term.id)}
                                                                    className="mb-4 mt-2 border-b border-gray-300 flex justify-between items-center cursor-pointer"
                                                                >

                                                                    <div className='flex mb-4 items-center gap-4 justify-start'>
                                                                        <div><img src="/demo/synco/icons/blackarrowup.png" className={`${openTerms[term.id] ? "" : "rotate-180"} transition-transform`} alt="" /></div>
                                                                        <div> <p className="font-semibold text-[16px] ">{term.name}</p>
                                                                            <p className="text-[14px] ">{term.date}</p>
                                                                        </div>
                                                                    </div>


                                                                </div>

                                                                <div
                                                                    className={`transition-all duration-300 overflow-hidden ${openTerms[term.id] ? "max-h-[1000px]" : "max-h-0"
                                                                        }`}
                                                                >
                                                                    {term.terms.map((session) => {
                                                                        const sessionMaps = session.sessionsMap || [];

                                                                        const sessionState = sessionStates[session.id] || {};

                                                                        const handleToggleDropdown = (sessionId) => {
                                                                            setSessionStates((prev) => ({
                                                                                ...prev,
                                                                                [sessionId]: {
                                                                                    ...prev[sessionId],
                                                                                    selectedKey: '',
                                                                                    selectedSessionMap: null,
                                                                                },
                                                                            }));

                                                                            setOpenDropdownSessionId((prevId) =>
                                                                                prevId === sessionId ? null : sessionId
                                                                            );
                                                                        };


                                                                        const handleSessionMapChange = (value) => {
                                                                            const [date, groupName] = value.split('|||');
                                                                            const matched = sessionMaps.find(
                                                                                (s) => s.sessionDate === date && s.sessionPlan.groupName === groupName
                                                                            );

                                                                            setSessionStates((prev) => ({
                                                                                ...prev,
                                                                                [session.id]: {
                                                                                    ...prev[session.id],
                                                                                    selectedKey: value,
                                                                                    selectedSessionMap: matched,
                                                                                },
                                                                            }));
                                                                        };

                                                                        const handleNavigate = () => {
                                                                            const selected = sessionStates[session.id]?.selectedSessionMap;
                                                                            if (selected) {
                                                                                navigate('/configuration/weekly-classes/venues/class-schedule/Sessions/pending', {
                                                                                    state: {
                                                                                        singleClassSchedules: singleClassSchedules,
                                                                                        sessionMap: selected,
                                                                                        sessionId: selected.sessionPlanId,
                                                                                    },
                                                                                });
                                                                            }
                                                                        };

                                                                        return (
                                                                            <div
                                                                                key={session.id}
                                                                                className="flex flex-col md:flex-row md:flex-wrap gap-2 md:gap-4 justify-between items-start md:items-center border-b border-gray-300 mb-3 px-4 md:px-8 py-3"
                                                                            >
                                                                                {/* Title and Date */}
                                                                                <div className="flex flex-col md:flex-row items-start md:items-center gap-1 md:gap-2 text-sm w-full md:w-auto">
                                                                                    <span className="text-[15px] font-semibold min-w-0 md:min-w-[200px]">{session.termName}</span>
                                                                                    <span className="text-[15px] min-w-0 md:min-w-[200px] text-gray-600">{session.startDate}</span>
                                                                                </div>

                                                                                {/* Status */}
                                                                                <div className="flex items-center gap-2 text-sm mt-2 md:mt-0 w-full md:w-auto">
                                                                                    <span className="rounded-full flex items-center gap-2 font-medium text-[15px]">
                                                                                        <img src="/demo/synco/icons/complete.png" className="w-4 h-4" alt="" />
                                                                                        {session.status || "Completed"}
                                                                                    </span>
                                                                                </div>

                                                                                {/* Action Buttons */}
                                                                                <div className="flex flex-col sm:flex-row gap-2 mt-3 md:mt-0 w-full md:w-auto">


                                                                                    {/* Step 2: Show dropdown and view button */}
                                                                                    <button
                                                                                        onClick={() => handleToggleDropdown(session.id)}
                                                                                        className="px-6 py-3 bg-[#237FEA]  text-white font-semibold rounded-xl shadow hover:shadow-lg hover:scale-[1.03] transition-all duration-300"
                                                                                    >
                                                                                        View Session Plan
                                                                                    </button>

                                                                                    {/* Animated Dropdown (Drawer style) */}
                                                                                    <AnimatePresence>
                                                                                        {openDropdownSessionId === session.id && (
                                                                                            <motion.div
                                                                                                initial={{ opacity: 0, y: -10 }}
                                                                                                animate={{ opacity: 1, y: 0 }}
                                                                                                exit={{ opacity: 0, y: -10 }}
                                                                                                transition={{ duration: 0.3 }}
                                                                                                style={{
                                                                                                    position: "absolute",
                                                                                                    opacity: 1,
                                                                                                    transform: "none",
                                                                                                    maxWidth: "400px"
                                                                                                }}
                                                                                                className="absolute z-50 mt-2  w-full md:w-1/3 bg-white border border-gray-200 rounded-xl shadow-xl p-4 space-y-4"
                                                                                            >
                                                                                                {/* Dropdown */}
                                                                                                <div>
                                                                                                    <div className="flex mb-4 justify-between">
                                                                                                        <label className="block text-sm font-medium text-gray-700 mb-1">Select {session.termName} Plan</label>

                                                                                                        <button onClick={handleToggleDropdown}>X</button></div>
                                                                                                    <select
                                                                                                        value={sessionState.selectedKey || ''}
                                                                                                        onChange={(e) => handleSessionMapChange(e.target.value)}
                                                                                                        className="border p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                                                                                                    >
                                                                                                        <option value="">-- Select --</option>
                                                                                                        {sessionMaps.map((s, i) => (
                                                                                                            <option
                                                                                                                key={i}
                                                                                                                value={`${s.sessionDate}|||${s.sessionPlan?.groupName}`}
                                                                                                            >
                                                                                                                {s.sessionDate} - {s.sessionPlan?.groupName}
                                                                                                            </option>
                                                                                                        ))}
                                                                                                    </select>
                                                                                                </div>

                                                                                                {/* View Button */}
                                                                                                <button
                                                                                                    onClick={handleNavigate}
                                                                                                    disabled={!sessionState.selectedSessionMap}
                                                                                                    className={`w-full px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${sessionState.selectedSessionMap
                                                                                                        ? 'bg-[#237FEA] text-white hover:bg-white hover:text-[#237FEA] border border-[#237FEA]'
                                                                                                        : 'bg-gray-300 text-white cursor-not-allowed'
                                                                                                        }`}
                                                                                                >
                                                                                                    View
                                                                                                </button>
                                                                                            </motion.div>
                                                                                        )}
                                                                                    </AnimatePresence>

                                                                                    <button
                                                                                        onClick={() => navigate('/configuration/weekly-classes/venues/class-schedule/Sessions/completed')}
                                                                                        className="hover:bg-blue-500 font-semibold bg-white text-blue-500 border-2 hover:border-transparent border-blue-500 text-[15px] hover:text-white px-3 py-2 rounded-xl transition"
                                                                                    >
                                                                                        View Class Register
                                                                                    </button>

                                                                                    <button
                                                                                        onClick={() =>
                                                                                            navigate(
                                                                                                "/configuration/weekly-classes/venues/class-schedule/Sessions/cancel",
                                                                                                {
                                                                                                    state: {
                                                                                                        schedule: item,
                                                                                                        canceled: item.status === "cancelled" // true if cancelled, false otherwise
                                                                                                    }
                                                                                                }
                                                                                            )
                                                                                        }

                                                                                        className={`font-semibold text-[15px] px-3 py-2 rounded-xl transition
        ${item.status === "cancelled"
                                                                                                ? "bg-white text-[#FE7058] border-2 border-[#FE7058] hover:bg-[#FE7058] hover:text-white"
                                                                                                : "bg-[#FE7058] text-white border-2 border-transparent hover:bg-white hover:text-[#FE7058] hover:border-[#FE7058]"
                                                                                            }`}
                                                                                    >
                                                                                        {item.status === "cancelled" ? "See details" : "Cancel Session"}
                                                                                    </button>

                                                                                </div>
                                                                            </div>
                                                                        )
                                                                    })}
                                                                </div>

                                                            </div>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </>
                                ))}
                            </div>

                        ) : (
                            <p className='text-center  p-4 border-dotted border rounded-md'>No Members Found</p>
                        )
                    }
                </div>

            </div>


            {openForm && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-3xl w-[90%] md:w-[900px] p-6 relative shadow-xl">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-[24px] font-semibold">
                                {isEditing ? 'Edit Class' : 'Add a Class'}
                            </h2>
                            <button
                                onClick={() => setOpenForm(false)}
                                className="text-gray-500 hover:text-gray-800 text-xl"
                            >
                                <img src="/demo/synco/icons/cross.png" alt="" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="flex gap-4">
                                <div className='block w-1/2'>
                                    <label htmlFor="" className='text-base'>Class 1 Name </label>
                                    <input
                                        type="text"
                                        value={formData.className}
                                        onChange={(e) => handleChange('className', e.target.value)}
                                        className="w-full border border-[#E2E1E5] rounded-xl p-3 text-sm"
                                    />
                                </div>
                                <div className='block w-1/2'>
                                    <label htmlFor="">Capacity</label>
                                    <input
                                        type="number"
                                        value={formData.capacity}
                                        onChange={(e) => handleChange('capacity', e.target.value)}
                                        className="w-full border border-[#E2E1E5] rounded-xl p-3 text-sm"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className='w-1/2'>
                                    <label htmlFor="">Day</label>
                                    <select
                                        value={formData.day}
                                        onChange={(e) => handleChange('day', e.target.value)}
                                        className="w-full border border-[#E2E1E5] rounded-xl p-3 text-sm"
                                    >
                                        <option value="">Day</option>
                                        {days.map((day) => (
                                            <option key={day} value={day}>{day}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className='flex w-1/2 gap-4'>
                                    <div className='w-1/2'>
                                        <label>Start Time</label>
                                        <DatePicker
                                            selected={parseTimeStringToDate(formData?.startTime)}
                                            onChange={(date) =>
                                                handleChange('startTime', formatDateToTimeString(date))
                                            }
                                            showTimeSelect
                                            showTimeSelectOnly
                                            timeIntervals={15}
                                            dateFormat="h:mm aa"
                                            timeCaption="Time"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-xl"
                                        />
                                    </div>

                                    <div className='w-1/2'>
                                        <label>End Time</label>
                                        <DatePicker
                                            selected={parseTimeStringToDate(formData?.endTime)}
                                            onChange={(date) =>
                                                handleChange('endTime', formatDateToTimeString(date))
                                            }
                                            showTimeSelect
                                            showTimeSelectOnly
                                            timeIntervals={15}
                                            dateFormat="h:mm aa"
                                            timeCaption="Time"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-xl"

                                        />
                                    </div>
                                </div>


                            </div>


                            <div className="block items-center gap-3 mt-2">
                                <label className="text-base  font-medium">Allow Free Trial?</label>
                                <br />
                                <label className="inline-flex mt-2 relative items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.allowFreeTrial}
                                        onChange={(e) => handleChange('allowFreeTrial', e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-[#237FEA] peer-focus:ring-4 peer-focus:ring-blue-300 transition-all"></div>
                                    <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full shadow-md transform peer-checked:translate-x-5 transition-transform"></div>
                                </label>
                            </div>
                        </div>


                        <div className="flex justify-start gap-5 mt-6">
                            <button
                                onClick={() => setOpenForm(false)}
                                className="px-20 py-4 bg-none hover:bg-gray-200 text-gray-500 border border-gray-300 rounded-lg mt-2"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    if (isEditing) {
                                        handleEdit(formData.id);
                                    } else {
                                        handleSave();
                                    }
                                }}
                                className="px-20 py-4 bg-[#237FEA] hover:bg-blue-700 text-white rounded-lg mt-2"
                            >
                                {isEditing ? 'Update' : 'Save'}
                            </button>

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default List;
