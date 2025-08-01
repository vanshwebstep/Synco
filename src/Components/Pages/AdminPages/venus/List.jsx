import React, { useEffect, useRef, useState } from 'react';
import Create from './Create';
import { useNavigate } from 'react-router-dom';
import { Check } from "lucide-react";
import Loader from '../contexts/Loader';
import { useVenue } from '../contexts/VenueContext';
import { usePayments } from '../contexts/PaymentPlanContext';
import { useTermContext } from '../contexts/termDatesSessionContext';
import Swal from "sweetalert2"; // make sure it's installed
import PlanTabs from '../Weekly Classes/Find a class/PlanTabs';
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, parseISO } from "date-fns";
const List = () => {
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [selectedPlans, setSelectedPlans] = useState([]);
  const [congestionNote, setCongestionNote] = useState(null);

  const [clickedIcon, setClickedIcon] = useState(null);
  const handleIconClick = (icon, plan = null) => {
    setClickedIcon(icon);
    setCongestionNote(null)
    if (icon === 'currency') {
      setSelectedPlans(plan || []); // default to empty array
    }
    else if (icon == 'group') {
      setCongestionNote(plan)
    }
    else if (icon == 'p') {
      setCongestionNote(plan)
    }
    else if (icon == 'calendar') {
      setCongestionNote(plan)
    }
    setShowModal(true);
  };


  const { fetchPackages, packages } = usePayments()
  const { fetchTermGroup, termGroup } = useTermContext()

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const { venues, formData, setFormData, isEditVenue, setIsEditVenue, deleteVenue, fetchVenues, loading } = useVenue()
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


  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This action will permanently delete the venue.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        console.log('DeleteId:', id);

        deleteVenue(id); // Call your delete function here

      }
    });
  };

  const [openForm, setOpenForm] = useState(false);

  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  useEffect(() => {
    fetchVenues();
    fetchPackages();
    fetchTermGroup();
  }, [fetchVenues, fetchPackages, fetchTermGroup]);

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
  const modalRef = useRef(null);
  const PRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(event) {
      const activeRef = clickedIcon === "group" ? modalRef : PRef;

      if (
        activeRef.current &&
        !activeRef.current.contains(event.target)
      ) {
        setShowModal(false); // Close the modal
      }
    }

    if (showModal) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showModal, clickedIcon, setShowModal]);

  if (loading) {
    return (
      <>
        <Loader />
      </>
    )
  }
