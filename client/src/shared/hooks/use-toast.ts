import { sileo } from "sileo";

interface ToastProps {
  title?: string;
  description?: string;
  variant?: "default" | "destructive" | "success";
  [key: string]: any;
}

function toast({ title, description, variant }: ToastProps) {
  const options = { title: title || "Notification", description };

  if (variant === "destructive") {
    return sileo.error(options);
  } else if (variant === "success") {
    return sileo.success(options);
  } else {
    return sileo.show(options);
  }
}

function useToast() {
  return {
    toast,
    dismiss: () => {
      // Sileo might not have a global dismiss, but we can't easily implement it here 
      // without more info. Usually toasts auto-dismiss.
    },
    toasts: [], // For compatibility with existing Toaster component if still present
  };
}

export { useToast, toast };

