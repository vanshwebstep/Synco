import { createContext, useContext, useState, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import Swal from "sweetalert2"; // make sure it's installed

const BookFreeTrialContext = createContext();

export const BookFreeTrialProvider = ({ children }) => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [bookFreeTrials, setBookFreeTrials] = useState([]);
  const token = localStorage.getItem("adminToken");
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [isEditBookFreeTrial, setIsEditBookFreeTrial] = useState(false);
  const [singleBookFreeTrials, setSingleBookFreeTrials] = useState([]);
  const [singleBookFreeTrialsOnly, setSingleBookFreeTrialsOnly] = useState([]);

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

  const fetchBookFreeTrials = useCallback(async () => {
    const token = localStorage.getItem("adminToken");
    if (!token) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/book/free-trials`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const resultRaw = await response.json();
      const result = resultRaw.data || [];
      setBookFreeTrials(result);
    } catch (error) {
      console.error("Failed to fetch bookFreeTrials:", error);
    } finally {
      setLoading(false);
    }
  }, []);

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
      }}>
      {children}
    </BookFreeTrialContext.Provider>
  );
};

export const useBookFreeTrial = () => useContext(BookFreeTrialContext);
