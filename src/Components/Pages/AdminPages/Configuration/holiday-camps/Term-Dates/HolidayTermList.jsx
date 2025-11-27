// List.js
import React, { useEffect, useState } from 'react';
import Loader from '../../../contexts/Loader';
import TermCard from './TermCard';
import { useNavigate } from 'react-router-dom';
import { usePermission } from '../../../Common/permission';
import { useHolidayTerm } from '../../../contexts/HolidayTermsContext';

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

const HolidayTermList = () => {
  const navigate = useNavigate();
  const { fetchTermGroup, fetchTerm, termGroup, termData, loading } = useHolidayTerm();
  const [sessionDataList, setSessionDataList] = useState([]);
  const [classList, setClassList] = useState([]);

  useEffect(() => {
    fetchTerm();
    fetchTermGroup();
  }, [fetchTerm, fetchTermGroup]);

  useEffect(() => {

    if (!termGroup.length || !termData.length) {
      return;
    }

    // Helper to detect season
    const detectSeason = (termName) => {
      const name = termName?.toLowerCase();
      if (name?.includes('autumn')) return 'autumn';
      if (name?.includes('spring')) return 'spring';
      return 'summer';
    };

    const grouped = termGroup.map((group) => {

      // FIX: match by holidayTermGroupId
      const terms = termData.filter((t) => t.holidayCampId === group.id);

      if (!terms.length) return null;
      console.log('termData',termData)

      const sessionData = terms.map((term) => {

        const start = formatDate(term.startDate);
        const end = formatDate(term.endDate);
        const dateRange = `${start} - ${end}`;

        // FIX: Normalize exclusionDates field
        let exclusionArr = [];
        if (Array.isArray(term.exclusionDates)) {
          exclusionArr = term.exclusionDates;
        } else if (typeof term.exclusionDates === 'string') {
          try {
            exclusionArr = JSON.parse(term.exclusionDates);
          } catch (e) {
            exclusionArr = [];
          }
        }

        const exclusion = exclusionArr.length
          ? exclusionArr.map((ex) => formatDate(ex)).join(', ')
          : 'None';

        const sessions = term.sessionsMap.map((session) => ({
          groupName: session?.sessionPlan?.groupName,
          date: formatDate(session.sessionDate),
        }));

        const season = detectSeason(term.termName);

        return {
          term: term.termName,
          endDate: term.endDate,
          startDate: term.startDate,
          totalDays: term.totalDays,
          icon: `/demo/synco/icons/${season}.png`,
          date: `${dateRange}\nHalf-Term Exclusion: ${exclusion}`,
          exclusion,
          sessions,
        };
      });

      // Create class card object
      const classCard = {
        id: group.id,
        name: group.name,
        Date: formatShortDate(group.createdAt),
        endTime: '3:00 pm',
        freeTrial: 'Yes',
        facility: 'Indoor',
      };

      sessionData.forEach((termObj) => {
        const key = detectSeason(termObj.term);
        classCard[key] = termObj.date;
      });

      return { sessionData, classCard };
    });


    const filtered = grouped.filter(Boolean);
    const allSessions = filtered.map((g) => g.sessionData);
    const allClasses = filtered.map((g) => g.classCard);


    setSessionDataList(allSessions);
    setClassList(allClasses);
  }, [termGroup, termData]);



  const { checkPermission } = usePermission();
  const canCreate =
    checkPermission({ module: 'term-group', action: 'create' }) &&
    checkPermission({ module: 'term', action: 'create' }) &&
    checkPermission({ module: 'session-plan-group', action: 'view-listing' });

  if (loading) {
    return <Loader />;
  }
  // Then check for missing data
  if (!termGroup.length && !termData.length) {
    return (
      <>  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4 w-full">
        <h2 className="text-[22px] md:text-[28px] font-semibold">
          Holiday Camp Dates & Session Plan Mapping
        </h2>


        {canCreate &&
          <button
            onClick={() => navigate('/configuration/holiday-camp/terms/create')}
            className="bg-[#237FEA] flex items-center gap-2 text-white px-4 py-2 md:py-[10px] rounded-xl hover:bg-blue-700 text-[15px] font-semibold"
          >
            <img src="/demo/synco/members/add.png" className="w-4 md:w-5" alt="Add" />
           Add Holiday Camp Dates
          </button>
        }
      </div>
        <div className="text-center p-4 border-dotted text-red-500 rounded-md text-sm md:text-base">
          No Term Groups or Term Data Available
        </div>
      </>
    );
  }

  if (!loading && !termGroup.length) {
    return (
      <>  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4 w-full">
        <h2 className="text-[22px] md:text-[28px] font-semibold">
          Holiday Camp Dates & Session Plan Mapping
        </h2>


        {canCreate &&
          <button
            onClick={() => navigate('/configuration/holiday-camp/terms/create')}
            className="bg-[#237FEA] flex items-center gap-2 text-white px-4 py-2 md:py-[10px] rounded-xl hover:bg-blue-700 text-[15px] font-semibold"
          >
            <img src="/demo/synco/members/add.png" className="w-4 md:w-5" alt="Add" />
           Add Holiday Camp Dates
          </button>
        }
      </div>
        <div className="text-center p-4 border-dotted text-red-500 rounded-md text-sm md:text-base">
          No Term Groups Available
        </div>
      </>
    );
  }


  return (
    <div className="pt-1 bg-gray-50 min-h-screen md:px-4 md:px-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4 w-full">
        <h2 className="text-[22px] md:text-[28px] font-semibold">
          Holiday Camp Dates & Session Plan Mapping
        </h2>


        {canCreate &&
          <button
            onClick={() => navigate('/configuration/holiday-camp/terms/create')}
            className="bg-[#237FEA] flex items-center gap-2 text-white px-4 py-2 md:py-[10px] rounded-xl hover:bg-blue-700 text-[15px] font-semibold"
          >
            <img src="/demo/synco/members/add.png" className="w-4 md:w-5" alt="Add" />
           Add Holiday Camp Dates
          </button>
        }
      </div>

      {/* Term Cards */}
      <div className="transition-all duration-300 h-full w-full">
        {classList.length > 0 ? (
          <div className="rounded-3xl shadow bg-white p-5  flex flex-col gap-6">
            {classList.map((item, index) => (
              <TermCard
                key={index}
                item={item}
                sessionData={sessionDataList[index]}
              />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-40 text-[#717073] font-medium">
            No data available
          </div>
        )}
      </div>

    </div>
  );
};

export default HolidayTermList;
