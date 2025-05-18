
import React, { useState } from 'react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useAdminJobs } from '@/hooks/useAdminJobs';
import { useAdminUsers } from '@/hooks/useAdminUsers';
import AdminLoader from '@/components/admin/AdminLoader';
import AdminError from '@/components/admin/AdminError';
import AdminTabs from '@/components/admin/AdminTabs';
import DeleteJobDialog from '@/components/admin/DeleteJobDialog';

const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('jobs');
  const [jobToDelete, setJobToDelete] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // Check if user is admin
  const { isAdmin, isAdminLoading, adminError } = useAdminAuth();
  
  // Load jobs data and mutations
  const { jobs, jobsLoading, jobsError, refetchJobs, deleteJobMutation } = useAdminJobs(isAdmin);
  
  // Load users data and mutations
  const { 
    users, 
    usersLoading, 
    usersError, 
    refetchUsers, 
    updateBanStatusMutation, 
    updateRoleMutation 
  } = useAdminUsers(isAdmin);
  
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
    return <AdminLoader message="جاري التحقق من الصلاحيات..." />;
  }
  
  // Error handling for admin check
  if (adminError) {
    return (
      <AdminError 
        title="حدث خطأ" 
        message="لم نتمكن من التحقق من صلاحياتك. يرجى المحاولة مرة أخرى لاحقًا." 
      />
    );
  }
  
  if (isAdmin === false) {
    return null; // Will redirect in useEffect in useAdminAuth
  }
  
  return (
    <div className="container mx-auto py-8 px-4 text-right" dir="rtl">
      <h1 className="text-3xl font-bold mb-8">لوحة التحكم</h1>
      
      <AdminTabs 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        jobs={jobs}
        users={users}
        jobsLoading={jobsLoading}
        usersLoading={usersLoading}
        jobsError={jobsError}
        usersError={usersError}
        refetchJobs={refetchJobs}
        refetchUsers={refetchUsers}
        handleDeleteJob={handleDeleteJob}
        handleBanToggle={handleBanToggle}
        handleRoleChange={handleRoleChange}
        deleteJobMutation={deleteJobMutation}
        updateBanStatusMutation={updateBanStatusMutation}
        updateRoleMutation={updateRoleMutation}
        jobToDelete={jobToDelete}
      />
      
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
