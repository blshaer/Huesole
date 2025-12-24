/* eslint-disable @typescript-eslint/no-explicit-any */
// ExportSection component (updated with persistent dropdown and animated checks)

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { Button } from "@/shared/ui/button";
import { Label } from "@/shared/ui/label";
import { ChevronDown, Download, Image as ImageIcon, Check } from "lucide-react";
import { useCopyState } from "@/features/gradients/hooks/useCopyState";
import { useColorFormat } from "@/features/gradients/hooks/useColorFormat";
import { animatedGradientUtils } from "@/features/gradients/utils/animatedGradientUtils";
import { GeneratedGradient } from "../types";
import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import { CodePreviewInline } from "./CodePreviewInline";
import { motion, AnimatePresence } from "framer-motion";

// Icon components (same as before - keeping them for brevity)
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

const FORMAT_DEFS = [
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

const IMAGE_FORMATS = [
  { key: "png", label: "PNG", extension: "png", mimeType: "image/png" },
  { key: "jpg", label: "JPG", extension: "jpg", mimeType: "image/jpeg" },
  { key: "webp", label: "WebP", extension: "webp", mimeType: "image/webp" },
];

const IMAGE_SIZES = [
  { key: "sm", label: "Small (800x600)", width: 800, height: 600 },
  { key: "md", label: "Medium (1920x1080)", width: 1920, height: 1080 },
  { key: "lg", label: "Large (2560x1440)", width: 2560, height: 1440 },
  { key: "xl", label: "Extra Large (3840x2160)", width: 3840, height: 2160 },
];

interface ExportSectionProps {
  result: GeneratedGradient | null;
  isAnimated?: boolean;
  animationSpeed?: number;
}

export const ExportSection = ({
  result,
  isAnimated = false,
  animationSpeed = 1,
}: ExportSectionProps) => {
  const { getColorInFormat } = useColorFormat();
  const { copiedStates, copyToClipboard } = useCopyState();
  const [activeTab, setActiveTab] = useState("tailwind");
  const [selectedImageFormat, setSelectedImageFormat] = useState("png");
  const [selectedImageSize, setSelectedImageSize] = useState("md");
  const [isExporting, setIsExporting] = useState(false);
  const previewRef = useRef<HTMLDivElement | null>(null);

  if (!result) return null;

  const formattedColors = result.colors.map((c) => getColorInFormat(c));
  const angle = result.angle ?? 0;
  const gradientType = "background" as const;

  const getCode = (format: string) => {
    const options = {
      colors: formattedColors,
      angle,
      isAnimated,
      animationSpeed,
      gradientType,
    };

    switch (format) {
      case "tailwind":
        return animatedGradientUtils.generateAnimatedTailwind(options);
      case "css":
        return animatedGradientUtils.generateAnimatedCSS(options);
      case "sass":
        return animatedGradientUtils.generateAnimatedSass(options);
      case "bootstrap":
        return animatedGradientUtils.generateAnimatedBootstrap(options);
      case "react-native":
        return animatedGradientUtils.generateAnimatedReactNative(options);
      case "flutter":
        return animatedGradientUtils.generateAnimatedFlutter(options);
      case "swiftui":
        return animatedGradientUtils.generateAnimatedSwiftUI(options);
      case "kotlin":
        return animatedGradientUtils.generateAnimatedKotlin(options);
      case "vue":
        return animatedGradientUtils.generateAnimatedVue(options);
      case "angular":
        return animatedGradientUtils.generateAnimatedAngular(options);
      case "react":
        return animatedGradientUtils.generateAnimatedReact(options);
      case "xml":
        return animatedGradientUtils.generateAnimatedXML(options);
      case "svg": {
        return isAnimated
          ? `<!-- Animated SVG Linear Gradient -->
<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      ${formattedColors
            .map((color, index) => {
              const offset =
                formattedColors.length === 1
                  ? 0
                  : (index / (formattedColors.length - 1)) * 100;
              return `<stop offset="${offset}%" stop-color="${color}">
        <animate attributeName="stop-color" 
                 values="${color};${formattedColors[(index + 1) % formattedColors.length]
                };${color}" 
                 dur="${4 / animationSpeed}s" 
                 repeatCount="indefinite"/>
      </stop>`;
            })
            .join("\n      ")}
      <animateTransform attributeName="gradientTransform"
                        type="rotate"
                        values="0 100 100;360 100 100;0 100 100"
                        dur="${4 / animationSpeed}s"
                        repeatCount="indefinite"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#gradient)" />
</svg>`
          : `<!-- SVG Linear Gradient -->
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
        const gradientStyle = `linear-gradient(${angle}deg, ${formattedColors.join(
          ", ",
        )})`;
        return JSON.stringify(
          {
            name: result.name,
            colors: formattedColors,
            angle,
            type: "linear-gradient",
            format: "HEX",
            gradientType,
            isAnimated,
            animationSpeed,
            css: gradientStyle,
            animatedCSS: isAnimated
              ? `${gradientStyle}; background-size: 400% 400%; animation: gradientShift ${4 / animationSpeed
              }s ease infinite;`
              : null,
            metadata: {
              exportedAt: new Date().toISOString(),
              tool: "GradlyAI",
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

  const code = getCode(activeTab);
  const activeFormat =
    FORMAT_DEFS.find((f) => f.key === activeTab) ?? FORMAT_DEFS[0];
  const ActiveIcon = activeFormat.icon;

  const handleDownloadImage = async (
    formatKey: string = selectedImageFormat,
    sizeKey: string = selectedImageSize,
  ) => {
    if (isExporting) return;

    setIsExporting(true);

    try {
      const format = IMAGE_FORMATS.find((f) => f.key === formatKey);
      const size = IMAGE_SIZES.find((s) => s.key === sizeKey);

      if (!format || !size) {
        setIsExporting(false);
        return;
      }

      const tempContainer = document.createElement("div");
      tempContainer.style.width = `${size.width}px`;
      tempContainer.style.height = `${size.height}px`;
      tempContainer.style.position = "fixed";
      tempContainer.style.left = "-9999px";
      tempContainer.style.top = "0";
      tempContainer.style.zIndex = "-1";
      tempContainer.style.backgroundImage = `linear-gradient(${angle}deg, ${formattedColors.join(
        ", ",
      )})`;

      if (isAnimated) {
        tempContainer.style.backgroundSize = "400% 400%";
        tempContainer.style.animation = `gradientShift ${4 / animationSpeed
          }s ease infinite`;
      }

      document.body.appendChild(tempContainer);

      await new Promise((resolve) => setTimeout(resolve, 100));

      const canvas = await html2canvas(tempContainer, {
        width: size.width,
        height: size.height,
        scale: 1,
        backgroundColor: null,
        logging: false,
        useCORS: true,
        allowTaint: true,
      });

      document.body.removeChild(tempContainer);

      const dataUrl = canvas.toDataURL(format.mimeType, 1.0);

      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `${result.name || "gradient"
        }-${size.key}.${format.extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error exporting image:", error);
      alert("Failed to export image. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const activeImageFormat =
    IMAGE_FORMATS.find((f) => f.key === selectedImageFormat) ??
    IMAGE_FORMATS[0];
  const activeImageSize =
    IMAGE_SIZES.find((s) => s.key === selectedImageSize) ?? IMAGE_SIZES[1];

  return (
    <section className="space-y-4 pb-6 pt-4">
      <div className="flex items-center justify-between gap-2">
        <Label className="text-foreground/40 text-[11px] font-bold uppercase tracking-[0.2em]">
          Export Design
        </Label>

        {/* Export as Image Dropdown - FIXED WITH PERSISTENT STATE */}
        <DropdownMenu>
          <DropdownMenuTrigger className="nofocus">
            <Button
              variant="outline"
              size="sm"
              className="bg-card/60 text-foreground/80 hover:bg-card/80 h-8 gap-1 rounded-md border-border px-2 text-[11px]"
              disabled={isExporting}
            >
              <ImageIcon className="h-3 w-3" />
              <span>{isExporting ? "Exporting..." : "Export Image"}</span>
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 rounded-md border border-border bg-secondary p-1"
          >
            <div className="text-foreground/60 px-2 py-1.5 text-xs font-semibold">
              Format
            </div>
            {IMAGE_FORMATS.map((format) => (
              <DropdownMenuItem
                key={format.key}
                onSelect={(e) => {
                  e.preventDefault();
                  setSelectedImageFormat(format.key);
                }}
                className={`hover:bg-primary/10 cursor-pointer rounded px-2 py-1.5 text-sm ${selectedImageFormat === format.key
                    ? "bg-primary/10 text-primary"
                    : "text-foreground/80"
                  }`}
              >
                <div className="flex w-full items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="h-4 w-4" />
                    <span>{format.label}</span>
                  </div>
                  <AnimatePresence mode="wait">
                    {selectedImageFormat === format.key && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 30,
                        }}
                      >
                        <Check className="h-4 w-4 text-primary" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </DropdownMenuItem>
            ))}

            <div className="my-1 h-px bg-border" />

            <div className="text-foreground/60 px-2 py-1.5 text-xs font-semibold">
              Size
            </div>
            {IMAGE_SIZES.map((size) => (
              <DropdownMenuItem
                key={size.key}
                onSelect={(e) => {
                  e.preventDefault();
                  setSelectedImageSize(size.key);
                }}
                className={`hover:bg-primary/10 cursor-pointer rounded px-2 py-1.5 text-sm ${selectedImageSize === size.key
                    ? "bg-primary/10 text-primary"
                    : "text-foreground/80"
                  }`}
              >
                <div className="flex w-full items-center justify-between">
                  <span>{size.label}</span>
                  <AnimatePresence mode="wait">
                    {selectedImageSize === size.key && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0, rotate: -180 }}
                        animate={{ scale: 1, opacity: 1, rotate: 0 }}
                        exit={{ scale: 0, opacity: 0, rotate: 180 }}
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 30,
                        }}
                      >
                        <Check className="h-4 w-4 text-primary" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </DropdownMenuItem>
            ))}

            <div className="my-1 h-px bg-border" />

            <DropdownMenuItem
              onSelect={() =>
                handleDownloadImage(selectedImageFormat, selectedImageSize)
              }
              className="hover:bg-primary/10 cursor-pointer rounded px-2 py-1.5 text-sm font-medium text-primary"
            >
              <div className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                <span>
                  Download as {activeImageFormat.label} (
                  {activeImageSize.label.split(" ")[0]})
                </span>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="space-y-2">
        {/* Format dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className="nofocus w-full">
            <div className="flex items-center justify-between rounded-md border border-border bg-secondary p-2 text-sm text-primary">
              <div className="flex items-center gap-2">
                <ActiveIcon />
                <span>{activeFormat.label}</span>
              </div>
              <ChevronDown className="h-4 w-4" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-52 rounded-md border border-border bg-secondary p-1"
          >
            {FORMAT_DEFS.map((format) => {
              const Icon = format.icon;
              return (
                <DropdownMenuItem
                  key={format.key}
                  onSelect={() => setActiveTab(format.key)}
                  className="hover:bg-primary/10 cursor-pointer rounded px-2 py-1.5 text-sm text-primary"
                >
                  <div className="flex items-center gap-2">
                    <Icon />
                    <span>{format.label}</span>
                  </div>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Code preview + copy */}
        <CodePreviewInline
          ref={previewRef}
          code={code}
          formatKey={activeTab}
          copied={!!copiedStates[activeTab]}
          onCopy={() => copyToClipboard(code, activeTab as any)}
        />
      </div>

      {/* CSS for gradient animation */}
      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          25% { background-position: 100% 50%; }
          50% { background-position: 100% 100%; }
          75% { background-position: 0% 100%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </section>
  );
};
