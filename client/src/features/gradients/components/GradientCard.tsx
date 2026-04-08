import { cn } from "@/shared/lib/utils";
import { useColorFormat } from "@/features/gradients/hooks/useColorFormat";
import { useCopyState } from "@/features/gradients/hooks/useCopyState";
import { animatedGradientUtils } from "@/features/gradients/utils/animatedGradientUtils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { MagicCard } from "@/shared/ui/MagicCard";
import { ChevronDown, Download, Eye, EyeOff, Pencil, Trash2 } from "lucide-react";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ColorSwatches } from "./ColorSwatches";
import { LikeDislike } from "./LikeDislike";
import { GradientPreview } from "./GradientPreview";
import { DownloadOptionsDropdown } from "./DownloadOptionsDropdown";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";


import { Gradient, GradientCardProps } from "@/shared/types/types";
import { CodePreview } from "./CodePreview";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/ui/tooltip";

// Icon Components for different formats
const TailwindIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.001,4.8c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 C13.666,10.618,15.027,12,18.001,12c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C16.337,6.182,14.976,4.8,12.001,4.8z M6.001,12c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 C7.666,17.818,9.027,19.2,12.001,19.2c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C10.337,13.382,8.976,12,6.001,12z" />
  </svg>
);

const CSSIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M1.5 0h21l-1.91 21.563L11.977 24l-8.565-2.438L1.5 0zm17.09 4.413L5.41 4.413l.213 2.622h10.125l-.255 2.716h-6.64l.24 2.573h6.182l-.366 3.523-2.91.804-2.956-.81-.188-2.11h-2.61l.29 3.855L12 19.288l5.373-1.53L18.59 4.414z" />
  </svg>
);

const SassIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12,0C5.4,0,0,5.4,0,12s5.4,12,12,12s12-5.4,12-12S18.6,0,12,0z M10.6,16.2c-0.3,1.1-0.7,2.1-1.5,2.9 c-0.5,0.5-1.1,0.9-1.8,0.9c-0.7,0-1.1-0.4-1.1-1.1c0-1.1,0.6-2.1,1.4-2.8c0.8-0.7,1.8-1.1,2.9-1.1c0.1,0,0.1,0,0.2,0 C10.7,15.4,10.7,15.8,10.6,16.2z M16.6,14.4c-0.3,0-0.6,0.1-0.9,0.1c-1.3,0.2-1.5,0.4-1.7,0.9c-0.1,0.3-0.1,0.6-0.1,0.9 c0,1.1,0.4,1.8,1.1,2.2c0.4,0.2,0.9,0.3,1.4,0.3c1.1,0,2.1-0.4,2.8-1.1c0.7-0.7,1.1-1.7,1.1-2.8c0-0.7-0.2-1.3-0.6-1.8 C18.2,12.7,17.4,12.4,16.6,14.4z" />
  </svg>
);

const BootstrapIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6.1 21.98C4.2 21.81 2.78 20.79 2.06 19.62c-.72-1.17-.72-2.06 0-3.23.72-1.17 2.14-2.19 4.04-2.36.1-.01.2-.01.3-.01 1.5 0 2.9.6 3.9 1.6 1 1 1.6 2.4 1.6 3.9 0 .1 0 .2-.01.3-.17 1.9-1.19 3.32-2.36 4.04-1.17.72-2.06.72-3.23 0-.72-.44-1.3-1.02-1.74-1.74-.44-.72-.72-1.5-.72-2.32 0-.1 0-.2.01-.3.17-1.9 1.19-3.32 2.36-4.04 1.17-.72 2.06-.72 3.23 0 1.17.72 2.19 2.14 2.36 4.04.01.1.01.2.01.3 0 .82-.28 1.6-.72 2.32-.44.72-1.02 1.3-1.74 1.74z" />
  </svg>
);

const ReactNativeIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 9.861A2.139 2.139 0 1 0 12 14.139 2.139 2.139 0 1 0 12 9.861zM6.008 16.255l-.472-.12C2.018 15.246 0 13.737 0 11.996s2.018-3.25 5.536-4.139l.472-.119.133.468a23.53 23.53 0 0 0 1.363 3.578l.101.213-.101.213a23.307 23.307 0 0 0-1.363 3.578l-.133.467zM5.317 8.95c-2.674.751-4.315 1.9-4.315 3.046 0 1.145 1.641 2.294 4.315 3.046a24.95 24.95 0 0 1 1.182-3.046A24.752 24.752 0 0 1 5.317 8.95zM17.992 16.255l-.133-.469a23.357 23.357 0 0 0-1.364-3.577l-.101-.213.101-.213a23.42 23.42 0 0 0 1.364-3.578l.133-.468.473.119c3.517.889 5.535 2.398 5.535 4.139s-2.018 3.25-5.535 4.139l-.473.121zm-.491-4.259c.48 1.039.877 2.06 1.182 3.046 2.675-.752 4.315-1.901 4.315-3.046 0-1.146-1.641-2.294-4.315-3.046a24.788 24.788 0 0 1-1.182 3.046z" />
  </svg>
);

const FlutterIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M14.314 0L2.3 12 6 15.7 21.684.013h-7.357zm.014 11.072L7.857 17.53l6.47 6.47H21.7l-6.46-6.468 6.46-6.46h-7.37z" />
  </svg>
);

const SwiftUIIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M7.564 3.068C4.718 5.018 2.35 7.525 0 10.184c1.12 1.031 2.292 1.956 3.616 2.734-1.324.778-2.496 1.703-3.616 2.734 2.35 2.659 4.718 5.166 7.564 7.116C10.436 20.018 12.804 17.511 15.154 14.652c-1.12-1.031-2.292-1.956-3.616-2.734 1.324-.778 2.496-1.703 3.616-2.734C12.804 6.525 10.436 4.018 7.564 3.068zM12 1.536c.83.278 1.659.751 2.315 1.52l.04.043c.656.769 1.05 1.742 1.05 2.715 0 .973-.394 1.946-1.05 2.715L12 12l-2.355-3.471c-.656-.769-1.05-1.742-1.05-2.715 0-.973.394-1.946 1.05-2.715.656-.769 1.485-1.242 2.315-1.52z" />
  </svg>
);

const KotlinIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 24H0V0h24L12 12 24 24z" />
  </svg>
);

const VueIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M2,3l10,18L22,3h-4l-6,10.5L6,3H2z" />
  </svg>
);

const AngularIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2L2 7.09v5.54C2 18.14 7.2 22.42 12 22.42s10-4.28 10-9.79V7.09L12 2zm0 2.18l8 4.69v4.95c0 4.48-4 8.06-8 8.06s-8-3.58-8-8.06V8.87l8-4.69z" />
  </svg>
);

const ReactIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M14.23 12.004a2.236 2.236 0 0 1-2.235 2.236 2.236 2.236 0 0 1-2.236-2.236 2.236 2.236 0 0 1 2.235-2.236 2.236 2.236 0 0 1 2.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.41 0-.783.093-1.106.278-1.375.793-1.683 3.264-.973 6.365C1.98 8.917 0 10.42 0 12.004c0 1.59 1.99 3.097 5.043 4.03-.704 3.113-.39 5.588.988 6.38.32.187.69.278 1.102.278 1.345 0 3.107-.96 4.888-2.624 1.78 1.654 3.542 2.603 4.887 2.603.41 0 .783-.09 1.106-.275 1.374-.792 1.683-3.263.973-6.365C22.02 15.096 24 13.59 24 12.004c0-1.59-1.99-3.097-5.043-4.032.704-3.11.39-5.587-.988-6.38-.318-.184-.688-.277-1.092-.278zm-.005 1.09v.006c.225 0 .406.044.558.127.666.382.955 1.835.73 3.704-.054.46-.142.945-.25 1.44-.96-.236-2.006-.417-3.107-.534-.66-.905-1.345-1.727-2.035-2.447 1.592-1.48 3.087-2.292 4.105-2.295zm-9.77.02c1.012 0 2.514.808 4.11 2.28-.686.72-1.37 1.537-2.02 2.442-1.107.117-2.154.298-3.113.538-.112-.49-.195-.964-.254-1.42-.23-1.868.054-3.32.714-3.707.19-.09.4-.127.563-.132zm4.882 3.05c.455.468.91.992 1.36 1.564-.44-.02-.89-.034-1.36-.034-.47 0-.92.014-1.36.034.44-.572.895-1.096 1.36-1.564zM12 8.1c.74 0 1.477.034 2.202.093.406.582.802 1.203 1.183 1.86.372.64.71 1.29 1.018 1.946-.308.655-.646 1.31-1.013 1.95-.38.66-.773 1.288-1.18 1.87-.728.063-1.466.098-2.21.098-.74 0-1.477-.035-2.202-.093-.406-.582-.802-1.204-1.183-1.86-.372-.64-.71-1.29-1.018-1.946.303-.657.646-1.313 1.013-1.954.38-.66.773-1.286 1.18-1.66.728-.064 1.466-.099 2.21-.099zm-3.635.254c-.24.377-.48.763-.704 1.16-.225.39-.435.782-.635 1.174-.265-.656-.49-1.31-.676-1.947.665-.12 1.336-.213 2.015-.287zm7.26 0c.695.074 1.365.167 2.015.287-.18.632-.405 1.282-.66 1.933-.2-.39-.41-.783-.64-1.174-.225-.392-.465-.774-.705-1.146zm3.063.675c.484.15.944.317 1.375.498 1.732.74 2.852 1.708 2.852 2.476-.005 1.708-2.853 2.852-4.176 3.424-.302.13-.617.24-.944.339-.18-.637-.407-1.282-.66-1.933.25-.65.474-1.297.553-1.804zm-13.395.004c.178.643.436 1.316.585 1.938-.247.652-.42 1.303-.498 1.96-.404-.14-.786-.283-1.143-.439-.612-.265-1.178-.583-1.61-.916-.832-.64-1.22-1.12-1.22-1.543 0-.422.404-.966 1.193-1.614.525-.434 1.126-.7 1.693-.926.195-.077.4-.162.6-.245.198-.083.4-.131.6-.175zm.007 5.384c-.022-.588-.007-1.174.007-1.763.445-.703.89-1.365 1.345-1.963.455-.599.915-1.138 1.375-1.635.464-.497.933-.94 1.405-1.337.432.397.845.816 1.253 1.252.408.436.79.88 1.155 1.338-.365.458-.747.902-1.155 1.338-.408.436-.821.855-1.253 1.252-.47.397-.915.869-1.377 1.38-.455.51-.9 1.055-1.345 1.65-.458.594-.915 1.23-1.375 1.925-.459.695-.915 1.433-1.375 2.208-.015-.763-.022-1.6-.06-2.645z" />
  </svg>
);

const XMLIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M5,3H7L9,7L11,3H13L10,9L13,15H11L9,11L7,15H5L8,9L5,3M14,3H16V15H14V3M18,3H20V15H18V3Z" />
  </svg>
);

const SVGIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M7.07,18.28C7.5,17.38 8.12,16.19 8.91,14.79C9.71,13.39 10.58,11.88 11.5,10.28C12.42,11.88 13.29,13.39 14.09,14.79C14.88,16.19 15.5,17.38 15.93,18.28C14.75,19.13 13.42,19.64 12,19.64C10.58,19.64 9.25,19.13 7.07,18.28M5.08,16.15C5.69,16.15 6.22,15.39 6.7,14.02C7.18,12.65 7.59,10.81 7.93,8.64C8.27,10.81 8.68,12.65 9.16,14.02C9.64,15.39 10.17,16.15 10.78,16.15C11.39,16.15 11.92,15.39 12.4,14.02C12.88,12.65 13.29,10.81 13.63,8.64C13.97,10.81 14.38,12.65 14.86,14.02C15.34,15.39 15.87,16.15 16.48,16.15C17.09,16.15 17.62,15.39 18.1,14.02C18.58,12.65 18.99,10.81 19.33,8.64C19.36,8.47 19.38,8.31 19.4,8.15C19.91,9.68 20.2,11.31 20.2,13C20.2,14.69 19.91,16.32 19.4,17.85C18.99,15.68 18.58,13.84 18.1,12.47C17.62,11.1 17.09,10.34 16.48,10.34C15.87,10.34 15.34,11.1 14.86,12.47C14.38,13.84 13.97,15.68 13.63,17.85C13.29,15.68 12.88,13.84 12.4,12.47C11.92,11.1 11.39,10.34 10.78,10.34C10.17,10.34 9.64,11.1 9.16,12.47C8.68,13.84 8.27,15.68 7.93,17.85C7.59,15.68 7.18,13.84 6.7,12.47C6.22,11.1 5.69,10.34 5.08,10.34C4.47,10.34 3.94,11.1 3.46,12.47C2.98,13.84 2.57,15.68 2.23,17.85C1.72,16.32 1.43,14.69 1.43,13C1.43,11.31 1.72,9.68 2.23,8.15C2.57,10.32 2.98,12.16 3.46,13.53C3.94,14.9 4.47,15.66 5.08,15.66Z" />
  </svg>
);

const JSONIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M5,3H7V5H5V10A2,2 0 0,1 3,12A2,2 0 0,1 5,14V19H7V21H5C3.93,20.73 3,20.1 3,19V15A2,2 0 0,0 1,13H0V11H1A2,2 0 0,0 3,9V5C3,3.9 3.9,3 5,3M19,3A2,2 0 0,1 21,5V9A2,2 0 0,0 23,11H24V13H23A2,2 0 0,0 21,15V19A2,2 0 0,1 19,21H17V19H19V14A2,2 0 0,1 21,12A2,2 0 0,1 19,10V5H17V3H19Z" />
  </svg>
);

const FORMATS = [
  { key: "tailwind", label: "Tailwind CSS", icon: TailwindIcon },
  { key: "css", label: "CSS", icon: CSSIcon },
  { key: "sass", label: "SASS/SCSS", icon: SassIcon },
  { key: "bootstrap", label: "Bootstrap", icon: BootstrapIcon },
  { key: "react-native", label: "React Native", icon: ReactNativeIcon },
  { key: "flutter", label: "Flutter", icon: FlutterIcon },
  { key: "swiftui", label: "SwiftUI", icon: SwiftUIIcon },
  { key: "kotlin", label: "Kotlin", icon: KotlinIcon },
  { key: "vue", label: "Vue.js", icon: VueIcon },
  { key: "angular", label: "Angular", icon: AngularIcon },
  { key: "react", label: "React", icon: ReactIcon },
  { key: "xml", label: "Android XML", icon: XMLIcon },
  { key: "svg", label: "SVG", icon: SVGIcon },
  { key: "json", label: "JSON", icon: JSONIcon },
];

