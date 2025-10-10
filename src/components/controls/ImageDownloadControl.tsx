import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { imageExportUtils, imageFormats, type ImageExportOptions } from "@/utils/imageExportUtils";
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

      const formatConfig = imageFormats.find(f => f.value === selectedFormat);
      const filename = `gradient-${Date.now()}.${formatConfig?.extension || 'png'}`;

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
          className={`space-y-3 flex flex-col items-center justify-center w-full ${className}`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {/* Image format selector */}
          <div className="space-y-2  w-full">
            <Select value={selectedFormat} onValueChange={setSelectedFormat}>
              <SelectTrigger className="w-full bg-secondary border-white/20 text-white">
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent className="bg-secondary border-white/20">
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
            className="flex items-center justify-center gap-2 w-full px-4 py-3 text-sm rounded-md bg-blue-500 hover:bg-blue-600 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            onClick={handleDownload}
            disabled={isDownloading}
            whileHover={!isDownloading ? { scale: 1.02 } : {}}
            whileTap={!isDownloading ? { scale: 0.98 } : {}}
          >
            <Download className="h-4 w-4" />
            {isDownloading ? "Downloading..." : `Download ${selectedFormat.toUpperCase()}`}
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
