import { Download } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from "@/shared/ui/dropdown-menu";
import { imageExportUtils, imageFormats } from "@/features/gradients/utils/imageExportUtils";
import { useState } from "react";
import { toast } from "sonner";

interface DownloadOptionsDropdownProps {
  colors: string[];
  angle: number;
  name?: string;
  isAnimated?: boolean;
  animationSpeed?: number;
  shape?: string;
  customCss?: string;
  trigger: React.ReactNode;
}

export const DownloadOptionsDropdown = ({
  colors,
  angle,
  name = "gradient",
  isAnimated = false,
  animationSpeed = 1,
  shape = "linear",
  customCss,
  trigger
}: DownloadOptionsDropdownProps) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async (format: string, size: typeof imageExportUtils.imageSizes[0]) => {
    if (isDownloading) return;

    setIsDownloading(true);
    const toastId = toast.loading("Preparing your download...");

    try {
      const options = {
        colors,
        angle,
        width: size.width,
        height: size.height,
        isAnimated,
        animationSpeed,
        shape,
        customCss,
      };

      const formatConfig = imageFormats.find((f) => f.value === format);
      const filename = `${name.toLowerCase().replace(/\s+/g, "-")}-${size.width}x${size.height}.${formatConfig?.extension || "png"}`;

      await imageExportUtils.downloadImage(options, format, filename);
      toast.success("Downloaded successfully!", { id: toastId });
    } catch (error) {
      console.error("Failed to download image:", error);
      toast.error("Download failed. Please try again.", { id: toastId });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {trigger}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-zinc-950 border-white/10 text-white backdrop-blur-xl">
        <DropdownMenuLabel>Export Options</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-white/10" />
        
        {imageFormats.map((format) => (
          <DropdownMenuSub key={format.value}>
            <DropdownMenuSubTrigger className="flex items-center justify-between cursor-pointer hover:bg-white/10">
              <div className="flex items-center gap-2">
                <Download className="h-4 w-4 text-white/60" />
                <span>{format.label}</span>
              </div>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent className="bg-zinc-950 border-white/10 text-white backdrop-blur-xl">
                {imageExportUtils.imageSizes.map((size) => (
                  <DropdownMenuItem
                    key={`${format.value}-${size.label}`}
                    className="cursor-pointer hover:bg-white/10"
                    onSelect={() => handleDownload(format.value, size)}
                  >
                    {size.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
