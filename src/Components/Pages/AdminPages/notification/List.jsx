import { useMembers } from "../contexts/MemberContext";
import { useNotification } from "../contexts/NotificationContext";
const allNotifications = [
    {
        name: "Nilio Bagga",
        date: "2023-06-10 16:59:03",
        title: "Notification Title",
        content: "Lorem ipsum dolor sit amet consectetur. Dui quis neque tristique quis vulputate magna. Lorem ipsum dolor sit amet consectetur. Dui quis neque tristique quis vulputate magna. ",
        type: "Payments",
        avatar: "/members/Nilio.png"
    },
    {
        name: "Nilio Bagga",
        date: "2023-06-10 16:59:03",
        title: "Notification Title",
        content: "Lorem ipsum dolor sit amet consectetur. Dui quis neque tristique quis vulputate magna. Lorem ipsum dolor sit amet consectetur. Dui quis neque tristique quis vulputate magna. ",
        type: "Complaints",
        avatar: "/members/Nilio.png"
    },
    {
        name: "Nilio Bagga",
        date: "2023-06-10 16:59:03",
        title: "Notification Title",
        content: "Lorem ipsum dolor sit amet consectetur. Dui quis neque tristique quis vulputate magna. Lorem ipsum dolor sit amet consectetur. Dui quis neque tristique quis vulputate magna. ",
        type: "Cancelled Memberships",
        avatar: "/members/Nilio.png"
    },
    {
        name: "Nilio Bagga",
        date: "2023-06-10 16:59:03",
        title: "Notification Title",
        content: "Lorem ipsum dolor sit amet consectetur. Dui quis neque tristique quis vulputate magna. Lorem ipsum dolor sit amet consectetur. Dui quis neque tristique quis vulputate magna. ",
        type: "General",
        avatar: "/members/Nilio.png"
    },
];

export default function List() {
    const { activeTab } = useMembers();
    const { notification, loadingNotification, fetchNotification } = useNotification();

    const filtered =
        activeTab === "All"
            ? allNotifications
            : allNotifications.filter((n) => n.type === activeTab);


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
                            <span className="text-[16px] text-[#717073]">{item.date}</span>
                        </div>

                    </div>
                    <div>
                        <h3 className="font-semibold text-[18px] py-4 pb-2">{item.title}</h3>
                        <p className="text-[18px] font-medium  text-gray-600 mt-1">
                            {item.content}
                        </p>
                    </div>
                </div>

            ))}
        </div>
    );
}
