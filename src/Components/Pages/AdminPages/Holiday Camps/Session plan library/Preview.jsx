import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useSessionPlan } from '../../contexts/SessionPlanContext';
import { formatDistanceToNow } from 'date-fns';

const levelKeyToLabel = {
  beginner: "Beginners",
  intermediate: "Intermediate",
  advanced: "Advanced",
  pro: "Pro",
};

const Preview = ({ item, sessionData }) => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [activeTab, setActiveTab] = useState('Beginners');
  const [myData, setMyData] = useState({});
  const [page, setPage] = useState(1);
  const [searchParams] = useSearchParams();
  const { fetchGroupById, selectedGroup } = useSessionPlan();
  const navigate = useNavigate();

  const id = searchParams.get("id");

  // Fetch group on load
  useEffect(() => {
    if (id) {
      fetchGroupById(id);
    }
  }, [id]);

  // Build dynamic content after fetch
  useEffect(() => {
    if (selectedGroup?.levels) {
      const buildContentMap = () => {
        const content = {};
        Object.entries(selectedGroup.levels).forEach(([levelKey, items]) => {
          const label = levelKeyToLabel[levelKey];
          const banner = selectedGroup[`${levelKey}_banner`] || null;
          const video = selectedGroup[`${levelKey}_video`] || null;

          content[label] = items.map((entry, index) => ({
            title: `${label} – Page ${index + 1}`,
            heading: entry.skillOfTheDay || 'No Skill',
            videoUrl: video ? `${API_BASE_URL}/${video}` : '',
            bannerUrl: banner ? `${API_BASE_URL}/${banner}` : '',
            description: entry.description || '',
            sessionExercises: entry.sessionExercises || [],
          }));
        });
        return content;
      };

      const dynamicContent = buildContentMap();
      setMyData(dynamicContent);

      // Set first tab by default
      const firstTab = Object.keys(dynamicContent)[0];
      setActiveTab(firstTab);
      setPage(1);
    }
  }, [selectedGroup]);

  const dynamicTabs = Object.keys(myData);
  const currentContent = myData[activeTab]?.[page - 1] || {};
  const totalPages = myData[activeTab]?.length || 0;

  console.log(selectedGroup)
  return (
    <div className="md:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-3 w-full md:w-1/2">
        <h2
          onClick={() => {
            navigate('/holiday-camps/session-plan-list');
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
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Left - Video and Info */}
              <div className="w-full lg:w-1/2 space-y-2">
                {currentContent.bannerUrl && (
                  <img
                    src={currentContent.bannerUrl}
                    alt="Play like Pele"
                    className="rounded-xl mb-2"
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
                      <div key={exercise.id} className="flex items-center gap-4">
                        <div>
                          <img
                            className="min-h-[116px] min-w-[181px] rounded object-cover"
                            src={`${API_BASE_URL}/${exercise.imageUrl}`}
                            alt={exercise.title}
                          />
                        </div>
                        <div>
                          <h6 className="text-[18px] font-semibold">{exercise.title}</h6>
                          <p className="text-[16px] text-gray-700">
                            {exercise.description || 'No description available.'}
                          </p>
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
              <div className="w-full  border-l pl-6 border-gray-300 lg:w-1/2 bg-white">
                <h2 className="font-semibold text-[24px] mb-0">
                  Small-sided games
                </h2>
                <img
                  src="/demo/synco/images/cardimgSmall.png"
                  alt="Small-sided games"
                  className="rounded-xl min-w-90 my-6"
                />
                <p className="text-blue-500 text-[14px] font-semibold">Time Duration: 10 mins</p>

                <div className="text-sm  space-y-3">
                  <div>
                    <p className="font-semibold text-[18px]">Organisation</p>
                    <p className="font-semibold text-gray-500  text-[14px]">Set up two small-sided games. You will need the following:</p>
                    <ul className="list-disc text-gray-500 font-semibold  pl-5 text-sm">
                      <li>4 pop-up goals</li>
                      <li>Bibs to divide teams</li>
                      <li>4 blue cones</li>
                      <li>5 footballs</li>
                    </ul>
                  </div>

                  <div>
                    <p className="font-semibold text-[18px]">Description</p>
                    <p className='font-semibold text-gray-500  text-[14px]'>Begin the lessons with two small-sided games</p>
                    <p className='font-semibold text-gray-500  text-[14px]'>Organise palyers based on abiltiy into four teams. if you do not have many students, use one pitch only. Keep an eye on both games, unless you have a support coach working with you </p>
                  </div>

                  <div>
                    <p className="font-semibold text-[18px]">Rules</p>
                    <p className='font-semibold text-gray-500  text-[14px]'>Befor ou start the game, quickly reiterate the rules of the game: </p>
                    <br />
                    <ol className="list-decimal   font-semibold text-gray-500  text-[14px] pl-5">
                      <li>No slide tackles</li>
                      <li>if the ball roll out of play, students should all freeze and wait for a new ball to be rollled in (have 5 football nearby ready )</li>
                    </ol>
                  </div>
                  <div>
                    <p className="font-semibold text-[18px]">Conditions </p>
                    <p className='font-semibold text-gray-500  text-[14px]'>You can select a condition from below to stop students from all chasing the ball and/or playing as solo players. Keep classes fun by variating the conditions each week.</p>
                    <br />
                    <ol className="list-decimal   font-semibold text-gray-500  text-[14px] pl-5">
                      <li> Players can only shoot once every member of the team has touched the ball.</li>
                      <li>Only can only shoot once they have built 3–5 passes.</li>
                      <li>Only one member of each team is selected as the goalscorer.</li>
                    </ol>
                  </div>
                  <div>
                    <p className="font-semibold text-[18px]">How to maintain the tone & intensity </p>

                  </div>
                </div>
              </div>
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

export default Preview;
