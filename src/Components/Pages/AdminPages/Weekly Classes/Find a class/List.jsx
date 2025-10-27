import React, { useEffect, useRef, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { Check } from "lucide-react";
import Loader from '../../contexts/Loader';
import { FiSearch, FiFilter } from "react-icons/fi";
import { Switch } from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { evaluate } from 'mathjs';
import { Info } from "lucide-react"; // or use a custom icon if needed
import ResizeMap from "../../Common/Resizemap"
import { useFindClass } from '../../contexts/FindClassContext';
import { FiMapPin } from "react-icons/fi";
import { FaFacebookF, FaInstagram, FaWhatsapp, FaPinterestP } from "react-icons/fa";
import PlanTabs from './PlanTabs';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Swal from "sweetalert2";
import { usePermission } from '../../Common/permission';
const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const List = () => {
  const { fetchFindClasses, findClasses, loading } = useFindClass();
  const [openMapId, setOpenMapId] = useState(null);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);
  useEffect(() => {
    fetchFindClasses()
  }, [fetchFindClasses]);
  const iconContainerRef = useRef(null);
  const [activeParkingVenueId, setActiveParkingVenueId] = useState(null);
  const [notes, setNotes] = useState(null);
  const [activeCongestionVenueId, setActiveCongestionVenueId] = useState(null);
  const [showteamModal, setShowteamModal] = useState(null);
  const [showModal, setShowModal] = useState(null);
  const modalRefs = useRef({}); // store refs by venueId

  const resetModals = () => {
    setActiveParkingVenueId(null);
    setActiveCongestionVenueId(null);
    setShowteamModal(null);
    setShowModal(null);
  };
  // Parking
  const handleParkingClick = (venueId) => {
    if (activeParkingVenueId === venueId) {
      setActiveParkingVenueId(null);
    } else {
      resetModals();
      setActiveParkingVenueId(venueId);
    }
  };

  // Congestion
  const handleCongestionClick = (venueId) => {
    if (activeCongestionVenueId === venueId) {
      setActiveCongestionVenueId(null);
    } else {
      resetModals();
      setActiveCongestionVenueId(venueId);
    }
  };

  // Team
  const handleTeamClick = (venueId) => {
    if (showteamModal === venueId) {
      setShowteamModal(null);
    } else {
      resetModals();
      setShowteamModal(venueId);
    }
  };

  // Location
  const handleLocationClick = (venueId) => {
    if (showModal === venueId) {
      setShowModal(null);
    } else {
      resetModals();
      setShowModal(venueId);
    }
  };


  const [selectedPlans, setSelectedPlans] = useState([]);

  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('');
  const [clickedIcon, setClickedIcon] = useState(null);

  const venues = ["All venues", ...new Set(findClasses.map(v => v.venueName).filter(Boolean))];
  const [showAll, setShowAll] = useState(false);

  const visibleVenues = showAll ? venues : venues.slice(0, 5);

  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const toggleCheckbox = (userId) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };
  const isAllSelected = venues.length > 0 && selectedUserIds.length === venues.length;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedUserIds([]);
    } else {
      const allIds = venues.map((user) => user.id);
      setSelectedUserIds(allIds);
    }
  };






  const [searchVenue, setSearchVenue] = useState("");
  const [searchPostcode, setSearchPostcode] = useState("");
  const [selectedVenues, setSelectedVenues] = useState(["All venues"]);
  const [calendarData, setCalendarData] = useState([]);
  const [selectedDays, setSelectedDays] = useState([]);
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);


  const toggleVenue = (venue) => {
    if (venue === "All venues") {
      setSelectedVenues(["All venues"]);
    } else {
      let updated = [...selectedVenues];
      updated = updated.includes("All venues") ? [] : updated;

      if (updated.includes(venue)) {
        updated = updated.filter((v) => v !== venue);
      } else {
        updated.push(venue);
      }

      setSelectedVenues(updated);
    }
  };

  const toggleDay = (day) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [fromDate, setFromDate] = useState(new Date(currentDate.getFullYear(), currentDate.getMonth(), 11));
  const [toDate, setToDate] = useState(null);

  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();

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
    // console.log('calendarData', calendarData)
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


  const handleClick = (val) => {
    if (val === 'C') {
      setExpression('');
      setResult('');
    } else if (val === '⌫') {
      setExpression((prev) => prev.slice(0, -1));
    } else if (val === '=') {
      try {
        const evalResult = evaluate(expression);
        setResult(evalResult);
      } catch (err) {
        setResult('Error');
      }
    } else {
      setExpression((prev) => prev + val);
    }
  };

  const buttons = [
    ['(', ')', '⌫', 'C'],
    ['7', '8', '9', '/'],
    ['4', '5', '6', '*'],
    ['1', '2', '3', '-'],
    ['0', '.', '=', '+'],
  ];
  const filteredClasses = Array.isArray(findClasses)
    ? findClasses.filter((venue) => {
      const nameMatch =
        !searchVenue ||
        venue.venueName?.toLowerCase().includes(searchVenue.toLowerCase());

      const postcodeMatch =
        !searchPostcode ||
        (venue?.postal_code || "")
          .toLowerCase()
          .includes(searchPostcode.toLowerCase());

      const venueMatch =
        selectedVenues.length === 0 ||
        selectedVenues.includes("All venues") ||
        selectedVenues.includes(venue.venueName);

      // Normalize class list into an array regardless of whether venue.classes is {} or { Saturday: [...], ... }
      const classList = venue.classes && typeof venue.classes === "object"
        ? Object.values(venue.classes).flat()
        : [];

      const dayMatch =
        selectedDays.length === 0 ||
        selectedDays.some((selectedDay) =>
          (venue.classes?.[selectedDay] || []).length > 0
        );

      const availableMatch =
        !showAvailableOnly ||
        classList.some((cls) => cls.capacity > 0);

      // console.log(`🧪 Venue: ${venue.venueName}`);
      // console.log({ nameMatch, postcodeMatch, venueMatch, dayMatch, availableMatch });

      return nameMatch && postcodeMatch && venueMatch && dayMatch && availableMatch;
    })
    : [];




  // console.log('filteredClasses', filteredClasses)
  // console.log('findClasses', findClasses)

  const modalRef = useRef(null);
  const PRef = useRef(null);


  const handleIconClick = (type, venueId, paymentPlans = []) => {
    console.log("🔹 handleIconClick triggered", { type, venueId, paymentPlans });

    switch (type) {
      case "payment":
        console.log("🟢 Opening Payment modal for:", venueId);
        setSelectedPlans(paymentPlans || []);
        setShowModal(prev => {
          const next = prev === venueId ? null : venueId;
          console.log("   ↳ showModal:", next);
          console.log("   ↳ prev:", prev);
          console.log("   ↳ venueId:", venueId);
          return next;
        });
        setShowteamModal(null);
        setOpenMapId(null);
        setActiveCongestionVenueId(null);
        setActiveParkingVenueId(null);
        setNotes(null);
        break;

      case "team":
        console.log("🟡 Opening Team modal for:", venueId);
        setCalendarData(paymentPlans || []);
        setShowteamModal(prev => {
          const next = prev === venueId ? null : venueId;
          console.log("   ↳ showteamModal:", next);
          return next;
        });
        setShowModal(null);
        setOpenMapId(null);
        setActiveCongestionVenueId(null);
        setActiveParkingVenueId(null);
        setNotes(null);
        break;

      case "location":
        console.log("🔵 Opening Location map for:", venueId);
        setOpenMapId(prev => {
          const next = prev === venueId ? null : venueId;
          console.log("   ↳ openMapId:", next);
          return next;
        });
        setShowModal(null);
        setShowteamModal(null);
        setActiveCongestionVenueId(null);
        setActiveParkingVenueId(null);
        setNotes(null);
        break;

      case "congestion":
        console.log("🟠 Showing Congestion Notes for:", venueId);
        setNotes(paymentPlans);
        setActiveCongestionVenueId(prev => {
          const next = prev === venueId ? null : venueId;
          console.log("   ↳ activeCongestionVenueId:", next);
          return next;
        });
        setShowModal(null);
        setShowteamModal(null);
        setOpenMapId(null);
        setActiveParkingVenueId(null);
        break;

      case "parking":
        console.log("🟣 Showing Parking Notes for:", venueId);
        setNotes(paymentPlans);
        setActiveParkingVenueId(prev => {
          const next = prev === venueId ? null : venueId;
          console.log("   ↳ activeParkingVenueId:", next);
          return next;
        });
        setShowModal(null);
        setShowteamModal(null);
        setOpenMapId(null);
        setActiveCongestionVenueId(null);
        break;

      default:
        console.log("⚪ Unknown type:", type);
        break;
    }

    console.log("✅ Completed handleIconClick for", type);
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




  const handleBookFreeTrial = (classId) => {
    navigate('/weekly-classes/find-a-class/book-a-free-trial', {
      state: { classId },
    });
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }, 50);
  };
  const handleAddToWaitingList = (classId) => {
    navigate('/weekly-classes/find-a-class/add-to-waiting-list', {
      state: { classId },
    });
  };
  const handleBookMembership = (classId) => {
    navigate('/weekly-classes/find-a-class/book-a-membership', {
      state: { classId },
    });
  };
  // console.log('calendarData', calendarData)

  const getActiveTerm = () =>
    calendarData.find((term) => {
      const start = new Date(term.startDate);
      const end = new Date(term.endDate);
      return currentDate >= start && currentDate <= end;
    });

  const isExcluded = (date, term) =>
    term?.exclusionDates?.some(
      (ex) => isSameDate(new Date(ex), date)
    );

  const isTermStartOrEnd = (date, term) =>
    isSameDate(date, new Date(term?.startDate)) || isSameDate(date, new Date(term?.endDate));

  const isWithinTerm = (date, term) =>
    date >= new Date(term?.startDate) &&
    date <= new Date(term?.endDate);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };
  const { checkPermission } = usePermission();

  const canBookFreeTrial =
    checkPermission({ module: 'class-schedule', action: 'view-listing' }) &&
    checkPermission({ module: 'book-free-trial', action: 'create' });


  const canBookMembership =
    checkPermission({ module: 'class-schedule', action: 'view-listing' }) &&
    checkPermission({ module: 'book-membership', action: 'create' });

  const canAddToWaitingList =
    checkPermission({ module: 'waiting-list', action: 'create' })
  // console.log('selectedPlans', selectedPlans)
  useEffect(() => {
    const handleClickOutside = (event) => {
      const clickedOutsideIcons = iconContainerRef.current && !iconContainerRef.current.contains(event.target);
      const clickedOutsidePaymentModal = modalRef.current && !modalRef.current.contains(event.target);
      const clickedOutsideParkingModal = PRef.current && !PRef.current.contains(event.target);

      // Close all modals if click is outside icons AND outside any open modal
      if (clickedOutsideIcons && clickedOutsidePaymentModal && clickedOutsideParkingModal) {
        setShowModal(null);
        setShowteamModal(null);
        setOpenMapId(null);
        setActiveCongestionVenueId(null);
        setActiveParkingVenueId(null);
        setNotes(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const weekOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];


  if (loading) {
    return (
      <>
        <Loader />
      </>
    )
  }
  return (
    <div className="pt-1 bg-gray-50 min-h-screen">

      <div className="md:flex w-full gap-4">
        <div>
          {/* Toggle Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-[#0098d9] text-white rounded-xl mb-4"
          >
           
            {isOpen ? "Hide" : "Show"}
          </button>

          <AnimatePresence>
            {isOpen && (
              <motion.div className="md:min-w-[322px] md:max-w-[322px] bg-white p-6 rounded-3xl shadow-sm text-sm space-y-5 transition-all duration-300" initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}>
                {/* Search */}
                <div className="space-y-3">
                  <h2 className="text-[24px] font-semibold">Search by filter</h2>

                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search venue"
                      className="w-full border border-gray-300 rounded-xl px-3 text-[16px] py-3 pl-9 focus:outline-none"
                      value={searchVenue}
                      onChange={(e) => setSearchVenue(e.target.value)}
                    />
                    <FiSearch className="absolute left-3 top-4 text-[20px]" />
                  </div>

                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search by postcode"
                      className="w-full border border-gray-300 text-[16px] rounded-xl px-3 py-3 pl-9 focus:outline-none"
                      value={searchPostcode}
                      onChange={(e) => setSearchPostcode(e.target.value)}
                    />
                    <FiSearch className="absolute left-3 top-4 text-[20px]" />
                  </div>
                </div>

                {/* Venues */}
                <div>
                  <h3 className="text-[20px] font-medium mb-2 border-b border-gray-300 pb-2">
                    Venues
                  </h3>
                  <div className="space-y-2 pt-2">
                    {visibleVenues.map((venue) => (
                      <label key={venue} className="flex text-[16px] items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedVenues.includes(venue)}
                          onChange={() => toggleVenue(venue)}
                          className="accent-blue-600 p-2 text-[20px]"
                        />
                        {venue}
                      </label>
                    ))}

                    {venues.length > 5 && (
                      <button
                        type="button"
                        onClick={() => setShowAll(!showAll)}
                        className="text-blue-600 text-[16px] mt-1"
                      >
                        {showAll ? "Show less" : "Show more"}
                      </button>
                    )}
                  </div>
                </div>

                {/* Days */}
                <div>
                  <h3 className="text-[20px] font-medium mb-2 border-b border-gray-300 pb-2">
                    Days
                  </h3>
                  <div className="space-y-2 pt-2">
                    {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                      <label key={day} className="flex text-[16px] items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedDays.includes(day)}
                          onChange={() => toggleDay(day)}
                          className="accent-blue-600"
                        />
                        {day}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Toggle */}
                <div className="pb-4 border-gray-300 border-b">
                  <Switch.Group as="div" className="flex items-center justify-between">
                    <Switch
                      checked={showAvailableOnly}
                      onChange={setShowAvailableOnly}
                      className={`${showAvailableOnly ? "bg-blue-600" : "bg-gray-300"
                        } relative inline-flex h-6 w-11 items-center rounded-full transition`}
                    >
                      <span
                        className={`${showAvailableOnly ? "translate-x-6" : "translate-x-1"
                          } inline-block h-4 w-4 transform bg-white rounded-full transition`}
                      />
                    </Switch>
                    <Switch.Label className="text-[16px] font-medium">
                      Show venues with availability
                    </Switch.Label>
                  </Switch.Group>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div
          className={`transition-all duration-300 flex-1 `}>
          {
            venues.length > 1 ? (

              <div className={` rounded-4xl w-full`}>
                <div className="space-y-5">
                  {filteredClasses.length === 0 ? (
                    <div className="text-center p-4 text-gray-500">Data not found</div>
                  ) : (
                    filteredClasses.map((venue, idx) => (
                      <div
                        key={idx}
                        className="w-full bg-white rounded-2xl relative p-2 border border-[#D9D9D9] shadow-sm" // ✅ min height
                      >
                        <div className="bg-[#2E2F3E] text-white p-4 rounded-xl flex flex-wrap justify-between md:items-center text-sm gap-4">
                          <div className="flex items-center gap-2 min-w-[250px]">
                            <img src="/demo/synco/icons/Location.png" alt="" />
                            <div className="flex">
                              <span className="font-medium text-[16px] xl:text-[15px] 2xl:text-[16px]">
                                {venue.address}
                                {venue.postal_code && !venue.address.includes(venue.postal_code) && (
                                  <span> PostCode - {venue.postal_code}</span>
                                )}
                              </span>

                            </div>
                          </div>
                         <div ref={iconContainerRef} className=" md:mt-0 mt-5 flex relative items-center gap-4">
                            <img
                              src="/demo/synco/icons/fcDollar.png"
                              onClick={() => handleIconClick('payment', venue.venueId, venue?.paymentGroups[0]?.paymentPlans)} alt=""
                              className={`cursor-pointer w-6 h-6 rounded-full ${showModal === venue.venueId ? 'bg-[#0DD180]' : 'bg-white'}`}
                            />

                            <img
                              src="/demo/synco/icons/fcCalendar.png"
                              onClick={() => handleIconClick('team', venue.venueId, venue.terms)}
                              alt=""
                              className={`cursor-pointer w-6 h-6 rounded-full ${showteamModal === venue.venueId ? 'bg-[#0DD180]' : 'bg-white'}`}
                            />

                            <img
                              src="/demo/synco/icons/fcLocation.png"
                              onClick={() => handleIconClick('location', venue.venueId)}
                              alt=""
                              className={`cursor-pointer w-6 h-6 rounded-full ${openMapId === venue.venueId ? 'bg-[#0DD180]' : 'bg-white'}`}
                            />

                            <img
                              src="/demo/synco/icons/fcCicon.png"
                              onClick={() => handleIconClick('congestion', venue?.venueId, venue?.congestionNote)}
                              alt=""
                              className={`cursor-pointer w-6 h-6 rounded-full ${activeCongestionVenueId === venue.venueId ? 'bg-[#0DD180]' : 'bg-white'}`}
                            />

                            <img
                              src="/demo/synco/icons/fcPIcon.png"
                              onClick={() => handleIconClick('parking', venue?.venueId, venue?.parkingNote)}
                              alt=""
                              className={`cursor-pointer w-6 h-6 rounded-full ${activeParkingVenueId === venue.venueId ? 'bg-[#0DD180]' : 'bg-white'}`}
                            />
                          </div>



                        </div>

                        <div className="p-5 flex flex-col lg:flex-row gap-8  bg-[#FCF9F6] overflow-x-scroll "> {/* ✅ responsive layout */}
                          {/* Meta Info */}
                          <div className="w-full lg:w-3/12 space-y-1 ">
                            <div className='flex gap-5 items-center'>
                              <div>
                                <div className="font-semibold text-[20px] text-black max-w-30 min-w-30  truncate ">{venue.venueName}</div>
                                <div className="whitespace-nowrap font-semibold text-[14px]">
                                  {(venue.distanceMiles / 1609.34).toFixed(2)} miles
                                </div>
                              </div>

                              <div className="">
                                {/* <div className="text-[16px] capitalize font-semibold text-[#384455]">
                                  {Object.keys(venue.classes)
                                    .filter(day => venue.classes[day]?.length)
                                    .join(", ")}
                                </div> */}

                              </div>
                            </div>
                            <div>

                            </div>
                          </div>

                          <div className="w-full parent relative lg:w-9/12 pl-4 border-l border-[#ccc]  space-y-4">
                            {venue.classes && Object.keys(venue.classes).length > 0 ? (
                              Object.entries(venue.classes).map(([day, classList]) => (
                                <div key={day} className="">
                                  <div className="w-full dayssss  text-[16px] capitalize font-semibold text-[#384455]">
                                    {day}
                                  </div>
                                  <div className="whitespace-nowrap facility mt-5 font-semibold text-[14px]">{venue.facility || "N/A"}</div>
                                  {classList.map((s, i) => (
                                    <div
                                      key={s.classId}
                                      className=" w-full flex space-x-2 items-center justify-between space-y-4"
                                    >

                                      <div className='flex space-x-3 items-center justify-between'>
                                        <div className="font-bold text-[16px] text-black whitespace-nowrap">Class {i + 1}</div>

                                        {/* Class Name */}
                                        <div className="font-semibold text-[16px] min-w-25 max-w-25 ">{s.className}</div>

                                        {/* Time */}
                                        <div className="font-semibold text-[16px] whitespace-nowrap flex gap-2 items-center min-w-40">
                                          <img src="/demo/synco/icons/fcTImeIcon.png" alt="" />
                                          {s.time}
                                        </div>

                                        {/* Capacity */}
                                        <div className="text-sm">
                                          {s.capacity === 0 ? (
                                            <span className="text-red-500 whitespace-nowrap bg-red-50 p-2 rounded-xl text-[14px] font-semibold">
                                              Fully booked
                                            </span>
                                          ) : (
                                            <span className="text-green-600 whitespace-nowrap bg-green-50 p-2 rounded-xl text-[14px] font-semibold">
                                              +{s.capacity} spaces
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                      {/* Action Buttons */}
                                      <div className="flex gap-2 flex-wrap  md:justify-end">
                                        {s.capacity === 0 && canAddToWaitingList ? (
                                          <button
                                            onClick={() => handleAddToWaitingList(s.classId)}
                                            className="bg-[#237FEA] text-white border border-[#237FEA] px-3 py-1 rounded-xl text-sm font-medium"
                                          >
                                            Add to Waiting List
                                          </button>
                                        ) : (
                                          <>
                                            {s.allowFreeTrial && canBookFreeTrial && (
                                              <button
                                                onClick={() => handleBookFreeTrial(s.classId)}
                                                className="font-semibold whitespace-nowrap border border-[#BEBEBE] px-3 py-1 rounded-xl text-[14px] font-medium"
                                              >
                                                Book a FREE Trial
                                              </button>
                                            )}
                                            {canBookMembership && (
                                              <button
                                                onClick={() => handleBookMembership(s.classId)}
                                                className="font-semibold whitespace-nowrap border border-[#BEBEBE] px-3 py-1 rounded-xl text-[14px] font-medium"
                                              >
                                                Book a Membership
                                              </button>
                                            )}
                                          </>
                                        )}
                                      </div>
                                    </div>
                                  ))}


                                </div>
                              ))
                            ) : (
                              <div className="text-center text-gray-500 font-medium py-8">No classes available for this venue</div>
                            )}
                          </div>

                          {activeCongestionVenueId === venue.venueId && (
                            <div ref={iconContainerRef} className="absolute right-2 z-10 mt-2">
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

                          {activeParkingVenueId === venue.venueId && (
                            <div ref={iconContainerRef} className="absolute right-2 z-10 mt-2">
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
                          {showteamModal === venue.venueId && (
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
                                <div ref={(el) => (modalRefs.current[venue.venueId] = el)} className="flex justify-between items-center border-b border-[#E2E1E5] pb-4 mb-4">
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

                        </div>
                        {showModal === venue.venueId && (
                          <div className=" absolute bg-opacity-30 flex right-2 items-center top-15 justify-center z-50">
                            <div ref={(el) => (modalRefs.current[venue.venueId] = el)} className="flex items-center justify-center w-full px-2 py-6 sm:px-2 md:py-2">
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
                        {openMapId === venue.venueId && (
                          <div ref={iconContainerRef}>
                            <div
                              ref={(el) => (modalRefs.current[venue.venueId] = el)}
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
                  )}
                </div>

              </div>
            ) : (
              <p className='text-center  p-4 border-dotted border rounded-md'>No Data Found</p>
            )
          }
        </div>



      </div>


    </div>
  );
};

export default List;




//  <div   ref={modalRef}  className="absolute  bg-opacity-30 min-w-[489px] flex right-8 mt-16 items-center justify-center z-50">

//     <div className="max-w-full mx-auto  min-w-[409px]  p-6 bg-white rounded-2xl shadow-2xl">
//       <div className="text-right bg-gray-100 p-4 rounded-lg mb-4 min-h-[80px]">
//         <div className="text-gray-600 text-md break-words">{expression || '0'}</div>
//         <div className="text-blue-600 font-bold text-2xl">{result !== '' && `= ${result}`}</div>
//       </div>

//       <div className="grid grid-cols-4 gap-3">
//         {buttons.flat().map((btn) => (
//           <button
//             key={btn}
//             onClick={() => handleClick(btn)}
//             className={`
//       py-3 rounded-xl text-lg font-semibold shadow
//       ${btn === '='
//                 ? 'bg-blue-600 text-white'
//                 : btn === 'C'
//                   ? 'bg-red-100 text-red-700'
//                   : btn === '⌫'
//                     ? 'bg-yellow-100 text-yellow-700'
//                     : 'bg-white hover:bg-gray-100 text-gray-800'
//               }
//     `}
//           >
//             {btn}
//           </button>
//         ))}
//       </div>
//     </div>
//   </div>