import List from "./List";
import Sidebar from "./Sidebar";

export default function Notification() {
  return (
    <>
      <div className="md:flex justify-between items-center mb-4">
        <h1 className="text-[28px] font-semibold py-2">Notification</h1>
        <button className="text-[#717073] underline cursor-pointer">Mark as read</button>
      </div>
      <div className="md:flex gap-5 bg-gray-50">
        <Sidebar />
        <div className="md:w-9/12 mt-5 md:mt-0 overflow-y-auto">
          <List />
        </div>
      </div>
    </>
  );
}
