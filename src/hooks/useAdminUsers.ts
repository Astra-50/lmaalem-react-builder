
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchAllUsers, updateUserBanStatus, updateUserRole } from '@/lib/supabase/admin';
import { toast } from '@/components/ui/sonner';

export function useAdminUsers(isAdmin: boolean | undefined) {
  const queryClient = useQueryClient();

  // Fetch users with better error handling
  const { 
    data: users,
    isLoading: usersLoading,
    error: usersError,
    refetch: refetchUsers
  } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: fetchAllUsers,
    enabled: !!isAdmin,
    meta: {
      onError: (error: Error) => {
        console.error('Error fetching users:', error);
        toast.error('حدث خطأ أثناء تحميل المستخدمين. يرجى المحاولة مرة أخرى.');
      }
    }
  });
  
  // Ban/unban user mutation
  const updateBanStatusMutation = useMutation({
    mutationFn: ({ userId, banned }: { userId: string; banned: boolean }) => 
      updateUserBanStatus(userId, banned),
    onSuccess: () => {
      toast.success('تم تحديث حالة المستخدم بنجاح');
      refetchUsers();
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
    },
    onError: (error) => {
      console.error('Error updating ban status:', error);
      toast.error(`حدث خطأ أثناء تحديث حالة المستخدم: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`);
    }
  });
  
  // Update user role mutation
  const updateRoleMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: string }) => 
      updateUserRole(userId, role),
    onSuccess: () => {
      toast.success('تم تحديث دور المستخدم بنجاح');
      refetchUsers();
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
    },
    onError: (error) => {
      console.error('Error updating role:', error);
      toast.error(`حدث خطأ أثناء تحديث دور المستخدم: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`);
    }
  });

  return { 
    users, 
    usersLoading, 
    usersError, 
    refetchUsers, 
    updateBanStatusMutation, 
    updateRoleMutation 
  };
}
