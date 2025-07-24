// List.js
import React, { useEffect, useState } from 'react';
import Loader from '../../contexts/Loader';
import TermCard from './TermCard';
import { useNavigate } from 'react-router-dom';
import { useTermContext } from '../../contexts/TermDatesSessionContext';
import { useVenue } from '../../contexts/VenueContext';

const formatDate = (iso) => {
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const formatShortDate = (iso) => {
  const d = new Date(iso);
  return `${d.toLocaleDateString('en-GB', {
    weekday: 'short',
  })} ${d.getDate()}/${String(d.getFullYear()).slice(2)}`;
};

const List = () => {
  const navigate = useNavigate();
  const { venues, fetchVenues, loading } = useVenue();
  const { fetchTermGroup, fetchTerm, termGroup, termData } = useTermContext();
  const [sessionDataList, setSessionDataList] = useState([]);
  const [classList, setClassList] = useState([]);

  useEffect(() => {
    fetchVenues();
    fetchTerm();
    fetchTermGroup();
  }, [fetchVenues, fetchTerm, fetchTermGroup]);

  useEffect(() => {
    // Build sessionData + classes when data is ready
    if (!termGroup.length || !termData.length) return;

    const grouped = termGroup.map((group) => {
      const terms = termData.filter((t) => t.termGroupId === group.id);
      if (!terms.length) return null;

      // Build sessionData format for this group
      const sessionData = terms.map((term) => {
        const start = formatDate(term.startDate);
        const end = formatDate(term.endDate);
        const dateRange = `${start} - ${end}`;
        const exclusion =
          term.exclusionDates?.map((ex) => formatDate(ex)).join(', ') || 'None';

        const sessions = term.sessionsMap.map((session, idx) => {
          return `Session ${idx + 1}: Plan #${session.sessionPlanId}`;
        });

        return {
          term: term.termName,
          icon: `/demo/synco/icons/${term.termName.toLowerCase().includes('autumn')
            ? 'autumn'
            : term.termName.toLowerCase().includes('spring')
              ? 'spring'
              : 'summer'
            }.png`,
          date: dateRange,
          exclusion,
          sessions,
        };
      });

      const classCard = {
        name: group.name,
        Date: formatShortDate(group.createdAt), // this is your "4-7 Years" placeholder
        endTime: '3:00 pm',
        freeTrial: 'Yes',
        facility: 'Indoor',
      };

      // Spread terms into classCard as keys like autumn, spring, etc.
      sessionData.forEach((termData) => {
        const key = termData.term.toLowerCase().includes('autumn')
          ? 'autumn'
          : termData.term.toLowerCase().includes('spring')
            ? 'spring'
            : 'summer';
        classCard[key] = `${termData.date} Half-Term Exclusion: ${termData.exclusion}`;
      });

      return { sessionData, classCard };
    });

    const filtered = grouped.filter(Boolean);
    const allSessions = filtered.map((g) => g.sessionData);
    const allClasses = filtered.map((g) => g.classCard);

    setSessionDataList(allSessions);
    setClassList(allClasses);
  }, [termGroup, termData]);

  if (loading) return <Loader />;

  return (
    <div className="pt-1 bg-gray-50 min-h-screen px-4 md:px-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4 w-full">
        <h2 className="text-[22px] md:text-[28px] font-semibold">
          Term Dates & Session Plan Mapping
        </h2>

        <button
          onClick={() => navigate('/weekly-classes/term-dates/create')}
          className="bg-[#237FEA] flex items-center gap-2 text-white px-4 py-2 md:py-[10px] rounded-xl hover:bg-blue-700 text-[15px] md:text-[16px] font-semibold"
        >
          <img src="/demo/synco/members/add.png" className="w-4 md:w-5" alt="Add" />
          Add New Term Group
        </button>
      </div>

      {/* Term Cards */}
      <div className="transition-all duration-300 w-full">
        {venues.length > 0 && classList.length > 0 ? (
          <div className="rounded-3xl shadow">
            {classList.map((item, index) => (
              <TermCard item={item} sessionData={sessionDataList[index]} key={index} />
            ))}
          </div>
        ) : (
          <p className="text-center p-4 border-dotted border rounded-md text-sm md:text-base">
            No Term Groups with Valid Terms Found
          </p>
        )}
      </div>
    </div>
  );
};

export default List;
