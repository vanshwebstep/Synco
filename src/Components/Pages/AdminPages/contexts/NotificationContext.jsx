import { createContext, useContext, useState, useCallback } from "react";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const [notification, setNotification] = useState([]);
    const [loadingNotification, setLoadingNotification] = useState(null);

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
            const result = resultRaw.data || [];
            setNotification(result?.notifications);
        } catch (error) {
            console.error("Failed to fetch notification:", error);
        } finally {
            setLoadingNotification(false);
        }
    }, []);

    return (
        <NotificationContext.Provider value={{
            notification, setNotification, fetchNotification,loadingNotification
        }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => useContext(NotificationContext);