export default function GradientCard({
  gradient,
  isFavorite,
  onFavoriteToggle,
  editable = false,
  onColorsChange,
  onEditClick,
  onDeleteClick,
  globalGradientType,
  globalGradientShape,
  isDisliked: _isDisliked,
  onDislikeToggle: _onDislikeToggle,
}: GradientCardProps) {
  const [activeTab, setActiveTab] = useState("tailwind");
  const [angle, setAngle] = useState((gradient as any).angle ?? 90);
  const [showAngleController, setShowAngleController] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (gradient.angle !== undefined) {
      setAngle(gradient.angle);
    }
  }, [gradient]);

  const {
    selectedColorFormat,
    setSelectedColorFormat,
    getColorInFormat,
    // Remove local gradientType/setGradientType
  } = useColorFormat();

  // Use props instead of local state
  // Derive shape from: global override > gradient's stored type > rawCss > default linear
  const getDefaultShape = () => {
    if (gradient.rawCss) return "auto";
    const t = (gradient as any).type;
    if (t === "conic") return "conic";
    if (t === "radial") return "radial";
    if (t === "default") return "auto";
    return "linear";
  };
  const gradientShape = globalGradientShape || getDefaultShape();
  const gradientType = globalGradientType || "background";
  const { copiedStates, copyToClipboard } = useCopyState();
  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);

  const SelectedFormatIcon = useMemo(() => {
    return FORMATS.find((f) => f.key === activeTab)?.icon;
  }, [activeTab]);

  const selectedFormatLabel = useMemo(() => {
    return FORMATS.find((f) => f.key === activeTab)?.label || activeTab;
  }, [activeTab]);

  const handleColorChange = (index: number, newColor: string) => {
    const newColors = [...gradient.colors];
    newColors[index] = newColor;
    onColorsChange?.(newColors);
  };

  const isLightGradient = useMemo(() => {
    return gradient.colors.every((color) => {
      const hex = color.replace(/^#/, "");
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      return brightness > 200;
    });
  }, [gradient.colors]);

  const handlePointer = useCallback(
    (clientX: number, clientY: number) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dx = clientX - centerX;
      const dy = clientY - centerY;

      // Invert dy for standard coordinate system if needed, but atan2(dy, dx) is fine
      // We want 0 degrees to be TOP (linear-gradient style)
      // Atan2(dy, dx) returns 0 for RIGHT, Math.PI/2 for BOTTOM, -Math.PI/2 for TOP
      // Adding 90 degrees (Math.PI/2) makes:
      // RIGHT: 0 + 90 = 90
      // BOTTOM: 90 + 90 = 180
      // LEFT: 180 + 90 = 270
      // TOP: -90 + 90 = 0
      let calculatedAngle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;

      // Normalize to 0-360
      if (calculatedAngle < 0) calculatedAngle += 360;
      if (calculatedAngle >= 360) calculatedAngle -= 360;

      const roundedAngle = Math.round(calculatedAngle);
      setAngle(roundedAngle);
    },
    [setAngle],
  );

  const controlColor = isLightGradient ? "black" : "white";
  const lineLength = 80;
  const pad = 70;
  const size = (lineLength + pad) * 2;
  const cx = lineLength + pad;
  const cy = lineLength + pad;
  const angleInRadians = ((angle - 90) * Math.PI) / 180;
  const labelX = Math.cos(angleInRadians) * lineLength;
  const labelY = Math.sin(angleInRadians) * lineLength;
  const tooltipText = showAngleController
    ? "Hide angle controller"
    : "Show angle controller";
  const editTooltipText = "Edit gradient";
  const deleteTooltipText = "Delete gradient";

  const handleEditButtonClick = () => {
    if (onEditClick) {
      // Determine the actual rendered type from the card's current display
      const editType = (gradient as any).type || 
        (gradientShape === "conic" ? "conic" :
         gradientShape === "radial" ? "radial" :
         gradientShape === "auto" ? "default" : "linear");

      // Capture the EXACT CSS being rendered so the PreviewArea shows the same visual
      const computedCss = getGradientStyle();

      onEditClick({
        ...gradient,
        angle: gradient.angle ?? angle,
        type: editType,
        rawCss: computedCss, // Pass exact rendered CSS for perfect visual match
        exposure: gradient.exposure,
        contrast: gradient.contrast,
        frequency: gradient.frequency,
        phase: gradient.phase,
        steps: gradient.steps,
        baseColors: gradient.baseColors || gradient.colors,
      });
    } else {
      console.warn("onEditClick prop is not provided");
    }
  };

  const handleDeleteButtonClick = () => {
    if (onDeleteClick && gradient.id) {
      onDeleteClick(gradient as Gradient & { id: string });
    } else {
      console.warn("onDeleteClick prop is not provided or gradient id is missing");
    }
  };


  const formattedColors = gradient.colors.map((color) =>
    getColorInFormat(color),
  );

  const getGradientStyle = () => {
    // 1. Check for global force-shape overrides from SearchBox (if not "auto")
    if (globalGradientShape && globalGradientShape !== "auto") {
      if (globalGradientShape === "linear") {
        return `linear-gradient(${angle}deg, ${formattedColors.join(", ")})`;
      }
      if (globalGradientShape === "radial") {
        return `radial-gradient(circle, ${formattedColors.join(", ")})`;
      }
      if (globalGradientShape === "conic") {
        return `conic-gradient(from ${angle}deg, ${formattedColors.join(", ")})`;
      }
    }

    // 2. Handle native/auto rendering logic
    const nativeType = (gradient as any).type || "linear";

    // AI / High-fidelity logic for "default", "auto" or rawCss gradients
    if (nativeType === "default" || nativeType === "auto" || (gradient.rawCss && (!globalGradientShape || globalGradientShape === "auto"))) {
      if (gradient.rawCss) {
        let css = gradient.rawCss;
        // Convert all colors in the raw CSS to the selected format
        gradient.colors.forEach((hexColor, index) => {
          const formattedColor = formattedColors[index];
          css = css.split(new RegExp(hexColor, "i")).join(formattedColor);
        });

        // Inject current angle into CSS if possible
        if (css.includes("linear-gradient")) {
          return css.replace(
            /(-?\d+(\.\d+)?deg|to (top|bottom|left|right|top right|top left|bottom right|bottom left))/,
            `${angle}deg`
          );
        } else if (css.includes("conic-gradient")) {
          return css.replace(
            /from\s+(-?\d+(\.\d+)?deg)/,
            `from ${angle}deg`
          );
        }
        return css;
      }

      // Default AI style is the new Segmented Conic
      if (nativeType === "default" || nativeType === "auto") {
        return animatedGradientUtils.generateSegmentedConic(
          formattedColors,
          angle
        );
      }
    }

    // 3. Fallback to standard shapes based on native type
    if (nativeType === "conic") {
      return `conic-gradient(from ${angle}deg, ${formattedColors.join(", ")})`;
    }
    if (nativeType === "radial") {
      return `radial-gradient(circle, ${formattedColors.join(", ")})`;
    }

    // Standard Linear fallback
    return `linear-gradient(${angle}deg, ${formattedColors.join(", ")})`;
  };

  const getCodePreview = (): React.CSSProperties => {
    const gradientStyle = getGradientStyle();
    return gradientType === "background"
      ? { background: gradientStyle }
      : {
        color: "transparent",
        backgroundImage: gradientStyle,
        WebkitBackgroundClip: "text",
      };
  };

  const getCode = (format: string) => {
    const animationOptions = {
      colors: formattedColors,
      angle,
      isAnimated: false,
      animationSpeed: 1,
      gradientType,
      customCss: getGradientStyle(),
    };

    switch (format) {
      case "tailwind":
        return animatedGradientUtils.generateAnimatedTailwind(animationOptions);
      case "css":
        return animatedGradientUtils.generateAnimatedCSS(animationOptions);
      case "sass":
        return animatedGradientUtils.generateAnimatedSass(animationOptions);
      case "bootstrap":
        return animatedGradientUtils.generateAnimatedBootstrap(
          animationOptions,
        );
      case "react-native":
        return animatedGradientUtils.generateAnimatedReactNative(
          animationOptions,
        );
      case "flutter":
        return animatedGradientUtils.generateAnimatedFlutter(animationOptions);
      case "swiftui":
        return animatedGradientUtils.generateAnimatedSwiftUI(animationOptions);
      case "kotlin":
        return animatedGradientUtils.generateAnimatedKotlin(animationOptions);
      case "vue":
        return animatedGradientUtils.generateAnimatedVue(animationOptions);
      case "angular":
        return animatedGradientUtils.generateAnimatedAngular(animationOptions);
      case "react":
        return animatedGradientUtils.generateAnimatedReact(animationOptions);
      case "xml":
        return animatedGradientUtils.generateAnimatedXML(animationOptions);
      case "svg": {
        return `<!-- SVG Linear Gradient -->
<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      ${formattedColors
            .map((color, index) => {
              const offset =
                formattedColors.length === 1
                  ? 0
                  : (index / (formattedColors.length - 1)) * 100;
              return `<stop offset="${offset}%" stop-color="${color}" />`;
            })
            .join("\n      ")}
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#gradient)" />
</svg>`;
      }
      case "json": {
        const gradientStyle = getGradientStyle();
        return JSON.stringify(
          {
            name: gradient.name,
            colors: formattedColors,
            angle: angle,
            type:
              gradientShape === "linear"
                ? "linear-gradient"
                : gradientShape === "radial"
                  ? "radial-gradient"
                  : "conic-gradient",
            format: selectedColorFormat,
            gradientType: gradientType,
            isAnimated: false,
            animationSpeed: 1,
            css: gradientStyle,
            animatedCSS: null,
            metadata: {
              exportedAt: new Date().toISOString(),
              tool: "GradientsCSS",
              version: "1.0.0",
            },
          },
          null,
          2,
        );
      }
      default:
        return "";
    }
  };



  const { theme } = useTheme();

  return (
    <MagicCard
      gradientColor={theme === "dark" ? "#262626" : "#282828"}
      className="group relative overflow-hidden transition-all duration-300"
    >
      <div className="relative md:absolute md:left-0 md:right-0 md:top-3.5 z-[70] flex items-center justify-between px-3.5 py-4 md:py-0 md:px-3.5 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 md:pointer-events-none">
        {/* User-specified Like/Dislike UI in TOP LEFT */}
        <LikeDislike
          isLiked={isFavorite}
          onLikeToggle={() => onFavoriteToggle(gradient.name)}
        />

        <TooltipProvider>
          <div className="relative pointer-events-auto flex gap-0.5 px-1 py-1 items-center justify-center rounded-[8px] backdrop-blur-md transition-all duration-300 hover:bg-white/5"
            style={{
              backgroundColor: "rgba(0,0,0,0.25)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            {/* Edit Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={handleEditButtonClick}
                  className="p-1 rounded-md hover:bg-white/10 transition-colors"
                >
                  <Pencil className="h-3.5 w-3.5 text-white" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" className="bg-black/90 border-white/10">
                <p className="text-white">{editTooltipText}</p>
              </TooltipContent>
            </Tooltip>

            {/* Delete Button */}
            {onDeleteClick && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={handleDeleteButtonClick}
                    className="p-1 rounded-md hover:bg-red-500/20 transition-colors group"
                  >
                    <Trash2 className="h-3.5 w-3.5 transition-colors group-hover:text-red-500" style={{ color: "rgba(239, 68, 68, 0.7)" }} />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-red-950 border-red-500/20 text-white">
                  <p className="text-white">{deleteTooltipText}</p>
                </TooltipContent>
              </Tooltip>
            )}

            {/* Eye/EyeOff Toggle Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  aria-label={tooltipText}
                  onClick={() => setShowAngleController((v) => !v)}
                  className="p-1 rounded-md hover:bg-white/10 transition-colors"
                >
                  {showAngleController ? (
                    <Eye className="h-3.5 w-3.5 text-white" />
                  ) : (
                    <EyeOff className="h-3.5 w-3.5 text-white" />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" className="bg-black/90 border-white/10">
                <p className="text-white">{tooltipText}</p>
              </TooltipContent>
            </Tooltip>

            {/* Download Button */}
            <DownloadOptionsDropdown
              colors={formattedColors}
              angle={angle}
              name={gradient.name}
              isAnimated={false}
              animationSpeed={1}
              shape={gradientShape}
              customCss={getGradientStyle()}
              trigger={
                <div className="p-1 rounded-md hover:bg-white/10 transition-colors cursor-pointer">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button type="button" className="p-0.5 nofocus">
                        <Download className="h-3.5 w-3.5 text-white" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="bg-black/90 border-white/10">
                      <p className="text-white">Export options</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              }
            />
          </div>
        </TooltipProvider>
      </div>

      <div key={gradientType}>
        <div
          className="relative mx-auto flex h-48 w-48 sm:h-56 sm:w-56 items-center justify-center"
          ref={containerRef}
        >
          <GradientPreview
            style={getCodePreview()}
            gradientType={gradientType}
            gradient={gradient}
          />

          <AnimatePresence>
            {showAngleController && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, rotate: -10 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.9, rotate: 10 }}
                transition={{ type: "spring", damping: 20, stiffness: 300 }}
                className="pointer-events-none absolute inset-0 z-[40] flex items-center justify-center"
              >
                <div
                  className="absolute h-2 w-2 rounded-full"
                  style={{ backgroundColor: controlColor, opacity: 0.5 }}
                />

                <svg
                  className="pointer-events-auto absolute"
                  width={size}
                  height={size}
                  viewBox={`0 0 ${size} ${size}`}
                  style={{
                    overflow: "visible",
                    touchAction: "none",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)"
                  }}
                  onPointerDown={(e) => {
                    e.stopPropagation();
                    isDraggingRef.current = true;
                    (e.currentTarget as SVGSVGElement).setPointerCapture(
                      e.pointerId,
                    );
                    handlePointer(e.clientX, e.clientY);
                  }}
                  onPointerMove={(e) => {
                    if (!isDraggingRef.current) return;
                    handlePointer(e.clientX, e.clientY);
                  }}
                  onPointerUp={(e) => {
                    isDraggingRef.current = false;
                    try {
                      (
                        e.currentTarget as SVGSVGElement
                      ).releasePointerCapture(e.pointerId);
                    } catch {
                      // ignore
                    }
                  }}
                >
                  <g transform={`rotate(${angle} ${cx} ${cy})`}>
                    <line
                      x1={cx}
                      y1={cy}
                      x2={cx}
                      y2={cy - lineLength}
                      stroke={controlColor}
                      strokeWidth={2}
                      opacity={0.4}
                      pointerEvents="none"
                    />

                    <circle
                      cx={cx}
                      cy={cy - lineLength}
                      r={20}
                      fill={
                        isLightGradient
                          ? "rgba(0,0,0,0.15)"
                          : "rgba(255,255,255,0.15)"
                      }
                      stroke={
                        isLightGradient
                          ? "rgba(0,0,0,0.3)"
                          : "rgba(255,255,255,0.3)"
                      }
                      strokeWidth={2}
                      style={{ cursor: "grab" }}
                    />

                    <circle
                      cx={cx}
                      cy={cy - lineLength}
                      r={6}
                      fill={controlColor}
                      opacity={0.95}
                      pointerEvents="none"
                    />
                  </g>
                </svg>

                <div
                  className="absolute"
                  style={{ transform: `translate(${labelX}px, ${labelY}px)` }}
                >
                  <div
                    className="absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-md px-2.5 py-1 text-xs font-medium backdrop-blur-sm"
                    style={{
                      backgroundColor: isLightGradient
                        ? "rgba(0,0,0,0.75)"
                        : "rgba(0,0,0,0.8)",
                      color: "white",
                      pointerEvents: "none",
                    }}
                  >
                    {angle}°
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>


      </div>

      <footer className="flex flex-col items-start space-y-3 p-4 pt-2 max-md:pt-[30px]">
        <div className="flex-1 w-full overflow-hidden">
          <ColorSwatches
            colors={gradient.colors}
            getColorInFormat={getColorInFormat}
            editable={editable}
            onColorChange={handleColorChange}
            copyToClipboard={(text) => copyToClipboard(text, "colors")}
          />
        </div>




        <>
          {isMobile ? (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger className="nofocus relative w-full">
                <div className="flex items-center justify-between rounded-md border border-border bg-secondary p-2 text-sm text-primary">
                  <div className="flex items-center gap-2">
                    {SelectedFormatIcon && <SelectedFormatIcon />}
                    <span>{selectedFormatLabel}</span>
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-[90vw] rounded-2xl bg-neutral-900 border-white/10 p-5 backdrop-blur-xl">
                <DialogHeader>
                  <DialogTitle className="text-white text-lg font-bold mb-4">Select Code Format</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-2 overflow-y-auto max-h-[60vh] custom-scrollbar">
                  {FORMATS.map((format) => (
                    <button
                      key={format.key}
                      onClick={() => {
                        setActiveTab(format.key);
                        setIsDialogOpen(false);
                      }}
                      className={cn(
                        "flex flex-col items-center gap-2 rounded-xl border p-3 transition-all",
                        activeTab === format.key
                          ? "bg-primary/10 border-primary text-primary"
                          : "bg-white/5 border-transparent text-white/70 hover:bg-white/10"
                      )}
                    >
                      <format.icon />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-center">{format.label}</span>
                    </button>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger className="nofocus relative w-full">
                <div className="flex items-center justify-between rounded-md border border-border bg-secondary p-2 text-sm text-primary">
                  <div className="flex items-center gap-2">
                    {SelectedFormatIcon && <SelectedFormatIcon />}
                    <span>{selectedFormatLabel}</span>
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-48 rounded-md border border-border bg-secondary p-1"
              >
                {FORMATS.map((format) => (
                  <DropdownMenuItem
                    key={format.key}
                    onSelect={() => {
                      setActiveTab(format.key);
                    }}
                    className="hover:bg-primary/10 cursor-pointer rounded px-2 py-1.5 text-sm text-primary"
                  >
                    <div className="flex items-center gap-2">
                      <format.icon />
                      <span>{format.label}</span>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <CodePreview
            code={getCode(activeTab)}
            copiedStates={copiedStates}
            activeTab={activeTab as any}
            copyToClipboard={(text, key) => {
              copyToClipboard(text, key);
            }}
            selectedColorFormat={selectedColorFormat}
            onColorFormatChange={setSelectedColorFormat}
          />
        </>
      </footer>


    </MagicCard>
  );
}
