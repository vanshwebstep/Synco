import { createContext, useContext, useState, useCallback } from "react";

const MemberContext = createContext();

export const MemberProvider = ({ children }) => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [roleOptions, setRoleOptions] = useState([]);
    const [showRoleModal, setShowRoleModal] = useState(false);
    const [roleName, setRoleName] = useState("");
    const [permissions, setPermissions] = useState([]);
    const [activeTab, setActiveTab] = useState("All");

    const token = localStorage.getItem("adminToken");

    const fetchRoles = useCallback(async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/admin/role`, {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
            });

            const result = await response.json();
            const formatted = result.data.map((item) => ({
                value: item.id,
                label: item.role,
            }));

            setRoleOptions(formatted);
        } catch (error) {
            console.error("Failed to fetch roles:", error);
        }
    }, [token]);

    const handleRoleCreate = useCallback(async (name, perms) => {
        try {
            await fetch(`${API_BASE_URL}/api/admin/role`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ role: name }),
            });

            await fetchRoles();
        } catch (error) {
            console.error("Create role error:", error);
        }
    }, [token, fetchRoles]);

    const fetchMembers = useCallback(async () => {
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
            setMembers(result);
        } catch (error) {
            console.error("Failed to fetch members:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    return (
        <MemberContext.Provider value={{ members,activeTab, setActiveTab, setMembers, fetchMembers, loading ,roleOptions,
        fetchRoles,
        showRoleModal,
        setShowRoleModal,
        roleName,
        setRoleName,
        permissions,
        setPermissions,
        handleRoleCreate, }}>
            {children}
        </MemberContext.Provider>
    );
};

export const useMembers = () => useContext(MemberContext);
