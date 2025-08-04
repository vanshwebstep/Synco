import { useNotification } from "../contexts/NotificationContext";
import List from "./List";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";
export default function Notification() {
  const { fetchMarkAsRead } = useNotification();
  const navigate = useNavigate();
  return (
    <>
      <div className="md:flex justify-between items-center mb-4">
        <h1 className="text-[28px] font-semibold py-2">Notification</h1>
<div className="flex gap-4 items-center">
        <button
          className="text-[#717073] underline cursor-pointer"
          onClick={() => navigate("/notification-list")}
        >
          Create Notification
        </button>        <button className="text-[#717073] underline cursor-pointer" onClick={() => fetchMarkAsRead()}>Mark as read</button>
     </div> </div>
      <div className="md:flex gap-5 bg-gray-50">
        <Sidebar />
        <div className="md:w-9/12 mt-5 md:mt-0 overflow-y-auto break-words overflow-x-hidden">
          <List />
        </div>

      </div>
    </>
  );
}
