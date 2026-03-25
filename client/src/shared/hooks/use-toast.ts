import { toast as sonnerToast } from "sonner";

interface ToastProps {
  title?: string;
  description?: string;
  variant?: "default" | "destructive" | "success";
  [key: string]: any;
}

function toast({ title, description, variant }: ToastProps) {
  // Use sonnerToast hooks for better experience

  if (variant === "destructive") {
    return sonnerToast.error(title || "Error", { description });
  } else if (variant === "success") {
    return sonnerToast.success(title || "Success", { description });
  } else {
    return sonnerToast(title || "Notification", { description });
  }
}

function useToast() {
  return {
    toast,
    dismiss: (id?: string) => {
      sonnerToast.dismiss(id);
    },
    toasts: [], // For compatibility
  };
}

export { useToast, toast };
