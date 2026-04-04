import { Turnstile, TurnstileInstance } from "@marsidev/react-turnstile";
import { forwardRef } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { ShieldCheck } from "lucide-react";

interface TurnstileWidgetProps {
  onSuccess?: (token: string) => void;
  onExpire?: () => void;
  onError?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/**
 * Cloudflare Turnstile widget for human verification.
 * Uses site key from VITE_TURNSTILE_SITE_KEY environment variable.
 */
export const TurnstileWidget = forwardRef<TurnstileInstance, TurnstileWidgetProps>(
  ({ onSuccess, onExpire, onError, open = false, onOpenChange }, ref) => {
    // Falls back to Cloudflare's "Always Pass" site key for development if no env variable is set
    const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY || "1x00000000000000000000AA";

    const handleSuccess = (token: string) => {
      toast.success("Verification successful", {
        description: "Human status confirmed.",
        icon: <ShieldCheck className="size-4 text-emerald-500" />,
      });
      
      if (onSuccess) onSuccess(token);
      if (onOpenChange) onOpenChange(false);
    };

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[400px] bg-neutral-900 border-white/10 text-white backdrop-blur-2xl shadow-2xl rounded-3xl p-8">
          <DialogHeader className="items-center text-center space-y-3">
             <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-2">
                <ShieldCheck className="size-6 text-primary" />
             </div>
            <DialogTitle className="text-2xl font-bold">Human Verification</DialogTitle>
            <DialogDescription className="text-white/50 text-sm max-w-[280px]">
              To protect the community, please complete this quick check to confirm you are human.
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-center py-6 min-h-[100px]">
            <Turnstile
              ref={ref}
              siteKey={siteKey}
              onSuccess={handleSuccess}
              onExpire={() => {
                 if (onExpire) onExpire();
              }}
              onError={() => {
                 toast.error("Verification error", { description: "Please refresh and try again." });
                 if (onError) onError();
              }}
              options={{
                theme: "dark",
                size: "normal",
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
    );
  }
);

TurnstileWidget.displayName = "TurnstileWidget";
