import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from "lucide-react";
import { useMembers } from '../../../contexts/MemberContext';
import Loader from '../../../contexts/Loader';
import { usePermission } from '../../../Common/permission';

const Feedback = () => {
  const { checkPermission } = usePermission();
  const [openResolve, setOpenResolve] = useState(null);
  const [resolveData, setResolveData] = useState('');

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const members = [
    {
      id: 1,
      createdAt: '14/03/2023',
      role: { role: 'Positive' },
      phoneNumber: '1234567890',
      email: 'user1@example.com',
      position: 'Coach'
    },
    {
      id: 2,
      createdAt: '15/03/2023',
      role: { role: 'Negative' },
      phoneNumber: '0987654321',
      email: 'user2@example.com',
      position: 'Assistant'
    },
    {
      id: 3,
      createdAt: '16/03/2023',
      role: { role: 'Neutral' },
      phoneNumber: '1122334455',
      email: 'user3@example.com',
      position: 'Manager'
    }
  ]; const { fetchMembers, loading } = useMembers();
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const toggleCheckbox = (userId) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };
  const isAllSelected = members.length > 0 && selectedUserIds.length === members.length;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedUserIds([]);
    } else {
      const allIds = members.map((user) => user.id);
      setSelectedUserIds(allIds);
    }
  };


  const navigate = useNavigate();
  const [openForm, setOpenForm] = useState(false);
  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  if (loading) {
    return (
      <>
        <Loader />
      </>
    )
  }

  return (
    <>
      <div className={`pt-1 bg-gray-50 min-h-screen md:px-4 ${openResolve ? 'hidden' : 'block'}`}>
        {checkPermission(
          { module: "member", action: "create" }) && (
            <button
              onClick={() => setOpenForm(true)}
              className="bg-[#237FEA] md:absolute right-0 -top-0 flex items-center gap-2 cursor-pointer text-white px-4 py-2 rounded-xl hover:bg-blue-700 text-sm md:text-base font-semibold"
            >
              <img src="/demo/synco/members/add.png" className="w-5" alt="" />
              Add Feedback
            </button>
          )}

        {checkPermission({ module: "account-information", action: "view-listing" }) ? (
          <div className="md:flex md:gap-6 md:mt-0 mt-5">

            <div className={`transition-all duration-300 w-full`}>

              {members.length > 0 ? (
                <div className="overflow-auto rounded-2xl bg-white shadow-sm">
                  <table className="min-w-full text-sm">
                    <thead className="bg-[#F5F5F5] text-left border border-[#EFEEF2]">
                      <tr className="font-semibold text-[#717073]">
                        <th className="p-4">
                          <div className="flex gap-2 items-center">
                            <button
                              onClick={toggleSelectAll}
                              className="w-5 h-5 flex items-center justify-center rounded-md border-2 border-gray-500"
                            >
                              {isAllSelected && <Check size={16} strokeWidth={3} className="text-gray-500" />}
                            </button>
                            Date Submmited
                          </div>
                        </th>
                        <th className="p-4">Type of Feedback</th>
                        <th className="p-4">Venue</th>
                        <th className="p-4">Category</th>
                        <th className="p-4">Reason</th>
                        <th className="p-4">Agent Assigned</th>
                        <th className="p-4">Status</th>
                      </tr>
                    </thead>

                    <tbody>
                      {members.map((user, idx) => {
                        const isChecked = selectedUserIds.includes(user.id);
                        return (
                          <tr key={idx} className="border-t font-semibold text-[#282829] border-[#EFEEF2] hover:bg-gray-50">
                            <td className="p-4 cursor-pointer">
                              <div className="flex items-center gap-3">
                                <button
                                  onClick={() => toggleCheckbox(user.id)}
                                  className={`w-5 h-5 flex items-center justify-center rounded-md border-2 ${isChecked ? 'border-gray-500' : 'border-gray-300'}`}
                                >
                                  {isChecked && <Check size={16} strokeWidth={3} className="text-gray-500" />}
                                </button>

                                {user.createdAt}
                              </div>
                            </td>
                            <td className="p-4" onClick={() => navigate(`/configuration/members/update?id=${user.id}`)}>{user.role?.role || '-'}</td>
                            <td className="p-4" onClick={() => navigate(`/configuration/members/update?id=${user.id}`)}>{user.phoneNumber || '-'}</td>
                            <td className="p-4" onClick={() => navigate(`/configuration/members/update?id=${user.id}`)}>{user.email || '-'}</td>
                            <td className="p-4" onClick={() => navigate(`/configuration/members/update?id=${user.id}`)}>{user.position || '-'}</td>
                            <td className="p-4" onClick={() => navigate(`/configuration/members/update?id=${user.id}`)}>{user.position || '-'}</td>
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <button className='text-[#EDA600] bg-[#FDF6E5] px-5 rounded-xl p-2 '>
                                  In Progress
                                </button>
                                <button onClick={() => {
                                  setOpenResolve(true);
                                  setResolveData(user)
                                }} className='bg-[#237FEA] rounded-xl p-2 px-5  text-white'>
                                  Resolve
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-center p-4 border-dotted border rounded-md bg-white">No Data Found</p>
              )}
            </div>


          </div>
        ) : (
          <p className="text-center p-6 text-red-500 font-semibold">
            Not Authorized
          </p>
        )}

        {openForm && (
          <div className="fixed inset-0 bg-[#00000047] bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl w-[95%] md:w-[420px] md:h-[700px] overflow-auto shadow-lg relative">
              <div className="flex relative justify-center items-center border-b border-[#E2E1E5] px-6 py-4">
                <h2 className="text-lg font-semibold text-gray-800">Add Feedback</h2>
                <button
                  onClick={() => setOpenForm(false)}
                  className="text-gray-500 absolute left-5 top-4  hover:text-gray-800 text-xl"
                >
                  ×
                </button>
              </div>

              <div className="p-6 space-y-4">
                {/* Select Class */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Please select the classes you wish to add feedback for
                  </label>
                  <select className="w-full border border-[#E2E1E5] rounded-xl p-3 focus:ring-2 focus:ring-blue-400">
                    <option value="">Select Class</option>
                    <option value="Class A">Class A</option>
                    <option value="Class B">Class B</option>
                  </select>
                </div>

                {/* Feedback Type */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Feedback type</label>
                  <select className="w-full border border-[#E2E1E5] rounded-xl p-3 focus:ring-2 focus:ring-blue-400">
                    <option value="">Select Type</option>
                    <option value="Positive">Positive</option>
                    <option value="Negative">Negative</option>
                  </select>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-semibold text-[#282829] mb-1">Category</label>
                  <select className="w-full border border-[#E2E1E5] rounded-xl p-3 focus:ring-2 focus:ring-blue-400">
                    <option value="">Select Category</option>
                    <option value="Behavior">Behavior</option>
                    <option value="Attendance">Attendance</option>
                  </select>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-semibold text-[#282829] mb-1">Notes</label>
                  <textarea
                    className="w-full border border-[#E2E1E5] rounded-xl p-3 h-24 resize-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Write your notes here..."
                  ></textarea>
                </div>

                {/* Assign Agent */}
                <div>
                  <label className="block text-sm font-semibold text-[#282829] mb-1">Assign agent</label>
                  <select className="w-full border border-[#E2E1E5] rounded-xl p-3 focus:ring-2 focus:ring-blue-400">
                    <option value="">Select Agent</option>
                    <option value="Agent A">Agent A</option>
                    <option value="Agent B">Agent B</option>
                  </select>
                </div>

                {/* Buttons */}
                <div className="flex justify-end items-center gap-3 pt-4">
                  <button
                    onClick={() => setOpenForm(false)}
                    className="px-5 py-2 rounded-xl border border-[#E2E1E5] text-gray-700 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button className="px-6 py-2 bg-[#237FEA] text-white font-semibold rounded-xl hover:bg-blue-700">
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
      <div className={`min-h-screen bg-[#F9F9FB] flex flex-col  p-4 md:p-8 ${openResolve ? 'flex' : 'hidden'}`}>
        {/* Main Card */}
        <div className="bg-white rounded-2xl w-full max-w-4xl shadow-sm p-6 md:p-8">
          {/* Header */}
          <div className="flex items-center gap-2 mb-6">


            <h2
              className='text-lg font-semibold text-gray-800 flex items-center gap-2 '
              onClick={() => {
                setOpenResolve(false);
                setResolveData('');
              }}>
              <img
                src="/demo/synco/icons/arrow-left.png"
                alt="Back"
                className="w-5 h-5 md:w-6 md:h-6"
              />
              Feedback
            </h2>
          </div>

          {/* Feedback Info Table */}
          <div className="divide-y divide-gray-200">
            <div className="flex justify-between py-3 text-sm md:text-base">
              <span className="text-gray-500">Agent</span>
              <span className="text-gray-800 font-semibold">Nilio Bagga</span>
            </div>
            <div className="flex justify-between py-3 text-sm md:text-base">
              <span className="text-gray-500">Date submitted</span>
              <span className="text-gray-800 font-semibold">14/03/2023, 10:45am</span>
            </div>
            <div className="flex justify-between py-3 text-sm md:text-base">
              <span className="text-gray-500">Venue</span>
              <span className="text-gray-800 font-semibold">Acton</span>
            </div>
            <div className="flex justify-between py-3 text-sm md:text-base">
              <span className="text-gray-500">Class details</span>
              <span className="text-gray-800 font-semibold">Session 3, 14/06/2023</span>
            </div>
            <div className="flex justify-between py-3 text-sm md:text-base">
              <span className="text-gray-500">Feedback type</span>
              <span className="text-gray-800 font-semibold">Positive</span>
            </div>
            <div className="flex justify-between py-3 text-sm md:text-base">
              <span className="text-gray-500">Category</span>
              <span className="text-gray-800 font-semibold">Coaches</span>
            </div>
            <div className="flex justify-between py-3 text-sm md:text-base">
              <span className="text-gray-500">Notes</span>
              <span className="text-gray-800 font-semibold max-w-[60%] text-right">
                Coaches arriving late each week
              </span>
            </div>
          </div>
        </div>

        {/* Assigned To Card */}
        <div className="bg-white rounded-2xl w-full max-w-4xl shadow-sm mt-6 p-6 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-gray-800 font-semibold mb-3">Assigned to</h3>
            <div className="flex items-center gap-3">
              <img
                src="https://randomuser.me/api/portraits/men/32.jpg"
                alt="Ethan"
                className="w-10 h-10 rounded-full"
              />
              <span className="text-gray-800 font-semibold">Ethan</span>
            </div>
          </div>
          <button className="text-[#237FEA] font-semibold mt-3 md:mt-0 hover:underline">
            Change
          </button>
        </div>

        {/* Resolve Button */}
        <div className="w-full max-w-4xl flex justify-end mt-6">
          <button className="bg-[#237FEA] hover:bg-blue-700 text-white font-semibold px-8 py-2 rounded-xl">
            Resolve
          </button>
        </div>
      </div>

    </>

  );
};

export default Feedback;
