import React, { useEffect, useRef, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { Check } from "lucide-react";
import Loader from '../../contexts/Loader';
import { Switch } from "@headlessui/react";
import { FiSearch } from "react-icons/fi";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { evaluate } from 'mathjs';
import { Info } from "lucide-react"; // or use a custom icon if needed
import { useFindClass } from '../../contexts/FindClassContext';
import { FiMapPin } from "react-icons/fi";
import { FaFacebookF, FaInstagram, FaWhatsapp, FaPinterestP } from "react-icons/fa";
import PlanTabs from './PlanTabs';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
const List = () => {
  const { fetchFindClasses, findClasses } = useFindClass();
  const [openMapId, setOpenMapId] = useState(null);

  useEffect(() => {
    fetchFindClasses()
  }, [fetchFindClasses]);
  const iconContainerRef = useRef(null);

  const [activeParkingVenueId, setActiveParkingVenueId] = useState(null);
  const [notes, setNotes] = useState(null);
  const [activeCongestionVenueId, setActiveCongestionVenueId] = useState(null);
  const [showteamModal, setShowteamModal] = useState(null);
  const [showModal, setShowModal] = useState(null);

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
  console.log('selectedPlans', selectedPlans)
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
  const [selectedDays, setSelectedDays] = useState(["Sunday"]);
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
  const sessionData = [
    {
      id: 1,
      name: "The King Fahad Academy",
      address: "East Acton Lane, London W3 7HD",
      venueName: "Acton",
      distanceMiles: "2 miles",
      day: "Saturday",
      surface: "Outdoor",
      classes: [
        {
          className: "Class 1",
          age: "4–7 years",
          time: "9:30am - 10:30am",
          capacity: "Fully booked",
        },
        {
          className: "Class 2",
          age: "8–12 years",
          time: "10:30am - 11:30am",
          capacity: "Available",
          spaces: 4,
        },
      ],
    },
    {
      id: 2,
      name: "The King Fahad Academy",
      address: "East Acton Lane, London W3 7HD",
      venueName: "Acton",
      distanceMiles: "2 miles",
      day: "Saturday",
      surface: "Outdoor",
      classes: [
        {
          className: "Class 1",
          age: "4–7 years",
          time: "9:30am - 10:30am",
          capacity: "Fully booked",
        },
        {
          className: "Class 2",
          age: "8–12 years",
          time: "10:30am - 11:30am",
          capacity: "Available",
          spaces: 4,
        },
      ],
    },
    {
      id: 3,
      name: "The King Fahad Academy",
      address: "East Acton Lane, London W3 7HD",
      venueName: "Acton",
      distanceMiles: "2 miles",
      day: "Saturday",
      surface: "Outdoor",
      classes: [
        {
          className: "Class 1",
          age: "4–7 years",
          time: "9:30am - 10:30am",
          capacity: "Fully booked",
        },
        {
          className: "Class 2",
          age: "8–12 years",
          time: "10:30am - 11:30am",
          capacity: "Available",
          spaces: 4,
        },
      ],
    },
    // Add more venue cards as needed
  ];





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

  const isSameDate = (d1, d2) =>
    d1 &&
    d2 &&
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
        !searchVenue || venue.venueName?.toLowerCase().includes(searchVenue.toLowerCase());

      const postcodeMatch =
        !searchPostcode || (venue?.postal_code || "").toLowerCase().includes(searchPostcode.toLowerCase());

      // Only apply venue filter when availability switch is ON
      const venueMatch =
        !showAvailableOnly ||
        selectedVenues.length === 0 ||
        selectedVenues.includes("All venues") ||
        selectedVenues.includes(venue.venueName);

      // Only apply day filter when availability switch is ON
      const dayMatch =
        !showAvailableOnly ||
        selectedDays.length === 0 ||
        selectedDays.some((selectedDay) =>
          (venue.classes || []).some((cls) => cls.day === selectedDay)
        );

      const availableMatch =
        !showAvailableOnly || (venue.classes || []).some((cls) => cls.capacity > 0);

      console.log(`🧪 Venue: ${venue.venueName}`);
      console.log({ nameMatch, postcodeMatch, venueMatch, dayMatch, availableMatch });

      return nameMatch && postcodeMatch && venueMatch && dayMatch && availableMatch;
    })
    : [];



  console.log('filteredClasses', filteredClasses)
  console.log('findClasses', findClasses)

  const modalRef = useRef(null);
  const PRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setActiveCongestionVenueId(false); // Close modal
      }
    };

    if (activeCongestionVenueId) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [activeCongestionVenueId]);
  useEffect(() => {
    const handleOutsideClickP = (event) => {
      if (PRef.current && !PRef.current.contains(event.target)) {
        setActiveParkingVenueId(false); // Close modal(false); // Close modal
      }
    };

    if (activeParkingVenueId) {
      document.addEventListener("mousedown", handleOutsideClickP);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClickP);
    };
  }, [activeParkingVenueId]);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (iconContainerRef.current && !iconContainerRef.current.contains(event.target)) {
        // Clicked outside
        setShowModal(null);
        setShowteamModal(null);
        setOpenMapId(null);
        setActiveCongestionVenueId(null);
        setActiveParkingVenueId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const handleIconClick = (type, venueId, paymentPlans = []) => {
    setNotes(null);
    setShowModal(null);
    setShowteamModal(null);
    setOpenMapId(null);
    setActiveCongestionVenueId(null);
    setActiveParkingVenueId(null);

    // Apply active toggle
    switch (type) {
      case 'payment':
        setSelectedPlans(paymentPlans || []);
        setShowModal(prev => (prev === venueId ? null : venueId));
        break;
      case 'team':
        setShowteamModal(prev => (prev === venueId ? null : venueId));
        break;
      case 'location':
        setOpenMapId(prev => (prev === venueId ? null : venueId));
        break;
      case 'congestion':
        setNotes(paymentPlans);
        setActiveCongestionVenueId(prev => (prev === venueId ? null : venueId));
        break;
      case 'parking':
        setNotes(paymentPlans);
        setActiveParkingVenueId(prev => (prev === venueId ? null : venueId));
        break;
      default:
        break;
    }
  };

  console.log('filteredClasses', filteredClasses)
  return (
    <div className="pt-1 bg-gray-50 min-h-screen">

      <div className="md:flex w-full gap-4">

        <div className="md:min-w-[322px] md:max-w-[322px] bg-white p-6 rounded-3xl shadow-sm text-sm space-y-5">
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
            <h3 className="text-[20px] font-medium mb-2 border-b border-gray-300 pb-2 text-semibold">Venues</h3>
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
              )}            </div>
          </div>

          {/* Days */}
          <div>
            <h3 className="text-[20px] font-medium mb-2 border-b border-gray-300 pb-2 text-semibold">Days</h3>
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
                className={`${showAvailableOnly ? "bg-blue-600" : "bg-gray-300"}
        relative inline-flex h-6 w-11 items-center rounded-full transition`}
              >
                <span
                  className={`${showAvailableOnly ? "translate-x-6" : "translate-x-1"}
          inline-block h-4 w-4 transform bg-white rounded-full transition`}
                />
              </Switch>
              <Switch.Label className="text-[16px] text-semibold">
                Show venues with availability
              </Switch.Label>
            </Switch.Group>
          </div>

        </div>
        <div
          className={`transition-all duration-300 flex-1 bg-white`}>
          {
            venues.length > 1 ? (

              <div className={` rounded-4xl w-full`}>
                <div className="space-y-5">
                  {filteredClasses.map((venue, idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl relative p-2 border border-[#D9D9D9] shadow-sm bg-white " // ✅ min height
                    >
                      <div className="bg-[#2E2F3E] text-white p-4 rounded-xl flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <img src="/demo/synco/icons/Location.png" alt="" />
                          <span className="font-medium text-[16px]">{venue.address}</span>
                        </div>
                        <div ref={iconContainerRef} className="flex relative items-center gap-4">
                          <img
                            src="/demo/synco/icons/fcDollar.png"
                            onClick={() => handleIconClick('payment', venue.venueId, venue?.paymentPlans)}
                            alt=""
                            className={`cursor-pointer w-6 h-6 rounded-full ${showModal === venue.venueId ? 'bg-[#0DD180]' : 'bg-white'}`}
                          />

                          <img
                            src="/demo/synco/icons/fcCalendar.png"
                            onClick={() => handleIconClick('team', venue.venueId)}
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

                      <div className="flex items-center bg-[#FCF9F6] flex-col lg:flex-row"> {/* ✅ responsive layout */}
                        {/* Meta Info */}
                        <div className="flex items-start  w-1/12 text-sm text-[#555] px-4 py-2  border-b lg:border-b-0 my-6 border-gray-300 min-w-[250px]">
                          <div>
                            <div className="font-semibold text-[20px] text-black">{venue.venueName}</div>
                            <div className="whitespace-nowrap font-semibold text-[14px]">
                              {(venue.distanceMiles / 1609.34).toFixed(2)} miles
                            </div>
                          </div>
                          <div>
                      
                          </div>
                        </div>

                        {/* Classes */}
                        <div className="px-4  w-11/12 py-2 flex-1 space-y-6">
                          {venue.classes && Object.keys(venue.classes).length > 0 ? (
                            Object.entries(venue.classes).map(([day, classList]) => (
                              <div key={day} className="flex gap-6 items-center ">
                                <div className="block border-r pr-3 border-[#b6b2ad] ">
                                <div className="text-[16px] font-semibold text-[#384455]">{day}</div>
                                <div className="whitespace-nowrap font-semibold text-[14px]">{venue.facility || "N/A"}</div>
</div>
                                <div className="flex flex-col w-full space-y-4">
                                  {classList.map((s, i) => (
                                    <div
                                      key={s.classId}
                                      className="grid grid-cols-7 items-center text-sm min-h-[60px]"
                                    >
                                      <div className="font-bold text-[16px] text-black">Class {i + 1}</div>
                                      <div className="font-semibold text-[16px]">{s.className}</div>
                                      <div className="font-semibold text-[16px] flex gap-2 items-center col-span-2">
                                        <img src="/demo/synco/icons/fcTImeIcon.png" alt="" />{s.time}
                                      </div>

                                      {/* Capacity */}
                                      <div className="text-sm">
                                        {s.capacity === 0 ? (
                                          <span className="text-red-500 bg-red-50 p-2 rounded-xl text-[14px] font-semibold">
                                            Fully booked
                                          </span>
                                        ) : (
                                          <span className="text-green-600 bg-green-50 p-2 rounded-xl text-[14px] font-semibold">
                                            +{s.capacity} spaces
                                          </span>
                                        )}
                                      </div>

                                      {/* Action Buttons */}
                                      <div className="flex gap-2 col-span-2 flex-wrap justify-end">
                                        {s.capacity === 0 ? (
                                          <button className="bg-[#237FEA] text-white border border-[#237FEA] px-3 py-1 rounded-xl text-sm font-medium">
                                            Add to Waiting List
                                          </button>
                                        ) : (
                                          <>
                                            {s.allowFreeTrial && (
                                              <button className="font-semibold whitespace-nowrap border border-[#BEBEBE] px-3 py-1 rounded-xl text-[14px] font-medium">
                                                Book a FREE Trial
                                              </button>
                                            )}
                                            <button className="font-semibold whitespace-nowrap border border-[#BEBEBE] px-3 py-1 rounded-xl text-[14px] font-medium">
                                              Book a Membership
                                            </button>
                                          </>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
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
                          <div ref={iconContainerRef} className="absolute bg-opacity-30 min-w-[489px] flex right-2 items-center justify-center z-50">
                            <div className="bg-white rounded-3xl w-full max-w-md sm:max-w-lg p-4 sm:p-6 shadow-2xl">
                              {/* Header */}
                              <div className="flex justify-between items-center border-b border-[#E2E1E5] pb-4 mb-4">
                                <h2 className="text-[24px]  font-semibold">Team Dates</h2>
                                <button onClick={() => setShowteamModal(null)}>
                                  <img src="/demo/synco/icons/cross.png" alt="close" className="w-4 h-4" />
                                </button>
                              </div>

                              {/* Term List */}
                              <div className="space-y-6 text-center text-[13px] sm:text-[14px] text-[#2E2F3E] font-medium">
                                <div>
                                  <h3 className="text-[20px]  font-semibold mb-1">Autumn Term 2022</h3>
                                  <p className="text-[18px]">Sun 11th Sep 2022 - Sun 04th Dec 2022</p>
                                  <p className="text-[18px]">Half term Exclusion: Sun 23rd Oct 2022</p>
                                </div>
                                <div>
                                  <h3 className="text-[20px] font-semibold mb-1">Spring Term 2022</h3>
                                  <p className="text-[18px]"> Sun 11th Sep 2022 - Sun 04th Dec 2022</p>
                                  <p className="text-[18px]">Half term Exclusion: Sun 23rd Oct 2022</p>
                                </div>
                                <div>
                                  <h3 className="text-[20px] font-semibold mb-1">Summer Term 2022</h3>
                                  <p className="text-[18px]">Sun 11th Sep 2022 - Sun 04th Dec 2022</p>
                                  <p className="text-[18px]">Half term Exclusion: Sun 23rd Oct 2022</p>
                                </div>
                              </div>

                              {/* Calendar Section */}
                              <div className="rounded p-4 mt-6 text-center text-sm w-full max-w-md mx-auto">
                                {/* Header */}
                                <div className="flex justify-around items-center mb-3">
                                  <button
                                    onClick={goToPreviousMonth}
                                    className="w-8 h-8 rounded-full bg-white text-black hover:bg-black hover:text-white border border-black flex items-center justify-center"
                                  >
                                    <ChevronLeft className="w-5 h-5" />
                                  </button>
                                  <p className="font-semibold text-[20px]">
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
                                <div className="grid grid-cols-7 text-xs gap-1 text-[18px] text-gray-500 mb-1">
                                  {["M", "T", "W", "T", "F", "S", "S"].map((day) => (
                                    <div key={day} className="font-medium text-center">
                                      {day}
                                    </div>
                                  ))}
                                </div>

                                {/* Calendar Weeks */}
                                <div className="flex flex-col  gap-1">
                                  {Array.from({ length: Math.ceil(calendarDays.length / 7) }).map((_, weekIndex) => {
                                    const week = calendarDays.slice(weekIndex * 7, weekIndex * 7 + 7);

                                    // Check if any date in this week is in range
                                    const highlightRow = week.some((date) => isInRange(date));

                                    return (
                                      <div
                                        key={weekIndex}
                                        className={`grid grid-cols-7 text-[18px] gap-1 py-1 rounded ${highlightRow ? "bg-sky-100" : ""
                                          }`}
                                      >
                                        {week.map((date, i) => {
                                          const isFrom = isSameDate(date, fromDate);
                                          const isTo = isSameDate(date, toDate);

                                          return (
                                            <div
                                              key={i}
                                              onClick={() => date && handleDateClick(date)}
                                              className={`w-8 h-8 flex text-[18px] items-center justify-center mx-auto text-sm rounded-full cursor-pointer
                      ${isFrom || isTo
                                                  ? "bg-blue-600 text-white font-bold"
                                                  : "text-gray-800"
                                                }
                    `}
                                            >
                                              {date ? date.getDate() : ""}
                                            </div>
                                          );
                                        })}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          </div>

                        )}
                        {showModal === venue.venueId && (
                          <div ref={iconContainerRef} className=" absolute bg-opacity-30 flex right-2 items-center justify-center z-50">
                            <div className="flex items-center justify-center w-full px-2 py-6 sm:px-2 md:py-2">
                              <div className="bg-white rounded-3xl p-4 sm:p-6 w-full max-w-4xl shadow-2xl">
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
                      </div>
                      {openMapId === venue.venueId && (
                        <div ref={iconContainerRef} className="mt-4 h-[450px] w-full rounded-lg overflow-hidden">
                          <MapContainer
                            center={[venue.latitude, venue.longitude]}
                            zoom={13}
                            scrollWheelZoom={false}
                            zoomControl={false} // 🚫 disable top-left controls
                            style={{ height: '100%', width: '100%' }}
                          >
                            <TileLayer
                              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            />
                            <Marker position={[venue.latitude, venue.longitude]} icon={customIcon}>
                              <Popup>
                                <strong>{venue.venueName}</strong><br />
                                {venue.address}
                              </Popup>
                            </Marker>

                            <ZoomControl position="bottomright" /> {/* ✅ This puts it where you want */}
                          </MapContainer>
                        </div>
                      )}

                    </div>

                  ))}

                </div>

              </div>
            ) : (
              <p className='text-center  p-4 border-dotted border rounded-md'>No Members Found</p>
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