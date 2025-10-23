import Select from "react-select";
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Eye, Check, ChevronDown, ChevronUp, Search } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import Loader from '../../contexts/Loader';
import { Editor } from '@tinymce/tinymce-react';

import { useSessionPlan } from '../../contexts/SessionPlanContext';

const Create = () => {
    const videoInputRef = useRef(null);
    const bannerInputRef = useRef(null);
    const tabRef = useRef(null);
    const tabs = ['Beginners', 'Intermediate', 'Advanced', 'Pro'];
    const [activeTab, setActiveTab] = useState('Beginners');
    const fileInputRef = useRef(null);
    const [page, setPage] = useState(1);
    const [groupName, setGroupName] = useState('');
    const [groupNameSection, setGroupNameSection] = useState('');
    const [player, setPlayer] = useState('');
    const [skillOfTheDay, setSkillOfTheDay] = useState('');
    const [descriptionSession, setDescriptionSession] = useState('');
    const [description, setDescription] = useState('');

    const [bannerUrl, setBannerUrl] = useState(''); // You will set this on actual upload
    const [videoUrl, setVideoUrl] = useState('');
    const [sessionExerciseId, setSessionExerciseId] = useState(null); // or selectedPlans[0]?.id
    const [levels, setLevels] = useState([]);
    const handleVideoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setVideoUrl(url);
        }
    };

    const handleBannerChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setBannerUrl(url);
        }
    };

    const handleCreateSession = () => {
        if (tabRef.current) {
            tabRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        const currentLevel = {
            level: activeTab,
            player,
            skillOfTheDay,
            descriptionSession,
            bannerUrl,
            videoUrl,
            sessionExerciseId: selectedPlans[0]?.id || null,
        };

        setLevels((prevLevels) => {
            const existingIndex = prevLevels.findIndex((lvl) => lvl.level === activeTab);
            const updated = [...prevLevels];

            if (existingIndex !== -1) {
                updated[existingIndex] = currentLevel;
            } else {
                updated.push(currentLevel);
            }

            // ✅ Log if this is the LAST tab
            const nextIndex = tabs.findIndex((tab) => tab === activeTab) + 1;
            if (nextIndex >= tabs.length) {
                 console.log('✅ Final Session Data:', updated);
            }

            return updated;
        });

        const nextIndex = tabs.findIndex((tab) => tab === activeTab) + 1;

        if (nextIndex < tabs.length) {
            setActiveTab(tabs[nextIndex]);
            setPage(1);

            // Clear form fields
            setPlayer('');
            setSkillOfTheDay('');
            setDescriptionSession('');
            setSelectedPlans([]);
            setBannerUrl('');
            setVideoUrl('');
            setSessionExerciseId(null);

            // 🔥 Reset file input values
            if (videoInputRef.current) videoInputRef.current.value = null;
            if (bannerInputRef.current) bannerInputRef.current.value = null;
        }
    };



    const [previewShowModal, setPreviewShowModal] = useState(false);
    const { fetchExercises, groups, createSessionExercise, fetchGroupById, loading, createGroup, selectedExercise, exercises, updateGroup, setExercises } = useSessionPlan();
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
    useEffect(() => {
        const existingLevel = levels.find((lvl) => lvl.level === activeTab);
        if (existingLevel) {
            setPlayer(existingLevel.player || '');
            setSkillOfTheDay(existingLevel.skillOfTheDay || '');
            setDescriptionSession(existingLevel.descriptionSession || '');
            setBannerUrl(existingLevel.bannerUrl || '');
            setVideoUrl(existingLevel.videoUrl || '');
            setSessionExerciseId(existingLevel.sessionExerciseId || null);
            setSelectedPlans([{ id: existingLevel.sessionExerciseId, title: 'Loaded Exercise', duration: 'x mins' }]); // Customize as needed
        } else {
            // Clear if no saved data
            setPlayer('');
            setSkillOfTheDay('');
            setDescriptionSession('');
            setBannerUrl('');
            setVideoUrl('');
            setSessionExerciseId(null);
            setSelectedPlans([]);
        }

        if (videoInputRef.current) videoInputRef.current.value = null;
        if (bannerInputRef.current) bannerInputRef.current.value = null;
    }, [activeTab]);

    const [packageDetails, setPackageDetails] = useState('');
    const [terms, setTerms] = useState('');
    const [plans, setPlans] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        duration: '',
        description: '',
        image: null, // new field

    });


    const planOptions = exercises?.map((plan) => ({
  value: plan.id,
        label: `${plan.duration}: ${plan.title}`,
        data: plan,// to retain full plan data
    }));

    const selectedOptions = selectedPlans.map((plan) => ({
      value: plan.id,
        label: `${plan.duration}: ${plan.title}`,
        data: plan,
    }));

    const handleSelectChange = (selected) => {
        setSelectedPlans(selected ? selected.map((item) => item.data) : []);
    };
    useEffect(() => {
        const getPackages = async () => {
            try {
                const response = await fetchExercises();
                 console.log("Fetched exercises:", response);

                if (response?.status && Array.isArray(response.data)) {
                    setPlans(response.data); // Set the dynamic plans from backend
                }

            } catch (error) {
                console.error("Error fetching exercises:", error);
            }
        };

        getPackages();
    }, [fetchExercises]);
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
        return exercises?.filter((plan) =>
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


    const handleSavePlan = async () => {
        const newPlan = {
            title: formData.title,
            duration: formData.duration,
            description: formData.description,
        };

        try {
            await createSessionExercise(newPlan, formData.image); // pass file here

            // Reset form
            setFormData({
                title: '',
                duration: '',
                description: '',
                image: null,
            });
            setOpenForm(false);
        } catch (err) {
            console.error('Error saving exercise:', err);
        }
    };
    useEffect(() => {
        if (id && selectedExercise) {
            setGroupName(selectedExercise.name || "");
            setDescription(selectedExercise.description || "");
            setSelectedPlans(selectedExercise.paymentPlans || []);
        }
    }, [selectedExercise]);

    if (loading) {
        return (
            <>
                <Loader />
            </>
        )
    }

    return (
        <div className=" md:p-6 bg-gray-50 min-h-screen">

            <div className={`flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-3 w-full md:w-1/2`}>
                <h2
                    onClick={() => {
                        if (previewShowModal) {
                            setPreviewShowModal(false);
                        } else {
                            navigate('/configuration/weekly-classes/session-plan-list');
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
                        {previewShowModal ? '2023/24 Standard Pricing preview' : 'Add Payment Plan Group'}
                    </span>
                </h2>


            </div>

            <div className={`flex flex-col md:flex-row bg-white  rounded-3xl ${previewShowModal ? 'md:min-w-3/4  md:p-10' : 'w-full  md:p-12 p-4'}`}>

                <>
                    <div className={`transition-all duration-300 md:w-1/2`}>
                        <div className="rounded-2xl  md:p-12 ">
                            <form className="mx-auto  space-y-4">
                                {/* Group Name */}
                                <div className="flex gap-4 border w-full border-gray-300 p-1 rounded-xl  flex-wrap">
                                    {tabs.map((tab) => (
                                        <button
                                            type="button" // ✅ This prevents form submission
                                            ref={tabRef}
                                            key={tab}
                                            onClick={() => {
                                                setActiveTab(tab);
                                                setPage(1);

                                                // Clear previews & reset file inputs
                                                setVideoUrl('');
                                                setBannerUrl('');
                                                if (videoInputRef.current) videoInputRef.current.value = null;
                                                if (bannerInputRef.current) bannerInputRef.current.value = null;
                                            }}
                                            className={`px-4 py-1.5 rounded-xl text-[19.28px] font-medium transition ${activeTab === tab
                                                ? 'bg-blue-500 text-white'
                                                : 'text-gray-500 hover:text-blue-500'
                                                }`}
                                        >
                                            {tab}
                                        </button>
                                    ))}
                                </div>

                                <div>

                                    <label className="block text-[18px]  font-semibold text-gray-700 mb-2">
                                        Group Name
                                    </label>
                                    <input
                                        value={groupNameSection}
                                        onChange={(e) => setGroupNameSection(e.target.value)}
                                        type="text"
                                        required
                                        placeholder="Enter Group Name"
                                        className="w-full px-4 font-semibold text-[18px] py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="flex w-full  gap-4 items-center">
                                    {/* Add Video */}
                                    <button
                                        type="button"
                                        onClick={() => videoInputRef.current.click()}
                                        className="flex md:w-1/2 items-center justify-center gap-1 border border-blue-500 text-[#237FEA] px-4 py-2 rounded-lg font-semibold hover:bg-blue-50"
                                    >
                                        {videoUrl ? "Change Video" : "Add Video"}
                                    </button>
                                    <input
                                        type="file"
                                        ref={videoInputRef}
                                        onChange={handleVideoChange}
                                        accept="video/*"
                                        className="hidden"
                                    />

                                    {/* Add Banner */}
                                    <button
                                        type="button"
                                        onClick={() => bannerInputRef.current.click()}
                                        className="flex md:w-1/2 items-center justify-center gap-1 border border-blue-500 text-[#237FEA] px-4 py-2 rounded-lg font-semibold hover:bg-blue-50"
                                    >
                                        {bannerUrl ? "Change Banner" : "Add Banner"}
                                    </button>
                                    <input
                                        type="file"
                                        ref={bannerInputRef}
                                        onChange={handleBannerChange}
                                        accept="image/*"
                                        className="hidden"
                                    />
                                </div>
                                <div className="flex flex-col md:flex-row items-center justify-center gap-6 mt-4 w-full">
                                    {/* Video Preview */}
                                    {videoUrl && (
                                        <div className="w-full md:w-1/2">
                                            <label className="block text-sm font-semibold mb-2 text-gray-700">Video Preview</label>
                                            <video
                                                src={videoUrl}
                                                controls
                                                className="w-full rounded-xl border border-gray-300 shadow-md"
                                            />
                                        </div>
                                    )}

                                    {/* Banner Preview */}
                                    {bannerUrl && (
                                        <div className="w-full md:w-1/2">
                                            <label className="block text-sm font-semibold  mb-2 text-gray-700">Banner Preview</label>
                                            <img
                                                src={bannerUrl}
                                                alt="Banner Preview"
                                                className="w-1/2 object-contain  rounded-xl border border-gray-300 shadow-md"
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-[18px]  font-semibold text-gray-700 mb-2">
                                        Player
                                    </label>
                                    <input

                                        value={player}
                                        onChange={(e) => setPlayer(e.target.value)}
                                        type="text"
                                        requiredx
                                        className="w-full px-4 font-semibold py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[18px]  font-semibold text-gray-700 mb-2">
                                        Skill of the day
                                    </label>
                                    <input

                                        value={skillOfTheDay}
                                        onChange={(e) => setSkillOfTheDay(e.target.value)}
                                        type="text"
                                        required
                                        className="w-full px-4 font-semibold py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[18px]  font-semibold text-gray-700 mb-2">
                                        Description
                                    </label>
                                    <input

                                        value={descriptionSession}
                                        onChange={(e) => setDescriptionSession(e.target.value)}
                                        type="text"
                                        required
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
                                        <label className="block text-[18px] font-semibold text-gray-700">
                                            Exercises
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
                                                    <span>{`${plan.duration}: ${plan.title}`}</span>
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
                                            <div className="text-gray-400 italic">No Exercise selected</div>
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
                                    Add New Exercise
                                </button>

                                {/* Footer Buttons */}
                                <div className="flex flex-wrap flex-col-reverse gap-4 md:flex-row md:items-center md:justify-end md:gap-4">



                                    <button
                                        type="button"
                                        onClick={handleCreateSession}
                                        className="bg-[#237FEA] text-white min-w-50 font-semibold px-6 py-2 rounded-lg hover:bg-blue-700 w-full md:w-auto"
                                    >
                                        {activeTab === 'Pro' ? "Finish & Save All" : "Create Sessions"}
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
                                className="w-full bg-none md:w-1/2  max-h-fit"
                            >
                                <div className=" bg-white rounded-3xl p-6  shadow-2xl relative ">
                                    <button
                                        onClick={() => setOpenForm(false)}
                                        className="absolute top-2 right-3  hover:text-gray-700 text-5xl"
                                        title="Close"
                                    >
                                        &times;
                                    </button>
                                    {/* Add your form content here */}
                                    <div className="text-[24px] font-semibold mb-4">Exercise    </div>

                                    {[
                                        { label: "Title", name: "title" },

                                        { label: "Duration", name: "duration" },

                                    ].map((field) => (
                                        <div key={field.name} className="mb-4">
                                            <label className="block text-[18px]  font-semibold text-gray-700 mb-2">{field.label}</label>
                                            <input
                                                type="text"
                                                value={formData[field.name]}
                                                onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                                                className="w-full px-4 font-semibold text-[18px] py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    ))}

                                    <div className="mb-4">
                                        <label className="block text-[18px] font-semibold text-gray-700 mb-2">
                                            Description
                                        </label>
                                        <div className="rounded-md border border-gray-300 bg-gray-100 p-1">
                                            <Editor
                                                apiKey="t3z337jur0r5nxarnapw6gfcskco6kb5c36hcv3xtcz5vi3i"

                                                value={formData.description}
                                                onEditorChange={(content) =>
                                                    setFormData({ ...formData, description: content })
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

                                    <div>
                                        <div>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                ref={fileInputRef}
                                                onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                                                style={{ display: 'none' }}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => fileInputRef.current?.click()}
                                                className="flex w-full items-center justify-center gap-1 border border-blue-500 text-[#237FEA] px-4 py-2 rounded-lg font-semibold hover:bg-blue-50"
                                            >
                                                Upload image
                                            </button>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <button
                                            onClick={handleSavePlan}
                                            className="bg-[#237FEA] text-white mt-5 md:min-w-50 w-full md:w-auto font-semibold px-6 py-2 rounded-lg hover:bg-blue-700"
                                        >
                                            Save Exercise
                                        </button>
                                    </div>



                                </div>
                                <div className="flex items-center mt-16 gap-4 justify-end">
                                    <button
                                        type="button"
                                        onClick={() => navigate('/configuration/weekly-classes/session-plan-preview')}
                                        className="flex items-center justify-center gap-1 border border-blue-500 text-[#237FEA] px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 w-full md:w-auto"
                                    >
                                        Preview Sessions
                                        <Eye size={16} />
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-[#237FEA] text-white  font-semibold px-6 py-2 rounded-lg hover:bg-blue-700 w-full md:w-auto"
                                    >
                                        {"Create Group"}
                                    </button>
                                </div>
                            </motion.div>
                        )}

                    </AnimatePresence>

                </>
            </div>


        </div>
    );
};

export default Create;
