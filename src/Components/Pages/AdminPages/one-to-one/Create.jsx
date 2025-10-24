import React, { useState, useCallback, useEffect } from "react";
import Select from "react-select";
import { FaEye } from "react-icons/fa";
const tabs = ["Beginners", "Intermediate", "Advanced", "Pro"];
import { Trash2, Copy } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Editor } from '@tinymce/tinymce-react';
import Loader from "../contexts/Loader";

export default function Create() {
    const navigate = useNavigate();

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const token = localStorage.getItem("adminToken");
    const [mounted, setMounted] = useState(false);
    const [activeTab, setActiveTab] = useState("Beginners");
    const [showExerciseModal, setShowExerciseModal] = useState(false);
    const [groupData, setGroupData] = useState({
        groupName: "",
        player: "",
        skill: "",
        description: "",
        exercises: [],
        video: null,
        banner: null,
    });
    const MultiValue = () => null; // Hides the default selected boxes
    const [savedTabsData, setSavedTabsData] = useState({});
    const [exercises, setExercises] = useState([]);
    const [loading, setLoading] = useState(null);
    const [isEditExcercise, setIsEditExcercise] = useState(null);

    const [exercise, setExercise] = useState({
        title: "",
        duration: "",
        description: "",
        image: "",
        imageToSend: ""
    });
    const emptySession = () => {
        setGroupData({
            groupName: "",
            player: "",
            skill: "",
            description: "",
            exercises: [],
            video: null,
            banner: null,
        });
        setSavedTabsData(null);
    }



    const emptyExcerCises = () => {
        setExercise(
            {
                title: "",
                duration: "",
                description: "",
                image: "",
                imageToSend: ""
            }
        )
    }
    useEffect(() => {
        setMounted(true);
    }, [])

    const fetchExercises = useCallback(async () => {
        if (!token) return;
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/admin/one-to-one/session-exercise-struture/listing`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const result = await response.json();
            setExercises(result.data || []);
        } catch (err) {
            console.error("Failed to fetch packages:", err);
        } finally {
            setLoading(false);
        }
    }, [token]);
    const fetchExcercisesById = useCallback(async (id) => {
        if (!token) return;
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/admin/one-to-one/session-exercise-struture/listing/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const result = await response.json();
            setExercise(result.data || []);
        } catch (err) {
            console.error("Failed to fetch packages:", err);
        } finally {
            setLoading(false);
        }
    }, [token]);

    const saveExercise = useCallback(
        async (id) => {
            if (!token) return;

            try {

                Swal.fire({
                    title: isEditExcercise ? "Updating Exercise..." : "Saving Exercise...",
                    text: "Please wait while we process your request.",
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();
                    },
                });


                const formdata = new FormData();
                formdata.append("title", exercise.title);
                formdata.append("description", exercise.description);
                formdata.append("duration", exercise.duration);

                if (exercise.imageToSend && exercise.imageToSend.length > 0) {
                    exercise.imageToSend.forEach((file) => {
                        formdata.append("images", file);
                    });
                }

                const url = !isEditExcercise
                    ? `${API_BASE_URL}/api/admin/one-to-one/session-exercise-struture/create`
                    : `${API_BASE_URL}/api/admin/one-to-one/session-exercise-struture/update/${id}`;

                const response = await fetch(url, {
                    method: isEditExcercise ? 'PUT' : "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: formdata,
                });

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result?.message || "Something went wrong");
                }

                await fetchExercises();

                Swal.fire({
                    icon: "success",
                    text: "Your Exercise Has Been Saved Succesfylly!",

                    title: isEditExcercise
                        ? "Exercise updated successfully!"
                        : "Exercise created successfully!",
                    showConfirmButton: false,
                    timer: 1500,
                });
                emptyExcerCises();
                setShowExerciseModal(false)

                return result;
            } catch (err) {
                // Show error alert
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: err.message || "Failed to save exercise. Please try again.",
                });
                throw err;
            }
        },
        [token, fetchExercises, exercise, isEditExcercise]
    );

    const handleDuplicateExercise = useCallback(
        async (id) => {
            if (!token) return;

            try {
                // Show loading Swal
                Swal.fire({
                    title: "Duplicating Exercise...",
                    text: "Please wait while the exercise is being duplicated.",
                    allowOutsideClick: false,
                    didOpen: () => Swal.showLoading(),
                });

                const response = await fetch(
                    `${API_BASE_URL}/api/admin/one-to-one/session-exercise-struture/${id}/duplicate`,
                    {
                        method: "POST",
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                const result = await response.json();
                await fetchExercises();

                Swal.fire({
                    icon: response.ok ? "success" : "error",
                    title: response.ok ? "Exercise Duplicated!" : "Failed to Duplicate",
                    text: result.message || (response.ok ? "Exercise duplicated successfully." : "Something went wrong."),
                    showConfirmButton: false,
                    timer: 1500,
                });
            } catch (err) {
                Swal.fire({
                    icon: "error",
                    title: "Failed to Duplicate",
                    text: err.message || "Something went wrong while duplicating the exercise.",
                });
                console.error("Failed :", err);
            }
        },
        [token, fetchExercises]
    );

    const deleteExercise = useCallback(
        async (id) => {
            if (!token) return;

            try {
                // Confirm deletion first
                const result = await Swal.fire({
                    title: "Are you sure?",
                    text: "You won't be able to revert this deletion!",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#d33",
                    cancelButtonColor: "#3085d6",
                    confirmButtonText: "Yes, delete it!",
                });

                if (result.isConfirmed) {
                    // Show loader
                    Swal.fire({
                        title: "Deleting Exercise...",
                        text: "Please wait while your exercise is being deleted",
                        allowOutsideClick: false,
                        didOpen: () => Swal.showLoading(),
                    });

                    const response = await fetch(
                        `${API_BASE_URL}/api/admin/one-to-one/session-exercise-struture/delete/${id}`,
                        {
                            method: "DELETE",
                            headers: { Authorization: `Bearer ${token}` },
                        }
                    );

                    const data = await response.json();
                    await fetchExercises();

                    // Remove from groupData.exercises
                    setGroupData((prev) => ({
                        ...prev,
                        exercises: prev.exercises.filter((ex) => ex.value !== id),
                    }));

                    Swal.fire({
                        icon: response.ok ? "success" : "error",
                        title: response.ok ? "Deleted!" : "Failed to Delete",
                        text: data.message || (response.ok ? "Exercise deleted successfully." : "Something went wrong."),
                        showConfirmButton: false,
                        timer: 1500,
                    });
                }
            } catch (err) {
                Swal.fire({
                    icon: "error",
                    title: "Failed to Delete",
                    text: err.message || "Something went wrong while deleting the exercise.",
                });
                console.error("Failed to delete Exercise:", err);
            }
        },
        [token, fetchExercises]
    );


    const handleSavePlan = async () => {
        if (!token) return;

        try {
            setLoading(true);

            const formData = new FormData();

            const levels = {};
            Object.keys(savedTabsData).forEach((level) => {
                const data = savedTabsData[level];
                if (!data) return;

                levels[level.toLowerCase()] = [
                    {
                        skillOfTheDay: data.skill || "",
                        description: data.description || "",
                        sessionExerciseId: data.exercises?.map((ex) => ex.value) || [],
                    },
                ];

                // Append level-specific files
                if (data.video?.file) {
                    formData.append(`${level.toLowerCase()}_video`, data.video.file, data.video.file.name);
                }
                if (data.banner?.file) {
                    formData.append(`${level.toLowerCase()}_upload`, data.banner.file, data.banner.file.name);
                }
            });

            // Append group-level fields
            formData.append("levels", JSON.stringify(levels));
            formData.append("groupName", groupData.groupName || "");
            formData.append("player", groupData.player || "");
            if (groupData.banner?.file) {
                formData.append("banner", groupData.banner.file, groupData.banner.file.name);
            }
            if (groupData.video?.file) {
                formData.append("video", groupData.video.file, groupData.video.file.name);
            }


            const response = await fetch(`${API_BASE_URL}/api/admin/one-to-one/session-plan-structure/create`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });



            const data = await response.json();

            if (response.ok && data.status) {
                await Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: data.message || "Group created successfully.",
                    confirmButtonColor: "#237FEA",
                });
                emptySession();
            } else {
                await Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: data.message || "Failed to create session group.",
                    confirmButtonColor: "#d33",
                });
                console.error("API Error:", data.message || "Unknown error");
            }
        } catch (err) {
            console.error("Failed to create session group:", err);
            await Swal.fire({
                icon: "error",
                title: "Error",
                text: "Something went wrong while creating the session group.",
                confirmButtonColor: "#d33",
            });
        } finally {
            setLoading(false);
        }
    };



    useEffect(() => {
        fetchExercises();
    }, [])

    const handleExerciseChange = (e) => {
        const { name, value } = e.target;
        setExercise((prev) => ({ ...prev, [name]: value }));
    };

    const handleGroupChange = (e) => {
        const { name, value } = e.target;
        setGroupData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileUpload = (e, type) => {
        const file = e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setGroupData((prev) => ({ ...prev, [type]: { file, url } }));
        }
    };
    const handleExerciseSelect = (selected) => {
        setGroupData((prev) => ({
            ...prev,
            exercises: selected || [],
        }));
    };
    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            const imageUrls = files.map((file) => URL.createObjectURL(file));

            setExercise((prev) => ({
                ...prev,
                image: [...(prev.image || []), ...imageUrls], // store preview URLs
                imageToSend: [...(prev.imageToSend || []), ...files], // store actual files
            }));
        }
    };

    // Save current tab data excluding banner
    const saveCurrentTab = () => {
        setSavedTabsData((prev) => ({
            ...prev,
            [activeTab]: {
                ...groupData, // save all fields
                banner: undefined, // banner is same for all tabs
            },
        }));
    };
    const gotoNextTab = () => {
        if (!groupData.skill) {
            Swal.fire({
                icon: "warning",
                title: "Incomplete Data",
                text: "Please fill the skill for this tab before proceeding.",
                confirmButtonColor: "#237FEA",
            });
            return;
        }

        saveCurrentTab();

        const currentIndex = tabs.indexOf(activeTab);
        if (currentIndex < tabs.length - 1) {
            const nextTab = tabs[currentIndex + 1];
            setActiveTab(nextTab);

            const nextData = savedTabsData[nextTab] || {};
            setGroupData({
                skill: nextData.skill || "",
                description: nextData.description || "",
                exercises: nextData.exercises || [],
                video: nextData.video || null,
                groupName: nextData.groupName || groupData.groupName,
                player: nextData.player || groupData.player,
                banner: groupData.banner, // keep same banner
            });
        }
    };

    const handleCreateSessionClick = () => {
        // Save current tab
        saveCurrentTab();

        const currentIndex = tabs.indexOf(activeTab);

        if (!groupData.skill) {
            Swal.fire({
                icon: "warning",
                title: "Incomplete Data",
                text: "Please fill the skill for this tab before proceeding.",
                confirmButtonColor: "#237FEA",
            });
            return;
        }

        // Move to next tab if exists
        if (currentIndex < tabs.length - 1) {
            gotoNextTab();
        }
    };


    if (loading) {
        return (
            <>
                <Loader />
            </>
        )
    }

    return (
        <>
            <div className="flex flex-wrap gap-1 ps-3 md:ps-0 items-center cursor-pointer justify-between md:justify-start mb-5" onClick={() => navigate('/one-to-one')}>
                <img
                    src="/demo/synco/icons/arrow-left.png"
                    alt="Back"
                    className="w-5 h-5 md:w-6 md:h-6"
                />
                <h2 className="font-bold md:text-2xl">  Add a Session Plan Structure</h2>
            </div>

            <div className="p-6 flex flex-col lg:flex-row justify-center gap-10 bg-gray-50 min-h-screen rounded-2xl items-start bg-white">
                <div className="w-full md:p-6 lg:w-6/12">


                    <div className="space-y-4">
                        <div>
                            <label className="text-[18px] font-semibold my-2 block text-[#282829]">
                                Group Name
                            </label>
                            <input
                                type="text"
                                name="groupName"
                                value={groupData.groupName || ''}
                                onChange={handleGroupChange}
                                className="w-full border outline-none border-[#E2E1E5] rounded-xl px-3 p-3 py-2 mt-1"
                            />
                        </div>
                        <div>
                            <label className="text-[18px] font-semibold my-2 block text-[#282829]">
                                Player
                            </label>
                            <input
                                type="text"
                                name="player"
                                value={groupData.player || ''}
                                onChange={handleGroupChange}
                                className="w-full border outline-none border-[#E2E1E5] rounded-xl px-3 p-3 py-2 mt-1"
                            />
                        </div>
                        <label className="w-full block cursor-pointer border border-[#237FEA] text-[#237FEA] rounded-xl p-3 py-2 hover:bg-blue-50 transition text-center">
                            {groupData.banner ? "Change Banner" : "Add Banner"}

                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleFileUpload(e, "banner")}
                            />

                        </label>
                        {groupData.banner && (
                            <img
                                src={groupData.banner.url}
                                alt="Banner"
                                className="w-full mt-2 rounded-xl"
                            />
                        )}
                        <div className="flex border border-[#E2E1E5] rounded-2xl p-2 mb-6 overflow-auto">
                            {tabs.map((tab, index) => {
                                // Determine if the tab should be disabled
                                const currentIndex = tabs.indexOf(activeTab);
                                const isDisabled = index > currentIndex && !groupData.skill;

                                return (
                                    <button
                                        key={tab}
                                        disabled={isDisabled}
                                        className={`flex-1 p-2 px-4 rounded-xl text-[17px] font-semibold transition-all 
                ${activeTab === tab ? "bg-[#237FEA] text-white" : "text-gray-600 hover:text-[#237FEA]"} 
                ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
                                        onClick={() => {
                                            if (isDisabled) {
                                                Swal.fire({
                                                    icon: "warning",
                                                    title: "Incomplete Data",
                                                    text: "Please fill the skill for the current tab before proceeding.",
                                                    confirmButtonColor: "#237FEA",
                                                });
                                                return;
                                            }

                                            // Save current tab data (excluding banner)
                                            setSavedTabsData((prev) => ({
                                                ...prev,
                                                [activeTab]: {
                                                    groupName: groupData.groupName,
                                                    player: groupData.player,
                                                    skill: groupData.skill,
                                                    description: groupData.description,
                                                    exercises: groupData.exercises,
                                                    video: groupData.video,
                                                },
                                            }));

                                            // Move to new tab
                                            setActiveTab(tab);

                                            // Restore saved data for new tab or initialize defaults
                                            setGroupData((prev) => {
                                                const savedData = savedTabsData[tab] || {};
                                                return {
                                                    groupName: prev.groupName,
                                                    player: prev.player || savedData.player,
                                                    skill: savedData.skill || "",
                                                    description: savedData.description || "",
                                                    exercises: savedData.exercises || [],
                                                    video: savedData.video || null,
                                                    banner: prev.banner, // always keep the same banner
                                                };
                                            });
                                        }}
                                    >
                                        {tab}
                                    </button>
                                );
                            })}


                        </div>





                        <div>
                            <label className="text-[18px] font-semibold my-2 block text-[#282829]">
                                Skill of the day
                            </label>
                            <input
                                type="text"
                                name="skill"
                                value={groupData.skill || ''}
                                onChange={handleGroupChange}
                                className="w-full border outline-none border-[#E2E1E5] rounded-xl px-3 p-3 py-2 mt-1"
                            />
                        </div>
                        <label className="w-full block cursor-pointer border border-[#237FEA] text-[#237FEA] rounded-xl p-3 py-2 hover:bg-blue-50 transition text-center">
                            {groupData.video ? "Change Video" : "Add Video"}

                            <input
                                type="file"
                                accept="video/*"
                                className="hidden"
                                onChange={(e) => handleFileUpload(e, "video")}
                            />

                        </label>
                        {groupData.video && (
                            <video
                                src={groupData.video.url}
                                controls
                                className="w-full mt-2 rounded-xl"
                            />
                        )}

                        <div>
                            <label className="text-[18px] font-semibold my-2 block text-[#282829]">
                                Description
                            </label>
                            <input
                                type="text"
                                name="description"
                                value={groupData.description || ''}
                                onChange={handleGroupChange}
                                className="w-full border outline-none border-[#E2E1E5] rounded-xl px-3 p-3 py-2 mt-1"
                            />
                        </div>

                        <div>
                            <label className="text-[18px] font-semibold my-2 block text-[#282829]">
                                Exercises
                            </label>

                            {/* Selected exercises list */}
                            <div className="mt-2 border mb-5 border-gray-200 rounded-xl">
                                {Array.isArray(groupData.exercises) && groupData.exercises.length > 0 ? (
                                    groupData.exercises.map((ex, index) => (
                                        <div
                                            key={index}
                                            className="flex justify-between items-center px-3 p-1 font-semibold"
                                        >
                                            <span>{ex?.label || "Untitled Exercise"}</span>

                                            <div className="flex gap-2">
                                                <img
                                                    onClick={() => {
                                                        setIsEditExcercise(true);
                                                        setShowExerciseModal(true);
                                                        if (ex?.value) fetchExcercisesById(ex.value);
                                                    }}
                                                    src="/demo/synco/icons/edit2.png"
                                                    alt="Edit"
                                                    className="w-5 h-5 transition-transform duration-200 transform hover:scale-110 hover:opacity-100 opacity-90 cursor-pointer"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => ex?.value && handleDuplicateExercise(ex.value)}
                                                    className="text-gray-800 transition-transform duration-200 transform hover:scale-110 hover:opacity-100 opacity-90 cursor-pointer"
                                                >
                                                    <Copy size={18} />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => ex?.value && deleteExercise(ex.value)}
                                                    className="text-gray-800 hover:text-red-500"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="px-3 py-2 text-gray-400 text-sm">
                                        No exercises added yet
                                    </div>
                                )}
                            </div>


                            {/* Exercise selection */}
                            <Select
                                isMulti
                                key={mounted}
                                options={exercises.map((item) => ({
                                    value: item.id,
                                    label: `${item.title} - ${item.duration}`,
                                }))}
                                value={groupData.exercises}
                                onChange={handleExerciseSelect}
                                placeholder="Select Exercises..."
                                className="react-select-container"
                                classNamePrefix="react-select"
                                components={{ MultiValue }}
                                menuPortalTarget={document.body}
                                menuPosition="fixed"
                                menuPlacement="auto"
                                closeMenuOnSelect={false}
                                hideSelectedOptions={false}
                                isClearable
                                styles={{
                                    control: (base, state) => ({
                                        ...base,
                                        borderRadius: "14px",
                                        borderColor: state.isFocused ? "#3b82f6" : "#e5e7eb",
                                        padding: "4px 8px",
                                        backgroundColor: "#fff",
                                    }),
                                    valueContainer: (base) => ({
                                        ...base,
                                        maxHeight: "120px",
                                        overflowY: "auto",
                                        gap: "6px",
                                    }),
                                    multiValue: (base) => ({
                                        ...base,
                                        borderRadius: "10px",
                                        backgroundColor: "#eff6ff",
                                    }),
                                    multiValueLabel: (base) => ({
                                        ...base,
                                        color: "#1d4ed8",
                                    }),
                                }}
                            />
                        </div>


                        <button
                            onClick={() => setShowExerciseModal(true)}
                            className="w-full bg-[#237FEA] text-white p-3 py-2 rounded-xl mt-2 hover:bg-blue-700"
                        >
                            Add New Exercise
                        </button>

                        <div className="flex justify-end" onClick={handleCreateSessionClick}>
                            <button className="w-auto bg-[#237FEA] text-white p-3 py-2 px-10 rounded-xl mt-2 hover:bg-blue-700">
                                Create Session
                            </button>
                        </div>
                    </div>
                </div>

                <div className="lg:w-6/12 flex flex-col gap-4">


                    {showExerciseModal && (
                        <div className="bg-white rounded-3xl shadow-md w-full p-6 relative">
                            <button
                                className="absolute top-4 right-5 text-gray-400 hover:text-gray-600 text-xl"
                                onClick={() => {
                                    setShowExerciseModal(false);
                                    setIsEditExcercise(null);
                                    emptyExcerCises();
                                }}
                            >
                                ✕
                            </button>

                            <h2 className="text-xl font-semibold mb-4">Exercise</h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-[18px] font-semibold my-2 block text-[#282829]">
                                        Title
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={exercise.title}
                                        onChange={handleExerciseChange}
                                        className="w-full border outline-none border-[#E2E1E5] rounded-xl px-3 p-3 py-2 mt-1"
                                    />
                                </div>

                                <div>
                                    <label className="text-[18px] font-semibold my-2 block text-[#282829]">
                                        Duration
                                    </label>
                                    <input
                                        type="text"
                                        name="duration"
                                        value={exercise.duration}
                                        onChange={handleExerciseChange}
                                        className="w-full border outline-none border-[#E2E1E5] rounded-xl px-3 p-3 py-2 mt-1"
                                    />
                                </div>

                                <div className="relative">
                                    <label className="text-[18px] font-semibold my-2 block text-[#282829]">
                                        Description
                                    </label>
                                    <Editor
                                        apiKey="t3z337jur0r5nxarnapw6gfcskco6kb5c36hcv3xtcz5vi3i"
                                        value={exercise.description}
                                        onEditorChange={(content) =>
                                            setExercise({ ...exercise, description: content })
                                        }
                                        init={{
                                            menubar: false,
                                            plugins: 'lists advlist code',
                                            toolbar:
                                                'fontsizeselect capitalize bold italic underline alignleft aligncenter bullist  ',
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

                                <div>


                                    <label className="w-full block cursor-pointer border border-[#237FEA] text-[#237FEA] rounded-xl p-3 py-2 hover:bg-blue-50 transition text-center">
                                        {exercise.image ? "Update Image" : "Upload Image"}

                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            multiple
                                            onChange={handleImageUpload}
                                        />

                                    </label>

                                    <div className="flex flex-wrap gap-4">

                                        {exercise.imageUrl && JSON.parse(exercise.imageUrl).length > 0 && (
                                            <div className="mt-3 flex flex-wrap gap-3">
                                                {JSON.parse(exercise.imageUrl).map((img, index) => (
                                                    <img
                                                        key={index}
                                                        src={img}
                                                        alt={`Preview ${index + 1}`}
                                                        className="rounded-xl w-40 h-28 object-cover"
                                                    />
                                                ))}
                                            </div>
                                        )}
                                        {exercise.image && exercise.image.length > 0 && (
                                            <div className="mt-3 flex flex-wrap gap-3">
                                                {exercise.image.map((img, index) => (
                                                    <img
                                                        key={index}
                                                        src={img}
                                                        alt={`Preview ${index + 1}`}
                                                        className="rounded-xl w-40 h-28 object-cover"
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </div>


                                </div>

                                <div className="flex justify-end">
                                    <button
                                        onClick={() => {
                                            isEditExcercise ? saveExercise(exercise.id) : saveExercise();
                                        }}
                                        className="bg-[#237FEA] text-white rounded-xl p-3 py-2 px-10 mt-3 hover:bg-blue-700"
                                    >
                                        {isEditExcercise ? "Update Exercise" : "Save Exercise"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="flex justify-end gap-3 mt-5">
                        <button className="border-[#237FEA] text-[#237FEA] border rounded-xl px-6 py-2 flex gap-2 items-center">Preview Sessions <FaEye /> </button>
                        <button className="bg-[#237FEA] text-white rounded-xl p-3 py-2 px-7 hover:bg-blue-700" onClick={handleSavePlan}>Create Group</button>
                    </div>


                </div>
            </div>
        </>
    );
}
