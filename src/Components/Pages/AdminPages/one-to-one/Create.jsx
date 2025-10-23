import React, { useState } from "react";
import Select from "react-select";
import { FaEye } from "react-icons/fa";
const tabs = ["Beginners", "Intermediate", "Advanced", "Pro"];
import { Trash2, Copy } from 'lucide-react';
import { useNavigate } from "react-router-dom";

export default function Create() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("Beginners");
    const [showExerciseModal, setShowExerciseModal] = useState(false);
    const [groupData, setGroupData] = useState({
        groupName: "Gold Package",
        player: "",
        skill: "",
        description: "",
        exercises: [],
        video: null,
        banner: null,
    });
    const [savedTabsData, setSavedTabsData] = useState({});

    const [exercise, setExercise] = useState({
        title: "",
        duration: "",
        description: "",
        image: "",
    });

    const exerciseOptions = [
        { value: "pele", label: "Week 1: Pele" },
        { value: "maradona", label: "Week 2: Maradona" },
        { value: "ronaldo", label: "Week 3: Ronaldo" },
        { value: "messi", label: "Week 4: Messi" },
    ];
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
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setExercise((prev) => ({ ...prev, image: imageUrl }));
        }
    };

    const saveExercise = () => {
        if (exercise.title.trim() === "") return;
        setGroupData((prev) => ({
            ...prev,
            exercises: [...prev.exercises, exercise],
        }));
        setExercise({ title: "", duration: "", description: "", image: "" });
        setShowExerciseModal(false);
    };

    const deleteExercise = (index) => {
        setGroupData((prev) => ({
            ...prev,
            exercises: prev.exercises.filter((_, i) => i !== index),
        }));
    };


    const gotoNextTab = () => {
        const currentIndex = tabs.indexOf(activeTab);

        // Validate required fields (example: groupName, player, skill)
        if (!groupData.groupName || !groupData.player || !groupData.skill) {
            alert("Please fill all required fields in this tab");
            return;
        }

        // Save current tab data
        setSavedTabsData(prev => ({
            ...prev,
            [activeTab]: groupData,
        }));

        // Reset only tab-specific fields for next tab
        setGroupData(prev => ({
            ...prev,
            skill: "",
            description: "",
            exercises: [],
            video: null,
            banner: null,
        }));

        // Move to next tab
        if (currentIndex < tabs.length - 1) {
            setActiveTab(tabs[currentIndex + 1]);
        }
    };


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
                {/* === LEFT SIDE: GROUP FORM === */}
                <div className="w-full md:p-6 lg:w-6/12">
                    {/* Tabs */}


                    {/* Group Form */}
                    <div className="space-y-4">
                        <div>
                            <label className="text-[18px] font-semibold my-2 block text-[#282829]">
                                Group Name
                            </label>
                            <input
                                type="text"
                                name="groupName"
                                value={groupData.groupName}
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
                                value={groupData.player}
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
                            {tabs.map((tab) => (
                                <button
                                    key={tab}
                                    className={`flex-1 p-2 px-4 rounded-xl text-[17px] font-semibold transition-all ${activeTab === tab
                                        ? "bg-[#237FEA] text-white"
                                        : "text-gray-600 hover:text-[#237FEA]"
                                        }`}
                                    onClick={() => setActiveTab(tab)}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>


                        <div>
                            <label className="text-[18px] font-semibold my-2 block text-[#282829]">
                                Skill of the day
                            </label>
                            <input
                                type="text"
                                name="skill"
                                value={groupData.skill}
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
                                value={groupData.description}
                                onChange={handleGroupChange}
                                className="w-full border outline-none border-[#E2E1E5] rounded-xl px-3 p-3 py-2 mt-1"
                            />
                        </div>

                        {/* Exercises */}
                        <div>
                            <label className="text-[18px] font-semibold my-2 block text-[#282829]">
                                Exercises
                            </label>
                            <div className="mt-2 border mb-5 border-gray-200 rounded-xl  ">
                                {groupData.exercises.map((ex, index) => (
                                    <div
                                        key={index}
                                        className="flex justify-between items-center px-3 p-1 font-semibold  "
                                    >
                                        <span>
                                            Week {index + 1}: {ex.title}
                                        </span>

                                        <div className="flex gap-2 i">
                                            <img
                                                src="/demo/synco/icons/edit2.png"
                                                alt="Edit"


                                                className="w-5 h-5 transition-transform duration-200 transform hover:scale-110 hover:opacity-100 opacity-90 cursor-pointer"
                                            />
                                            <button
                                                type="button"

                                                className="text-gray-800 transition-transform duration-200 transform hover:scale-110 hover:opacity-100 opacity-90 cursor-pointer"
                                            >
                                                <Copy size={18} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => deleteExercise(index)}
                                                className="text-gray-800 hover:text-red-500"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>

                                    </div>
                                ))}
                                {groupData.exercises.length === 0 && (
                                    <div className="px-3 p-3 py-2 text-gray-400 text-sm">
                                        No exercises added yet
                                    </div>
                                )}
                            </div>
                            <Select
                                isMulti
                                options={exerciseOptions}
                                value={groupData.exercises}
                                onChange={handleExerciseSelect}
                                placeholder="Select Exercises..."
                                className="react-select-container"
                                classNamePrefix="react-select"
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

                        <div className="flex justify-end" onClick={gotoNextTab}>
                            <button className="w-auto bg-[#237FEA] text-white p-3 py-2 px-10 rounded-xl mt-2 hover:bg-blue-700">
                                Create Session
                            </button>
                        </div>
                    </div>
                </div>

                {/* === RIGHT SIDE: EXERCISE MODAL & Preview === */}
                <div className="lg:w-6/12 flex flex-col gap-4">


                    {showExerciseModal && (
                        <div className="bg-white rounded-3xl shadow-md w-full p-6 relative">
                            <button
                                className="absolute top-4 right-5 text-gray-400 hover:text-gray-600 text-xl"
                                onClick={() => setShowExerciseModal(false)}
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

                                <div>
                                    <label className="text-[18px] font-semibold my-2 block text-[#282829]">
                                        Description
                                    </label>
                                    <textarea
                                        name="description"
                                        rows="4"
                                        value={exercise.description}
                                        onChange={handleExerciseChange}
                                        className="w-full border outline-none border-[#E2E1E5] outline-none rounded-xl px-3 p-3 py-2 mt-1"
                                    />
                                </div>

                                <div>


                                    <label className="w-full block cursor-pointer border border-[#237FEA] text-[#237FEA] rounded-xl p-3 py-2 hover:bg-blue-50 transition text-center">
                                        {exercise.image ? "Update Image" : "Upload Image"}

                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleImageUpload}
                                        />

                                    </label>

                                    {exercise.image && (
                                        <img
                                            src={exercise.image}
                                            alt="Preview"
                                            className="mt-3 rounded-xl w-40 h-28 object-cover"
                                        />
                                    )}
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        onClick={saveExercise}
                                        className="bg-[#237FEA] text-white rounded-xl p-3 py-2 px-10 mt-3 hover:bg-blue-700"
                                    >
                                        Save Exercise
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="flex justify-end gap-3 mt-5">
                        <button className="border-[#237FEA] text-[#237FEA] border rounded-xl px-6 py-2 flex gap-2 items-center">Preview Sessions <FaEye /> </button>
                        <button className="bg-[#237FEA] text-white rounded-xl p-3 py-2 px-7 hover:bg-blue-700">Create Group</button>
                    </div>


                </div>
            </div>
        </>
    );
}
