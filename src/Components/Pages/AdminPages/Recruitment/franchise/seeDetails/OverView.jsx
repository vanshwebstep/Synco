import { useState, useCallback, useEffect } from 'react'
import Swal from "sweetalert2";
import { useNotification } from '../../../contexts/NotificationContext';
import { Check, Mail, MessageSquare, Search, X } from "lucide-react";
import { IoIosArrowDown } from "react-icons/io";
import { motion } from "framer-motion";
import { IoMdCheckmarkCircle } from "react-icons/io";
import Select from "react-select";
const dateOptions = [
  { value: "2025-01-01", label: "Jan 01 2025" },
  { value: "2025-01-02", label: "Jan 02 2025" },
];
const regionalManagerOptions = [
  { value: "manager1", label: "Manager 1" },
  { value: "manager2", label: "Manager 2" },
  { value: "manager3", label: "Manager 3" },
];
const payRateOptions = [
  { value: "10", label: "₹10 / hr" },
  { value: "20", label: "₹20 / hr" },
  { value: "30", label: "₹30 / hr" },
];
const venueOptions = [
  { value: "venue1", label: "Venue 1" },
  { value: "venue2", label: "Venue 2" },
];

const classOptions = [
  { value: "class1", label: "Class 1" },
  { value: "class2", label: "Class 2" },
];

