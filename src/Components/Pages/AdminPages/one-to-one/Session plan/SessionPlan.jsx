import React, { useEffect, useState, useCallback } from "react";

import { Eye, User, Edit2, Trash2, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Loader from "../../contexts/Loader";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Loader2 } from "lucide-react";

import { usePermission } from "../../Common/permission";
const SessionPlan = () => {
    const MySwal = withReactContent(Swal);
    const [sessionGroup, setSessionGroup] = useState([]);
    const [loading, setLoading] = useState(false);
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const token = localStorage.getItem("adminToken");
    const { checkPermission } = usePermission();
    const [loadingPinId, setLoadingPinId] = useState(null); // Track which group is being pinned

    const canDelete = checkPermission({ module: 'session-plan-structure', action: 'delete' });
    const canEdit = checkPermission({ module: 'session-plan-structure', action: 'update' });

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
    const handleDelete = async (groupId, level) => {
        const myLevel = level?.toLowerCase();
        if (!groupId || !myLevel) return;

        const confirm = await Swal.fire({
            title: "Delete Session Plan?",
            html: `
      <p class="text-gray-700 text-sm">
        You’re about to delete the <b>${level}</b> session plan.<br/>
        This action cannot be undone.
      </p>
    `,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it",
            cancelButtonText: "Cancel",
            reverseButtons: true,
            confirmButtonColor: "#e53935",
            cancelButtonColor: "#6c757d",
            customClass: {
                popup: "rounded-2xl shadow-xl",
                confirmButton: "px-4 py-2 font-semibold",
                cancelButton: "px-4 py-2 font-semibold",
            },
        });

        if (!confirm.isConfirmed) return;

        try {
            // show loading modal
            Swal.fire({
                title: "Deleting...",
                html: `<div class="text-gray-600 text-sm mt-2">Please wait while we remove the session plan.</div>`,
                allowOutsideClick: false,
                allowEscapeKey: false,
                didOpen: () => {
                    Swal.showLoading();
                },
            });

            const response = await fetch(
                `${API_BASE_URL}/api/admin/one-to-one/session-plan-structure/${groupId}/level/${myLevel}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to delete session plan");
            }

            Swal.fire({
                icon: "success",
                title: "Deleted!",
                text: `${level} session plan has been successfully removed.`,
                showConfirmButton: false,
                timer: 1800,
                timerProgressBar: true,
            });

            fetchSessionGroup(); // refresh list

        } catch (error) {
            console.error("Delete error:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error.message || "Something went wrong while deleting.",
                confirmButtonColor: "#d33",
            });
        }
    };
    const handleDeleteGroup = async (groupId, level) => {
        const myLevel = level?.toLowerCase();
        if (!groupId || !myLevel) return;

        const confirm = await Swal.fire({
            title: "Delete Session Plan Group?",
            html: `
      <p class="text-gray-700 text-sm">
        You’re about to delete the session plan Group.<br/>
        This action cannot be undone.
      </p>
    `,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it",
            cancelButtonText: "Cancel",
            reverseButtons: true,
            confirmButtonColor: "#e53935",
            cancelButtonColor: "#6c757d",
            customClass: {
                popup: "rounded-2xl shadow-xl",
                confirmButton: "px-4 py-2 font-semibold",
                cancelButton: "px-4 py-2 font-semibold",
            },
        });

        if (!confirm.isConfirmed) return;

        try {
            // show loading modal
            Swal.fire({
                title: "Deleting...",
                html: `<div class="text-gray-600 text-sm mt-2">Please wait while we remove the session plan group.</div>`,
                allowOutsideClick: false,
                allowEscapeKey: false,
                didOpen: () => {
                    Swal.showLoading();
                },
            });

            const response = await fetch(
                `${API_BASE_URL}/api/admin/one-to-one/session-plan-structure/delete/${groupId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to delete session plan group");
            }

            Swal.fire({
                icon: "success",
                title: "Deleted!",
                text: data.message || `session plan group has been successfully removed.`,
                showConfirmButton: false,
                timer: 1800,
                timerProgressBar: true,
            });

            fetchSessionGroup(); // refresh list

        } catch (error) {
            console.error("Delete error:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error.message || "Something went wrong while deleting.",
                confirmButtonColor: "#d33",
            });
        }
    };
    const handlePinToggle = async (groupId, pinned = false, forceRePin = false) => {
        try {
            setLoadingPinId(groupId);

            // ✅ Logic: if already pinned, make unpin (0); if not pinned, make pin (1)
            // If forceRePin is true (from "Re-pin All"), always set pinned = 1
            const payload = { pinned: forceRePin ? 1 : pinned ? 0 : 1 };

            const response = await fetch(
                `${API_BASE_URL}/api/admin/one-to-one/session-plan-structure/${groupId}/repin`,
                {
                    method: "PATCH",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log("Pin/Unpin success:", data);

            fetchSessionGroup();
            setSessionGroup(prev =>
                prev.map(g =>
                    g.id === groupId ? { ...g, pinned: payload.pinned === 1 } : g
                )
            );
        } catch (error) {
            console.error("Error pinning/unpinning:", error);
        } finally {
            setLoadingPinId(null);
        }
    };


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
    console.log('sessionGroup', sessionGroup)
    return (
        <>
            <div className="flex justify-between py-5">
                <h2 className="font-bold text-2xl">Session Plan Structure</h2>
                <button
                    className="bg-[#237FEA] text-white p-3 px-4 rounded-2xl hover:bg-[#1f6fd2] transition"
                    // onClick={async () => {
                    //     setLoadingPinId("all");

                    //     for (const group of sessionGroup) {
                    //         if (group.pinned) { // ✅ only re-pin pinned ones
                    //             await handlePinToggle(group.id, true, true);
                    //         }
                    //     }

                    //     setLoadingPinId(null);
                    // }}
                    disabled={loadingPinId !== null}
                >
                    {loadingPinId ? "Re-pinning..." : "Re Pin Group"}
                </button>

            </div>

            <div className="p-6 bg-white min-h-[600px] rounded-3xl">
                <div className="grid md:grid-cols-4 gap-6">
                    {/* Left Section */}
                    {sessionGroup
                        // filter only groups that have at least one level key
                        .filter(group => group.levels && Object.keys(group.levels).length > 0)
                        // now safely map through them
                        .map((group, index) => {
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
                            console.log('group', group)
                            return (
                                <div key={index} className="bg-[#FAFAFA] border border-[#E2E1E5] rounded-3xl w-full  h-auto">
                                    {/* Header */}
                                    <div className="flex items-center justify-between p-5">
                                        <h2 className="text-[24px] font-semibold text-[#282829]">{group.groupName}</h2>
                                        <div className="flex items-center gap-2">
                                            <button
                                                className="text-gray-800 transition-transform duration-200 transform hover:scale-110 hover:opacity-100 opacity-90 cursor-pointer"
                                                onClick={() => navigate(`/one-to-one/session-plan-preview?id=${group.id}`)}
                                            >
                                                <Eye size={24} />
                                            </button>
                                            <button
                                                className="text-gray-800 transition-transform duration-200 transform hover:scale-110 hover:opacity-100 opacity-90 cursor-pointer"
                                                onClick={() => handlePinToggle(group.id, group.pinned)}
                                                disabled={loadingPinId === group.id}
                                            >
                                                {loadingPinId === group.id ? (
                                                    <Loader2 className="w-6 h-6 opacity-70 animate-spin " />
                                                ) : (
                                                    <img
                                                        src={
                                                            group.pinned
                                                                ? "/demo/synco/icons/PinIcon.png"
                                                                : "/demo/synco/icons/PinIcon.png"
                                                        }
                                                        alt="Pin"
                                                        className={`w-5 h-5 transition-transform duration-200 transform hover:scale-110 hover:opacity-100  cursor-pointer  ${group.pinned ? " opacity-90 " : "opacity-20"
                                                            }`} />
                                                )}
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
                                                    {canEdit &&
                                                        <button className="text-gray-500 hover:text-blue-600">
                                                            <img
                                                                onClick={() => navigate(`/one-to-one/session-plan-update?id=${group.id}&groupName=${encodeURIComponent(groups.title)}`)}
                                                                alt="Edit"
                                                                className="w-6 h-6 transition-transform duration-200 transform hover:scale-110 hover:opacity-100 opacity-90 cursor-pointer"
                                                                src="/demo/synco/icons/edit.png"
                                                            />
                                                        </button>
                                                    }
                                                    {canDelete && (
                                                        <button
                                                            onClick={() => {
                                                                if (groupsToShow.length === 1) {
                                                                    // Delete the whole group
                                                                    handleDeleteGroup(group.id, groups.title);
                                                                } else {
                                                                    // Delete only this level
                                                                    handleDelete(group.id, groups.title);
                                                                }
                                                            }}
                                                            className="relative group"
                                                            title="Delete session plan"
                                                        >
                                                            <img
                                                                alt="Delete"
                                                                src="/demo/synco/icons/deleteIcon.png"
                                                                className="w-6 h-6 opacity-90 transform transition-all duration-200 
                 group-hover:scale-110 group-hover:opacity-100 cursor-pointer"
                                                            />
                                                            {/* Tooltip */}
                                                            <span
                                                                className="absolute -top-8 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 
                 transition-all duration-200 bg-gray-800 text-white text-xs 
                 px-2 py-1 rounded-md whitespace-nowrap shadow-md"
                                                            >
                                                                {groupsToShow.length === 1
                                                                    ? `Delete Entire Group`
                                                                    : `Delete ${groups.title} Level`}
                                                            </span>
                                                        </button>
                                                    )}


                                                </div>
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
