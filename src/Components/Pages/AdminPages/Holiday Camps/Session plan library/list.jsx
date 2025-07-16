import React, { useState } from 'react';
import { Pencil, Trash2, Eye, } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const List = () => {
        const navigate = useNavigate();
    
    const [weeks, setWeeks] = useState([
        {
            id: 1,
            title: "Week 01: Pele",
            groups: [
                { id: 1, name: "Beginners", age: "4-6 Years" },
                { id: 2, name: "Intermediate", age: "6-7 Years" },
                { id: 3, name: "Advanced", age: "8-9 Years" },
                { id: 4, name: "Pro", age: "10-12 Years" },
            ],
        },
        // You can add more weeks dynamically
    ]);

    const handleAddNew = () => {
        // Logic to reorder sessions
        console.log("Reorder Sessions clicked");
    };

    const handleEditGroup = (weekId, groupId) => {
        // Edit logic here
    };

    const handleDeleteGroup = (weekId, groupId) => {
        setWeeks(prev =>
            prev.map(week =>
                week.id === weekId
                    ? {
                        ...week,
                        groups: week.groups.filter(group => group.id !== groupId),
                    }
                    : week
            )
        );
    };

    const handleAddGroup = (weekId) => {
        // Add group logic here
    };

    return (
        <div className="pt-1 bg-gray-50 min-h-screen">
            <div className="flex pe-4 justify-between items-center mb-4 w-full">
                <h2 className="text-[28px] font-semibold">Session Plan Library</h2>
                <button
                    onClick={handleAddNew}
                    className="bg-[#237FEA] flex items-center gap-2 cursor-pointer text-white px-4 py-[10px] rounded-xl hover:bg-blue-700 text-[16px] font-semibold"
                >
                    Reorder Sessions
                </button>
            </div>

            <div className="md:flex bg-white rounded-3xl p-6 shadow gap-6">
                {weeks.map(week => (
                    <div key={week.id} className="bg-gray-100 rounded-2xl p-4 min-w-[374px] max-w-xs">
                        <div className="flex items-center justify-between p-2">
                            <h3 className="font-semibold text-[24px]">{week.title}</h3>
                            <button className="text-gray-700 hover:text-black"><Eye size={24} /></button>
                        </div>

                        {week.groups.map(group => (
                            <div key={group.id} className="bg-white border border-gray-300 p-3 mb-2 rounded-xl flex justify-between items-center ">
                                <div>
                                    <p className="font-medium text-[16px]">{group.name}</p>
                                    <p className="text-[14px] text-gray-500">{group.age}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => handleEditGroup(week.id, group.id)} className="text-gray-500 hover:text-blue-600">
                                        <img
                                            src="/demo/synco/icons/edit.png"
                                            alt="Edit"
                                            className="w-6 h-6 transition-transform duration-200 transform hover:scale-110 hover:opacity-100 opacity-90 cursor-pointer"
                                        />
                                    </button>
                                    <button onClick={() => handleDeleteGroup(week.id, group.id)} className="text-gray-500 hover:text-red-500">
                                        <img
                                            src="/demo/synco/icons/deleteIcon.png"
                                            alt="Delete"
                                            className="w-6 h-6 transition-transform duration-200 transform hover:scale-110 hover:opacity-100 opacity-90 cursor-pointer"
                                        />

                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ))}

                <div className="border  border-dashed border-gray-300 rounded-2xl min-w-[168px] max-w-xs  items-center justify-center max-h-[100px] cursor-pointer text-gray-500 hover:text-black">

                    <div>

                        <div
                            onClick={() => navigate("/holiday-camps/session-plan-create")}
                            className="p-6 text-center text-[14px] font-semibold cursor-pointer"
                        >
                            <img
                                src="/demo/synco/members/addblack.png"
                                alt=""
                                className="w-6 h-6 m-auto mb-2"
                            />
                            Add Group
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default List;
