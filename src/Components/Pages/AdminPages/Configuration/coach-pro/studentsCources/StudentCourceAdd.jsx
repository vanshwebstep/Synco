import React, { useState, useRef } from "react";

export default function StudentCourceAdd() {
    const [courseName, setCourseName] = useState("");
    const [durationValue, setDurationValue] = useState("");
    const [durationUnit, setDurationUnit] = useState("Minutes");
    const [level, setLevel] = useState("");
    const [coverImage, setCoverImage] = useState(null);
    const [coverImagePreview, setCoverImagePreview] = useState(null);
    const fileInputRef = useRef(null);
    const videoRef = useRef(null);

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };
    const handleVideoButtonClick = () => {
        videoRef.current.click();
    };

    const handleCoverImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCoverImage(file);
            setCoverImagePreview(URL.createObjectURL(file));
        }
    };
    const [videos, setVideos] = useState([
        {
            id: Date.now(),
            videoName: "",
            videoFile: null,
            videoFilePreview: null,
            childFeatures: [""],
        },
    ]);


    const handleVideoNameChange = (id, value) => {
        setVideos((prev) =>
            prev.map((v) => (v.id === id ? { ...v, videoName: value } : v))
        );
    };

    const handleVideoFileChange = (id, file) => {
        setVideos((prev) =>
            prev.map((v) =>
                v.id === id
                    ? {
                        ...v,
                        videoFile: file,
                        videoFilePreview: file ? URL.createObjectURL(file) : null,
                    }
                    : v
            )
        );
    };

    const handleChildFeatureChange = (videoId, index, value) => {
        setVideos((prev) =>
            prev.map((v) => {
                if (v.id === videoId) {
                    const newChildFeatures = [...v.childFeatures];
                    newChildFeatures[index] = value;
                    return { ...v, childFeatures: newChildFeatures };
                }
                return v;
            })
        );
    };

    const addChildFeature = (videoId) => {
        setVideos((prev) =>
            prev.map((v) =>
                v.id === videoId
                    ? { ...v, childFeatures: [...v.childFeatures, ""] }
                    : v
            )
        );
    };

    const removeChildFeature = (videoId, index) => {
        setVideos((prev) =>
            prev.map((v) => {
                if (v.id === videoId) {
                    const newChildFeatures = v.childFeatures.filter(
                        (_, i) => i !== index
                    );
                    return { ...v, childFeatures: newChildFeatures };
                }
                return v;
            })
        );
    };

    const addVideo = () => {
        setVideos((prev) => [
            ...prev,
            {
                id: Date.now(),
                videoName: "",
                videoFile: null,
                videoFilePreview: null,
                childFeatures: [""],
            },
        ]);
    };

    const removeVideo = (id) => {
        setVideos((prev) => prev.filter((v) => v.id !== id));
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!courseName.trim()) {
            alert("Please enter the course name");
            return;
        }

        if (!durationValue || isNaN(durationValue) || Number(durationValue) <= 0) {
            alert("Please enter a valid duration");
            return;
        }

        if (!level) {
            alert("Please select a course level");
            return;
        }
        const formData = new FormData();

        formData.append("courseName", courseName);
        formData.append("durationValue", durationValue);
        formData.append("durationUnit", durationUnit);
        formData.append("level", level);
        if (coverImage) formData.append("coverImage", coverImage);

        videos.forEach((video, index) => {
            formData.append(`videos[${index}][videoName]`, video.videoName);
            if (video.videoFile)
                formData.append(`videos[${index}][videoFile]`, video.videoFile);

            video.childFeatures.forEach((feature, i) => {
                formData.append(
                    `videos[${index}][childFeatures][${i}]`,
                    feature
                );
            });
        });

        for (let pair of formData.entries()) {
            console.log(pair[0] + ": " + pair[1]);
        }

        alert("Form submitted! Check console for FormData output.");
    };

    return (
        <>
            <h2 className="text-[28px] font-semibold mb-6">Create a course</h2>
            <form
                onSubmit={handleSubmit}
                className=""
            >

                <section className="mb-10  bg-white rounded-4xl rounded-4xl py-5">
                    <h3 className="text-[28px] px-5 font-semibold mb-4 border-b pb-5 border-gray-200 pb-2">
                        General Settings
                    </h3>

                    <div className="space-y-6 p-5">
                        <div className="flex gap-2 items-center border-[#E2E1E5] pb-6 border-b">
                            <label
                                className="block md:w-2/12  text-[20px] text-[#3E3E47] font-semibold mb-1"
                                htmlFor="courseName"
                            >
                                Name of the course
                            </label>
                            <input
                                id="courseName"
                                type="text"
                                value={courseName}
                                onChange={(e) => setCourseName(e.target.value)}
                                className=" border md:w-3/12 border-[#E2E1E5] rounded-xl px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="flex gap-2 items-center border-[#E2E1E5] pb-6 border-b">
                            <label
                                className="block md:w-2/12 text-[20px] text-[#3E3E47] font-semibold mb-1"
                                htmlFor="durationValue"
                            >
                                Duration
                            </label>
                            <div>  <div className="flex space-x-3 items-center max-w-xs">
                                <input
                                    id="durationValue"
                                    type="number"
                                    min={0}
                                    value={durationValue}
                                    onChange={(e) => setDurationValue(e.target.value)}
                                    className="flex-1 border border-[#E2E1E5] rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <select
                                    value={durationUnit}
                                    onChange={(e) => setDurationUnit(e.target.value)}
                                    className="border border-[#E2E1E5] rounded-xl px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option>Minutes</option>
                                    <option>Hours</option>
                                    <option>Days</option>
                                </select>
                            </div>
                                <p className="text-[14px]  text-[#717073] mt-2">
                                    The duration of the course.
                                </p></div>
                        </div>

                        <div className="flex gap-2 items-center border-[#E2E1E5] pb-6 border-b">
                            <label
                                className="block md:w-2/12 text-[20px] text-[#3E3E47] font-semibold mb-1"
                                htmlFor="level"
                            >
                                Level
                            </label>
                            <div>  <select
                                id="level"
                                value={level}
                                onChange={(e) => setLevel(e.target.value)}
                                className="w-48 border border-[#E2E1E5] rounded-xl px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value=""></option>
                                <option>Beginner</option>
                                <option>Intermediate</option>
                                <option>Advanced</option>
                            </select>
                                <p className="text-[14px]  text-[#717073] mt-2">The level of the course</p></div>
                        </div>

                        <div className="flex gap-2 items-center ">
                            <label className="block md:w-2/12 text-[20px] text-[#3E3E47] font-semibold mb-1">
                                Cover image
                            </label>

                            <button
                                type="button"
                                onClick={handleButtonClick}
                                className="border border-gray-200 rounded-2xl p-3 px-5"
                            >
                                Add Image
                            </button>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleCoverImageChange}
                                className="hidden"
                            />

                            {coverImagePreview && (
                                <img
                                    src={coverImagePreview}
                                    alt="Cover Preview"
                                    className="h-24 rounded border"
                                />
                            )}
                        </div>
                    </div>
                </section>

                <section className="bg-white rounded-4xl rounded-4xl py-5">
                    <h3 className="text-[28px] px-5 font-semibold mb-4 border-b pb-5 border-gray-200 pb-2">
                        Courses videos
                    </h3>

                    <div className="space-y-8 ">
                        {videos.map((video, vidIndex) => (
                            <div
                                key={video.id}
                                className=" rounded p-4 relative "
                            >
                                {videos.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeVideo(video.id)}
                                        className="absolute top-2 right-2 text-red-500 hover:text-red-700 font-bold"
                                        aria-label={`Remove video ${vidIndex + 1}`}
                                    >
                                        &times;
                                    </button>
                                )}

                                <div className="flex gap-2 items-center border-[#E2E1E5] py-6 border-b">

                                    <label
                                        className="block md:w-2/12 text-[20px] text-[#3E3E47] font-semibold mb-1"
                                        htmlFor={`videoName_${video.id}`}
                                    >
                                        Name of the video
                                    </label>
                                    <input
                                        id={`videoName_${video.id}`}
                                        type="text"
                                        value={video.videoName}
                                        onChange={(e) =>
                                            handleVideoNameChange(video.id, e.target.value)
                                        }
                                        className="w-4/12 border border-[#E2E1E5] rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"

                                    />
                                </div>

                                <div className="flex gap-2 items-center border-[#E2E1E5] py-6 border-b">
                                    <label
                                        className="block md:w-2/12 text-[20px] text-[#3E3E47] font-semibold mb-1"
                                        htmlFor={`videoFile_${video.id}`}
                                    >
                                        Add course video
                                    </label>

                                    <button
                                        type="button"
                                        onClick={handleVideoButtonClick}
                                        className="border border-gray-200 rounded-2xl p-3 px-5"
                                    >
                                        Add Video
                                    </button>

                                    <input
                                        id={`videoFile_${video.id}`}
                                        ref={videoRef}
                                        type="file"
                                        accept="video/*"
                                        onChange={(e) => handleVideoFileChange(video.id, e.target.files[0])}
                                        className="hidden"
                                    />

                                    {video.videoFilePreview && (
                                        <video
                                            src={video.videoFilePreview}
                                            controls
                                            className="mt-2 max-h-40 rounded border"
                                        />
                                    )}
                                </div>

                                <div className="flex gap-2 items-center pt-6">
                                    <label className="block md:w-2/12 text-[20px] text-[#3E3E47] font-semibold mb-1">
                                        Childs features
                                    </label>
                                    <div className="space-y-2 md:w-3/12">
                                        {video.childFeatures.map((feature, idx) => (
                                            <div key={idx} className="flex items-center space-x-2">
                                                <input
                                                    type="text"
                                                    value={feature}
                                                    onChange={(e) =>
                                                        handleChildFeatureChange(video.id, idx, e.target.value)
                                                    }
                                                    className="flex-1 md:w-5/12 border border-[#E2E1E5] rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                                {video.childFeatures.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeChildFeature(video.id, idx)}
                                                        className="text-red-500 hover:text-red-700 font-bold"
                                                        aria-label={`Remove feature ${idx + 1}`}
                                                    >
                                                        &times;
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => addChildFeature(video.id)}
                                        className=" border border-[#E2E1E5] text-gr-xl y-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition whitespace-nowrap"
                                    >
                                        Add more descriptions
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                </section>

                <div className="my-8 flex justify-between space-x-4">
                    <button
                        type="button"
                        onClick={addVideo}
                        className="bg-[#237FEA] text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
                    >
                        Add course video
                    </button>

                    <button
                        type="submit"
                        className="bg-[#237FEA] text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition"
                    >
                        Save
                    </button>
                </div>
            </form>
        </>
    );
}
