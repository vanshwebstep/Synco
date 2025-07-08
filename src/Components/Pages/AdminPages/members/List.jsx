import React, { useState } from 'react';
import Create from './Create';
import { useNavigate } from 'react-router-dom';

const users = new Array(9).fill({
  id: 1,
  name: "Mark Jones",
  role: "Admin",
  phone: "12345678901",
  email: "sarah@gmail.com",
  position: "Team Lead",
  activity: "2 Days Ago",
  avatar: "/members/dummyuser.png"
});
import { Check } from "lucide-react";


const List = () => {
  const [checked, setChecked] = useState(false);
  const navigate = useNavigate();
  const [openForm, setOpenForm] = useState(false);

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

          <div className={`overflow-auto rounded-4xl w-full`}>

            <table className="min-w-full bg-white text-sm">
              <thead className="bg-[#F5F5F5] text-left border-1 border-[#EFEEF2]">
                <tr className='font-semibold'>
                  <th className="p-4 text-[#717073]"><div className="flex gap-2">
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
                {users.map((user, idx) => (
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
                          src={user.avatar}
                          alt={user.name}
                          onClick={() => navigate(`/members/update?id=${user.id}`)}
                          className="w-10 h-10 rounded-full  object-cover"
                        />
                        <span>{user.name}</span>
                      </div>
                    </td>
                    <td className="p-4">{user.role}</td>
                    <td className="p-4">{user.phone}</td>
                    <td className="p-4">{user.email}</td>
                    <td className="p-4">{user.position}</td>
                    <td className="p-4">{user.activity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
