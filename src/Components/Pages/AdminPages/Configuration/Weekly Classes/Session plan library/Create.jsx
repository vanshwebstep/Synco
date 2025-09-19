import Select from "react-select";
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Eye, Check, ChevronDown, ChevronUp, Search } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import Loader from '../../../contexts/Loader';
import { Editor } from '@tinymce/tinymce-react';
import Swal from "sweetalert2";
import { Mic, StopCircle, Play } from "lucide-react";

import { useSessionPlan } from '../../../contexts/SessionPlanContext';

const Create = () => {
    const videoInputRef = useRef(null);
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const [planLoading, setPlanLoading] = useState(false);

    const tabRef = useRef(null);
    const bannerInputRef = useRef(null);
    const [searchParams] = useSearchParams();
    const id = searchParams.get("id");
    const level = searchParams.get("level");
    const tabs = ['beginner', 'intermediate', 'advanced', 'pro'];
    const [activeTab, setActiveTab] = useState('beginner');
    const fileInputRef = useRef(null);
    const [page, setPage] = useState(1);
    const [photoPreview, setPhotoPreview] = useState([]);

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
    console.log('visibleTabs', visibleTabs)
    console.log('tabs', tabs)
    const [recording, setRecording] = useState(null); // stores Blob
    const [audioURL, setAudioURL] = useState(null);
    const [elapsedTime, setElapsedTime] = useState(0);

    const mediaRecorderRef = useRef(null);
    const audioChunks = useRef([]);
    const timerRef = useRef(null);
    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            audioChunks.current = [];

            mediaRecorderRef.current.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    audioChunks.current.push(e.data);
                }
            };

            mediaRecorderRef.current.onstop = () => {
                try {
                    const blob = new Blob(audioChunks.current, { type: "audio/webm" });
                    const url = URL.createObjectURL(blob);

                    // ⏳ short delay ensures recording fully flushed
                    setTimeout(() => {
                        setRecording(blob);
                        setAudioURL(url);
                    }, 200);

                    // 🔒 release mic
                    stream.getTracks().forEach((track) => track.stop());
                } catch (err) {
                    console.error("Error finalizing recording:", err);
                }
            };

            mediaRecorderRef.current.start();
            setRecording("in-progress");
            setElapsedTime(0);

            timerRef.current = setInterval(() => {
                setElapsedTime((prev) => prev + 1);
            }, 1000);
        } catch (err) {
            console.error("Error accessing microphone:", err);
            alert("Microphone access denied or not available.");
        }
    };

    const stopRecording = () => {
        try {
            mediaRecorderRef.current?.stop();
        } catch (err) {
            console.error("Error stopping recording:", err);
        }
        clearInterval(timerRef.current);
    };

    const formatTime = (secs) => {
        const m = String(Math.floor(secs / 60)).padStart(2, "0");
        const s = String(secs % 60).padStart(2, "0");
        return `${m}:${s}`;
    };



    console.log('level', level)

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


       const handleCreateSession = (finalSubmit = false) => {
           if (isProcessing) return;
   
   
           if (!groupNameSection || !player || !skillOfTheDay || !descriptionSession || selectedPlans.length === 0) {
               Swal.fire({
                   icon: 'warning',
                   title: 'Please fill out all required fields before proceeding.',
               });
               return;
           }
   
           setIsProcessing(true);
   
           if (tabRef.current) {
               tabRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
           }
           console.log('selectedPlanssssssssssss', selectedPlans)
           const currentLevel = {
               level: activeTab,
               player,
               groupNameSection,
               skillOfTheDay,
               recording,
               descriptionSession,
               videoFile,
               bannerFile,
               sessionExerciseIds: selectedPlans.map(plan => plan.id),
           };
   
           setLevels((prevLevels) => {
               const existingIndex = prevLevels.findIndex((lvl) => lvl.level === activeTab);
               const updated = [...prevLevels];
               if (existingIndex !== -1) {
                   updated[existingIndex] = currentLevel;
               } else {
                   updated.push(currentLevel);
               }
   
               // Pass finalSubmit to handleNextTabOrSubmit
               handleNextTabOrSubmit(updated, finalSubmit);
   
               return updated;
           });
   
           setIsProcessing(false);
       };
   
       const handleNextTabOrSubmit = (updatedLevels, forceSubmit = false) => {
           const nextIndex = tabs.findIndex((tab) => tab === activeTab) + 1;
           const isLastTab = nextIndex >= tabs.length;
   
           // ✅ Only send the activeTab when editing
           const levelsToSend = (isEditMode && id && level)
               ? updatedLevels.filter(item => item.level === activeTab)
               : updatedLevels;
   
           const transformed = {
               groupName: groupNameSection,
               player,
               video: videoFile,
               banner: bannerFile,
               levels: {},
           };
   console.log('transformed',transformed)
           levelsToSend.forEach((item) => {
               const levelKey = item.level.replace(/s$/i, '').toLowerCase();
   
               if (!transformed.levels[levelKey]) {
                   transformed.levels[levelKey] = [];
               }
   
               transformed.levels[levelKey].push({
                   skillOfTheDay: item.skillOfTheDay,
                   recording: item.recording,
                   description: item.descriptionSession,
                   sessionExerciseId: item.sessionExerciseIds,
               });
           });
   
           if (videoFile instanceof File) {
               transformed["video_file"] = videoFile;
           }
           if (bannerFile instanceof File) {
               transformed["banner_file"] = bannerFile;
           }
           if (recording instanceof Blob) {
               formData.append("recording", recording, "recording.webm");
           }
   
           if ((isEditMode && id && level) || isLastTab || forceSubmit) {
               if (isEditMode && id && level) {
                   updateDiscount(id, transformed);
               } else {
                   createSessionGroup(transformed);
               }
           } else {
               // ✅ move to next tab but restore its data if exists
               const nextTab = tabs[nextIndex];
               setActiveTab(nextTab);
               setPage(1);
   
               const existingLevel = updatedLevels.find((lvl) => lvl.level === nextTab);
   
               if (existingLevel) {
                   setSkillOfTheDay(existingLevel.skillOfTheDay || "");
                   setRecording(existingLevel.recording || null);
                   setDescriptionSession(existingLevel.descriptionSession || "");
                   setSelectedPlans(
                       existingLevel.sessionExerciseIds?.map(id =>
                           planOptions.find(opt => opt.id === id)
                       ).filter(Boolean) || []
                   );
               } else {
                   // fresh
                   setSkillOfTheDay("");
                   setRecording(null);
                   setDescriptionSession("");
                   setSelectedPlans([]);
               }
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
        if (selectedGroup && isEditMode) {
            let parsedLevels = selectedGroup.levels;

            // If it's stringified, parse it
            if (typeof parsedLevels === "string") {
                try {
                    parsedLevels = JSON.parse(parsedLevels);
                } catch (err) {
                    console.error("Failed to parse levels JSON:", err);
                    return;
                }
            }

            // Set top-level values
            setGroupNameSection(selectedGroup.groupName || "");
            setPlayer(selectedGroup.player || "");

            // ✅ Video (string URL or File)
            if (selectedGroup.video instanceof File) {
                setVideoFile(selectedGroup.video);
            } else if (typeof selectedGroup.video === "string") {
                setVideoFile(selectedGroup.video); // direct URL
            } else {
                setVideoFile("");
            }

            // ✅ Banner (string URL or File)
            if (selectedGroup.banner instanceof File) {
                setBannerFile(selectedGroup.banner);
            } else if (typeof selectedGroup.banner === "string") {
                setBannerFile(selectedGroup.banner); // direct URL
            } else {
                setBannerFile("");
            }

            // ✅ Levels mapping
            const loadedLevels = [];
            Object.entries(parsedLevels || {}).forEach(([levelKey, sessions]) => {
                sessions?.forEach((session) => {
                    loadedLevels.push({
                        level: levelKey,
                        player: session.player || "",
                        skillOfTheDay: session.skillOfTheDay || "",
                        recording: session.recording || "",
                        descriptionSession: session.description || "",
                        sessionExerciseId: session.sessionExerciseId || [],
                        sessionExercises: session.sessionExercises || [],
                        bannerFile: selectedGroup.banner, // use top-level
                        videoFile: selectedGroup.video,   // use top-level
                    });
                });
            });

            setLevels(loadedLevels);
        }
    }, [selectedGroup, isEditMode]);


    useEffect(() => {

        const existingLevel = levels.find((lvl) => lvl.level?.toLowerCase?.() === activeTab?.toLowerCase?.());
        console.log('existingLevel', existingLevel)
        if (!existingLevel) {
            setSkillOfTheDay('');
            setRecording('');
            setDescriptionSession('');
            setSelectedPlans([]);
            setSessionExerciseId([]);
            return;
        }

        setSkillOfTheDay(existingLevel.skillOfTheDay || '');
        setRecording(existingLevel.recording || '');
        setDescriptionSession(existingLevel.descriptionSession || '');
        // Step 1: Ensure sessionExerciseIds is set
        console.log('existingLevel', existingLevel)
        setSessionExerciseId(existingLevel.sessionExerciseIds || []);
        // setSelectedPlans(
        //     existingLevel.sessionExerciseIds?.map(id =>
        //         planOptions.find(opt => opt.id === id)
        //     ).filter(Boolean) || []
        // );
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


        setSelectedPlans(selectedPlans);

        // ✅ Handle videoFile (convert to previewable URL if File or string)


        console.log('existingLevel', existingLevel);
    }, [activeTab, levels]);

    //HOLDDD
    useEffect(() => {
        if (selectedGroup && isEditMode) {
            console.log('selectedGroup found ', selectedGroup)

            const currentLevelData = levels.find((item) => item.level == activeTab);
            setSelectedPlans(
                (currentLevelData?.sessionExercises || []).map((exercise) => ({
                    id: exercise.id,
                    title: exercise.title || 'not found',
                    duration: exercise.duration || 'not found',
                }))
            );

        }
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
        const { title, duration, description, images } = formData;

        // ✅ Reusable dynamic SweetAlert
        const showAlert = ({ type = 'info', message = '', title = '' }) => {
            Swal.fire({
                icon: type,
                title: title || type.charAt(0).toUpperCase() + type.slice(1),
                text: message,
                timer: type === 'success' ? 1500 : undefined,
                showConfirmButton: type !== 'success',
            });
        };

        // --- Frontend validation ---
        if (!title.trim()) {
            showAlert({ type: 'warning', message: 'Title is required', title: 'Missing Field' });
            return;
        }
        if (!duration.trim()) {
            showAlert({ type: 'warning', message: 'Duration is required', title: 'Missing Field' });
            return;
        }

        const imageList = Array.isArray(images) ? images : [];
        const hasValidImage = imageList.some(file => file instanceof File);
        if (!hasValidImage) {
            showAlert({ type: 'warning', message: 'Please upload at least one image', title: 'Missing Image' });
            return;
        }

        setPlanLoading(true);

        const data = new FormData();
        data.append('title', title);
        data.append('duration', duration);
        data.append('description', description);
        imageList.forEach(file => file instanceof File && data.append('images', file));

        // --- API call ---
        try {
            await createSessionExercise(formData);

            setFormData({ title: '', duration: '', description: '', images: [] });
            setOpenForm(false);
            setPhotoPreview([]);
            showAlert({ type: 'success', message: 'Exercise saved successfully!', title: 'Saved' });

        } catch (err) {
            console.error('Error saving exercise:', err);

            // Dynamic backend error handling
            const message = err.message || 'Something went wrong';
            const code = err.code;

            if (code === 'UNAUTHORIZED') {
                showAlert({ type: 'error', message, title: 'Permission Denied' });
            } else {
                showAlert({ type: 'error', message, title: 'Error' });
            }

        } finally {
            setPlanLoading(false);
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
                        {previewShowModal ? '2023/24 Standard Pricing preview' : 'Add a Session Plan Group'}
                    </span>
                </h2>


            </div>

            <div className={`flex flex-col md:flex-row bg-white  rounded-3xl ${previewShowModal ? 'md:min-w-3/4  md:p-10' : 'w-full  md:p-12 p-4'}`}>

                <>
                    <div className={`transition-all duration-300 md:w-1/2`}>
                        <div className="rounded-2xl  md:p-10 ">
                            <form className="mx-auto  space-y-4">
                               
                                <div className="flex gap-4   my-10 border w-full border-gray-300 p-1 rounded-xl  flex-wrap">
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
                                    <label className="block text-lg font-semibold text-gray-700 mb-2">
                                        Add Audio
                                    </label>

                                    <div className="flex flex-col gap-3 px-4 py-2 border border-gray-200 rounded-xl bg-gray-50 shadow-sm">
                                        {/* Record / Stop button */}
                                        <div className="flex items-center gap-4">
                                            {recording === "in-progress" ? (
                                                <button
                                                    onClick={stopRecording}
                                                    type="button"
                                                    className="bg-red-500 text-white p-3 rounded-full shadow hover:scale-110 transition"
                                                >
                                                    <StopCircle size={28} />
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={startRecording}
                                                    type="button"
                                                    className="bg-blue-500 text-white p-2 rounded-full shadow hover:scale-110 transition"
                                                >
                                                    <Mic size={28} />
                                                </button>
                                            )}

                                            <span
                                                className={`font-medium ${recording === "in-progress" ? "text-red-600" : "text-gray-600"
                                                    }`}
                                            >
                                                {recording === "in-progress"
                                                    ? `Recording... ${formatTime(elapsedTime)}`
                                                    : "Click mic to record"}
                                            </span>
                                        </div>

                                        {/* Waveform animation */}
                                        {recording === "in-progress" && (
                                            <div className="flex gap-1 mt-2 h-6 items-end">
                                                {Array.from({ length: 20 }).map((_, i) => (
                                                    <div
                                                        key={i}
                                                        className="w-1 bg-red-400 rounded"
                                                        style={{
                                                            height: `${Math.random() * 100}%`,
                                                            animation: "bounce 0.8s infinite ease-in-out",
                                                            animationDelay: `${i * 0.05}s`,
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                        )}

                                        {/* Playback */}
                                        {audioURL && recording !== "in-progress" && (
                                            <div className="flex items-center gap-3 mt-2 w-full">
                                                <audio
                                                    controls
                                                    src={audioURL}
                                                    className="w-full rounded-lg border border-gray-300 shadow-sm"
                                                />
                                            </div>
                                        )}
                                    </div>

                                    <style jsx>{`
                                    @keyframes bounce {
                                    0%,
                                    100% {
                                        transform: scaleY(0.3);
                                    }
                                    50% {
                                        transform: scaleY(1);
                                    }
                                    }
                                `}</style>
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
                                            <div className="text-gray-400 italic py-3">  </div>
                                        )}
                                    </div>

                               <AnimatePresence initial={false}>
  {isOpen && (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      className="overflow-hidden"
    >
      <div className="w-full mb-4">
        <Select
          options={planOptions}
          value={selectedOptions}
          onChange={handleSelectChange}
          isMulti
          placeholder="✨ Select Exercises..."
          className="react-select-container"
          classNamePrefix="react-select"
          menuPortalTarget={document.body}
          styles={{
            control: (base, state) => ({
              ...base,
              borderRadius: "14px",
              border: "1px solid",
              borderColor: state.isFocused ? "#3b82f6" : "#e5e7eb", // Blue-500 or Gray-200
              boxShadow: state.isFocused
                ? "0 0 0 3px rgba(59, 130, 246, 0.2)"
                : "0 1px 2px rgba(0,0,0,0.05)",
              transition: "all 0.2s ease",
              minHeight: "52px",
              padding: "4px 8px",
              backgroundColor: "#fff",
              fontSize: "15px",
              fontWeight: 500,
            }),
            valueContainer: (base) => ({
              ...base,
              gap: "6px",
              padding: "2px 4px",
            }),
            placeholder: (base) => ({
              ...base,
              color: "#9ca3af", // gray-400
              fontSize: "15px",
              fontWeight: 400,
            }),
            menu: (base) => ({
              ...base,
              zIndex: 9999,
              borderRadius: "14px",
              marginTop: "6px",
              padding: "6px 0",
              backgroundColor: "white",
              boxShadow:
                "0 8px 24px rgba(0,0,0,0.12), 0 4px 6px rgba(0,0,0,0.08)",
            }),
            option: (base, state) => ({
              ...base,
              backgroundColor: state.isSelected
                ? "#2563eb"
                : state.isFocused
                ? "#f3f4f6"
                : "transparent",
              color: state.isSelected ? "white" : "#111827",
              fontSize: "15px",
              fontWeight: state.isSelected ? 600 : 400,
              padding: "12px 16px",
              cursor: "pointer",
              transition: "all 0.15s ease",
            }),
            multiValue: (base) => ({
              ...base,
              borderRadius: "10px",
              backgroundColor: "#eff6ff", // blue-50
              padding: "2px 8px",
              display: "flex",
              alignItems: "center",
            }),
            multiValueLabel: (base) => ({
              ...base,
              color: "#1d4ed8", // blue-700
              fontWeight: 500,
              fontSize: "14px",
            }),
            multiValueRemove: (base) => ({
              ...base,
              color: "#2563eb",
              borderRadius: "6px",
              ":hover": {
                backgroundColor: "#2563eb",
                color: "white",
              },
            }),
            dropdownIndicator: (base, state) => ({
              ...base,
              color: state.isFocused ? "#2563eb" : "#9ca3af",
              transition: "transform 0.2s ease",
              transform: state.selectProps.menuIsOpen
                ? "rotate(180deg)"
                : "rotate(0deg)",
            }),
            indicatorSeparator: () => ({ display: "none" }),
            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
          }}
          closeMenuOnSelect={false}
          hideSelectedOptions={false}
          isClearable
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
                                        onClick={() => handleCreateSession()} // default = false
                                        disabled={isProcessing}
                                        className={`min-w-50 font-semibold px-6 py-2 rounded-lg w-full md:w-auto 
                                   ${isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#237FEA] hover:bg-blue-700 text-white'}`}
                                    >
                                        {isProcessing ? 'Processing...' :
                                            (isEditMode && id && level
                                                ? (activeTab === 'pro' ? 'Finish & Update All' : 'Update Session')
                                                : (activeTab === 'pro' ? 'Finish & Save All' : 'Create Sessions'))
                                        }
                                    </button>

                                </div>

                            </form>
                        </div>
                    </div>
                    <div className="w-full bg-none md:w-1/2  max-h-fit">
                        <AnimatePresence>
                            {openForm && (
                                <motion.div
                                    initial={{ x: '100%', opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: '100%', opacity: 0 }}
                                    transition={{ duration: 0.4 }}
                                    className="bg-white rounded-3xl p-6 my-8  shadow-2xl relative "
                                >
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
                                                    // Create URLs for each file
                                                    const previews = files.map((file) => URL.createObjectURL(file));
                                                    setPhotoPreview(previews);
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

                                            {/* Render multiple previews */}
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {photoPreview?.map((src, index) => (
                                                    <img
                                                        key={index}
                                                        src={src}
                                                        alt={`preview-${index}`}
                                                        className="w-24 h-24 object-cover rounded-md"
                                                    />
                                                ))}
                                            </div>
                                        </div>


                                    </div>
                                    <div className="text-right flex justify-end">
                                        <button
                                            onClick={handleSavePlan}
                                            disabled={planLoading}
                                            className={`bg-[#237FEA] text-white mt-5 md:min-w-50 w-full md:w-auto font-semibold px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''
                                                }`}
                                        >
                                            {planLoading ? (
                                                <>
                                                    <svg
                                                        className="animate-spin h-5 w-5 text-white"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <circle
                                                            className="opacity-25"
                                                            cx="12"
                                                            cy="12"
                                                            r="10"
                                                            stroke="currentColor"
                                                            strokeWidth="4"
                                                        ></circle>
                                                        <path
                                                            className="opacity-75"
                                                            fill="currentColor"
                                                            d="M4 12a8 8 0 018-8v8H4z"
                                                        ></path>
                                                    </svg>
                                                    Saving...
                                                </>
                                            ) : (
                                                'Save Exercise'
                                            )}
                                        </button>

                                    </div>






                                </motion.div>
                            )}

                        </AnimatePresence>

                        <div className="flex items-center mt-16 gap-4 justify-end">
                            <button
                                type="button"
                                onClick={() => navigate(`/configuration/weekly-classes/session-plan-preview${isEditMode && id ? `?id=${id}` : ''}`)}
                                className={`flex items-center justify-center gap-1 border border-blue-500 text-[#237FEA] px-4 py-2 rounded-lg font-semibold w-full md:w-auto 
            ${!isEditMode ? 'cursor-not-allowed opacity-50' : 'hover:bg-blue-50'}`}
                                disabled={!isEditMode}
                            >
                                Preview Sessions
                                <Eye size={16} />
                            </button>
                            <button
                                type="button"
                                onClick={() => handleCreateSession(true)} // pass true to finalize
                                disabled={isProcessing}
                                className={`font-semibold px-6 py-2 rounded-lg w-full md:w-auto 
            ${isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#237FEA] hover:bg-blue-700 text-white'}`}
                            >
                                {isProcessing ? 'Processing...' : isEditMode ? 'Update Group' : 'Create Group'}
                            </button>

                        </div>

                    </div>

                </>
            </div>


        </div>
    );
};

export default Create;
