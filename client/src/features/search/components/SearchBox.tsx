import { cn } from "@/shared/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { Input } from "@/shared/ui/input";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { FC, useEffect, useMemo, useRef, useState } from "react";
import ErrorImage from "../../../../app/assets/error.png";

interface SearchBoxProps {
  value: string;
  onChange: (v: string) => void;
  isLoading: boolean;
  gradients?: Array<{
    name?: string;
    colors?: string[];
    colorsname?: string[];
    keywords?: (string | string[])[];
  }>;
  className?: string;
  gradientType: "background" | "text";
  onGradientTypeChange: (type: "background" | "text") => void;
  gradientShape: "linear" | "radial" | "conic" | "auto";
  onGradientShapeChange: (shape: "linear" | "radial" | "conic" | "auto") => void;
}

const TypeIcons = {
  background: (
    <svg viewBox="0 0 107.45 106.79" className="w-3 h-3 opacity-80 group-focus:opacity-100 transition-opacity">
      <path fill="#E0E0E0" d="M42.76,22.12c-1.07-1.07-1.16-.85-2.67-.85s-1.51,1-3.03,1-1.52-1-3.03-1-1.51,1-3.03,1-1.52-1-3.03-1c-1.52,0-1.52,1-3.03,1s-2.32-1.92-3.39-.85.86,1.86.86,3.36-1.01,1.51-1.01,3.01c0,1.51,1.01,1.51,1.01,3.01s-1.01,1.51-1.01,3.01c0,1.51,1.01,1.51,1.01,3.01s-1.01,1.51-1.01,3.02-.21,1.6.86,2.66,1.16.85,2.67.85,1.51-1,3.03-1,1.52,1,3.03,1,1.51-1,3.03-1,1.52,1,3.03,1,1.52-1,3.03-1,2.32,1.92,3.39.85c1.07-1.06-.86-1.86-.86-3.36,0-1.51,1.01-1.51,1.01-3.01s-1.01-1.51-1.01-3.01c0-1.51,1.01-1.51,1.01-3.01s-1.01-1.51-1.01-3.01.77-1.45,1-2.94c.22-1.41.22-1.67-.85-2.74Z" />
      <path fill="#E0E0E0" d="M43.47,63.59c1.07,1.07,1.16.85,2.67.85s1.51-1,3.03-1,1.52,1,3.03,1,1.51-1,3.03-1,1.52,1,3.03,1,1.52-1,3.03-1,2.32,1.92,3.39.85-.86-1.86-.86-3.36c0-1.51,1.01-1.51,1.01-3.01s-1.01-1.51-1.01-3.01c0-1.51,1.01-1.51,1.01-3.01s-1.01-1.51-1.01-3.01,1.01-1.51,1.01-3.02.21-1.6-.86-2.66c-1.07-1.07-1.16-.85-2.67-.85-1.51,0-1.51,1-3.03,1-1.52,0-1.52-1-3.03-1-1.51,0-1.51,1-3.03,1s-1.52-1-3.03-1c-1.52,0-1.52,1-3.03,1s-2.32-1.92-3.39-.85c-1.07,1.06.86,1.86.86,3.36s-1.01,1.51-1.01,3.01c0,1.51,1.01,1.51,1.01,3.01,0,1.51-1.01,1.51-1.01,3.01,0,1.51,1.01,1.51,1.01,3.01s-.77,1.45-1,2.94c-.22,1.41-.22,1.67.85,2.74Z" />
      <path fill="#E0E0E0" d="M22.25,64.3c-1.07,1.06-.86,1.15-.86,2.66,0,1.51,1.01,1.51,1.01,3.01,0,1.51-1.01,1.51-1.01,3.01,0,1.51,1.01,1.51,1.01,3.01s-1.01,1.51-1.01,3.01,1.01,1.51,1.01,3.02-1.93,2.3-.86,3.37,1.87-.85,3.39-.85,1.51,1,3.03,1,1.52-1,3.03-1,1.51,1,3.03,1,1.52-1,3.03-1,1.52,1,3.03,1,1.61.21,2.68-.85.86-1.15.86-2.66-1.01-1.51-1.01-3.01c0-1.51,1.01-1.51,1.01-3.01,0-1.51-1.01-1.51-1.01-3.01,0-1.51,1.01-1.51,1.01-3.01s-1.01-1.51-1.01-3.02c0-1.51,1.93-2.3.86-3.37s-1.87.85-3.39.85c-1.51,0-1.51-1-3.03-1-1.52,0-1.52,1-3.03,1-1.51,0-1.51-1-3.03-1s-1.52,1-3.03,1c-1.52,0-1.46-.76-2.96-.99-1.42-.22-1.68-.22-2.75.85Z" />
      <path fill="#E0E0E0" d="M64.69,84.68c1.07,1.07,1.16.85,2.67.85s1.51-1,3.03-1,1.52,1,3.03,1,1.51-1,3.03-1,1.52,1,3.03,1,1.52-1,3.03-1,2.32,1.92,3.39.85-.86-1.86-.86-3.36c0-1.51,1.01-1.51,1.01-3.01,0-1.51-1.01-1.51-1.01-3.01s1.01-1.51,1.01-3.01c0-1.51-1.01-1.51-1.01-3.01,0-1.51,1.01-1.51,1.01-3.02s.21-1.6-.86-2.66-1.16-.85-2.67-.85c-1.51,0-1.51,1-3.03,1s-1.52-1-3.03-1c-1.51,0-1.51,1-3.03,1s-1.52-1-3.03-1c-1.52,0-1.52,1-3.03,1-1.52,0-2.32-1.92-3.39-.85-1.07,1.06.86,1.86.86,3.36s-1.01,1.51-1.01,3.01c0,1.51,1.01,1.51,1.01,3.01s-1.01,1.51-1.01,3.01c0,1.51,1.01,1.51,1.01,3.01s-.77,1.45-1,2.94c-.22,1.41-.22,1.67.85,2.74Z" />
      <path fill="#E0E0E0" d="M64.69,22.12c-1.07,1.06-.86,1.15-.86,2.66,0,1.51,1.01,1.51,1.01,3.01s-1.01,1.51-1.01,3.01c0,1.51,1.01,1.51,1.01,3.01s-1.01,1.51-1.01,3.01,1.01,1.51,1.01,3.02-1.93,2.3-.86,3.37,1.87-.85,3.39-.85,1.51,1,3.03,1,1.52-1,3.03-1,1.51,1,3.03,1,1.52-1,3.03-1,1.52,1,3.03,1,1.61.21,2.68-.85.86-1.15.86-2.66c0-1.51-1.01-1.51-1.01-3.01,0-1.51,1.01-1.51,1.01-3.01,0-1.51-1.01-1.51-1.01-3.01,0-1.51,1.01-1.51,1.01-3.01s-1.01-1.51-1.01-3.02c0-1.51,1.93-2.3.86-3.37-1.07-1.07-1.87.85-3.39.85s-1.51-1-3.03-1c-1.52,0-1.52,1-3.03,1s-1.51-1-3.03-1-1.52,1-3.03,1-1.46-.76-2.96-.99c-1.42-.22-1.68-.22-2.75.85Z" />
      <path fill="#E0E0E0" d="M1.04,105.77c1.07,1.07,1.16.85,2.67.85s1.51-1,3.03-1,1.52,1,3.03,1,1.51-1,3.03-1,1.52,1,3.03,1,1.52-1,3.03-1,2.32,1.92,3.39.85c1.07-1.06-.86-1.86-.86-3.36,0-1.51,1.01-1.51,1.01-3.01,0-1.51-1.01-1.51-1.01-3.01,0-1.51,1.01-1.51,1.01-3.01s-1.01-1.51-1.01-3.01,1.01-1.51,1.01-3.02.21-1.6-.86-2.66-1.16-.85-2.67-.85-1.51,1-3.03,1c-1.52,0-1.52-1-3.03-1-1.51,0-1.51,1-3.03,1s-1.52-1-3.03-1c-1.52,0-1.52,1-3.03,1-1.52,0-2.32-1.92-3.39-.85s.86,1.86.86,3.36-1.01,1.51-1.01,3.01c0,1.51,1.01,1.51,1.01,3.01s-1.01,1.51-1.01,3.01c0,1.51,1.01,1.51,1.01,3.01s-.77,1.45-1,2.94c-.22,1.41-.22,1.67.85,2.74Z" />
      <path fill="#E0E0E0" d="M106.41,63.59c1.07-1.06.86-1.15.86-2.66,0-1.51-1.01-1.51-1.01-3.01,0-1.51,1.01-1.51,1.01-3.01,0-1.51-1.01-1.51-1.01-3.01,0-1.51,1.01-1.51,1.01-3.01s-1.01-1.51-1.01-3.02c0-1.51,1.93-2.3.86-3.37-1.07-1.07-1.87.85-3.39.85s-1.51-1-3.03-1-1.52,1-3.03,1-1.51-1-3.03-1-1.52,1-3.03,1c-1.52,0-1.52-1-3.03-1-1.52,0-1.61-.21-2.68.85-1.07,1.06-.86,1.15-.86,2.66,0,1.51,1.01,1.51,1.01,3.01,0,1.51-1.01-1.51-1.01,3.01s1.01,1.51,1.01,3.01c0,1.51-1.01,1.51-1.01,3.01,0,1.51,1.01,1.51,1.01,3.02s-1.93,2.3-.86,3.37,1.87-.85,3.39-.85,1.51,1,3.03,1,1.52-1,3.03-1,1.51,1,3.03,1,1.52-1,3.03-1,1.46.76,2.96.99c1.42.22,1.68.22,2.75-.85Z" />
      <path fill="#E0E0E0" d="M1.04,1.03C-.04,2.09.18,2.18.18,3.69s1.01,1.51,1.01,3.01S.18,8.2.18,9.71s1.01,1.51,1.01,3.01S.18,14.23.18,15.73s1.01,1.51,1.01,3.02-1.93,2.3-.86,3.37c1.07,1.07,1.87-.85,3.39-.85s1.51,1,3.03,1,1.52-1,3.03-1,1.51,1,3.03,1,1.52-1,3.03-1,1.52,1,3.03,1,1.61.21,2.68-.85c1.07-1.06.86-1.15.86-2.66s-1.01-1.51-1.01-3.01c0-1.51,1.01-1.51,1.01-3.01s-1.01-1.51-1.01-3.01c0-1.51,1.01-1.51,1.01-3.01s-1.01-1.51-1.01-3.02,1.93-2.3.86-3.37c-1.07-1.07-1.87.85-3.39.85s-1.51-1-3.03-1-1.52,1-3.03,1-1.51-1-3.03-1-1.52,1-3.03,1S5.29.41,3.79.18C2.37-.04,2.11-.04,1.04,1.03Z" />
      <path fill="#E0E0E0" d="M63.98,1.03c-1.07-1.07-1.16-.85-2.67-.85s-1.51,1-3.03,1-1.52-1-3.03-1-1.51,1-3.03,1-1.52-1-3.03-1-1.52,1-3.03,1-2.32-1.92-3.39-.85.86,1.86.86,3.36-1.01,1.51-1.01,3.01c0,1.51,1.01,1.51,1.01,3.01,0,1.51-1.01,1.51-1.01,3.01,0,1.51,1.01,1.51,1.01,3.01s-1.01,1.51-1.01,3.02c0,1.51-.21,1.6.86,2.66s1.16.85,2.67.85,1.51-1,3.03-1,1.52,1,3.03,1,1.51-1,3.03-1,1.52,1,3.03,1,1.52-1,3.03-1,2.32,1.92,3.39.85-.86-1.86-.86-3.36c0-1.51,1.01-1.51,1.01-3.01s-1.01-1.51-1.01-3.01c0-1.51,1.01-1.51,1.01-3.01s-1.01-1.51-1.01-3.01.77-1.45,1-2.94c.22-1.41.22-1.67-.85-2.74Z" />
      <path fill="#E0E0E0" d="M106.41,1.03c-1.07-1.07-1.16-.85-2.67-.85s-1.51,1-3.03,1-1.52-1-3.03-1-1.51,1-3.03,1-1.52-1-3.03-1-1.52,1-3.03,1-2.32-1.92-3.39-.85.86,1.86.86,3.36c0,1.51-1.01,1.51-1.01,3.01,0,1.51,1.01,1.51,1.01,3.01,0,1.51-1.01,1.51-1.01,3.01,0,1.51,1.01,1.51,1.01,3.01s-1.01,1.51-1.01,3.02c0,1.51-.21,1.6.86,2.66s1.16.85,2.67.85,1.51-1,3.03-1,1.52,1,3.03,1,1.51-1,3.03-1,1.52,1,3.03,1,1.52-1,3.03-1,2.32,1.92,3.39.85c1.07-1.06-.86-1.86-.86-3.36,0-1.51,1.01-1.51,1.01-3.01s-1.01-1.51-1.01-3.01c0-1.51,1.01-1.51,1.01-3.01s-1.01-1.51-1.01-3.01c0-1.51.77-1.45,1-2.94.22-1.41.22-1.67-.85-2.74Z" />
      <path fill="#E0E0E0" d="M1.04,43.21c-1.07,1.06-.86,1.15-.86,2.66s1.01,1.51,1.01,3.01-1.01,1.51-1.01,3.01,1.01,1.51,1.01,3.01-1.01,1.51-1.01,3.01,1.01,1.51,1.01,3.02-1.93,2.3-.86,3.37c1.07,1.07,1.87-.85,3.39-.85s1.51,1,3.03,1,1.52-1,3.03-1,1.51,1,3.03,1,1.52-1,3.03-1,1.52,1,3.03,1,1.61.21,2.68-.85.86-1.15.86-2.66-1.01-1.51-1.01-3.01c0-1.51,1.01-1.51,1.01-3.01s-1.01-1.51-1.01-3.01c0-1.51,1.01-1.51,1.01-3.01s-1.01-1.51-1.01-3.02,1.93-2.3.86-3.37c-1.07-1.07-1.87.85-3.39.85s-1.51-1-3.03-1-1.52,1-3.03,1-1.51-1-3.03-1-1.52,1-3.03,1c-1.52,0-1.46-.76-2.96-.99-1.42-.22-1.68-.22-2.75.85Z" />
      <path fill="#E0E0E0" d="M106.41,105.77c1.07-1.06.86-1.15.86-2.66,0-1.51-1.01-1.51-1.01-3.01,0-1.51,1.01-1.51,1.01-3.01,0-1.51-1.01-1.51-1.01-3.01,0-1.51,1.01-1.51,1.01-3.01s-1.01-1.51-1.01-3.02c0-1.51,1.93-2.3.86-3.37s-1.87.85-3.39.85c-1.51,0-1.51-1-3.03-1s-1.52,1-3.03,1c-1.51,0-1.51-1-3.03-1-1.52,0-1.52,1-3.03,1-1.52,0-1.52-1-3.03-1-1.52,0-1.61-.21-2.68.85s-.86,1.15-.86,2.66c0,1.51,1.01,1.51,1.01,3.01,0,1.51-1.01,1.51-1.01,3.01s1.01,1.51,1.01,3.01c0,1.51-1.01,1.51-1.01,3.01,0,1.51,1.01,1.51,1.01,3.02s-1.93,2.3-.86,3.37,1.87-.85,3.39-.85,1.51,1,3.03,1,1.52-1,3.03,1,1.51,1,3.03,1,1.52-1,3.03-1,1.46.76,2.96.99c1.42.22,1.68.22,2.75-.85Z" />
      <path fill="#E0E0E0" d="M43.47,105.77c1.07,1.07,1.16.85,2.67.85s1.51-1,3.03-1,1.52,1,3.03,1,1.51-1,3.03-1,1.52,1,3.03,1,1.52-1,3.03-1,2.32,1.92,3.39.85c1.07-1.06-.86-1.86-.86-3.36,0-1.51,1.01-1.51,1.01-3.01s-1.01-1.51-1.01-3.01c0-1.51,1.01-1.51,1.01-3.01s-1.01-1.51-1.01-3.01,1.01-1.51,1.01-3.02.21-1.6-.86-2.66c-1.07-1.07-1.16-.85-2.67-.85s-1.51,1-3.03,1c-1.52,0-1.52-1-3.03-1-1.51,0-1.51,1-3.03,1s-1.52-1-3.03-1c-1.52,0-1.52,1-3.03,1-1.52,0-2.32-1.92-3.39-.85s.86,1.86.86,3.36-1.01,1.51-1.01,3.01c0,1.51,1.01,1.51,1.01,3.01,0,1.51-1.01,1.51-1.01,3.01,0,1.51,1.01,1.51,1.01,3.01s-.77,1.45-1,2.94c-.22,1.41-.22,1.67.85,2.74Z" />
    </svg>
  ),
  text: (
    <svg viewBox="0 0 108.89 108.89" className="w-3 h-3 opacity-80 group-focus:opacity-100 transition-opacity">
      <polygon fill="#E0E0E0" points="37.55 108.89 52.56 108.89 52.56 90.12 90.12 90.12 90.12 75.09 52.56 75.09 52.56 56.33 37.55 56.33 37.55 108.89" />
      <polygon fill="#E0E0E0" points="108.89 71.34 108.89 56.33 90.12 56.33 90.12 18.78 75.09 18.78 75.09 56.33 56.33 56.33 56.33 71.34 108.89 71.34" />
      <polygon fill="#E0E0E0" points="71.34 0 56.33 0 56.33 18.78 18.78 18.78 18.78 33.79 56.33 33.79 56.33 52.56 71.34 52.56 71.34 0" />
      <polygon fill="#E0E0E0" points="0 37.55 0 52.56 18.78 52.56 18.78 90.12 33.79 90.12 33.79 52.56 52.56 52.56 52.56 37.55 0 37.55" />
    </svg>
  ),
};

