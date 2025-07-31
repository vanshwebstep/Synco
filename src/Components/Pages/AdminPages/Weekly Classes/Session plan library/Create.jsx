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
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const tabRef = useRef(null);
    const bannerInputRef = useRef(null);
    const [searchParams] = useSearchParams();
    const id = searchParams.get("id");
    const level = searchParams.get("level");
    const tabs = ['beginner', 'intermediate', 'advanced', 'pro'];
    const [activeTab, setActiveTab] = useState('beginner');
    const fileInputRef = useRef(null);
    const [page, setPage] = useState(1);
    const [groupName, setGroupName] = useState('');
    const [groupNameSection, setGroupNameSection] = useState('');
    const [player, setPlayer] = useState('');
    const [skillOfTheDay, setSkillOfTheDay] = useState('');
    const [descriptionSession, setDescriptionSession] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [previewShowModal, setPreviewShowModal] = useState(false);
    const { fetchExercises, sessionGroup, groups, updateDiscount, createSessionExercise, selectedGroup, fetchGroupById, loading, createGroup, selectedExercise, exercises, updateGroup, setExercises, createSessionGroup, fetchSessionGroup } = useSessionPlan();
    const [selectedPlans, setSelectedPlans] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const visibleTabs = level ? tabs.filter((tab) => tab.toLowerCase() == level.toLowerCase()) : tabs;
console.log('visibleTabs',visibleTabs)
console.log('tabs',tabs)

