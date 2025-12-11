import { Pencil, Trash2, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CourseList() {
    const courses = [
        { id: 1, title: "Welcome to Samba Soccer Schools", status: "Published" },
        { id: 2, title: "Health and Safety", status: "Draft" },
        { id: 3, title: "Safeguarding", status: "Published" },
        { id: 4, title: "Invoicing us", status: "Published" },
        { id: 5, title: "Social Media Policy", status: "Published" },
    ];
    const navigate = useNavigate();
    return (
        <div className="p-8 bg-[#F7F8FA] min-h-screen">
            {/* Top Bar */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Courses List</h2>
            </div>
            {/* Table Card */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-sm">
                    {/* Header */}
                    <thead className="bg-white-50 text-gray-500 border-b border-gray-300 ">
                        <tr>
                            <th className="text-left py-3 px-6 text-2xl text-black font-semibold "> <div>Courses  </div> </th>
                            <th className="text-left py-5 px-2 w-50"><button onClick={() => navigate('/configuration/coach-pro/course/create')} className="bg-[#237FEA] hover:bg-blue-600  text-white px-4 py-2 rounded-lg flex items-center gap-2 text-base font-semibold">
                                <Plus size={16} />
                                Create a course
                            </button></th>
                        </tr>
                    </thead>

                    {/* Body */}
                    <tbody>
                        {courses.map((item) => (
                            <tr
                                key={item.id}
                                className="border-b border-gray-300 last:border-none hover:bg-gray-50 transition"
                            >
                                {/* Title */}
                                <td className="py-4 px-6 text-[14px] text-gray-700">
                                    {item.title}
                                </td>

                                {/* Status Badge */}


                                {/* Actions */}
                                <td className="py-4 px-6">
                                    <div className="flex gap-3">
                                        {item.status === "Published" ? (
                                            <span className="bg-[#F1F9F3] text-[#34AE56] text-xs text-center px-3 py-2 rounded-md min-w-[80px] font-semibold ">
                                                Published
                                            </span>
                                        ) : (
                                            <span className="bg-[#FDF6E5] text-[#EDA600] text-xs text-center px-3 py-2 rounded-md min-w-[80px] font-semibold ">
                                                Draft
                                            </span>
                                        )}
                                        <button className="text-gray-500 hover:text-gray-700">
                                            <img src="/images/icons/edit.png" className="w-6" alt="" />
                                        </button>

                                        <button className="text-gray-500 hover:text-red-500">
                                            <img src="/images/icons/deleteIcon.png" className="w-6" alt="" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}

                        {courses.length === 0 && (
                            <tr>
                                <td
                                    colSpan={3}
                                    className="text-center py-8 text-gray-400 text-sm"
                                >
                                    No courses found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
