import { useCallback } from "react";
import { toast } from "sonner";

export const useCustomToast = () => {
  const showToast = useCallback((title: string, description: string) => {
    toast(title, { description });
  }, []);

  return { showToast };
};
