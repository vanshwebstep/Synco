import React, { useEffect, useState } from 'react';
import Loader from '../../contexts/Loader';
import TermCard from './TermCard';
import { useVenue } from '../../contexts/VenueContext';
import { useNavigate } from 'react-router-dom';
const sessionData = [
  {
    term: 'Autumn',
    icon: '/icons/autumn.png',
    date: 'Sat 9th Sep 2025 - Sat 10th Dec 2025',
    exclusion: 'Sat 15th Oct 2025',
    sessions: [...Array(12)].map((_, i) => `Session ${i + 1}: ${i < 6 ? 'Pele' : 'Neymar'}`),
  },
  {
    term: 'Spring',
    icon: '/icons/spring.png',
    date: 'Sat 14th Jan 2026 - Sat 2nd Apr 2026',
    exclusion: 'Sat 18th Feb 2026',
    sessions: [...Array(12)].map((_, i) => `Session ${i + 1}: ${i < 6 ? 'Messi' : 'Mbappé'}`),
  },
  {
    term: 'Summer',
    icon: '/icons/summer.png',
    date: 'Sat 6th May 2026 - Sat 29th Jul 2026',
    exclusion: 'Sat 10th Jun 2026',
    sessions: [...Array(12)].map((_, i) => `Session ${i + 1}: ${i < 6 ? 'Ronaldinho' : 'Zidane'}`),
  },
];

const classes = [
  {
    name: "Term Group Name",
    Date: "4-7 Years",
    autumn: sessionData[0].date + " Half-Term Exclusion: " + sessionData[0].exclusion,
    spring: sessionData[1].date + " Half-Term Exclusion: " + sessionData[1].exclusion,
    summer: sessionData[2].date + " Half-Term Exclusion: " + sessionData[2].exclusion,
    endTime: "3:00 pm",
    freeTrial: "Yes",
    facility: "Indoor",
  },
  {
    name: "Class 2",
    Date: "8-12 Years",
    autumn: sessionData[0].date + " Half-Term Exclusion: " + sessionData[0].exclusion,
    spring: sessionData[1].date + " Half-Term Exclusion: " + sessionData[1].exclusion,
    summer: sessionData[2].date + " Half-Term Exclusion: " + sessionData[2].exclusion,
    endTime: "3:00 pm",
    freeTrial: "Yes",
    facility: "Indoor",
  },
  {
    name: "Class 3",
    Date: "4-7 Years",
    autumn: sessionData[0].date + " Half-Term Exclusion: " + sessionData[0].exclusion,
    spring: sessionData[1].date + " Half-Term Exclusion: " + sessionData[1].exclusion,
    summer: sessionData[2].date + " Half-Term Exclusion: " + sessionData[2].exclusion,
    endTime: "3:00 pm",
    freeTrial: "No",
    facility: "Indoor",
  },
];

const List = () => {
const navigate = useNavigate();

  const [openForm, setOpenForm] = useState(false);
  const { venues, fetchVenues, loading } = useVenue();

  useEffect(() => { fetchVenues(); }, [fetchVenues]);

  if (loading) return <Loader />;

  return (
    <div className="pt-1 bg-gray-50 min-h-screen">
      <div className={`flex pe-4 justify-between items-center mb-4 w-full `}>
        <h2 className="text-[28px] font-semibold">Term Dates & Session Plan Mapping</h2>
        <button
          onClick={() => navigate('/weekly-classes/term-dates/create')}
          className="bg-[#237FEA] flex items-center gap-2 text-white px-4 py-[10px] rounded-xl hover:bg-blue-700 text-[16px] font-semibold"
        >
          <img src="members/add.png" className='w-5' alt="Add" /> Add New Term Group
        </button>
      </div>

      <div className={`transition-all duration-300 w-full `}>
        {venues.length > 0 ? (
          <div className="rounded-3xl shadow">
            {classes.map((item, index) => (
              <TermCard item={item} sessionData={sessionData} key={index} />
            ))}
          </div>
        ) : (
          <p className="text-center p-4 border-dotted border rounded-md">No Members Found</p>
        )}
      </div>
    </div>
  );
};

export default List;
