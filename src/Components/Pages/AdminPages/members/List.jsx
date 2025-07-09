import React, { useEffect, useState } from 'react';
import Create from './Create';
import { useNavigate } from 'react-router-dom';
import { Check } from "lucide-react";
import { useMembers } from '../contexts/MemberContext';
import Loader from '../contexts/Loader';


const List = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const { members, fetchMembers, loading } = useMembers();
  const [checked, setChecked] = useState(false);
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
        <button
          onClick={() => setOpenForm(true)}
          className="bg-[#237FEA] flex items-center gap-2 cursor-pointer text-white px-4 py-[10px] rounded-xl hover:bg-blue-700 text-[16px] font-semibold"
        >
          <img src="/members/add.png" className='w-5' alt="" /> Add Member
        </button>
      </div>

      <div className="md:flex gap-6">
        <div
          className={`transition-all duration-300 ${openForm ? 'md:w-3/4' : 'w-full'} `}>
          {
            members.length > 0 ? (

              <div className={`overflow-auto rounded-4xl w-full`}>

                <table className="min-w-full bg-white text-sm">
                  <thead className="bg-[#F5F5F5] text-left border-1 border-[#EFEEF2]">
                    <tr className='font-semibold'>
                      <th className="p-4 text-[#717073]">
                        <div className="flex gap-2">
                        <button
                          onClick={() => setChecked(!checked)}
                          className={`w-5 h-5 me-2 flex items-center justify-center rounded-md border-2 border-gray-500 transition-colors focus:outline-none`}
                        >
                          {checked && <Check size={16} strokeWidth={3} className="text-gray-500" />}
                        </button>
                        User</div></th>
                      <th className="p-4 text-[#717073]">Role</th>
                      <th className="p-4 text-[#717073]">Phone</th>
                      <th className="p-4 text-[#717073]">Email</th>
                      <th className="p-4 text-[#717073]">Position</th>
                      <th className="p-4 text-[#717073]">Activity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {members.map((user, idx) => (
                      <tr key={idx} className="border-t  font-semibold text-[#282829] border-[#EFEEF2] hover:bg-gray-50">
                        <td className="p-4 cursor-pointer">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => setChecked(!checked)}
                              className={`w-5 h-5 me-2 flex items-center justify-center rounded-md border-2 border-gray-500 transition-colors focus:outline-none`}
                            >
                              {checked && <Check size={16} strokeWidth={3} className="text-gray-500" />}
                            </button>

                            <img
                              src={`${API_BASE_URL}/${user.profile}`}
                              alt={user.firstName}
                              onClick={() => navigate(`/members/update?id=${user.id}`)}
                              className="w-10 h-10 rounded-full  object-cover"
                            />
                            <span>{user.firstName || "-"}</span>
                          </div>
                        </td>
                        <td className="p-4">{user.role?.role || "-"}</td>
                        <td className="p-4">{user.phoneNumber || "-"}</td>
                        <td className="p-4">{user.email || "-"}</td>
                        <td className="p-4">{user.position || "-"}</td>
                        <td className="p-4">{new Date(user.createdAt).toLocaleDateString() || "-"}</td>

                      </tr>
                    ))}
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
