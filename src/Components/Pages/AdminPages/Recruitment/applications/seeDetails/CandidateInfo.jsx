import { useState, useCallback, useEffect } from 'react'
import Swal from "sweetalert2";
import { useSearchParams } from "react-router-dom";

import { useNotification } from '../../../contexts/NotificationContext';
import { Check, Mail, MessageSquare, Search } from "lucide-react";
import { IoIosArrowDown } from "react-icons/io";
import { motion } from "framer-motion";
import { IoMdCheckmarkCircle } from "react-icons/io";
import Select from "react-select";
import { useRecruitmentTemplate } from '../../../contexts/RecruitmentContext';
import { useVenue } from '../../../contexts/VenueContext';
import Loader from '../../../contexts/Loader';
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


const CandidateInfo = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [loading, setLoading] = useState(false);
const [telephoneCall, setTelephoneCall] = useState({
    date: "",
    time: "",
    reminder: "",
    email: "",
    scores: {
      communication: null,
      passion: null,
      experience: null,
      knowledge: null,
    },
  });

  const [rateOpen, setRateOpen] = useState(false);
  const [openCandidateStatusModal, setOpenCandidateStatusModal] = useState(false);
  const { fetchCoachRecruitmentById, recuritmentDataById,rejectCoach} = useRecruitmentTemplate() || {};
  const { fetchVenueNames, venues } = useVenue() || {};

  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");   // 👉 this gives "7"

  console.log("Candidate ID:", id);

  const [openResultModal, setOpenResultModal] = useState(false);
  const [openOfferModal, setOpenOfferModal] = useState(false);
  const [commentsList, setCommentsList] = useState([]);
  const [comment, setComment] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const commentsPerPage = 5; // Number of comments per page
  const { adminInfo } = useNotification();

  // const [venues, setVenues] = useState([]);

  console.log('recuritmentDataById', recuritmentDataById);
  const [form, setForm] = useState({
    firstName: recuritmentDataById?.firstName || "",
    surname: recuritmentDataById?.lastName || "",
    dob: recuritmentDataById?.dob || "",
    age: recuritmentDataById?.age || "",
    email: recuritmentDataById?.email || "",
    phone: recuritmentDataById?.phoneNumber || "",
    postcode: recuritmentDataById?.postcode || "",
    heardFrom: recuritmentDataById?.candidateProfile?.howDidYouHear || "Indeed",

    ageGroup: recuritmentDataById?.candidateProfile?.ageGroupExperience || "",
    vehicle:
      recuritmentDataById?.candidateProfile?.accessToOwnVehicle === true
        ? "Yes"
        : recuritmentDataById?.candidateProfile?.accessToOwnVehicle === false
          ? "No"
          : "",
    qualification: recuritmentDataById?.candidateProfile?.whichQualificationYouHave || "",
    experience: recuritmentDataById?.candidateProfile?.footballExperience || "",
    venues: recuritmentDataById?.venues || [],
    coverNote: recuritmentDataById?.coverNote || "",
  });

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };
  const selectedVenueNames = venues
    .filter(v => form.venues.includes(v.id))
    .map(v => v.name);
  const handleVenueChange = (id) => {
    setForm((prev) => ({
      ...prev,
      venues: prev.venues.includes(id)
        ? prev.venues.filter((x) => x !== id)
        : [...prev.venues, id],
    }));
  };



  const venueSlots = [
    "London Bridge / SAT 9 AM - 10 AM",
    "London Bridge / SAT 10 AM - 11 AM",
    "London Bridge / SAT 11 AM - 12 PM",
    "London Bridge / SAT 12 PM - 1 PM",
    "London Bridge / SAT 2 PM - 3 PM",
    "London Bridge / SAT 3 PM - 4 PM",
  ];
  // Pagination calculations
  const indexOfLastComment = currentPage * commentsPerPage;
  const indexOfFirstComment = indexOfLastComment - commentsPerPage;
  const currentComments = commentsList.slice(indexOfFirstComment, indexOfLastComment);
  const totalPages = Math.ceil(commentsList.length / commentsPerPage);

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const past = new Date(timestamp);
    const diff = Math.max(0, Math.floor((now - past) / 1000));
    // in seconds

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
      title: "Telephone Call Setup",
      buttonText: "Schedule a call",
      isOpen: false,
      status: "pending",
    },


    {
      id: 3,
      title: "Delivery Telephone Interview",
      buttonText: "Scorecard",
      status: "pending",
    },
    {
      id: 4,
      title: "Practical assessment",
      date: "23 April, 2023",
      status: "pending",
    },
    {
      id: 5,
      title: "Waiting results",
      resultPercent: "87%",
      resultStatus: "Passed",
      status: "pending",
    },
  ]);

  // Toggle completion on click


  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await fetchComments();
      await fetchCoachRecruitmentById(id);
      await fetchVenueNames();
      setLoading(false);
    };

    if (id) init();
  }, [id, fetchCoachRecruitmentById, fetchComments, fetchVenueNames]);
  useEffect(() => {
    if (!recuritmentDataById) return;

    const venueWorkRaw =
      recuritmentDataById?.candidateProfile?.availableVenueWork;

    let parsedVenues = [];

    try {
      parsedVenues = Array.isArray(venueWorkRaw)
        ? venueWorkRaw
        : venueWorkRaw
          ? JSON.parse(venueWorkRaw)
          : [];
    } catch (e) {
      parsedVenues = [];
    }

    setForm({
      firstName: recuritmentDataById.firstName || "",
      surname: recuritmentDataById.lastName || "",
      dob: recuritmentDataById.dob || "",
      age: recuritmentDataById.age || "",
      email: recuritmentDataById.email || "",
      phone: recuritmentDataById.phoneNumber || "",
      postcode: recuritmentDataById.postcode || "",
      heardFrom: recuritmentDataById?.candidateProfile?.howDidYouHear || "Indeed",
      ageGroup: recuritmentDataById?.candidateProfile?.ageGroupExperience || "",
      vehicle:
        recuritmentDataById?.candidateProfile?.accessToOwnVehicle === true
          ? "Yes"
          : recuritmentDataById?.candidateProfile?.accessToOwnVehicle === false
            ? "No"
            : "",
      qualification:
        recuritmentDataById?.candidateProfile?.whichQualificationYouHave || "",
      experience:
        recuritmentDataById?.candidateProfile?.footballExperience || "",
      venues: parsedVenues,   // ✅ FIX HERE
      coverNote: recuritmentDataById?.coverNote || "",
    });
  }, [recuritmentDataById]);
