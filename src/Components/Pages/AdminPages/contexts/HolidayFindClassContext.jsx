import { createContext, useContext, useState, useCallback } from "react";
import Swal from "sweetalert2"; // make sure it's installed

const HolidayFindClassContext = createContext();

export const HolidayFindClassProvider = ({ children }) => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [findClasses, setFindClasses] = useState([]);
  const token = localStorage.getItem("adminToken");

  const [loading, setLoading] = useState(false);
  const [isEditFindClasses, setIsEditFindClasses] = useState(false);
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

  const fetchFindClasses = useCallback(async () => {
    const token = localStorage.getItem("adminToken");
    if (!token) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/holiday/find-class`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const resultRaw = await response.json();
      const result = resultRaw.data || [];
      setFindClasses(result);
    } catch (error) {
      console.error("Failed to fetch findClasses:", error);
    } finally {
      setLoading(false);
    }
  }, []);
  const createFindClasses = async (findClassesData) => {
    setLoading(true);

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    if (token) {
      myHeaders.append("Authorization", `Bearer ${token}`);
    }

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(findClassesData),
      redirect: "follow",
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/find-class/`, requestOptions);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create findClasses");
      }

      const result = await response.json();

      await Swal.fire({
        title: "Success!",
        text: result.message || "FindClasses has been created successfully.",
        icon: "success",
        confirmButtonText: "OK",
      });

      fetchFindClasses();
      return result;
    } catch (error) {
      console.error("Error creating findClasses:", error);
      await Swal.fire({
        title: "Error",
        text: error.message || "Something went wrong while creating findClasses.",
        icon: "error",
        confirmButtonText: "OK",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // UPDATE VENUE
  const updateFindClasses = async (findClassesId, updatedFindClassesData) => {
    setLoading(true);

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    if (token) {
      myHeaders.append("Authorization", `Bearer ${token}`);
    }

    const requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: JSON.stringify(updatedFindClassesData),
      redirect: "follow",
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/find-class/${findClassesId}`, requestOptions);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update findClasses");
      }

      const result = await response.json();

      await Swal.fire({
        title: "Success!",
        text: result.message || "FindClasses has been updated successfully.",
        icon: "success",
        confirmButtonText: "OK",
      });

      fetchFindClasses();
      return result;
    } catch (error) {
      console.error("Error updating findClasses:", error);
      await Swal.fire({
        title: "Error",
        text: error.message || "Something went wrong while updating findClasses.",
        icon: "error",
        confirmButtonText: "OK",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };
const deleteFindClasses = useCallback(async (id) => {
  if (!token) return;

  try {
    const res = await fetch(`${API_BASE_URL}/api/admin/find-class/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to delete findClasses");
    }

    await Swal.fire({
      icon: "success",
      title: data.message || "FindClasses deleted successfully",
      confirmButtonColor: "#3085d6",
    });

    await fetchFindClasses(); // Refresh the list
  } catch (err) {
    console.error("Failed to delete findClasses:", err);
    await Swal.fire({
      icon: "error",
      title: "Error",
      text: err.message || "Something went wrong",
      confirmButtonColor: "#d33",
    });
  }
}, [token, fetchFindClasses]);


  return (
    <HolidayFindClassContext.Provider
      value={{ findClasses, createFindClasses, updateFindClasses, deleteFindClasses, formData, setFormData, isEditFindClasses, setIsEditFindClasses, setFindClasses, fetchFindClasses, loading }}>
      {children}
    </HolidayFindClassContext.Provider>
  );
};

export const useHolidayFindClass = () => useContext(HolidayFindClassContext);
