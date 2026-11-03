import { useState } from "react";

const STORAGE_KEY = "huesole.favorites";
const LEGACY_KEY = "lumegradients.favorites";

function readStored(key: string): string[] {
  try {
    const stored = localStorage.getItem(key);
    const parsed = stored ? JSON.parse(stored) : [];
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === "string") : [];
  } catch {
    return [];
  }
}

function loadFavorites(): string[] {
  const current = readStored(STORAGE_KEY);
  if (current.length > 0) return current;

  const legacy = readStored(LEGACY_KEY);
  if (legacy.length > 0) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(legacy));
  }
  return legacy;
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>(loadFavorites);

  const toggleFavorite = (name: string) => {
    setFavorites((previous) => {
      const next = previous.includes(name)
        ? previous.filter((item) => item !== name)
        : [...previous, name];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  return { favorites, toggleFavorite };
}
