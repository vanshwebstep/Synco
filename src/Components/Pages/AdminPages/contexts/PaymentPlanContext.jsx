import { createContext, useContext, useState, useCallback } from "react";

const PackageContext = createContext();

export const PaymentPlanContextProvider = ({ children }) => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem("adminToken");

  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);

  // Fetch all packages
  const fetchPackages = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/payment-plan`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await response.json();
      setPackages(result.data || []);
    } catch (error) {
      console.error("Failed to fetch packages:", error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Fetch single package by ID
  const fetchPackageById = useCallback(async (id) => {
    if (!token) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/payment-plan/${id}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await response.json();
      setSelectedPackage(result.data || null);
    } catch (error) {
      console.error("Failed to fetch package:", error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Create new package
  const createPackage = useCallback(
    async (data) => {
      if (!token) return;

      try {
        await fetch(`${API_BASE_URL}/api/admin/payment-plan`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        });

        await fetchPackages();
      } catch (error) {
        console.error("Failed to create package:", error);
      }
    },
    [token, fetchPackages]
  );

  // Update package by ID
  const updatePackage = useCallback(
    async (id, data) => {
      if (!token) return;

      try {
        await fetch(`${API_BASE_URL}/api/admin/payment-plan/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        });

        await fetchPackages();
      } catch (error) {
        console.error("Failed to update package:", error);
      }
    },
    [token, fetchPackages]
  );

  // Delete package by ID
  const deletePackage = useCallback(
    async (id) => {
      if (!token) return;

      try {
        await fetch(`${API_BASE_URL}/api/admin/payment-plan/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });

        await fetchPackages();
      } catch (error) {
        console.error("Failed to delete package:", error);
      }
    },
    [token, fetchPackages]
  );

  return (
    <PackageContext.Provider
      value={{
        packages,
        loading,
        selectedPackage,
        fetchPackages,
        fetchPackageById,
        createPackage,
        updatePackage,
        deletePackage,
      }}
    >
      {children}
    </PackageContext.Provider>
  );
};

export const usePackages = () => useContext(PackageContext);
