import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  isUserAdmin, 
  fetchAllJobs, 
  deleteJob, 
  fetchAllUsers, 
  updateUserBanStatus, 
  updateUserRole 
} from '@/lib/supabase/admin';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Loader } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import JobsTable from '@/components/admin/JobsTable';
import UsersTable from '@/components/admin/UsersTable';
import DeleteJobDialog from '@/components/admin/DeleteJobDialog';

const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('jobs');
  const [jobToDelete, setJobToDelete] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // Check if user is admin with better error handling
  const { 
    data: isAdmin, 
    isLoading: isAdminLoading,
    error: adminError
  } = useQuery(
    ['isAdmin'],
    isUserAdmin,
    {
      retry: 2, // Retry up to 2 times if the check fails
      onError: (error) => {
        console.error('Error checking admin status:', error);
        toast.error('حدث خطأ أثناء التحقق من صلاحياتك. يرجى المحاولة مرة أخرى لاحقًا.');
      }
    }
  );
  
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
  
  // Fetch jobs with better error handling
  const { 
    data: jobs,
    isLoading: jobsLoading,
    error: jobsError,
    refetch: refetchJobs
  } = useQuery(
    ['adminJobs'],
    fetchAllJobs,
    {
      enabled: !!isAdmin,
      onError: (error) => {
        console.error('Error fetching jobs:', error);
        toast.error('حدث خطأ أثناء تحميل المهام. يرجى المحاولة مرة أخرى.');
      }
    }
  );
  
  // Fetch users with better error handling
  const { 
    data: users,
    isLoading: usersLoading,
    error: usersError,
    refetch: refetchUsers
  } = useQuery(
    ['adminUsers'],
    fetchAllUsers,
    {
      enabled: !!isAdmin,
      onError: (error) => {
        console.error('Error fetching users:', error);
        toast.error('حدث خطأ أثناء تحميل المستخدمين. يرجى المحاولة مرة أخرى.');
      }
    }
  );
  
  // Delete job mutation
  const deleteJobMutation = useMutation({
    mutationFn: (jobId: string) => deleteJob(jobId),
    onSuccess: () => {
      setIsDeleteDialogOpen(false);
      setJobToDelete(null);
      toast.success('تم حذف المهمة بنجاح');
      refetchJobs();
      queryClient.invalidateQueries({ queryKey: ['adminJobs'] });
    },
    onError: (error) => {
      console.error('Error deleting job:', error);
      toast.error(`حدث خطأ أثناء حذف المهمة: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`);
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
  
  const handleDeleteJob = (jobId: string) => {
    setJobToDelete(jobId);
    setIsDeleteDialogOpen(true);
  };
  
  const confirmDeleteJob = () => {
    if (jobToDelete) {
      deleteJobMutation.mutate(jobToDelete);
    }
  };
  
  const handleBanToggle = (userId: string, currentBanStatus: boolean) => {
    updateBanStatusMutation.mutate({ 
      userId, 
      banned: !currentBanStatus 
    });
  };
  
  const handleRoleChange = (userId: string, newRole: string) => {
    updateRoleMutation.mutate({ userId, role: newRole });
  };
  
  // Improved loading state with message
  if (isAdminLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center" dir="rtl">
        <Loader className="h-10 w-10 animate-spin text-primary mb-4" />
        <p className="text-lg text-gray-600">جاري التحقق من الصلاحيات...</p>
      </div>
    );
  }
  
  // Error handling for admin check
  if (adminError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4" dir="rtl">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h2 className="text-xl font-semibold text-red-700 mb-2">حدث خطأ</h2>
          <p className="text-gray-700 mb-4">لم نتمكن من التحقق من صلاحياتك. يرجى المحاولة مرة أخرى لاحقًا.</p>
          <button 
            onClick={() => navigate('/')} 
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition-colors"
          >
            العودة للصفحة الرئيسية
          </button>
        </div>
      </div>
    );
  }
  
  if (isAdmin === false) {
    return null; // Will redirect in useEffect
  }
  
  return (
    <div className="container mx-auto py-8 px-4 text-right" dir="rtl">
      <h1 className="text-3xl font-bold mb-8">لوحة التحكم</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6 w-full justify-start">
          <TabsTrigger value="jobs">جميع المهام</TabsTrigger>
          <TabsTrigger value="users">جميع المستخدمين</TabsTrigger>
        </TabsList>
        
        {/* Jobs Tab */}
        <TabsContent value="jobs">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold mb-4">جميع المهام</h2>
            
            {jobsError ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <p className="text-red-700">حدث خطأ أثناء تحميل البيانات. يرجى المحاولة مرة أخرى.</p>
                <button 
                  onClick={() => refetchJobs()} 
                  className="mt-2 text-primary underline"
                >
                  إعادة المحاولة
                </button>
              </div>
            ) : (
              <JobsTable 
                jobs={jobs}
                isLoading={jobsLoading}
                onDeleteClick={handleDeleteJob}
                deleteJobMutation={deleteJobMutation}
                jobToDelete={jobToDelete}
              />
            )}
          </div>
        </TabsContent>
        
        {/* Users Tab */}
        <TabsContent value="users">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold mb-4">جميع المستخدمين</h2>
            
            {usersError ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <p className="text-red-700">حدث خطأ أثناء تحميل بيانات المستخدمين. يرجى المحاولة مرة أخرى.</p>
                <button 
                  onClick={() => refetchUsers()} 
                  className="mt-2 text-primary underline"
                >
                  إعادة المحاولة
                </button>
              </div>
            ) : (
              <UsersTable 
                users={users}
                isLoading={usersLoading}
                handleBanToggle={handleBanToggle}
                handleRoleChange={handleRoleChange}
                updateBanStatusMutation={updateBanStatusMutation}
                updateRoleMutation={updateRoleMutation}
              />
            )}
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Delete Confirmation Dialog */}
      <DeleteJobDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={confirmDeleteJob}
        isPending={deleteJobMutation.isPending}
      />
    </div>
  );
};

export default AdminPage;
