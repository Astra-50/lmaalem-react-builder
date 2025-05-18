
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
  
  // Check if user is admin
  const { data: isAdmin, isLoading: isAdminLoading } = useQuery({
    queryKey: ['isAdmin'],
    queryFn: isUserAdmin
  });
  
  // Redirect non-admin users
  useEffect(() => {
    if (!isAdminLoading && isAdmin === false) {
      toast.error('ليس لديك صلاحية الوصول');
      navigate('/');
    }
  }, [isAdmin, isAdminLoading, navigate]);
  
  // Fetch jobs
  const { 
    data: jobs,
    isLoading: jobsLoading,
    refetch: refetchJobs
  } = useQuery({
    queryKey: ['adminJobs'],
    queryFn: fetchAllJobs,
    enabled: !!isAdmin,
  });
  
  // Fetch users
  const { 
    data: users,
    isLoading: usersLoading,
    refetch: refetchUsers
  } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: fetchAllUsers,
    enabled: !!isAdmin,
  });
  
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
  
  if (isAdminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="h-10 w-10 animate-spin text-primary" />
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
            <JobsTable 
              jobs={jobs}
              isLoading={jobsLoading}
              onDeleteClick={handleDeleteJob}
              deleteJobMutation={deleteJobMutation}
              jobToDelete={jobToDelete}
            />
          </div>
        </TabsContent>
        
        {/* Users Tab */}
        <TabsContent value="users">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold mb-4">جميع المستخدمين</h2>
            <UsersTable 
              users={users}
              isLoading={usersLoading}
              handleBanToggle={handleBanToggle}
              handleRoleChange={handleRoleChange}
              updateBanStatusMutation={updateBanStatusMutation}
              updateRoleMutation={updateRoleMutation}
            />
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
