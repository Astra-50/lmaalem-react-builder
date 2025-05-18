
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchAllJobs, deleteJob } from '@/lib/supabase/admin';
import { toast } from '@/components/ui/sonner';

export function useAdminJobs(isAdmin: boolean | undefined) {
  const queryClient = useQueryClient();

  // Fetch jobs with better error handling
  const { 
    data: jobs,
    isLoading: jobsLoading,
    error: jobsError,
    refetch: refetchJobs
  } = useQuery({
    queryKey: ['adminJobs'],
    queryFn: fetchAllJobs,
    enabled: !!isAdmin,
    meta: {
      onError: (error: Error) => {
        console.error('Error fetching jobs:', error);
        toast.error('حدث خطأ أثناء تحميل المهام. يرجى المحاولة مرة أخرى.');
      }
    }
  });
  
  // Delete job mutation
  const deleteJobMutation = useMutation({
    mutationFn: (jobId: string) => deleteJob(jobId),
    onSuccess: () => {
      toast.success('تم حذف المهمة بنجاح');
      refetchJobs();
      queryClient.invalidateQueries({ queryKey: ['adminJobs'] });
    },
    onError: (error) => {
      console.error('Error deleting job:', error);
      toast.error(`حدث خطأ أثناء حذف المهمة: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`);
    }
  });

  return { jobs, jobsLoading, jobsError, refetchJobs, deleteJobMutation };
}
