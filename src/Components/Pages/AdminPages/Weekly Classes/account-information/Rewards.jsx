import React, { useState } from "react";
import { Download } from "lucide-react";

const Rewards = () => {
  const [activeTab, setActiveTab] = useState("referrals");

  const referrals = Array(10).fill({
    date: "01/06/2023",
    name: "Steve Jones",
    email: "tom.jones@gmail.com",
    phone: "123456789",
    status: "Pending",
  });

  return (
    <div className="min-h-screen bg-[#F9F9FB] p-4 md:p-8 flex flex-col">
      {/* Tabs */}
      <div className="flex gap-3 mb-6 bg-white">
        <button
          onClick={() => setActiveTab("referrals")}
          className={`px-6 py-2 rounded-lg text-sm font-semibold ${activeTab === "referrals"
              ? "bg-[#237FEA] text-white"
              : "bg-white text-gray-700 border"
            }`}
        >
          Referrals
        </button>
        <button
          onClick={() => setActiveTab("loyalty")}
          className={`px-6 py-2 rounded-lg text-sm font-semibold ${activeTab === "loyalty"
              ? "bg-[#237FEA] text-white"
              : "bg-white text-gray-700 border"
            }`}
        >
          Loyalty Points
        </button>
      </div>

      {/* Header */}
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        Customer Referrals
      </h2>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Table */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-[#F5F5F5] text-left border border-[#EFEEF2]">
                <tr className="font-semibold text-[#717073]">
                  <th className="p-4">Date</th>
                  <th className="p-4">Referral name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {referrals.map((item, idx) => (
                  <tr key={idx} className="border-t font-semibold text-[#282829] border-[#EFEEF2] hover:bg-gray-50">

                    <td className="p-4">{item.date}</td>
                    <td className="p-4">{item.name}</td>
                    <td className="p-4">{item.email}</td>
                    <td className="p-4">{item.phone}</td>
                    <td className="p-4">
                      <span className="bg-[#FFF5E0] text-[#E6A400] px-3 py-1 rounded-lg font-medium text-sm">
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stats Card */}
        <div className="w-full md:w-[250px] flex flex-col items-center">
          <div className="bg-gradient-to-br from-[#237FEA] to-[#0A74DC] rounded-2xl text-white p-[2px]">
            <div className="bg-white text-center rounded-2xl py-6 px-8 w-full">
              <h3 className="text-[#237FEA] text-2xl font-bold">01</h3>
              <p className="text-gray-700 font-medium mb-4">
                Successful referral
              </p>
              <hr className="my-2 border-gray-200" />
              <h3 className="text-[#237FEA] text-2xl font-bold">01</h3>
              <p className="text-gray-700 font-medium">Free month</p>
            </div>
          </div>

          {/* Export Button */}
          <button className="mt-6 bg-[#237FEA] hover:bg-blue-700 text-white text-sm font-semibold flex items-center gap-2 px-5 py-2 rounded-lg shadow-sm">
            <Download size={16} />
            Export data
          </button>
        </div>
      </div>
    </div>
  );
};

export default Rewards;
