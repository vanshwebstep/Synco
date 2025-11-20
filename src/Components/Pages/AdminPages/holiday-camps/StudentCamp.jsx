import { useState } from "react";
import { GiMagnet } from "react-icons/gi";
import {
    ChevronDown,
    Check, Search,
    CirclePoundSterling,
    X
} from "lucide-react";
import Swal from "sweetalert2";
import { PiUsersThreeBold } from "react-icons/pi";
import { useAccountsInfo } from "../contexts/AccountsInfoContext";
import Select from "react-select";
import { useNavigate } from "react-router-dom";




const StudentCamp = () => {
    const navigate = useNavigate();
    const [selected, setSelected] = useState(1);
    const camps = Array.from({ length: 7 }, (_, i) => ({
        id: i + 1,
        title: "Kensington",
        subtitle: "Spring camp",
        date: "Monday 10 April 2022, 2:50pm",
        capacity: "24/40",
    }));
    const [age, setAge] = useState({
        a1: true,
        a2: false,
        a3: false,
    });

    const toggle = (key) => {
        setAge((prev) => ({ ...prev, [key]: !prev[key] }));
    };
    const dateOptions = [{ label: "All", value: "all" }];
    const categoryOptions = [{ label: "Open Camp", value: "open" }];
    const [selectedUserIds, setSelectedUserIds] = useState([]);
    const [openAgeFilter, setOpenAgeFilter] = useState(null);
    const [openDateFilter, setOpenDateFilter] = useState(null);
    const { sendOnetoOneMail } = useAccountsInfo();
    const summaryCards = [
        { icon: PiUsersThreeBold, iconStyle: "text-[#3DAFDB] bg-[#E6F7FB]", title: "Total Students", value: 30 },
        { icon: CirclePoundSterling, iconStyle: "text-[#6F65F1] bg-[#F6F6FE]", title: "Revenue", value: '£945.00' },
        { icon: CirclePoundSterling, iconStyle: "text-[#6F65F1] bg-[#F6F6FE]", title: "Average Price", value: '£105.00' },
        { icon: GiMagnet, iconStyle: "text-[#099699] bg-[#F0F9F9]", title: "Top Source", value: `Existing Member`, },
    ];

    const leadsData = Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        name: "Tom Jones",
        age: 10,
        medicalInfo: "Asthma",
        price: "£100",
        source: "Existing Customer",
        status: "Active",
    }));
    const exportToExcel = () => {
        if (!leadsData || !leadsData.length) {
            alert("No leads data available to export.");
            return;
        }

        // Prepare data
        const dataToExport = leadsData
            .filter((lead) => selectedUserIds.length === 0 || selectedUserIds.includes(lead.id))
            .map((lead) => ({
                "Parent Name": lead.parentName || "-",
                "Child Name": lead.childName || "-",
                Age: lead.age || "-",
                Postcode: lead.postCode || "-",
                "Package Interest": lead.packageInterest || "-",
                Availability: lead.availability || "-",
                Source: lead.source || "-",
                Status: lead.status || "-",
            }));

        if (!dataToExport.length) {
            alert("No data selected to export.");
            return;
        }

        // Convert to worksheet
        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "LeadsData");

        // Export to file
        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(data, "LeadsData.xlsx");
    };
    return (
        <>
            <div className="flex gap-5">
                <div className='md:w-[28%]'>

                    <div className=" bg-white py-4 rounded-2xl shadow-sm pb-0 overflow-auto">
                        <div className="flex justify-between items-center px-4">
                            <h2 className="text-xl font-semibold mb-4">Search now</h2>
                            <img
                                src="/demo/synco/DashboardIcons/filtericon.png"
                                onClick={() => setOpenDateFilter(true)}
                                className="w-4 h-4 sm:w-5 sm:h-5 cursor-pointer"
                                style={{ filter: "brightness(0.5)" }}
                                alt=""
                            />

                        </div>



                        <div className="flex border border-[#E2E1E5] p-1 rounded-xl w-full md:w-11/12 m-auto">
                            <button className="flex-1 py-2 rounded-xl bg-[#237FEA] text-white font-medium">
                                Camp List
                            </button>
                            <button className="flex-1 py-2 rounded-xl text-gray-600 font-medium">
                                Venue List
                            </button>
                        </div>

                        <div className="mt-4 px-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search camps..."
                                    className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg outline-none "
                                />
                            </div>
                        </div>

                        <div className="mt-5 ">
                            {camps.map((camp) => (
                                <div
                                    key={camp.id}
                                    className={`flex p-4 items-start justify-between border-b border-gray-200 ${selected === camp.id ? "bg-[#F5F5F5] border-none" : "bg-none"}`}
                                >
                                    <div className="flex items-start gap-3">

                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelected(camp.id); // same functionality as before
                                            }}
                                            className={`mt-1 w-5 h-5 flex items-center justify-center rounded-md border-2 
        ${selected === camp.id ? "border-none bg-blue-500" : "border-gray-300"}`}
                                        >
                                            {selected === camp.id && (
                                                <Check size={14} strokeWidth={3} className={`${selected === camp.id ? "text-white" : "text-gray-500"} `} />
                                            )}
                                        </button>



                                        <div>
                                            <div className="font-bold text-[#237FEA] text-[15px]">{camp.title}</div>
                                            <div className="text-black font-semibold text-sm">{camp.subtitle}</div>
                                            <div className="text-gray-500 text-xs mt-1">{camp.date}</div>
                                        </div>
                                    </div>

                                    {/* Capacity */}
                                    <div className="text-gray-500 text-sm whitespace-nowrap">
                                        Capacity - <span className="font-medium">{camp.capacity}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
                <div className='md:w-[72%]'>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        {summaryCards.map((card, i) => {
                            const Icon = card.icon;
                            return (
                                <div
                                    key={i}
                                    className="bg-white rounded-2xl p-4 border border-gray-100 flex  items-center gap-4 hover:shadow-md transition-all duration-200"
                                >
                                    <div>
                                        <div
                                            className={`p-2 h-[50px] w-[50px] rounded-full ${card.iconStyle} bg-opacity-10 flex items-center justify-center`}
                                        >
                                            <Icon size={24} className={card.iconStyle} />
                                        </div>
                                    </div>
                                    <div className="mt-3">
                                        <p className="text-sm text-gray-500">{card.title}</p>
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-xl font-semibold mt-1">{card.value}</h3>
                                            {card.change && (
                                                <p className="text-green-600 text-xs mt-1">({card.change})</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                    </div>
                    <div className="flex justify-between items-center mb-4">
                        <div className="mt-4 flex gap-6 items-center">
                            <h2 className="text-2xl font-semibold ">Student Info</h2>
                            <div className="relative">
                                <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search Students"
                                    className="w-full pl-10 bg-white pr-3 py-2.5 border border-gray-200 rounded-lg outline-none "
                                />
                            </div>
                        </div>
                        <img
                            src="/demo/synco/DashboardIcons/filtericon.png"
                            className="w-4 h-4 sm:w-5 sm:h-5 cursor-pointer"
                            onClick={() => setOpenAgeFilter(true)}
                            style={{ filter: "brightness(0.5)" }}
                            alt=""
                        />
                    </div>
                    {
                        leadsData.length > 0 ? (
                            <div className="overflow-auto rounded-2xl bg-white shadow-sm">
                                <table className="min-w-full text-sm">
                                    <thead className="bg-[#F5F5F5] text-left border border-[#EFEEF2]">
                                        <tr className="font-semibold text-[#717073]">
                                            <th className="py-3 px-4 whitespace-nowrap">Name</th>
                                            <th className="py-3 px-4 whitespace-nowrap">Age</th>
                                            <th className="py-3 px-4 whitespace-nowrap">Medical Information</th>
                                            <th className="py-3 px-4 whitespace-nowrap">Price Paid</th>
                                            <th className="py-3 px-4 whitespace-nowrap">Source</th>
                                            <th className="py-3 px-4 whitespace-nowrap">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {leadsData.map((lead, i) => {
                                            return (
                                                <tr
                                                    key={i}
                                                    onClick={() => navigate(`/holiday-camp/members/account-information?id=${lead.id}`)}
                                                    className="border-b border-[#EFEEF2] hover:bg-gray-50 transition cursor-pointer"
                                                >
                                                    <td className="py-3 px-4 whitespace-nowrap font-semibold">
                                                        <div className="flex items-center gap-3">
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setSelectedUserIds(lead.id); // same functionality as before
                                                                }}
                                                                className={`mt-1 w-5 h-5 flex items-center justify-center rounded-md border-2 
        ${selectedUserIds === lead.id ? "border-none bg-blue-500" : "border-gray-300"}`}
                                                            >
                                                                {selectedUserIds === lead.id && (
                                                                    <Check size={14} strokeWidth={3} className={`${selectedUserIds === lead.id ? "text-white" : "text-gray-500"} `} />
                                                                )}
                                                            </button>
                                                            {lead.name}
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-4 whitespace-nowrap">{lead.age}</td>
                                                    <td className="py-3 px-4 whitespace-nowrap">{lead.medicalInfo || "N/A"}</td>
                                                    <td className="py-3 px-4 whitespace-nowrap">{lead.price || "N/A"}</td>
                                                    <td className="py-3 px-4 whitespace-nowrap">{lead.source || "N/A"}</td>
                                                    <td className="py-3 px-4 whitespace-nowrap">
                                                        <span className="bg-green-50 text-[#34AE56] font-semibold capitalize px-7 py-2 rounded-xl text-xs font-medium">
                                                            {lead.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>

                            </div>

                        ) : (
                            <>
                                <p className="text-center py-3">No Data Found</p>
                            </>
                        )
                    }

                    <div className="flex gap-2 mt-5 justify-end">
                        <button
                            onClick={() => {
                                if (selectedUserIds && selectedUserIds.length > 0) {
                                    sendOnetoOneMail(selectedUserIds);
                                } else {
                                    Swal.fire({
                                        icon: "warning",
                                        title: "No Students Selected",
                                        text: "Please select at least one student before sending an email.",
                                        confirmButtonText: "OK",
                                    });
                                }
                            }}
                            style={{ width: "max-content" }}
                            className="flex gap-1 items-center justify-center bg-none border border-[#717073] text-[#717073] px-3 py-2 rounded-xl  text-[16px]"
                        >
                            <img
                                src="/demo/synco/icons/mail.png"
                                className="w-4 h-4 sm:w-5 sm:h-5"
                                alt=""
                            />
                            Send Email
                        </button>
                        <button style={{ width: "max-content" }} className="flex gap-1 items-center justify-center bg-none border border-[#717073] text-[#717073] px-3 py-2 rounded-xl  text-[16px]">
                            <img src='/demo/synco/icons/sendText.png' className='w-4 h-4 sm:w-5 sm:h-5' alt="" />
                            Send Text
                        </button>
                        <button style={{ width: "max-content" }} onClick={exportToExcel} className="flex gap-2 items-center justify-center bg-[#237FEA] text-white px-3 py-2 rounded-xl  text-[16px]">
                            <img src='/demo/synco/icons/download.png' className='w-4 h-4 sm:w-5 sm:h-5' alt="" />
                            Export Data
                        </button>
                    </div>
                </div>
            </div>
            {openDateFilter && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center px-4 z-50">
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-xl"
                    >
                        {/* Title */}
                        <div className="flex justify-between items-center">
                            <h2 className="text-[18px] font-semibold">Filter</h2>
                            <X className="cursor-pointer" onClick={() => setOpenDateFilter(null)} />
                        </div>

                        {/* Date */}
                        <div className="mb-4 mt-3">
                            <label className="text-gray-800 font-medium text-sm mb-2 block">Date</label>
                            <div className="relative">
                                <Select
                                    options={dateOptions}
                                    defaultValue={dateOptions[0]}
                                    styles={{
                                        control: (base) => ({
                                            ...base,
                                            borderRadius: "12px",
                                            padding: "5px",
                                            borderColor: "#d1d5db",
                                        }),
                                    }}
                                    components={{
                                        DropdownIndicator: () => (
                                            <ChevronDown className="w-5 h-5 text-gray-500 mr-2" />
                                        ),
                                    }}
                                />
                            </div>
                        </div>

                        {/* Category */}
                        <div className="mb-6">
                            <label className="text-gray-800 font-medium text-sm mb-2 block">Category</label>
                            <div className="relative">
                                <Select
                                    options={categoryOptions}
                                    defaultValue={categoryOptions[0]}
                                    styles={{
                                        control: (base) => ({
                                            ...base,
                                            borderRadius: "12px",
                                            padding: "5px",
                                            borderColor: "#d1d5db",
                                        }),
                                    }}
                                    components={{
                                        DropdownIndicator: () => (
                                            <ChevronDown className="w-5 h-5 text-gray-500 mr-2" />
                                        ),
                                    }}
                                />
                            </div>
                        </div>

                        {/* Apply Filter */}
                        <button className="w-full py-3 bg-blue-600 text-white text-sm rounded-xl shadow-md active:scale-[.98] transition">
                            Apply Filter
                        </button>
                    </div>
                </div>
            )}
            {openAgeFilter && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center px-4 z-50"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-xl"
                    >
                        <div className="flex justify-end">
                            <X className="cursor-pointer" onClick={() => setOpenAgeFilter(null)} />
                        </div>

                        <div className="mb-6">
                            <p className="text-gray-800 font-semibold mb-3">Search by age</p>
                            <div className="space-y-3">
                                {[
                                    { key: "a1", label: "4–6 years" },
                                    { key: "a2", label: "8–9 years" },
                                    { key: "a3", label: "10–12 years" },
                                ].map((item) => (
                                    <button
                                        key={item.key}
                                        className="flex items-center gap-3"
                                        onClick={() => toggle(item.key)}
                                    >
                                        <div
                                            className={`w-5 h-5 flex items-center justify-center rounded-md border-2
                                    ${age[item.key] ? "border-blue-600" : "border-gray-300"}`}
                                        >
                                            {age[item.key] && (
                                                <Check
                                                    size={14}
                                                    strokeWidth={3}
                                                    className="text-blue-600"
                                                />
                                            )}
                                        </div>

                                        <span className="text-sm text-gray-700">{item.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button className="w-full py-3 bg-blue-600 text-white text-sm rounded-xl shadow-md active:scale-[.98] transition">
                            Apply Filter
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}

export default StudentCamp
