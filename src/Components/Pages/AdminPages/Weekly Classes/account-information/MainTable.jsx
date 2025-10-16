import React, { useState, useCallback, useEffect } from 'react'
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Check } from "lucide-react";

const MainTable = () => {
    const navigate = useNavigate();
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(null);
    const fetchMembers = useCallback(async () => {
        const token = localStorage.getItem("adminToken");
        if (!token) return;

        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/admin/book-membership`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const resultRaw = await response.json();
            const result = resultRaw.data || [];
            setMembers(result.membership);
        } catch (error) {
            console.error("Failed to fetch members:", error);
        } finally {
            setLoading(false);
        }
    }, []);

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
    const statusColors = {
        active: "bg-green-100 text-green-800",
        "In Progress": "bg-yellow-100 text-yellow-800",
        cancelled: "bg-red-100 text-red-800",
        "waiting list": "bg-gray-200 text-gray-800",
    };


    useEffect(() => {
        fetchMembers();
    }, [])

    return (
        <>

            <div className={`transition-all duration-300  w-full`}>

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
                                            Name
                                        </div>
                                    </th>
                                    <th className="p-4">Age</th>
                                    <th className="p-4">Venue</th>
                                    <th className="p-4">Date of Booking</th>
                                    <th className="p-4">Who Booked</th>
                                    <th className="p-4">Membership Plan</th>
                                    <th className="p-4">Life Cycle fo Membership</th>
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

                                                    <img
                                                        src={user.profile ? `${user.profile}` : '/demo/synco/members/dummyuser.png'}
                                                        alt={user.firstName || 'Profile Image'}
                                                        onClick={() => navigate(`/weekly-classes/account-information?id=${user.id}`)}
                                                        className="w-10 h-10 rounded-full object-contain"
                                                        onError={(e) => {
                                                            e.currentTarget.onerror = null; // prevent infinite loop
                                                            e.currentTarget.src = '/demo/synco/members/dummyuser.png';
                                                        }}
                                                    />
                                                    <span onClick={() => navigate(`/weekly-classes/account-information?id=${user.id}`)}>{user?.students[0].studentFirstName || '-'} {user?.students[0].studentLastName || ''}</span>
                                                </div>
                                            </td>
                                            <td className="p-4" onClick={() => navigate(`/weekly-classes/account-information?id=${user.id}`)}>{user.students[0].age || '-'}</td>
                                            <td className="p-4" onClick={() => navigate(`/weekly-classes/account-information?id=${user.id}`)}>{user.venue?.name || '-'}</td>
                                            <td className="p-4" onClick={() => navigate(`/weekly-classes/account-information?id=${user.id}`)}>{new Date(user.trialDate).toLocaleDateString() || '-'}</td>
                                            <td className="p-4" onClick={() => navigate(`/weekly-classes/account-information?id=${user.id}`)}>{`${user?.bookedByAdmin?.firstName || ''}
                                                        ${user?.bookedByAdmin?.lastName && user.bookedByAdmin.lastName !== 'null' ? ` ${user.bookedByAdmin.lastName}` : ''}`}</td>
                                            <td className="p-4">
                                                {user.paymentPlan?.title || '-'}
                                            </td>
                                            <td className="p-4">
                                                {`${user.paymentPlan?.duration} ${user.paymentPlan?.interval}${user.paymentPlan?.duration > 1 ? 's' : ''}`}
                                            </td>
                                            <td className="p-4">
                                                <span
                                                    className={`px-3 py-1 rounded-xl font-semibold ${statusColors[user.status] || "bg-gray-100 text-gray-800"}`}
                                                >
                                                    {user.status}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-center p-4  rounded-md bg-white">No Data Found</p>
                )}
            </div>

        </>
    )
}

export default MainTable
