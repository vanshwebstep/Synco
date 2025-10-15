// src/components/ServiceHistory.jsx
import React from "react";
import { useNavigate } from 'react-router-dom';

const formatDate = (dateString, withTime = false) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  const options = {
    year: "numeric",
    month: "short",
    day: "2-digit",
  };
  const navigate = useNavigate();

  if (withTime) {
    return (
      date.toLocaleDateString("en-US", options) +
      ", " +
      date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
    );
  }
  return date.toLocaleDateString("en-US", options);
};

const ServiceHistory = ({ serviceHistory }) => {
  if (!serviceHistory) return null;

  const {
    bookingId,
    trialDate,
    bookedBy,
    status,
    createdAt,
    students,
    classSchedule,
    paymentPlan,
  } = serviceHistory;
                const statusStyles = {
  attended: "bg-green-500 text-white",
  pending: "bg-yellow-500 text-black",
  cancelled: "bg-red-500 text-white",
  request_to_cancel: "bg-white text-red-500 border ",
};
   console.log('serviceHistory', serviceHistory)
  return (
    <div className="transition-all duration-300 flex-1 bg-white">
      <div className="rounded-4xl w-full">
        <div className="space-y-5">
          <div className="rounded-2xl relative p-2 border border-[#D9D9D9] shadow-sm bg-white">
            {/* Header */}
            <div className="bg-[#2E2F3E] text-white p-4 rounded-xl flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <img src="/demo/synco/icons/crown.png" alt="" />
                <span className="font-medium text-[20px]">
                  Weekly Classes Trial
                </span>
              </div>
              <div className="flex relative items-center gap-4">
                {/* Student Count */}
                {/* <div className="flex gap-2 items-center text-black p-2 rounded-xl flex-wrap bg-white">
                  <img
                    src="/demo/synco/images/accountInfoCount.png"
                    alt="Back"
                  />
                  <div className="block pr-3">
                    <div className="whitespace-nowrap font-semibold text-[#717073] text-[16px]">
                      {students?.length || 0}
                    </div>
                  </div>
                </div> */}
                {/* Status */}


<div
  className={`flex gap-2 items-center p-2 rounded-xl flex-wrap shadow-sm ${
    statusStyles[status] || "bg-gray-300 text-black"
  }`}
>
  <div className="block">
    <div className="whitespace-nowrap font-semibold capitalize text-[14px]">
      {status ? status.replaceAll("_", " ") : "Unknown"}
    </div>
  </div>
</div>

              </div>
            </div>

            {/* Venue Content */}
            <div className="flex items-center bg-[#FCF9F6] flex-col lg:flex-row">
              <div className="px-4 w-full py-2 flex-1 space-y-6">
                <div className="flex gap-6 justify-between items-center flex-wrap">
                  {/* Trial Date */}
                  <div>
                    <div className="whitespace-nowrap font-semibold text-[14px]">
                      Memberhsip Plan
                    </div>
                    <div className="font-semibold text-[16px] text-black">
                      {paymentPlan?.title}
                    </div>
                  </div>

                  {/* Students */}
                  <div className="block pr-3">
                    <div className="whitespace-nowrap font-semibold text-[14px]">
                      Students
                    </div>
                    <div className="text-[16px] font-semibold text-[#384455]">
                      {students?.length || 0}
                    </div>
                  </div>

                  {/* Venue */}
                  <div className="block pr-3">
                    <div className="whitespace-nowrap font-semibold text-[14px]">
                      Venue
                    </div>
                    <div className="text-[16px] font-semibold text-[#384455]">
                      {classSchedule?.venue?.name || "-"}
                    </div>
                  </div>

                  {/* Booking ID */}
                  <div className="block pr-3">
                    <div className="whitespace-nowrap font-semibold text-[14px]">
                      KGoCardless ID
                    </div>
                    <div className="text-[16px] font-semibold text-[#384455]">
                      {bookingId}
                    </div>
                  </div>

                  <div className="block pr-3">
                    <div className="whitespace-nowrap font-semibold text-[14px]">
                      {paymentPlan?.interval === "Month"
                        ? "Monthly Price"
                        : paymentPlan?.interval === "Year"
                          ? "Yearly Price"
                          : paymentPlan?.interval === "Annual"
                            ? "Annually Price"
                            : "Price"}
                    </div>

                    <div className="text-[16px] font-semibold text-[#384455]">
                      £{paymentPlan?.interval === "Month"
                        ? paymentPlan?.price / paymentPlan?.duration // monthly
                        : paymentPlan?.interval === "Year"
                          ? paymentPlan?.price / (paymentPlan?.duration / 12) // yearly
                          : paymentPlan?.interval === "Annual"
                            ? paymentPlan?.price // annual total
                            : paymentPlan?.price}
                    </div>
                  </div>


                  {/* Date of Booking */}
                  <div className="block pr-3">
                    <div className="whitespace-nowrap font-semibold text-[14px]">
                      Date of Booking
                    </div>
                    <div className="text-[16px] font-semibold text-[#384455]">
                      {formatDate(createdAt, true)}
                    </div>
                  </div>


                  <div>
                    <div className="whitespace-nowrap font-semibold text-[14px]">
                      Progress
                    </div>
                    <div className="text-[16px] font-semibold text-[#384455]">
                      6/12 month (static)
                    </div>
                  </div>
                  <div>

                  </div>

                  {/* Booking Source */}
                  <div className="block flex items-center">
                    <div>
                      <div className="whitespace-nowrap font-semibold text-[14px]">
                        Booking Source
                      </div>
                      <div className="text-[16px] font-semibold text-[#384455]">
                        {bookedBy?.firstName} {bookedBy?.lastName}
                      </div>
                    </div>
                    <div>
                      <img
                        src="/demo/synco/icons/threeDot.png"
                        alt=""
                        className="pl-4"
                      />
                    </div>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex flex-col w-full space-y-4">
                  <div className="flex gap-2 flex-wrap justify-start">
                    <button  onClick={() => navigate('/weekly-classes/all-members/see-details')} className="font-semibold whitespace-nowrap border border-[#BEBEBE] px-3 py-2 rounded-xl text-[15px] font-medium">
                      See Details
                    </button>
                    <button className="font-semibold whitespace-nowrap border border-[#BEBEBE] px-3 py-2 rounded-xl text-[15px] font-medium">
                      Credits
                    </button>
                       <button className="font-semibold whitespace-nowrap border border-[#BEBEBE] px-3 py-2 rounded-xl text-[15px] font-medium">
                      Attendance
                    </button>   <button className="font-semibold whitespace-nowrap border border-[#BEBEBE] px-3 py-2 rounded-xl text-[15px] font-medium">
                      See payments
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {/* End Venue */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceHistory;
