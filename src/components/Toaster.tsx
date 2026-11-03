import { AlertCircle, Check } from "lucide-react";
import { toast, Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const CONFIRM_MS = 2200;
const PROBLEM_MS = 3400;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      offset={{ top: "24px", right: "24px", bottom: "24px", left: "24px" }}
      gap={10}
      duration={CONFIRM_MS}
      visibleToasts={3}
      icons={{
        success: <Check strokeWidth={2.5} />,
        error: <AlertCircle strokeWidth={2} />,
      }}
      toastOptions={{
        classNames: {
          toast: "huesole-toast",
          title: "huesole-toast-title",
          description: "huesole-toast-detail",
        },
      }}
      {...props}
    />
  );
};

function toastCopied(title: string, detail?: string) {
  toast.success(title, {
    description: detail,
    duration: CONFIRM_MS,
  });
}

function toastColorCopied(value: string) {
  toast.success("Color copied", {
    description: value.trim().toUpperCase(),
    duration: CONFIRM_MS,
    descriptionClassName: "huesole-toast-value",
  });
}

function toastProblem(message: string) {
  toast.error(message, { duration: PROBLEM_MS });
}

export { Toaster, toastCopied, toastColorCopied, toastProblem };
