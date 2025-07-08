import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from "lucide-react";
import { Trash2, Eye } from 'lucide-react';

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

const AddPaymentPlanGroup = () => {
  const navigate = useNavigate();
  const [openForm, setOpenForm] = useState(false);
  const [checked, setChecked] = useState(false);
  const [paymentPlans, setPaymentPlans] = useState([
    'Holiday Camp: 1 Student',
    'Holiday Camp: 2 Student'
  ]);

  const removePlan = (index) => {
    const updated = [...paymentPlans];
    updated.splice(index, 1);
    setPaymentPlans(updated);
  };
  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">

      <div className={`flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-3 ${openForm ? 'md:w-3/4' : 'w-full md:w-1/2'}`}>
        <h2 className="text-2xl font-semibold">Add Payment Plan Group</h2>
        {/* <button
         onClick={() => navigate(`/holiday-camps/add-payment-plan-group`)}
        //   onClick={() => setOpenForm(true)}
          className="bg-[#237FEA] flex items-center gap-2 text-white px-4 py-[10px] rounded-xl hover:bg-blue-700 text-[16px] font-semibold"
        >
          <img src="/members/add.png" className='w-5' alt="" /> Add Pasyment Plan Group
        </button> */}
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className={`transition-all duration-300 w-full ${openForm ? 'md:w-3/4' : 'md:w-1/2'}`}>
          <div className="rounded-2xl ">
          <form className="mx-auto space-y-4">
      {/* Group Name */}
      <div>
        <label className="block text-base font-semibold text-gray-700 mb-1">
          Payment Plan Group Name
        </label>
        <input
          type="text"
          placeholder="Enter Group Name"
          className="w-full px-4 font-semibold text-base py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-base font-semibold text-gray-700 mb-1">
          Description
        </label>
        <input
          type="text"
          placeholder="Add Internal  reference"
          className="w-full px-4 font-semibold py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Payment Plans */}
      <div>
        <label className="block text-base font-semibold text-gray-700 mb-1">
          Payment Plans
        </label>
        <div className="space-y-2">
          {paymentPlans.map((plan, idx) => (
            <div
              key={idx}
              className="flex items-center font-semibold justify-between px-4 py-2 border border-gray-200 rounded-lg bg-gray-50"
            >
              <span>{plan}</span>
              <button
                type="button"
                onClick={() => removePlan(idx)}
                className="text-gray-500 hover:text-red-500"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Add Payment Plan Button */}
      <button
        type="button"
        className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700"
      >
        Add Payment Plan
      </button>

      {/* Footer Buttons */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          className="flex items-center gap-1 border border-blue-500 text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50"
        >
          <Eye size={16} />
          Preview Payment Plans
        </button>

        <button
          type="submit"
          className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Create Group
        </button>
      </div>
    </form>
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
            <div className="text-gray-500 text-base">Form Section (coming soon)</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddPaymentPlanGroup;
