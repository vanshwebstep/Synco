import { useState } from 'react';

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

  const pages = contentMap[activeTab] || [];
  const totalPages = pages.length;
  const currentContent = pages[page - 1];
  return (
    <div className="md:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-3 w-full md:w-1/2">
        <h2
          onClick={() => {
            navigate('/weekly-classes/term-dates/list');
          }}
          className="text-xl md:text-[28px] font-semibold flex items-center gap-2 md:gap-3 cursor-pointer hover:opacity-80 transition-opacity mb-4 duration-200">
          <img
            src="/icons/arrow-left.png"
            alt="Back"
            className="w-5 h-5 md:w-6 md:h-6"
          />
          <span className="truncate">Add Term Dates</span>
        </h2>
      </div>
      <div className="bg-white rounded-3xl shadow p-6 flex flex-col md:flex-row gap-6">
        {/* Left Sidebar */}
        <div className="w-full md:w-2/12 bg-[#F4F2EC] py-6  rounded-2xl  text-center">
          <div className="w-18 h-18 bg-yellow-400 rounded-full flex items-center justify-center text-white text-2xl font-semibold mx-auto mb-4">
            <img src="/icons/pendingBig.png" alt="" />
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
          <div className="flex gap-4 border max-w-fit border-gray-300 p-1 rounded-xl  flex-wrap">
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
                  src="/images/playLikePele.png"
                  alt="Play like Pele"
                  className="rounded-xl mb-2"
                />
                <h2 className="font-semibold text-[28px] mb-0">
                  {currentContent.title}
                </h2>
                <p className="text-[20px] flex items-center gap-2 font-semibold">
                  {currentContent.heading} <img src="/icons/Volumeblue.png" alt="" />
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
                  <h2 className="font-semibold text-[28px] mb-0">
                    Session Plan
                  </h2>
                  <img src="/icons/downloadicon.png" alt="" />
                </div>
                <div>
                  <p className="text-sm flex items-center gap-2  text-gray-500 border-b border-gray-300 pb-3 ">
                    <img src="/members/Time-Circle.png" className='w-4 w-5' alt="" />  4 hours ago
                  </p>
                </div>

                <div className='flex items-center gap-4 '>
                  <div>
                    <img className='min-h-[116px] min-w-[191px]' src="/images/cardimgSmall.png" alt="" />
                  </div>
                  <div>
                    <h6 className='text-[18px]'>Small Side Games</h6>
                    <p className='text-[16px]'>This skills tutorial will help you understand how to perform the Penguim.</p>
                    <span className='text-[14px]'>10 mins</span>
                  </div>
                </div>
              </div>

              {/* Right - Placeholder Drill Info */}
              <div className="w-full lg:w-1/2 bg-white">
                <img
                  src="https://via.placeholder.com/200x140?text=Small-Sided+Games"
                  alt="Small-sided games"
                  className="rounded-xl mb-4"
                />
                <p className="text-blue-500 text-sm font-medium">Time Duration: 10 mins</p>

                <div className="text-sm text-gray-700 space-y-3">
                  <div>
                    <p className="font-semibold">Organisation</p>
                    <ul className="list-disc pl-5 text-sm">
                      <li>4 pop-up goals</li>
                      <li>Bibs to divide teams</li>
                      <li>4 blue cones</li>
                      <li>5 footballs</li>
                    </ul>
                  </div>

                  <div>
                    <p className="font-semibold">Description</p>
                    <p>Start with two small-sided games. Adjust for student count.</p>
                  </div>

                  <div>
                    <p className="font-semibold">Rules</p>
                    <ol className="list-decimal pl-5">
                      <li>No slide tackles</li>
                      <li>Ball out → restart with new ball</li>
                    </ol>
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
