import { createContext, useContext, useState, useCallback } from "react";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const [notification, setNotification] = useState([]);
    const [customNotification, setCustomNotification] = useState([]);
    const [customnotificationAll, setCustomnotificationAll] = useState([]);

    const [loadingNotification, setLoadingNotification] = useState(null);
    const [loadingCustomNotification, setLoadingCustomNotification] = useState(null);

    const fetchNotification = useCallback(async () => {
        const token = localStorage.getItem("adminToken");
        if (!token) return;

        setLoadingNotification(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/admin/notification`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const resultRaw = await response.json();
            const result = resultRaw.data.notifications || [];
            setNotification(result);
            setCustomnotificationAll( resultRaw.data.customNotifications)
        } catch (error) {
            console.error("Failed to fetch notification:", error);
        } finally {
            setLoadingNotification(false);
        }
    }, []);

    const fetchMarkAsRead = useCallback(async () => {
        const token = localStorage.getItem("adminToken");
        if (!token) return;

        try {
            const response = await fetch(`${API_BASE_URL}/api/admin/notification/read`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const resultRaw = await response.json();
        } catch (error) {
            console.error("Failed to fetch notification:", error);
        } finally {

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
        <NotificationContext.Provider value={{ fetchCustomNotification, fetchMarkAsRead, loadingCustomNotification, setLoadingCustomNotification, notification, setNotification, fetchNotification, loadingNotification,customnotificationAll ,customNotification, setCustomnotificationAll ,setCustomNotification }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => useContext(NotificationContext);
