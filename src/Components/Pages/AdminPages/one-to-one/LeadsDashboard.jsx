import React, { useState } from "react";
import {
  Search,
  Plus,
  Mail,
  MessageSquare,
  Download,
  ChevronLeft,
  ChevronRight,
  Check,
  User,
  UserRoundPlus, X
} from "lucide-react";
import { TiUserAdd } from "react-icons/ti";

import { PiUsersThreeBold } from "react-icons/pi";
const LeadsDashboard = () => {
  const summaryCards = [
    { icon: PiUsersThreeBold, iconStyle: "text-[#3DAFDB] bg-[#E6F7FB]", title: "Total Leads", value: 945, change: "+28.14%" },
    { icon: User, iconStyle: "text-[#099699] bg-[#E0F7F7]", title: "New Leads", value: 245, change: "+12.47%" },
    { icon: UserRoundPlus, iconStyle: "text-[#F38B4D] bg-[#FFF2E8]", title: "Leads to Bookings", value: 120, change: "+9.31%" },
    { icon: PiUsersThreeBold, iconStyle: "text-[#6F65F1] bg-[#E9E8FF]", title: "Source of Leads", value: "Online" },
  ];
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    parentName: "",
    childName: "",
    age: "",
    postcode: "",
    packageInterest: "",
    availability: "",
    source: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setIsOpen(false);
  };
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  const leadsData = Array(10).fill({
    id: 1,
    parent: "Tom Jones",
    child: "Steve Jones",
    age: 10,
    postcode: "W14 9EB",
    package: "Gold",
    availability: "Weekends",
    source: "Referral",
    status: "Pending",
  });

  const toggleCheckbox = (userId) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  // ==== Calendar Logic ====
  const getDaysInMonth = (month, year) =>
    new Date(year, month + 1, 0).getDate();

  const getFirstDayOfMonth = (month, year) =>
    new Date(year, month, 1).getDay(); // 0=Sun

  const daysInMonth = getDaysInMonth(
    currentDate.getMonth(),
    currentDate.getFullYear()
  );
  const firstDay = getFirstDayOfMonth(
    currentDate.getMonth(),
    currentDate.getFullYear()
  );

  const prevMonth = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() - 1);
      return newDate;
    });
  };

  const nextMonth = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + 1);
      return newDate;
    });
  };

  const monthName = currentDate.toLocaleString("default", { month: "long" });
  const year = currentDate.getFullYear();

  // Prepare calendar cells
  const daysArray = [];
  for (let i = 0; i < firstDay; i++) daysArray.push(null);
  for (let i = 1; i <= daysInMonth; i++) daysArray.push(i);

  return (
    <>

      <div className="min-h-screen overflow-hidden bg-gray-50 py-6 flex flex-col lg:flex-row ">
        {/* Left Section */}
        <div className="md:w-[73%] gap-6 pe-3">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {summaryCards.map((card, i) => {
              const Icon = card.icon;
              return (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-4 border border-gray-100 flex  items-center gap-4 hover:shadow-md transition-all duration-200"
                >
                  <div>
                    <div
                      className={`p-2 h-[50px] w-[50px] rounded-full ${card.iconStyle} bg-opacity-10 flex items-center justify-center`}
                    >
                      <Icon size={24} className={card.iconStyle} />
                    </div>
                  </div>
                  <div className="mt-3">
                    <p className="text-sm text-gray-500">{card.title}</p>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-semibold mt-1">{card.value}</h3>
                      {card.change && (
                        <p className="text-green-600 text-xs mt-1">({card.change})</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Leads Table */}
          <div className="">
            <div className="flex justify-between items-center p-4">
              <h2 className="font-semibold text-lg">One to One Leads</h2>
              <div className="flex gap-4 items-center">
                <button className="bg-white border border-[#E2E1E5] rounded-full flex justify-center items-center h-10 w-10"><TiUserAdd className="text-xl" /></button>
                <button onClick={() => setIsOpen(true)}
                  className="flex items-center gap-2 bg-[#237FEA] text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                  <Plus size={16} />
                  Add new lead
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-auto rounded-2xl bg-white shadow-sm">
              <table className="min-w-full text-sm">
                <thead className="bg-[#F5F5F5] text-left border border-[#EFEEF2]">
                  <tr className="font-semibold text-[#717073]">
                    <th className="py-3 px-4 whitespace-nowrap">Parent Name</th>
                    <th className="py-3 px-4 whitespace-nowrap">Child Name</th>
                    <th className="py-3 px-4 whitespace-nowrap">Age</th>
                    <th className="py-3 px-4 whitespace-nowrap">Postcode</th>
                    <th className="py-3 px-4 whitespace-nowrap">Package Interest</th>
                    <th className="py-3 px-4 whitespace-nowrap">Availability</th>
                    <th className="py-3 px-4 whitespace-nowrap">Source</th>
                    <th className="py-3 px-4 whitespace-nowrap">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {leadsData.map((lead, i) => {
                    const isChecked = selectedUserIds.includes(lead.id);
                    return (
                      <tr
                        key={i}
                        className="border-b border-[#EFEEF2] hover:bg-gray-50 transition"
                      >
                        <td className="py-3 px-4 whitespace-nowrap font-semibold">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => toggleCheckbox(lead.id)}
                              className={`w-5 h-5 flex items-center justify-center rounded-md border-2 ${isChecked
                                ? "border-gray-500"
                                : "border-gray-300"
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
                            {lead.parent}
                          </div>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">{lead.child}</td>
                        <td className="py-3 px-4 whitespace-nowrap">{lead.age}</td>
                        <td className="py-3 px-4 whitespace-nowrap">{lead.postcode}</td>
                        <td className="py-3 px-4 whitespace-nowrap">{lead.package}</td>
                        <td className="py-3 px-4 whitespace-nowrap">{lead.availability}</td>
                        <td className="py-3 px-4 whitespace-nowrap">{lead.source}</td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-medium">
                            {lead.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="md:w-[27%] flex-shrink-0  gap-5 ps-3">
          {/* Search */}
          <div className="mb-4 bg-white rounded-2xl p-4">
            <h3 className="font-semibold text-gray-700 mb-2">Search now</h3>
            <label htmlFor="" className="text-[14px]">Search Student</label>
            <div className="relative mt-1">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search by student name"
                className="pl-9 pr-3 py-2 w-full border border-[#E2E1E5] rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Filter by Date */}
          <div className="bg-white p-4 rounded-xl ">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-gray-700 text-lg">Filter by date</h3>
              <button className="px-5 mt-4 bg-[#237FEA] hover:bg-blue-700 text-white flex gap-2 items-center text-sm py-2 rounded-lg transition">
                <img src='/demo/synco/DashboardIcons/filtericon.png' className='w-3 h-3 sm:w-5 sm:h-5' alt="" />
                Apply Filter
              </button>

            </div>
            <div className=" p-4 bg-[#FAFAFA] rounded-lg mb-4">
              <p className="text-[17px] font-medium mb-2 text-gray-700">Choose type</p>
              <div className="grid md:grid-cols-2 gap-1 text-[16px] mb-4">
                {["Paid", "Trial", "Canceled"].map((label) => (
                  <label key={label} className="flex items-center gap-2">
                    <input type="checkbox" />
                    {label}
                  </label>
                ))}
              </div>
            </div>
            {/* Calendar */}
            <div className=" rounded-lg p-3 text-sm text-gray-600 text-center">
              <div className="flex justify-center gap-5 items-center mb-2">
                <button
                  onClick={prevMonth}
                  className="p-1 rounded-full hover:bg-[#717073]"
                >
                  <ChevronLeft size={16} />
                </button>
                <p className="font-medium">{`${monthName} ${year}`}</p>
                <button
                  onClick={nextMonth}
                  className="p-1 rounded-full hover:bg-[#717073]"
                >
                  <ChevronRight size={16} />
                </button>
              </div>

              <div className="grid grid-cols-7 gap-1 text-[16px] mb-1">
                {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
                  <span key={d} className="font-medium text-gray-500">
                    {d}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1 text-[16px]">
                {daysArray.map((day, i) =>
                  day ? (
                    <span
                      key={i}
                      className="p-1 rounded-full hover:bg-blue-100 cursor-pointer"
                    >
                      {day}
                    </span>
                  ) : (
                    <span key={i} />
                  )
                )}
              </div>
            </div>



          </div>

          {/* Actions */}
          <div className="grid md:grid-cols-3 gap-3 mt-4">
            <button className="flex-1 flex items-center justify-center text-[#717073] gap-1 border border-[#717073] rounded-lg py-2 text-sm hover:bg-gray-50">
              <Mail size={16} className="text-[#717073]" /> Send Email
            </button>
            <button className="flex-1 flex items-center justify-center gap-1 border text-[#717073] border-[#717073] rounded-lg py-2 text-sm hover:bg-gray-50">
              <MessageSquare size={16} className="text-[#717073]" /> Send Text
            </button>
            <button className="flex items-center justify-center gap-1 bg-[#237FEA] text-white text-sm py-2 rounded-lg hover:bg-blue-700 transition">
              <Download size={16} /> Export Data
            </button>
          </div>


        </div>
      </div>
      {isOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          {/* Modal box */}
          <div className="bg-white rounded-2xl max-h-[90vh] overflow-auto w-full max-w-md p-6 relative shadow-xl">
            {/* Close button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X size={22} />
            </button>

            <h2 className="text-lg font-semibold text-center mb-6">
              Add a new lead
            </h2>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Parent Name
                </label>
                <input
                  type="text"
                  name="parentName"
                  value={formData.parentName}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Child Name
                </label>
                <input
                  type="text"
                  name="childName"
                  value={formData.childName}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Postcode
                </label>
                <input
                  type="text"
                  name="postcode"
                  value={formData.postcode}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Package Interest
                </label>
                <input
                  type="text"
                  name="packageInterest"
                  value={formData.packageInterest}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Availability
                </label>
                <select
                  name="availability"
                  value={formData.availability}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-400 outline-none"
                >
                  <option value="">Select</option>
                  <option value="Weekdays">Weekdays</option>
                  <option value="Weekends">Weekends</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Source
                </label>
                <select
                  name="source"
                  value={formData.source}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-400 outline-none"
                >
                  <option value="">Select</option>
                  <option value="Referral">Referral</option>
                  <option value="Online">Online</option>
                  <option value="Flyer">Flyer</option>
                </select>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="w-auto px-7 bg-[#237FEA] text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition"
                >
                  Add Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default LeadsDashboard;
