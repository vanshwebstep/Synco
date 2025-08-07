// src/components/ServiceHistory.jsx

import React from "react";

const ServiceHistory = () => {
  return (
    <div className="transition-all duration-300 flex-1 bg-white">
      <div className="rounded-4xl w-full">
        <div className="space-y-5">
          <div className="rounded-2xl relative p-2 border border-[#D9D9D9] shadow-sm bg-white">
            <div className="bg-[#2E2F3E] text-white p-4 rounded-xl flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <img src="/demo/synco/icons/crown.png" alt="" />
                <span className="font-medium text-[20px]">Weekly Classes Trial</span>
              </div>
              <div className="flex relative items-center gap-4">
                <div className="flex gap-2 items-center text-black p-2 rounded-xl flex-wrap bg-white">
                  <img
                    src="/demo/synco/images/accountInfoCount.png"
                    alt="Back"
                  />
                  <div className="block pr-3">
                    <div className="whitespace-nowrap font-semibold text-[#717073] text-[16px]">396</div>
                  </div>
                </div>
                <div className="flex gap-2 items-center p-2 rounded-xl flex-wrap bg-green-500">
                  <div className="block">
                    <div className="whitespace-nowrap font-semibold text-white text-[16px]">Attended</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Venue Content */}
            <div className="flex items-center bg-[#FCF9F6] flex-col lg:flex-row">
              <div className="px-4 w-full py-2 flex-1 space-y-6">
                <div className="flex gap-6 justify-between items-center flex-wrap">
                  <div>
                    <div className="whitespace-nowrap font-semibold text-[14px]">Date of Trial</div>
                    <div className="font-semibold text-[16px] text-black">Sat 12 Jan 2025</div>
                  </div>
                  <div className="block pr-3">
                    <div className="whitespace-nowrap font-semibold text-[14px]">Students</div>
                    <div className="text-[16px] font-semibold text-[#384455]">2</div>
                  </div>
                  <div className="block pr-3">
                    <div className="whitespace-nowrap font-semibold text-[14px]">Venue</div>
                    <div className="text-[16px] font-semibold text-[#384455]">Action</div>
                  </div>
                  <div className="block pr-3">
                    <div className="whitespace-nowrap font-semibold text-[14px]">ID</div>
                    <div className="text-[16px] font-semibold text-[#384455]">XHAHSJJA!21</div>
                  </div>
                  <div className="block pr-3">
                    <div className="whitespace-nowrap font-semibold text-[14px]">Trial Attempt</div>
                    <div className="text-[16px] font-semibold text-[#384455]">1</div>
                  </div>
                  <div className="block pr-3">
                    <div className="whitespace-nowrap font-semibold text-[14px]">Date of booking </div>
                    <div className="text-[16px] font-semibold text-[#384455]">NOV 18 2022, 17:00</div>
                  </div>
                  <div className="block flex items-center">
                    <div>
                      <div className="whitespace-nowrap font-semibold text-[14px]">Booking Source</div>
                      <div className="text-[16px] font-semibold text-[#384455]">Ben Marcus</div>
                    </div>
                    <div>
                      <img src="/demo/synco/icons/threeDot.png" alt="" className="pl-4" />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col w-full space-y-4">
                  <div className="flex gap-2 flex-wrap justify-start">
                    <button className="font-semibold whitespace-nowrap border border-[#BEBEBE] px-3 py-2 rounded-xl text-[15px] font-medium">See Details</button>
                    <button className="font-semibold whitespace-nowrap border border-[#BEBEBE] px-3 py-2 rounded-xl text-[15px] font-medium">Attendance</button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceHistory;
