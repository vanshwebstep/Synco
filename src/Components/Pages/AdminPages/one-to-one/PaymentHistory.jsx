import React from 'react'

const PaymentHistory = () => {
  const payments = [
    {
      status: "Gold Package x10 Sessions",
      source: "-",
      charge: "01/06/2023",
      paidOut: "-",
      amount: "3999 GBP",
    },
    {
      status: "Gold Package x10 Sessions",
      source: "-",
      charge: "01/06/2023",
      paidOut: "-",
      amount: "3999 GBP",
    },
  ];
  return (
    <>
      <div className="">
        <div className="bg-white rounded-2xl p-4 mb-4">
          {/* Header */}
          <div className="flex items-center gap-2 mb-2">


            <h2
              className='text-lg font-semibold text-gray-800 flex items-center gap-2 '
            >

              Details
            </h2>
          </div>

          {/* Feedback Info Table */}
          <div className="divide-y divide-gray-200">
            <div className="flex justify-between py-3 text-sm md:text-base">
              <span className="text-gray-500">Status</span>
              <span className="text-gray-800 font-semibold">Active</span>
            </div>
            <div className="flex justify-between py-3 text-sm md:text-base">
              <span className="text-gray-500">ID</span>
              <span className="text-gray-800 font-semibold">123456789</span>
            </div>
            <div className="flex justify-between py-3 text-sm md:text-base">
              <span className="text-gray-500">Created</span>
              <span className="text-gray-800 font-semibold">01/01/2023</span>
            </div>
            <div className="flex justify-between py-3 text-sm md:text-base">
              <span className="text-gray-500">Address</span>
              <span className="text-gray-800 font-semibold">The king Fahad Academy, East Acton Lane,London W3 7HD</span>
            </div>
            <div className="flex justify-between py-3 text-sm md:text-base">
              <span className="text-gray-500">Email</span>
              <span className="text-gray-800 font-semibold">tom.jonas@gmail.com</span>
            </div>

          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 w-full mx-auto">
          <h2 className="text-gray-800 text-lg font-semibold mb-4">Payments</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-600 text-sm">
                  <th className="py-3 px-4 font-medium">Status</th>
                  <th className="py-3 px-4 font-medium">Source</th>
                  <th className="py-3 px-4 font-medium">Charge</th>
                  <th className="py-3 px-4 font-medium">Paid out</th>
                  <th className="py-3 px-4 font-medium">Amount</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-100 hover:bg-gray-50 transition"
                  >
                    <td className="py-3 px-4 flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      {item.status}
                    </td>
                    <td className="py-3 px-4">{item.source}</td>
                    <td className="py-3 px-4">{item.charge}</td>
                    <td className="py-3 px-4">{item.paidOut}</td>
                    <td className="py-3 px-4 font-medium">{item.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}

export default PaymentHistory
