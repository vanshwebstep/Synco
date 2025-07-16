import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Check, X } from 'lucide-react';

const ViewSessions = () => {
  const tabs = ['Members', 'Trials', 'Coaches'];
  const [activeTab, setActiveTab] = useState('Members');
  const [attendance, setAttendance] = useState([true, false, true]);
  const [reason, setReason] = useState('Weather');
  const [notifyMembers, setNotifyMembers] = useState(true);
  const [creditSession, setCreditSession] = useState(true);
  const [notifyTrials, setNotifyTrials] = useState(true);
  const [notifyCoaches, setNotifyCoaches] = useState(true);
  const [messageType, setMessageType] = useState('Email');
  const [subject, setSubject] = useState('Class cancellation');
  const [emailText, setEmailText] = useState('');
  const navigate = useNavigate();

  const toggleAttendance = (index, status) => {
    const updated = [...attendance];
    updated[index] = status;
    setAttendance(updated);
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-start md:items-center mb-6">
        <h2
          onClick={() => navigate('/weekly-classes/venues/class-schedule')}
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
            <p><strong>Venue</strong><br />Chelsea Academy</p>
            <p><strong>Class</strong><br />4–5 Years</p>
            <p><strong>Date</strong><br />Sunday 23rd April 2023</p>
            <p><strong>Time</strong><br />11:00am – 12:00pm</p>
          </div>
        </div>

        {/* Right - Form Section */}
        <div className="w-full md:w-9/12 space-y-6">
          {/* Form Inputs */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Left Form Area */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Reason for cancelling</label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
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
                <label><input type="radio" checked={notifyMembers} onChange={() => setNotifyMembers(true)} /> Yes</label>
                <label className="ml-4"><input type="radio" checked={!notifyMembers} onChange={() => setNotifyMembers(false)} /> No</label>

                <p className="mt-3 font-medium">Credit members 1 session?</p>
                <label><input type="radio" checked={creditSession} onChange={() => setCreditSession(true)} /> Yes</label>
                <label className="ml-4"><input type="radio" checked={!creditSession} onChange={() => setCreditSession(false)} /> No</label>

                <p className="mt-3 font-medium">Would you like to notify trialists?</p>
                <label><input type="radio" checked={notifyTrials} onChange={() => setNotifyTrials(true)} /> Yes</label>
                <label className="ml-4"><input type="radio" checked={!notifyTrials} onChange={() => setNotifyTrials(false)} /> No</label>

                <p className="mt-3 font-medium">Would you like to notify coaches?</p>
                <label><input type="radio" checked={notifyCoaches} onChange={() => setNotifyCoaches(true)} /> Yes</label>
                <label className="ml-4"><input type="radio" checked={!notifyCoaches} onChange={() => setNotifyCoaches(false)} /> No</label>
              </div>
            </div>

            {/* Right Email Content */}
            <div>
              <div className="flex  p-1 rounded-xl mb-4 w-fit">
                {tabs.map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-1.5   border-b text-[16px] min-w-25 font-medium transition ${activeTab === tab ? '  border-blue-500 ' : 'text-gray-500 border-b border-gray-200 hover:text-blue-500'}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="space-y-2">
                <label className="block text-base font-semibold">Select cancellation template</label>
                <select className="w-full border border-gray-300 rounded-lg px-3 p-3">
                  <option>{reason} {activeTab} Members</option>
                </select>

                <label className="block text-base font-semibold mt-2">Subject Line</label>
                <input
                  className="w-full border border-gray-300 rounded-lg p-3"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />

                <label className="block text-base font-semibold mt-2">Email</label>
                <textarea
                  className="w-full bg-gray-100 border border-gray-300 rounded-lg p-3 h-60"
                  value={emailText}
                  onChange={(e) => setEmailText(e.target.value)}
                />

                <div className="flex items-center gap-4 mt-2">
                  <label><input type="radio" checked={messageType === 'Email'} onChange={() => setMessageType('Email')} /> Email</label>
                  <label><input type="radio" checked={messageType === 'Text'} onChange={() => setMessageType('Text')} /> Text</label>
                </div>
<div className='text-end'>
                <button className="mt-4  bg-blue-500 text-base px-20 py-3 hover:bg-blue-600 text-white px-6 py-2 rounded-lg">
                  Send
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
