import React, { useEffect, useState } from 'react';
import Create from './Create';
import { useNavigate } from 'react-router-dom';
import { Check } from "lucide-react";
import { useMembers } from '../contexts/MemberContext';
import Loader from '../contexts/Loader';
import { formatDistanceToNow } from 'date-fns';


const List = () => {
  const MyRole = localStorage.getItem("role");
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const { members, fetchMembers, loading } = useMembers();
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
    <div className="pt-1 bg-gray-50 min-h-screen">

      <div className={`flex pe-4 justify-between items-center mb-4 ${openForm ? 'md:w-3/4' : 'w-full'}`}>
        <h2 className="text-[28px] font-semibold">Admin panel</h2>

        {MyRole === 'Super Admin' && (
          <button
            onClick={() => setOpenForm(true)}
            className="bg-[#237FEA] flex items-center gap-2 cursor-pointer text-white px-4 py-[10px] rounded-xl hover:bg-blue-700 text-[16px] font-semibold"
          >
            <img src="/demo/synco/members/add.png" className="w-5" alt="" /> Add Member
          </button>
        )}


      </div>

      <div className="md:flex gap-6">
        <div
          className={`transition-all duration-300 ${openForm ? 'md:w-3/4' : 'w-full'} `}>
          {
            members.length > 0 ? (

              <div className={`overflow-auto rounded-4xl w-full`}>

                <table className="min-w-full bg-white text-sm">
                  <thead className="bg-[#F5F5F5] text-left border-1 border-[#EFEEF2]">
                    <tr className="font-semibold">
                      <th className="p-4 text-[#717073]">
                        <div className="flex gap-2 items-center">
                          <button
                            onClick={toggleSelectAll}
                            className="w-5 h-5 flex items-center justify-center rounded-md border-2 border-gray-500 focus:outline-none"
                          >
                            {isAllSelected && <Check size={16} strokeWidth={3} className="text-gray-500" />}
                          </button>
                          User
                        </div>
                      </th>
                      <th className="p-4 text-[#717073]">Role</th>
                      <th className="p-4 text-[#717073]">Phone</th>
                      <th className="p-4 text-[#717073]">Email</th>
                      <th className="p-4 text-[#717073]">Position</th>
                      <th className="p-4 text-[#717073]">Activity</th>
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
                                className={`lg:w-5 lg:h-5 w-full me-2 flex items-center justify-center rounded-md border-2 transition-colors focus:outline-none ${isChecked ? '' : 'border-gray-300'
                                  }`}
                              >
                                {isChecked && <Check size={16} strokeWidth={3} className="text-gray-500" />}
                              </button>


                              <img
                                src={
                                  user.profile
                                    ? `${API_BASE_URL}/${user.profile}`
                                    : '/SidebarLogos/OneTOOne.png'
                                }
                                alt={user.firstName || 'Profile Image'}
                                className="w-10 h-10 rounded-full object-contain"
                              />

                              <span>{user.firstName || "-"}</span>
                            </div>
                          </td>
                          <td className="p-4" onClick={() => navigate(`/members/update?id=${user.id}`)}>{user.role?.role || "-"}</td>
                          <td className="p-4" onClick={() => navigate(`/members/update?id=${user.id}`)}>{user.phoneNumber || "-"}</td>
                          <td className="p-4" onClick={() => navigate(`/members/update?id=${user.id}`)}>{user.email || "-"}</td>
                          <td className="p-4" onClick={() => navigate(`/members/update?id=${user.id}`)}>{user.position || "-"}</td>
                          <td className="p-4">
                            {user.createdAt
                              ? formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })
                              : "-"}
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
              onClick={() => setOpenForm(false)}
              className="absolute top-4 right-6 text-gray-400 hover:text-gray-700 text-xl"
              title="Close"
            >
              &times;
            </button>
            <Create />
          </div>
        )}
      </div>
    </div>
  );
};

export default List;
