import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import Select from "react-select";
import { FiMail, FiFileText, FiChevronUp, FiChevronDown } from "react-icons/fi";

const emailData = [
    { id: 1, name: "Class Cancellations", title: "Cancelled Rain", type: "Email", message: "Lorem ipsum..." },
    { id: 2, name: "Class Cancellations", title: "Cancelled Rain", type: "Email", message: "Lorem ipsum..." },
    { id: 3, name: "Class Cancellations", title: "Cancelled Unforseen", type: "Email", message: "Lorem ipsum..." },
    { id: 4, name: "Class Cancellations", title: "Class Cancellations Texts", type: "Text", message: "Lorem ipsum..." },
    { id: 5, name: "Credit for missed class", title: "Credit for missed class", type: "Text", message: "Lorem ipsum..." }
];

export default function SettingList() {
    const [activeTab, setActiveTab] = useState("Email");
    const [searchText, setSearchText] = useState("");
    const [selectedFilter, setSelectedFilter] = useState(null);
    const [openSection, setOpenSection] = useState({});
    const filteredData = emailData.filter(item =>
        item.title.toLowerCase().includes(searchText.toLowerCase())
    ); const grouped = {};
    filteredData.forEach(item => {
        if (!grouped[item.name]) grouped[item.name] = [];
        grouped[item.name].push(item);
    });
    console.log("Grouped Data:", grouped);
    const toggleSection = (section) => {
        setOpenSection(prev => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    return (
        <div className="max-w-6xl mx-auto px-6 py-8">
            <h2 className="text-base  mb-6">Settings / <span className="text-blue-600">Templates</span></h2>
            <div className="flex gap-10">
                <div className="w-4/12 bg-white  rounded-2xl border border-gray-200">
                    <div className="relative   m-6 max-w-sm">
                        <input
                            className="w-full  border border-gray-300 bg-white text-sm rounded-xl px-3 py-3 pl-10 focus:outline-none"
                            placeholder={`Search ${activeTab}`}
                            value={searchText}
                            onChange={e => setSearchText(e.target.value)}
                        />
                        <FiSearch className="absolute left-3 top-4 text-gray-400 text-lg" />
                    </div>
                    <div className="flex gap-3  m-6 bg-white border border-gray-300 rounded-xl p-0.5 w-fill">
                        {["Email", "Text"].map(tab => (
                            <motion.button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                whileTap={{ scale: 0.95 }}
                                className={`px-10 py-2 rounded-xl w-1/2 font-semibold ${activeTab === tab ? "bg-blue-500 text-white shadow" : "text-gray-700"
                                    }`}
                            >
                                {tab}
                            </motion.button>
                        ))}
                    </div>
                    <div className="space-y-4">
                        {Object.keys(grouped).map(section => (
                            <div key={section}>
                                {/* Accordion Header */}
                                <div
                                    onClick={() => toggleSection(section)}
                                    className="flex items-center justify-between  border-l-[4px] border-blue-600 bg-[#F7FBFF] p-4 cursor-pointer shadow-sm"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="bg-[#F7FBFF] p-2 rounded-lg">
                                            {section.toLowerCase().includes("text") ? (
                                                // <FiFileText className="text-blue-600" />
                                                <img src="/demo/synco/icons/folder-2.png" alt="" />
                                            ) : (
                                                // <FiMail className="text-blue-600" />
                                                <img src="/demo/synco/icons/folder-open.png" alt="" />
                                            )}
                                        </div>
                                        <h3 className="font-semibold text-base text-gray-900">{section}</h3>
                                        <p className="text-xs text-gray-400">{section.type}</p>
                                    </div>

                                    {openSection[section] ? (
                                        <FiChevronUp className="text-gray-500" />
                                    ) : (
                                        <FiChevronDown className="text-gray-500" />
                                    )}
                                </div>

                                {/* Accordion Items */}
                                <AnimatePresence>
                                    {openSection[section] && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="overflow-hidden bg-white border border-gray-100   pb-3 "
                                        >
                                            <div className="space-y-3">
                                                {grouped[section].map(item => (
                                                    <motion.div
                                                        key={item.id}
                                                        initial={{ opacity: 0, x: -8 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        exit={{ opacity: 0, x: -5 }}
                                                        className="flex  p-4 items-start gap-3 border-b border-gray-200 pl-8 last:border-none pb-4"
                                                    >
                                                        <div className="text-gray-600 mt-[2px]">
                                                            {item.type.toLowerCase() === "email" ? <img src="/demo/synco/icons/folder-2.png" alt="" /> : <img src="/demo/synco/icons/folder-2.png" alt="" />}
                                                        </div>

                                                        <div>
                                                            <p className="font-semibold text-base text-gray-900">{item.title}</p>
                                                            <p className="text-xs text-gray-400">{item.type}</p>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}

                        {filteredData.length === 0 && (
                            <p className="text-gray-400 text-sm text-center">No templates found.</p>
                        )}
                    </div>
                </div>
                <div className="w-8/12">

                    {/* Sidebar List */}


                    {/* Middle Preview (Centered Card) */}
                    <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col items-center col-span-1">

                        {/* Title */}
                        <div className=" flex items-center  justify-between border-b border-gray-200 w-full text-left text-[15px] font-medium text-gray-700 mb-6 pb-3">

                            <div> <h2 className="text-lg font-semibold">Cancelled Rain</h2></div>
                            <div className="icons flex gap-4 justify-center items-center ">
                                <img

                                    src="/demo/synco/icons/edit.png"
                                    alt="Edit"
                                    className="w-5 h-5 transition-transform duration-200 transform hover:scale-110 hover:opacity-100 opacity-90 cursor-pointer"
                                />
                                <img

                                    src="/demo/synco/icons/deleteIcon.png"
                                    alt="Edit"
                                    className="w-5 h-5 transition-transform duration-200 transform hover:scale-110 hover:opacity-100 opacity-90 cursor-pointer"
                                />
                            </div>

                        </div>

                        {/* iMessage mockup */}

                        
                        <div className="bg-white border border-gray-200 rounded-xl w-[350px] shadow-sm">

                            <div className="rounded-xl space-y-4">
                                <img className="w-full" src="/demo/synco/icons/TopNavigation.png" alt="" />
                                <div className="min-h-80 p-4 ">
                                    <div className="bg-gray-100 p-4 rounded-xl min-h-20 text-sm text-gray-800">
                                        helo bro how are you doing today? I hope everything is going well with you. Just wanted to check in and see if you need any help with anything. Let me know!
                                    </div>
                                </div>
                                <img className="w-full" src="/demo/synco/icons/mobileKeyboard.png" alt="" />

                            </div>
                        </div>

                        {/* View Button */}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            className="bg-blue-500 text-white px-10 py-2 rounded-xl font-semibold mt-6"
                        >
                            View
                        </motion.button>
                    </div>


                    {/* Right Empty Placeholder */}
                    <div className="col-span-1"></div>
                </div>
            </div>
        </div>
    );
}