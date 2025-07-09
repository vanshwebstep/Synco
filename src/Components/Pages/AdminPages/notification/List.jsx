import { useEffect } from "react";
import { useMembers } from "../contexts/MemberContext";
import { useNotification } from "../contexts/NotificationContext";


export default function List() {
    const { activeTab } = useMembers();
    const { notification, loadingNotification, fetchNotification } = useNotification();

    const filtered =
        activeTab === "All"
            ? notification
            : notification.filter((n) => n.category === activeTab);

useEffect(()=>{
    fetchNotification();
},[fetchNotification])
    return (
        <div className="space-y-5 bg-white p-10 rounded-2xl">
            {filtered.map((item, idx) => (
                <div
                    key={idx}
                    className={`text-[18px] pb-5 ${idx !== filtered.length - 1 ? "border-b border-[#E2E1E5]" : ""
                        }`}
                >
                    <div key={idx} className=" flex gap-4">
                        <img
                            src={item.avatar}
                            alt={item.name}
                            className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="">
                            <p className="font-semibold">{item.name}</p>
                            <span className="text-[16px] text-[#717073]">{item.createdAt}</span>
                        </div>

                    </div>
                    <div>
                        <h3 className="font-semibold text-[18px] py-4 pb-2">{item.title}</h3>
                        <p className="text-[18px] font-medium  text-gray-600 mt-1">
                            {item.description}
                        </p>
                    </div>
                </div>

            ))}
        </div>
    );
}
