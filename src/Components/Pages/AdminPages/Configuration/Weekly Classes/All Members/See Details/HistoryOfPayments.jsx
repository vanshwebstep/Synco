import { useState } from "react";

const HistoryOfPayments = () => {
    const [showPopup, setShowPopup] = useState(false);

    return (
        <div className="p-6 space-y-6">
            {/* Details */}
            <div className="bg-white rounded-2xl shadow-sm p-4">
                <h2 className="text-[24px] font-semibold mb-4">Details</h2>
                <div className="grid grid-cols-2 gap-y-4 text-[16px]">
                    <div className="col-span-1 text-gray-500 border-b border-gray-200 pb-4">Status</div>
                    <div className="col-span-1 font-medium text-green-600 text-end  border-b border-gray-200 pb-4">Active</div>

                    <div className="col-span-1 text-gray-500 border-b border-gray-200 pb-4">ID</div>
                    <div className="col-span-1 text-end border-b border-gray-200 pb-4">123456789</div>

                    <div className="col-span-1 text-gray-500 border-b border-gray-200 pb-4">Created</div>
                    <div className="col-span-1 text-end border-b border-gray-200 pb-4">01/01/2023</div>

                    <div className="col-span-1 text-gray-500 border-b border-gray-200 pb-4">Address</div>
                    <div className="col-span-1 text-end border-b border-gray-200 pb-4">
                        The king Fahad Academy, East Acton Lane, London W3 7HD
                    </div>

                    <div className="col-span-1 text-gray-500">Email</div>
                    <div className="col-span-1 text-end ">tom.jonas@gmail.com</div>
                </div>
            </div>

            {/* Subscription */}
            <div className="bg-white rounded-2xl shadow-sm p-6 flex justify-between items-center">
                <div>
                    <h2 className="text-[24px] font-semibold">Subscription</h2>
                    <span className="font-medium text-[16px] ">12 Months Plan</span>
                </div>
                <div className="flex items-center text-[16px] gap-4">
                    <span className="font-semibold ">3999 GBP</span>
                    <button className="text-blue-500  font-medium hover:underline">
                        Change
                    </button>
                </div>
            </div>

            {/* Payments */}
            <div className="bg-white rounded-2xl shadow-sm ">
                <h2 className="text-[24px] font-semibold mb-4 p-6">Payments</h2>
                <table className="w-full text-[16px]">
                    <thead className="text-gray-500  p-6 ">
                        <tr className="bg-gray-100 p-6 ">
                            <th className="text-left py-2 px-6">Status</th>
                            <th className="text-left py-2">Source</th>
                            <th className="text-left py-2">Charge</th>
                            <th className="text-left py-2">Paid put</th>
                            <th className="text-left py-2 w-30">Amount</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-300 p-6">
                        {/* Failed payment */}
                        <tr>
                            <td className="py-3 px-6 font-medium relative">
                                <div
                                    className="flex gap-2 items-center cursor-pointer"
                                    onClick={() => setShowPopup(!showPopup)}
                                >
                                    <div className="text-red-500">●</div>
                                    <span>May Membership fee</span>
                                </div>

                                {showPopup && (
                                    <div className="absolute right-[200px] top-[-30px] mt-2 w-140 bg-white shadow-lg rounded-xl p-4 z-10">
                                        <div className="text-red-500 font-semibold mb-2">Payment Failed</div>
                                        <div className="text-gray-700 mb-2">
                                            Unsuccessful payment of John Smith's subscription for the month of May.
                                        </div>
                                        <a
                                            href="/failed-payments"
                                            className="text-blue-600 hover:underline"
                                        >
                                            Go to the failed payments page
                                        </a>
                                    </div>
                                )}
                            </td>
                            <td>-</td>
                            <td>01/06/2023</td>
                            <td>-</td>
                            <td>3999 GBP</td>
                            <td className="text-left w-30">
                                <button className="text-blue-500  text-sm font-medium hover:underline">
                                    Retry Payment
                                </button>
                            </td>
                        </tr>

                        {/* Successful payments */}
                        <tr>
                            <td className="py-3 flex  gap-2 font-medium px-6 ">
                                <div className="text-green-600">● </div> April Membership fee
                            </td>
                            <td>-</td>
                            <td>01/06/2023</td>
                            <td>-</td>
                            <td>3999 GBP</td>
                            <td></td>
                        </tr>

                        <tr>
                            <td className="py-3 flex gap-2 font-medium px-6">
                                <div className="text-green-600">● </div> April Membership fee
                            </td>
                            <td>-</td>
                            <td>01/06/2023</td>
                            <td>-</td>
                            <td>3999 GBP</td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default HistoryOfPayments