useEffect(() => {
    if (!recuritmentDataById?.candidateProfile) return;

    const p = recuritmentDataById.candidateProfile;

    setTelephoneCall({
      date: p.telephoneCallSetupDate || "",
      time: p.telephoneCallSetupTime || "",
      reminder: p.telephoneCallSetupReminder || "",
      email: p.telephoneCallSetupEmail || "",
      scores: {
        communication: p.telePhoneCallDeliveryCommunicationSkill ?? null,
        passion: p.telePhoneCallDeliveryPassionCoaching ?? null,
        experience: p.telePhoneCallDeliveryExperience ?? null,
        knowledge: p.telePhoneCallDeliveryKnowledgeOfSSS ?? null,
      },
    });

    setSteps(prev =>
      prev.map(step => {
        if (step.id === 1) {
          return { ...step, status: p.qualifyLead ? "completed" : "pending" };
        }
        if (step.id === 2 && p.telephoneCallSetupDate) {
          return { ...step, status: "completed" };
        }
        if (step.id === 3 && p.telePhoneCallDeliveryCommunicationSkill) {
          return { ...step, status: "completed" };
        }
        if (step.id === 5 && p.result) {
          return {
            ...step,
            resultPercent: recuritmentDataById.telephoneCallScorePercentage + "%",
            resultStatus: p.result === "passed" ? "Passed" : "Failed",
            status: "completed",
          };
        }
        return step;
      })
    );
  }, [recuritmentDataById]);
   const toggleStep = (id, status) => {
    setSteps(prev =>
      prev.map(step =>
        step.id === id ? { ...step, status } : step
      )
    );
  };

  const toggleOpenStep = (id) => {
    setSteps(prev =>
      prev.map(step =>
        step.id === id ? { ...step, isOpen: !step.isOpen } : step
      )
    );
  };
 const handleRejectCandidate = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to Reject this Candidate ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Reject it',
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      await rejectCoach(id);

    }
  };

  if (loading) return <Loader />;

  return (
    <>
      <button className="p-3 text-[#34AE56] font-bold bg-[#E5F2EA] px-10 absolute right-0 top-0 rounded-2xl">
        Recruited
      </button>
      {/* <button className="p-3 text-white font-bold bg-[#D95858] px-10 absolute right-0 top-0 rounded-2xl">
        Rejected
      </button> */}
      <div className='flex gap-8'>
        <div className="md:w-8/12">

          {/* Section: Candidate Information */}
          <div className="bg-white rounded-2xl p-6 space-y-6">
            <h2 className="font-semibold text-[24px]">Candidate Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/** FIRST NAME */}
              <div className="space-y-1">
                <label className="text-[16px] font-semibold block">First Name</label>
                <input
                  type="text"
                  className="input border border-[#E2E1E5] rounded-xl w-full p-3"
                  value={form.firstName}
                  onChange={(e) => handleChange("firstName", e.target.value)}
                  placeholder="Tom"
                />
              </div>

              {/** SURNAME */}
              <div className="space-y-1">
                <label className="text-[16px] font-semibold block">Surname</label>
                <input
                  type="text"
                  className="input border border-[#E2E1E5] rounded-xl w-full p-3"
                  value={form.surname}
                  onChange={(e) => handleChange("surname", e.target.value)}
                  placeholder="John"
                />
              </div>

              {/** DOB */}
              <div className="space-y-1">
                <label className="text-[16px] font-semibold block">Date of Birth</label>
                <input
                  type="date"
                  className="input border border-[#E2E1E5] rounded-xl w-full p-3"
                  value={form.dob}
                  onChange={(e) => handleChange("dob", e.target.value)}
                />
              </div>

              {/** AGE */}
              <div className="space-y-1">
                <label className="text-[16px] font-semibold block">Age</label>
                <input
                  type="number"
                  className="input border border-[#E2E1E5] rounded-xl w-full p-3"
                  value={form.age}
                  onChange={(e) => handleChange("age", e.target.value)}
                  placeholder="25"
                />
              </div>

              {/** EMAIL */}
              <div className="space-y-1">
                <label className="text-[16px] font-semibold block">Email</label>
                <input
                  type="email"
                  className="input border border-[#E2E1E5] rounded-xl w-full p-3"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="email@gmail.com"
                />
              </div>

              {/** PHONE */}
              <div className="space-y-1">
                <label className="text-[16px] font-semibold block">Phone number</label>
                <input
                  type="text"
                  className="input border border-[#E2E1E5] rounded-xl w-full p-3"
                  value={form.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder="+91"
                />
              </div>

              {/** POSTCODE */}
              <div className="space-y-1">
                <label className="text-[16px] font-semibold block">London Postcode</label>
                <input
                  type="text"
                  className="input border border-[#E2E1E5] rounded-xl w-full p-3"
                  value={form.postcode}
                  onChange={(e) => handleChange("postcode", e.target.value)}
                  placeholder="SW15 0AB"
                />
              </div>

              {/** HEARD FROM */}
              <div className="space-y-1">
                <label className="text-[16px] font-semibold block">How did you hear about us?</label>
                <select
                  className="input border border-[#E2E1E5] rounded-xl w-full p-3"
                  value={form.heardFrom}
                  onChange={(e) => handleChange("heardFrom", e.target.value)}
                >
                  <option value="Indeed">Indeed</option>
                  <option value="Facebook">Facebook</option>
                  <option value="LinkedIn">Linked In</option>
                  <option value="Instagram">Instagram</option>
                  <option value="Referral">Referral</option>
                </select>
              </div>

            </div>
          </div>

          {/* Job Specifications */}
          <div className="bg-white rounded-2xl p-6 space-y-6">
            <h2 className="font-semibold text-[24px]">Job Specifications</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Age Groups */}
              <div>
                <p className="font-semibold text-[18px] mb-2">Age groups experience</p>
                <div className="space-y-2">
                  {["5-7", "7-10", "9-12", "13-16"].map((age) => (
                    <label key={age} className="flex items-center gap-3 cursor-pointer select-none">

                      <input
                        type="radio"
                        name="ageGroup"
                        value={age}
                        checked={form.ageGroup === age}
                        onChange={(e) => handleChange("ageGroup", e.target.value)}
                        className="peer hidden"
                      />

                      <span className="w-5 h-5 rounded-full border-2 border-gray-400 flex items-center justify-center peer-checked:bg-blue-600 peer-checked:border-blue-600 text-white">
                        <Check className="p-[2px]" />
                      </span>

                      {age}
                    </label>
                  ))}
                </div>
              </div>

              {/* VEHICLE */}
              <div>
                <p className="font-semibold text-[18px] mb-2">Access to your own vehicle?</p>
                <div className="space-y-2">
                  {["Yes", "No"].map((v) => (
                    <label key={v} className="flex items-center gap-3 cursor-pointer select-none">

                      <input
                        type="radio"
                        value={v}
                        checked={form.vehicle === v}
                        onChange={(e) => handleChange("vehicle", e.target.value)}
                        className="peer hidden"
                      />

                      <span className="w-5 h-5 rounded-full border-2 border-gray-400 flex items-center justify-center peer-checked:bg-blue-600 peer-checked:border-blue-600 text-white">
                        <Check className="p-[2px]" />
                      </span>

                      {v}
                    </label>
                  ))}
                </div>
              </div>

              {/* QUALIFICATIONS */}
              <div>
                <p className="font-semibold text-[18px] mb-2">Which qualifications do you have?</p>
                <div className="space-y-2">
                  {["Bachelor's Degree", "Level one in football", "Level two in football", "Higher level"].map((q) => (
                    <label key={q} className="flex items-center gap-3 cursor-pointer select-none">

                      <input
                        type="radio"
                        value={q}
                        checked={form.qualification === q}
                        onChange={(e) => handleChange("qualification", e.target.value)}
                        className="peer hidden"
                      />

                      <span className="w-5 h-5 rounded-full border-2 border-gray-400 flex items-center justify-center peer-checked:bg-blue-600 peer-checked:border-blue-600 text-white">
                        <Check className="p-[2px]" />
                      </span>

                      {q}
                    </label>
                  ))}
                </div>
              </div>

              {/* EXPERIENCE */}
              <div>
                <p className="font-semibold text-[18px] mb-2">How many years football coaching experience?</p>
                <div className="space-y-2">
                  {["0-1 year", "2 years", "3 years", "More"].map((ex) => (
                    <label key={ex} className="flex items-center gap-3 cursor-pointer select-none">

                      <input
                        type="radio"
                        value={ex}
                        checked={form.experience === ex}
                        onChange={(e) => handleChange("experience", e.target.value)}
                        className="peer hidden"
                      />

                      <span className="w-5 h-5 rounded-full border-2 border-gray-400 flex items-center justify-center peer-checked:bg-blue-600 peer-checked:border-blue-600 text-white">
                        <Check className="p-[2px]" />
                      </span>

                      {ex}
                    </label>
                  ))}
                </div>
              </div>

              {/* VENUES */}
              <div className="md:col-span-2">
                <p className="font-semibold text-[18px] mb-2">Which venues are you available for work?</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {venues.map((venue) => (
                      <label
                        key={venue.id}
                        className="flex items-center gap-3 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={form.venues.includes(venue.id)}
                          onChange={() => handleVenueChange(venue.id)}
                        />
                        <span>{venue.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Further Details */}
          <div className="bg-white rounded-2xl p-6 space-y-4">
            <h2 className="font-semibold text-[24px]">Further Details</h2>

            <button className="px-4 py-2.5 bg-[#237FEA] text-white rounded-lg text-sm">
              Download CV
            </button>

            <textarea
              className="input border border-[#E2E1E5] bg-[#FAFAFA] rounded-xl w-full p-3 h-32 resize-none"
              value={form.coverNote}
              onChange={(e) => handleChange("coverNote", e.target.value)}
              placeholder="Cover Note"
            ></textarea>
          </div>

          {/* SUBMIT BUTTON */}
          <button
            className="bg-blue-600 text-white px-5 py-3 rounded-xl"
            onClick={() => console.log("Submit Payload:", form)}
          >
            Submit
          </button>


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
         <div className="bg-white p-6 rounded-2xl space-y-6">
      <h2 className="text-xl font-semibold">Recruitment status</h2>

      <div className="relative pl-6 space-y-10">
        <div className="absolute left-[17px] top-1 bottom-6 border-l border-gray-300"></div>

        {steps.map(step => (
          <div
            key={step.id}
            className={`relative ps-[20px] ${
              step.status === "completed"
                ? "opacity-100"
                : step.status === "skipped"
                ? "opacity-40"
                : "opacity-70"
            }`}
          >
            {/* DOT */}
            <div className="absolute -left-3 top-1 w-3 h-3 rounded-full bg-black"></div>

            {/* HEADER */}
            <div className="flex justify-between items-center">
              <p className="font-semibold">{step.title}</p>

              {step.status !== "completed" && (
                <button
                  className="text-gray-400 text-sm"
                  onClick={() => toggleStep(step.id, "skipped")}
                >
                  Skip
                </button>
              )}
            </div>

            {/* QUALIFY BUTTONS */}
            {step.actionType === "buttons" && (
              <div className="flex gap-2 mt-3">
                <button
                  className="w-8 h-8 border rounded-lg"
                  onClick={() => toggleStep(step.id, "skipped")}
                >
                  ✕
                </button>
                <button
                  className="w-8 h-8 bg-blue-600 text-white rounded-lg"
                  onClick={() => toggleStep(step.id, "completed")}
                >
                  ✓
                </button>
              </div>
            )}

            {/* BUTTON */}
            {step.buttonText && (
              <button
                className="mt-3 flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-xl"
                onClick={() =>
                  step.id === 2
                    ? toggleOpenStep(step.id)
                    : setRateOpen(true)
                }
              >
                {step.buttonText}
                {step.id === 2 && <IoIosArrowDown />}
              </button>
            )}

            {/* TELEPHONE CALL FORM */}
            {step.id === 2 && step.isOpen && (
              <div className="bg-gray-50 rounded-xl p-4 mt-3 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="date"
                    value={telephoneCall.date}
                    onChange={(e) =>
                      setTelephoneCall({ ...telephoneCall, date: e.target.value })
                    }
                    className="border rounded-xl p-2"
                  />
                  <input
                    type="time"
                    value={telephoneCall.time}
                    onChange={(e) =>
                      setTelephoneCall({ ...telephoneCall, time: e.target.value })
                    }
                    className="border rounded-xl p-2"
                  />
                </div>

                <input
                  type="email"
                  placeholder="Candidate email"
                  value={telephoneCall.email}
                  onChange={(e) =>
                    setTelephoneCall({ ...telephoneCall, email: e.target.value })
                  }
                  className="border w-full rounded-xl p-2"
                />

                <button
                  className="w-full bg-blue-600 text-white py-2 rounded-xl"
                  onClick={() => toggleStep(2, "completed")}
                >
                  Confirm Call
                </button>
              </div>
            )}

            {/* RESULT */}
            {step.resultPercent && (
              <div className="mt-3 flex gap-3">
                <span className="bg-blue-600 text-white px-3 py-2 rounded-xl">
                  {step.resultPercent}
                </span>
                <span className="text-green-600 mt-2">
                  ✓ {step.resultStatus}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* SCORECARD MODAL */}
      {rateOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl w-full max-w-lg p-6"
          >
            <h3 className="text-lg font-semibold mb-4">Call Scorecard</h3>

            {["communication", "passion", "experience", "knowledge"].map(key => (
              <div key={key} className="mb-4">
                <p className="capitalize font-semibold mb-2">{key}</p>
                {[1,2,3,4,5].map(n => (
                  <label key={n} className="mr-4">
                    <input
                      type="radio"
                      checked={telephoneCall.scores[key] === n}
                      onChange={() =>
                        setTelephoneCall(prev => ({
                          ...prev,
                          scores: { ...prev.scores, [key]: n }
                        }))
                      }
                    />{" "}
                    {n}
                  </label>
                ))}
              </div>
            ))}

            <button
              className="w-full bg-blue-600 text-white py-2 rounded-xl"
              onClick={() => {
                toggleStep(3, "completed");
                setRateOpen(false);
              }}
            >
              Submit Scorecard
            </button>
          </motion.div>
        </div>
      )}
    </div>

          {/* FOOTER ACTIONS */}
          <div className="bg-white p-6 rounded-2xl  space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center gap-2 border border-[#717073] rounded-xl py-3">
                <Mail size={18} /> <span>Send Email</span>
              </button>

              <button className="flex items-center justify-center gap-2 border border-[#717073] rounded-xl py-3">
                <MessageSquare size={18} /> <span>Send Text</span>
              </button>
            </div>

            <button className="w-full border border-[#E2E1E5]  rounded-xl py-3 text-[#494949]">
              Invite to CoachPro
            </button>
{/* onClick={() => setOpenCandidateStatusModal(true)} */}
            <button  onClick={() => handleRejectCandidate(id)}  className="w-full bg-[#237FEA] text-white py-3 rounded-xl">
              Reject Candidate
            </button>
            <button className="w-full border border-[#E2E1E5]  rounded-xl py-3 text-[#494949]">
              Add to Pathway Course
            </button>
            <button className="w-full bg-[#D95858] text-white py-3 rounded-xl">
              Withdraw employment
            </button>
            <button className="w-full bg-[#D95858] text-white py-3 rounded-xl">
              Rebook for practical assessment
            </button>

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
              className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-auto shadow-xl"
            >
              <div className="relative mt-6 border-b  border-[#E2E1E5]  pb-5">
                <h2 className="text-xl font-semibold  text-center">Send Offer of Employment</h2>
                <button
                  onClick={() => setOpenOfferModal(false)}
                  className="absolute top-0 left-4 text-black hover:text-black text-xl"
                >
                  ✕
                </button>
              </div>
              <form action="" className='p-6'>
                <div className="mb-3 relative">
                  <label className="text-black font-semibold text-[16px] mb-2 block">
                    Venue
                  </label>

                  {/* Search Icon */}
                  <span className="absolute left-4 top-11 text-gray-400">
                    <Search />
                  </span>

                  <input
                    type="text"
                    placeholder="Search"
                    className="border border-[#E2E1E5]  w-full rounded-2xl p-3 pl-12"
                  />
                </div>

                <div className="mb-3">
                  <label className="text-black font-semibold text-[16px] mb-2 block">
                    Pay rate per hour
                  </label>

                  <Select
                    options={payRateOptions}
                    placeholder="Select pay rate"
                    className="react-select-container"
                    classNamePrefix="react-select"
                  />
                </div>

                <div className="mb-3">
                  <label className="text-black font-semibold text-[16px] mb-2 block">
                    Start Date
                  </label>

                  <Select
                    options={dateOptions}
                    placeholder="Select Start Date"
                    className="react-select-container"
                    classNamePrefix="react-select"
                  />
                </div>
                <div className=" mt-8">
                  <button type='submit' className='w-full p-3 border border-[#E2E1E5]  bg-[#237FEA] text-white font-semibold rounded-2xl'>Send Email Offer</button>
                </div>
              </form>


            </motion.div>
          </div >
        )}

      </div >
    </>
  )
}

export default CandidateInfo
