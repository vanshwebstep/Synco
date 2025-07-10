import Select from "react-select";
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Eye, Check, ChevronDown, ChevronUp, Search } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import Loader from '../contexts/Loader';
import { Editor } from '@tinymce/tinymce-react';

import { usePayments } from '../contexts/PaymentPlanContext';

const AddPaymentPlanGroup = () => {


    const [groupName, setGroupName] = useState('');
    const [previewShowModal, setPreviewShowModal] = useState(false);
    const { fetchPackages, groups, createPackage, fetchGroupById, loading, createGroup, selectedGroup, packages, updateGroup, setPackages } = usePayments();
    const [selectedPlans, setSelectedPlans] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [isEditMode, setIsEditMode] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [searchParams] = useSearchParams();
    const id = searchParams.get("id");
    useEffect(() => {
        if (id) {
            console.log('id foud');
            setIsEditMode(true);
            fetchGroupById(id);
        } else {
            setIsLoading(false);
        }
    }, [id]);

    const [description, setDescription] = useState('');
    const [packageDetails, setPackageDetails] = useState('');
    const [terms, setTerms] = useState('');
    const [plans, setPlans] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        price: '',
        interval: '',
        duration: '',
        students: '',
        joiningFee: '',
        termsAndCondition: '',
        HolidayCampPackage: '',

    });


    const planOptions = packages.map((plan) => ({
        value: plan.id,
        label: `${plan.title}: ${plan.price}`,
        data: plan, // to retain full plan data
    }));

    const selectedOptions = selectedPlans.map((plan) => ({
        value: plan.id,
        label: `${plan.title}: ${plan.price}`,
        data: plan,
    }));

    const handleSelectChange = (selected) => {
        setSelectedPlans(selected ? selected.map((item) => item.data) : []);
    };
    useEffect(() => {
        const getPackages = async () => {
            try {
                const response = await fetchPackages();
                console.log("Fetched packages:", response);

                if (response?.status && Array.isArray(response.data)) {
                    setPlans(response.data); // Set the dynamic plans from backend
                }

            } catch (error) {
                console.error("Error fetching packages:", error);
            }
        };

        getPackages();
    }, [fetchPackages]);
    const previewPlans = [
        { students: '1 Student', price: '£99.99' },
        { students: '2 Student', price: '£99.99' },
        { students: '3 Student', price: '£99.99' },
    ];

    const [openForm, setOpenForm] = useState(false);
    const navigate = useNavigate();

    const handleAddPlan = () => {
        setOpenForm(true);
    };
    const handleTogglePlan = (plan) => {
        const isSelected = selectedPlans.some((p) => p.id === plan.id);
        if (isSelected) {
            setSelectedPlans(selectedPlans.filter((p) => p.id !== plan.id));
        } else {
            setSelectedPlans([...selectedPlans, plan]);
        }
    };

    const handleRemovePlan = (index) => {
        const updated = [...selectedPlans];
        updated.splice(index, 1);
        setSelectedPlans(updated);
    };

    const filteredPlans = useMemo(() => {
        return packages.filter((plan) =>
            plan.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm]);
    const handleCreateGroup = async () => {
        const ids = selectedPlans.map(plan => plan.id).join(',');
        console.log('Selected Plan IDs:', ids);
        const payload = {
            name: groupName,
            description: description,
            plans: ids
            // Or use: price: price
        };

        console.log("Final Group Payload:", payload);

        try {
            await createGroup(payload);
        } catch (err) {
            console.error("Error creating group:", err);
        }
    };
    const handleUpdateGroup = async () => {
        const ids = selectedPlans.map(plan => plan.id).join(',');
        console.log('Selected Plan IDs:', ids);
        const payload = {
            name: groupName,
            description: description,
            plans: ids
            // Or use: price: price
        };

        console.log("Final Group Payload:", payload);

        try {
            await updateGroup(id, payload);
        } catch (err) {
            console.error("Error creating group:", err);
        }
    };
    const handleSavePlan = async () => {
        // Build payload exactly as needed
        const newPlan = {
            title: formData.title,
            price: formData.price,
            interval: formData.interval,
            duration: formData.duration,
            students: formData.students,
            termsAndCondition: formData.termsAndCondition,
            HolidayCampPackage: formData.HolidayCampPackage

            // joiningFee not included in payload if not needed
        };

        try {
            await createPackage(newPlan); // Send to backend as JSON
            // setPlans(prev => [...prev, newPlan]); // Optionally update local state

            // Clear form fields
            setFormData({
                title: '',
                price: '',
                interval: '',
                duration: '',
                students: '',
                joiningFee: '',
                termsAndCondition: '',
                HolidayCampPackage: '' // Still clearing local if present
            });
            setPackageDetails('');
            setTerms('');
            setOpenForm(false);
        } catch (err) {
            console.error('Error saving plan:', err);
        }
    };
    useEffect(() => {
        if (id && selectedGroup) {
            setGroupName(selectedGroup.name || "");
            setDescription(selectedGroup.description || "");
            setSelectedPlans(selectedGroup.plans || []);
        }
    }, [selectedGroup]);

    if (loading) {
        return (
            <>
                <Loader />
            </>
        )
    }

    console.log('selectedPlanss', selectedPlans)
    return (
        <div className=" md:p-6 bg-gray-50 min-h-screen">

            <div className={`flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-3 w-full md:w-1/2`}>
                <h2
                    onClick={() => {
                        if (previewShowModal) {
                            setPreviewShowModal(false);
                        } else {
                            navigate('/holiday-camps/payment-planManager');
                        }
                    }}
                    className="text-2xl font-semibold flex items-center gap-2 cursor-pointer hover:opacity-80"
                >
                    <img src="/icons/arrow-left.png" alt="Back" />
                    {previewShowModal ? '2023/24 Standard Pricing preview' : 'Add Payment Plan Group'}
                </h2>

            </div>

            <div className={`flex flex-col md:flex-row bg-white  rounded-3xl ${previewShowModal ? 'md:min-w-3/4  md:p-10' : 'w-full  md:p-12 p-4'}`}>
                {previewShowModal && (
                    <div className="flex items-center justify-center w-full px-4 py-6 sm:px-6 md:py-10">
                        <div className="bg-white rounded-3xl p-4 sm:p-6 w-full max-w-4xl shadow-2xl">

                            {/* Header */}
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#E2E1E5] pb-4 mb-4 gap-2">
                                <h2 className="font-semibold text-[20px] sm:text-[24px]">Payment Plan Preview</h2>
                                <button
                                    onClick={() => setPreviewShowModal(false)}
                                    className="text-gray-400 hover:text-black text-xl font-bold"
                                >
                                    <img src="/icons/cross.png" alt="close" className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Plans Grid */}
                            <div className="grid pt-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {selectedPlans.map((plan, idx) => (
                                    <div
                                        key={idx}
                                        className="border border-[#E2E1E5] rounded-xl p-4 sm:p-5 flex flex-col justify-between transition"
                                    >
                                        <h3 className="text-[18px] sm:text-[20px] font-semibold mb-2">{plan.students} Students</h3>
                                        <p className="text-[24px] sm:text-[32px] font-semibold mb-4">£{plan.price}</p>
                                        <hr className="mb-4 text-[#E2E1E5]" />
                                        <ul className="space-y-2 text-[14px] sm:text-[16px] font-semibold">
                                            <li className="flex items-center py-2 gap-2">
                                                <img src="/icons/tick-circle.png" alt="" className="w-5 h-5" />
                                                {plan.duration}
                                            </li>
                                            <li className="flex items-center py-2 pb-2 sm:pb-4 gap-2">
                                                <img src="/icons/tick-circle.png" alt="" className="w-5 h-5" />
                                                Free Holiday Camp Bag
                                            </li>
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                ) ||
                    <>
                        <div className={`transition-all duration-300 md:w-1/2`}>
                            <div className="rounded-2xl  md:p-12 ">
                                <form onSubmit={(e) => {
                                    e.preventDefault(); // prevents page refresh
                                    if (id && selectedGroup) {
                                        handleUpdateGroup();
                                    } else {
                                        handleCreateGroup();
                                    }
                                }} className="mx-auto space-y-4">
                                    {/* Group Name */}
                                    <div>
                                        <label className="block text-base  font-semibold text-gray-700 mb-2">
                                            Payment Plan Group Name
                                        </label>
                                        <input
                                            value={groupName}
                                            onChange={(e) => setGroupName(e.target.value)}
                                            type="text"
                                            required
                                            placeholder="Enter Group Name"
                                            className="w-full px-4 font-semibold text-base py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <label className="block text-base  font-semibold text-gray-700 mb-2">
                                            Description
                                        </label>
                                        <input

                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            type="text"
                                            required
                                            placeholder="Add Internal  reference"
                                            className="w-full px-4 font-semibold py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    {/* Payment Plans */}
                                    <div className="w-full">
                                        {/* Label - Clickable to toggle options */}
                                        <div
                                            className="flex items-center justify-between cursor-pointer mb-2"
                                            onClick={() => setIsOpen(!isOpen)}
                                        >
                                            <label className="block text-base font-semibold text-gray-700">
                                                Payment Plans
                                            </label>

                                        </div>

                                        {/* Animated Collapsible Plan Select Area */}


                                        {/* Selected Plans */}

                                        <div
                                            onClick={() => setIsOpen(!isOpen)}
                                            className="mt-4 space-y-2 border border-gray-200 px-4 py-3 rounded-lg"
                                        >
                                            {selectedPlans.length > 0 ? (
                                                selectedPlans.map((plan, idx) => (
                                                    <div
                                                        key={plan.id || idx}
                                                        className="flex items-center font-semibold justify-between"
                                                    >
                                                        <span>{`${plan.title}: ${plan.price}`}</span>
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation(); // Prevents triggering setIsOpen
                                                                handleRemovePlan(idx);
                                                            }}
                                                            className="text-gray-500 hover:text-red-500"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="text-gray-400 italic">No plans selected</div>
                                            )}
                                        </div>

                                        <AnimatePresence initial={false}>
                                            {isOpen && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                    className="transition-all" // remove "overflow-hidden"
                                                >
                                                    <div className="w-full mb-4">
                                                        <Select
                                                            options={planOptions}
                                                            value={selectedOptions}
                                                            onChange={handleSelectChange}
                                                            isMulti
                                                            placeholder="Select payment plans..."
                                                            className="react-select-container"
                                                            classNamePrefix="react-select"

                                                            menuPortalTarget={document.body} // 🔥 THIS FIXES OVERFLOW
                                                            styles={{
                                                                menuPortal: (base) => ({ ...base, zIndex: 9999 }), // Ensure it's on top
                                                            }}
                                                        />


                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    {/* Add Payment Plan Button */}
                                    <button
                                        type="button"
                                        onClick={handleAddPlan}
                                        className="w-full bg-[#237FEA] mb-8 text-white text-[16px] font-semibold py-2 rounded-lg hover:bg-blue-700"
                                    >
                                        Add Payment Plan
                                    </button>

                                    {/* Footer Buttons */}
                                    <div className="flex flex-wrap flex-col-reverse gap-4 md:flex-row md:items-center md:justify-end md:gap-4">


                                        <button
                                            type="button"
                                            onClick={() => setPreviewShowModal(true)}
                                            className="flex items-center justify-center gap-1 border border-blue-500 text-[#237FEA] px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 w-full md:w-auto"
                                        >
                                            Preview Payment Plans
                                            <Eye size={16} />
                                        </button>
                                        <button
                                            type="submit"
                                            className="bg-[#237FEA] text-white min-w-50 font-semibold px-6 py-2 rounded-lg hover:bg-blue-700 w-full md:w-auto"
                                        >
                                            {id && selectedGroup ? "Edit Group" : "Create Group"}
                                        </button>

                                    </div>

                                </form>
                            </div>
                        </div>

                        <AnimatePresence>
                            {openForm && (
                                <motion.div
                                    initial={{ x: '100%', opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: '100%', opacity: 0 }}
                                    transition={{ duration: 0.4 }}
                                    className="w-full md:w-1/2 bg-white rounded-3xl p-6 shadow-2xl relative"
                                >
                                    <button
                                        onClick={() => setOpenForm(false)}
                                        className="absolute top-2 right-3  hover:text-gray-700 text-5xl"
                                        title="Close"
                                    >
                                        &times;
                                    </button>
                                    {/* Add your form content here */}
                                    <div className="text-[24px] font-semibold mb-4">Payment Plan</div>

                                    {[
                                        { label: "Title", name: "title" },
                                        { label: "Price (€)", name: "price" },
                                        { label: "Interval", name: "interval" },
                                        { label: "Duration", name: "duration" },
                                        { label: "Number of Students", name: "students" },
                                        { label: "Joining Fee (€)", name: "joiningFee" }
                                    ].map((field) => (
                                        <div key={field.name} className="mb-4">
                                            <label className="block text-base  font-semibold text-gray-700 mb-2">{field.label}</label>
                                            <input
                                                type="text"
                                                value={formData[field.name]}
                                                onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                                                className="w-full px-4 font-semibold text-base py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    ))}

                                    <div className="mb-4">
                                        <label className="block text-base font-semibold text-gray-700 mb-2">
                                            Holiday Camp Package Details
                                        </label>
                                        <div className="rounded-md border border-gray-300 bg-gray-100 p-1">
                                            <Editor
                                                                                        apiKey="frnlhul2sjabyse5v4xtgnphkcgjxm316p0r37ojfop0ux83"

                                                value={formData.HolidayCampPackage}
                                                onEditorChange={(content) =>
                                                    setFormData({ ...formData, HolidayCampPackage: content })
                                                }
                                                init={{
                                                    menubar: false,
                                                    toolbar: 'bold italic underline | bullist numlist | undo redo',
                                                    height: 150,
                                                    branding: false,
                                                    content_style: `
          body {
            background-color: #f3f4f6;
            font-family: inherit;
            font-size: 1rem;
            padding: 12px;
            color: #111827;
          }
        `,
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-base font-semibold text-gray-700 mb-2">
                                            Terms & Conditions
                                        </label>
                                        <div className="rounded-md border border-gray-300 bg-gray-100 p-1">
                                            <Editor
                                                                                        apiKey="frnlhul2sjabyse5v4xtgnphkcgjxm316p0r37ojfop0ux83"

                                                value={formData.termsAndCondition}
                                                onEditorChange={(content) =>
                                                    setFormData({ ...formData, termsAndCondition: content })
                                                }
                                                init={{
                                                    menubar: false,
                                                    toolbar: 'bold italic underline | bullist numlist | undo redo',
                                                    height: 150,
                                                    branding: false,
                                                    content_style: `
          body {
            background-color: #f3f4f6;
            font-family: inherit;
            font-size: 1rem;
            padding: 12px;
            color: #111827;
          }
        `,
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <button
                                            onClick={handleSavePlan}
                                            className="bg-[#237FEA] text-white mt-5 min-w-50 font-semibold px-6 py-2 rounded-lg hover:bg-blue-700"
                                        >
                                            Save Plan
                                        </button>
                                    </div>



                                </motion.div>
                            )}
                        </AnimatePresence>

                    </>}
            </div>


        </div>
    );
};

export default AddPaymentPlanGroup;
