import { createContext, useContext, useState, useCallback } from "react";
import Swal from "sweetalert2"; // make sure it's installed
import { useNavigate } from 'react-router-dom';

const SessionPlanContext = createContext();

export const SessionPlanContextProvider = ({ children }) => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem("adminToken");

  const [sessionGroup, setSessionGroup] = useState([]);
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [exercises, setExercises] = useState([]);


  // Fetch all sessionGroup
  const fetchSessionGroup = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/session-plan-group`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      console.log('result', result)
      setSessionGroup(result.data || []);
    } catch (err) {
      console.error("Failed to fetch sessionGroup:", err);
    } finally {
      setLoading(false);
    }
  }, [token]);
  const createSessionGroup = useCallback(
    async (formdata, shouldRedirect = false) => {
      if (!token) return;

      try {
        setLoading(true);

        const fd = new FormData();

        for (const key in formdata) {
          if (key === "levels") continue;
          if (formdata[key] instanceof File || typeof formdata[key] === "string") {
            fd.append(key, formdata[key]);
          }
        }

        fd.append("levels", JSON.stringify(formdata.levels));

        const response = await fetch(`${API_BASE_URL}/api/admin/session-plan-group/`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: fd,
        });

        const data = await response.json();

        if (response.ok && data.status) {
          await Swal.fire({
            icon: 'success',
            title: 'Success',
            text: data.message || 'Group created successfully.',
            confirmButtonColor: '#237FEA'
          });
          navigate('/configuration/weekly-classes/session-plan-list');
        } else {
          await Swal.fire({
            icon: 'error',
            title: 'Error',
            text: data.message || 'Failed to create session group.',
            confirmButtonColor: '#d33'
          });
          console.error("API Error:", data.message || "Unknown error");
        }
      } catch (err) {
        console.error("Failed to create session group:", err);
        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Something went wrong while creating the session group.',
          confirmButtonColor: '#d33'
        });
      } finally {
        setLoading(false);
      }
    },
    [token, navigate]
  );





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
const createSessionExercise = useCallback(async (data) => {
  if (!token) return;

  try {
    const formdata = new FormData();
    formdata.append("title", data.title);
    formdata.append("description", data.description);
    formdata.append("duration", data.duration);

    if (Array.isArray(data.images)) {
      data.images.forEach((file) => {
        formdata.append("images", file); // backend expects "images"
      });
    }

    const response = await fetch(`${API_BASE_URL}/api/admin/session-plan-exercise/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formdata,
    });

    // Check for HTTP errors
    const result = await response.json();

    if (!response.ok) {
      // Throw object for frontend to catch
      throw result;
    }

    console.log("✅ Exercise created");
    await fetchExercises();

    return result; // return response if needed
  } catch (err) {
    console.error("❌ Failed to create exercise:", err);
    throw err; // re-throw so caller can show dynamic alert
  }
}, [token, fetchExercises]);


  const fetchExerciseById = useCallback(async (id) => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/session-plan-exercise/${id}`, {
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


  const fetchGroupById = useCallback(async (id) => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/session-plan-group/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      setSelectedGroup(result.data || null);
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

      await fetchSessionGroup();

      await Swal.fire({
        icon: 'success',
        title: 'Success',
        text: result.message || 'Discount created successfully.',
        confirmButtonColor: '#237FEA'
      });

      navigate('/weekly-classes/sessionGroup/list');
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
  }, [token, fetchSessionGroup, navigate]);


  // Update discount
  const updateDiscount = useCallback(async (id, data) => {
    if (!token) return;

    setLoading(true); // 🔵 Start loading

    try {
      const formdata = new FormData();

      const appendMedia = (key, file) => {
        if (file && typeof file !== "string") {
          formdata.append(key, file, file.name || "[PROXY]");
        }
      };

      // Append media files
      appendMedia("beginner_video", data.beginner_video);
      appendMedia("beginner_banner", data.beginner_banner);
      appendMedia("intermediate_video", data.intermediate_video);
      appendMedia("intermediate_banner", data.intermediate_banner);
      appendMedia("advanced_video", data.advanced_video);
      appendMedia("advanced_banner", data.advanced_banner);
      appendMedia("pro_video", data.pro_video);
      appendMedia("pro_banner", data.pro_banner);

      if (data.levels) {
        formdata.append("levels", JSON.stringify(data.levels));
      }

      if (data.groupName) {
        formdata.append("groupName", data.groupName);
      }

      const response = await fetch(`${API_BASE_URL}/api/admin/session-plan-group/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formdata,
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.message || "Failed to update");

      await Swal.fire({
        icon: 'success',
        title: 'Success',
        text: result.message || 'Level updated successfully.',
        confirmButtonColor: '#237FEA'
      });

      navigate('/configuration/weekly-classes/session-plan-list');
      await fetchSessionGroup();

    } catch (err) {
      console.error("Failed to update discount:", err);
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.message || 'Something went wrong.',
      });
    } finally {
      setLoading(false); // 🔵 End loading
    }
  }, [token, fetchSessionGroup, navigate, setLoading]);


  // Delete discount
  const deleteSessionGroup = useCallback(async (id) => {
    if (!token) return;
    try {
      await fetch(`${API_BASE_URL}/api/admin/session-plan-group/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchSessionGroup();
    } catch (err) {
      console.error("Failed to delete discount:", err);
    }
  }, [token, fetchSessionGroup]);




  const deleteSessionlevel = useCallback(async (id, level) => {
    if (!token) return;
    try {
      await fetch(`${API_BASE_URL}/api/admin/session-plan-group/${id}/level/${level}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },

      });
      await fetchSessionGroup();
    } catch (err) {
      console.error("Failed to delete discount:", err);
    }
  }, [token, fetchSessionGroup]);


  return (
    <SessionPlanContext.Provider
      value={{
        // sessionGroup
        sessionGroup,
        setSessionGroup,
        loading,
        createSessionGroup,
        createSessionExercise,
        selectedGroup,
        fetchSessionGroup,
        fetchGroupById,
        createDiscount,
        updateDiscount,
        deleteSessionGroup,

        selectedExercise,
        setSelectedExercise,
        exercises,
        setExercises,
        fetchExerciseById,
        deleteSessionlevel,
        fetchExercises,
      }}
    >
      {children}
    </SessionPlanContext.Provider>
  );
};

export const useSessionPlan = () => useContext(SessionPlanContext);
