import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { formatDistanceToNow } from 'date-fns';
const ViewSessions = ({ item, sessionData }) => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [activeTab, setActiveTab] = useState('Beginners');
  const [myData, setMyData] = useState({});
  const [page, setPage] = useState(1);
  const location = useLocation();
  const sessionMap = location.state?.sessionMap;
  const sessionId = location.state?.sessionId;
    const singleClassSchedules = location.state?.singleClassSchedules;

  console.log(
    'sessionMap',
    sessionMap.sessionPlan
  );
  const selectedGroup = sessionMap.sessionPlan;
  const levelKeyToLabel = {
    beginner: "Beginners",
    intermediate: "Intermediate",
    advanced: "Advanced",
    pro: "Pro",
  };

  // Demo page content for each tab
  const contentMap = {
    Beginners: [
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
    Intermediate: [
      {
        title: 'Intermediate Drill – Page 1',
        heading: 'The Pingium',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        description: 'Warmup drills and possession training.',
      },
      {
        title: 'Intermediate Drill – Page 2',
        heading: 'The Pingium',
        videoUrl: 'https://www.w3schools.com/html/movie.mp4',
        description: '1v1 defense and offense basics.',
      },
    ],
    Advanced: [
      {
        title: 'Advanced Technique – Page 1',
        heading: 'The Pingium',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        description: 'Team transitions and tactical pressing.',
      },
    ],
    Pro: [
      {
        title: 'Pro-Level Training – Page 1',
        heading: 'The Pingium',
        videoUrl: 'https://www.w3schools.com/html/movie.mp4',
        description: 'High-intensity pressing and zonal systems.',
      },
    ],
  };
  const navigate = useNavigate();
  console.log('sessionId', selectedGroup)

  useEffect(() => {
    if (selectedGroup?.levels) {
      const buildContentMap = () => {
        const content = {};
        const exerciseMap = {};

        // Create a map of exercise ID to full exercise object
        selectedGroup.exercises?.forEach((exercise) => {
          exerciseMap[exercise.id] = exercise;
        });
        let levelsData = selectedGroup?.levels;
        if (typeof levelsData === 'string') {
          try {
            levelsData = JSON.parse(levelsData);
          } catch (e) {
            console.error('Invalid JSON format in selectedGroup.levels:', e);
            levelsData = {}; // fallback to empty object
          }
        }
        Object.entries(levelsData).forEach(([levelKey, items]) => {
          console.log('levelKey', levelKey)
          const label = levelKeyToLabel[levelKey];
          const banner = selectedGroup[`${levelKey}_banner`] || null;
          const video = selectedGroup[`${levelKey}_video`] || null;

          content[label] = items.map((entry, index) => {
            const sessionExercises = entry.sessionExerciseId?.map(
              (id) => exerciseMap[id]
            ).filter(Boolean); // Remove nulls if any ID doesn't match

            return {
              title: `${label} – Page ${index + 1}`,
              heading: entry.skillOfTheDay || 'No Skill',
              videoUrl: video ? `${API_BASE_URL}/${video}` : '',
              bannerUrl: banner ? `${API_BASE_URL}/${banner}` : '',
              description: entry.description || '',
              sessionExercises,
            };
          });
        });

        return content;
      };

      const dynamicContent = buildContentMap();
      setMyData(dynamicContent);

      const firstTab = Object.keys(dynamicContent)[0];
      setActiveTab(firstTab);
      setPage(1);
    }
  }, [selectedGroup]);
  ;

  const dynamicTabs = Object.keys(myData);
  const currentContent = myData[activeTab]?.[page - 1] || {};
  const totalPages = myData[activeTab]?.length || 0;
  console.log('currentContent', dynamicTabs)
    const [selectedExercise, setSelectedExercise] = useState(
      currentContent.sessionExercises?.[0] || null
    );
    useEffect(() => {
      if (currentContent.sessionExercises?.length > 0) {
        setSelectedExercise(currentContent.sessionExercises[0]);
      }
    }, [currentContent]);
  console.log('singleClassSchedules',singleClassSchedules)
  const ageGroups = {
  "Beginners": "4–5 Years",
  "Intermediate": "6–7 Years",
  "Advanced": "8–9 Years",
  "Pro": "10–12 Years"
};
function formatDateWithSuffix(dateStr) {
  const date = new Date(dateStr);

  // Day of week
  const weekday = date.toLocaleDateString('en-GB', { weekday: 'long' });

  // Day with suffix
  const day = date.getDate();
  const suffix = (d => {
    if (d > 3 && d < 21) return 'th'; // 4-20 -> th
    switch (d % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  })(day);

  // Month and Year
  const month = date.toLocaleDateString('en-GB', { month: 'long' });
  const year = date.getFullYear();

  return `${weekday} ${day}${suffix} ${month} ${year}`;
}


// Output: Sunday 23rd April 2023

  return (
    <div className="md:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-3 w-full md:w-1/2">
        <h2
          onClick={() => {
            navigate('/configuration/weekly-classes/venues/class-schedule');
          }}
          className="text-xl md:text-[28px] font-semibold flex items-center gap-2 md:gap-3 cursor-pointer hover:opacity-80 transition-opacity mb-4 duration-200">
          <img
            src="/demo/synco/icons/arrow-left.png"
            alt="Back"
            className="w-5 h-5 md:w-6 md:h-6"
          />
          <span className="truncate">View Session Plans</span>
        </h2>
      </div>
      <div className="bg-white rounded-3xl shadow p-6 flex flex-col md:flex-row gap-6">
        {/* Left Sidebar */}
        <div className="w-full md:w-2/12 bg-[#F4F2EC] py-6  rounded-2xl  text-center">
          <div className="w-18 h-18 bg-yellow-400 rounded-full flex items-center justify-center text-white text-2xl font-semibold mx-auto mb-4">
            <img src="/demo/synco/icons/pendingBig.png" alt="" />
          </div>
          <p className="text-base border-b border-gray-300 pb-5 font-semibold mb-4">Pending</p>
          <div className="text-sm  p-6 text-gray-700 space-y-3 text-left">
            <p><span className="font-semibold">Venue</span><br /> {singleClassSchedules.name}</p>
            <p><span className="font-semibold">Class</span><br />   {ageGroups[activeTab]}</p>
            <p><span className="font-semibold">Date:</span> <br />{formatDateWithSuffix(singleClassSchedules.createdAt)} </p>
            <p><span className="font-semibold">Time:</span> <br />11:00am – 12:00pm</p>
          </div>
        </div>

        {/* Right Content */}
            <div className="w-full md:w-10/12 space-y-6">
              {/* Tabs */}
              <div className="flex gap-4 border max-w-fit border-gray-300 p-1 rounded-xl  flex-wrap">
                {dynamicTabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => {
                      setActiveTab(tab);
                      setPage(1);
                    }}
                    className={`px-4 py-1.5 rounded-xl text-sm font-medium transition ${activeTab === tab
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-500 hover:text-blue-500'
                      }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
    
              {/* Main Page Content */}
              {currentContent && (
                <div className="flex w-full flex-col lg:flex-row gap-6">
                  {/* Left - Video and Info */}
                  <div className="w-full lg:w-1/2 space-y-2">
                    {currentContent.bannerUrl && (
                      <img
                        src={currentContent.bannerUrl}
                        alt="Play like Pele"
                        className="rounded-xl max-h-50  mb-2"
                      />
                    )}
                    <h2 className="font-semibold text-[28px] mb-0">
                      {selectedGroup?.groupName}
                    </h2>
                    <p className="text-[20px] flex items-center gap-2 font-semibold">
                      {currentContent.heading} <img src="/demo/synco/icons/Volumeblue.png" alt="" />
                    </p>
                    <p className="text-sm text-gray-500 border-b border-gray-300 pb-3 ">
                      {currentContent.description}
                    </p>
                    {currentContent.videoUrl && (
                      <video
                        src={currentContent.videoUrl}
                        controls
                        className="w-full  pt-3 rounded-4xl"
                      />
                    )}
                    <div className='flex items-center  mb-0 justify-between' >
                      <h2 className="font-semibold text-[24px] mb-0">
                        Session Plan
                      </h2>
                      <img src="/demo/synco/icons/downloadicon.png" alt="" />
                    </div>
                    <div>
                      <p className="text-sm flex items-center gap-2 text-gray-500 border-b border-gray-300 pb-3">
                        <img src="/demo/synco/members/Time-Circle.png" className="w-4 h-4" alt="" />
                        {selectedGroup?.updatedAt
                          ? formatDistanceToNow(new Date(selectedGroup.updatedAt), { addSuffix: true })
                          : '—'}
                      </p>
                    </div>
    
                    {currentContent.sessionExercises?.length > 0 && (
                      <div className="mt-6 space-y-6">
                        {currentContent.sessionExercises.map((exercise) => (
                          <div
                            key={exercise.id}
                            className={`flex items-center gap-4 cursor-pointer p-2 rounded ${selectedExercise?.id === exercise.id ? 'bg-blue-50 border border-blue-200' : ''
                              }`}
                            onClick={() => setSelectedExercise(exercise)}
                          >
                            <div className="w-6/12">
                              {exercise.imageUrl ? (
                                JSON.parse(exercise.imageUrl).map((imgUrl, index) => (
                                  <img
                                    key={index}
                                    className="rounded object-cover mr-2 mb-2"
                                    src={`${API_BASE_URL}/${imgUrl}`}
                                    alt={`${exercise.title} ${index + 1}`}
                                  />
                                ))
                              ) : (
                                <p>No images available</p>
                              )}
                            </div>
                            <div>
                              <h6 className="text-[18px] w-7/12 font-semibold">{exercise.title}</h6>
                              <div
                                className="text-[16px] text-gray-700"
                                dangerouslySetInnerHTML={{
                                  __html: exercise.description || '<p>No description available.</p>',
                                }}
                              />
                              <span className="text-[14px] text-gray-500">
                                {exercise.duration || '—'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
    
    
                  </div>
    
                  {/* Right - Placeholder Drill Info */}
                  {selectedExercise && (
                    <div className="w-full border-l pl-6 border-gray-300 lg:w-1/2 bg-white">
                      <h2 className="font-semibold text-[24px] mb-0">{selectedExercise.title}</h2>
                      <div className="flex flex-wrap justify-start gap-2 w-full ">
                        {selectedExercise.imageUrl ? (
                          JSON.parse(selectedExercise.imageUrl).map((imgUrl, index) => (
                            <img
                              key={index}
                              className="rounded object-cover mr-2 min-h-50 max-h-50 mb-2"
                              src={`${API_BASE_URL}/${imgUrl}`}
                              alt={`${selectedExercise.title} ${index + 1}`}
                            />
                          ))
                        ) : (
                          <p>No images available</p>
                        )}
                      </div>
                      <p className="text-blue-500 text-[14px] font-semibold">
                        Time Duration: {selectedExercise.duration || '—'}
                      </p>
    
                      <div className="text-sm space-y-3">
                        <div>
                          <p className="font-semibold text-[18px]">Description</p>
                          <div
                            className="text-gray-500 text-[14px] font-semibold"
                            dangerouslySetInnerHTML={{
                              __html: selectedExercise.description || '<p>No description available.</p>',
                            }}
                          />
                        </div>
                        {/* Add other sections like Rules, Conditions, etc. if you have them in exercise */}
                      </div>
                    </div>
                  )}
    
                </div>
              )}
    
              {/* Pagination Buttons
            <div className="flex justify-between items-center pt-4 border-t mt-6">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className={`px-4 py-2 text-sm rounded-xl border ${
                  page === 1
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-blue-500 border-blue-500 hover:bg-blue-500 hover:text-white transition'
                }`}
              >
                ← Previous
              </button>
    
              <span className="text-sm text-gray-600">Page {page} of {totalPages}</span>
    
              <button
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                className={`px-4 py-2 text-sm rounded-xl border ${
                  page === totalPages
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-blue-500 border-blue-500 hover:bg-blue-500 hover:text-white transition'
                }`}
              >
                Next →
              </button>
            </div> */}
            </div>
      </div>



    </div>
  );
};

export default ViewSessions;