const allTermRanges = Array.isArray(congestionNote)
  ? congestionNote.flatMap(group =>
      group.terms.map(term => ({
        start: new Date(term.startDate),
        end: new Date(term.endDate),
        exclusions: (Array.isArray(term.exclusionDates)
          ? term.exclusionDates
          : JSON.parse(term.exclusionDates || '[]')
        ).map(date => new Date(date)),
      }))
    )
  : [];
 // or `null`, `undefined`, or any fallback value

  // Usage inside calendar cell:
  const isInRange = (date) => {
    return allTermRanges.some(({ start, end }) =>
      date >= start && date <= end
    );
  };

  const isExcluded = (date) => {
    return allTermRanges.some(({ exclusions }) =>
      exclusions.some(ex => ex.toDateString() === date?.toDateString())
    );
  };

  console.log('congestionNote', congestionNote)
  return (
    <div className="pt-1 bg-gray-50 min-h-screen">
      <div className={`flex pe-4 justify-between items-center mb-4 ${openForm ? 'md:w-3/4' : 'w-full'}`}>
        <h2 className="text-[28px] font-semibold">Venues</h2>
        <button
          onClick={() => setOpenForm(true)}
          className="bg-[#237FEA] flex items-center gap-2 cursor-pointer text-white px-4 py-[10px] rounded-xl hover:bg-blue-700 text-[16px] font-semibold"
        >
          <div className="flex items-center gap-2">
            <img src="/demo/synco/members/add.png" className="w-5" alt="" />
            <span>Add New Venue</span>
          </div>
        </button>
      </div>

      <div className="md:flex gap-6">
        <div
          className={`transition-all duration-300 ${openForm ? 'md:w-3/4' : 'w-full'} `}>
          {
            venues.length > 0 ? (

              <div className={`overflow-auto rounded-4xl w-full`}>

                <table className="min-w-full rounded-4xl  bg-white text-sm border border-[#E2E1E5]">
                  <thead className="bg-[#F5F5F5] text-left border-1 border-[#EFEEF2]">
                    <tr className="font-semibold ">
                      <th className="p-4 text-[#717073]">
                        <div className="flex gap-2 items-center">
                          <button
                            onClick={toggleSelectAll}
                            className="w-5 h-5 flex items-center justify-center rounded-md border-2 border-gray-500 focus:outline-none"
                          >
                            {isAllSelected && <Check size={16} strokeWidth={3} className="text-gray-500" />}
                          </button>
                          Area
                        </div>
                      </th>
                      <th className="p-4 text-[#717073]">Name of the venue</th>
                      <th className="p-4 text-[#717073]">Address</th>
                      <th className="p-4 text-[#717073]">Facility</th>
                      <th className="p-4 text-[#717073]"></th>
                      <th className="p-4 text-[#717073]"></th>
                    </tr>
                  </thead>

                  <tbody>
                    {venues.map((user, idx) => {
                      const isChecked = selectedUserIds.includes(user.id);

                      return (
                        <tr key={idx} className="border-t font-semibold text-[#282829] border-[#EFEEF2] hover:bg-gray-50">
                          <td className="p-4 cursor-pointer">
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => toggleCheckbox(user.id)}
                                className={`lg:w-5 lg:h-5 w-full  me-2 flex items-center justify-center rounded-md border-2 ${isChecked ? 'border-gray-700' : 'border-gray-300'
                                  } transition-colors focus:outline-none`}
                              >
                                {isChecked && <Check size={16} strokeWidth={3} className="text-gray-700" />}
                              </button>
                              <span>{user.area || "-"}</span>
                            </div>
                          </td>
                          <td className="p-4">{user.name || "-"}</td>
                          <td className="p-4">{user.address || "-"}</td>
                          <td className="p-4">{user.facility || "-"}</td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              <div
                                onClick={() => handleIconClick("calendar", user.termGroups)}
                                className="cursor-pointer"
                              >
                                <img
                                  src="/demo/synco/members/calendar-circle.png"
                                  className="min-w-6 min-h-6 max-w-6 max-h-6"
                                  alt="calendar"
                                />
                              </div>
                              <div
                                onClick={() => handleIconClick("currency", user.paymentPlans)}
                                className="cursor-pointer"
                              >
                                <img
                                  src="/demo/synco/members/Currency Icon.png"
                                  className="min-w-6 min-h-6 max-w-6 max-h-6"
                                  alt="currency"
                                />
                              </div>
                              <div
                                onClick={() =>
                                  user.isCongested
                                    ? handleIconClick("group", user.congestionNote)
                                    : handleIconClick("group")
                                }
                                className="cursor-pointer"
                              >
                                <img
                                  src="/demo/synco/members/Group-c.png"
                                  className="min-w-6 min-h-6 max-w-6 max-h-6"
                                  alt="group"
                                />
                              </div>
                              <div
                                onClick={() =>
                                  user.hasParking
                                    ? handleIconClick("p", user.parkingNote)
                                    : handleIconClick("p")
                                }
                                className="cursor-pointer"
                              >
                                <img
                                  src="/demo/synco/members/p.png"
                                  className="min-w-6 min-h-6 max-w-6 max-h-6"
                                  alt="p icon"
                                />
                              </div>

                            </div>


                          </td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              <div><img onClick={() => {
                                setIsEditVenue(true);
                                setFormData(user);
                                setOpenForm(true)
                              }} src="/demo/synco/members/edit.png" className='min-w-6 min-h-6 max-w-6 max-h-6 cursor-pointer transition-transform duration-200 hover:scale-110 active:scale-90' alt="" /></div>
                              <div>
                                <img
                                  onClick={() => handleDelete(user.id)}
                                  src="/demo/synco/members/delete-02.png"
                                  className="min-w-6 min-h-6 max-w-6 max-h-6 cursor-pointer transition-transform duration-200 hover:scale-110 active:scale-90"
                                  alt=""
                                />
                              </div>
                              <div>  <img
                                src="/demo/synco/members/Time-Circle.png"
                                className="min-w-6 min-h-6 max-w-6 max-h-6 cursor-pointer transition-transform duration-200 hover:scale-110 active:scale-90"
                                alt="Navigate"
                                onClick={() => navigate(`/weekly-classes/venues/class-schedule?id=${user.id}`)}
                              /></div>
                            </div>

                          </td>

                        </tr>
                      );
                    })}

                  </tbody>
                </table>
              </div>
            ) : (
              <p className='text-center  p-4 border-dotted border rounded-md'>No Members Found</p>
            )
          }
        </div>

        {openForm && (
          <div className="md:w-1/4 bg-white  rounded-4xl relative">

            <button
              onClick={() => {
                setOpenForm(false);
                setIsEditVenue(false);
                setFormData({
                  area: "",
                  name: "",
                  address: "",
                  facility: "",
                  parking: false,
                  congestion: false,
                  parkingNote: "",
                  entryNote: "",
                  termDateLinkage: "",
                  subscriptionLinkage: ""
                });
              }}
              className="absolute top-4 right-6 text-gray-400 hover:text-gray-700 text-xl"
              title="Close"
            >
              &times;
            </button>
            <Create packages={packages} termGroup={termGroup} onClose={() => setOpenForm(false)} />


          </div>
        )}

      </div>

      {showModal && clickedIcon === "currency" && selectedPlans.length > 0 && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
          <div className="flex items-center justify-center w-full px-4 py-6 sm:px-6 md:py-10">
            <div className="bg-white rounded-3xl p-4 sm:p-6 w-full max-w-4xl shadow-2xl">
              {/* Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#E2E1E5] pb-4 mb-4 gap-2">
                <h2 className="font-semibold text-[20px] sm:text-[24px]">Subscription Plan Preview</h2>
                <button className="text-gray-400 hover:text-black text-xl font-bold">
                  <img
                    src="/demo/synco/icons/cross.png"
                    onClick={() => setShowModal(false)}
                    alt="close"
                    className="w-5 h-5"
                  />
                </button>
              </div>
              <PlanTabs selectedPlans={selectedPlans} />
            </div>
          </div>
        </div>
      )}
      {showModal && clickedIcon === "calendar" && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
          <div className="bg-white rounded-3xl w-full max-h-[80%]   overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-500  max-w-md sm:max-w-lg p-4 sm:p-6 shadow-2xl">
            {/* Header */}
            <div className="flex justify-between items-center border-b  border-[#E2E1E5] pb-4 mb-4">
              <h2 className="text-[24px] font-semibold">Term Dates</h2>
              <button onClick={() => setShowModal(false)}>
                <img src="/demo/synco/icons/cross.png" alt="close" className="w-4 h-4" />
              </button>
            </div>

            {/* Term List */}
            <div className="space-y-6 text-center text-[13px]   sm:text-[14px] text-[#2E2F3E] font-medium">
              {congestionNote.map((group) =>
                group.terms.map((term, idx) => {
                  const start = format(parseISO(term.startDate), "EEE dd MMM yyyy");
                  const end = format(parseISO(term.endDate), "EEE dd MMM yyyy");
                  const exclusions = (term.exclusionDates || [])
                    .map((d) => format(new Date(d), "EEE dd MMM yyyy"))
                    .join(", ");

                  return (
                    <div key={term.id}>
                      <h3 className="text-[20px] font-semibold mb-1">
                        {term.termName} Term {new Date(term.startDate).getFullYear()}
                      </h3>
                      <p className="text-[18px]">{start} - {end}</p>
                      {exclusions && (
                        <p className="text-[18px]">
                          Half term Exclusion: {exclusions}
                        </p>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Calendar Section */}
            <div className="rounded p-4 mt-6 text-center text-sm w-full max-w-md mx-auto">
              {/* Calendar Header */}
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

              {/*also in calendar make auto prefilled terms startdate and end date print all like january has 15 to 21 feb has 23 to 28 */}
              {/* Calendar Grid */}
              <div className="flex flex-col gap-1">
                {Array.from({ length: Math.ceil(calendarDays.length / 7) }).map((_, weekIndex) => {
                  const week = calendarDays.slice(weekIndex * 7, weekIndex * 7 + 7);
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
                            className={`w-8 h-8 flex items-center justify-center mx-auto text-sm rounded-full cursor-pointer
    ${isFrom || isTo ? "bg-blue-600 text-white font-bold" : ""}
    ${isExcluded(date) ? "bg-red-200" : ""}
    ${isInRange(date) ? "bg-sky-100" : ""}
  `}
                          >
                            {date?.getDate()}
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
      {showModal && clickedIcon === "group" && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
          <div
            ref={modalRef}
            className="relative bg-white rounded-2xl shadow-2xl px-6 py-4 min-w-[409px] max-w-[489px]"
          >
            <div className="flex items-start justify-between">
              <h2 className="text-red-500 font-semibold text-[18px] leading-tight">
                Congestion Information
              </h2>
              <img src="/demo/synco/icons/infoIcon.png" alt="" />
            </div>

            <div className="mt-2 text-[16px] text-gray-700 leading-snug">
              {congestionNote ? (
                <p>{congestionNote}</p>
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
      {showModal && clickedIcon === "p" && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
          <div
            ref={PRef}
            className="relative bg-white rounded-2xl shadow-2xl px-6 py-4 min-w-[409px] max-w-[489px]"
          >
            <div className="flex items-start justify-between">
              <h2 className="text-red-500 font-semibold text-[18px] leading-tight">
                Parking Information
              </h2>
              <img src="/demo/synco/icons/infoIcon.png" alt="" />
            </div>

            <div className="mt-2 text-[16px] text-gray-700 leading-snug">
              {congestionNote ? (
                congestionNote
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

    </div>
  );
};

export default List;