const ShapeIcons = {
  auto: (
    <svg viewBox="0 0 108.89 94.31" className="w-3 h-3">
      <path fill="#E0E0E0" d="M45.38,62.87l-9.07,15.72-9.08,15.72h18.15l9.07-15.72,9.07-15.72,9.08-15.72h18.14l-9.07-15.72h-18.15l-9.07,15.72-9.07,15.72Z" />
      <path fill="#E0E0E0" d="M81.67,62.87l-9.07,15.72-9.08,15.72h18.15s9.07-15.72,9.07-15.72h18.15l-9.07-15.72h-18.15Z" />
      <path fill="#E0E0E0" d="M18.15,78.58l9.07-15.72,9.08-15.72,9.07-15.72,9.07-15.72h18.15L63.52,0h-18.14L0,78.58l9.08,15.72,9.07-15.72Z" />
    </svg>
  ),
  linear: (
    <svg viewBox="0 0 108.48 108.89" className="w-3 h-3">
      <path fill="#E0E0E0" d="M76.29,54.45c0,1.88,32.38,3.74,32.19,5.57-.19,1.83-.46,3.63-.83,5.41-.36,1.77-.81,3.51-1.34,5.22s-31.48,3.37-31.75,5c-.28,1.63,28.46,3.22,27.63,4.76-.84,1.54-1.75,3.04-2.73,4.49-.98,1.45-2.03,2.85-3.14,4.19-1.11,1.34-25.98,2.63-26.48,3.87-.5,1.23,20.44,2.4,19.09,3.51-1.35,1.11-2.75,2.16-4.2,3.13s-2.95,1.89-4.5,2.73-16.75,1.6-17.41,2.29,9.34,1.3,7.63,1.83c-1.71.53-3.45.98-5.22,1.34-1.77.36-3.58.64-5.41.83s-4.81.28-5.57.28-3.74-.1-5.57-.28-3.64-.46-5.41-.83c-1.77-.36-3.52-.81-5.22-1.34-1.71-.53,8.29-1.14,7.63-1.83s-15.86-1.45-17.41-2.29-3.04-1.75-4.5-2.73-2.85-2.02-4.2-3.13c-1.35-1.11,19.59-2.28,19.09-3.51-.5-1.23-25.37-2.52-26.48-3.87-1.11-1.34-2.16-2.74-3.14-4.19-.98-1.45-1.89-2.95-2.73-4.49-.84-1.54,27.9-3.13,27.63-4.76-.28-1.63-31.22-3.3-31.75-5s-.98-3.45-1.34-5.22c-.36-1.77-.64-3.58-.83-5.41-.19-1.83,32.19-3.69,32.19-5.57S-.19,50.71,0,48.88c.19-1.83.46-3.63.83-5.41.36-1.77.81-3.51,1.34-5.22.53-1.7,31.48-3.37,31.75-5s-28.46-3.22-27.63-4.76c.84-1.54,1.75-3.04,2.73-4.49.98-1.45,2.03-2.85,3.14-4.19s25.98-2.63,26.48-3.87c.5-1.23-20.44-2.4-19.09-3.51,1.35-1.11,2.75-2.16,4.2-3.13,1.45-.98,2.95-1.89,4.5-2.73,1.55-.84,16.75-1.6,17.41-2.29.66-.69-9.34-1.3-7.63-1.83,1.71-.53,3.45-.98,5.22-1.34s3.58-.64,5.41-.83,4.81-.28,5.57-.28,3.74.1,5.57.28,3.64.46,5.41.83,3.52.81,5.22,1.34c1.71.53-8.29,1.14-7.63,1.83.66.69,15.86,1.45,17.41,2.29,1.55.84,3.04,1.75,4.5,2.73,1.45.98,2.85,2.02,4.2,3.13,1.35,1.11-19.59,2.28-19.09,3.51.5,1.23,25.37,2.52,26.48,3.87s2.16,2.74,3.14,4.19c.98,1.45,1.89,2.95,2.73,4.49.84,1.54-27.9,3.13-27.63,4.76s31.22,3.3,31.75,5c.53,1.7.98,3.45,1.34,5.22.36,1.77.64,3.58.83,5.41.19,1.83-32.19,3.69-32.19,5.57Z" />
    </svg>
  ),
  radial: (
    <svg viewBox="0 0 107.01 108.89" className="w-3 h-3">
      <path fill="#E0E0E0" d="M46.95.45c74.64-8.48,82.19,105.67,8.69,108.4C-13.15,111.4-20.57,8.13,46.95.45ZM61.52,10.96c-3.77.59-9.75,3.49-12.79,5.86-7.35,5.73-26.08,24.66-32.02,32.04-22.9,28.41,13.85,65.99,43.41,41.77,6.75-5.53,31.36-30.07,34.46-36.9,10.37-22.85-8.36-46.62-33.06-42.77Z" />
    </svg>
  ),
  conic: (
    <svg viewBox="0 0 108.83 108.83" className="w-3 h-3">
      <path fill="#E0E0E0" d="M0,54.41h108.83v1.34c-.71,29.44-24.8,53.08-54.41,53.08S0,84.47,0,54.41Z" />
      <path fill="#E0E0E0" d="M19.47,19.45h69.9v.86c-.46,18.91-15.93,34.09-34.94,34.09S19.47,38.76,19.47,19.45Z" />
      <path fill="#E0E0E0" d="M34.97,0h38.9v.48c-.25,10.52-8.86,18.98-19.45,18.98S34.97,10.74,34.97,0Z" />
    </svg>
  ),
};

