import { createContext, useContext, useState, useCallback } from "react";
import Swal from "sweetalert2"; // make sure it's installed

const VenueContext = createContext();

export const VenueProvider = ({ children }) => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [venues, setVenues] = useState([]);
  const token = localStorage.getItem("adminToken");

  const [loading, setLoading] = useState(false);
  const [isEditVenue, setIsEditVenue] = useState(false);
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

  const fetchVenues = useCallback(async () => {
    const token = localStorage.getItem("adminToken");
    if (!token) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/venue`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const resultRaw = await response.json();
      const result = resultRaw.data || [];
      setVenues(result);
    } catch (error) {
      console.error("Failed to fetch venues:", error);
    } finally {
      setLoading(false);
    }
  }, []);
const createVenues = async (venueData) => {
  setLoading(true);

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  if (token) {
    myHeaders.append("Authorization", `Bearer ${token}`);
  }

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify(venueData),
    redirect: "follow",
  };

  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/venue/`, requestOptions);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create venue");
    }

    const result = await response.json();

    await Swal.fire({
      title: "Success!",
      text: result.message || "Venue has been created successfully.",
      icon: "success",
      confirmButtonText: "OK",
    });

    fetchVenues();
    return result;
  } catch (error) {
    console.error("Error creating venue:", error);
    await Swal.fire({
      title: "Error",
      text: error.message || "Something went wrong while creating venue.",
      icon: "error",
      confirmButtonText: "OK",
    });
    throw error;
  } finally {
    setLoading(false);
  }
};

// UPDATE VENUE
const updateVenues = async (venueId, updatedVenueData) => {
  setLoading(true);

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  if (token) {
    myHeaders.append("Authorization", `Bearer ${token}`);
  }

  const requestOptions = {
    method: "PUT",
    headers: myHeaders,
    body: JSON.stringify(updatedVenueData),
    redirect: "follow",
  };

  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/venue/${venueId}`, requestOptions);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update venue");
    }

    const result = await response.json();

    await Swal.fire({
      title: "Success!",
      text: result.message || "Venue has been updated successfully.",
      icon: "success",
      confirmButtonText: "OK",
    });

    fetchVenues();
    return result;
  } catch (error) {
    console.error("Error updating venue:", error);
    await Swal.fire({
      title: "Error",
      text: error.message || "Something went wrong while updating venue.",
      icon: "error",
      confirmButtonText: "OK",
    });
    throw error;
  } finally {
    setLoading(false);
  }
};
  const deleteVenue = useCallback(async (id) => {
    if (!token) return;
    try {
      await fetch(`${API_BASE_URL}/api/admin/venue/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchVenues();
    } catch (err) {
      console.error("Failed to delete discount:", err);
    }
  }, [token, fetchVenues]);

  return (
    <VenueContext.Provider
      value={{ venues, createVenues, updateVenues,deleteVenue, formData, setFormData, isEditVenue, setIsEditVenue, setVenues, fetchVenues, loading }}>
      {children}
    </VenueContext.Provider>
  );
};

export const useVenue = () => useContext(VenueContext);
