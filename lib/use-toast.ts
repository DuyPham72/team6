import { toast as sonnerToast } from "sonner";

type ToastProps = {
  title?: string;
  description?: string;
  variant?: "default" | "destructive" | "success" | "warning" | "info";
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
};

export function toast({
  title,
  description,
  variant = "default",
  duration = 5000,
  action,
}: ToastProps) {
  const options: Record<string, any> = {
    duration,
    className: variant === "destructive" ? "bg-destructive text-destructive-foreground" : "",
  };

  if (action) {
    options.action = {
      label: action.label,
      onClick: action.onClick,
    };
  }

  const toastMethod = variant === "destructive"
    ? sonnerToast.error
    : variant === "success"
    ? sonnerToast.success
    : variant === "warning"
    ? sonnerToast.warning
    : variant === "info"
    ? sonnerToast.info
    : sonnerToast;

  return toastMethod(title, {
    description,
    ...options,
  });
}

export const useToast = () => {
  return {
    toast,
    dismiss: sonnerToast.dismiss,
  };
};
