import React, { createContext, useContext, useState, useCallback } from "react";
import Swal from "sweetalert2";
import Facebook from "../one-to-one/leads/Facebook";

const LeadsContext = createContext();

export const LeadsContextProvider = ({ children }) => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const tabs = [
    { name: "Facebook", component: <Facebook /> },
    { name: "Referral", component: <Facebook /> },
    { name: "All other leads", component: <Facebook /> },
    { name: "All", component: <Facebook /> },
  ];

  const [activeTab, setActiveTab] = useState(tabs[0].name);
  const [data, setData] = useState([]);
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async (params = {}) => {
    const token = localStorage.getItem("adminToken");
    if (!token) return;

    setLoading(true);
    const { studentName, venueName, filterTypes = [], fromDate, toDate } = params;

    // build query params
    const searchParams = new URLSearchParams();

    if (studentName) searchParams.append("studentName", studentName);
    if (venueName) searchParams.append("venueName", venueName);

    // support multiple filterTypes
    filterTypes.forEach((ft) => searchParams.append("filterType", ft));

    if (fromDate) searchParams.append("fromDate", fromDate);
    if (toDate) searchParams.append("toDate", toDate);

    const query = searchParams.toString();

    // ✅ Simplified mapping for active tab endpoint
    const tabEndpoints = {
      Facebook: "facebook",
      Referral: "referall",
      "All other leads": "allOthers",
      All: "all",
    };

    const activeTabData = tabEndpoints[activeTab] || "all";

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/lead/${activeTabData}${query ? `?${query}` : ""}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const resultRaw = await response.json();

      if (!response.ok || !resultRaw.status) {
        Swal.fire({
          icon: "error",
          title: "Fetch Failed",
          text:
            resultRaw.message ||
            "Something went wrong while fetching lead data.",
          confirmButtonText: "OK",
        });
        return;
      }

      setData(resultRaw.data || []);
      setAnalytics(resultRaw.analytics || []);
    } catch (error) {
      console.error("Failed to fetch leads:", error);
      Swal.fire({
        icon: "error",
        title: "Fetch Failed",
        text: error.message || "Something went wrong while fetching data.",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL, activeTab]);

  return (
    <LeadsContext.Provider
      value={{
        data,
        analytics,
        activeTab,
        setActiveTab,
        setAnalytics,
        fetchData,
        setData,
        loading,
        setLoading,
        tabs,
      }}
    >
      {children}
    </LeadsContext.Provider>
  );
};

// ✅ Custom hook for usage
export const useLeads = () => useContext(LeadsContext);
