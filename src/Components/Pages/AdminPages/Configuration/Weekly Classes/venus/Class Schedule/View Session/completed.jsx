import { useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { Check, X } from 'lucide-react';

const ViewSessions = ({ item, sessionData }) => {
    const tabs = ['Members', 'Trials', 'Coaches'];
    const [activeTab, setActiveTab] = useState('Members');
    const [page, setPage] = useState(1);
  const location = useLocation();

    const venueId = location.state?.venueId;

    const [attendance, setAttendance] = useState([
        true,  // Session 1: Attended
        false, // Session 2: Not Attended
        true   // Session 3: Attended
    ]);
    const toggleAttendance = (index, status) => {
        const updated = [...attendance];
        updated[index] = status;
        setAttendance(updated);
    };
    // Demo page content for each tab
    const contentMap = {
        Members: [
            {
                title: 'Skill of the day',
                heading: 'The Pingium',
                videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
                description: 'In todays lesson, students will learn to perform the Pinguim',
            },
            {
                title: 'Skill of the day – Page 2',
                heading: 'The Pingium',
                videoUrl: 'https://www.w3schools.com/html/movie.mp4',
                description: 'Students will now practice movement coordination.',
            },
        ],
        Trials: [
            {
                title: 'Trials Drill – Page 1',
                heading: 'The Pingium',
                videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
                description: 'Warmup drills and possession training.',
            },
            {
                title: 'Trials Drill – Page 2',
                heading: 'The Pingium',
                videoUrl: 'https://www.w3schools.com/html/movie.mp4',
                description: '1v1 defense and offense basics.',
            },
        ],
        Coaches: [
            {
                title: 'Coaches Technique – Page 1',
                heading: 'The Pingium',
                videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
                description: 'Team transitions and tactical pressing.',
            },
        ],

    };
    const navigate = useNavigate();

    const pages = contentMap[activeTab] || [];
    const totalPages = pages.length;
    const currentContent = pages[page - 1];
    return (
        <div className="md:p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-3 w-full md:w-1/2">
                <h2
                           onClick={() => {
    navigate(`/configuration/weekly-classes/venues/class-schedule?id=${venueId}`);
}}
                    className="text-xl md:text-[28px] font-semibold flex items-center gap-2 md:gap-3 cursor-pointer hover:opacity-80 transition-opacity mb-4 duration-200">
                    <img
                        src="/demo/synco/icons/arrow-left.png"
                        alt="Back"
                        className="w-5 h-5 md:w-6 md:h-6"
                    />
                    <span className="truncate">View Class Register</span>
                </h2>
            </div>
            <div className="bg-white rounded-3xl shadow p-6 flex flex-col md:flex-row gap-6">
                {/* Left Sidebar */}
                <div className="w-full md:w-2/12 bg-gray-100 py-6  rounded-2xl  text-center">
                    <div className="w-18 h-18 bg-yellow-400 rounded-full flex items-center justify-center text-white text-2xl font-semibold mx-auto mb-4">
                        <img src="/demo/synco/icons/completeBig.png" alt="" />
                    </div>
                    <p className="text-base border-b border-gray-300 pb-5 font-semibold mb-4">Completed</p>
                    <div className="text-sm  p-6 text-gray-700 space-y-3 text-left">
                        <p><span className="font-semibold">Venue</span><br /> Chelsea Academy</p>
                        <p><span className="font-semibold">Class</span><br /> 4–5 Years</p>
                        <p><span className="font-semibold">Date:</span> <br />Sunday 23rd April 2023</p>
                        <p><span className="font-semibold">Time:</span> <br />11:00am – 12:00pm</p>
                    </div>
                </div>

                {/* Right Content */}
                <div className="w-full md:w-10/12 space-y-6">
                    {/* Tabs */}
                    <div className="flex gap-4 border max-w-fit border-gray-300 p-1 rounded-xl  flex-wrap">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => {
                                    setActiveTab(tab);
                                    setPage(1);
                                }}
                                className={`px-4 py-1.5 min-w-25 rounded-xl text-sm font-medium transition ${activeTab === tab
                                    ? 'bg-blue-500 text-white'
                                    : 'text-gray-500 hover:text-blue-500'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>


                    <div className='border-t border-gray-200  py-4'>
                        <div>
                            {[1, 2, 3].map((_, idx) => {
                                const attended = attendance[idx];

                                return (
                                    <div
                                        key={idx}
                                        className="py-3 border-b border-gray-200 hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="md:flex w-full md:w-8/12 items-center justify-between">
                                            {/* Name & Duration */}
                                            <div className="md:flex  md:w-5/12 space-x-2 justify-between items-center">
                                                <span className="font-semibold text-[14px]">{idx + 1}. John Smith</span>
                                                <span className="font-semibold text-[14px]">7 Years</span>
                                            </div>

                                            {/* Attendance Status */}
                                            <div className="md:flex space-y-2 md:space-y-0 items-center gap-2">
                                                <button
                                                    onClick={() => toggleAttendance(idx, true)}
                                                    className={`px-3 py-1 text-sm  md:w-auto w-full  rounded-lg flex items-center gap-1 transition-colors 
                    ${attended
                                                            ? 'bg-[#34AE56] text-white hover:bg-green-600'
                                                            : 'bg-gray-200 text-gray-500 hover:bg-green-100 hover:text-green-700'}`}
                                                >
                                                    <Check className="w-4 h-4" />
                                                    Attended
                                                </button>
                                                <button
                                                    onClick={() => toggleAttendance(idx, false)}
                                                    className={`px-3 py-1 text-sm rounded-lg  md:w-auto w-full flex items-center gap-1 transition-colors 
                    ${!attended
                                                            ? 'bg-[#FF5C40] text-white hover:bg-red-600'
                                                            : 'bg-gray-200 text-gray-500 hover:bg-red-100 hover:text-red-700'}`}
                                                >
                                                    <X className="w-4 h-4" />
                                                    Not Attended
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>


                </div>
            </div>



        </div>
    );
};

export default ViewSessions;
