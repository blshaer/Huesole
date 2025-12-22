export const getFullImageUrl = (path?: string) => {
    if (!path) return "";
    if (path.startsWith("http") || path.startsWith("blob:") || path.startsWith("data:")) return path;

    const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
    // Remove leading slash if present to avoid double slashes
    const cleanPath = path.startsWith("/") ? path.slice(1) : path;
    return `${baseUrl}/${cleanPath}`;
};
