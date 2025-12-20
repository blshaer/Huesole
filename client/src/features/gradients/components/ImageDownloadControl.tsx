import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import {
  imageExportUtils,
  imageFormats,
  type ImageExportOptions,
} from "@/features/gradients/utils/imageExportUtils";
import { AnimatePresence, motion } from "framer-motion";
import { Download } from "lucide-react";
import { useState } from "react";

interface ImageDownloadControlProps {
  colors: string[];
  angle: number;
  isAnimated: boolean;
  animationSpeed: number;
  visible?: boolean;
  className?: string;
}

export const ImageDownloadControl: React.FC<ImageDownloadControlProps> = ({
  colors,
  angle,
  isAnimated,
  animationSpeed,
  visible = true,
  className = "",
}) => {
  const [selectedFormat, setSelectedFormat] = useState("png");
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (isDownloading) return;

    setIsDownloading(true);
    try {
      const options: ImageExportOptions = {
        colors,
        angle,
        width: 512,
        height: 512,
        isAnimated,
        animationSpeed,
      };

      const formatConfig = imageFormats.find((f) => f.value === selectedFormat);
      const filename = `gradient-${Date.now()}.${formatConfig?.extension || "png"}`;

      await imageExportUtils.downloadImage(options, selectedFormat, filename);
    } catch (error) {
      console.error("Failed to download image:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className={`flex w-full flex-col items-center justify-center space-y-3 ${className}`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {/* Image format selector */}
          <div className="w-full space-y-2">
            <Select value={selectedFormat} onValueChange={setSelectedFormat}>
              <SelectTrigger className="w-full border-white/20 bg-secondary text-white">
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent className="border-white/20 bg-secondary">
                {imageFormats.map((format) => (
                  <SelectItem
                    key={format.value}
                    value={format.value}
                    className="text-white hover:bg-white/10 focus:bg-white/10"
                  >
                    {format.label} (.{format.extension})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Download button */}
          <motion.button
            className="flex w-full items-center justify-center gap-2 rounded-md bg-blue-500 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
            onClick={handleDownload}
            disabled={isDownloading}
            whileHover={!isDownloading ? { scale: 1.02 } : {}}
            whileTap={!isDownloading ? { scale: 0.98 } : {}}
          >
            <Download className="h-4 w-4" />
            {isDownloading
              ? "Downloading..."
              : `Download ${selectedFormat.toUpperCase()}`}
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
