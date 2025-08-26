// ✅ Permission check utility function
export function checkPermission(data) {
    const { module, action } = data;

    const hasPermissions = JSON.parse(localStorage.getItem("hasPermission") || "[]");

    if (!module || !action || !Array.isArray(hasPermissions)) {
        return false;
    }

    return hasPermissions.some(
        (perm) =>
            perm.module?.toLowerCase() === module.toLowerCase() &&
            perm.action?.toLowerCase() === action.toLowerCase()
    );
}
