import React, { useEffect, useState, useCallback } from "react";
import { Eye, User, Edit2, Trash2, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Loader from "../contexts/Loader";
import Swal from "sweetalert2";
const SessionPlan = () => {
    const [sessionGroup, setSessionGroup] = useState([]);
    const [loading, setLoading] = useState(false);
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const token = localStorage.getItem("adminToken");


    const navigate = useNavigate();

    const fetchSessionGroup = useCallback(async () => {
        if (!token) return;
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/admin/one-to-one/session-plan-structure/listing`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) {
                // If response is not OK, throw error
                const errData = await response.json();
                throw new Error(errData.message || "Failed to fetch session groups");
            }

            const result = await response.json();
            console.log('result', result);
            setSessionGroup(result.data || []);
        } catch (err) {
            console.error("Failed to fetch sessionGroup:", err);
            await Swal.fire({
                icon: 'error',
                title: 'Error',
                text: err.message || "Something went wrong while fetching session groups",
                confirmButtonColor: '#d33',
            });
        } finally {
            setLoading(false);
        }
    }, [token, API_BASE_URL]);

    useEffect(() => {
        fetchSessionGroup();
    }, [fetchSessionGroup]);
    if (loading) {
        return (
            <>
                <Loader />
            </>
        )
    }
    return (
        <>
            <div className="flex justify-between py-5">
                <h2 className="font-bold text-2xl">Session Plan Structure</h2>
                <button className="bg-[#237FEA] text-white p-3 px-4 rounded-2xl">Re Pin Group</button>
            </div>

            <div className="p-6 bg-white min-h-[600px] rounded-3xl">
                <div className="grid md:grid-cols-4 gap-6">
                    {/* Left Section */}
                    {
                        sessionGroup.map((group, index) => {
                            const levelInfo = {
                                beginner: { title: "Beginner", age: "4–5 Years" },
                                intermediate: { title: "Intermediate", age: "6–7 Years" },
                                advanced: { title: "Advanced", age: "8–9 Years" },
                                pro: { title: "Pro", age: "10–12 Years" },
                            };

                            // Get only the levels that exist in group.levels
                            const groupsToShow = Object.keys(group.levels).map((key) => ({
                                key,
                                ...levelInfo[key], // title + age
                                data: group.levels[key], // exercises or whatever is inside levels
                            }));
                            return (
                                <div key={index} className="bg-[#FAFAFA] border border-[#E2E1E5] rounded-3xl w-full  h-auto">
                                    {/* Header */}
                                    <div className="flex items-center justify-between p-5">
                                        <h2 className="text-[24px] font-semibold text-[#282829]">{group.groupName}</h2>
                                        <div className="flex items-center gap-1">
                                            <button
                                                className="p-1.5 rounded-lg hover:bg-gray-100"
                                                onClick={() => navigate(`/one-to-one/session-plan-preview?id=${group.id}`)}
                                            >
                                                <Eye className="w-5 h-5 text-black" />
                                            </button>
                                            <button className="p-1.5 rounded-lg hover:bg-gray-100">
                                                <User className="w-5 h-5 text-black" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Groups */}
                                    <div className="p-4 pt-0 flex flex-col gap-3">
                                        {groupsToShow.map((groups, index) => (
                                            <div
                                                key={index}
                                                className="flex justify-between items-center bg-white border border-[#E2E1E5] rounded-2xl p-4 hover:shadow-md transition-all"
                                            >
                                                <div>
                                                    <p className="font-semibold text-[#282829]">{groups.title}</p>
                                                    <p className="text-sm text-gray-500 pt-1">{groups.age}</p>
                                                </div>
                                                <div class="flex gap-2">
                                                    <button className="text-gray-500 hover:text-blue-600">
                                                        <img
                                                            onClick={() => navigate(`/one-to-one/session-plan-update?id=${group.id}&groupName=${encodeURIComponent(groups.title)}`)}
                                                            alt="Edit"
                                                            className="w-6 h-6 transition-transform duration-200 transform hover:scale-110 hover:opacity-100 opacity-90 cursor-pointer"
                                                            src="/demo/synco/icons/edit.png"
                                                        />
                                                    </button>
                                                    <button class="text-gray-500 hover:text-red-500"><img alt="Delete" class="w-6 h-6  transition-transform duration-200 transform hover:scale-110 hover:opacity-100 opacity-90 cursor-pointer" src="/demo/synco/icons/deleteIcon.png" /></button></div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )
                        })
                    }

                    {/* Add Group Card */}
                    <button
                        onClick={() => navigate('/one-to-one/session-plan-create')}
                        className="border border-dashed border-gray-300 rounded-3xl w-[180px] h-[100px] flex flex-col justify-center items-center text-black hover:bg-gray-50 transition"
                    >
                        <Plus className="w-6 h-5 mb-2" />
                        <span className="font-medium text-sm">Add Group</span>
                    </button>
                </div>
            </div>
        </>
    );
};

export default SessionPlan;
