import React, { createContext, useContext, useState, useCallback } from "react";
import Swal from "sweetalert2";

const AccountsInfoContext = createContext();

export const AccountsInfoProvider = ({ children }) => {
  const [data, setData] = useState([]);
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState([]);
  const [emergency, setEmergency] = useState([]);
  const [loading, setLoading] = useState(null);

  const [mainId, setMainId] = useState('');
  const token = localStorage.getItem("adminToken");
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const handleUpdate = async (title, mainData) => {

    if (!token) return Swal.fire("Error", "Token not found. Please login again.", "error");

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);
    let raw;
    if (title == "students") {
      raw = JSON.stringify({
        'students': mainData,
      });

    }
    if (title == "parents") {
      raw = JSON.stringify({

        'parents': mainData,
      });

    }
    if (title == "emergency") {
      raw = JSON.stringify({
        'emergency': mainData,
      });

    }


    const requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    try {
      // Show loading
      Swal.fire({
        title: "Updating...",
        text: "Please wait while we save changes.",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const response = await fetch(`${API_BASE_URL}/api/admin/account-information/${data.id}`, requestOptions);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Something went wrong");
      }

      const result = await response.json();

      // Close loading
      Swal.close();

      // Show success
      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "Student information has been successfully updated.",
        timer: 2000,
        showConfirmButton: false,
      });
      fetchMembers(mainId);
      console.log("Update Result:", result);
      return result;
    } catch (error) {
      Swal.close();
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Failed!",
        text: error.message || "Something went wrong while updating.",
      });
    }
  };

  const fetchMembers = useCallback(async (id) => {
    const token = localStorage.getItem("adminToken");
    if (!token) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/account-information/${id}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const resultRaw = await response.json();

      // Check API response status
      if (!resultRaw.status) {
        Swal.fire({
          icon: "error",
          title: "Fetch Failed",
          text: resultRaw.message || "Something went wrong while fetching account information.",
          confirmButtonText: "Ok",
        });
        return; // Stop further execution
      }

      const result = resultRaw.data || [];

      setData(result.accountInformation || []);
      setStudents(result.accountInformation.students || []);
      setFormData(result.accountInformation.parents || []);
      setEmergency(result.accountInformation.emergency[0] || []);
    } catch (error) {
      console.error("Failed to fetch members:", error);

      Swal.fire({
        icon: "error",
        title: "Fetch Failed",
        text: error.message || "Something went wrong while fetching account information.",
        confirmButtonText: "Ok",
      });
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL]);

  return (
    <AccountsInfoContext.Provider value={{ data, fetchMembers, setData, students, setStudents, loading, setLoading, formData, setFormData, emergency, setEmergency, handleUpdate, mainId, setMainId }}>
      {children}
    </AccountsInfoContext.Provider>
  );
};

// Custom hook for easy usage
export const useAccountsInfo = () => useContext(AccountsInfoContext);
