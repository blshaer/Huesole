import { useState } from "react";

const STORAGE_KEY = "huesole.dislikes";
const LEGACY_KEY = "lumegradients.dislikes";

function readStored(key: string): string[] {
  try {
    const stored = localStorage.getItem(key);
    const parsed = stored ? JSON.parse(stored) : [];
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === "string") : [];
  } catch {
    return [];
  }
}

function loadDislikes(): string[] {
  const current = readStored(STORAGE_KEY);
  if (current.length > 0) return current;

  const legacy = readStored(LEGACY_KEY);
  if (legacy.length > 0) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(legacy));
  }
  return legacy;
}

export function useDislikes() {
  const [dislikes, setDislikes] = useState<string[]>(loadDislikes);

  const toggleDislike = (name: string) => {
    setDislikes((previous) => {
      const next = previous.includes(name)
        ? previous.filter((item) => item !== name)
        : [...previous, name];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  return { dislikes, toggleDislike };
}
