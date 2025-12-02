import { Plus, MoreVertical, Filter, X } from "lucide-react";
import { useState, useCallback, useEffect } from "react";
import { ChevronDown, Send } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Select from "react-select";
import { useToDoListTemplate } from "../../contexts/ToDoListContext";

const columns = [
    { id: "to_do", label: "To Do (My Tasks)", color: "bg-[#237FEA]", bgColor: "bg-[#237FEA]" },
    { id: "in_progress", label: "In Progress", color: "bg-[#EDA600]", bgColor: "bg-[#EDA600]" },
    { id: "in_review", label: "In Review", color: "bg-[#E58D25]", bgColor: "bg-[#E58D25]" },
    { id: "completed", label: "Completed", color: "bg-[#1CB72B]", bgColor: "bg-[#1CB72B]" },
];

const tasks = [
    {
        id: 1,
        status: "to_do",  // <-- all set to "todo"
        title: "Web Dashboard",
        priority: "medium",
        assignedAdmins: [
            { name: "Jessica", avatar: "/demo/synco/reportsIcons/Avatar.png" },
            { name: "Matt", avatar: "/demo/synco/reportsIcons/Avatar1.png" },
        ],
        comments: 2,
        daysLeft: 3,
    },
    {
        id: 2,
        status: "to_do",  // changed from "inprogress"
        title: "Web Dashboard",
        priority: "medium",
        assignedAdmins: [
            { name: "Jessica", avatar: "/demo/synco/reportsIcons/Avatar.png" },
            { name: "Matt", avatar: "/demo/synco/reportsIcons/Avatar1.png" },
        ],
        comments: 2,
        daysLeft: 3,
    },
    {
        id: 3,
        status: "to_do",  // changed from "inreview"
        title: "Web Dashboard",
        priority: "medium",
        assignedAdmins: [
            { name: "Jessica", avatar: "/demo/synco/reportsIcons/Avatar.png" },
            { name: "Matt", avatar: "/demo/synco/reportsIcons/Avatar1.png" },
        ],
        comments: 2,
        daysLeft: 3,
    },
    {
        id: 4,
        status: "to_do",  // changed from "completed"
        title: "Web Dashboard",
        priority: "medium",
        assignedAdmins: [
            { name: "Jessica", avatar: "/demo/synco/reportsIcons/Avatar.png" },
            { name: "Matt", avatar: "/demo/synco/reportsIcons/Avatar1.png" },
        ],
        comments: 2,
        daysLeft: 3,
    },
];



