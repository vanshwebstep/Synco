import React, { useEffect, useState, useCallback } from "react";
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

const Facebook = () => {
  const { loading, fetchData, data } = useLeads();
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);

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

  if (loading) return <Loader />;
  if (data.length == 0) return <p className="text-center">No Data Found</p>;
  return (
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
                <tr className="border-b border-[#EFEEF2] hover:bg-gray-50 transition cursor-pointer">
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
                      {lead.date}
                    </div>
                  </td>
                  <td className="py-3 px-4">{lead.parent}</td>
                  <td className="py-3 px-4">{lead.email}</td>
                  <td className="py-3 px-4">{lead.phone}</td>
                  <td className="py-3 px-4">{lead.postcode}</td>
                  <td className="py-3 px-4 whitespace-nowrap">{lead.kidRange}</td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    {lead.assignedAgent}
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
                  <td colSpan={8} className="px-3">
                    {/* Animated container */}
                    <div
                      className={`transition-all duration-500 ease-in-out overflow-hidden ${isExpanded ? "max-h-[800px] opacity-100 py-6" : "max-h-0 opacity-0 py-0"
                        }`}
                    >
                      <div className="p-3 border border-[#E2E1E5] rounded-4xl space-y-5 bg-white">
                        {/* Header Bar */}
                        <div className="flex justify-between items-center bg-[#3D444F] text-white rounded-2xl px-5 py-4">
                          <div className="flex items-center gap-2 text-white">
                            <MapPin size={18} />
                            <span className="font-semibold">
                              The King Fahad Academy, East Acton Lane, London W3 7HD
                            </span>
                          </div>

                          <div className="md:mt-0 mt-5 flex relative items-center gap-4">
                            {[
                              "fcDollar",
                              "fcCalendar",
                              "fcLocation",
                              "fcCicon",
                              "fcPIcon",
                            ].map((icon, idx) => (
                              <img
                                key={idx}
                                src={`/demo/synco/icons/${icon}.png`}
                                alt=""
                                className="cursor-pointer w-7 h-7 rounded-full bg-white"
                              />
                            ))}
                          </div>
                        </div>

                        {/* Inner White Box */}
                        <div className="bg-[#FCF9F6] rounded-2xl p-3 px-5 flex justify-between gap-6">
                          {/* Location Info */}
                          <div className="flex flex-wrap justify-between items-center border-b border-gray-100 pb-4 md:w-[28%]">
                            <div>
                              <p className="text-lg font-semibold text-[#333]">Acton</p>
                              <p className="text-sm text-gray-500 mt-2">2 miles</p>
                            </div>
                            <div className="text-center">
                              <p className="text-[14px] font-semibold text-[#384455]">
                                1st Nov 2023 – 4th Nov 2023
                              </p>
                              <p className="text-xs text-[#717073] font-semibold mt-2">
                                4 Days
                              </p>
                            </div>
                          </div>

                          {/* Class Details */}
                          <div className="md:w-[55%]">
                            {[
                              {
                                name: "Class 1",
                                age: "4–7 years",
                                time: "9:30am – 10:30am",
                                status: "Fully booked",
                                color: "bg-[#FEE2E2] text-[#F87171]",
                              },
                              {
                                name: "Class 2",
                                age: "8–12 years",
                                time: "10:30am – 11:30am",
                                status: "+4 spaces",
                                color: "bg-[#DCFCE7] text-[#16A34A]",
                              },
                            ].map((cls, idx) => (
                              <div
                                key={idx}
                                className="flex justify-between gap-4 items-center mt-2"
                              >
                                <p className="font-bold text-[#000]">{cls.name}</p>
                                <p className="text-sm text-[#384455] font-semibold">
                                  {cls.age}
                                </p>
                                <p className="flex items-center gap-1 text-sm text-[#384455] font-semibold justify-end">
                                  <Clock size={14} /> {cls.time}
                                </p>
                                <p
                                  className={`text-xs font-semibold mt-1 ${cls.color} px-3 py-1 rounded-md inline-block`}
                                >
                                  {cls.status}
                                </p>
                              </div>
                            ))}
                          </div>

                          {/* Buttons */}
                          <div className="flex flex-wrap gap-3 md:w-[17%]">
                            <button className="bg-[#237FEA] text-white px-4 py-2 rounded-lg text-[14px] font-semibold hover:bg-[#006AE6] transition">
                              Add to Waiting List
                            </button>
                            <button className="border px-4 py-2 rounded-lg text-[14px] hover:bg-gray-50 transition">
                              Book a Free Trial
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Facebook;
