import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Check, X } from 'lucide-react';
import { useLocation } from "react-router-dom";
import { useClassSchedule } from '../../../../../contexts/ClassScheduleContent';

const ViewSessions = () => {
  const tabs = ['Members', 'Trials', 'Coaches'];
  const location = useLocation();
  const { cancelClass, createClassSchedules, updateClassSchedules, fetchClassSchedulesID, singleClassSchedules, classSchedules, loading, deleteClassSchedule } = useClassSchedule()
  const [activeTab, setActiveTab] = useState('Members');
  const [rolesData, setRolesData] = useState({
    Members: { subject: "", emailBody: "", deliveryMethod: "Email", templateKey: "cancel_member" },
    Trials: { subject: "", emailBody: "", deliveryMethod: "Email", templateKey: "cancel_trialist" },
    Coaches: { subject: "", emailBody: "", deliveryMethod: "Email", templateKey: "cancel_coach" },
  });
  const [attendance, setAttendance] = useState([true, false, true]);
  const [reasonForCancelling, setReasonForCancelling] = useState('Weather');
  const [notifyMembers, setNotifyMembers] = useState(true);
  const [creditMembers, setcreditMembers] = useState(true);
  const [notifyTrialists, setnotifyTrialists] = useState(true);
  const [notifyCoaches, setNotifyCoaches] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  const [messageType, setMessageType] = useState('Email');
  const [subject, setSubject] = useState('Class cancellation');
  const [emailText, setEmailText] = useState('');
  const navigate = useNavigate();
  const { schedule } = location.state || {};
  console.log("Filtered Schedules in cancel:", schedule);
  function formatDate(isoDate) {
    const date = new Date(isoDate);

    // Day names
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayName = days[date.getUTCDay()];

    // Date with ordinal suffix
    const day = date.getUTCDate();
    const ordinal = (d) => {
      if (d > 3 && d < 21) return 'th';
      switch (d % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
      }
    };
    const dayWithOrdinal = `${day}${ordinal(day)}`;

    // Month names
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const monthName = months[date.getUTCMonth()];

    const year = date.getUTCFullYear();

    return `${dayName} ${dayWithOrdinal} ${monthName} ${year}`;
  }

  const toggleAttendance = (index, status) => {
    const updated = [...attendance];
    updated[index] = status;
    setAttendance(updated);
  };
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload
    setSubmitLoading(true); // ✅ Start loading

    try {
      const roles = Object.entries(rolesData).map(([tab, data]) => {
        let notifyType = "Member";
        if (tab === "Trials") notifyType = "Trialist";
        if (tab === "Coaches") notifyType = "Coach";

        return {
          notifyType,
          subjectLine: data.subject,
          emailBody: data.emailBody,
          deliveryMethod: data.deliveryMethod,
          templateKey: data.templateKey,
        };
      });

      console.log("Final roles payload:", { roles });

      // Gather all data
      const payload = {
        reasonForCancelling,
        notifyMembers: notifyMembers ? "Yes" : "No",
        creditMembers: creditMembers ? "Yes" : "No",
        notifyTrialists: notifyTrialists ? "Yes" : "No",
        notifyCoaches: notifyCoaches ? "Yes" : "No",
        roles,
      };

      console.log("Cancellation Payload:", payload);

      await cancelClass(schedule.id, payload); // ✅ await API call
    } catch (error) {
      console.error("Error cancelling class:", error);
    } finally {
      setSubmitLoading(false); // ✅ Stop loading regardless of success/failure
    }
  };


  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-start md:items-center mb-6">
        <h2
          onClick={() => navigate(`/configuration/weekly-classes/venues/class-schedule?id=${schedule.venueId}`)}
          className="text-xl md:text-[28px] font-semibold flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
        >
          <img src="/demo/synco/icons/arrow-left.png" alt="Back" className="w-6 h-6" />
          <span>View Class Register</span>
        </h2>
      </div>

      <div className="bg-white rounded-3xl shadow p-4 md:p-6 flex flex-col md:flex-row gap-6">
        {/* Left - Cancellation Summary */}
        <div className="w-full md:w-3/12 bg-gray-100 py-6 rounded-2xl text-center">
          <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center text-white mx-auto mb-4">
            <img src="/demo/synco/icons/cancelBig.png" alt="Cancel" />
          </div>
          <p className="text-base font-semibold mb-4 border-b border-gray-300 pb-4">Cancellation</p>
          <div className="text-sm text-left px-6 text-gray-700 space-y-3">
            <p><strong>Venue</strong><br />{schedule?.venue?.name}</p>
            <p><strong>Class</strong><br />{schedule?.className}</p>
            <p><strong>Date</strong><br />{formatDate(schedule?.createdAt)}</p>
            <p><strong>Time</strong><br />{schedule?.startTime} - {schedule?.endTime}</p>
          </div>
        </div>

        {/* Right - Form Section */}
        <div className="w-full md:w-9/12 space-y-6 px-4 md:px-0">
          {/* Form Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Form Area */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Reason for cancelling</label>
                <select
                  value={reasonForCancelling}
                  onChange={(e) => setReasonForCancelling(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option>Weather</option>
                  <option>Illness</option>
                  <option>Unavailable Venue</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="space-y-2 text-sm">
                <p className="font-medium">Would you like to notify members?</p>
                <div className="flex flex-wrap gap-4">
                  <label><input type="radio" checked={notifyMembers} onChange={() => setNotifyMembers(true)} /> Yes</label>
                  <label><input type="radio" checked={!notifyMembers} onChange={() => setNotifyMembers(false)} /> No</label>
                </div>

                <p className="mt-3 font-medium">Credit members 1 session?</p>
                <div className="flex flex-wrap gap-4">
                  <label><input type="radio" checked={creditMembers} onChange={() => setcreditMembers(true)} /> Yes</label>
                  <label><input type="radio" checked={!creditMembers} onChange={() => setcreditMembers(false)} /> No</label>
                </div>

                <p className="mt-3 font-medium">Would you like to notify trialists?</p>
                <div className="flex flex-wrap gap-4">
                  <label><input type="radio" checked={notifyTrialists} onChange={() => setnotifyTrialists(true)} /> Yes</label>
                  <label><input type="radio" checked={!notifyTrialists} onChange={() => setnotifyTrialists(false)} /> No</label>
                </div>

                <p className="mt-3 font-medium">Would you like to notify coaches?</p>
                <div className="flex flex-wrap gap-4">
                  <label><input type="radio" checked={notifyCoaches} onChange={() => setNotifyCoaches(true)} /> Yes</label>
                  <label><input type="radio" checked={!notifyCoaches} onChange={() => setNotifyCoaches(false)} /> No</label>
                </div>
              </div>
            </div>

            {/* Right Email Content */}
            <div className="space-y-4">
              <div className="flex flex-wrap p-1 rounded-xl mb-4 w-fit">
                {tabs.map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-1.5 border-b text-sm md:text-base min-w-24 font-medium transition ${activeTab === tab ? 'border-blue-500' : 'text-gray-500 border-b border-gray-200 hover:text-blue-500'
                      }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="space-y-3">
                <label className="block text-sm md:text-base font-semibold">Select cancellation template</label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                  <option>{reasonForCancelling} {activeTab} Members</option>
                </select>

                <label className="block text-sm md:text-base font-semibold mt-2">Subject Line</label>
                <input
                  className="w-full border border-gray-300 rounded-lg p-3"
                  value={rolesData[activeTab].subject}
                  onChange={(e) =>
                    setRolesData({
                      ...rolesData,
                      [activeTab]: { ...rolesData[activeTab], subject: e.target.value }
                    })
                  }
                />
                {rolesData[activeTab].deliveryMethod === 'Text' ? 'Text' : 'Email'}
                <textarea
                  className="w-full bg-gray-100 border border-gray-300 rounded-lg p-3 h-60"
                  value={rolesData[activeTab].emailBody}
                  onChange={(e) =>
                    setRolesData({
                      ...rolesData,
                      [activeTab]: { ...rolesData[activeTab], emailBody: e.target.value }
                    })
                  }
                />

                <div className="flex flex-wrap items-center gap-4 mt-2 text-sm">
                  <label>
                    <input
                      type="radio"
                      checked={rolesData[activeTab].deliveryMethod === "Email"}
                      onChange={() =>
                        setRolesData({
                          ...rolesData,
                          [activeTab]: { ...rolesData[activeTab], deliveryMethod: "Email" }
                        })
                      }
                    /> Email
                  </label>
                  <label>
                    <input
                      type="radio"
                      checked={rolesData[activeTab].deliveryMethod === "Text"}
                      onChange={() =>
                        setRolesData({
                          ...rolesData,
                          [activeTab]: { ...rolesData[activeTab], deliveryMethod: "Text" }
                        })
                      }
                    /> Text
                  </label>
                </div>

                <div className="text-end ">
                  <button
                    onClick={handleSubmit}
                    disabled={submitLoading} // ✅ disable while loading
                    className={`mt-4 w-full md:w-auto cursor-pointer text-sm md:text-base px-6 py-3 md:px-20 rounded-lg 
    ${submitLoading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 cursor-pointer text-white"}
  `}
                  >
                    {submitLoading ? "Sending..." : "Send"}
                  </button>

                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ViewSessions;
