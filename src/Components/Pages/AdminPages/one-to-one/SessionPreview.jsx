import  { useState } from "react";
import { MdOutlineWatchLater } from "react-icons/md";
import { HiOutlineSpeakerWave } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";

const SessionPreview = () => {
    // === Right Side Content Array ===
    const [activeTab, setActiveTab] = useState("Beginners");
    const navigate = useNavigate();
    const sessionDetails = [
        {
            title: "Organisation",
            content: `
        <p>Set up two small-sided games. You will need the following:</p>
        <ul class="list-disc ml-5 mt-1 space-y-1">
          <li>Approx 8–10 grids</li>
          <li>Bibs to clearly divide teams</li>
          <li>Sticks or cones to divide the two pitches</li>
          <li>5 footballs</li>
        </ul>
      `,
        },
        {
            title: "Description",
            content: `
        <p>Begin the lesson with two small-sided games. Organise players based on ability into fair teams.</p>
        <p>If you do not have many students, use one pitch only. Keep an eye on both games unless you have a support coach working with you.</p>
      `,
        },
        {
            title: "Rules",
            content: `
        <ul class="list-disc ml-5 space-y-1">
          <li>In the wide sidelines.</li>
          <li>If the ball goes out of play, students should all freeze and wait for a new ball.</li>
          <li>Include how to restart nearby quickly.</li>
        </ul>
      `,
        },
        {
            title: "Conditions",
            content: `
        <p>You can add a condition before asking students to restart (such as clapping the ball once or playing one-touch passes). Keep students active by rotating their conditions each week.</p>
      `,
        },
        {
            title: "How to maintain tone & intensity",
            content: `
        <ul class="list-disc ml-5 space-y-1">
          <li>Approx 8–10 grids</li>
          <li>Bibs to clearly divide teams</li>
          <li>5 footballs</li>
        </ul>
      `,
        },
    ];

    // === Left Side Session Plan ===
    const sessionPlan = [
        "Small-sided games",
        "Introduction (Head coach)",
        "Warm up activity",
        "Technical exercise",
        "Lesson debrief",
    ];
    const videoUrl = 'https://cdn.pixabay.com/video/2017/04/10/10392-212474043_large.mp4';

    return (
        <div className="min-h-screen  p-8">
            <div className="flex gap-2 items-center cursor-pointer" onClick={() => navigate('/one-to-one')}>
                <img
                    src="/demo/synco/icons/arrow-left.png"
                    alt="Back"
                    className="w-5 h-5 md:w-6 md:h-6"
                />
                <h2 className="text-xl font-bold text-gray-800">Gold Package</h2>
            </div>

            <div className="max-w-7xl  rounded-lg p-6">
                {/* Header */}
                <div className="flex items-center justify-between  mb-0">

                    <div className="flex border bg-white  border-[#E2E1E5] rounded-2xl p-2 mb-6">
                        {["Beginners", "Intermediate", "Advanced", "Pro"].map((tab) => (
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
                        <img src="/demo/synco/images/playLikePele.png" alt="" />

                        <div className="mt-4 border-b border-[#E2E1E5] pb-4">
                            <h3 className="text-[24px] font-semibold text-gray-800">
                                Skill of the day
                            </h3>
                            <h5 className="flex gap-2 font-semibold items-center text-[18px]">The Pingium <HiOutlineSpeakerWave className="text-blue-600 font-bold" /></h5>
                            <p className="text-[16px] text-[#717073] font-semibold mt-1">
                                In today's lesson, students will learn to perform the Penguin.
                            </p>

                        </div>
                        <div>

                            {videoUrl && (
                                <video
                                    src={videoUrl}
                                    controls
                                    className="w-full  pt-3 h-[300px] rounded-4xl"
                                />
                            )}
                        </div>

                        <div className="mt-6">
                            <h4 className="text-[24px] font-semibold text-gray-800 ">
                                Session Plan
                            </h4>
                            <span className="text-sm flex gap-2 items-center mb-3 text-[#676774]"><MdOutlineWatchLater /> 4 Hours</span>
                            <div className="space-y-4">
                                {sessionPlan.map((item, index) => (
                                    <div key={index} className="flex gap-5">
                                        <div className="img">
                                            <img src="/demo/synco/images/cardimgSmall.png" alt="" />
                                        </div>
                                        <div>
                                            <h5 className="font-semibold text-gray-800">{item}</h5>
                                            <p className="text-sm text-[#676774] font-semibold">
                                                This skills tutorial will help you understand how to
                                                perform the Penguin.
                                            </p>
                                            <span className="mt-2 block text-sm text-[#676774] font-semibold">10 Mins</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Side */}
                    <div>
                        <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                            Small-sided games
                        </h3>
                        <img src="/demo/synco/images/cardimgSmall.png" alt="" className="w-[300px]" />
                        <p className="text-sm text-blue-600 font-medium my-4">
                            Time Duration: 10 mins
                        </p>

                        {/* Render from Array */}
                        <div className="space-y-6 text-gray-700">
                            {sessionDetails.map((section, idx) => (
                                <div key={idx}>
                                    <h4 className="font-semibold text-gray-800 mb-1">
                                        {section.title}
                                    </h4>
                                    <div
                                        className="text-sm leading-relaxed"
                                        dangerouslySetInnerHTML={{ __html: section.content }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SessionPreview;
