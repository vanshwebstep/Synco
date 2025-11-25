import { Plus, MoreVertical, Filter, X } from "lucide-react";
import { useState } from "react";
import { ChevronDown, Send } from "lucide-react";

const columns = [
    { id: "todo", label: "To Do (My Tasks)", color: "bg-[#237FEA]", bgColor: "bg-[#237FEA]" },
    { id: "inprogress", label: "In Progress", color: "bg-[#EDA600]", bgColor: "bg-[#EDA600]" },
    { id: "inreview", label: "In Review", color: "bg-[#E58D25]", bgColor: "bg-[#E58D25]" },
    { id: "completed", label: "Completed", color: "bg-[#1CB72B]", bgColor: "bg-[#1CB72B]" },
];

const tasks = [
    {
        id: 1,
        status: "todo",
        title: "Web Dashboard",
        priority: "Medium",
        users: [
            { name: "Jessica", avatar: "/demo/synco/reportsIcons/Avatar.png" },
            { name: "Matt", avatar: "/demo/synco/reportsIcons/Avatar1.png" },
        ],
        comments: 2,
        daysLeft: 3,
    },
    {
        id: 2,
        status: "inprogress",
        title: "Web Dashboard",
        priority: "Medium",
        users: [
            { name: "Jessica", avatar: "/demo/synco/reportsIcons/Avatar.png" },
            { name: "Matt", avatar: "/demo/synco/reportsIcons/Avatar1.png" },
        ],
        comments: 2,
        daysLeft: 3,
    },
    {
        id: 3,
        status: "inreview",
        title: "Web Dashboard",
        priority: "Medium",
        users: [
            { name: "Jessica", avatar: "/demo/synco/reportsIcons/Avatar.png" },
            { name: "Matt", avatar: "/demo/synco/reportsIcons/Avatar1.png" },
        ],
        comments: 2,
        daysLeft: 3,
    },
    {
        id: 4,
        status: "completed",
        title: "Web Dashboard",
        priority: "Medium",
        users: [
            { name: "Jessica", avatar: "/demo/synco/reportsIcons/Avatar.png" },
            { name: "Matt", avatar: "/demo/synco/reportsIcons/Avatar1.png" },
        ],
        comments: 2,
        daysLeft: 3,
    },
];


export default function TodoList() {
    const [openNewTask, setOpenNewTask] = useState(false);
    const [openViewTask, setOpenViewTask] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [open, setOpen] = useState('comment');

    const handleOpenNewTask = () => setOpenNewTask(true);
    const handleCloseNewTask = () => setOpenNewTask(false);

    const handleOpenViewTask = (task) => {
        setSelectedTask(task);
        setOpenViewTask(true);
    };
    const handleCloseViewTask = () => setOpenViewTask(false);

    return (
        <div className="p-6 w-full">

       
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl font-semibold">To Do List</h1>
                <button className="flex items-center gap-2 px-4 py-2 bg-[#237FEA] text-white rounded-lg text-sm">
                    <Filter size={16} />
                    Filter
                </button>
            </div>

           
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {columns.map((col) => (
                    <TaskColumn
                        key={col.id}
                        column={col}
                        tasks={tasks.filter((t) => t.status === col.id)}
                        onAddTask={handleOpenNewTask}
                        onTaskClick={handleOpenViewTask}
                    />
                ))}
            </div>

         
            {openNewTask && <CreateTaskModal onClose={handleCloseNewTask} />}
            {openViewTask && (
                <ViewTaskModal task={selectedTask} open={open} setOpen={setOpen} onClose={handleCloseViewTask} />
            )}
        </div>
    );
}



