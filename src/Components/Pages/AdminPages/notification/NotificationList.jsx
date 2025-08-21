import { EllipsisVertical, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useMembers } from "../contexts/MemberContext";
import Loader from "../contexts/Loader";
import Select from 'react-select';
import { useNotification } from "../contexts/NotificationContext";
import Swal from "sweetalert2";


export default function NotificationList() {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const { loadingCustomNotification, customNotification, fetchCustomNotification } = useNotification();
    const { members, fetchMembers, loading } = useMembers();
    const [openForm, setOpenForm] = useState(null);
    const [showTimePeriodPopup, setShowTimePeriodPopup] = useState(false);
    const [showCategoryPopup, setShowCategoryPopup] = useState(false);

    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    const [selectedCategory, setSelectedCategory] = useState('');

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




        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${token}`);


        const raw = JSON.stringify({
            "title": form.title,
            "description": form.description,
            "category": form.category,
            "recipients": form.recipients
                .map((r) => r.value)
                .filter((v) => v !== undefined && v !== null && v !== "")
                .join(",")
        });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        try {
            Swal.fire({
                title: "Creating Notification...",
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading(),
            });

            const response = await fetch(`${API_BASE_URL}/api/admin/custom-notification`, requestOptions);

            const result = await response.json();




            if (!response.ok) {
                Swal.fire({
                    icon: "error",
                    title: "Failed to Add Notification",
                    text: result.message || result.error || "Something went wrong.",
                });
                return;
            }

            Swal.fire({
                icon: "success",
                title: "Notification Created",
                text: result.message || result.error || "New notification was added successfully!",
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
            fetchCustomNotification();

        } catch (error) {
            console.error("Error creating notification:", error);
            Swal.fire({
                icon: "error",
                title: "Network Error",
                text: error.message || error.error || "An error occurred while submitting the form.",
            });
        }
    };

  const storedAdmin = localStorage.getItem("adminInfo");
let adminId = null;

if (storedAdmin) {
  try {
    const parsedAdmin = JSON.parse(storedAdmin);
    adminId = parsedAdmin?.id || null;
  } catch (e) {
    console.error("Invalid adminInfo JSON in localStorage:", e);
  }
}

const recipientOptions = [
  { value: "all", label: "All" },
  ...members
    .filter((member) => member.id !== adminId) // ✅ Exclude logged-in admin
    .map((member) => ({
      value: member.id,
      label: `${member.name || member.firstName} (${member.email})`,
    })),
];

    useEffect(() => {
        fetchMembers();
        fetchCustomNotification();
    }, []);
    function formatFullDateWithSuffix(dateStr) {
        const date = new Date(dateStr);

        const day = date.getDate();
        const dayOfWeek = date.toLocaleString('default', { weekday: 'long' });
        const month = date.toLocaleString('default', { month: 'long' });
        const year = date.getFullYear();

        const getDaySuffix = (d) => {
            if (d > 3 && d < 21) return 'th';
            switch (d % 10) {
                case 1: return 'st';
                case 2: return 'nd';
                case 3: return 'rd';
                default: return 'th';
            }
        };

        return `${dayOfWeek}, ${day}${getDaySuffix(day)} ${month} ${year}`;
    }


    if (loading && loadingCustomNotification) {
        return (
            <>
                <Loader />
            </>
        )
    }
    const handleRecipientPopup = (recipients) => {
        const content = recipients.map(r =>
            `<li>${r.recipientEmail}</li>`
        ).join("");

        Swal.fire({
            title: recipients.length === 1 ? 'Recipient' : 'All Recipients',
            html: `<ul class="text-left pl-4 list-disc">${content}</ul>`,
            icon: 'info',
            confirmButtonText: 'Close',
        });
    };
    const filteredNotifications = customNotification.filter(item => {
        const createdDate = new Date(item.createdAt);
        const createdDateOnly = createdDate.toISOString().split('T')[0]; // "YYYY-MM-DD"

        const startMatch = dateRange.start ? createdDateOnly >= dateRange.start : true;
        const endMatch = dateRange.end ? createdDateOnly <= dateRange.end : true;

        const matchCategory = selectedCategory ? item.category === selectedCategory : true;

        return startMatch && endMatch && matchCategory;
    });

    console.log('filteredNotifications', filteredNotifications)

    return (
        <>
            <div className="md:p-6 bg-gray-50 ">
                <div className="md:flex justify-between items-center mb-6">
                    <h1 className="text-[24px] font-semibold">Notification List</h1>
                    <div className="flex mt-3 md:mt-0 flex-wrap items-center gap-4">
                        <button
                            onClick={() => setShowTimePeriodPopup(true)}
                            className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white border border-[#E2E1E5] text-[#717073] text-[16px] hover:bg-gray-100"
                        >
                            <img src="/demo/synco/members/calendar.png" className="w-5" alt="calendar" />
                            Time Period
                        </button>

                        <button
                            onClick={() => setShowCategoryPopup(true)}
                            className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white border border-[#E2E1E5] text-[#717073] text-[16px] hover:bg-gray-100"
                        >
                            <img src="/demo/synco/members/filter-vertical.png" className="w-5" alt="filter" />
                            Filter
                        </button>


                        <button onClick={() => setOpenForm(true)} className="cursor-pointer bg-[#237FEA] text-white px-4 py-2 rounded-xl font-semibold hover:bg-blue-700">
                            Create Notification
                        </button>
                    </div>
                </div>
                {filteredNotifications.length > 0 ? (
                    <div className="bg-white rounded-3xl overflow-x-auto">
                        <table className="min-w-full bg-white text-sm">
                            <thead className="bg-[#F5F5F5] text-left border-1 border-[#EFEEF2]">
                                <tr className='font-semibold'>
                                    <th className="p-4 text-[#717073]">Notification Title</th>
                                    <th className="p-4 text-[#717073]">Created by</th>
                                    <th className="p-4 text-[#717073]">Date</th>
                                    <th className="p-4 text-[#717073] whitespace-nowrap">Sent to</th>
                                    <th className="p-4 text-[#717073]">Category</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredNotifications.map((item, idx) => (
                                    <tr key={idx} className="border-t font-semibold text-[#282829] border-[#EFEEF2] hover:bg-gray-50">
                                        <td className="p-4 cursor-pointer">{item.title}</td>
                                        <td className="p-4">{item.createdBy?.name}</td>
                                        <td className="p-4">{formatFullDateWithSuffix(item.createdAt)}</td>

                                        <td className="p-4 whitespace-nowrap">
                                            <div className="flex items-center overflow-hidden">
                                                <div className="flex -space-x-2 cursor-pointer" onClick={() => handleRecipientPopup(item.recipients)}>
                                                    {item.recipients?.slice(0, 4).map((recipient, i) => (
                                                        <img
                                                            key={i}
                                                            src={recipient?.profileImage || "/demo/synco/SidebarLogos/OneTOOne.png"}
                                                            alt={recipient?.recipientEmail}
                                                            title={recipient?.recipientEmail}
                                                            className="w-8 h-8 rounded-full border-2 border-white object-cover"
                                                        />
                                                    ))}

                                                    {item.recipients?.length > 4 && (
                                                        <div className="w-8 h-8 rounded-full border-2 border-white bg-white text-xs font-semibold text-black flex items-center justify-center ring-2 ring-yellow-400">
                                                            +{item.recipients.length - 4}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>



                                        <td className="p-4">
                                            <div className="flex justify-between">
                                                <span className="px-3 py-1 rounded-lg text-[#717073] bg-gray-100">
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
                    <p className='text-center p-4 border-dotted border rounded-md'>Notification Empty</p>
                )}

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
            {showTimePeriodPopup && (
                <div className="fixed inset-0 bg-black/10 z-50 flex items-center justify-center">
                    <div className="bg-white rounded-2xl p-6 w-[90%] max-w-md shadow-xl">
                        <h2 className="text-lg font-semibold mb-4">Select Time Period</h2>
                        <div className="flex items-center gap-2 mb-6">
                            <input
                                type="date"
                                value={dateRange.start}
                                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                                className="w-full border border-[#E2E1E5] px-3 py-2 rounded-lg"
                            />
                            <span className="text-[#717073]">to</span>
                            <input
                                type="date"
                                value={dateRange.end}
                                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                                className="w-full border border-[#E2E1E5] px-3 py-2 rounded-lg"
                            />
                        </div>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => {
                                    setDateRange({ start: '', end: '' });
                                    setShowTimePeriodPopup(false);
                                }}
                                className="text-sm text-gray-600 hover:underline"
                            >
                                Clear
                            </button>
                            <button
                                onClick={() => setShowTimePeriodPopup(false)}
                                className="bg-[#237FEA] text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium"
                            >
                                Apply
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {showCategoryPopup && (
                <div className="fixed inset-0 bg-black/10 z-50 flex items-center justify-center">
                    <div className="bg-white rounded-2xl p-6 w-[90%] max-w-md shadow-xl">
                        <h2 className="text-lg font-semibold mb-4">Filter by Category</h2>
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-full border border-[#E2E1E5] px-3 py-2 rounded-lg text-[#717073] mb-6"
                        >
                            <option value="">All Categories</option>
                            <option value="Complaints">Complaints</option>
                            <option value="Payments">Payments</option>
                            <option value="Cancelled Memberships">Cancellations</option>
                            <option value="Lesson Quality">Lesson Quality</option>
                            <option value="New Courses">New Courses</option>
                            <option value="System Updates">System Updates</option>
                        </select>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => {
                                    setSelectedCategory('');
                                    setShowCategoryPopup(false);
                                }}
                                className="text-sm text-gray-600 hover:underline"
                            >
                                Clear
                            </button>
                            <button
                                onClick={() => setShowCategoryPopup(false)}
                                className="bg-[#237FEA] text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium"
                            >
                                Apply
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </>
    );
}