const filterButtonStyle = "flex items-center gap-1 sm:gap-1.5 max-[527px]:gap-0.5 px-1.5 sm:px-2.5 max-[527px]:px-1 py-1 sm:py-1.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-all rounded-md hover:bg-white/5 ";

const POPULAR_SUGGESTIONS = [
  { label: "sunset", emoji: "🌇" },
  { label: "ocean", emoji: "🌊" },
  { label: "purple", emoji: "🟣" },
  { label: "dark", emoji: "🌙" },
];

const RECOMMENDED_SUGGESTIONS = [
  { label: "cyberpunk", emoji: "👾" },
  { label: "nature", emoji: "🌿" },
  { label: "minimal", emoji: "⚪" },
  { label: "royal", emoji: "👑" },
  { label: "tropical", emoji: "🌴" },
  { label: "warm", emoji: "🔥" },
];

const SEARCH_PLACEHOLDERS = [
  "Search gradients...",
  "Try 'vibrant', 'nature', 'tropical'...",
  "Search by color: 'blue', 'purple'...",
  "Find by mood: 'warm', 'cool', 'dark'...",
  "Discover: 'sunset', 'ocean', 'pastel'...",
];

export const SearchBox: FC<SearchBoxProps> = ({
  value,
  onChange,
  isLoading,
  gradients = [],
  className,
  gradientType,
  onGradientTypeChange,
  gradientShape,
  onGradientShapeChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [currentPlaceholder, setCurrentPlaceholder] = useState(
    SEARCH_PLACEHOLDERS[0],
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Dynamic placeholder rotation
  useEffect(() => {
    if (!value) {
      const interval = setInterval(() => {
        setCurrentPlaceholder((prev) => {
          const currentIndex = SEARCH_PLACEHOLDERS.indexOf(prev);
          return SEARCH_PLACEHOLDERS[
            (currentIndex + 1) % SEARCH_PLACEHOLDERS.length
          ];
        });
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [value]);

  // Generate autocomplete suggestions
  const suggestions = useMemo<(string | { label: string; emoji: string })[]>(() => {
    if (!value || value.length < 2) {
      return [...POPULAR_SUGGESTIONS, ...RECOMMENDED_SUGGESTIONS];
    }

    const searchTerm = value.toLowerCase();
    const matches = new Set<string>();

    gradients.forEach((gradient) => {
      if (gradient.name?.toLowerCase().includes(searchTerm)) {
        matches.add(gradient.name);
      }
      gradient.colorsname?.forEach((color) => {
        if (color?.toLowerCase().includes(searchTerm)) {
          matches.add(color);
        }
      });
      gradient.keywords?.flat().forEach((keyword) => {
        if (keyword?.toLowerCase().includes(searchTerm)) {
          matches.add(keyword);
        }
      });
    });

    return Array.from(matches)
      .filter((item) => item.toLowerCase() !== searchTerm)
      .slice(0, 10)
      .sort((a, b) => {
        const aStarts = a.toLowerCase().startsWith(searchTerm);
        const bStarts = b.toLowerCase().startsWith(searchTerm);
        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;
        return a.length - b.length;
      });
  }, [value, gradients]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isOpen && suggestions.length > 0) {
        switch (e.key) {
          case "ArrowDown":
            e.preventDefault();
            setSelectedIndex((prev) =>
              prev < suggestions.length - 1 ? prev + 1 : 0,
            );
            break;
          case "ArrowUp":
            e.preventDefault();
            setSelectedIndex((prev) =>
              prev > 0 ? prev - 1 : suggestions.length - 1,
            );
            break;
          case "Enter":
            e.preventDefault();
            if (selectedIndex >= 0) {
              const selectedValue = suggestions[selectedIndex];
              onChange(typeof selectedValue === "string" ? selectedValue : selectedValue.label);
            }
            setIsOpen(false);
            setSelectedIndex(-1);
            break;
          case "Escape":
            setIsOpen(false);
            setSelectedIndex(-1);
            inputRef.current?.blur();
            break;
        }
      } else if (e.key === "Enter") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, suggestions, selectedIndex, onChange]);

  const handleInputChange = (newValue: string) => {
    onChange(newValue);
    setSelectedIndex(-1);
    setIsOpen(true);
  };

  const handleSuggestionClick = (suggestion: string | { label: string; emoji: string }) => {
    const cleanValue = typeof suggestion === "string" ? suggestion : suggestion.label;
    onChange(cleanValue);
    setIsOpen(false);
    setSelectedIndex(-1);
  };

  const handleFocus = () => {
    setIsOpen(true);
  };

  const handleBlur = () => {
    setTimeout(() => setIsOpen(false), 200);
  };

  const showNoResults = isOpen && value.length >= 2 && suggestions.length === 0;
  const hasDropdown = (isOpen && suggestions.length > 0) || showNoResults;

  return (
    <div className={cn("relative w-full", className)}>
      <div className="relative">
        <Input
          ref={inputRef}
          value={value}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={isLoading}
          className={cn(
            "h-12 w-full border border-white/5 px-6 pr-[280px] max-[527px]:pr-[100px] transition-[border-color,background-color,box-shadow,opacity] duration-200",
            "bg-neutral-900/90 backdrop-blur-md text-white shadow-xl",
            "hover:border-white/10 focus:border-white/10 focus:outline-none focus:ring-0 focus:ring-offset-0",
            "placeholder:text-white/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)]",
            hasDropdown ? "rounded-t-2xl rounded-b-none border-b-0" : "rounded-full",
            isLoading && "opacity-50 cursor-not-allowed"
          )}
          type="text"
          autoComplete="off"
          spellCheck={false}
          placeholder=""
        />

        {!value && (
          <div className="pointer-events-none absolute inset-y-0 left-6 flex items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPlaceholder}
                initial={{ opacity: 0, y: 2 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -2 }}
                transition={{ duration: 0.15 }}
                className="text-sm text-white/30"
              >
                {currentPlaceholder}
              </motion.div>
            </AnimatePresence>
          </div>
        )}

        <div className="absolute right-3 ma top-1/2   flex -translate-y-1/2 items-center gap-1">
          <div className="flex items-center bg-white/[0.03] max-md:bg-[#1C1C1C] border border-white/5 rounded-full p-1 max-md:p-0.5 pr-2 sm:pr-2.5 gap-0.5 sm:gap-1 ">
            <DropdownMenu>
              <DropdownMenuTrigger className={filterButtonStyle}>
                {TypeIcons[gradientType]}
                <span className="max-[527px]:hidden">{gradientType}</span>
                <ChevronDown className="h-2.5 w-2.5 opacity-30 max-[527px]:ml-0.5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-neutral-900 border-white/10 p-1 min-w-[140px] backdrop-blur-xl">
                {(["background", "text"] as const).map((type) => (
                  <DropdownMenuItem
                    key={type}
                    onSelect={() => onGradientTypeChange(type)}
                    className="capitalize text-white/70 focus:bg-white/5 focus:text-white cursor-pointer text-[10px] font-bold uppercase tracking-wider rounded-md flex items-center gap-2 px-3 py-2 group"
                  >
                    <div className="shrink-0 opacity-80 group-focus:opacity-100 transition-opacity">
                      {TypeIcons[type]}
                    </div>
                    <span>{type}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="w-[1px]  h-2.5 bg-white/10" />

            <DropdownMenu>
              <DropdownMenuTrigger className={filterButtonStyle}>
                {ShapeIcons[gradientShape]}
                <span className="max-[527px]:hidden">{gradientShape}</span>
                <ChevronDown className="h-2.5 w-2.5 opacity-30 max-[527px]:ml-0.5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-neutral-900 border-white/10 p-1 min-w-[140px] backdrop-blur-xl">
                {(["auto", "linear", "radial", "conic"] as const).map((shape) => (
                  <DropdownMenuItem
                    key={shape}
                    onSelect={() => onGradientShapeChange(shape)}
                    className="capitalize text-white/70 focus:bg-white/5 focus:text-white cursor-pointer text-[10px] font-bold uppercase tracking-wider rounded-md flex items-center gap-2 px-3 py-2"
                  >
                    <div className="shrink-0 opacity-80 group-focus:opacity-100 transition-opacity">
                      {ShapeIcons[shape]}
                    </div>
                    <span>{shape}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

          </div>
        </div>
      </div>

      <AnimatePresence>
        {hasDropdown && (
          <motion.div
            ref={listRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className={cn(
              "absolute left-0 right-0 z-50 max-h-[450px] overflow-y-auto custom-scrollbar",
              "rounded-b-2xl border border-white/5 border-t-0 bg-neutral-900/95 backdrop-blur-xl shadow-2xl"
            )}
          >
            <div className="p-1.5 pt-0">
              {!value || value.length < 2 ? (
                <>
                  <div className="px-4 py-2 sm:py-3 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.15em] text-white/20">
                    Popular Searches
                  </div>
                  {suggestions.slice(0, POPULAR_SUGGESTIONS.length).map((item, index) => {
                    const suggestion = item as { label: string; emoji: string };
                    return (
                      <button
                        key={suggestion.label}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className={cn(
                          "group flex w-full items-center gap-2 sm:gap-3.5 rounded-xl px-3 sm:px-4 py-1.5 sm:py-2.5 text-left transition-all",
                          selectedIndex === index
                            ? "bg-white/10 text-white"
                            : "text-white/50 hover:bg-white/5 hover:text-white"
                        )}
                      >
                        <span className="text-lg sm:text-xl leading-none transition-all duration-300">
                          {suggestion.emoji}
                        </span>
                        <span className="flex-1 truncate text-[11px] sm:text-[14px] font-medium tracking-wide">
                          {suggestion.label}
                        </span>
                        <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-white/10 group-hover:text-white/20 transition-colors">
                          Search
                        </span>
                      </button>
                    );
                  })}

                  <div className="mt-2 sm:mt-4 border-t border-white/5 pt-2 sm:pt-4 px-4 py-2 sm:py-3 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.15em] text-white/20">
                    Recommended for You
                  </div>
                  {suggestions.slice(POPULAR_SUGGESTIONS.length).map((item, index) => {
                    const actualIndex = index + POPULAR_SUGGESTIONS.length;
                    const suggestion = item as { label: string; emoji: string };
                    return (
                      <button
                        key={suggestion.label}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className={cn(
                          "group flex w-full items-center gap-2 sm:gap-3.5 rounded-xl px-3 sm:px-4 py-1.5 sm:py-2.5 text-left transition-all",
                          selectedIndex === actualIndex
                            ? "bg-white/10 text-white"
                            : "text-white/50 hover:bg-white/5 hover:text-white"
                        )}
                      >
                        <span className="text-lg sm:text-xl leading-none transition-all duration-300">
                          {suggestion.emoji}
                        </span>
                        <span className="flex-1 truncate text-[11px] sm:text-[14px] font-medium tracking-wide">
                          {suggestion.label}
                        </span>
                        <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-white/10 group-hover:text-white/20 transition-colors">
                          Search
                        </span>
                      </button>
                    );
                  })}
                </>
              ) : showNoResults ? (
                <div className="flex flex-col items-center justify-center py-10 px-4 text-center animate-in fade-in zoom-in duration-300">
                  <motion.div

                    className="mb-4 relative"
                  >
                    <div className="absolute inset-0 blur-3xl bg-white/5 rounded-full" />
                    <img
                      src={ErrorImage}
                      alt="No results"
                      className="relative h-32 w-32 object-contain opacity-60 brightness-110 contrast-125"
                    />
                  </motion.div>
                  <h3 className="text-sm font-semibold text-white/70 mb-1">
                    No matching gradients
                  </h3>
                  <p className="text-xs text-white/30 max-w-[200px]">
                    We couldn't find any results for "{value}". Try a different term!
                  </p>
                </div>
              ) : (
                suggestions.map((suggestion, index) => (
                  <button
                    key={typeof suggestion === "string" ? suggestion : suggestion.label}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className={cn(
                      "group flex w-full items-center gap-2 sm:gap-3.5 rounded-xl px-3 sm:px-4 py-1.5 sm:py-2.5 text-left transition-all",
                      selectedIndex === index
                        ? "bg-white/10 text-white"
                        : "text-white/50 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    {typeof suggestion !== "string" ? (
                      <>
                        <span className="text-lg sm:text-xl leading-none transition-all duration-300">
                          {suggestion.emoji}
                        </span>
                        <span className="flex-1 truncate text-[11px] sm:text-[14px] font-medium tracking-wide">
                          {suggestion.label}
                        </span>
                      </>
                    ) : (
                      <span className="flex-1 truncate text-[11px] sm:text-[14px] font-medium tracking-wide pl-1">
                        {suggestion}
                      </span>
                    )}
                    <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-white/10 group-hover:text-white/20 transition-colors">
                      Search
                    </span>
                  </button>
                ))
              )}
            </div>


            <div className="border-t border-white/5 bg-white/[0.02] px-4 py-2 text-[10px] text-white/20">
              <div className="flex items-center justify-between">
                <span>Navigate with ↑↓ and Enter</span>
                <span>{suggestions.length} results</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
