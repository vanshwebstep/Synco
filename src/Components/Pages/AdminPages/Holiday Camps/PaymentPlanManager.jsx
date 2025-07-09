import React, { useEffect,useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from "lucide-react";
import { usePayments } from '../contexts/PaymentPlanContext';
const users = new Array(9).fill({
  id: 1,
  name: "2023/24 Standard Pricing",
  NoOfPlans: "2",
  CreatedDate: "Sat 7 Sep",
  email: "sarah@gmail.com",
  position: "Team Lead",
  activity: "2 Days Ago",
  avatar: "/members/dummyuser.png"
});

const PaymentPlanManagerList = () => {
  const { fetchGroups } = usePayments();
  const navigate = useNavigate();
  const [openForm, setOpenForm] = useState(false);
  const [checked, setChecked] = useState(false);
 useEffect(() => {
    const getPackages = async () => {
      try {
        const response = await fetchGroups();
        console.log("Fetched packages:", response);
        // do something with response (set state, display, etc.)
      } catch (error) {
        console.error("Error fetching packages:", error);
      }
    };

    getPackages();
  }, [fetchGroups]);
  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">

      <div className={`flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-3 ${openForm ? 'md:w-3/4' : 'w-full md:w-[55%]'}`}>
        <h2 className="text-2xl font-semibold">Payment Plan Manager</h2>
        <button
           onClick={() => navigate(`/holiday-camps/add-payment-plan-group`)}
          // onClick={() => setOpenForm(true)}
          className="bg-[#237FEA] flex items-center gap-2 text-white px-4 py-[10px] rounded-xl hover:bg-blue-700 text-[16px] font-semibold"
        >
          <img src="/members/add.png" className='w-5' alt="" /> Add Payment Plan Group
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className={`transition-all duration-300 w-full ${openForm ? 'md:w-3/4' : 'md:w-[55%]'}`}>
          <div className="overflow-x-auto w-full rounded-2xl border border-gray-200">
            <table className="w-full bg-white text-sm">
              <thead className="bg-[#F5F5F5] text-left">
                <tr className='font-semibold'>
                  <th className="p-4 text-[14px] text-[#717073]">Name</th>
                  <th className="p-4 text-[#717073]">No. of Plans</th>
                  <th className="p-4 text-[#717073]">Date Created</th>
                  <th className="p-4 text-[#717073] text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, idx) => (
                  <tr key={idx} className="border-t font-semibold text-[#282829] border-gray-200 hover:bg-gray-50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setChecked(!checked)}
                          className={`w-5 h-5 me-2 flex items-center justify-center rounded-md border-2 border-gray-500 transition-colors focus:outline-none`}
                        >
                          {checked && <Check size={16} strokeWidth={3} className="text-gray-500" />}
                        </button>
                        <span>{user.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-center">{user.NoOfPlans}</td>
                    <td className="p-4">{user.CreatedDate}</td>
                    <td className="p-4">
                      <div className='flex gap-2 items-center justify-center'>
                        <img src="/icons/Show.png" alt="" />
                        <img src="/icons/edit.png" alt="" />
                        <img src="/icons/deleteIcon.png" alt="" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {openForm && (
          <div className="w-full md:w-1/4 bg-white rounded-2xl p-4 relative shadow-md">
            <button
              onClick={() => setOpenForm(false)}
              className="absolute top-2 right-3 text-gray-400 hover:text-gray-700 text-xl"
              title="Close"
            >
              &times;
            </button>
            {/* Add your form content here */}
            <div className="text-gray-500 text-sm">Form Section (coming soon)</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentPlanManagerList;
