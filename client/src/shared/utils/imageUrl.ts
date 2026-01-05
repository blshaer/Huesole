import { BASE_URL } from "../config";

export const getFullImageUrl = (path?: string) => {
  if (!path) return "";
  if (
    path.startsWith("http") ||
    path.startsWith("blob:") ||
    path.startsWith("data:")
  )
    return path;

  // Remove leading slash if present to avoid double slashes
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  return `${BASE_URL}/${cleanPath}`;
};
