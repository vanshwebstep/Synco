// src/components/ServiceHistory.jsx
import React from "react";
import { useNavigate } from 'react-router-dom';

const formatDate = (dateString, withTime = false) => {
  if (!dateString) return "-";
  const date = new Date(dateString);

  const dateOptions = { year: "numeric", month: "short", day: "2-digit" };

  if (withTime) {
    const formattedDate = date.toLocaleDateString("en-GB", dateOptions); // "20 Sep 2025"
    const formattedTime = date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false, // ✅ 24-hour format
    });
    return `${formattedDate}, ${formattedTime}`;
  }

  return date.toLocaleDateString("en-GB", dateOptions); // "20 Sep 2025"
};


const ServiceHistory = ({ serviceHistory, itemId ,labels = {}, comesFrom }) => {
  if (!serviceHistory) return null;
  const navigate = useNavigate();

  const {
    bookingId,
    bookedBy,
    paymentData,
    status,
    createdAt,
    students,
    classSchedule,
    paymentPlan,
    bookedByAdmin,
    dateBooked,
    title,   // header title
    icon,    // header icon
    progress // e.g. "6/12 months"
  } = serviceHistory;
console.log('bookedBy')
  const statusStyles = {
    attended: "bg-green-500 text-white",
    active: "bg-green-500 text-white",
    rebooked: "bg-blue-500 text-white",
    waiting_list: "bg-gray-300 text-white",
    pending: "bg-yellow-500 text-white",
    cancelled: "bg-red-500 text-white",
    request_to_cancel: "bg-white text-red-500 border",
  };
   console.log('itemId,itemId', comesFrom)
  return (
    <div className="transition-all duration-300 flex-1 bg-white">
      <div className="rounded-4xl w-full">
        <div className="space-y-5">
          <div className="rounded-2xl relative p-2 border border-[#D9D9D9] shadow-sm bg-white">

            {/* Header */}
            <div className="bg-[#2E2F3E] text-white p-4 rounded-xl flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                {(comesFrom === "cancellation" || comesFrom === "freeTrial" || comesFrom === "membership") && (
                  <img src={icon || "/demo/synco/icons/crown.png"} alt="icon" />
                )}

                <span className="font-medium text-[20px]">
                  {title || labels.header || "Service History"}
                </span>
              </div>

              <div className="flex relative items-center gap-4">
                {/* Student Count */}
                {/* {(comesFrom === "cancellation" || comesFrom === "freeTrial" || comesFrom === "membership") && (
                  <div className="flex gap-2 items-center text-black p-2 rounded-xl flex-wrap bg-white">
                    <img
                      src="/demo/synco/images/accountInfoCount.png"
                      alt="student count"
                    />
                    <div className="block pr-3">
                      <div className="whitespace-nowrap font-semibold text-[#717073] text-[16px]">
                        {students?.length || 0}
                      </div>
                    </div>
                  </div>
                )} */}
                {/* Status */}
                {(comesFrom === "cancellation" || comesFrom === "freeTrial" || comesFrom === "membership") && (
                  <div
                    className={`flex gap-2 items-center p-2 rounded-xl flex-wrap shadow-sm ${statusStyles[status] || "bg-gray-300 text-black"
                      }`}
                  >
                    <div className="block">
                      <div className="whitespace-nowrap font-semibold capitalize text-[14px]">
                        {status ? status.replaceAll("_", " ") : "Unknown"}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="flex items-center bg-[#FCF9F6] flex-col lg:flex-row">
              <div className="px-4 w-full py-2 flex-1 space-y-6">
                <div className="md:flex gap-6 justify-between items-center flex-wrap">

                  {/* Membership Plan */}
                  {(comesFrom === "cancellation" || comesFrom === "membership") && (
                    <div>
                      <div className="whitespace-nowrap font-semibold text-[14px]">
                        {labels.membershipPlan || "Membership Plan"}
                      </div>
                      <div className="font-semibold text-[16px] text-black">
                        {paymentPlan?.title || "-"}
                      </div>
                    </div>
                  )}
                  {comesFrom === "freeTrial" && (
                    <div>
                      <div className="whitespace-nowrap font-semibold text-[14px]">
                        {labels.dateOfTrial || "Date of "}
                      </div>
                      <div className="font-semibold text-[16px] text-black">
                        {formatDate(serviceHistory?.trialDate) || "-"}
                      </div>
                    </div>
                  )}
                  {/* Students */}
                  {(comesFrom === "cancellation" || comesFrom === "freeTrial" || comesFrom === "membership") && (
                    <div className="block pr-3">
                      <div className="whitespace-nowrap font-semibold text-[14px]">
                        {labels.students || "Students"}
                      </div>
                      <div className="text-[16px] font-semibold text-[#384455]">
                        {students?.length || 0}
                      </div>
                    </div>
                  )}



                  {/* Venue */}
                  {(comesFrom === "cancellation" || comesFrom === "freeTrial" || comesFrom === "membership") && (
                    <div className="block pr-3">
                      <div className="whitespace-nowrap font-semibold text-[14px]">
                        {labels.venue || "Venue"}
                      </div>
                      <div className="text-[16px] font-semibold text-[#384455]">
                        {classSchedule?.venue?.name || "-"}
                      </div>
                    </div>
                  )}


                  {/* Booking ID */}
                  {(comesFrom === "cancellation" || comesFrom === "freeTrial" || comesFrom === "membership") && (
                    <div className="block pr-3">
                      <div className="whitespace-nowrap font-semibold text-[14px]">
                        {labels.bookingId || "Booking ID"}
                      </div>
                      <div className="text-[16px] font-semibold text-[#384455]">
                        {bookingId || "-"}
                      </div>
                    </div>
                  )}
                  {(comesFrom === "freeTrial") && (
                    <div className="block pr-3">
                      <div className="whitespace-nowrap font-semibold text-[14px]">
                        {labels.trialAttempt || "Trial Attempt"}
                      </div>
                      <div className="text-[16px] font-semibold text-[#384455]">
                        {'-' || "-"}
                      </div>
                    </div>
                  )}
                  
                  {(comesFrom === "cancellation" || comesFrom === "membership") && (
                    <div className="block pr-3">
                      <div className="whitespace-nowrap font-semibold text-[14px]">
                        {labels.price || "Price"}
                      </div>
                      <div className="text-[16px] font-semibold text-[#384455]">
                        £
                        {paymentPlan?.interval === "Month"
                          ? paymentPlan?.price / paymentPlan?.duration
                          : paymentPlan?.interval === "Year"
                            ? paymentPlan?.price / (paymentPlan?.duration / 12)
                            : paymentPlan?.interval === "Annual"
                              ? paymentPlan?.price
                              : paymentPlan?.price}
                      </div>
                    </div>
                  )}
                  {(comesFrom === "cancellation" || comesFrom === "freeTrial" || comesFrom === "membership") && (
                    <div className="block pr-3">
                      <div className="whitespace-nowrap font-semibold text-[14px]">
                        {labels.dateOfBooking || "Date of Booking"}
                      </div>
                <div className="text-[16px] font-semibold text-[#384455]">
  {dateBooked ? formatDate(dateBooked, true) : createdAt ? formatDate(createdAt, true) : "—"}
</div>
                    </div>
                  )}
                  




                  {/* Date of Booking */}




                  {/* Progress */}
                  {(comesFrom === "cancellation") && (
                    <div>
                      <div className="whitespace-nowrap font-semibold text-[14px]">
                        {labels.progress || "Progress"}
                      </div>
                      <div className="text-[16px] font-semibold text-[#384455]">
                        {progress || "-"}
                      </div>
                    </div>
                  )}
                  {(comesFrom === "membership") && (
                    <div>
                      <div className="whitespace-nowrap font-semibold text-[14px]">
                        {labels.coach || "Coach"}
                      </div>
                      <div className="text-[16px] font-semibold text-[#384455]">
                        {bookedByAdmin?.firstName} {bookedByAdmin?.lastName}
                      </div>
                    </div>
                  )}


                  {/* Booking Source */}
                  {(comesFrom === "cancellation" || comesFrom === "freeTrial" || comesFrom === "membership") && (
                    <div className="block flex items-center">
                      <div>
                        <div className="whitespace-nowrap font-semibold text-[14px]">
                          {labels.bookingSource || "Booking Source"}
                        </div>
                       <div className="text-[16px] font-semibold text-[#384455]">
  {bookedBy?.firstName  ? `${bookedBy?.firstName} ${bookedBy?.lastName}` : ""}
  {bookedBy && paymentData ? " || " : ""}
  {paymentData?.firstName && paymentData?.lastName ? `${paymentData.firstName} ${paymentData?.lastName}` : ""}
</div>

                      </div>
                      <div>
                        <img
                          src="/demo/synco/icons/threeDot.png"
                          alt="options"
                          className="pl-4"
                        />
                      </div>
                    </div>
                  )}


                </div>

                {/* Buttons */}
                <div className="flex flex-col w-full space-y-4">
                  <div className="flex gap-2 flex-wrap justify-start">
                    {(labels.buttons || [
                      "See Details",
                      "Credits",
                      "Attendance",
                      "See Payments",
                    ]).map((btn, i) => (
                      <button
                        key={i}
                         onClick={() => navigate(`/weekly-classes/all-members/see-details?id=${itemId}`)}
                        className="font-semibold whitespace-nowrap border border-[#BEBEBE] px-3 py-2 rounded-xl text-[15px] font-medium"
                      >
                        {btn}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            {/* End Content */}
          </div>
        </div>
      </div>
    </div>

  );
};

export default ServiceHistory;