function TaskColumn({ column, tasks, onAddTask, onTaskClick }) {
    return (
        <div className="w-full">

        
            <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${column.color}`}></div>
                    <span className="font-medium text-sm">{column.label}</span>
                    <span className={`${column.bgColor} text-xs text-white px-3 py-0.5 rounded-full`}>
                        {tasks.length}
                    </span>
                </div>

                <button onClick={onAddTask} className="p-1 flex items-center gap-1 hover:bg-gray-100 rounded">
                    <Plus size={18} />  <MoreVertical size={18} />
                </button>
            </div>

            <button
                onClick={onAddTask}
                className="w-full bg-white flex items-center justify-center gap-2 py-2 border border-gray-300 rounded-xl text-sm text-[#237FEA] hover:bg-gray-50 mb-4"
            >
                <Plus size={16} />
                Add New Task
            </button>

            <div className="space-y-4">
                {tasks.map((t) => (
                    <TaskCard key={t.id} task={t} onClick={() => onTaskClick(t)} />
                ))}
            </div>
        </div>
    );
}



function TaskCard({ task, onClick }) {
    return (
        <div
            onClick={onClick}
            className="bg-white border border-[#E2E1E5] rounded-xl  cursor-pointer hover:shadow-sm transition"
        >
            <div className="p-4 pb-0">
                <div className="flex justify-between items-start">
                    <span className="text-xs bg-[#FDF6E5] text-[#EDA600] px-2 py-0.5 rounded-md">
                        {task.priority}
                    </span>
                    <MoreVertical size={18} />
                </div>

                <h2 className="mt-3 font-semibold text-[18px]">{task.title}</h2>

                <div className="flex items-center gap-2 mt-3">
                    {task.users.map((u, index) => (
                        <div className="flex gap-1 items-center">
                            <img
                                key={index}
                                src={u.avatar}
                                className="w-9 rounded-full border-2 border-white"
                            />
                            {u.name}
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex justify-between items-center border-t border-[#E2E1E5] text-[16px] p-4 font-semibold text-gray-500 mt-4">
                <div className="flex items-center gap-1">
                    <img src="/demo/synco/reportsIcons/share.png" className="w-4" />
                    {task.comments}
                </div>
                <div>{task.daysLeft} days left</div>
            </div>
        </div>
    );
}


function CreateTaskModal({ onClose }) {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        attachments: [],
        comment: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((p) => ({ ...p, [name]: value }));
    };

    const handleFileUpload = (e) => {
        const files = Array.from(e.target.files);
        setFormData((p) => ({
            ...p,
            attachments: [...p.attachments, ...files],
        }));
    };

   
    const handleCommentChange = (e) => {
        setFormData((p) => ({ ...p, comment: e.target.value }));
    };

   
    const handleSubmit = () => {
        console.log("SUBMIT DATA:", formData);
      
        onClose();
    };

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-black/50 z-50">

            <div className="bg-white rounded-2xl w-[900px] max-h-[90vh] overflow-hidden ">

                <div className="flex p-6 justify-center relative items-center border-b border-[#E2E1E5]">
                    <h2 className="text-xl font-semibold">Create Task</h2>
                    <button onClick={onClose} className="absolute left-4 top-7 font-bold text-gray-500 hover:text-black">
                        <X />
                    </button>
                </div>

                <div className="flex">
                    <div className="w-2/3 p-6 space-y-6">

                  
                        <div>
                            <label className="text-sm ">Title</label>
                            <input
                                className="w-full border border-[#E2E1E5] rounded-xl px-3 py-2 mt-1 focus:outline-none"
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                            />
                        </div>

                     
                        <div>
                            <label className="text-sm ">Description</label>
                            <textarea
                                className="bg-[#FAFAFA] w-full h-32 border border-[#E2E1E5] rounded-xl px-3 py-2 mt-1 resize-none focus:outline-none"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                            ></textarea>
                        </div>

                    
                        <div>
                            <label className="text-md font-semibold">Add attachments</label>

                            <label className="border-2 border-dashed border-[#ACACAC] rounded-md mt-2 h-28 flex items-center justify-center text-gray-500 cursor-pointer">
                                <div className="text-center">
                                    <img src="/demo/synco/reportsIcons/folder.png" className="w-10 m-auto" alt="" />
                                    <p className="text-sm mt-2">Click to upload or drag and drop</p>
                                </div>
                                <input
                                    type="file"
                                    multiple
                                    className="hidden"
                                    onChange={handleFileUpload}
                                />
                            </label>

                        
                            {formData.attachments.length > 0 && (
                                <ul className="mt-2 text-sm text-gray-600">
                                    {formData.attachments.map((f, i) => (
                                        <li key={i}>{f.name}</li>
                                    ))}
                                </ul>
                            )}
                        </div>

                      
                        <div className="mt-3 space-y-4 p-4">
                            <div className="flex items-center gap-3">
                                <img
                                    src="/demo/synco/reportsIcons/Avatar.png"
                                    className="w-10 h-10 rounded-full object-cover"
                                />
                                <div className="flex-1 relative">
                                    <input
                                        placeholder="Add a comment"
                                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-0 focus:outline-none"
                                        value={formData.comment}
                                        onChange={handleCommentChange}
                                    />
                                    <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-[#237FEA] text-white rounded-lg hover:bg-blue-600">
                                        <Send size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>

                    
                    </div>

              
                    <div className="w-1/3 bg-[#FAFAFA] py-6 space-y-6">

                        <div className="border-b border-[#E2E1E5] pb-6 px-6">
                            <p className="text-[17px] font-semibold">Created by</p>
                            <div className="flex items-center gap-3 mt-4">
                                <div className="w-10 h-10 rounded-full bg-gray-300"><img src="/demo/synco/reportsIcons/Avatar1.png" alt="" /></div>
                                <p className="font-medium">Nilio Bagga</p>
                            </div>
                        </div>

                        <div className="border-b border-[#E2E1E5] pb-6 px-6">
                            <p className="text-[17px] font-semibold">Assign</p>
                            <button className="mt-2 w-8 h-8 border border-[#717073] rounded-full flex items-center justify-center text-xl">+</button>
                        </div>

                        <div className="border-b border-[#E2E1E5] pb-6 px-6">
                            <p className="text-[17px] font-semibold mb-2">Status</p>
                            <span className="mt-1 inline-block bg-blue-100 text-[#237FEA] text-xs px-2 py-1 rounded-md">Next</span>
                        </div>


                        <div className="border-b border-[#E2E1E5] pb-6 px-6">
                            <p className="text-[17px] font-semibold mb-2">Priority</p>
                            <span className="mt-1 inline-block bg-red-100 text-[#FF5C40] text-xs px-2 py-1 rounded-md">Next</span>
                        </div>


                        <div className="border-b border-[#E2E1E5] pb-6 px-6">
                            <p className="text-[17px] font-semibold">Created</p>
                            <p className="text-sm mt-1">Feb 2, 2023 – 4:30 PM</p>
                        </div>


                        <div className=" pb-6 px-6">
                            <p className="text-[17px] font-semibold">Last Update</p>
                            <p className="text-sm mt-1">Feb 2, 2023 – 4:30 PM</p>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

function ViewTaskModal({ task, open, setOpen, onClose }) {
    if (!task) return null;
    const toggle = (section) => {
        setOpen(open === section ? null : section);
    };

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-black/50 z-50">


            <div className="bg-white rounded-2xl w-[900px] max-h-[90vh] overflow-hidden ">
                <div className="flex p-6 justify-center relative items-center border-b border-[#E2E1E5]">
                    <h2 className="text-xl font-semibold"> Task</h2>
                    <button onClick={onClose} className="absolute left-4 top-7 font-bold text-gray-500 hover:text-black"><X /></button>
                </div>

                <div className="flex">


                    <div className="w-2/3  space-y-6">
                        <div className="p-6">

                            <h4 className="text-[24px] mb-2 font-semibold">Task 1 title</h4>
                            <p className="text-[16px] text-[#717073] font-medium">Lorem ipsum dolor sit amet consectetur. Tellus tellus nec at amet lacinia. Magna
                                consect hac tellus nam vel lectus morbi porta. Diam cum feugiat nibh sed quisque
                                tincidunt mattis blandit eget. Ultricies molestie nam ipsum est. Porttitor sed mus
                                magna dictum ultrices convallis sed dignissim. Morbi diam massa morbi interdum.
                                Dictum massa nunc in neque pellentesque enim justo libero cursus. Vitae nisl
                                hendrerit est est at volutpat quam. Quis ultrices habitant sit at.</p>
                        </div>


                        <div className="w-full bg-white rounded-2xl py-4">
                         
                            <button
                                onClick={() => toggle("attachments")}
                                className="flex justify-between items-center w-full px-5 py-3 border-b border-[#E2E1E5]"
                            >
                                <span className="font-medium text-[16px]">Attachments</span>
                                <ChevronDown
                                    size={18}
                                    className={`transition-transform ${open === "attachments" ? "rotate-180" : ""
                                        }`}
                                />
                            </button>

                            {open === "attachments" && (
                                <div className="mt-3 p-4">
                                    <div className="border border-dashed rounded-xl p-4 text-center text-sm text-gray-500">
                                        Click to upload or drag & drop files
                                    </div>
                                </div>
                            )}

                          
                            <button
                                onClick={() => toggle("comment")}
                                className="flex justify-between items-center w-full px-5 py-3 border-b border-[#E2E1E5] "
                            >
                                <span className="font-medium text-[16px]">Comment</span>
                                <ChevronDown
                                    size={18}
                                    className={`transition-transform ${open === "comment" ? "rotate-180" : ""
                                        }`}
                                />
                            </button>

                            {open === "comment" && (
                                <div className="mt-3 space-y-4 p-4">

                                  
                                    <div className="flex items-center gap-3">
                                        <img
                                            src="/demo/synco/reportsIcons/Avatar.png"
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                        <div className="flex-1 relative">
                                            <input
                                                placeholder="Add a comment"
                                                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-0 focus:outline-none"
                                            />
                                            <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-[#237FEA] text-white rounded-lg hover:bg-blue-600">
                                                <Send size={16} />
                                            </button>
                                        </div>
                                    </div>

                               
                                    <div className="bg-[#F7F8FA] rounded-xl p-4 text-sm leading-relaxed">
                                        <p className="text-gray-700 mb-3">
                                            Not 100% sure she can attend but if she cant she will email us.
                                            This customer does not want her membership to automatically renew.
                                            She said she wants a call 1 month before hand so she can decide.
                                        </p>

                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-2">
                                                <img
                                                    src="/demo/synco/reportsIcons/Avatar.png"
                                                    className="w-7 h-7 rounded-full"
                                                />
                                                <span className="font-medium text-gray-800">Ethan</span>
                                            </div>
                                            <span className="text-gray-400 text-xs">8 min ago</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>


                    <div className="w-1/3 bg-[#FAFAFA] py-6 space-y-6">

                        <div className="border-b border-[#E2E1E5] pb-6 px-6">
                            <p className="text-[17px] font-semibold">Created by</p>
                            <div className="flex items-center gap-3 mt-4">
                                <div className="w-10 h-10 rounded-full bg-gray-300"><img src="/demo/synco/reportsIcons/Avatar1.png" alt="" /></div>
                                <p className="font-medium">Nilio Bagga</p>
                            </div>
                        </div>

                        <div className="border-b border-[#E2E1E5] pb-6 px-6">
                            <p className="text-[17px] font-semibold">Assign</p>
                            <div className="flex gap-2 items-center">
                                <img src="/demo/synco/reportsIcons/Avatar1.png" className="w-8" alt="" />
                                <img src="/demo/synco/reportsIcons/Avatar1.png" className="w-8" alt="" />
                                <img src="/demo/synco/reportsIcons/Avatar1.png" className="w-8" alt="" />
                                <button className="mt-2 w-8 h-8 border border-[#717073] rounded-full flex items-center justify-center text-xl">+</button>

                            </div>
                        </div>

                        <div className="border-b border-[#E2E1E5] pb-6 px-6">
                            <p className="text-[17px] font-semibold mb-2">Status</p>
                            <span className="mt-1 inline-block bg-blue-100 text-[#237FEA] text-xs px-2 py-1 rounded-md">Next</span>
                        </div>


                        <div className="border-b border-[#E2E1E5] pb-6 px-6">
                            <p className="text-[17px] font-semibold mb-2">Priority</p>
                            <span className="mt-1 inline-block bg-red-100 text-[#FF5C40] text-xs px-2 py-1 rounded-md">Next</span>
                        </div>


                        <div className="border-b border-[#E2E1E5] pb-6 px-6">
                            <p className="text-[17px] font-semibold">Created</p>
                            <p className="text-sm mt-1">Feb 2, 2023 – 4:30 PM</p>
                        </div>


                        <div className=" pb-6 px-6">
                            <p className="text-[17px] font-semibold">Last Update</p>
                            <p className="text-sm mt-1">Feb 2, 2023 – 4:30 PM</p>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
}