export default function TodoList() {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
   const { fetchToDoList, toDoList } = useToDoListTemplate();
    useEffect(() => {
        fetchToDoList();
    }, [fetchToDoList]);
    const [openNewTask, setOpenNewTask] = useState(false);
    const [openViewTask, setOpenViewTask] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [open, setOpen] = useState('comment');
    const [loading, setLoading] = useState(null);
    const [taskData, setTaskData] = useState(tasks);
    const [Members, setMembers] = useState([]);
    const handleOpenNewTask = () => setOpenNewTask(true);
    const handleCloseNewTask = () => setOpenNewTask(false);

    const task = {
        title: "Task 1 title",
        description: "Lorem ipsum...",
        attachments: [],   // or existing files
        assigned: [
            { avatar: "/demo/synco/reportsIcons/Avatar1.png", id: 1 },
            { avatar: "/demo/synco/reportsIcons/Avatar.png", id: 2 }
        ],
        createdBy: {
            name: "Nilio Bagga",
            avatar: "/demo/synco/reportsIcons/Avatar1.png"
        },
        status: "Next",
        priority: "high",
        createdAt: "Feb 2, 2023 – 4:30 PM",
        updatedAt: "Feb 3, 2023 – 2:15 PM"
    }


    const handleOpenViewTask = () => {
        setSelectedTask(task);
        setOpenViewTask(true);
    };
    const handleCloseViewTask = () => setOpenViewTask(false);


    const handleDragEnd = (result, taskData, setTaskData) => {
        if (!result.destination) return;

        const { draggableId, destination, source } = result;

        // find dragged task
        const updated = taskData.map((task) =>
            task.id === parseInt(draggableId)
                ? { ...task, status: destination.droppableId }
                : task
        );

        setTaskData(updated);
    };


    const fetchMembers = useCallback(async () => {
        const token = localStorage.getItem("adminToken");
        if (!token) return;

        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/admin`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const resultRaw = await response.json();
            const result = resultRaw.data || [];
            setMembers(result);
        } catch (error) {
            console.error("Failed to fetch members:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMembers();
    }, [])



    return (
        <div className="p-6 w-full">


            <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl font-semibold">To Do List</h1>
                <button className="flex items-center gap-2 px-4 py-2 bg-[#237FEA] text-white rounded-lg text-sm">
                    <Filter size={16} />
                    Filter
                </button>
            </div>

            <DragDropContext
                onDragEnd={(result) => handleDragEnd(result, taskData, setTaskData)}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                    {columns.map((col) => (
                        <TaskColumn
                            key={col.id}
                            column={col}
                            tasks={taskData.filter((t) => t.status === col.id)}
                            onAddTask={handleOpenNewTask}
                            onTaskClick={handleOpenViewTask}
                        />
                    ))}
                </div>
            </DragDropContext>



            {openNewTask && <CreateTaskModal members={Members} onClose={handleCloseNewTask} />}
            {openViewTask && (
                <ViewTaskModal task={selectedTask} open={open} setOpen={setOpen} onClose={handleCloseViewTask} />
            )}
        </div>
    );
}



function TaskColumn({ column, tasks, onAddTask, onTaskClick }) {
    return (
        <Droppable droppableId={column.id}>
            {(provided) => (
                <div className="w-full"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                >
                    {/* HEADER SAME */}
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

                    {/* ADD NEW TASK BUTTON SAME */}
                    <button
                        onClick={onAddTask}
                        className="w-full bg-white flex items-center justify-center gap-2 py-2 border border-gray-300 rounded-xl text-sm text-[#237FEA] hover:bg-gray-50 mb-4"
                    >
                        <Plus size={16} />
                        Add New Task
                    </button>

                    {/* TASKS WITH DRAGGABLE */}
                    <div className="space-y-4">
                        {tasks.map((t, index) => (
                            <Draggable key={t.id} draggableId={t.id.toString()} index={index}>
                                {(provided) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                    >
                                        <TaskCard task={t} onClick={() => onTaskClick(t)} />
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                </div>
            )}
        </Droppable>
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
                    {task.assignedAdmins.map((u, index) => (
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


function CreateTaskModal({ members, onClose }) {
    const { fetchToDoList, toDoList, createToDoList } = useToDoListTemplate();
    useEffect(() => {
        fetchToDoList();
    }, [fetchToDoList]);
    const memberOptions = members.map(m => ({
        value: m.id,
        label: `${m.firstName} ${m.lastName || ""}`.trim(),
        profile: m.profile,
        fullData: m
    }));
    const [priority, setPriority] = useState("low");

    const [createdAt] = useState(new Date());
    const [updatedAt, setUpdatedAt] = useState(new Date());

    const priorityOptions = ["low", "medium", "high"];

    const [selectedMembers, setSelectedMembers] = useState([]);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        attachments: [],
        comment: "",
    });
    const [showMembers, setShowMembers] = useState(null);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((p) => ({ ...p, [name]: value }));
    };
    const [uploadedFiles, setUploadedFiles] = useState([]);

    const handleFiles = (files) => {
        const fileArray = Array.from(files);

        const filePreviews = fileArray.map((file) => ({
            file,
            url: URL.createObjectURL(file),
            type: file.type,
        }));

        setUploadedFiles((prev) => [...prev, ...filePreviews]);
    };

    const handleFileUpload = (e) => {
        handleFiles(e.target.files);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        handleFiles(e.dataTransfer.files);
    };

    const handleDragOver = (e) => {
        e.preventDefault(); // REQUIRED
    };



    const handleCommentChange = (e) => {
        setFormData((p) => ({ ...p, comment: e.target.value }));
    };

   const handleSubmit = async () => {
    // Helper function to convert a file to base64
    const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    // Convert all uploaded files to base64
    const attachmentsBase64 = await Promise.all(
        uploadedFiles.map(async (fileObj) => {
            const base64Data = await fileToBase64(fileObj.file);
            return {
                ...fileObj,
                file: base64Data,  // replace file object with base64
                url: undefined     // optional: remove blob url
            };
        })
    );

    const finalData = {
        ...formData,
        assignedAdmins: selectedMembers.map(m => m.fullData.id),
        attachments: attachmentsBase64
    };

    createToDoList(finalData);
    console.log("FINAL TASK DATA:", finalData);

    onClose();
};


    return (
        <div className="fixed inset-0 flex justify-center items-center bg-black/50 z-50">

            <div className="bg-white rounded-2xl md:w-5/12 max-h-[90vh] overflow-auto ">

                <div className="flex p-6 justify-center relative items-center border-b border-[#E2E1E5]">
                    <h2 className="text-xl font-semibold">Create Task</h2>
                    <button onClick={onClose} className="absolute left-4 top-7 font-bold text-gray-500 hover:text-black">
                        <X />
                    </button>
                </div>

                <div className="flex">
                    <div className="md:w-[60%] p-6 space-y-6">


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

                            <div className="mt-4">
                                <label
                                    className="border-2 border-dashed border-[#ACACAC] rounded-md mt-2 h-28 
        flex items-center justify-center text-gray-500 cursor-pointer"
                                    onDrop={handleDrop}
                                    onDragOver={handleDragOver}
                                >
                                    <div className="text-center pointer-events-none">
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


                                {uploadedFiles.length > 0 && (
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                                        {uploadedFiles.map((item, index) => (
                                            <div key={index} className="relative border border-gray-200 rounded-md p-2 bg-white shadow-sm">
                                                <button
                                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6
                    flex items-center justify-center text-xs"
                                                    onClick={() =>
                                                        setUploadedFiles(uploadedFiles.filter((_, i) => i !== index))
                                                    }
                                                >
                                                    ✕
                                                </button>

                                                {item.type.startsWith("image/") ? (
                                                    <img src={item.url} className="w-full h-24 object-cover rounded" alt="" />
                                                ) : (
                                                    <div className="flex flex-col items-center justify-center h-24">
                                                        <img src="/demo/synco/reportsIcons/pdf.png" className="w-10 mb-2" />
                                                        <p className="text-xs text-gray-600 truncate">{item.file.name}</p>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}

                            </div>




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


                    <div className="md:w-[40%] bg-[#FAFAFA] py-6 space-y-6">

                        {/* Created By */}
                        <div className="border-b border-[#E2E1E5] pb-6 px-6">
                            <p className="text-[17px] font-semibold">Created by</p>
                            <div className="flex items-center gap-3 mt-4">
                                <img src="/demo/synco/reportsIcons/Avatar1.png" className="w-10 h-10 rounded-full" />
                                <p className="font-medium">Nilio Bagga</p>
                            </div>
                        </div>

                        {/* Assign Members */}
                        <div className="border-b border-[#E2E1E5] pb-6 px-6">
                            <p className="text-[17px] font-semibold">Assign</p>

                            {/* Selected avatars */}
                            <div className="flex gap-1 mt-3">
                                <div className="flex gap-3">
                                    {selectedMembers.map((m) => (
                                        <img
                                            key={m.value}
                                            src={m.profile}
                                            alt={m.label}
                                            className="w-8 h-8 rounded-full object-cover"
                                        />
                                    ))}
                                </div>

                                {/* Add button */}
                                <button
                                    onClick={() => setShowMembers(true)}
                                    className="cursor-pointer w-8 h-8 border border-[#717073] rounded-full flex items-center justify-center text-xl"
                                >
                                    +
                                </button>
                            </div>

                            {/* Modal */}
                            {showMembers && (
                                <AssignModal
                                    close={() => setShowMembers(false)}
                                    selectedMembers={selectedMembers}
                                    setSelectedMembers={setSelectedMembers}
                                    memberOptions={memberOptions}
                                />
                            )}
                        </div>

                        {/* Status */}
                        <div className="border-b border-[#E2E1E5] pb-6 px-6">
                            <p className="text-[17px] font-semibold mb-2">Status</p>
                            <span className="mt-1 inline-block bg-blue-100 text-[#237FEA] text-xs px-2 py-1 rounded-md">
                                Next
                            </span>
                        </div>

                        {/* Priority */}
                        <div className="border-b border-[#E2E1E5] pb-6 px-6">
                            <p className="text-[17px] font-semibold mb-2">Priority</p>

                            <div className="flex gap-2">
                                {priorityOptions.map((p) => (
                                    <span
                                        key={p}
                                        onClick={() => {
                                            setPriority(p);
                                            setUpdatedAt(new Date());
                                        }}
                                        className={`cursor-pointer text-xs px-2 py-1 rounded-md
                        ${priority === p
                                                ? "bg-red-500 text-white"
                                                : "bg-red-100 text-[#FF5C40]"}
                    `}
                                    >
                                        {p}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Created */}
                        <div className="border-b border-[#E2E1E5] pb-6 px-6">
                            <p className="text-[17px] font-semibold">Created</p>
                            <p className="text-sm mt-1">
                                {createdAt.toLocaleDateString()} – {createdAt.toLocaleTimeString()}
                            </p>
                        </div>

                        {/* Last Update */}
                        <div className="pb-6 px-6">
                            <p className="text-[17px] font-semibold">Last Update</p>
                            <p className="text-sm mt-1">
                                {updatedAt.toLocaleDateString()} – {updatedAt.toLocaleTimeString()}
                            </p>
                        </div>

                    </div>

                </div>
                <div className="p-4 flex justify-end border-t border-gray-200">
                    <button
                        onClick={handleSubmit}
                        className="bg-[#237FEA] text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                    >
                        Save Task
                    </button>
                </div>

            </div>
        </div>
    );
}

const AssignModal = ({ close, selectedMembers, setSelectedMembers, memberOptions }) => {
    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-white w-[400px] p-6 rounded-xl shadow-lg">
                <h2 className="text-lg font-semibold mb-4">Assign Members</h2>

                <Select
                    options={memberOptions}
                    isMulti
                    onChange={(selected) => setSelectedMembers(selected)}
                    value={selectedMembers}
                    placeholder="Select Members"
                    className="text-sm"
                />

                <div className="flex justify-end gap-3 mt-5">
                    <button
                        onClick={close}
                        className="px-4 py-2 bg-gray-300 rounded-lg"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={close}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};


function ViewTaskModal({ task, open, setOpen, onClose }) {
    if (!task) return null;

    const toggle = (section) => setOpen(open === section ? null : section);

    // ===========================
    // ATTACHMENTS HANDLING
    // ===========================
    const [uploadedFiles, setUploadedFiles] = useState(
        task.attachments
            ? task.attachments.map((file) => ({
                file,
                url: file.url || "",
                type: file.type || "file"
            }))
            : []
    );

    const handleFiles = (files) => {
        const mapped = Array.from(files).map((file) => ({
            file,
            url: URL.createObjectURL(file),
            type: file.type
        }));

        setUploadedFiles((prev) => [...prev, ...mapped]);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        handleFiles(e.dataTransfer.files);
    };

    const handleDragOver = (e) => e.preventDefault();

    const handleFileUpload = (e) => {
        handleFiles(e.target.files);
    };

    // ===========================
    // COMMENT HANDLING
    // ===========================
    const [comment, setComment] = useState("");

    const addComment = () => {
        console.log("COMMENT:", comment);
        setComment("");
    };

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-black/50 z-50">
            <div className="bg-white rounded-2xl md:w-5/12 max-h-[90vh] overflow-hidden">
                {/* HEADER */}
                <div className="flex p-6 justify-center relative items-center border-b border-[#E2E1E5]">
                    <h2 className="text-xl font-semibold">Task</h2>
                    <button onClick={onClose} className="absolute left-4 top-7 text-gray-500 hover:text-black">
                        <X />
                    </button>
                </div>

                <div className="flex">
                    {/* LEFT SIDE */}
                    <div className="md:w-[60%] space-y-6">
                        <div className="p-6">
                            <h4 className="text-[24px] font-semibold mb-2">{task.title}</h4>
                            <p className="text-[16px] text-[#717073]">{task.description}</p>
                        </div>

                        {/* =========================== ATTACHMENTS =========================== */}
                        <div className="bg-white rounded-2xl py-4">
                            <button
                                onClick={() => toggle("attachments")}
                                className="flex justify-between items-center w-full px-5 py-3 border-b border-[#E2E1E5]"
                            >
                                <span className="font-medium text-[16px]">Attachments</span>
                                <ChevronDown size={18} className={`transition-transform ${open === "attachments" ? "rotate-180" : ""}`} />
                            </button>

                            {open === "attachments" && (
                                <div className="p-4">
                                    <label
                                        className="border border-dashed rounded-xl p-6 text-center text-gray-500 cursor-pointer flex flex-col items-center"
                                        onDrop={handleDrop}
                                        onDragOver={handleDragOver}
                                    >
                                        <img src="/demo/synco/reportsIcons/folder.png" className="w-10 mb-2" />
                                        <p className="text-sm">Click to upload or drag & drop</p>

                                        <input type="file" multiple className="hidden" onChange={handleFileUpload} />
                                    </label>

                                    {/* Preview */}
                                    {uploadedFiles.length > 0 && (
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                                            {uploadedFiles.map((item, index) => (
                                                <div key={index} className="relative border rounded-md p-2 bg-white shadow-sm">
                                                    <button
                                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                                                        onClick={() => setUploadedFiles(uploadedFiles.filter((_, i) => i !== index))}
                                                    >
                                                        ✕
                                                    </button>

                                                    {item.type.startsWith("image/") ? (
                                                        <img src={item.url} className="w-full h-24 object-cover rounded" />
                                                    ) : (
                                                        <div className="flex flex-col items-center justify-center h-24">
                                                            <img src="/demo/synco/reportsIcons/pdf.png" className="w-10 mb-2" />
                                                            <p className="text-xs text-gray-600 truncate">{item.file.name}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* =========================== COMMENT =========================== */}
                        <div className="bg-white rounded-2xl py-4">
                            <button
                                onClick={() => toggle("comment")}
                                className="flex justify-between items-center w-full px-5 py-3 border-b border-[#E2E1E5]"
                            >
                                <span className="font-medium text-[16px]">Comment</span>
                                <ChevronDown size={18} className={`transition-transform ${open === "comment" ? "rotate-180" : ""}`} />
                            </button>

                            {open === "comment" && (
                                <div className="mt-3 space-y-4 p-4">
                                    <div className="flex items-center gap-3">
                                        <img src="/demo/synco/reportsIcons/Avatar.png" className="w-10 h-10 rounded-full" />
                                        <div className="flex-1 relative">
                                            <input
                                                placeholder="Add a comment"
                                                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm"
                                                value={comment}
                                                onChange={(e) => setComment(e.target.value)}
                                            />
                                            <button
                                                onClick={addComment}
                                                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-[#237FEA] text-white rounded-lg"
                                            >
                                                <Send size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT SIDE DETAILS */}
                    <div className="md:w-[40%] bg-[#FAFAFA] py-6 space-y-6">
                        {/* Created By */}
                        <div className="border-b border-[#E2E1E5] pb-6 px-6">
                            <p className="text-[17px] font-semibold">Created by</p>
                            <div className="flex items-center gap-3 mt-4">
                                <img src={task.createdBy?.avatar} className="w-10 h-10 rounded-full" />
                                <p className="font-medium">{task.createdBy?.name}</p>
                            </div>
                        </div>

                        {/* Assigned */}
                        <div className="border-b border-[#E2E1E5] pb-6 px-6">
                            <p className="text-[17px] font-semibold">Assign</p>
                            <div className="flex gap-2 mt-2 items-center flex-wrap">
                                {task.assigned?.map((m, i) => (
                                    <img key={i} src={m.avatar} className="w-8 h-8 rounded-full" />
                                ))}
                            </div>
                        </div>

                        {/* Status */}
                        <div className="border-b border-[#E2E1E5] pb-6 px-6">
                            <p className="text-[17px] font-semibold mb-2">Status</p>
                            <span className="mt-1 inline-block bg-blue-100 text-[#237FEA] text-xs px-2 py-1 rounded-md">
                                {task.status}
                            </span>
                        </div>

                        {/* Priority */}
                        <div className="border-b border-[#E2E1E5] pb-6 px-6">
                            <p className="text-[17px] font-semibold mb-2">Priority</p>
                            <span className="mt-1 inline-block bg-red-100 text-[#FF5C40] text-xs px-2 py-1 rounded-md">
                                {task.priority}
                            </span>
                        </div>

                        {/* Created Date */}
                        <div className="border-b border-[#E2E1E5] pb-6 px-6">
                            <p className="text-[17px] font-semibold">Created</p>
                            <p className="text-sm mt-1">{task.createdAt}</p>
                        </div>

                        {/* Updated Date */}
                        <div className="pb-6 px-6">
                            <p className="text-[17px] font-semibold">Last Update</p>
                            <p className="text-sm mt-1">{task.updatedAt}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


