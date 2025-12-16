import { Plus } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const coursesData = Array(12).fill({
  imageUrl: "/reportsIcons/studentPortal.png",
  title: "5 Ball Mastery Skills",
  duration: "45 mins",
  skills: 10,
  level: "Beginners",
  completedPercent: 75,
});

const tabs = ["Beginners", "Intermediate", "Advance"];

const CourseCard = ({ course }) => {
  return (
    <div className="bg-white rounded-2xl p-3  cursor-pointer">
      <img
        src={course.imageUrl}
        alt={course.title}
        className="rounded-2xl w-full h-36 object-cover mb-3"
      />


      <div className="flex justify-between">
        <h4 className="text-[20px] text-[#3E3E47] font-semibold mb-1">{course.title}</h4>
        <div className="flex space-x-2 mb-2">
          <button
            title="Edit"
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <img src="/images/icons/edit.png" alt="" className="w-6" />

          </button>
          <button
            title="Delete"
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <img src="/images/icons/deleteIcon.png" alt="" className="w-6" />

          </button>
        </div>
      </div>


      <div className="flex items-center text-xs text-gray-500 space-x-3 my-2">
        <div className="flex items-center space-x-1">
          <img src="/reportsIcons/clock-01.png" alt="" className="w-5 " />
          <span className="text-[14px] font-semibold text-[#717073] ">{course.duration}</span>
        </div>
        <div className="flex items-center space-x-1">
          <img src="/reportsIcons/Vector.png" alt="" className="w-5 " />
          <span className="text-[14px] font-semibold text-[#717073] ">{course.skills} Skills</span>
        </div>
        <div className="flex items-center space-x-1">

          <img src="/reportsIcons/beginner.png" alt="" className="w-4 " />
          <span className="text-[14px] font-semibold text-[#717073] ">{course.level}</span>
        </div>
      </div>



      <div className="text-[14px] font-semibold text-[#34353B] mb-1.5 mt-3">
        75% Completed
      </div>

      <div className="w-full h-[9px] bg-[#ECEEF1] rounded-full overflow-hidden">
        <div
          className="h-full bg-[#43BE4F]"
          style={{ width: `${course.completedPercent}%` }}
        />
      </div>
    </div>
  );
};

export default function StudentCource() {
  const [activeTab, setActiveTab] = useState("Beginners");
  const navigate = useNavigate();

  return (

    <>
      <div className="flex  my-5  justify-between">
        <h2 className="text-[24px] font-semibold">
          Skills Tracker Training Courses
        </h2>
        <button className="flex gap-2 items-center bg-[#237FEA] text-white rounded-2xl p-3 py-2" onClick={()=>navigate(`/configuration/coach-pro/student/create`)}> <Plus /> Add course</button>
      </div>
      <div className="py-6 bg-white min-h-screen rounded-4xl">
        <h2 className="text-center font-semibold text-[22px] mb-4">All Courses</h2>

        <div className="flex justify-center mb-6 space-x-3 w-fit m-auto bg-[#F9F9FB] p-3  rounded-xl p-1 text-sm">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 rounded-lg text-[18px] transition ${activeTab === tab
                ? "bg-[#237FEA] text-white"
                : "text-[#282829] hover:bg-gray-200"
                }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

     
        <div className="border-[#E2E1E5] border-t p-6">
          <div className="grid xl:grid-cols-4 md:grid-cols-3 gap-1  ">
            {coursesData.map((course, idx) => (
              <CourseCard key={idx} course={course} />
            ))}
          </div>

        </div>
      </div>

    </>
  );
}
