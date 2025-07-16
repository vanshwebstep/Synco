import { createContext, useContext, useState, useCallback } from "react";
import Swal from "sweetalert2"; // make sure it's installed
import { useNavigate } from 'react-router-dom';

const SessionPlanContext = createContext();

export const SessionPlanContextProvider = ({ children }) => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem("adminToken");

  const [discounts, setDiscounts] = useState([]);
  const [groups, setGroups] = useState([]);
  const [selectedDiscount, setSelectedDiscount] = useState(null);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
  const [exercises, setExercises] = useState([]);


  // Fetch all discounts
  const fetchDiscounts = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/discount`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      setDiscounts(result.data || []);
    } catch (err) {
      console.error("Failed to fetch discounts:", err);
    } finally {
      setLoading(false);
    }
  }, [token]);
const createSessionExercise = useCallback(async (data, file) => {
  if (!token) return;

  try {
    const formdata = new FormData();
    formdata.append("title", data.title);
    formdata.append("description", data.description);
    formdata.append("duration", data.duration);
    console.log('formdatahh',formdata)
    if (file) formdata.append("image", file);

    await fetch(`${API_BASE_URL}/api/admin/session-plan-exercise/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        // No "Content-Type", browser sets it automatically with boundary
      },
      body: formdata,
    });
console.log('doneeee')
    await fetchDiscounts(); // optional if refreshing UI
  } catch (err) {
    console.error("Failed to create exercise:", err);
  }
}, [token, fetchDiscounts]);


  const fetchExercises = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/session-plan-exercise`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      setExercises(result.data || []);
    } catch (err) {
      console.error("Failed to fetch packages:", err);
    } finally {
      setLoading(false);
    }
  }, [token]);
  const fetchExerciseById = useCallback(async (id) => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/apiadmin/session-plan-exercise/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();
      setSelectedExercise(result.data || null);
    } catch (err) {
      console.error("Failed to fetch group:", err);
    } finally {
      setLoading(false);
    }
  }, [token]);
  // Fetch single discount
  const fetchDiscountById = useCallback(async (id) => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/payment-plan/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      setSelectedDiscount(result.data || null);
    } catch (err) {
      console.error("Failed to fetch discount:", err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Create discount
const createDiscount = useCallback(async (data) => {
  if (!token) return;

  setLoading(true); // Start loading

  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/discount`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok || !result.status) {
      throw new Error(result.message || "Something went wrong");
    }

    await fetchDiscounts();

    await Swal.fire({
      icon: 'success',
      title: 'Success',
      text: result.message || 'Discount created successfully.',
      confirmButtonColor: '#237FEA'
    });

    navigate('/holiday-camps/discounts/list');
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Failed to Create Discount',
      text: err.message || 'An unexpected error occurred.',
      confirmButtonColor: '#d33'
    });

    console.error("Failed to create discount:", err);
  } finally {
    setLoading(false); // Stop loading regardless of success or error
  }
}, [token, fetchDiscounts, navigate]);


  // Update discount
  const updateDiscount = useCallback(async (id, data) => {
    if (!token) return;
    try {
      await fetch(`${API_BASE_URL}/api/admin/payment-plan/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      await fetchDiscounts();
    } catch (err) {
      console.error("Failed to update discount:", err);
    }
  }, [token, fetchDiscounts]);

  // Delete discount
  const deleteDiscount = useCallback(async (id) => {
    if (!token) return;
    try {
      await fetch(`${API_BASE_URL}/api/admin/payment-plan/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchDiscounts();
    } catch (err) {
      console.error("Failed to delete discount:", err);
    }
  }, [token, fetchDiscounts]);

  

  return (
    <SessionPlanContext.Provider
      value={{
        // Discounts
        discounts,
        setDiscounts,
        loading,
        createSessionExercise,
        selectedDiscount,
        fetchDiscounts,
        fetchDiscountById,
        createDiscount,
        updateDiscount,
        deleteDiscount,

        selectedExercise,
        setSelectedExercise,
        exercises,
        setExercises,
        fetchExerciseById,
        fetchExercises,
      }}
    >
      {children}
    </SessionPlanContext.Provider>
  );
};

export const useSessionPlan = () => useContext(SessionPlanContext);
