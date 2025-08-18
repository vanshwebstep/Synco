import { createContext, useContext, useState, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [notification, setNotification] = useState([]);
  const [customNotification, setCustomNotification] = useState([]);
  const [customnotificationAll, setCustomnotificationAll] = useState([]);
  const navigate = useNavigate();

  const [loadingNotification, setLoadingNotification] = useState(null);
  const [loadingCustomNotification, setLoadingCustomNotification] = useState(null);

  const fetchNotification = useCallback(async () => {
    const token = localStorage.getItem("adminToken");
    if (!token) return false;

    setLoadingNotification(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/notification`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const resultRaw = await response.json();

      // If account is suspended
      if (resultRaw.status === false && resultRaw.code === "ACCOUNT_SUSPENDED") {
        await Swal.fire({
          icon: 'error',
          title: 'Account Suspended',
          text: resultRaw.message || "Your account is suspended. Please contact support.",
          confirmButtonText: 'OK'
        });
        localStorage.clear();
        navigate('/admin-login');
        return false; // ⛔ stop further processing
      }

      // If successful
      const result = resultRaw.data?.notifications || [];
      setNotification(result);
      if(result?.role){
      localStorage.setItem('role', (result?.role));
      }
      setCustomnotificationAll(resultRaw.data?.customNotifications || []);
      return true;
    } catch (error) {
      console.error("Failed to fetch notification:", error);
      return false;
    } finally {
      setLoadingNotification(false);
    }
  }, [navigate]);


  const fetchMarkAsRead = useCallback(async (category) => {
    const token = localStorage.getItem("adminToken");
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/notification/read`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ category }),
      });

      const resultRaw = await response.json();
      console.log("Mark as read response:", resultRaw);
    } catch (error) {
      console.error("Failed to fetch notification:", error);
    }
  }, []);


  const fetchCustomNotification = useCallback(async () => {
    const token = localStorage.getItem("adminToken");
    if (!token) return;

    setLoadingCustomNotification(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/custom-notification`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const resultRaw = await response.json();
      const result = resultRaw.data || [];
      setCustomNotification(result);
    } catch (error) {
      console.error("Failed to fetch notification:", error);
    } finally {
      setLoadingCustomNotification(false);
    }
  }, []);

  return (
    <NotificationContext.Provider value={{ fetchCustomNotification, fetchMarkAsRead, loadingCustomNotification, setLoadingCustomNotification, notification, setNotification, fetchNotification, loadingNotification, customnotificationAll, customNotification, setCustomnotificationAll, setCustomNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
