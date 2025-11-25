import { Plus, MoreVertical, Filter } from "lucide-react";

const columns = [
    { id: "todo", label: "To Do (My Tasks)", color: "bg-blue-500", bgColor: "bg-blue-500" },
    { id: "inprogress", label: "In Progress", color: "bg-yellow-500", bgColor: "bg-yellow-500" },
    { id: "inreview", label: "In Review", color: "bg-orange-500", bgColor: "bg-orange-500" },
    { id: "completed", label: "Completed", color: "bg-green-500", bgColor: "bg-green-500" },
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
    return (
        <div className="p-6 w-full">
            
         
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl font-semibold">To Do List</h1>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">
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
                    />
                ))}
            </div>
        </div>
    );
}


function TaskColumn({ column, tasks }) {
    return (
        <div className="w-full">
            
      
            <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${column.color}`}></div>
                    <span className="font-medium text-sm">{column.label}</span>
                    <span className={`${column.bgColor} text-xs text-white px-2 py-0.5 rounded-lg`}>
                        {tasks.length}
                    </span>
                </div>

                <button className="p-1 hover:bg-gray-100 rounded">
                    <Plus size={18} />
                </button>
            </div>

            <button className="w-full bg-white flex items-center justify-center gap-2 py-2 border border-gray-300 rounded-xl text-sm text-[#237FEA] hover:bg-gray-50 mb-4">
                <Plus size={16} />
                Add New Task
            </button>

            <div className="space-y-4">
                {tasks.map((t) => (
                    <TaskCard key={t.id} task={t} />
                ))}
            </div>
        </div>
    );
}


function TaskCard({ task }) {
    return (
        <div className="bg-white border border-[#E2E1E5] rounded-xl p-4">
            

            <div className="flex justify-between items-start">
                <span className="text-xs bg-[#FDF6E5] text-[#EDA600] px-2 py-0.5 rounded-md">
                    {task.priority}
                </span>
                <MoreVertical className="cursor-pointer" size={18} />
            </div>

 
            <h2 className="mt-3 font-semibold text-[18px]">{task.title}</h2>

   
            <div className="flex items-center gap-2 mt-3">
                {task.users.map((u, index) => (
                    <div key={index} className="flex items-center gap-1">
                        <img
                            src={u.avatar}
                            alt={u.name}
                            className="w-9 rounded-full border-2 border-white"
                        />
                        <span className="text-sm">{u.name}</span>
                    </div>
                ))}
            </div>

            <div className="flex justify-between items-center text-[16px] font-semibold text-gray-500 mt-4">
                <div className="flex items-center gap-1">
                    <img src="/demo/synco/reportsIcons/share.png" className="w-4" />
                    {task.comments}
                </div>
                <div>{task.daysLeft} days left</div>
            </div>
        </div>
    );
}
