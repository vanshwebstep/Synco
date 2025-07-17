import { useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";

const ViewSessions = ({ item, sessionData }) => {
  const tabs = ['Beginners', 'Intermediate', 'Advanced', 'Pro'];
  const [activeTab, setActiveTab] = useState('Beginners');
  const [page, setPage] = useState(1);

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

  const pages = contentMap[activeTab] || [];
  const totalPages = pages.length;
  const currentContent = pages[page - 1];
  return (
    <div className="md:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-3 w-full md:w-1/2">
        <h2
          onClick={() => {
            navigate('/weekly-classes/venues/class-schedule');
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
            <p><span className="font-semibold">Venue</span><br /> Chelsea Academy</p>
            <p><span className="font-semibold">Class</span><br /> 4–5 Years</p>
            <p><span className="font-semibold">Date:</span> <br />Sunday 23rd April 2023</p>
            <p><span className="font-semibold">Time:</span> <br />11:00am – 12:00pm</p>
          </div>
        </div>

        {/* Right Content */}
        <div className="w-full md:w-10/12 space-y-6">
          {/* Tabs */}
          <div className="md:flex gap-4 border max-w-fit border-gray-300 p-1 rounded-xl  flex-wrap">
            {tabs.map((tab) => (
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
                <img
                  src="/demo/synco/images/playLikePele.png"
                  alt="Play like Pele"
                  className="rounded-xl mb-2"
                />
                <h2 className="font-semibold text-[28px] mb-0">
                  {currentContent.title}
                </h2>
                <p className="text-[20px] flex items-center gap-2 font-semibold">
                  {currentContent.heading} <img src="/demo/synco/icons/Volumeblue.png" alt="" />
                </p>
                <p className="text-sm text-gray-500 border-b border-gray-300 pb-3 ">
                  {currentContent.description}
                </p>
                <video
                  src={currentContent.videoUrl}
                  controls
                  className="w-full  pt-3 rounded-4xl"
                />
                <div className='flex items-center  mb-0 justify-between' >
                  <h2 className="font-semibold text-[24px] mb-0">
                    Session Plan
                  </h2>
                  <img src="/demo/synco/icons/downloadicon.png" alt="" />
                </div>
                <div>
                  <p className="text-sm flex items-center gap-2  text-gray-500 border-b border-gray-300 pb-3 ">
                    <img src="/demo/synco/members/Time-Circle.png" className='w-4 h-4' alt="" />  4 hours ago
                  </p>
                </div>

                <div className='md:flex items-center mb-5 gap-4 '>
                  <div>
                    <img className='md:min-h-[116px] md:min-w-[181px]' src="/demo/synco/images/cardimgSmall.png" alt="" />
                  </div>
                  <div>
                    <h6 className='text-[18px] font-semibold'>Small Side Games</h6>
                    <p className='text-[16px]'>This skills tutorial will help you understand how to perform the Penguim.</p>
                    <span className='text-[14px]'>10 mins</span>
                  </div>
                </div>

                <div className='md:flex items-center gap-4 '>
                  <div>
                    <img className='min-h-[116px] min-w-[181px]' src="/demo/synco/images/cardimgSmall.png" alt="" />
                  </div>
                  <div>
                    <h6 className='text-[18px] font-semibold'>Small Side Games</h6>
                    <p className='text-[16px]'>This skills tutorial will help you understand how to perform the Penguim.</p>
                    <span className='text-[14px]'>10 mins</span>
                  </div>
                </div>
              </div>

              {/* Right - Placeholder Drill Info */}
              <div className="w-full  border-l pl-6 border-gray-300 lg:w-1/2 bg-white">
                <h2 className="font-semibold text-[24px] mb-0">
                  Small-sided games
                </h2>
                <img
                  src="/demo/synco/images/cardimgSmall.png"
                  alt="Small-sided games"
                  className="rounded-xl md:min-w-90 my-6"
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

export default ViewSessions;
