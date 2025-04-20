import { toast as sonnerToast, Toaster } from 'sonner';

export const toast = sonnerToast;

export function useToast() {
  return {
    showToast: (message: string, type: 'success' | 'error' | 'warning' | 'info') => {
      switch (type) {
        case 'success':
          sonnerToast.success(message);
          break;
        case 'error':
          sonnerToast.error(message);
          break;
        case 'warning':
          sonnerToast.warning(message);
          break;
        case 'info':
          sonnerToast.info(message);
          break;
      }
    },
    toast: sonnerToast,
  };
}

export { Toaster }; 