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

const List = () => {
  const navigate = useNavigate();
  const [openForm, setOpenForm] = useState(false);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      <div className={`flex justify-between items-center mb-4 ${openForm ? 'md:w-3/4' : 'w-full'}`}>
        <h2 className="text-2xl font-semibold">Admin panel</h2>
        <button
          onClick={() => setOpenForm(true)}
          className="bg-[#237FEA] cursor-pointer text-white px-4 py-2 rounded hover:bg-blue-700 text-sm font-medium"
        >
          + Add Member
        </button>
      </div>

      <div className="md:flex gap-6">
        <div
          className={`transition-all duration-300 ${openForm ? 'md:w-3/4' : 'w-full'} `}>

          <div className={`overflow-auto rounded-2xl border border-gray-200`}>

            <table className="min-w-full bg-white text-sm">
              <thead className="bg-[#F5F5F5] text-left">
                <tr className='font-semibold'>
                  <th className="p-4 text-[#717073]"><div className="flex gap-2">
                    <input type="checkbox" />User</div></th>
                  <th className="p-4 text-[#717073]">Role</th>
                  <th className="p-4 text-[#717073]">Phone</th>
                  <th className="p-4 text-[#717073]">Email</th>
                  <th className="p-4 text-[#717073]">Position</th>
                  <th className="p-4 text-[#717073]">Activity</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, idx) => (
                  <tr key={idx} className="border-t  font-semibold text-[#282829] border-gray-200 hover:bg-gray-50">
                    <td className="p-4">
                      <div onClick={() => navigate(`/members/update?${user.id}`)} className="flex items-center gap-3">
                        <input type="checkbox" />
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <span>{user.name}</span>
                      </div>
                    </td>
                    <td className="p-4">{user.role}</td>
                    <td className="p-4">{user.phone}</td>
                    <td className="p-4">{user.email}</td>
                    <td className="p-4">{user.position}</td>
                    <td className="p-4 text-gray-500">{user.activity}</td>
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
              className="absolute top-2 right-3 text-gray-400 hover:text-gray-700 text-xl"
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