console.log('level',level)

    const [sessionExerciseId, setSessionExerciseId] = useState([]); // or selectedPlans[0]?.id
    const [levels, setLevels] = useState([]);
    // State for raw file instead of preview URL
    const [videoFile, setVideoFile] = useState(null);
    const [videoFilePreview, setVideoFilePreview] = useState(null);
    const [bannerFilePreview, setBannerFilePreview] = useState(null);

    const [bannerFile, setBannerFile] = useState(null);
    const [packageDetails, setPackageDetails] = useState('');
    const [terms, setTerms] = useState('');
    const [plans, setPlans] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        duration: '',
        description: '',
        image: [], // new field

    });

    const [openForm, setOpenForm] = useState(false);
    const navigate = useNavigate();
    const handleVideoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setVideoFile(file);
        }
    };

    const handleBannerChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setBannerFile(file);

        }
    };

    const handleCreateSession = () => {
        if (isProcessing) return;
        setIsProcessing(true);

        if (tabRef.current) {
            tabRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        const currentLevel = {
            level: activeTab,
            player,
            groupNameSection,
            skillOfTheDay,
            descriptionSession,
            videoFile,
            bannerFile,
            sessionExerciseIds: selectedPlans.map(plan => plan.id),
        };
        console.log('currentLevel',currentLevel)
        setLevels((prevLevels) => {
            const existingIndex = prevLevels.findIndex((lvl) => lvl.level == activeTab);
            const updated = [...prevLevels];
            if (existingIndex !== -1) {
                updated[existingIndex] = currentLevel;
            } else {
                updated.push(currentLevel);
            }
            console.log('existingIndex',existingIndex)
            console.log('updated',updated)

            handleNextTabOrSubmit(updated);

            return updated;
        });
        setIsProcessing(false);

    };

    const handleNextTabOrSubmit = (updatedLevels) => {
        console.log('➡️ handleNextTabOrSubmit called');
        console.log('Current tab:', activeTab);
        console.log('Updated levels:', updatedLevels);

        const nextIndex = tabs.findIndex((tab) => tab === activeTab) + 1;
        const isLastTab = nextIndex >= tabs.length;

        // Build common transformed data
        const transformed = {
            groupName: groupNameSection,
            levels: {},
        };

        const allMediaFiles = {};

        updatedLevels.forEach((item) => {
            const levelKey = item.level.replace(/s$/i, '').toLowerCase();

            if (!transformed.levels[levelKey]) {
                transformed.levels[levelKey] = [];
            }

            // Only keep non-media fields inside levels
            transformed.levels[levelKey].push({
                player: item.player,
                skillOfTheDay: item.skillOfTheDay,
                description: item.descriptionSession,
                sessionExerciseId: item.sessionExerciseIds,
            });

            // Store media files separately
            allMediaFiles[levelKey] = {
                banner: item.bannerFile,
                video: item.videoFile,
            };
        });


        console.log('allMediaFiles', allMediaFiles)
        // Add media fields outside of levels only if they're Files (skip URLs)
        Object.entries(allMediaFiles).forEach(([levelKey, media]) => {
            if (media.video instanceof File) {
                transformed[`${levelKey}_video`] = media.video;
            }
            if (media.banner instanceof File) {
                transformed[`${levelKey}_banner`] = media.banner;
            }
        });


        // Submit if in edit mode or final tab
        if ((isEditMode && id && level) || isLastTab) {
            console.log(`📤 Submitting ${isEditMode ? 'updated' : 'new'} session group:`, transformed);

            if (isEditMode && id && level) {
                updateDiscount(id, transformed);
            } else {
                createSessionGroup(transformed);
            }
        } else {
            // ⏭ Move to next tab
            console.log(`➡️ Moving to next tab: ${tabs[nextIndex]}`);
            setActiveTab(tabs[nextIndex]);
            setPage(1);
            setPlayer('');
            setSkillOfTheDay('');
            setDescriptionSession('');
            setBannerFile('');
            setVideoFile('');
            if (videoInputRef.current) videoInputRef.current.value = null;
            if (bannerInputRef.current) bannerInputRef.current.value = null;
            console.log('✅ Tab data reset and ready for next input.');
        }
    };

    useEffect(() => {
        if (level) {
            const matchedTab = tabs.find(
                tab => tab.toLowerCase() == level.toLowerCase()
            );
            setActiveTab(matchedTab || 'beginner');
        } else {
            const tabFromUrl = level && tabs.includes(level) ? (level) : 'beginner';
            setActiveTab(tabFromUrl);
        }
    }, [level]);

    useEffect(() => {
        if (id) {
            setIsEditMode(true);
            fetchGroupById(id);
        } else {
            setIsLoading(false);
        }
    }, [id]);


    useEffect(() => {
        if (selectedGroup?.levels && isEditMode) {
            let parsedLevels;

            if (typeof selectedGroup.levels === "string") {
                try {
                    parsedLevels = JSON.parse(selectedGroup.levels);
                } catch (err) {
                    console.error("Failed to parse levels JSON:", err);
                    return;
                }
            } else {
                parsedLevels = selectedGroup.levels;
            }

            const loadedLevels = [];
            setGroupNameSection(selectedGroup.groupName || '');

            Object.entries(parsedLevels).forEach(([levelKey, sessions]) => {
                const bannerKey = `${levelKey}_banner`;
                const videoKey = `${levelKey}_video`;

                const banner = selectedGroup[bannerKey] || '';
                const video = selectedGroup[videoKey];

                // if (video) {
                //     const myVideo = `${API_BASE_URL}/${video}`;
                //     setVideoFilePreview(myVideo); // ✅ Set only if it exists
                // }

                // if (banner) {
                //     const myBanner = `${API_BASE_URL}/${banner}`;
                //     setBannerFilePreview(myBanner); // ✅ Set only if it exists
                // }

                // setBannerFile(banner);
                sessions?.forEach((session) => {
                    loadedLevels.push({
                        level: levelKey,
                        player: session.player || '',
                        skillOfTheDay: session.skillOfTheDay || '',
                        descriptionSession: session.description || '',
                        sessionExerciseId: session.sessionExerciseId || [],
                        sessionExercises: session.sessionExercises || [],
                        bannerFile: banner,
                        videoFile: video,
                    });
                });
            });

            setLevels(loadedLevels);
        }
    }, [selectedGroup, isEditMode]);

    useEffect(() => {
        const existingLevel = levels.find((lvl) => lvl.level?.toLowerCase?.() === activeTab?.toLowerCase?.());

        if (!existingLevel) {
            setPlayer('');
            setSkillOfTheDay('');
            setDescriptionSession('');
            setBannerFile('');
            setVideoFile('');
            setSelectedPlans([]);
            setSessionExerciseId([]);
            return;
        }

        setPlayer(existingLevel.player || '');
        setSkillOfTheDay(existingLevel.skillOfTheDay || '');
        setDescriptionSession(existingLevel.descriptionSession || '');
        // Step 1: Ensure sessionExerciseIds is set
        setSessionExerciseId(existingLevel.sessionExerciseIds || []);

        // Step 2: Match selected plans from planOptions using the ids
        const selectedPlans = (planOptions || [])
            .filter(option => (existingLevel.sessionExerciseIds || []).includes(option.value))
            .map(option => ({
                id: option.data.id,
                title: option.data.title,
                duration: option.data.duration
            }));

        // Optional: Logging for debug
        console.log('Selected Plan IDs:', existingLevel.sessionExerciseIds);
        console.log('Matched Selected Plans:', selectedPlans);

        // Step 3: Set selected plans state
        setSelectedPlans(selectedPlans);

        // ✅ Handle videoFile (convert to previewable URL if File or string)
        if (existingLevel.videoFile) {
            if (existingLevel.videoFile instanceof File) {
                // Already a File object
                setVideoFile(existingLevel.videoFile);
            } else if (typeof existingLevel.videoFile === 'string') {
                const videoPath = `${API_BASE_URL}/${existingLevel.videoFile}`;
                setVideoFile(videoPath); // ✅ Just set the string URL
            }
        } else {
            console.log("🚫 No videoFile found in existingLevel.");
        }

        // ✅ Handle bannerFile (convert to previewable URL if File or string)
        if (existingLevel.bannerFile) {
            if (existingLevel.bannerFile instanceof File) {
                // Already a File object
                setBannerFile(existingLevel.bannerFile);
            } else if (typeof existingLevel.bannerFile === 'string') {
                const bannerPath = `${API_BASE_URL}/${existingLevel.bannerFile}`;
                setBannerFile(bannerPath); // ✅ Just set the string URL
            }
        } else {
            console.log("🚫 No bannerFile found in existingLevel.");
        }

        console.log('existingLevel', existingLevel);
    }, [activeTab, levels]);


    useEffect(() => {
        const currentLevelData = levels.find((item) => item.level == activeTab);
        setSelectedPlans(
            (currentLevelData?.sessionExercises || []).map((exercise) => ({
                id: exercise.id,
                title: exercise.title || 'not found',
                duration: exercise.duration || 'not found',
            }))
        );

    }, [activeTab, levels]);


    const planOptions = exercises?.map((plan) => ({
        value: plan.id,
        label: `${plan.duration}: ${plan.title}`,
        data: plan, // to retain full plan data
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

                if (response?.status && Array.isArray(response.data)) {
                    setPlans(response.data); // Set the dynamic plans from backend
                }

            } catch (error) {
                console.error("Error fetching exercises:", error);
            }
        };

        getPackages();
    }, [fetchExercises]);
    const handleAddPlan = () => {
        setOpenForm(true);
    };
    const handleRemovePlan = (index) => {
        const updated = [...selectedPlans];
        updated.splice(index, 1);
        setSelectedPlans(updated);
    };
    const handleSavePlan = async () => {
        const data = new FormData();
        data.append('title', formData.title);
        data.append('duration', formData.duration);
        data.append('description', formData.description);

        formData.images.forEach((file) => {
            if (file instanceof File) {
                data.append('images', file); // or 'images[]' depending on backend
            }
        });

        try {
            await createSessionExercise(formData);

            // Reset form
            setFormData({
                title: '',
                duration: '',
                description: '',
                images: [],
            });
            setOpenForm(false);
        } catch (err) {
            console.error('Error saving exercise:', err);
        }
    };


    const videoPreviewUrl = useMemo(() => {
        if (videoFile && typeof videoFile !== "string") {
            return URL.createObjectURL(videoFile);
        }
        return typeof videoFile === "string" ? videoFile : null;
    }, [videoFile]);

    const bannerPreviewUrl = useMemo(() => {
        if (bannerFile && typeof bannerFile !== "string") {
            return URL.createObjectURL(bannerFile);
        }
        return typeof bannerFile === "string" ? bannerFile : null;
    }, [bannerFile]);
    if (loading) {
        return (
            <>
                <Loader />
            </>
        )
    }

    console.log('formData', formData)
    const stripHtml = (html) => {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || '';
    };
    const handleTabClick = (tab) => {
        setActiveTab(tab);
        setPage(1);
        setVideoFile('');
        setBannerFile('');
        if (videoInputRef.current) videoInputRef.current.value = null;
        if (bannerInputRef.current) bannerInputRef.current.value = null;
    };
    console.log('selectedPlans', selectedPlans)
    return (
        <div className=" md:p-6 bg-gray-50 min-h-screen">

            <div className={`flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-3 w-full md:w-1/2`}>
                <h2
                    onClick={() => {
                        if (previewShowModal) {
                            setPreviewShowModal(false);
                        } else {
                            navigate('/weekly-classes/session-plan-list');
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
                                <div className="flex gap-4   border w-full border-gray-300 p-1 rounded-xl  flex-wrap">
                                    {visibleTabs.map((tab) => (
                                        <button
                                            type="button"
                                            ref={tabRef}
                                            key={tab}
                                            onClick={() => handleTabClick(tab)}
                                            className={`px-4 py-1.5 rounded-xl text-[19.28px] font-medium capitalize transition ${activeTab == tab ? 'bg-blue-500 text-white' : 'text-gray-500 hover:text-blue-500'
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
                                        className="flex w-1/2 items-center justify-center gap-1 border border-blue-500 text-[#237FEA] px-4 py-2 rounded-lg font-semibold hover:bg-blue-50"
                                    >
                                        {videoFile ? "Change Video" : "Add Video"}
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
                                        className="flex w-1/2 items-center justify-center gap-1 border border-blue-500 text-[#237FEA] px-4 py-2 rounded-lg font-semibold hover:bg-blue-50"
                                    >
                                        {bannerFile ? "Change Banner" : "Add Banner"}
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
                                    {videoFile && videoPreviewUrl && (
                                        <div className="w-full md:w-1/2">
                                            <label className="block text-sm font-semibold mb-2 text-gray-700">Video Preview</label>
                                            <video
                                                controls
                                                className="w-full h-auto rounded shadow"
                                                src={videoPreviewUrl}
                                                onError={() => console.error("Failed to load video:", videoFile)}
                                            />
                                        </div>
                                    )}

                                    {bannerFile && bannerPreviewUrl && (
                                        <div className="w-full md:w-1/2">
                                            <label className="block text-sm font-semibold mb-2 text-gray-700">Banner Preview</label>
                                            <img
                                                src={bannerPreviewUrl}
                                                alt="Banner Preview"
                                                className="w-full h-auto rounded shadow"
                                                onError={(e) => {
                                                    console.error("Failed to load banner:", bannerFile);
                                                    e.target.style.display = "none";
                                                }}
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
                                        {isEditMode && id && level ? (activeTab == 'Pro' ? "Finish & Update All" : "Update Session") : (activeTab == 'Pro' ? "Finish & Save All" : "Create Sessions")}
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

                                    <div className="mb-4 relative">
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
                                                    plugins: 'lists advlist code',
                                                    toolbar:
                                                        'fontsizeselect capitalize bold italic underline alignleft aligncenter alignjustify  bullist numlist  code',
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
                                                    },
                                                }}
                                            />


                                        </div>

                                    </div>

                                    <div>
                                        <div>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                ref={fileInputRef}
                                                onChange={(e) => {
                                                    const files = Array.from(e.target.files);
                                                    setFormData((prev) => ({ ...prev, images: files }));
                                                }}
                                                style={{ display: 'none' }}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => fileInputRef.current?.click()}
                                                className="flex w-full items-center justify-center gap-1 border border-blue-500 text-[#237FEA] px-4 py-2 rounded-lg font-semibold hover:bg-blue-50"
                                            >
                                                Upload images
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
                                        onClick={() => navigate('/weekly-classes/session-plan-preview')}
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
