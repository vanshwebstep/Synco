import React from "react";
import { Eye, User, Edit2, Trash2, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SessionPlan = () => {
    const groups = [
        { title: "Beginners", age: "4–5 Years" },
        { title: "Intermidiate", age: "6–7 Years" },
        { title: "Advanced", age: "8–9 Years" },
        { title: "Pro", age: "10–12 Years" },
    ];
    const navigate = useNavigate();

    return (
        <>
        <div className="flex justify-between py-5">
            <h2 className="font-bold text-2xl">Session Plan Structure</h2>
            <button className="bg-[#237FEA] text-white p-3 px-4 rounded-2xl">Re Pin Group</button>
        </div>
        
        <div className="p-6 bg-white min-h-[600px] rounded-3xl">
            <div className="flex flex-wrap gap-6 ">
                {/* Left Section */}
                <div className="bg-[#FAFAFA]  border border-[#E2E1E5] rounded-3xl w-full md:w-[375px] h-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between p-5 ">
                        <h2 className="text-[24px] font-semibold text-[#282829]">Session Structure</h2>
                        <div className="flex items-center gap-1">
                            <button className="p-1.5 rounded-lg hover:bg-gray-100">
                                <Eye className="w-5 h-5 text-black" />
                            </button>
                            <button className="p-1.5 rounded-lg hover:bg-gray-100">
                                <User className="w-5 h-5 text-black" />
                            </button>
                        </div>
                    </div>

                    {/* Groups */}
                    <div className="p-4 pt-0 flex flex-col gap-3">
                        {groups.map((group, index) => (
                            <div
                                key={index}
                                className="flex justify-between items-center bg-white border border-[#E2E1E5] rounded-2xl p-4 hover:shadow-md transition-all"
                            >
                                <div>
                                    <p className="font-semibold text-[#282829]">{group.title}</p>
                                    <p className="text-sm text-gray-500 pt-1">{group.age}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button className="p-1 hover:bg-gray-100 rounded-lg">
                                        <img
                                            src="/demo/synco/icons/edit.png"
                                            alt="Edit"
                                            className="w-6 h-6 transition-transform duration-200 transform hover:scale-110 hover:opacity-100 opacity-90 cursor-pointer"
                                        />
                                    </button>
                                    <button className="p-1 hover:bg-gray-100 rounded-lg">
                                        <img
                                            src="/demo/synco/icons/deleteIcon.png"
                                            alt="Delete"
                                            className="w-6 h-6  transition-transform duration-200 transform hover:scale-110 hover:opacity-100 opacity-90 cursor-pointer"
                                        />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Add Group Card */}
                <button onClick={()=>navigate('/one-to-one/session-plan-create')} className="border border-dashed border-gray-300 rounded-3xl w-[180px] h-[100px] flex flex-col justify-center items-center text-black hover:bg-gray-50 transition">
                    <Plus className="w-6 h-5 mb-2" />
                    <span className="font-medium text-sm">Add Group</span>
                </button>
            </div>

        </div>
        
        </>
    );
};

export default SessionPlan;
