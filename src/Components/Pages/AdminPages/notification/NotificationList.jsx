import { EllipsisVertical, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useMembers } from "../contexts/MemberContext";
import Loader from "../contexts/Loader";
import Select from 'react-select';
import { useNotification } from "../contexts/NotificationContext";
import Swal from "sweetalert2";
const notification = new Array(8).fill({
    title: "Class canceled",
    createdBy: "Ella Marsh",
    date: "Sat 13th May",
    sentTo: [
        "/members/user1.png",
        "/members/user2.png",
        "/members/user3.png",
        "/members/user4.png",
        "/members/user1.png",
        "/members/user1.png",
        "/members/user1.png",
    ],
    category: "Cancel",
});
const categoryColors = {
    "Cancellation": "bg-orange-100 text-orange-600",
    "False Payment": "bg-yellow-100 text-yellow-600",
    "Cancel": "bg-gray-100 text-gray-600",
};

export default function NotificationList() {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const { loadingNotification, fetchNotification } = useNotification();
    const { members, fetchMembers, loading } = useMembers();
    const [openForm, setOpenForm] = useState(null);

    const [form, setForm] = useState({
        title: "",
        recipients: [],
        category: "",
        description: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("adminToken");

        if (!form.title || !form.category || !form.description || form.recipients.length === 0) {
            Swal.fire({
                icon: "warning",
                title: "Missing Fields",
                text: "Please fill all fields and select at least one recipient.",
            });
            return;
        }

        const data = new FormData();
        data.append("title", form.title);
        data.append("category", form.category);
        data.append("description", form.description);
        data.append(
            "recipients",
            JSON.stringify(form.recipients.map((r) => r.value))
        );

        try {
            Swal.fire({
                title: "Creating Notification...",
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading(),
            });

            const response = await fetch(`${API_BASE_URL}/api/admin/notification`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: data,
            });

            const result = await response.json();

            if (!response.ok) {
                Swal.fire({
                    icon: "error",
                    title: "Failed to Add Notification",
                    text: result.description || "Something went wrong.",
                });
                return;
            }

            Swal.fire({
                icon: "success",
                title: "Notification Created",
                text: result.description || "New notification was added successfully!",
                timer: 2000,
                showConfirmButton: false,
            });

            setForm({
                title: "",
                recipients: [],
                category: "",
                description: "",
            });
            setOpenForm(null);
            fetchNotification();

        } catch (error) {
            console.error("Error creating notification:", error);
            Swal.fire({
                icon: "error",
                title: "Network Error",
                text: error.description || "An error occurred while submitting the form.",
            });
        }
    };

    const recipientOptions = [
        { value: "all", label: "All" },
        ...members.map((member) => ({
            value: member.id,
            label: member.name || member.firstName,
        })),
    ];
    useEffect(() => {
        fetchMembers();
        fetchNotification();
    }, []);

    if (loading && loadingNotification) {
        return (
            <>
                <Loader />
            </>
        )
    }
    return (
        <>
            <div className="md:p-6 bg-gray-50 ">
                <div className="md:flex justify-between items-center mb-6">
                    <h1 className="text-[24px] font-semibold">Notification List</h1>
                    <div className="flex mt-3 md:mt-0 flex-wrap items-center gap-4">
                        <button className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white  border border-[#E2E1E5] text-[#717073] text-[16px] hover:bg-gray-100">
                            <img src="/members/calendar.png" className="w-5" alt="" />

                            Time Period
                        </button>
                        <button className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white  border border-[#E2E1E5] text-[#717073] text-[16px] hover:bg-gray-100">
                            <img src="/members/filter-vertical.png" className="w-5" alt="" />
                            Filter
                        </button>
                        <button onClick={() => setOpenForm(true)} className="cursor-pointer bg-[#237FEA] text-white px-4 py-2 rounded-xl font-semibold hover:bg-blue-700">
                            Create Notification
                        </button>
                    </div>
                </div>
                {notification.length > 0 ? (
                    <div className="bg-white rounded-3xl overflow-x-auto">
                        <table className="min-w-full bg-white text-sm">
                            <thead className="bg-[#F5F5F5] text-left border-1 border-[#EFEEF2]">
                                <tr className='font-semibold'>
                                    <th className="p-4 text-[#717073]">
                                        Notification Title</th>
                                    <th className="p-4 text-[#717073]">Created by</th>
                                    <th className="p-4 text-[#717073]">Date</th>
                                    <th className="p-4 text-[#717073] whitespace-nowrap">Sent to</th>
                                    <th className="p-4 text-[#717073]">Category</th>
                                </tr>
                            </thead>
                            <tbody>
                                {notification.map((item, idx) => (
                                    <tr key={idx} className="border-t  font-semibold text-[#282829] border-[#EFEEF2] hover:bg-gray-50">
                                        <td className="p-4 cursor-pointer">{item.title}</td>
                                        <td className="p-4">{item.createdBy}</td>
                                        <td className="p-4">{item.date}</td>
                                        <td className="p-4 whitespace-nowrap">
                                            <div className="flex w-full -space-x-2 overflow-auto">
                                                {item.sentTo.slice(0, 4).map((avatar, i) => (
                                                    <img
                                                        key={i}
                                                        src={avatar}
                                                        alt="avatar"
                                                        className="md:w-10 md:h-10 rounded-full border-2 border-white"
                                                    />
                                                ))}
                                                {item.sentTo.length > 4 && (
                                                    <div
                                                        className={`
    w-8 h-8 rounded-full text-xs flex items-center justify-center text-white bg-cover bg-center relative
  `}
                                                        style={{
                                                            backgroundImage: `url('/members/more.png')`,
                                                        }}
                                                    >
                                                        +{item.sentTo.length - 4}
                                                        <div className="absolute inset-0 text-black rounded-full flex items-center justify-center text-xs">
                                                            +{item.sentTo.length - 4}
                                                        </div>
                                                    </div>

                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex justify-between">
                                                <span
                                                    className={`px-3 py-1  rounded-xl  ${categoryColors[item.category] || "bg-[#717073] text-[#717073]"}`}
                                                >
                                                    {item.category}
                                                </span>
                                                <EllipsisVertical />
                                            </div>
                                        </td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                ) : (
                    <p className='text-center  p-4 border-dotted border rounded-md'>Notification Empty</p>
                )
                }
            </div>
            {openForm && (
                <div className="fixed inset-0 bg-[#0d0d0d7a] px-5 bg-opacity-40 z-50 flex items-center justify-center">
                    <div className="bg-white rounded-[20px] w-full max-w-[541px] p-6 relative shadow-lg">
                        <div className="flex items-center mb-6 md:gap-20 gap-5">
                            <button
                                onClick={() => setOpenForm(null)}
                                className="text-gray-500 hover:text-black"
                            >
                                <X />
                            </button>
                            <h2 className="text-center text-[#282829] md:text-[24px] text-md font-semibold">
                                Create New Notification
                            </h2>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block mb-1 text-[16px] font-medium text-[#282829]">
                                    Title
                                </label>
                                <input
                                    name="title"
                                    value={form.title}
                                    onChange={handleChange}
                                    className="w-full border border-[#E2E1E5] rounded-xl p-4 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block mb-1 text-[16px] font-medium text-[#282829]">
                                    Recipients
                                </label>
                                <Select
                                    isMulti
                                    name="recipients"
                                    options={recipientOptions}
                                    value={form.recipients}
                                    onChange={(selectedOptions) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            recipients: selectedOptions,
                                        }))
                                    }
                                    styles={{
                                        control: (base) => ({
                                            ...base,
                                            padding: "6px",
                                            borderRadius: "0.75rem",
                                            borderColor: "#E2E1E5",
                                            fontSize: "14px",
                                        }),
                                    }}
                                />
                            </div>

                            <div>
                                <label className="block mb-1 text-[16px] font-medium text-[#282829]">
                                    Category
                                </label>
                                <select
                                    name="category"
                                    value={form.category}
                                    onChange={handleChange}
                                    className="w-full border border-[#E2E1E5] rounded-xl p-4 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value=""></option>
                                    <option value="Complaints">Complaints</option>
                                    <option value="Cancelled Memberships">
                                        Cancelled Memberships
                                    </option>
                                    <option value="Payments">Payments</option>
                                </select>
                            </div>

                            <div>
                                <label className="block mb-1 text-[16px] font-medium text-[#282829]">
                                    Message
                                </label>
                                <textarea
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                    rows={5}
                                    className="w-full border border-[#E2E1E5] rounded-xl bg-[#FAFAFA] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                />
                            </div>
                        </div>

                        <div className="flex justify-between mt-6">
                            <button
                                onClick={() => setOpenForm(null)}
                                className="w-1/2 mr-2 py-4 font-semibold border border-[#E2E1E5] rounded-xl text-sm text-[#717073] hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="w-1/2 ml-2 py-4 font-semibold bg-[#237FEA] text-white rounded-xl text-sm hover:bg-blue-700"
                            >
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
