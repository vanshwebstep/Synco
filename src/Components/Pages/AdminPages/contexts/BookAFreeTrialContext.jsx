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
  const fetchBookFreeTrials = useCallback(
    async (
      studentName = "",
      venueName = "",
      status1 = false,
      status2 = false,
      dateofmembership = "",
      dateoftrial = "",
      forOtherDate = ""
    ) => {
      const token = localStorage.getItem("adminToken");
      if (!token) return;
      console.log('status1', status1)
      console.log('satus2', status2)
      console.log('dateofmembership', dateofmembership)
      console.log('dateoftrial', dateoftrial)
      console.log('forOtherDate', forOtherDate)

      const shouldShowLoader = studentName || venueName || status1 || status2 || dateofmembership || dateoftrial || forOtherDate;
      if (shouldShowLoader) setLoading(true);

      try {
        const queryParams = new URLSearchParams();

        // Student & Venue filters
        if (studentName) queryParams.append("studentName", studentName);
        if (venueName) queryParams.append("venueName", venueName);

        // Status filters
        if (status1) queryParams.append("status", "attend");
        if (status2) queryParams.append("status", "not attend");

        // CreatedAt dates (membership + other)
        const createdDates = [dateofmembership, forOtherDate]
          .filter(Boolean)
          .map(d => {
            const dt = new Date(d);
            return isNaN(dt.getTime()) ? null : dt.toISOString();
          })
          .filter(Boolean);

        createdDates.forEach(d => queryParams.append("createdAt", d));

        // Trial dates (support array or single value)
        const trialDates = Array.isArray(dateoftrial) ? dateoftrial : [dateoftrial];
        trialDates
          .filter(Boolean)
          .map(d => formatLocalDate(d))
          .filter(Boolean)
          .forEach(d => queryParams.append("trialDate", d));

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

        setMyVenues(venues);
        setBookFreeTrials(result);
      } catch (error) {
        console.error("Failed to fetch bookFreeTrials:", error);
      } finally {
        if (shouldShowLoader) setLoading(false); // only stop loader if it was started
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
        throw new Error(result.message || "Failed to create class schedule");
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

  // UPDATE VENUE
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
const fetchBookMemberships = useCallback(
  async (
    studentName = "",
    venueName = "",
    status1 = false,
    status2 = false,
    dateofmembership = [],
    dateoftrial = [],
    forOtherDate = []
  ) => {
    const token = localStorage.getItem("adminToken");
    if (!token) return;

    const shouldShowLoader =
      studentName ||
      venueName ||
      status1 ||
      status2 ||
      dateofmembership.length ||
      dateoftrial.length ||
      forOtherDate.length;
    if (shouldShowLoader) setLoading(true);

    try {
      const queryParams = new URLSearchParams();

      if (studentName) queryParams.append("studentName", studentName);
      if (venueName) queryParams.append("venueName", venueName);

      if (status1) queryParams.append("status", "pending");
      if (status2) queryParams.append("status", "active");

      [...dateofmembership, ...forOtherDate]
        .filter(Boolean)
        .map((d) => new Date(d))
        .filter((d) => !isNaN(d.getTime()))
        .forEach((d) => queryParams.append("createdAt", d.toISOString()));

      (Array.isArray(dateoftrial) ? dateoftrial : [dateoftrial])
        .filter(Boolean)
        .map((d) => formatLocalDate(d))
        .filter(Boolean)
        .forEach((d) => queryParams.append("trialDate", d));

      const url = `${API_BASE_URL}/api/admin/book-membership${
        queryParams.toString() ? `?${queryParams.toString()}` : ""
      }`;

      const response = await fetch(url, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const resultRaw = await response.json();
      const result = resultRaw.data.membership || [];
      const venues = resultRaw.data.venue || [];

      setMyVenues(venues);
      setBookMembership(result);
    } catch (error) {
      console.error("Failed to fetch bookMemberships:", error);
    } finally {
      if (shouldShowLoader) setLoading(false);
    }
  },
  []
);







  return (
    <BookFreeTrialContext.Provider
      value={{
        bookFreeTrials,
        createBookFreeTrials,
        updateBookFreeTrials,
        deleteBookFreeTrial,
        fetchBookFreeTrialsID,
        fetchBookFreeTrialsByID,
        singleBookFreeTrials,
        formData,
        singleBookFreeTrialsOnly,
        setFormData,
        isEditBookFreeTrial,
        setIsEditBookFreeTrial,
        setBookFreeTrials,
        fetchBookFreeTrials,
        loading,
        serviceHistoryFetchById,
        setServiceHistory,
        serviceHistory,
        setSearchTerm, createBookMembership, bookMembership, setBookMembership, fetchBookMemberships,
        searchTerm, setSelectedVenue, selectedVenue, setMyVenues, myVenues, setStatus, status
      }}>
      {children}
    </BookFreeTrialContext.Provider>
  );
};

export const useBookFreeTrial = () => useContext(BookFreeTrialContext);
