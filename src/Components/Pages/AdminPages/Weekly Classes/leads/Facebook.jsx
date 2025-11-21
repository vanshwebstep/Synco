import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  Clock,
  Check,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useLeads } from "../../contexts/LeadsContext";
import Loader from "../../contexts/Loader";
import PlanTabs from "../../Weekly Classes/Find a class/PlanTabs";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet';

import ResizeMap from "../../Common/Resizemap";

const Facebook = () => {

  const [openMapId, setOpenMapId] = useState(null);
  const modalRef = useRef(null);
  const PRef = useRef(null);
  const [calendarData, setCalendarData] = useState([]);
  const { loading, fetchData, data } = useLeads();
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);
  const navigate = useNavigate()
  const iconContainerRef = useRef(null);
  const [activeParkingVenueId, setActiveParkingVenueId] = useState(null);
  const [notes, setNotes] = useState(null);
  const [activeCongestionVenueId, setActiveCongestionVenueId] = useState(null);
  const [showteamModal, setShowteamModal] = useState(null);
  const [showModal, setShowModal] = useState(null);
  const modalRefs = useRef({}); // store refs by id
  const [selectedPlans, setSelectedPlans] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [fromDate, setFromDate] = useState(new Date(currentDate.getFullYear(), currentDate.getMonth(), 11));
  const [toDate, setToDate] = useState(null);

  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();
  const customIcon = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };
  const getDaysArray = () => {
    const startDay = new Date(year, month, 1).getDay(); // Sunday = 0
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];

    const offset = startDay === 0 ? 6 : startDay - 1;

    for (let i = 0; i < offset; i++) {
      days.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const calendarDays = getDaysArray();

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setFromDate(null);
    setToDate(null);
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setFromDate(null);
    setToDate(null);
  };

  const getDateStatus = (date) => {
    let isStartOrEnd = false;
    let isInBetween = false;
    let isExcluded = false;
    let isSessionDate = false;
    calendarData.forEach((term) => {
      const start = new Date(term.startDate);
      const end = new Date(term.endDate);

      if (!date) return;

      if (isSameDate(date, start) || isSameDate(date, end)) {
        isStartOrEnd = true;
      } else if (date >= start && date <= end) {
        isInBetween = true;
      }

      term.exclusionDates?.forEach((ex) => {
        const exclusionDate = new Date(ex);
        if (isSameDate(date, exclusionDate)) {
          isExcluded = true;
        }
      });
      term.sessionsMap?.forEach((session) => {
        const sessionDate = new Date(session.sessionDate);
        if (isSameDate(date, sessionDate)) {
          isSessionDate = true;
        }
      });
    });

    return { isStartOrEnd, isInBetween, isExcluded, isSessionDate };
  };

  const isSameDate = (d1, d2) =>
    d1 && d2 &&
    d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear();

  const isInRange = (date) =>
    fromDate && toDate && date && date >= fromDate && date <= toDate;

  const handleDateClick = (date) => {
    if (!fromDate || (fromDate && toDate)) {
      setFromDate(date);
      setToDate(null);
    } else if (fromDate && !toDate) {
      if (date < fromDate) {
        setFromDate(date);
      } else {
        setToDate(date);
      }
    }
  };

  const toggleCheckbox = (userId, e) => {
    e.stopPropagation();
    setSelectedUserIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const toggleExpand = (id, e) => {
    e.stopPropagation();
    setExpandedRow(expandedRow === id ? null : id);
  };

  useEffect(() => {
    fetchData();
  }, []);


  const handleIconClick = (type, id, paymentPlans = []) => {


    switch (type) {
      case "payment":
        setSelectedPlans(paymentPlans || []);
        setShowModal(prev => {
          const next = prev === id ? null : id;

          return next;
        });
        setShowteamModal(null);
        setOpenMapId(null);
        setActiveCongestionVenueId(null);
        setActiveParkingVenueId(null);
        setNotes(null);
        break;

      case "team":
        setCalendarData(paymentPlans || []);
        setShowteamModal(prev => {
          const next = prev === id ? null : id;
          return next;
        });
        setShowModal(null);
        setOpenMapId(null);
        setActiveCongestionVenueId(null);
        setActiveParkingVenueId(null);
        setNotes(null);
        break;

      case "location":
        setOpenMapId(prev => {
          const next = prev === id ? null : id;
          return next;
        });
        setShowModal(null);
        setShowteamModal(null);
        setActiveCongestionVenueId(null);
        setActiveParkingVenueId(null);
        setNotes(null);
        break;

      case "congestion":
        setNotes(paymentPlans);
        setActiveCongestionVenueId(prev => {
          const next = prev === id ? null : id;
          return next;
        });
        setShowModal(null);
        setShowteamModal(null);
        setOpenMapId(null);
        setActiveParkingVenueId(null);
        break;

      case "parking":
        setNotes(paymentPlans);
        setActiveParkingVenueId(prev => {
          const next = prev === id ? null : id;
          return next;
        });
        setShowModal(null);
        setShowteamModal(null);
        setOpenMapId(null);
        setActiveCongestionVenueId(null);
        break;

      default:
        break;
    }

  };




  useEffect(() => {
    const activeVenueId =
      showModal ?? showteamModal ?? openMapId ?? activeCongestionVenueId ?? activeParkingVenueId;

    if (activeVenueId && modalRefs.current[activeVenueId]) {
      modalRefs.current[activeVenueId].scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [showModal, showteamModal, openMapId, activeCongestionVenueId, activeParkingVenueId]);



  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setActiveCongestionVenueId(null); // toggle works now
      }
      if (PRef.current && !PRef.current.contains(event.target)) {
        setActiveParkingVenueId(null); // toggle works now
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleBookFreeTrial = (classId, leadId) => {
    console.log('leadId', leadId)
    navigate('/weekly-classes/find-a-class/book-a-free-trial', {
      state: {
        classId,
        from_lead: 'yes',
        leadId: leadId // pass dynamically (fallback for safety)
      },
    });
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }, 50);
  };
  const handleAddToWaitingList = (classId, leadId) => {
    navigate('/weekly-classes/find-a-class/add-to-waiting-list', {
      state: {
        classId,
        from_lead: 'yes',
        leadId: leadId // pass dynamically (fallback for safety)
      },
    });
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }, 50);
  };

  const handleBookMembership = (classId, leadId) => {
    navigate('/weekly-classes/find-a-class/book-a-membership', {
      state: {
        classId,
        from_lead: 'yes',
        leadId: leadId // pass dynamically (fallback for safety)
      },
    });
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }, 50);
  };
  console.log('selectedUserIds', selectedUserIds)
  if (loading) return <Loader />;
  if (data.length == 0) return <p className="text-center">No Data Found</p>;
  return (
    <>
      <div className="overflow-auto rounded-2xl bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-[#F5F5F5] text-left border border-[#EFEEF2]">
            <tr className="font-semibold text-[#717073]">
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Parent Name</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Phone</th>
              <th className="py-3 px-4">Postcode</th>
              <th className="py-3 px-4">Kid Range</th>
              <th className="py-3 px-4">Assigned Agent</th>
              <th className="py-3 px-4">Status</th>
            </tr>
          </thead>

          <tbody>
            {data.map((lead, i) => {
              const isChecked = selectedUserIds.includes(lead.id);
              const isExpanded = expandedRow === lead.id;

              return (
                <React.Fragment key={i}>
                  <tr onClick={() => navigate(`/weekly-classes/central-leads/accont-info?id=${lead.id}`)} className="border-b border-[#EFEEF2] hover:bg-gray-50 transition cursor-pointer">
                    <td className="py-3 px-4 font-semibold whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={(e) => toggleCheckbox(lead.id, e)}
                          className={`w-5 h-5 flex items-center justify-center rounded-md border-2 ${isChecked ? "border-gray-500" : "border-gray-300"
                            }`}
                        >
                          {isChecked && (
                            <Check
                              size={16}
                              strokeWidth={3}
                              className="text-gray-500"
                            />
                          )}
                        </button>
                        {new Date(lead.createdAt).toLocaleDateString("en-GB")}

                      </div>
                    </td>
                    <td className="py-3 px-4">{lead?.firstName + ' ' + lead?.lastName || '-'}</td>
                    <td className="py-3 px-4">{lead.email || '-'}</td>
                    <td className="py-3 px-4">{lead.phone || '-'}</td>
                    <td className="py-3 px-4">{lead.postcode || '-'}</td>
                    <td className="py-3 px-4 whitespace-nowrap">{lead.childAge || '-'}</td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {lead.assignedAgent?.firstName + ' ' + lead.assignedAgent?.lastName || '-'}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="bg-[#FBEECE] text-[#EDA600] px-5 py-1.5 rounded-xl text-xs font-semibold">
                          {lead.status}
                        </span>
                        <button onClick={(e) => toggleExpand(lead.id, e)}>
                          {isExpanded ? (
                            <ChevronUp size={18} className="text-gray-600" />
                          ) : (
                            <ChevronDown size={18} className="text-gray-600" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>

                  <tr className="bg-white">
                    <td colSpan={8} >
                      {/* Animated container */}
                      <div
                        className={`transition-all  duration-500 ease-in-out overflow-auto ${isExpanded ? "max-h-[800px] opacity-100 py-6" : "max-h-0 opacity-0 py-0"
                          }`}
                      >

                        {lead.nearestVenues?.length > 0 ? (
                          lead.nearestVenues.map((venue, vIndex) => (
                            <div
                              key={vIndex}
                              className="p-3 relative border border-[#E2E1E5] mb-5 rounded-4xl space-y-5 bg-white"
                            >
                              {/* Header Bar */}
                              <div className="flex justify-between items-center bg-[#3D444F] text-white rounded-2xl px-5 py-4 mb-2">
                                <div className="flex items-center gap-2 text-white">
                                  <MapPin size={18} />
                                  <span className="font-semibold">
                                    {venue.name}, {venue.address}
                                  </span>
                                </div>

                                <div ref={iconContainerRef} className=" md:mt-0 mt-5 flex relative items-center gap-4">
                                  <img
                                    src="/demo/synco/icons/fcDollar.png"
                                    onClick={() => handleIconClick('payment', venue.id, venue?.paymentGroups[0]?.paymentPlans)} alt=""
                                    className={`cursor-pointer w-6 h-6 rounded-full ${showModal === venue.id ? 'bg-[#0DD180]' : 'bg-white'}`}
                                  />

                                  <img
                                    src="/demo/synco/icons/fcCalendar.png"
                                    onClick={() => handleIconClick('team', venue.id, venue.terms)}
                                    alt=""
                                    className={`cursor-pointer w-6 h-6 rounded-full ${showteamModal === venue.id ? 'bg-[#0DD180]' : 'bg-white'}`}
                                  />

                                  <img
                                    src="/demo/synco/icons/fcLocation.png"
                                    onClick={() => handleIconClick('location', venue.id)}
                                    alt=""
                                    className={`cursor-pointer w-6 h-6 rounded-full ${openMapId === venue.id ? 'bg-[#0DD180]' : 'bg-white'}`}
                                  />

                                  <img
                                    src="/demo/synco/icons/fcCicon.png"
                                    onClick={() => handleIconClick('congestion', venue?.id, venue?.congestionNote)}
                                    alt=""
                                    className={`cursor-pointer w-6 h-6 rounded-full ${activeCongestionVenueId === venue.id ? 'bg-[#0DD180]' : 'bg-white'}`}
                                  />

                                  <img
                                    src="/demo/synco/icons/fcPIcon.png"
                                    onClick={() => handleIconClick('parking', venue?.id, venue?.parkingNote)}
                                    alt=""
                                    className={`cursor-pointer w-6 h-6 rounded-full ${activeParkingVenueId === venue.id ? 'bg-[#0DD180]' : 'bg-white'}`}
                                  />
                                </div>
                              </div>

                              {/* Inner White Box */}
                              <div className="bg-[#FCF9F6] rounded-2xl p-3 px-5 items-center flex justify-between overflow-auto gap-6">
                                {/* Location Info */}
                                <div className="flex border-r pr-5  justify-between items-center gap-4 border-gray-400 pb-4 md:w-[30%]">
                                  <div className="truncate">
                                    <p className="text-lg font-semibold text-[#333] truncate">{venue?.area}</p>
                                    <p className="text-sm text-gray-500 mt-2">{venue?.distance} miles</p>
                                  </div>
                                  <div className="text-center">
                                    <p className="text-[14px] font-semibold text-[#384455] whitespace-nowrap">
                                      1st Nov 2023 – 4th Nov 2023
                                    </p>
                                    <p className="text-xs text-[#717073] font-semibold mt-2">4 Days</p>
                                  </div>
                                </div>

                                {/* Class Details */}
                                <div className="md:w-[75%]">
                                  {venue.classSchedules?.length > 0 ? (
                                    venue.classSchedules.map((cls, idx) => {
                                      const available = cls.capacity;
                                      const isFull = cls.capacity == 0;
                                      return (

                                        <div
                                          key={idx}
                                          className="flex justify-between gap-4 items-center mt-2"
                                        >
                                          <p className=" text-[#000] md:w-[22%] flex gap-7 "><b>{`Class ${idx + 1}`} </b>{cls.className}</p>
                                          <p className="text-sm md:w-[12%]  text-[#384455]  font-semibold capitalize">
                                            {cls.day}
                                          </p>
                                          <p className="flex md:w-[20%]  items-center gap-1 text-xs text-[#384455] font-semibold justify-end">
                                            <Clock size={14} /> {cls.startTime} – {cls.endTime}
                                          </p>
                                          <p
                                            className={`text-xs text-center md:w-[11%] font-semibold mt-1 ${isFull
                                              ? "bg-[#FEE2E2] text-[#F87171]"
                                              : "bg-[#DCFCE7] text-[#16A34A]"
                                              } px-3 py-1 rounded-md inline-block`}
                                          >
                                            {isFull ? "Fully booked" : `+${available} spaces`}
                                          </p>

                                          <div key={idx} className="flex  md:w-[25%]  flex-wrap justify-end gap-3 ">
                                            {
                                              available == 0 && (
                                                <button onClick={() => handleAddToWaitingList(cls.id, lead?.id)} className="bg-[#237FEA]  text-white px-4 py-2 rounded-lg text-[14px] font-semibold hover:bg-[#006AE6] transition">
                                                  Add to Waiting List
                                                </button>

                                              )
                                            }
                                            {cls.allowFreeTrial ? (
                                              !isFull && (
                                                <>
                                                  <button
                                                    onClick={() => handleBookFreeTrial(cls.id, lead?.id)}
                                                    className="border px-4 py-2 rounded-lg text-[14px] hover:bg-gray-50 transition"
                                                  >
                                                    Book a Free Trial
                                                  </button>

                                                  <button
                                                    onClick={() => handleBookMembership(cls.id, lead?.id)}
                                                    className="border px-4 py-2 rounded-lg text-[14px] hover:bg-gray-50 transition"
                                                  >
                                                    Book a Membership
                                                  </button>
                                                </>
                                              )
                                            ) : (
                                              <button
                                                onClick={() => handleBookMembership(cls.id, lead?.id)}
                                                className="border px-4 py-2 rounded-lg text-[14px] hover:bg-gray-50 transition"
                                              >
                                                Book a Membership
                                              </button>
                                            )}


                                          </div>
                                        </div>
                                      );
                                    })
                                  ) : (
                                    <p className="text-sm text-gray-500 mt-2">No classes available.</p>
                                  )}
                                </div>






                              </div>

                              {activeCongestionVenueId === venue.id && (
                                <div ref={iconContainerRef} className="absolute top-16 right-4 z-20">

                                  <div className="bg-white rounded-2xl shadow-2xl px-6 py-4 min-w-[300px] max-w-[489px]">
                                    <div className="flex items-start justify-between">
                                      <h2 className="text-red-500 font-semibold text-[18px]">Congestion Information</h2>
                                      <img src="/demo/synco/icons/infoIcon.png" alt="" />
                                    </div>
                                    <div className="mt-2 text-[16px] text-gray-700 leading-snug">

                                      {notes ? (
                                        <p>This venue is inside of the congestion zone.</p>
                                      ) : (
                                        <>
                                          <p>There is no congestion charges at this venue.</p>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              )}

                              {activeParkingVenueId === venue.id && (
                                <div ref={iconContainerRef} className="absolute top-16 right-4 z-20">

                                  <div className="bg-white rounded-2xl shadow-2xl px-6 py-4 min-w-[300px] max-w-[489px]">
                                    <div className="flex items-start justify-between">
                                      <h2 className="text-red-500 font-semibold text-[18px]">Parking Information</h2>
                                      <img src="/demo/synco/icons/infoIcon.png" alt="" />
                                    </div>
                                    <div className="mt-2 text-[16px] text-gray-700 leading-snug">

                                      {notes ? (
                                        notes
                                      ) : (
                                        <>
                                          <p>This venue has no parking facilities available.</p>
                                          <p>Paid road parking is available.</p>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              )}
                              {showteamModal === venue.id && (
                                <div
                                  ref={iconContainerRef}
                                  // ref={iconContainerRef}
                                  className="
        absolute bg-opacity-30 top-15 flex items-center justify-center z-50
        min-w-[200px] sm:min-w-[489px]
        left-2 sm:left-auto right-2
        px-2 sm:px-0
      "
                                >
                                  <div className="bg-white rounded-3xl w-full max-w-md sm:max-w-lg p-4 sm:p-6 shadow-2xl">
                                    {/* Header */}
                                    <div ref={(el) => (modalRefs.current[venue.id] = el)} className="flex justify-between items-center border-b border-[#E2E1E5] pb-4 mb-4">
                                      <h2 className="text-[24px]  font-semibold">Team Dates</h2>
                                      <button onClick={() => setShowteamModal(null)}>
                                        <img src="/demo/synco/icons/cross.png" alt="close" className="w-4 h-4" />
                                      </button>
                                    </div>

                                    {/* Term List */}
                                    <div className="space-y-6 max-h-80 overflow-y-scroll text-center text-[13px] sm:text-[14px] text-[#2E2F3E] font-medium">
                                      {calendarData.map((term) => (
                                        <div key={term.id}>
                                          <h3 className="md:text-[20px] font-semibold mb-1">{term.name} Term {new Date(term.startDate).getFullYear()}</h3>
                                          <p className="md:text-[18px]">
                                            {formatDate(term.startDate)} - {formatDate(term.endDate)}
                                          </p>
                                          <p className="md:text-[18px]">
                                            Half term Exclusion:{" "}
                                            {term.exclusionDates.map((ex, idx) => (
                                              <span key={idx}>
                                                {formatDate(ex)}{idx < term.exclusionDates.length - 1 ? ", " : ""}
                                              </span>
                                            ))}
                                          </p>
                                        </div>
                                      ))}
                                    </div>

                                    {/* Calendar Section */}
                                    <div className="rounded p-4 mt-6 text-center md:text-sm w-full max-w-md mx-auto">
                                      {/* Header */}
                                      <div className="flex justify-around items-center mb-3">
                                        <button
                                          onClick={goToPreviousMonth}
                                          className="w-8 h-8 rounded-full bg-white text-black hover:bg-black hover:text-white border border-black flex items-center justify-center"
                                        >
                                          <ChevronLeft className="w-5 h-5" />
                                        </button>
                                        <p className="font-semibold md:text-[20px]">
                                          {currentDate.toLocaleString("default", { month: "long" })} {year}
                                        </p>
                                        <button
                                          onClick={goToNextMonth}
                                          className="w-8 h-8 rounded-full bg-white text-black hover:bg-black hover:text-white border border-black flex items-center justify-center"
                                        >
                                          <ChevronRight className="w-5 h-5" />
                                        </button>
                                      </div>

                                      {/* Day Labels */}
                                      <div className="grid grid-cols-7 text-xs gap-1 md:text-[18px] text-gray-500 mb-1">
                                        {["M", "T", "W", "T", "F", "S", "S"].map((day) => (
                                          <div key={day} className="font-medium text-center">
                                            {day}
                                          </div>
                                        ))}
                                      </div>

                                      {/* Calendar Weeks */}
                                      <div className="grid grid-cols-7 gap-0 text-[16px]">
                                        {calendarDays.map((date, i) => {
                                          const { isStartOrEnd, isInBetween, isExcluded, isSessionDate } = getDateStatus(date);

                                          let className = "aspect-square flex items-center justify-center transition-all duration-200 ";
                                          let innerDiv = null;

                                          if (!date) {
                                            className += "";
                                          } else if (isExcluded) {
                                            className += "bg-gray-400 text-white opacity-60 rounded-full cursor-not-allowed";
                                          } else if (isSessionDate) {
                                            className += "bg-blue-600 text-white font-bold rounded-full"; // DARK BLUE
                                          } else if (isStartOrEnd) {
                                            className += ""; // Outer background
                                            innerDiv = (
                                              <div className="bg-blue-600 text-white rounded-full w-full h-full flex items-center justify-center font-bold">
                                                {date.getDate()}
                                              </div>
                                            );
                                          } else if (isInBetween) {
                                            className += " text-gray-800";
                                          } else {
                                            className += "hover:bg-gray-100 text-gray-800";
                                          }

                                          return (
                                            <div
                                              key={i}
                                              onClick={() => date && !isExcluded && handleDateClick(date)}
                                              className={className}
                                            >
                                              {innerDiv || (date ? date.getDate() : "")}
                                            </div>
                                          );
                                        })}
                                      </div>

                                    </div>
                                  </div>
                                </div>

                              )}

                              {showModal === venue.id && (
                                <div className=" absolute bg-opacity-30 flex right-2 items-center top-15 justify-center z-50">
                                  <div ref={(el) => (modalRefs.current[venue.id] = el)} className="flex items-center justify-center w-full px-2 py-6 sm:px-2 md:py-2">
                                    <div ref={iconContainerRef} className="bg-white rounded-3xl p-4 sm:p-6 w-full max-w-4xl shadow-2xl">
                                      {/* Header */}
                                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#E2E1E5] pb-4 mb-4 gap-2">
                                        <h2 className="font-semibold text-[20px] sm:text-[24px]">Payment Plan Preview</h2>
                                        <button className="text-gray-400 hover:text-black text-xl font-bold">
                                          <img src="/demo/synco/icons/cross.png" onClick={() => setShowModal(null)} alt="close" className="w-5 h-5" />
                                        </button>
                                      </div>
                                      <PlanTabs selectedPlans={selectedPlans} />
                                    </div>
                                  </div>
                                </div>
                              )}
                              {openMapId === venue.id && (
                                <div ref={iconContainerRef}>
                                  <div
                                    ref={(el) => (modalRefs.current[venue.id] = el)}
                                    className="mt-4 h-[450px] w-full rounded-lg overflow-hidden"
                                  >
                                    {venue.latitude && venue.longitude ? (
                                      <MapContainer
                                        center={[venue.latitude, venue.longitude]}
                                        zoom={13}
                                        scrollWheelZoom={false}
                                        zoomControl={false}
                                        style={{ height: "100%", width: "100%" }}
                                      >
                                        <TileLayer
                                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                        />
                                        <Marker position={[venue.latitude, venue.longitude]} icon={customIcon}>
                                          <Popup>
                                            <strong>{venue.venueName}</strong>
                                            <br />
                                            {venue.address}
                                          </Popup>
                                        </Marker>
                                        <ZoomControl position="bottomright" />
                                        <ResizeMap />
                                      </MapContainer>
                                    ) : (
                                      <div className="flex items-center justify-center h-full bg-gray-100 text-gray-500 text-lg font-medium">
                                        No map location found
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          ))
                        ) : (
                          <p className="text-center text-gray-500">No nearest venues found.</p>
                        )}



                      </div>
                    </td>
                  </tr>
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>




    </>
  );
};

export default Facebook;
