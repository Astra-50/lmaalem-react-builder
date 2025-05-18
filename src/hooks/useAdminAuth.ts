
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { isUserAdmin } from '@/lib/supabase/admin';
import { toast } from '@/components/ui/sonner';

export function useAdminAuth() {
  const navigate = useNavigate();
  
  const { 
    data: isAdmin, 
    isLoading: isAdminLoading,
    error: adminError
  } = useQuery({
    queryKey: ['isAdmin'],
    queryFn: isUserAdmin,
    retry: 2,
    meta: {
      onError: (error: Error) => {
        console.error('Error checking admin status:', error);
        toast.error('حدث خطأ أثناء التحقق من صلاحياتك. يرجى المحاولة مرة أخرى لاحقًا.');
      }
    }
  });

  // Redirect non-admin users or on error
  useEffect(() => {
    if (!isAdminLoading) {
      if (adminError) {
        toast.error('حدث خطأ أثناء التحقق من صلاحياتك. يرجى المحاولة مرة أخرى.');
        navigate('/');
      } else if (isAdmin === false) {
        toast.error('ليس لديك صلاحية الوصول للوحة التحكم.');
        navigate('/');
      }
    }
  }, [isAdmin, isAdminLoading, adminError, navigate]);

  return { isAdmin, isAdminLoading, adminError };
}
