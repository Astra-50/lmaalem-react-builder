
// Re-export the toast function from sonner
import { toast } from 'sonner';

export { toast };

// For backwards compatibility
export const useToast = () => {
  return { toast };
};
