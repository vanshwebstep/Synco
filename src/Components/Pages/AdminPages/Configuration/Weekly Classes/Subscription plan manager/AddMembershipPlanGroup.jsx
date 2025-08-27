import Select from "react-select";
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Eye, Check, ChevronDown, ChevronUp, Search } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import Loader from '../../../contexts/Loader';
import { Editor } from '@tinymce/tinymce-react';
import Swal from 'sweetalert2'; // If not already imported

import { usePayments } from '../../../contexts/PaymentPlanContext';
import PlanTabs from "../Find a class/PlanTabs";
import { usePermission } from "../../../Common/permission";

const AddPaymentPlanGroup = () => {
    const [isSavePlan, setIsSavePlan] = useState(false);

    const [submitloading, setSubmitLoading] = useState(false);

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
        priceLesson: '',
        interval: '',
        duration: '',
        students: '',
        joiningFee: '',
        termsAndCondition: '',
        HolidayCampPackage: '',

    });

    const [formIsDirty, setFormIsDirty] = useState(false);

    const formatStudentLabel = (plan) => {
        if (plan.students > 0) {
            return `${plan.title}: ${plan.students} ${plan.students === 1 ? 'Student' : 'Students'}`;
        }
        return `${plan.title}`;
    };

    const planOptions = packages.map((plan) => ({
        value: plan.id,
        label: formatStudentLabel(plan),
        data: plan,
    }));

    const selectedOptions = selectedPlans.map((plan) => ({
        value: plan.id,
        label: formatStudentLabel(plan),
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
        setSubmitLoading(true); // start loader
        const ids = selectedPlans.map(plan => plan.id).join(',');
        const payload = {
            name: groupName,
            description: description,
            plans: ids
        };

        try {
            await createGroup(payload);
        } catch (err) {
            console.error("Error creating group:", err);
        } finally {
            setSubmitLoading(false); // stop loader
        }
    };

    const handleUpdateGroup = async () => {
        setSubmitLoading(true); // start loader
        const ids = selectedPlans.map(plan => plan.id).join(',');
        const payload = {
            name: groupName,
            description: description,
            plans: ids
        };

        try {
            await updateGroup(id, payload);
        } catch (err) {
            console.error("Error updating group:", err);
        } finally {
            setSubmitLoading(false); // stop loader
        }
    };

    const handleSavePlan = async () => {
        const { title, price, priceLesson, interval, duration, joiningFee, students } = formData;

        // ✅ Validation
        if (!title || !price || !interval || !priceLesson || !duration || !students || !joiningFee) {
            Swal.fire({
                icon: 'warning',
                title: 'Missing Fields',
                text: 'Please fill in all required fields: Title, Price, Interval, Duration, Number of Students, and Joining Fee.',
            });
            return;
        }

        const newPlan = {
            title,
            price,
            priceLesson,
            interval,
            duration,
            joiningFee,
            students,
            termsAndCondition: formData.termsAndCondition,
            HolidayCampPackage: formData.HolidayCampPackage
        };

        setIsSavePlan(true);

        try {
            await createPackage(newPlan);

            Swal.fire({
                icon: 'success',
                title: 'Saved',
                text: 'Plan saved successfully!',
                timer: 1500,
                showConfirmButton: false
            });

            // Clear form
            setFormData({
                title: '',
                price: '',
                interval: '',
                duration: '',
                students: '',
                joiningFee: '',
                termsAndCondition: '',
                HolidayCampPackage: ''
            });

            setPackageDetails('');
            setTerms('');
            setOpenForm(false);
        } catch (err) {
            console.error('Error saving plan:', err);
            Swal.fire({
                icon: 'error',
                title: 'Save Failed',
                text: 'There was an error saving the plan. Please try again.'
            });
        } finally {
            setIsSavePlan(false);
        }
    };
    useEffect(() => {
        if (id && selectedGroup) {
            setGroupName(selectedGroup.name || "");
            setDescription(selectedGroup.description || "");
            setSelectedPlans(selectedGroup.paymentPlans || []);
        }
    }, [selectedGroup]);

    if (loading) {
        return (
            <>
                <Loader />
            </>
        )
    }
    const { checkPermission } = usePermission();

    const canCreate =
        checkPermission({ module: 'payment-plan', action: 'create' });

    console.log('formData.HolidayCampPackage', formData.HolidayCampPackage)
    return (
        <div className=" md:p-6 bg-gray-50 min-h-screen">

            <div className={`flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-3 w-full md:w-1/2`}>
                <h2
                    onClick={() => {
                        if (previewShowModal) {
                            setPreviewShowModal(false);
                        } else {
                            navigate('/configuration/weekly-classes/subscription-planManager');
                        }
                    }}
                    className="text-xl md:text-2xl font-semibold flex items-center gap-2 md:gap-3 cursor-pointer hover:opacity-80 transition-opacity duration-200"
                >
                    <img
                        src="/demo/synco/icons/arrow-left.png"
                        alt="Back"
                        className="w-5 h-5 md:w-6 md:h-6"
                    />
                    <span className="truncate">
                        {previewShowModal ? `${selectedGroup?.name} ` : 'Add Membership Plan Group'}
                    </span>
                </h2>


            </div>

            <div className={`flex flex-col md:flex-row bg-white rounded-3xl ${previewShowModal ? ' m-auto  md:p-10' : 'w-full  md:p-12 p-4'}`}>
                {previewShowModal && (
                    <div className="flex items-center rounded-3xl max-w-fit justify-left bg-white md:w-full px-4 py-6 sm:px-6 md:py-10">
                        <div className="bg-white rounded-3xl p-4 sm:p-6 w-full max-w-4xl shadow-2xl">

                            {/* Header */}
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#E2E1E5] pb-4 mb-4 gap-2">
                                <h2 className="font-semibold text-[20px] sm:text-[24px]">Subscription Plan</h2>
                                <button
                                    onClick={() => setPreviewShowModal(false)}
                                    className="text-gray-400 hover:text-black text-xl font-bold"
                                >
                                    <img src="/demo/synco/icons/cross.png" alt="close" className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Plans Grid */}
                            <PlanTabs selectedPlans={selectedPlans} />


                        </div>
                    </div>

                ) ||
                    <>
                        <div className={`transition-all duration-300 md:w-1/2`}>
                            <div className="rounded-2xl w-full md:p-12 ">
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
                                                Membership Plan
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
                                                        <span>
                                                            {plan.students > 0
                                                                ? `${plan.title}: ${plan.students} ${plan.students === 1 ? 'Student' : 'Students'}`
                                                                : ''}
                                                        </span>
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
                                                            placeholder="Select Membership plans..."
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

                                    {canCreate &&
                                        <button
                                            type="button"
                                            onClick={handleAddPlan}
                                            className="w-full bg-[#237FEA] mb-8 text-white text-[16px] font-semibold py-2 rounded-lg hover:bg-blue-700"
                                        >
                                            Add Membership Plan
                                        </button>
                                    }
                                    {/* Footer Buttons */}
                                    <div className="flex flex-wrap flex-col-reverse gap-4 md:flex-row md:items-center md:justify-end md:gap-4">


                                        <button
                                            type="button"
                                            onClick={() => setPreviewShowModal(true)}
                                            className="flex items-center justify-center gap-1 border border-blue-500 text-[#237FEA] px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 w-full md:w-auto"
                                        >
                                            Preview Membership Plans
                                            <Eye size={16} />
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={submitloading}
                                            className={`bg-[#237FEA] text-white min-w-50 font-semibold px-6 py-2 rounded-lg w-full md:w-auto ${submitloading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-blue-700'
                                                }`}
                                        >
                                            {loading
                                                ? (id && selectedGroup ? "Updating..." : "Creating...")
                                                : (id && selectedGroup ? "Edit Group" : "Create Group")}
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
                                    <div className="text-[24px] font-semibold mb-4">Membership Plan</div>
                                    {[
                                        { label: "Title", name: "title", type: "text" },
                                        { label: "Price (€)", name: "price", type: "number" },
                                        { label: "Price per lesson(€)", name: "priceLesson", type: "number" },
                                        {
                                            label: "Interval",
                                            name: "interval",
                                            type: "dropdown",
                                            options: ["Month", "Quarter", "Year"]
                                        },
                                        { label: "Duration", name: "duration", type: "number" },
                                        { label: "Number of Students", name: "students", type: "number" },
                                        { label: "Joining Fee (€)", name: "joiningFee", type: "number" }
                                    ].map((field) => {
                                        // Duration options for dropdown
                                        let durationOptions = [];
                                        if (field.name === "duration") {
                                            if (formData.interval === "Month") {
                                                durationOptions = Array.from({ length: 12 }, (_, i) => ({
                                                    label: `${i + 1} month${i + 1 > 1 ? "s" : ""}`,
                                                    value: i + 1
                                                }));
                                            } else if (formData.interval === "Year") {
                                                durationOptions = Array.from({ length: 20 }, (_, i) => ({
                                                    label: `${i + 1} year${i + 1 > 1 ? "s" : ""}`,
                                                    value: i + 1
                                                }));
                                            } else if (formData.interval === "Quarter") {
                                                durationOptions = Array.from({ length: 8 }, (_, i) => ({
                                                    label: `${i + 1} quarter${i + 1 > 1 ? "s" : ""}`,
                                                    value: i + 1
                                                }));
                                            }

                                        }

                                        return (
                                            <div key={field.name} className="mb-4">
                                                <label className="block text-base font-semibold text-gray-700 mb-2">
                                                    {field.label}
                                                </label>

                                                {field.type === "dropdown" ? (
                                                    <select
                                                        value={formData[field.name]}
                                                        onChange={(e) =>
                                                            setFormData({ ...formData, [field.name]: e.target.value })
                                                        }
                                                        className="w-full px-4 py-3 font-semibold text-base border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    >
                                                        <option value="" disabled>Select {field.label}</option>
                                                        {field.options.map((option) => (
                                                            <option key={option} value={option}>{option}</option>
                                                        ))}
                                                    </select>
                                                ) : field.name === "duration" && formData.interval ? (
                                                    <select
                                                        value={formData.duration}
                                                        onChange={(e) =>
                                                            setFormData({ ...formData, duration: parseInt(e.target.value) })
                                                        }
                                                        className="w-full px-4 py-3 font-semibold text-base border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    >
                                                        <option value="" disabled>Select Duration</option>
                                                        {durationOptions.map((opt) => (
                                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                        ))}
                                                    </select>
                                                ) : (
                                                    <input
                                                        type={field.type}
                                                        value={formData[field.name]}
                                                        onChange={(e) => {
                                                            let value = e.target.value;
                                                            if (field.type === "number") {
                                                                value = Number(value);
                                                                if (field.name === "students" && value > 3) value = 3;
                                                            }
                                                            setFormData({ ...formData, [field.name]: value });
                                                        }}
                                                        className={`w-full px-4 py-3 font-semibold text-base border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 
            ${field.name === "price" ? "appearance-none bg-transparent" : ""}`}
                                                        step={field.type === "number" ? "0.01" : undefined}
                                                        min={field.type === "number" ? 1 : undefined}
                                                        max={field.name === "students" ? 3 : undefined}
                                                    />
                                                )}
                                            </div>
                                        );
                                    })}




                                    <div className="mb-4 relative">
                                        <label className="block text-base font-semibold text-gray-700 mb-2">
                                            Membership Package Details
                                        </label>
                                        <div className="rounded-md border border-gray-300 bg-gray-100 p-1">
                                            <Editor
                                                apiKey="t3z337jur0r5nxarnapw6gfcskco6kb5c36hcv3xtcz5vi3i"
                                                value={formData.HolidayCampPackage}
                                                onEditorChange={(content) =>
                                                    setFormData({ ...formData, HolidayCampPackage: content })
                                                }
                                                init={{
                                                    menubar: false,
                                                    plugins: 'lists advlist',
                                                    toolbar: 'fontsizeselect capitalize bold italic underline alignleft aligncenter alignjustify',
                                                    height: 200,
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
                                                    setup: (editor) => {
                                                        // Custom capitalize button
                                                        editor.ui.registry.addIcon(
                                                            'capitalize-icon',
                                                            '<img src="/demo/synco/icons/smallcaps.png" style="width:16px;height:16px;" />'
                                                        );
                                                        editor.ui.registry.addButton('capitalize', {
                                                            icon: 'capitalize-icon',
                                                            tooltip: 'Capitalize Text',
                                                            onAction: () => {
                                                                editor.formatter.register('capitalize', {
                                                                    inline: 'span',
                                                                    styles: { textTransform: 'capitalize' },
                                                                });
                                                                editor.formatter.toggle('capitalize');
                                                            },
                                                        });

                                                        // Remove className from content on init
                                                        editor.on('BeforeSetContent', (e) => {
                                                            if (e.content) {
                                                                e.content = e.content.replace(/\sclass="[^"]*"/g, '');
                                                            }
                                                        });

                                                        // Also clean pasted content
                                                        editor.on('PastePostProcess', (e) => {
                                                            e.node.innerHTML = e.node.innerHTML.replace(/\sclass="[^"]*"/g, '');
                                                        });
                                                    },
                                                }}
                                            />


                                        </div>
                                    </div>

                                    <div className="mb-4 relative">
                                        <label className="block text-base font-semibold text-gray-700 mb-2">
                                            Terms & Conditions
                                        </label>
                                        <div className="rounded-md border border-gray-300 bg-gray-100 p-1">
                                            <Editor
                                                apiKey="t3z337jur0r5nxarnapw6gfcskco6kb5c36hcv3xtcz5vi3i"

                                                value={formData.termsAndCondition}
                                                onEditorChange={(content) =>
                                                    setFormData({ ...formData, termsAndCondition: content })
                                                }
                                                init={{
                                                    menubar: false,
                                                    plugins: 'lists advlist',
                                                    toolbar:
                                                        'fontsizeselect capitalize bold italic underline alignleft aligncenter alignjustify',
                                                    height: 200,
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
                                                    setup: (editor) => {
                                                        // Register custom icon
                                                        editor.ui.registry.addIcon(
                                                            'capitalize-icon',
                                                            '<img src="/demo/synco/icons/smallcaps.png" style="width:16px;height:16px;" />'
                                                        );

                                                        // Register and add button
                                                        editor.ui.registry.addButton('capitalize', {
                                                            icon: 'capitalize-icon',
                                                            tooltip: 'Capitalize Text',
                                                            onAction: () => {
                                                                editor.formatter.register('capitalize', {
                                                                    inline: 'span',
                                                                    styles: { textTransform: 'capitalize' },
                                                                });

                                                                editor.formatter.toggle('capitalize');
                                                            },
                                                        });
                                                    },
                                                }}
                                                onInit={(evt, editor) => {
                                                    console.log('Editor initialized', editor);
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <button
                                            onClick={handleSavePlan}
                                            disabled={isSavePlan}
                                            className={`bg-[#237FEA] text-white mt-5 min-w-50 font-semibold px-6 py-2 rounded-lg 
        ${isSavePlan ? 'bg-gray-400 cursor-not-allowed' : 'hover:bg-blue-700'}`}
                                        >
                                            {isSavePlan ? 'Saving...' : 'Save Plan'}
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
