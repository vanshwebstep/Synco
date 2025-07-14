import React, { useEffect, useState } from 'react';
import Create from '../Create';
import { Check } from "lucide-react";
import Loader from '../../contexts/Loader';
import { useVenue } from '../../contexts/VenueContext';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";

const List = () => {
    const terms = [
        {
            id: "autumn1",
            name: "Autumn Term",
            date: "Sat Jul 26",
            sessions: [
                {
                    id: 1,
                    title: "Session 1: Pele",
                    date: "Saturday, 09/09/2025",
                    status: "Completed",
                },
                {
                    id: 2,
                    title: "Session 2: Maradona",
                    date: "Saturday, 09/16/2025",
                    status: "Completed",
                },
                // Add more sessions as needed...
            ],
        },
        {
            id: "autumn2",
            name: "Autumn Term 2",
            date: "Sat Jul 26",
            sessions: [
                {
                    id: 1,
                    title: "Session 1: Messi",
                    date: "Saturday, 09/09/2025",
                    status: "Completed",
                },
                {
                    id: 2,
                    title: "Session 2: Ronaldo",
                    date: "Saturday, 09/16/2025",
                    status: "Completed",
                },
            ],
        },
    ];
    const navigate = useNavigate();

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
        setIsEditing(false);
        setOpenForm(true);
    };
    const classes = [
        {
            name: "Class 1",
            ageGroup: "4-7 Years",
            capacity: 24,
            day: "Saturday",
            startTime: "2:00 pm",
            endTime: "3:00 pm",
            freeTrial: "Yes",
            facility: "Indoor",
        },
        {
            name: "Class 2",
            ageGroup: "8-12 Years",
            capacity: 24,
            day: "Saturday",
            startTime: "2:00 pm",
            endTime: "3:00 pm",
            freeTrial: "Yes",
            facility: "Indoor",
            highlight: true, // Red border
        },
        {
            name: "Class 3",
            ageGroup: "4-7 Years",
            capacity: 24,
            day: "Saturday",
            startTime: "2:00 pm",
            endTime: "3:00 pm",
            freeTrial: "No",
            facility: "Indoor",
        },
    ];
    const [isEditing, setIsEditing] = useState(false);
    const [value, setValue] = useState('Some text');


    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const { venues, isEditVenue, setIsEditVenue, fetchVenues, loading } = useVenue()
    const [formData, setFormData] = useState({
        className: '',
        capacity: '',
        day: '',
        startTime: null,
        endTime: null,
        allowTrial: false
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
        console.log('Saving class:', formData);
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

    if (loading) {
        return (
            <>
                <Loader />
            </>
        )
    }

    return (
        <div className="pt-1 bg-gray-50 min-h-screen">
            <div className={`flex pe-4 justify-between items-center mb-4 w-full`}>
                <h2 className="text-[28px] font-semibold">Class Schedule</h2>
                <button
                    onClick={() => handleAddNew()}
                    className="bg-[#237FEA] flex items-center gap-2 cursor-pointer text-white px-4 py-[10px] rounded-xl hover:bg-blue-700 text-[16px] font-semibold"
                >
                    <img src="/members/add.png" className='w-5' alt="" /> Add a Class
                </button>
            </div>

            <div className="md:flex gap-6">
                <div
                    className={`transition-all duration-300 w-full `}>
                    {
                        venues.length > 0 ? (

                            <div className="bg-white rounded-3xl p-6 shadow">
                                <h2 className="font-semibold text-lg text-[18px]">Chelsea Academy</h2>
                                <p className="text-[14px]   mb-4 border-b pb-4 border-gray-200">Lots Road, London, SW10 0AB</p>

                                {classes.map((item, index) => (
                                    <>
                                        <div
                                            key={index}
                                            className={`flex flex-col md:flex-row justify-between items-center border ${item.highlight ? "border-red-400" : "border-gray-200"
                                                } rounded-xl px-4  pr-16 py-4 mb-3 hover:shadow transition`}
                                        >
                                            {/* Class info block */}
                                            <div className="grid grid-cols-2 md:grid-cols-9 gap-4 w-full text-sm">
                                                <div>
                                                    <p className="font-semibold text-[16px]">{item.name}</p>
                                                    <p className="text-xs font-semibold text-[16px]">{item.ageGroup}</p>
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
                                                    <p className="font-semibold">{item.freeTrial}</p>
                                                </div>
                                                <div className='text-[#717073] font-semibold  text-[16px]'>
                                                    <p className="text-[#717073]">Facility</p>
                                                    <p className="font-semibold">{item.facility}</p>
                                                </div>
                                            </div>

                                            {/* Icons + Button */}
                                            <div className="flex items-center mt-4 md:mt-0 gap-4">
                                                <img
                                                    src="/icons/edit.png"
                                                    alt="Edit"
                                                    className="w-6 h-6 cursor-pointer"
                                                    onClick={() => handleEditClick(item)}
                                                />                                            <img src="/icons/deleteIcon.png" alt="" />
                                                <button onClick={() => toggleSessions(index)} className="ml-4 flex font-semibold items-center gap-2 whitespace-nowrap px-4 pr-6 py-2 border rounded-xl text-[16px] font-medium text-blue-600 border-blue-500 hover:bg-blue-50">
                                                    {openClassIndex === index ? 'Hide sessions' : 'View sessions'}  <img src="/icons/bluearrowup.png" className={`${openClassIndex === index ? '' : 'rotate-180'} transition-transform`} alt="" />
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
                                                        {terms.map((term) => (
                                                            <div key={term.id} className=" rounded-xl w-full">
                                                                <div
                                                                    onClick={() => toggleTerm(term.id)}
                                                                    className="mb-4 mt-2 border-b border-gray-300 flex justify-between items-center cursor-pointer"
                                                                >

                                                                    <div className='flex mb-4 items-center gap-4 justify-start'>
                                                                        <div><img src="/icons/blackarrowup.png" className={`${openTerms[term.id] ? "" : "rotate-180"} transition-transform`} alt="" /></div>
                                                                        <div> <p className="font-semibold text-[16px] ">{term.name}</p>
                                                                            <p className="text-[14px] ">{term.date}</p>
                                                                        </div>
                                                                    </div>


                                                                </div>

                                                                <div
                                                                    className={`transition-all duration-300 overflow-hidden ${openTerms[term.id] ? "max-h-[1000px]" : "max-h-0"
                                                                        }`}
                                                                >
                                                                    {term.sessions.map((session) => (
                                                                        <div
                                                                            key={session.id}
                                                                            className="flex flex-wrap gap-4 justify-between items-center border-b border-gray-300 mb-3 px-8 py-2"
                                                                        >
                                                                            <div className="flex items-center gap-2 text-sm mb-2 md:mb-0">
                                                                                <span className="text-[16px]  md:min-w-[200px] font-semibold">{session.title}</span>
                                                                                <span className="text-[16px] min-w-[200px] ">{session.date}</span>
                                                                            </div>

                                                                            <div className="flex items-center min-w-[100px] gap-2 text-xs">
                                                                                <span className="rounded-full flex gap-2 text-[16px] items-center font-medium">
                                                                                    <img src="/icons/complete.png " className='w-4 h-4' alt="" /> {session.status}
                                                                                </span>
                                                                            </div>

                                                                            <div className="flex gap-2 mt-2 md:mt-0">
                                                                                <button
                                                                                    onClick={() => navigate('/weekly-classes/venues/class-schedule/view-session-plans')}
                                                                                    className="bg-blue-500 font-semibold hover:bg-white hover:text-blue-500 border-2 border-transparent hover:border-blue-500 text-[16px] text-white px-3 py-2 rounded-xl"
                                                                                >
                                                                                    View Session Plans
                                                                                </button>

                                                                                <button className="hover:bg-blue-500 font-semibold  bg-white text-blue-500 border-3 hover:border-transparent border-blue-500 text-[16px] hover:text-white px-3 py-2 rounded-xl">
                                                                                    View Class Register
                                                                                </button>
                                                                                <button className="bg-[#FE7058] font-semibold hover:bg-white hover:text-[#FE7058] border-3 border-transparent hover:border-[#FE7058] text-[16px] text-white px-3 py-2 rounded-xl">
                                                                                    Cancel Session
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    ))}
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
                                <img src="/icons/cross.png" alt="" />
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
                                <div className='flex w-1/2  gap-4'>
                                    <div className='w-1/2'>
                                        <label htmlFor="">Start Time</label>

                                        <DatePicker
                                            selected={formData.startTime}
                                            onChange={(date) => handleChange('startTime', date)}
                                            showTimeSelect
                                            showTimeSelectOnly
                                            timeIntervals={15}
                                            dateFormat="h:mm aa"
                                            timeCaption="Time"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-xl"
                                        />
                                    </div>
                                    <div className='w-1/2'>

                                        <label htmlFor="">End Time</label>
                                        <DatePicker
                                            selected={formData.endTime}
                                            onChange={(date) => handleChange('endTime', date)}
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
                                        checked={formData.allowTrial}
                                        onChange={(e) => handleChange('allowTrial', e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 peer-focus:ring-4 peer-focus:ring-blue-300 transition-all"></div>
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
                                onClick={handleSave}
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
