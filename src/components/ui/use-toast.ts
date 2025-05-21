
// Re-export the toast components from sonner
import { toast } from 'sonner';

export { toast };

// For backwards compatibility
export const useToast = () => {
  return { toast };
};
