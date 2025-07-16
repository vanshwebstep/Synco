import { createContext, useContext, useState, useCallback } from "react";

const VenueContext = createContext();

export const VenueProvider = ({ children }) => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const [venues, setVenues] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isEditVenue, setIsEditVenue] = useState(null);
    const [formData, setFormData] = useState({
        area: "",
        name: "",
        address: "",
        facility: "",
        parking: false,
        congestion: false,
        parkingNote: "",
        entryNote: "",
        termDateLinkage: "",
        subscriptionLinkage: ""
    });

    const fetchVenues = useCallback(async () => {
        const token = localStorage.getItem("adminToken");
        if (!token) return;

        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/admin`, {
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

    return (
        <VenueContext.Provider value={{ venues, formData, setFormData, isEditVenue, setIsEditVenue, setVenues, fetchVenues, loading }}>
            {children}
        </VenueContext.Provider>
    );
};

export const useVenue = () => useContext(VenueContext);
