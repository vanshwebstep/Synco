import React, { createContext, useContext, useCallback } from "react";

// Create Context
const PermissionContext = createContext();

// Provider Component
export const PermissionProvider = ({ children }) => {
  const checkPermission = useCallback(({ module, action }) => {
    const stored = JSON.parse(localStorage.getItem("hasPermission") || "[]");

    // console.log("[checkPermission] Called with:", { module, action });
    // console.log("[checkPermission] Current permissions:", stored);

    if (!module || !action || !Array.isArray(stored)) {
      // console.log("[checkPermission] ❌ Invalid input or permissions not array");
      return false;
    }

    const result = stored.some(
      (perm) =>
        perm.module?.toLowerCase() === module.toLowerCase() &&
        perm.action?.toLowerCase() === action.toLowerCase()
    );

    // console.log(
    //   `[checkPermission] Permission check for {module:"${module}", action:"${action}"} →`,
    //   result ? "✅ Allowed" : "❌ Denied"
    // );

    return result;
  }, []);

  return (
    <PermissionContext.Provider value={{ checkPermission }}>
      {children}
    </PermissionContext.Provider>
  );
};

// Custom hook
export const usePermission = () => {
  // console.log("[usePermission] Hook called → returning context value");
  return useContext(PermissionContext);
};
