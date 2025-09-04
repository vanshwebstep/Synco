import { createContext, useContext, useState, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import Swal from "sweetalert2"; // make sure it's installed

const BookFreeTrialContext = createContext();

export const BookFreeTrialProvider = ({ children }) => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [bookFreeTrials, setBookFreeTrials] = useState([]);
  const [bookMembership, setBookMembership] = useState([]);
  const token = localStorage.getItem("adminToken");
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [status, setStatus] = useState(null);
  const [statsMembership, setStatsMembership] = useState([]);
  const [statsFreeTrial, setStatsFreeTrial] = useState([]);
  const [bookedByAdmin, setBookedByAdmin] = useState([]);

  const [loading, setLoading] = useState(false);
  const [isEditBookFreeTrial, setIsEditBookFreeTrial] = useState(false);
  const [singleBookFreeTrials, setSingleBookFreeTrials] = useState([]);
  const [singleBookFreeTrialsOnly, setSingleBookFreeTrialsOnly] = useState([]);
  const [serviceHistory, setServiceHistory] = useState([]);
  const [myVenues, setMyVenues] = useState([]);
  function formatLocalDate(dateString) {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return null;
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0"); // months are 0-indexed
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`; // returns "2025-08-24"
  }

  const [formData, setFormData] = useState({
    area: "",
    name: "",
    address: "",
    facility: "",
    parking: false,
    congestion: false,
    parkingNote: "",
    entryNote: "",
  });

  // Book a Free Trial

  const fetchBookFreeTrials = useCallback(
    async (
      studentName = "",
      venueName = "",
      status1 = false,
      status2 = false,
      otherDateRange = [],
      dateoftrial = [],
      forOtherDate = [],
      BookedBy = []

    ) => {
      const token = localStorage.getItem("adminToken");
      if (!token) return;
      console.log('status1', status1)
      console.log('satus2', status2)
      console.log('otherDateRange', otherDateRange)
      console.log('dateoftrial', dateoftrial)
      console.log('forOtherDate', forOtherDate)

      const shouldShowLoader = studentName || venueName || status1 || status2 || otherDateRange || dateoftrial || forOtherDate;
      // if (shouldShowLoader) setLoading(true);

      try {
        const queryParams = new URLSearchParams();

        // Student & Venue filters
        if (studentName) queryParams.append("studentName", studentName);
        if (venueName) queryParams.append("venueName", venueName);

        // Status filters
        if (status1) queryParams.append("status", "attend");
        if (status2) queryParams.append("status", "not attend");
        if (BookedBy && Array.isArray(BookedBy) && BookedBy.length > 0) {
          BookedBy.forEach(agent => queryParams.append("bookedBy", agent));
        }


        if (Array.isArray(dateoftrial) && dateoftrial.length === 2) {
          const [from, to] = dateoftrial;
          if (from && to) {
            queryParams.append("dateTrialFrom", formatLocalDate(from));
            queryParams.append("dateTrialTo", formatLocalDate(to));
          }
        }

        // 🔹 Handle general (createdAt range)
        if (Array.isArray(otherDateRange) && otherDateRange.length === 2) {
          const [from, to] = otherDateRange;
          if (from && to) {
            queryParams.append("fromDate", formatLocalDate(from));
            queryParams.append("toDate", formatLocalDate(to));
          }
        }

        if (Array.isArray(forOtherDate) && forOtherDate.length === 2) {
          const [from, to] = forOtherDate;
          if (from && to) {
            queryParams.append("fromDate", formatLocalDate(from));
            queryParams.append("toDate", formatLocalDate(to));
          }
        }
        // Trial dates (support array or single value)
        // const trialDates = Array.isArray(dateoftrial) ? dateoftrial : [dateoftrial];
        // trialDates
        //   .filter(Boolean)
        //   .map(d => formatLocalDate(d))
        //   .filter(Boolean)
        //   .forEach(d => queryParams.append("trialDate", d));

        const url = `${API_BASE_URL}/api/admin/book/free-trials${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
        const response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const resultRaw = await response.json();
        const result = resultRaw.data.trials || [];
        const venues = resultRaw.data.venue || [];
        const bookedByAdmin = resultRaw.data.bookedByAdmin || []
        setBookedByAdmin(bookedByAdmin);
        setMyVenues(venues);
        setStatsFreeTrial(resultRaw.data.stats)
        setBookFreeTrials(result);
      } catch (error) {
        console.error("Failed to fetch bookFreeTrials:", error);
      } finally {
        // if (shouldShowLoader) setLoading(false); // only stop loader if it was started
      }
    },
    []
  );
  const fetchBookFreeTrialsID = useCallback(async (ID) => {
    const token = localStorage.getItem("adminToken");
    if (!token) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/venue/${ID}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const resultRaw = await response.json();
      const result = resultRaw.data || [];
      setSingleBookFreeTrials(result);
    } catch (error) {
      console.error("Failed to fetch bookFreeTrials:", error);
    } finally {
      setLoading(false);
    }
  }, []);
  const fetchBookFreeTrialsByID = useCallback(async (ID) => {
    const token = localStorage.getItem("adminToken");
    if (!token) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/class-schedule/${ID}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const resultRaw = await response.json();
      const result = resultRaw.data || [];
      setSingleBookFreeTrialsOnly(result);
    } catch (error) {
      console.error("Failed to fetch bookFreeTrials:", error);
    } finally {
      setLoading(false);
    }
  }, []);
  const createBookFreeTrials = async (bookFreeTrialData) => {
    setLoading(true);

    const headers = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/book/free-trials/`, {
        method: "POST",
        headers,
        body: JSON.stringify(bookFreeTrialData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || result.keyInformation || "Failed to create class schedule");
      }

      await Swal.fire({
        title: "Success!",
        text: result.message || "Free Trial has been created successfully.",
        icon: "success",
        confirmButtonText: "OK",
      });
      navigate(`/configuration/weekly-classes/trial/list`)
      return result;

    } catch (error) {
      console.error("Error creating class schedule:", error);
      await Swal.fire({
        title: "Error",
        text: error.message || "Something went wrong while creating class schedule.",
        icon: "error",
        confirmButtonText: "OK",
      });
      throw error;
    } finally {
      await fetchBookFreeTrials();
      setLoading(false);
    }
  };
  const updateBookFreeTrials = async (bookFreeTrialId, updatedBookFreeTrialData) => {
    setLoading(true);

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    if (token) {
      myHeaders.append("Authorization", `Bearer ${token}`);
    }

    const requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: JSON.stringify(updatedBookFreeTrialData),
      redirect: "follow",
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/class-schedule/${bookFreeTrialId}`, requestOptions);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update bookFreeTrial");
      }

      const result = await response.json();

      await Swal.fire({
        title: "Success!",
        text: result.message || "BookFreeTrial has been updated successfully.",
        icon: "success",
        confirmButtonText: "OK",
      });

      return result;
    } catch (error) {
      console.error("Error updating bookFreeTrial:", error);
      await Swal.fire({
        title: "Error",
        text: error.message || "Something went wrong while updating bookFreeTrial.",
        icon: "error",
        confirmButtonText: "OK",
      });
      throw error;
    } finally {
      await fetchBookFreeTrials();
      setLoading(false);
    }
  };
  const deleteBookFreeTrial = useCallback(async (id) => {
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/class-schedule/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to delete bookFreeTrial");
      }

      await Swal.fire({
        icon: "success",
        title: data.message || "BookFreeTrial deleted successfully",
        confirmButtonColor: "#3085d6",
      });

      await fetchBookFreeTrials(); // Refresh the list
    } catch (err) {
      console.error("Failed to delete bookFreeTrial:", err);
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message || "Something went wrong",
        confirmButtonColor: "#d33",
      });
    }
  }, [token, fetchBookFreeTrials]);

  const serviceHistoryFetchById = useCallback(async (ID) => {
    const token = localStorage.getItem("adminToken");
    if (!token) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/service-history/account-profile/${ID}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const resultRaw = await response.json();
      const result = resultRaw.data || [];
      setServiceHistory(result);
    } catch (error) {
      console.error("Failed to fetch bookFreeTrials:", error);
    } finally {
      setLoading(false);
    }
  }, []);
  const sendFreeTrialmail = async (bookingIds) => {
    setLoading(true);

    const headers = {
      "Content-Type": "application/json",
    };
    console.log('bookingIds', bookingIds)
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/book/free-trials/send-email`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          bookingIds: bookingIds, // make sure bookingIds is an array like [96, 97]
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to create Membership");
      }

      await Swal.fire({
        title: "Success!",
        text: result.message || "Trialsssssss has been created successfully.",
        icon: "success",
        confirmButtonText: "OK",
      });

      return result;

    } catch (error) {
      console.error("Error creating class schedule:", error);
      await Swal.fire({
        title: "Error",
        text: error.message || "Something went wrong while creating class schedule.",
        icon: "error",
        confirmButtonText: "OK",
      });
      throw error;
    } finally {
      await fetchBookFreeTrials();
      setLoading(false);
    }
  };
  const cancelFreeTrial = async (bookingIds) => {
    setLoading(true);

    const headers = {
      "Content-Type": "application/json",
    };
    console.log('bookingIds', bookingIds)
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/cancel-freeTrial`, {
        method: "POST",
        headers,
        body: JSON.stringify(bookingIds, // make sure bookingIds is an array like [96, 97]
        ),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to create Membership");
      }

      await Swal.fire({
        title: "Success!",
        text: result.message || "Trialsssssss has been created successfully.",
        icon: "success",
        confirmButtonText: "OK",
      });
      navigate(`/configuration/weekly-classes/trial/list`)
      return result;

    } catch (error) {
      console.error("Error creating class schedule:", error);
      await Swal.fire({
        title: "Error",
        text: error.message || "Something went wrong while creating class schedule.",
        icon: "error",
        confirmButtonText: "OK",
      });
      throw error;
    } finally {
      await fetchBookFreeTrials();
      setLoading(false);
    }
  };
  const rebookFreeTrialsubmit = async (bookingIds) => {
    setLoading(true);

    const headers = {
      "Content-Type": "application/json",
    };
    console.log('bookingIds', bookingIds)
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/reebooking`, {
        method: "POST",
        headers,
        body: JSON.stringify(bookingIds, // make sure bookingIds is an array like [96, 97]
        ),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to create Membership");
      }

      await Swal.fire({
        title: "Success!",
        text: result.message || "Trialsssssss has been created successfully.",
        icon: "success",
        confirmButtonText: "OK",
      }); navigate(`/configuration/weekly-classes/trial/list`)

      return result;

    } catch (error) {
      console.error("Error creating class schedule:", error);
      await Swal.fire({
        title: "Error",
        text: error.message || "Something went wrong while creating class schedule.",
        icon: "error",
        confirmButtonText: "OK",
      });
      throw error;
    } finally {
      await fetchBookFreeTrials();
      setLoading(false);
    }
  };
  const sendCancelFreeTrialmail = async (bookingIds) => {
    setLoading(true);

    const headers = {
      "Content-Type": "application/json",
    };
    console.log('bookingIds', bookingIds)
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/book/free-trials/send-email`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          bookingIds: bookingIds, // make sure bookingIds is an array like [96, 97]
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to create Membership");
      }

      await Swal.fire({
        title: "Success!",
        text: result.message || "Trialsssssss has been created successfully.",
        icon: "success",
        confirmButtonText: "OK",
      });
      navigate(`/configuration/weekly-classes/trial/list`)
      return result;

    } catch (error) {
      console.error("Error creating class schedule:", error);
      await Swal.fire({
        title: "Error",
        text: error.message || "Something went wrong while creating class schedule.",
        icon: "error",
        confirmButtonText: "OK",
      });
      throw error;
    } finally {
      await fetchBookFreeTrials();
      setLoading(false);
    }
  };

  // Book a Membership
  const fetchBookMemberships = useCallback(
    async (
      studentName = "",
      venueName = "",
      status1 = false,
      status2 = false,
      dateRangeMembership = [],   // 👉 will always be [fromDate, toDate] for trialDate
      month1 = false,
      month2 = false,
      month3 = false,
      otherDateRange = [],        // 👉 will always be [fromDate, toDate] for general
      BookedBy = []
    ) => {
      const token = localStorage.getItem("adminToken");
      if (!token) return;

      const shouldShowLoader =
        studentName ||
        venueName ||
        status1 ||
        status2 ||
        dateRangeMembership.length ||
        otherDateRange.length;

      // if (shouldShowLoader) setLoading(true);

      try {
        const queryParams = new URLSearchParams();

        if (studentName) queryParams.append("studentName", studentName);
        if (venueName) queryParams.append("venueName", venueName);

        if (status1) queryParams.append("status", "pending");
        if (status2) queryParams.append("status", "active");

        if (month1) queryParams.append("duration", "6");
        if (month2) queryParams.append("duration", "3");
        if (month3) queryParams.append("duration", "1");

        if (Array.isArray(BookedBy) && BookedBy.length > 0) {
          BookedBy.forEach(agent => queryParams.append("bookedBy", agent));
        }

        // 🔹 Handle trialDate (dateBooked range)
        if (Array.isArray(dateRangeMembership) && dateRangeMembership.length === 2) {
          const [from, to] = dateRangeMembership;
          if (from && to) {
            queryParams.append("dateFrom", formatLocalDate(from));
            queryParams.append("dateTo", formatLocalDate(to));
          }
        }

        // 🔹 Handle general (createdAt range)
        if (Array.isArray(otherDateRange) && otherDateRange.length === 2) {
          const [from, to] = otherDateRange;
          if (from && to) {
            queryParams.append("fromDate", formatLocalDate(from));
            queryParams.append("toDate", formatLocalDate(to));
          }
        }

        const url = `${API_BASE_URL}/api/admin/book-membership${queryParams.toString() ? `?${queryParams.toString()}` : ""
          }`;

        const response = await fetch(url, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        const resultRaw = await response.json();
        const result = resultRaw.data.membership || [];
        const venues = resultRaw.data.venue || [];
        const bookedByAdmin = resultRaw.data.bookedByAdmins || [];
        const MyStats = resultRaw.stats || [];

        setBookedByAdmin(bookedByAdmin);
        setStatsMembership(MyStats);
        setMyVenues(venues);
        setBookMembership(result);
      } catch (error) {
        console.error("Failed to fetch bookMemberships:", error);
      } finally {
        // if (shouldShowLoader) setLoading(false);
      }
    },
    [API_BASE_URL]
  );
  const serviceHistoryMembership = useCallback(async (ID) => {
    const token = localStorage.getItem("adminToken");
    if (!token) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/book-membership/account-information/${ID}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const resultRaw = await response.json();
      const result = resultRaw.data || [];
      setServiceHistory(result);
    } catch (error) {
      console.error("Failed to fetch bookFreeTrials:", error);
    } finally {
      setLoading(false);
    }
  }, []);
  const createBookMembership = async (bookFreeMembershipData) => {
    setLoading(true);

    const headers = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/book-membership`, {
        method: "POST",
        headers,
        body: JSON.stringify(bookFreeMembershipData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to create Membership");
      }

      await Swal.fire({
        title: "Success!",
        text: result.message || "Membership has been created successfully.",
        icon: "success",
        confirmButtonText: "OK",
      });
      navigate(`/configuration/weekly-classes/all-members/list`)
      return result;

    } catch (error) {
      console.error("Error creating class schedule:", error);
      await Swal.fire({
        title: "Error",
        text: error.message || "Something went wrong while creating class schedule.",
        icon: "error",
        confirmButtonText: "OK",
      });
      throw error;
    } finally {
      await fetchBookMemberships();
      setLoading(false);
    }
  };
  const sendBookMembershipMail = async (bookingIds) => {
    setLoading(true);

    const headers = {
      "Content-Type": "application/json",
    };
    console.log('bookingIds', bookingIds)
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/book-membership/send-email`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          bookingIds: bookingIds, // make sure bookingIds is an array like [96, 97]
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to create Membership");
      }

      await Swal.fire({
        title: "Success!",
        text: result.message || "Trialsssssss has been created successfully.",
        icon: "success",
        confirmButtonText: "OK",
      });

      return result;

    } catch (error) {
      console.error("Error creating class schedule:", error);
      await Swal.fire({
        title: "Error",
        text: error.message || "Something went wrong while creating class schedule.",
        icon: "error",
        confirmButtonText: "OK",
      });
      throw error;
    } finally {
      navigate(`/configuration/weekly-classes/all-members/list`);

      await fetchBookMemberships();
      setLoading(false);
    }
  };
  const cancelMembershipSubmit = async (bookingIds, comesfrom) => {
    setLoading(true);

    const headers = {
      "Content-Type": "application/json",
    };
    console.log('bookingIds', bookingIds)
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/cancel-membership/`, {
        method: "POST",
        headers,
        body: JSON.stringify(bookingIds, // make sure bookingIds is an array like [96, 97]
        ),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to create Membership");
      }

      await Swal.fire({
        title: "Success!",
        text: result.message || "Trialsssssss has been created successfully.",
        icon: "success",
        confirmButtonText: "OK",
      });
      if (comesfrom === "allMembers") {
        navigate(`/configuration/weekly-classes/all-members/list`);
      } else {
        navigate(`/configuration/weekly-classes/all-members/membership-sales`);
      }

      return result;

    } catch (error) {
      console.error("Error creating class schedule:", error);
      await Swal.fire({
        title: "Error",
        text: error.message || "Something went wrong while creating class schedule.",
        icon: "error",
        confirmButtonText: "OK",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };
  const transferMembershipSubmit = async (bookingIds, comesfrom) => {
    setLoading(true);

    const headers = {
      "Content-Type": "application/json",
    };
    console.log('bookingIds', bookingIds)
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/book-membership/transfer-class`, {
        method: "POST",
        headers,
        body: JSON.stringify(bookingIds, // make sure bookingIds is an array like [96, 97]
        ),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to create Membership");
      }

      await Swal.fire({
        title: "Success!",
        text: result.message || "Trialsssssss has been created successfully.",
        icon: "success",
        confirmButtonText: "OK",
      });
      if (comesfrom === "allMembers") {
        navigate(`/configuration/weekly-classes/all-members/list`);
      } else {
        navigate(`/configuration/weekly-classes/all-members/membership-sales`);
      }

      return result;

    } catch (error) {
      console.error("Error creating class schedule:", error);
      await Swal.fire({
        title: "Error",
        text: error.message || "Something went wrong while creating class schedule.",
        icon: "error",
        confirmButtonText: "OK",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };
  const freezerMembershipSubmit = async (bookingIds, comesfrom) => {
    setLoading(true);

    const headers = {
      "Content-Type": "application/json",
    };
    console.log('bookingIds', bookingIds)
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/book-membership/freeze`, {
        method: "POST",
        headers,
        body: JSON.stringify(bookingIds, // make sure bookingIds is an array like [96, 97]
        ),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to create Membership");
      }

      await Swal.fire({
        title: "Success!",
        text: result.message || "Trialsssssss has been created successfully.",
        icon: "success",
        confirmButtonText: "OK",
      });
      if (comesfrom === "allMembers") {
        navigate(`/configuration/weekly-classes/all-members/list`);
      } else {
        navigate(`/configuration/weekly-classes/all-members/membership-sales`);
      }

      return result;

    } catch (error) {
      console.error("Error creating class schedule:", error);
      await Swal.fire({
        title: "Error",
        text: error.message || "Something went wrong while creating class schedule.",
        icon: "error",
        confirmButtonText: "OK",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };
  const reactivateDataSubmit = async (bookingIds, comesfrom) => {
    setLoading(true);

    const headers = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    try {
      if (!bookingIds || Object.keys(bookingIds).length === 0) {
        throw new Error("No booking IDs provided");
      }

      const response = await fetch(`${API_BASE_URL}/api/admin/book-membership/reactivate`, {
        method: "POST",
        headers,
        body: JSON.stringify(bookingIds), // sending as object
      });

      let result;

      try {
        result = await response.json(); // try parsing JSON
      } catch {
        throw new Error("Server did not return valid JSON"); // avoid white page
      }

      if (!response.ok) {
        throw new Error(result?.message || "Failed to reactivate membership");
      }

      await Swal.fire({
        title: "Success!",
        text: result.message || "Membership has been reactivated successfully.",
        icon: "success",
        confirmButtonText: "OK",
      });

      if (comesfrom === "allMembers") {
        navigate(`/configuration/weekly-classes/all-members/list`);
      } else {
        navigate(`/configuration/weekly-classes/all-members/membership-sales`);
      }

      return result;

    } catch (error) {
      console.error("Error reactivating membership:", error);
      await Swal.fire({
        title: "Error",
        text: error.message || "Something went wrong while reactivating membership.",
        icon: "error",
        confirmButtonText: "OK",
      });
      throw error;

    } finally {
      setLoading(false);
    }
  };
  const fetchMembershipSales = useCallback(
    async (
      studentName = "",
      venueName = "",
      status1 = false,
      status2 = false,
      dateRangeMembership = [],   // 👉 will always be [fromDate, toDate] for trialDate
      month1 = false,
      month2 = false,
      month3 = false,
      otherDateRange = [],        // 👉 will always be [fromDate, toDate] for general
      BookedBy = []
    ) => {
      const token = localStorage.getItem("adminToken");
      if (!token) return;

      const shouldShowLoader =
        studentName ||
        venueName ||
        status1 ||
        status2 ||
        dateRangeMembership.length ||
        otherDateRange.length;

      // if (shouldShowLoader) setLoading(true);

      try {
        const queryParams = new URLSearchParams();

        if (studentName) queryParams.append("studentName", studentName);
        if (venueName) queryParams.append("venueName", venueName);

        if (status1) queryParams.append("status", "pending");
        if (status2) queryParams.append("status", "active");

        if (month1) queryParams.append("duration", "6");
        if (month2) queryParams.append("duration", "3");
        if (month3) queryParams.append("duration", "1");

        if (Array.isArray(BookedBy) && BookedBy.length > 0) {
          BookedBy.forEach(agent => queryParams.append("bookedBy", agent));
        }

        // 🔹 Handle trialDate (dateBooked range)
        if (Array.isArray(dateRangeMembership) && dateRangeMembership.length === 2) {
          const [from, to] = dateRangeMembership;
          if (from && to) {
            queryParams.append("dateFrom", formatLocalDate(from));
            queryParams.append("dateTo", formatLocalDate(to));
          }
        }

        // 🔹 Handle general (createdAt range)
        if (Array.isArray(otherDateRange) && otherDateRange.length === 2) {
          const [from, to] = otherDateRange;
          if (from && to) {
            queryParams.append("fromDate", formatLocalDate(from));
            queryParams.append("toDate", formatLocalDate(to));
          }
        }

        const url = `${API_BASE_URL}/api/admin/book-membership/active${queryParams.toString() ? `?${queryParams.toString()}` : ""
          }`;

        const response = await fetch(url, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        const resultRaw = await response.json();
        const result = resultRaw.data.memberShipSales || [];
        const venues = resultRaw.data.venue || [];
        const bookedByAdmin = resultRaw.data.bookedByAdmins || [];
        const MyStats = resultRaw.stats || [];

        setBookedByAdmin(bookedByAdmin);
        setStatsMembership(MyStats);
        setMyVenues(venues);
        setBookMembership(result);
      } catch (error) {
        console.error("Failed to fetch bookMemberships:", error);
      } finally {
        // if (shouldShowLoader) setLoading(false);
      }
    },
    [API_BASE_URL]
  );
  const sendActiveBookMembershipMail = async (bookingIds) => {
    setLoading(true);

    const headers = {
      "Content-Type": "application/json",
    };
    console.log('bookingIds', bookingIds)
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/book-membership/send-email/active-selected`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          bookingIds: bookingIds, // make sure bookingIds is an array like [96, 97]
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to create Membership");
      }

      await Swal.fire({
        title: "Success!",
        text: result.message || "Trialsssssss has been created successfully.",
        icon: "success",
        confirmButtonText: "OK",
      });

      return result;

    } catch (error) {
      console.error("Error creating class schedule:", error);
      await Swal.fire({
        title: "Error",
        text: error.message || "Something went wrong while creating class schedule.",
        icon: "error",
        confirmButtonText: "OK",
      });
      throw error;
    } finally {
      await fetchMembershipSales();
      setLoading(false);
    }
  };



  // Add to Waiting List 
  const addtoWaitingListSubmit = async (bookingIds, comesfrom) => {
    setLoading(true);

    const headers = {
      "Content-Type": "application/json",
    };
    console.log('bookingIds', bookingIds)
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/book-membership/waiting-list`, {
        method: "POST",
        headers,
        body: JSON.stringify(bookingIds, // make sure bookingIds is an array like [96, 97]
        ),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to create Membership");
      }

      await Swal.fire({
        title: "Success!",
        text: result.message || "Trialsssssss has been created successfully.",
        icon: "success",
        confirmButtonText: "OK",
      });
      if (comesfrom === "allMembers") {
        navigate(`/configuration/weekly-classes/all-members/list`);
      } else {
        navigate(`/configuration/weekly-classes/all-members/membership-sales`);
      }

      return result;

    } catch (error) {
      console.error("Error creating class schedule:", error);
      await Swal.fire({
        title: "Error",
        text: error.message || "Something went wrong while creating class schedule.",
        icon: "error",
        confirmButtonText: "OK",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };
   const fetchAddtoWaitingList = useCallback(
    async (
      studentName = "",
      venueName = "",
      status1 = false,
      status2 = false,
      forHigh = false,
      otherDateRange = [],
      dateoftrial = [],
      forOtherDate = [],
      BookedBy = []

    ) => {
      const token = localStorage.getItem("adminToken");
      if (!token) return;
      console.log('status1', status1)
      console.log('satus2', status2)
      console.log('otherDateRange', otherDateRange)
      console.log('dateoftrial', dateoftrial)
      console.log('forOtherDate', forOtherDate)

      const shouldShowLoader = studentName || venueName || status1 || status2 || otherDateRange || dateoftrial || forOtherDate;
      // if (shouldShowLoader) setLoading(true);

      try {
        const queryParams = new URLSearchParams();

        // Student & Venue filters
        if (studentName) queryParams.append("studentName", studentName);
        if (venueName) queryParams.append("venueName", venueName);

        // Status filters
        if (status1) queryParams.append("interest", "low");
        if (status2) queryParams.append("interest", "Medium");
        if (forHigh) queryParams.append("interest", "High");
        if (BookedBy && Array.isArray(BookedBy) && BookedBy.length > 0) {
          BookedBy.forEach(agent => queryParams.append("bookedBy", agent));
        }


        if (Array.isArray(dateoftrial) && dateoftrial.length === 2) {
          const [from, to] = dateoftrial;
          if (from && to) {
            queryParams.append("dateTrialFrom", formatLocalDate(from));
            queryParams.append("dateTrialTo", formatLocalDate(to));
          }
        }

        // 🔹 Handle general (createdAt range)
        if (Array.isArray(otherDateRange) && otherDateRange.length === 2) {
          const [from, to] = otherDateRange;
          if (from && to) {
            queryParams.append("fromDate", formatLocalDate(from));
            queryParams.append("toDate", formatLocalDate(to));
          }
        }

        if (Array.isArray(forOtherDate) && forOtherDate.length === 2) {
          const [from, to] = forOtherDate;
          if (from && to) {
            queryParams.append("fromDate", formatLocalDate(from));
            queryParams.append("toDate", formatLocalDate(to));
          }
        }

        const url = `${API_BASE_URL}/api/admin/waiting-list/${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
        const response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const resultRaw = await response.json();
        const result = resultRaw.data.waitingList || [];
        const venues = resultRaw.data.venue || [];
        const bookedByAdmin = resultRaw.data.bookedByAdmins || []
        setBookedByAdmin(bookedByAdmin);
        setMyVenues(venues);
        setStatsFreeTrial(resultRaw.data.stats)
        setBookFreeTrials(result);
      } catch (error) {
        console.error("Failed to fetch bookFreeTrials:", error);
      } finally {
        // if (shouldShowLoader) setLoading(false); // only stop loader if it was started
      }
    },
    []
  );
  const cancelWaitingListSpot = async (bookingIds, comesfrom) => {
    setLoading(true);

    const headers = {
      "Content-Type": "application/json",
    };
    console.log('bookingIds', bookingIds)
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/book-membership/cancel/waiting-list-spot`, {
        method: "PUT",
        headers,
        body: JSON.stringify(bookingIds, // make sure bookingIds is an array like [96, 97]
        ),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to Cancel Waiting List");
      }

      await Swal.fire({
        title: "Success!",
        text: result.message || "Trialsssssss has been created successfully.",
        icon: "success",
        confirmButtonText: "OK",
      });
      if (comesfrom === "allMembers") {
        navigate(`/configuration/weekly-classes/all-members/list`);
      } else {
        navigate(`/configuration/weekly-classes/all-members/membership-sales`);
      }

      return result;

    } catch (error) {
      console.error("Error creating class schedule:", error);
      await Swal.fire({
        title: "Error",
        text: error.message || "Something went wrong while creating class schedule.",
        icon: "error",
        confirmButtonText: "OK",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };
    const sendWaitingListMail = async (bookingIds) => {
    setLoading(true);

    const headers = {
      "Content-Type": "application/json",
    };
    console.log('bookingIds', bookingIds)
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/waiting-list/send-email`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          bookingIds: bookingIds, // make sure bookingIds is an array like [96, 97]
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to create Membership");
      }

      await Swal.fire({
        title: "Success!",
        text: result.message || "Trialsssssss has been created successfully.",
        icon: "success",
        confirmButtonText: "OK",
      });

      return result;

    } catch (error) {
      console.error("Error creating class schedule:", error);
      await Swal.fire({
        title: "Error",
        text: error.message || "Something went wrong while creating class schedule.",
        icon: "error",
        confirmButtonText: "OK",
      });
      throw error;
    } finally {
      await fetchAddtoWaitingList();
      setLoading(false);
    }
  };
    const serviceHistoryWaitingList = useCallback(async (ID) => {
    const token = localStorage.getItem("adminToken");
    if (!token) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/waiting-list/service-history/${ID}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const resultRaw = await response.json();
      const result = resultRaw.data || [];
      setServiceHistory(result);
    } catch (error) {
      console.error("Failed to fetch bookFreeTrials:", error);
    } finally {
      setLoading(false);
    }
  }, []);
  return (
    <BookFreeTrialContext.Provider
      value={{// Free Trials
        bookFreeTrials,
        createBookFreeTrials,
        updateBookFreeTrials,
        deleteBookFreeTrial,
        fetchBookFreeTrials,
        fetchBookFreeTrialsID,
        fetchBookFreeTrialsByID,
        singleBookFreeTrials,
        singleBookFreeTrialsOnly,
        rebookFreeTrialsubmit,
        cancelFreeTrial,
        sendFreeTrialmail,
        sendCancelFreeTrialmail,
        sendBookMembershipMail,

        // Membership
        bookMembership,
        createBookMembership,
        fetchBookMemberships,
        cancelMembershipSubmit,
        transferMembershipSubmit,
        freezerMembershipSubmit,
        reactivateDataSubmit,
        fetchMembershipSales,
        sendActiveBookMembershipMail,

        // Waiting List
        addtoWaitingListSubmit,
        fetchAddtoWaitingList,
        cancelWaitingListSpot,
        sendWaitingListMail,
        serviceHistoryWaitingList,

        // Service History
        serviceHistory,
        setServiceHistory,
        serviceHistoryFetchById,
        serviceHistoryMembership,

        // Stats
        statsFreeTrial,
        statsMembership,

        // Admin
        bookedByAdmin,

        // Venues
        selectedVenue,
        setSelectedVenue,
        myVenues,
        setMyVenues,

        // Status / Search
        status,
        setStatus,
        searchTerm,
        setSearchTerm,

        // Form
        formData,
        setFormData,
        isEditBookFreeTrial,
        setIsEditBookFreeTrial,

        // Misc
        loading,
        setBookFreeTrials,
        setBookMembership
      }}>
      {children}
    </BookFreeTrialContext.Provider>
  );
};

export const useBookFreeTrial = () => useContext(BookFreeTrialContext);
