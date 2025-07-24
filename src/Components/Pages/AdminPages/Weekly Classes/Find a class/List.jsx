import React, { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { Check } from "lucide-react";
import Loader from '../../contexts/Loader';
import { Switch } from "@headlessui/react";
import { FiSearch } from "react-icons/fi";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { FiMapPin } from "react-icons/fi";
import { FaFacebookF, FaInstagram, FaWhatsapp, FaPinterestP } from "react-icons/fa";
const List = () => {
  const [showModal, setShowModal] = useState(false);
  const [showteamModal, setShowteamModal] = useState(false);

  const [clickedIcon, setClickedIcon] = useState(null);
  const handleIconClick = () => {
    setClickedIcon(icon);
    setShowModal(true);
  };
  const venues = ["All venues", "Acton", "Chelsea", "Kensington", "London"];


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
  const [showAvailableOnly, setShowAvailableOnly] = useState(true);

  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

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
      id:1,
      name: "The King Fahad Academy",
      address: "East Acton Lane, London W3 7HD",
      location: "Acton",
      distance: "2 miles",
      day: "Saturday",
      surface: "Outdoor",
      sessions: [
        {
          name: "Class 1",
          age: "4–7 years",
          time: "9:30am - 10:30am",
          status: "Fully booked",
        },
        {
          name: "Class 2",
          age: "8–12 years",
          time: "10:30am - 11:30am",
          status: "Available",
          spaces: 4,
        },
      ],
    },
    {
      id:2,
      name: "The King Fahad Academy",
      address: "East Acton Lane, London W3 7HD",
      location: "Acton",
      distance: "2 miles",
      day: "Saturday",
      surface: "Outdoor",
      sessions: [
        {
          name: "Class 1",
          age: "4–7 years",
          time: "9:30am - 10:30am",
          status: "Fully booked",
        },
        {
          name: "Class 2",
          age: "8–12 years",
          time: "10:30am - 11:30am",
          status: "Available",
          spaces: 4,
        },
      ],
    },
    {
      id:3,
      name: "The King Fahad Academy",
      address: "East Acton Lane, London W3 7HD",
      location: "Acton",
      distance: "2 miles",
      day: "Saturday",
      surface: "Outdoor",
      sessions: [
        {
          name: "Class 1",
          age: "4–7 years",
          time: "9:30am - 10:30am",
          status: "Fully booked",
        },
        {
          name: "Class 2",
          age: "8–12 years",
          time: "10:30am - 11:30am",
          status: "Available",
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
  return (
    <div className="pt-1 bg-gray-50 min-h-screen">

      <div className="md:flex gap-4">

        <div className="md:w-3/12  bg-white p-6 rounded-3xl shadow-sm text-sm space-y-5">
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
              {venues.map((venue) => (
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
              <button className="text-blue-600 text-[16px] mt-1">Show more</button>
            </div>
          </div>

          {/* Days */}
          <div>
            <h3 className="text-[20px] font-medium mb-2 border-b border-gray-300 pb-2 text-semibold">Days</h3>
            <div className="space-y-2 pt-2">
              {days.map((day) => (
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
          <div className=" pb-4 border-gray-300 border-b">
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
              <Switch.Label className="text-[16px] text-semibold">Show venues with availability</Switch.Label>
            </Switch.Group>
          </div>
        </div>
        <div
          className={`transition-all duration-300  md:w-9/12 `}>
          {
            venues.length > 0 ? (

              <div className={`overflow-auto rounded-4xl w-full`}>
                <div className="space-y-5">
                  {sessionData.map((venue, idx) => (
                    <div key={idx} className="rounded-2xl relative  p-2 border border-[#D9D9D9] overflow-hidden shadow-sm bg-white">
                      <div className="bg-[#2E2F3E] text-white p-4 rounded-xl flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <img src="/demo/synco/icons/Location.png" alt="" />
                          <span className="font-medium text-[16px]">
                            {venue.name}, {venue.address}
                          </span>
                        </div>
                        <div className="flex relative items-center gap-4 ">
                          <img src="/demo/synco/icons/fcDollar.png" onClick={() => setShowModal(true)} alt="" />

                          <img src="/demo/synco/icons/fcCalendar.png" onClick={() => setShowteamModal(true)} alt="" />
                          <img src="/demo/synco/icons/fcLocation.png" onClick={() => setShowModal(true)} alt="" />
                          <img src="/demo/synco/icons/fcCicon.png" onClick={() => setShowModal(true)} alt="" />
                          <img src="/demo/synco/icons/fcPIcon.png" onClick={() => setShowModal(true)} alt="" />
                        </div>


                      </div>
                      <div className="flex bg-[#FCF9F6]">
                        {/* Meta Info */}
                        <div className="flex items-center gap-4 text-sm text-[#555] px-4 py-2 border-r my-6 border-gray-300">
                          <div >
                            <div className="font-semibold text-[20px] text-black">{venue.location}</div>
                            <div className="whitespace-nowrap font-semibold  text-[14px]">{venue.distance}</div>
                          </div>
                          <div>
                            <div className="text-[#384455] text-[16px] font-semibold">{venue.day}</div>
                            <div className="whitespace-nowrap font-semibold  text-[14px]" >{venue.surface}</div>
                          </div>
                        </div>

                        {/* Sessions */}
                        <div className=" px-4 py-2 ">
                          {venue.sessions.map((s, i) => (
                            <div key={i} className="grid grid-cols-7 items-center pt-3 text-sm">
                              <div className="font-bold text-[16px] text-black">{s.name}</div>
                              <div className="font-semibold text-[16px] ">{s.age}</div>
                              <div className=" font-semibold text-[16px] flex gap-2 items-center col-span-2"> <img src="/demo/synco/icons/fcTImeIcon.png" alt="" />{s.time}</div>

                              {/* Status */}
                              <div className="text-sm">
                                {s.status === "Fully booked" ? (
                                  <span className="text-red-500 bg-red-50 p-2 rounded-xl text-[14px] font-semibold">Fully booked</span>
                                ) : (
                                  <span className="text-green-600 bg-green-50 p-2 rounded-xl text-[14px]  font-semibold">+{s.spaces} spaces</span>
                                )}
                              </div>

                              {/* Action Buttons */}
                              <div className="flex gap-2 col-span-2 flex-wrap justify-end">
                                {s.status === "Fully booked" ? (
                                  <button className="bg-[#237FEA] text-white border border-[#237FEA] px-3 py-1 rounded-xl text-sm font-medium">
                                    Add to Waiting List
                                  </button>
                                ) : (
                                  <>
                                    <button className=" font-semibold whitespace-nowrap border border-[#BEBEBE] px-3 py-1 rounded-xl text-[14px] font-medium">
                                      Book a FREE Trial
                                    </button>
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
                    </div>
                  ))}
                </div>

              </div>
            ) : (
              <p className='text-center  p-4 border-dotted border rounded-md'>No Members Found</p>
            )
          }
        </div>
        {showModal && (
          <div className="absolute bg-opacity-30 flex right-2.5 mt-8 items-center justify-center z-50">
            <div className="flex items-center justify-center w-full px-4 py-6 sm:px-6 md:py-10">
              <div className="bg-white rounded-3xl p-4 sm:p-6 w-full max-w-4xl shadow-2xl">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#E2E1E5] pb-4 mb-4 gap-2">
                  <h2 className="font-semibold text-[20px] sm:text-[24px]">Payment Plan Preview</h2>
                  <button className="text-gray-400 hover:text-black text-xl font-bold">
                    <img src="/demo/synco/icons/cross.png" onClick={() => setShowModal(false)} alt="close" className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex justify-center mb-6">
                  <div className="inline-flex rounded-2xl border border-gray-300 bg-white p-1">
                    <button className="px-8 py-3 text-[16px] font-medium rounded-xl bg-[#237FEA] text-white shadow transition">
                      1 Student
                    </button>
                    <button className="px-8 py-3 text-[16px] font-medium rounded-xl text-gray-700 hover:bg-gray-100 transition">
                      2 Student
                    </button>
                    <button className="px-8 py-3 text-[16px] font-medium rounded-xl text-gray-700 hover:bg-gray-100 transition">
                      3 Student
                    </button>
                  </div>
                </div>
                {/* Plans Grid */}
                <div className="grid pt-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {/* Plan 1 */}


                  <div className="border border-[#E2E1E5] rounded-xl p-4 sm:p-5 flex flex-col justify-between transition">
                    <h3 className="text-[18px] sm:text-[20px] font-semibold mb-2">1 Student</h3>
                    <p className="text-[24px] sm:text-[32px] font-semibold mb-4">£99</p>
                    <hr className="mb-4 text-[#E2E1E5]" />
                    <ul className="space-y-2 text-[14px] sm:text-[16px] font-semibold pb-10">
                      <li className="flex items-center py-2 gap-2">
                        <img src="/demo/synco/icons/tick-circle.png" alt="" className="w-5 h-5" />
                        3 Months
                      </li>
                      <li className="flex items-center py-2 pb-2 sm:pb-4 gap-2">
                        <img src="/demo/synco/icons/tick-circle.png" alt="" className="w-5 h-5" />
                        Free Holiday Camp Bag
                      </li>
                    </ul>
                    <button className="px-8 py-3 text-[16px] font-medium rounded-xl bg-[#237FEA] text-white shadow transition">
                      £35 Joining Fee
                    </button>
                  </div>

                  {/* Plan 2 */}
                  <div className="border border-[#E2E1E5] rounded-xl p-4 sm:p-5 flex flex-col justify-between transition">
                    <h3 className="text-[18px] sm:text-[20px] font-semibold mb-2">2 Students</h3>
                    <p className="text-[24px] sm:text-[32px] font-semibold mb-4">£179</p>
                    <hr className="mb-4 text-[#E2E1E5]" />
                    <ul className="space-y-2 text-[14px] sm:text-[16px] pb-10 font-semibold">
                      <li className="flex items-center py-2 gap-2">
                        <img src="/demo/synco/icons/tick-circle.png" alt="" className="w-5 h-5" />
                        3 Months
                      </li>
                      <li className="flex items-center py-2 pb-2 sm:pb-4 gap-2">
                        <img src="/demo/synco/icons/tick-circle.png" alt="" className="w-5 h-5" />
                        Free Holiday Camp Bag
                      </li>
                    </ul>
                    <button className="px-8 py-3 text-[16px] font-medium rounded-xl bg-[#237FEA] text-white shadow transition">
                      £35 Joining Fee
                    </button>
                  </div>

                  {/* Plan 3 */}
                  <div className="border border-[#E2E1E5] rounded-xl p-4 sm:p-5 flex flex-col justify-between transition">
                    <h3 className="text-[18px] sm:text-[20px] font-semibold mb-2">3 Students</h3>
                    <p className="text-[24px] sm:text-[32px] font-semibold mb-4">£249</p>
                    <hr className="mb-4 text-[#E2E1E5]" />
                    <ul className="space-y-2 text-[14px] pb-10 sm:text-[16px] font-semibold">
                      <li className="flex items-center py-2 gap-2">
                        <img src="/demo/synco/icons/tick-circle.png" alt="" className="w-5 h-5" />
                        3 Months
                      </li>
                      <li className="flex items-center py-2 pb-2 sm:pb-4 gap-2">
                        <img src="/demo/synco/icons/tick-circle.png" alt="" className="w-5 h-5" />
                        Free Holiday Camp Bag
                      </li>
                    </ul>
                    <button className="px-8 py-3 text-[16px] font-medium rounded-xl bg-[#237FEA] text-white shadow transition">
                      £35 Joining Fee
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {showteamModal && (
          <div className="absolute bg-opacity-30 min-w-[489px] flex right-8 mt-16 items-center justify-center z-50">
            <div className="bg-white rounded-3xl w-full max-w-md sm:max-w-lg p-4 sm:p-6 shadow-2xl">
              {/* Header */}
              <div className="flex justify-between items-center border-b border-[#E2E1E5] pb-4 mb-4">
                <h2 className="text-[24px]  font-semibold">Team Dates</h2>
                <button onClick={() => setShowteamModal(false)}>
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
      </div>



    </div>
  );
};

export default List;
