import { createContext, useContext, useState, useCallback } from "react";
import Swal from "sweetalert2"; // make sure it's installed

const ClassScheduleContext = createContext();

export const ClassScheduleProvider = ({ children }) => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [classSchedules, setClassSchedules] = useState([]);
  const token = localStorage.getItem("adminToken");

  const [loading, setLoading] = useState(false);
  const [isEditClassSchedule, setIsEditClassSchedule] = useState(false);
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

  const fetchClassSchedules = useCallback(async () => {
    const token = localStorage.getItem("adminToken");
    if (!token) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/class-schedule`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const resultRaw = await response.json();
      const result = resultRaw.data || [];
      setClassSchedules(result);
    } catch (error) {
      console.error("Failed to fetch classSchedules:", error);
    } finally {
      setLoading(false);
    }
  }, []);


  const createClassSchedules = async (classScheduleData) => {
    setLoading(true);

    const headers = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/class-schedule`, {
        method: "POST",
        headers,
        body: JSON.stringify(classScheduleData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to create class schedule");
      }

      await Swal.fire({
        title: "Success!",
        text: result.message || "Class schedule has been created successfully.",
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
     await fetchClassSchedules();
      setLoading(false);
    }
  };

  // UPDATE VENUE
  const updateClassSchedules = async (classScheduleId, updatedClassScheduleData) => {
    setLoading(true);

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    if (token) {
      myHeaders.append("Authorization", `Bearer ${token}`);
    }

    const requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: JSON.stringify(updatedClassScheduleData),
      redirect: "follow",
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/class-schedule/${classScheduleId}`, requestOptions);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update classSchedule");
      }

      const result = await response.json();

      await Swal.fire({
        title: "Success!",
        text: result.message || "ClassSchedule has been updated successfully.",
        icon: "success",
        confirmButtonText: "OK",
      });

      return result;
    } catch (error) {
      console.error("Error updating classSchedule:", error);
      await Swal.fire({
        title: "Error",
        text: error.message || "Something went wrong while updating classSchedule.",
        icon: "error",
        confirmButtonText: "OK",
      });
      throw error;
    } finally {
      await fetchClassSchedules();
      setLoading(false);
    }
  };
  const deleteClassSchedule = useCallback(async (id) => {
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
        throw new Error(data.message || "Failed to delete classSchedule");
      }

      await Swal.fire({
        icon: "success",
        title: data.message || "ClassSchedule deleted successfully",
        confirmButtonColor: "#3085d6",
      });

      await fetchClassSchedules(); // Refresh the list
    } catch (err) {
      console.error("Failed to delete classSchedule:", err);
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message || "Something went wrong",
        confirmButtonColor: "#d33",
      });
    }
  }, [token, fetchClassSchedules]);


  return (
    <ClassScheduleContext.Provider
      value={{ classSchedules, createClassSchedules, updateClassSchedules, deleteClassSchedule, formData, setFormData, isEditClassSchedule, setIsEditClassSchedule, setClassSchedules, fetchClassSchedules, loading }}>
      {children}
    </ClassScheduleContext.Provider>
  );
};

export const useClassSchedule = () => useContext(ClassScheduleContext);