const stats = [
  { label: "Work ethic", value: 70 },
  { label: "Funds", value: 45 },
  { label: "Passion", value: 85 },
  { label: "Funds", value: 25 },
  { label: "Work ethic", value: 70 },
  { label: "Funds", value: 10 },
];
const OverView = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [rateOpen, setRateOpen] = useState(false);
  const [openCandidateStatusModal, setOpenCandidateStatusModal] = useState(false);
  const [openResultModal, setOpenResultModal] = useState(false);
  const [openOfferModal, setOpenOfferModal] = useState(false);
  const [openDiscoverDayModal, setOpenDiscoverDayModal] = useState(false);
  const [commentsList, setCommentsList] = useState([]);
  const [comment, setComment] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const commentsPerPage = 5; // Number of comments per page
  const { adminInfo } = useNotification();



  // Pagination calculations
  const indexOfLastComment = currentPage * commentsPerPage;
  const indexOfFirstComment = indexOfLastComment - commentsPerPage;
  const currentComments = commentsList.slice(indexOfFirstComment, indexOfLastComment);
  const totalPages = Math.ceil(commentsList.length / commentsPerPage);

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const past = new Date(timestamp);
    const diff = Math.floor((now - past) / 1000); // in seconds

    if (diff < 60) return `${diff} sec${diff !== 1 ? 's' : ''} ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)} min${Math.floor(diff / 60) !== 1 ? 's' : ''} ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hour${Math.floor(diff / 3600) !== 1 ? 's' : ''} ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} day${Math.floor(diff / 86400) !== 1 ? 's' : ''} ago`;

    // fallback: return exact date if older than 7 days
    return past.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const goToPage = (page) => {
    if (page < 1) page = 1;
    if (page > totalPages) page = totalPages;
    setCurrentPage(page);
  };

  const fetchComments = useCallback(async () => {
    const token = localStorage.getItem("adminToken");
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/book-membership/comment/list`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const resultRaw = await response.json();
      const result = resultRaw.data || [];
      setCommentsList(result);
    } catch (error) {
      console.error("Failed to fetch comments:", error);

      Swal.fire({
        title: "Error",
        text: error.message || error.error || "Failed to fetch comments. Please try again later.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  }, []);


  const handleSubmitComment = async (e) => {
    const token = localStorage.getItem("adminToken");
    e.preventDefault();

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);

    const raw = JSON.stringify({
      "comment": comment
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    try {
      Swal.fire({
        title: "Creating ....",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });


      const response = await fetch(`${API_BASE_URL}/api/admin/book-membership/comment/create`, requestOptions);

      const result = await response.json();

      if (!response.ok) {
        Swal.fire({
          icon: "error",
          title: "Failed to Add Comment",
          text: result.message || "Something went wrong.",
        });
        return;
      }


      Swal.fire({
        icon: "success",
        title: "Comment Created",
        text: result.message || " Comment has been  added successfully!",
        showConfirmButton: false,
      });


      setComment('');
      fetchComments();
    } catch (error) {
      console.error("Error creating member:", error);
      Swal.fire({
        icon: "error",
        title: "Network Error",
        text:
          error.message || "An error occurred while submitting the form.",
      });
    }
  }


  // steps 
  const [steps, setSteps] = useState([
    {
      id: 1,
      title: "Qualify Lead",
      actionType: "buttons", // show ✓ × buttons
      status: "completed", // completed | pending | skipped
    },

    {
      id: 2,
      title: "Google Meet Call",
      buttonText: "Schedule a call",
      isOpen: false,
      status: "pending",
    },


    {
      id: 3,
      title: "Delivery Google Meet",
      buttonText: "Scorecard",
      status: "pending",
    },
    {
      id: 4,
      title: "Discovery day",
      date: "23 April, 2023",
      status: "pending",
    },
    {
      id: 5,
      title: "Waiting for offer",
      resultPercent: "87%",
      resultStatus: "Passed",
      status: "pending",
    },
  ]);

  // Toggle completion on click
  const toggleStep = (id, newStatus) => {
    setSteps((prev) =>
      prev.map((step) =>
        step.id === id ? { ...step, status: newStatus } : step
      )
    );
  };
  //steps
  const toggleOpenStep = (id) => {
    setSteps((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, isOpen: !s.isOpen } : s
      )
    );
  };

  useEffect(() => {
    fetchComments();
  }, []);
  return (
    <>
      {/* <button className="p-3 text-[#34AE56] font-bold bg-[#E5F2EA] px-10 absolute right-0 top-0 rounded-2xl">
        Recruited
      </button> */}
      {/* <button className="p-3 text-white font-bold bg-[#D95858] px-10 absolute right-0 top-0 rounded-2xl">
        Rejected
      </button> */}
      <div className='flex gap-8'>
        <div className="md:w-8/12">

          {/* Section: Candidate Information */}
          <div className="bg-white  rounded-2xl p-6 space-y-6">
            <h2 className="font-semibold text-[24px]">Candidate Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div className="space-y-1">
                <label className="text-[16px] font-semibold block">First Name</label>
                <input type="text" className="input border border-[#E2E1E5]  rounded-xl w-full p-3" placeholder="Tom" />
              </div>

              <div className="space-y-1">
                <label className="text-[16px] font-semibold block">Surname</label>
                <input type="text" className="input border border-[#E2E1E5]  rounded-xl w-full p-3" placeholder="John" />
              </div>

              <div className="space-y-1">
                <label className="text-[16px] font-semibold block">Date of Birth</label>
                <input type="date" className="input border border-[#E2E1E5]  rounded-xl w-full p-3" />
              </div>

              <div className="space-y-1">
                <label className="text-[16px] font-semibold block">Age</label>
                <input type="number" className="input border border-[#E2E1E5]  rounded-xl w-full p-3" placeholder="25" />
              </div>

              <div className="space-y-1">
                <label className="text-[16px] font-semibold block">Email</label>
                <input type="email" className="input border border-[#E2E1E5]  rounded-xl w-full p-3" placeholder="email@gmail.com" />
              </div>

              <div className="space-y-1">
                <label className="text-[16px] font-semibold block">Phone number</label>
                <input type="text" className="input border border-[#E2E1E5]  rounded-xl w-full p-3" placeholder="+91" />
              </div>

              <div className="space-y-1">
                <label className="text-[16px] font-semibold block">London Postcode</label>
                <input type="text" className="input border border-[#E2E1E5]  rounded-xl w-full p-3" placeholder="SW15 0AB" />
              </div>

              <div className="space-y-1">
                <label className="text-[16px] font-semibold block">How did you hear about us?</label>
                <select className="input border border-[#E2E1E5]  rounded-xl w-full p-3">
                  <option>Indeed</option>
                </select>
              </div>

            </div>
          </div>

          {/* Section: Job Specifications */}

          <div className="bg-white my-5 rounded-2xl p-6 ">

            <h2 className="font-semibold text-[24px] pb-3">Franchise specifications</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div className="space-y-1">
                <label className="text-[16px] font-semibold block">Location</label>
                <input type="text" className="input border border-[#E2E1E5]  rounded-xl w-full p-3" placeholder="Chelesa" />
              </div>

              <div className="space-y-1">
                <label className="text-[16px] font-semibold block">Capital available</label>
                <input type="text" className="input border border-[#E2E1E5]  rounded-xl w-full p-3" placeholder="£123,123" />
              </div>

            </div>
          </div>


          {/* Section: Further Details */}
          <div className="bg-white  rounded-2xl p-6 space-y-4">
            <h2 className="font-semibold text-[24px]">Details</h2>

            <label className="font-semibold text-sm">
              Cover Note
            </label>

            <textarea
              className="input mt-1 border border-[#E2E1E5]   bg-[#FAFAFA] rounded-xl w-full p-3 h-32 resize-none"
              placeholder="Cover Note"
            ></textarea>
          </div>


          {/* comments */}

          <div className="bg-white my-10 rounded-3xl p-6 space-y-4">
            <h2 className="text-[24px] font-semibold">Comment</h2>

            {/* Input section */}
            <div className="flex items-center gap-2">
              <img
                src={adminInfo?.profile ? `${adminInfo.profile}` : '/members/dummyuser.png'}
                alt="User"
                className="w-14 h-14 rounded-full object-cover"
              />
              <input
                type="text"
                name='comment'
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment"
                className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-[16px] font-semibold outline-none md:w-full w-5/12"
              />
              <button
                className="bg-[#237FEA] p-3 rounded-xl text-white hover:bg-[#237FEA]"
                onClick={handleSubmitComment}
              >
                <img src="/images/icons/sent.png" alt="" />
              </button>
            </div>

            {/* Comment list */}
            {commentsList && commentsList.length > 0 ? (
              <div className="space-y-4">
                {currentComments.map((c, i) => (
                  <div key={i} className="bg-gray-50 rounded-xl p-4 text-sm">
                    <p className="text-[#494949] text-[16px] font-semibold mb-1">{c.comment}</p>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            c?.bookedByAdmin?.profile
                              ? `${c?.bookedByAdmin?.profile}`
                              : '/members/dummyuser.png'
                          }
                          onError={(e) => {
                            e.currentTarget.onerror = null; // prevent infinite loop
                            e.currentTarget.src = '/members/dummyuser.png';
                          }}
                          alt={c?.bookedByAdmin?.firstName}
                          className="w-10 h-10 rounded-full object-cover mt-1"
                        />
                        <div>
                          <p className="font-semibold text-[#237FEA] text-[16px]">{c?.bookedByAdmin?.firstName} {c?.bookedByAdmin?.lastName}</p>
                        </div>
                      </div>
                      <span className="text-gray-400 text-[16px] whitespace-nowrap mt-1">
                        {formatTimeAgo(c.createdAt)}
                      </span>
                    </div>
                  </div>
                ))}

                {/* Pagination controls */}
                {totalPages > 1 && (
                  <div className="flex justify-end items-center gap-2 mt-4">
                    <button
                      className="px-3 py-1 rounded-lg border border-gray-300 hover:bg-gray-100"
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Prev
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => (
                      <button
                        key={i}
                        className={`px-3 py-1 rounded-lg border ${currentPage === i + 1 ? 'bg-[#237FEA] text-white border-[#237FEA]' : 'border-gray-300 hover:bg-gray-100'}`}
                        onClick={() => goToPage(i + 1)}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      className="px-3 py-1 rounded-lg border border-gray-300 hover:bg-gray-100"
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-center">No Comments yet.</p>
            )}
          </div>
        </div>

        <div className="md:w-4/12  space-y-6">

          {/* MAIN CARD */}
          <div className="bg-white p-6 rounded-2xl  space-y-6">
            <h2 className="text-xl font-semibold">Recruitment status</h2>

            {/* TIMELINE */}
            <div className="relative pl-6 space-y-10">

              {/* Vertical Line */}
              <div className="absolute left-[17px] top-1 bottom-[41px] border-l border-gray-300"></div>

              {steps.map((step) => (
                <div
                  key={step.id}
                  className={`
      relative ps-[20px]
      ${step.status === "completed"
                      ? "opacity-100"
                      : step.status === "skipped"
                        ? "opacity-40"
                        : "opacity-60"
                    }
    `}
                >



                  {/* DOT */}
                  <div
                    className={`absolute -left-3 top-1 w-3 h-3 rounded-full
                  ${step.status === "completed"
                        ? "bg-[#282829]"
                        : "bg-[#282829]"
                      }
                `}
                  ></div>

                  {/* TITLE + Skip */}
                  <div className="flex justify-between">
                    <p className="font-semibold">{step.title && step.title == "Discovery day" ? (
                      <span onClick={() => setOpenDiscoverDayModal(true)}>{step.title}</span>
                    ) : (
                      <span>{step.title}</span>
                    )}</p>
                    {step.status !== "completed" && (
                      <button
                        className="text-gray-400 text-sm"
                        onClick={() => toggleStep(step.id, "skipped")}
                      >
                        <div className="flex gap-2"> Skip
                          {step.status === "skipped" ? (
                            <>
                              <img src="/reportsIcons/skipped.png" className='w-5' alt="" />
                            </>
                          ) : (
                            <img src="/reportsIcons/skip.png" className='w-5' alt="" />

                          )}
                        </div>
                      </button>
                    )}
                  </div>

                  {/* SPECIAL CASE: FIRST STEP BUTTONS */}
                  {step.actionType === "buttons" && (
                    <div className="flex items-center gap-2 mt-3">
                      <button
                        className="w-8 h-8 border rounded-lg flex items-center justify-center"
                        onClick={() => toggleStep(step.id, "skipped")}
                      >
                        ✕
                      </button>

                      <button
                        className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#237FEA] text-white"
                        onClick={() => toggleStep(step.id, "completed")}
                      >
                        ✓
                      </button>
                    </div>
                  )}
                  {/* BUTTON STEPS */}
                  {step.buttonText && (
                    <>
                      {step.buttonText === "Schedule a call" ? (
                        <button
                          className="mt-3 flex items-center gap-2 bg-[#237FEA] text-white px-3 py-2 rounded-xl text-sm"
                          onClick={() => toggleOpenStep(step.id)}
                        >
                          {step.buttonText}
                          <IoIosArrowDown />
                        </button>
                      ) : step.buttonText === "Scorecard" ? (
                        <button
                          className="mt-3 flex items-center gap-2 bg-[#237FEA] text-white px-3 py-2 rounded-xl text-sm"
                          onClick={() => setRateOpen(true)}
                        >
                          {step.buttonText}

                        </button>
                      ) : (
                        <button
                          className="mt-3 flex items-center gap-2 bg-[#237FEA] text-white px-3 py-2 rounded-xl text-sm"
                          onClick={() => toggleStep(step.id, "completed")}
                        >
                          {step.buttonText}
                        </button>
                      )}
                    </>
                  )}


                  {step.id === 2 && step.isOpen && (
                    <div className="bg-white rounded-xl mt-3 space-y-3">

                      <div className="grid grid-cols-2 gap-3">
                        <div className="border border-[#E2E1E5]  rounded-xl px-3 py-2 flex items-center justify-between text-gray-500">
                          <input type="date" className="outline-none w-full" />
                        </div>

                        <div className="border border-[#E2E1E5]  rounded-xl px-3 py-2 flex items-center justify-between text-gray-500">
                          <input type="time" className="outline-none w-full" />
                        </div>
                      </div>

                      <select className="border border-[#E2E1E5]  rounded-xl px-3 py-2.5 w-full text-gray-600">
                        <option>When do you want to be reminded?</option>
                        <option>10 minutes before</option>
                        <option>30 minutes before</option>
                        <option>1 hour before</option>
                        <option>1 day before</option>
                      </select>



                      <button
                        className="w-full bg-[#237FEA] text-white py-3 rounded-xl"
                        onClick={() => toggleStep(step.id, "completed")}
                      >
                        Confirm call
                      </button>
                    </div>
                  )}


                  {/* DATE STEP */}
                  {step.date && (
                    <p className="text-sm text-gray-400 mt-2">{step.date}</p>
                  )}

                  {/* RESULTS STEP */}
                  {step.resultPercent && (
                    <div onClick={() => toggleStep(step.id, "completed")} className="mt-3 flex items-center gap-2 ">
                      {step.resultStatus && (
                        <p className="text-green-600 text-sm font-bold mt-2">✓ {step.resultStatus}</p>
                      )}

                      <span className="bg-[#237FEA] text-white px-3 py-2 rounded-xl text-sm">
                        {step.resultPercent}
                      </span>


                      <button onClick={() => setOpenResultModal(true)} className="bg-[#237FEA] text-white px-3 py-2 rounded-xl text-sm">
                        See Results
                      </button>
                      <span className='border p-2 border-[#DADADA] rounded-md'><X /></span>
                      <button onClick={() => setOpenOfferModal(true)} className="bg-[#1CAB4B] text-white border border-[#DADADA] px-3 py-2 rounded-xl text-sm">
                        Send Offer
                      </button>
                      {/* <button className="bg-[#237FEA] text-white px-3 py-2 rounded-xl text-sm">
                        Offer Sent
                      </button> */}
                    </div>
                  )}

                  {/* {step.resultStatus && (
                    <p className="text-green-600 text-sm mt-2">✓ {step.resultStatus}</p>
                  )} */}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl ">
            <h2 className="font-semibold mb-4 text-[22px] text-gray-800">
              Recruitment status
            </h2>

            <div className="grid grid-cols-2 gap-3">
              {stats.map((item, index) => (
                <Circle key={index} label={item.label} value={item.value} />
              ))}
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl  space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center gap-2 border border-[#717073] rounded-xl py-3">
                <Mail size={18} /> <span>Send Email</span>
              </button>

              <button className="flex items-center justify-center gap-2 border border-[#717073] rounded-xl py-3">
                <MessageSquare size={18} /> <span>Send Text</span>
              </button>
            </div>

            {/* <button className="w-full border border-[#E2E1E5]  rounded-xl py-3 text-[#494949]">
              Invite to CoachPro
            </button> */}

            <button onClick={() => setOpenCandidateStatusModal(true)} className="w-full bg-[#237FEA] text-white py-3 rounded-xl">
              Reject Candidate
            </button>
            {/* <button className="w-full border border-[#E2E1E5]  rounded-xl py-3 text-[#494949]">
              Add to Pathway Course
            </button>
            <button className="w-full bg-[#D95858] text-white py-3 rounded-xl">
              Withdraw employment
            </button>
            <button className="w-full bg-[#D95858] text-white py-3 rounded-xl">
              Rebook for practical assessment
            </button> */}

          </div>
        </div>


        {/* call rate modal */}
        {rateOpen && (
          <div className="fixed inset-0 bg-black/60 flex  justify-center items-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl w-full max-w-4xl shadow-xl  overflow-hidden "
            >
              <div className="relative mt-6 border-b  border-[#E2E1E5]  pb-5">
                <h2 className="text-xl font-semibold  text-center">Interview Questions & Call Scorecard</h2>
                <button
                  onClick={() => setRateOpen(false)}
                  className="absolute top-0 right-4 text-black hover:text-black text-xl"
                >
                  ✕
                </button>
              </div>
              {/* Left Section */}
              <div className='flex items-center justify-center'>
                <div className="md:w-8/12 h-[80vh] overflow-y-auto p-6 border-r border-gray-200">

                  {/* Section */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold flex items-center gap-2 border-b border-[#E2E1E5]  pb-4">
                      <span className="text-[#237FEA]"><img src="/reportsIcons/rate.png" className='w-7' alt="" /></span> Title Name
                    </h3>
                    <ul className="mt-4 space-y-4">
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 text-xl"><IoMdCheckmarkCircle />
                        </span>
                        <p className='font-semibold text-[16px]'>Check they are free and in a quiet space for the call</p>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 text-xl"><IoMdCheckmarkCircle />
                        </span>
                        <div>
                          <p className="font-semibold text-[16px]">Give them break down for the call</p>
                          <ul className=" list-disc text-gray-600 mt-2">
                            <li className='list-none'>(A) Explain 2 steps recruitment process</li>
                            <li className='list-none'>(B) Housekeeping</li>
                            <li className='list-none'>(C) Interview Q</li>
                            <li className='list-none'>(D) Address any question they have</li>
                          </ul>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 text-xl"><IoMdCheckmarkCircle />
                        </span>
                        <div>
                          <p className="font-semibold text-[16px]">Process</p>
                          <span className="text-green-600">2 steps</span>
                          <ul className=" list-disc text-gray-600 mt-2">
                            <li className='list-none'>(A) Phone call</li>
                            <li className='list-none'>(B) Practical assessment - taking place next week and week after</li>
                          </ul>
                          <p className="text-black underline cursor-pointer mt-2">Any questions?</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 text-xl"><IoMdCheckmarkCircle />
                        </span>
                        <div>
                          <p className="font-semibold text-[16px]">Title Name</p>
                          <span className="text-green-600">2 steps</span>
                          <ul className=" list-disc text-gray-600 mt-2">
                            <li className='list-none'>(A) Phone call</li>
                            <li className='list-none'>(B) Practical assessment - taking place next week and week after</li>
                          </ul>
                          <p className="text-black underline cursor-pointer mt-2">Any questions?</p>
                        </div>
                      </li>
                    </ul>
                  </div>

                  {/* Section 2 */}
                  <div>
                    <h3 className="text-lg font-semibold flex items-center gap-2 border-b border-[#E2E1E5]  pb-4">
                      <span className="text-[#237FEA]"><img src="/reportsIcons/rate.png" className='w-7' alt="" /></span> Title Name
                    </h3>
                    <div className="mt-4">
                      <div className="flex items-start gap-2">
                        <span className="text-green-600 text-xl"><IoMdCheckmarkCircle />
                        </span>

                        <div>
                          <span>Housekeeping</span>
                          <ul className=" list-disc p-0 text-gray-600 mt-2">
                            <li className='list-none'>(A) Check all info on their form is correct</li>
                            <li className='list-none'>(B) Go through venues and ask if they are available for any more if chosen are not available</li>
                          </ul>
                          <div className="mt-6">
                            <p className="font-semibold">Questions</p>
                            <p className="text-[#494949] mt-1">What do you know about SSS?</p>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Right Section - Scorecard */}
                <div className="w-4/12 h-[80vh] overflow-y-auto p-6 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-semibold mb-6">Call Scorecard</h3>

                    {[
                      "Communication skill",
                      "Passion for coaching",
                      "Experience",
                      "Knowledge of SSS",
                    ].map((label) => (
                      <div key={label} className="mb-6">
                        <p className="font-semibold mb-2 text-[#494949]">{label}</p>
                        <div className="flex gap-4 text-[#494949]">
                          {[1, 2, 3, 4, 5].map((num) => (
                            <label key={num} className="flex items-center gap-1 cursor-pointer">
                              <input type="radio" name={label} value={num} /> {num}
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <button className="bg-[#237FEA] text-white py-3 rounded-xl w-full font-semibold hover:bg-blue-700 transition-all">
                    Submit
                  </button>
                </div>
              </div>
              {/* Close Button */}

            </motion.div>
          </div >
        )}

        {/* reject/accept modal */}
        {openCandidateStatusModal && (
          <div className="fixed inset-0 bg-black/60 flex  justify-center items-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl w-full max-w-xl shadow-xl  overflow-hidden "
            >
              <div className="relative mt-6 border-b  border-[#E2E1E5]  pb-5">
                <h2 className="text-xl font-semibold  text-center">Book Practical Assessment</h2>
                <button
                  onClick={() => setOpenCandidateStatusModal(false)}
                  className="absolute top-0 left-4 text-black hover:text-black text-xl"
                >
                  ✕
                </button>
              </div>
              <form action="" className='p-6'>
                <div className='mb-3'>
                  <label htmlFor="" className='text-black font-semibold text-[16px] mb-2 block'>Venue</label>
                  <input type="text" className='border border-[#E2E1E5]  w-full rounded-2xl p-3' />
                </div>
                <div className="mb-3">
                  <label className="text-black font-semibold text-[16px] mb-2 block">
                    Class
                  </label>
                  <Select
                    options={classOptions}
                    placeholder="Select Class"
                    className="react-select-container"
                    classNamePrefix="react-select"
                  />
                </div>

                <div className="mb-3">
                  <label className="text-black font-semibold text-[16px] mb-2 block">
                    Date
                  </label>
                  <Select
                    options={dateOptions}
                    placeholder="Select Date"
                    className="react-select-container"
                    classNamePrefix="react-select"
                  />
                </div>
                <div className='mb-3'>
                  <label htmlFor="" className='text-black font-semibold text-[16px] mb-2 block'>Assign To Venue Manager</label>
                  <Select
                    options={venueOptions}
                    placeholder="Venue Manager"
                    className="react-select-container"
                    classNamePrefix="react-select"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 mt-12">
                  <button type='button' className='w-full p-3 border border-[#E2E1E5]  text-[#717073] font-semibold rounded-2xl'>Cancel</button>
                  <button type='submit' className='w-full p-3 border border-[#E2E1E5]  bg-[#237FEA] text-white font-semibold rounded-2xl'>Send Confirmation</button>
                </div>
              </form>


            </motion.div>
          </div >
        )}

        {/* result modal */}
        {openResultModal && (
          <div className="fixed inset-0 bg-black/60 flex  justify-center items-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-auto shadow-xl"
            >
              <div className="relative mt-6 border-b  border-[#E2E1E5]  pb-5">
                <h2 className="text-xl font-semibold  text-center">Result</h2>
                <button
                  onClick={() => setOpenResultModal(false)}
                  className="absolute top-0 left-4 text-black hover:text-black text-xl"
                >
                  ✕
                </button>
              </div>
              <form action="" className='p-6'>
                <div className='mb-3'>
                  <label htmlFor="" className='text-black font-semibold text-[16px] mb-2 block'>Venue</label>
                  <input type="text" className='border border-[#E2E1E5]  w-full rounded-2xl p-3' />
                </div>



                <div className="mb-3">
                  <label className="text-black font-semibold text-[16px] mb-2 block">
                    Class
                  </label>
                  <Select
                    options={classOptions}
                    placeholder="Select Class"
                    className="react-select-container"
                    classNamePrefix="react-select"
                  />
                </div>

                <div className="mb-3">
                  <label className="text-black font-semibold text-[16px] mb-2 block">
                    Date
                  </label>
                  <Select
                    options={dateOptions}
                    placeholder="Select Date"
                    className="react-select-container"
                    classNamePrefix="react-select"
                  />
                </div>
                <div className="mb-3">
                  <label className="text-black font-semibold text-[16px] mb-2 block">
                    Regional Manager
                  </label>

                  <Select
                    options={regionalManagerOptions}
                    placeholder="Select Regional Manager"
                    className="react-select-container"
                    classNamePrefix="react-select"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-6">Call Scorecard</h3>

                  {[
                    "Punctuality of the coach",
                    "Status of the campus",
                    "Punctuality of the coach"
                  ].map((label) => (
                    <div key={label} className="mb-6">
                      <p className="font-semibold mb-2 text-[#494949]">{label}</p>
                      <div className="flex gap-4 text-[#494949]">
                        {[1, 2, 3, 4, 5].map((num) => (
                          <label key={num} className="flex items-center gap-1 cursor-pointer">
                            <input type="radio" name={label} value={num} /> {num}
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-4 mt-8">
                  <button type='submit' className='w-full p-3 border border-[#E2E1E5]  bg-[#237FEA] text-white font-semibold rounded-2xl'>Watch Video</button>
                  <button type='submit' className='w-full p-3 border border-[#E2E1E5]  bg-[#237FEA] text-white font-semibold rounded-2xl'>Play Audio Summary</button>
                </div>
              </form>


            </motion.div>
          </div >
        )}
        {/* tick offer modal */}
        {openOfferModal && (
          <div className="fixed inset-0 bg-black/60 flex  justify-center items-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl w-full p-5 max-w-lg max-h-[90vh] overflow-auto shadow-xl"
            >
              <div className="relative mt-6 border-b  border-[#E2E1E5]  pb-5">
                <h2 className="text-xl font-semibold  text-center">Send Franchise Provisional Offer</h2>
                <button
                  onClick={() => setOpenOfferModal(false)}
                  className="absolute top-0 left-4 text-black hover:text-black text-xl"
                >
                  ✕
                </button>
              </div>
              <h5 className="text-center py-5 font-semibold">Send a provision offer to prospect lead.</h5>
             
             
                  <button type='submit' className='w-full p-3 border border-[#E2E1E5]  bg-[#237FEA] text-white font-semibold rounded-2xl'>Send Email Offer</button>
                
           


            </motion.div>
          </div >
        )}
        {openDiscoverDayModal && (
          <div className="fixed inset-0 bg-black/60 flex  justify-center items-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-auto shadow-xl"
            >
              <div className="relative mt-6 border-b  border-[#E2E1E5]  pb-5">
                <h2 className="text-xl font-semibold  text-center">Discovery day</h2>
                <button
                  onClick={() => setOpenDiscoverDayModal(false)}
                  className="absolute top-0 left-4 text-black hover:text-black text-xl"
                >
                  ✕
                </button>
              </div>
              <form action="" className='p-6'>
                <div className="mb-3 relative">
                  <label className="text-black font-semibold text-[16px] mb-2 block">
                    Date
                  </label>


                  <input
                    type="text"
                    placeholder="Search"
                    className="border border-[#E2E1E5]  w-full rounded-2xl p-3 "
                  />
                </div>

                <div className="mb-3">
                  <label className="text-black font-semibold text-[16px] mb-2 block">
                    Time
                  </label>

                  <Select
                    options={payRateOptions}
                    placeholder="Select pay rate"
                    className="react-select-container"
                    classNamePrefix="react-select"
                  />
                </div>


                <div className="grid md:grid-cols-2 gap-6">
                  <button type='button' onClick={() => setOpenDiscoverDayModal(false)} className='w-full p-3 border border-[#E2E1E5]  text-[#717073] font-semibold rounded-2xl'>Cancel</button>
                  <button type='submit' className='w-full p-3 border border-[#E2E1E5]  bg-[#237FEA] text-white font-semibold rounded-2xl'>Book</button>
                </div>
              </form>


            </motion.div>
          </div >
        )}

      </div >
    </>
  )
}

export default OverView
const Circle = ({ label, value }) => {
  return (
    <div className="flex flex-col items-center my-4">
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center"
        style={{
          background: `conic-gradient(#1A73E8 ${value * 3.6}deg, #E5E7EB 0deg)`
        }}
      >
        <div className="w-14 h-14 bg-white rounded-full"></div>
      </div>

      <p className="mt-2 text-gray-600 text-sm">{label}</p>
      <p className="text-lg font-semibold">{value}%</p>
    </div>
  );
};