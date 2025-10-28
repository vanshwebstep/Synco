import { useEffect, useState, useCallback } from "react";
import { MdOutlineWatchLater } from "react-icons/md";
import { HiOutlineSpeakerWave } from "react-icons/hi2";
import { useNavigate, useSearchParams } from "react-router-dom";

const SessionPreview = () => {
    // === Right Side Content Array ===
    const [activeTab, setActiveTab] = useState("Beginner");
    const [selectedExercise, setSelectedExercise] = useState(null);
    // Select video URL based on tab

    const [sessionGroup, setSessionGroup] = useState([]);
    const [loading, setLoading] = useState(false);
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const token = localStorage.getItem("adminToken");
    const [searchParams] = useSearchParams();
    const id = searchParams.get("id");
    const navigate = useNavigate();

    const fetchSessionGroup = useCallback(async () => {
        if (!token) return;
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/admin/one-to-one/session-plan-structure/listing/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) {
                // If response is not OK, throw error
                const errData = await response.json();
                throw new Error(errData.message || "Failed to fetch session groups");
            }

            const result = await response.json();
            console.log('result', result);
            setSessionGroup(result.data || []);
        } catch (err) {
            console.error("Failed to fetch sessionGroup:", err);
            await Swal.fire({
                icon: 'error',
                title: 'Error',
                text: err.message || "Something went wrong while fetching session groups",
                confirmButtonColor: '#d33',
            });
        } finally {
            setLoading(false);
        }
    }, [token, API_BASE_URL]);

    useEffect(() => {
        fetchSessionGroup();
    }, [fetchSessionGroup])

    const group = sessionGroup || {};
    const levels = group?.levels || {};
    const levelMap = {
        Beginner: "Beginner",
        Intermediate: "intermediate",
        Advanced: "advanced",
        Pro: "pro",
    };

    const currentLevelKey = levelMap[activeTab];
    const currentLevel = levels[currentLevelKey]?.[0]; // each is an array with 1 object

    // Select video URL based on tab
    const videoMap = {
        Beginner: group?.beginner_video,
        Intermediate: group?.intermediate_video,
        Advanced: group?.advanced_video,
        Pro: group?.pro_video,
    };

    const videoUrl = videoMap[activeTab];
    const sessionPlan = currentLevel?.sessionExercises || [];


    // console.log('sessionGroup', sessionGroup)
    // === Left Side Session Plan ===
    // const sessionPlan = [
    //     "Small-sided games",
    //     "Introduction (Head coach)",
    //     "Warm up activity",
    //     "Technical sessionGroup",
    //     "Lesson debrief",
    // ];
    // const videoUrl = 'https://cdn.pixabay.com/video/2017/04/10/10392-212474043_large.mp4';
    useEffect(() => {
        if (currentLevel?.sessionExercises.length > 0) {
            setSelectedExercise(currentLevel?.sessionExercises[0]);
        }
    }, [currentLevel?.sessionExercises]);
   

    console.log('SelectedExercise', selectedExercise)
    return (
        <div className="min-h-screen  lg:p-8">
            <div className="flex gap-2 items-center cursor-pointer" onClick={() => navigate('/one-to-one')}>
                <img
                    src="/demo/synco/icons/arrow-left.png"
                    alt="Back"
                    className="w-5 h-5 md:w-6 md:h-6"
                />
                <h2 className="text-xl font-bold text-gray-800">Gold Package</h2>
            </div>

            <div className="md:max-w-7xl w-full  rounded-lg md:p-6">
                {/* Header */}
                <div className="flex items-center justify-between  mb-0 w-full">

                    <div className="flex border bg-white  border-[#E2E1E5] rounded-2xl p-2 mb-6 w-max overflow-auto">
                        {["Beginner", "Intermediate", "Advanced", "Pro"].map((tab) => (
                            <button
                                key={tab}
                                className={`flex-1 p-2 px-8 rounded-xl text-[17px] font-semibold transition-all ${activeTab === tab
                                    ? "bg-[#237FEA] text-white"
                                    : "text-gray-600 hover:text-[#237FEA]"
                                    }`}
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>


                </div>

                {/* Main Content */}
                <div className="grid md:grid-cols-2 gap-10 border-t border-[#E2E1E5] pt-4">
                    {/* Left Side */}
                    <div className="flex flex-col">
                        <img src={`${sessionGroup?.banner}`} className="rounded-xl w-full object-cover max-h-[130px]  mb-2"
                            alt="" />

                        <div className="mt-4 border-b border-[#E2E1E5] pb-4">
                            <h3 className="text-[24px] font-semibold text-gray-800">
                                Skill of the day
                            </h3>
                            <h5 className="flex gap-2 font-semibold items-center text-[18px]">
                                {currentLevel?.skillOfTheDay}
                                <HiOutlineSpeakerWave className="text-blue-600 font-bold" />
                            </h5>
                            <p className="text-[16px] text-[#717073] font-semibold mt-1">
                                {currentLevel?.description}
                            </p>

                        </div>
                        <div>

                            {videoUrl && videoUrl.trim() !== "" && (
                                <div className="mt-4">
                                    <video
                                        src={videoUrl}
                                        controls
                                        className="w-full pt-3 h-[300px] rounded-2xl"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="mt-6">
                            <h4 className="text-[24px] font-semibold text-gray-800 ">
                                Session Plan
                            </h4>
                            <span className="text-sm flex gap-2 items-center mb-3 text-[#676774]"><MdOutlineWatchLater /> 4 Hours</span>
                            <div className="space-y-4">
                                {sessionPlan.map((exercise, index) => (
                                    <div key={index} onClick={() => setSelectedExercise(exercise)} className="flex gap-5">
                                        <div className="img w-[80px] h-[80px] flex-shrink-0">
                                            <img
                                                src={
                                                    JSON.parse(exercise.imageUrl || "[]")[0] ||
                                                    "/demo/synco/images/cardimgSmall.png"
                                                }
                                                alt=""
                                                className="w-full h-full object-cover rounded-xl"
                                            />
                                        </div>
                                        <div>
                                            <h5 className="font-semibold text-gray-800">
                                                {exercise.title}
                                            </h5>
                                            <p className="text-sm text-[#676774] font-semibold line-clamp-3">
                                                {exercise.description
                                                    ?.replace(/<[^>]+>/g, "")
                                                    .slice(0, 150) + "..."}
                                            </p>
                                            <span className="mt-2 block text-sm text-[#676774] font-semibold">
                                                {exercise.duration}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Side */}
                    <div>
                        <h3 className="text-2xl  text-left font-semibold text-gray-800 mb-3">
                            {selectedExercise?.title}
                        </h3>
                        {selectedExercise?.imageUrl ? (
                            JSON.parse(selectedExercise.imageUrl).map((imgUrl, index) => (
                                <img
                                    key={index}
                                    className="rounded-3xl w-full max-h-[114px] object-cover mr-2 mb-2"
                                    src={`${imgUrl}`}
                                    alt={`${selectedExercise.title} ${index + 1}`}
                                />
                            ))
                        ) : (
                            <p>No images available</p>
                        )}
                        <p className="text-sm text-blue-600 font-medium my-4">
                            Time Duration: {selectedExercise?.duration}
                        </p>

                        {/* Render from Array */}
                        <div className="space-y-6 text-left text-gray-700">
                          
                                <div >
                                    {/* <h4 className="font-semibold text-gray-800 mb-1">
                                        {selectedExercise?.title}
                                    </h4> */}
                                           <div>
                                    <div
                                        className="prose prose-sm space-y-6 max-w-none text-gray-700
    prose-p:mb-3 prose-li:mb-2
    prose-strong:block prose-strong:text-[16px] prose-strong:text-gray-900 prose-strong:mt-4
    prose-ul:list-disc prose-ol:list-decimal prose-ul:pl-5 prose-ol:pl-5
    marker:text-gray-700"
                                        dangerouslySetInnerHTML={{
                                            __html:
                                                selectedExercise?.description ||
                                                "<p class='text-gray-400 italic'>No description available.</p>",
                                        }}
                                    />
                                </div>
                                </div>
                       
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SessionPreview;
