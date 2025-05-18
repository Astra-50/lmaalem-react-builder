
import React from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import JobsTable from '@/components/admin/JobsTable';
import UsersTable from '@/components/admin/UsersTable';
import { Job, UserProfile } from '@/lib/supabase/types';

interface AdminTabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  jobs: Job[] | undefined;
  users: UserProfile[] | undefined;
  jobsLoading: boolean;
  usersLoading: boolean;
  jobsError: Error | null;
  usersError: Error | null;
  refetchJobs: () => void;
  refetchUsers: () => void;
  handleDeleteJob: (jobId: string) => void;
  handleBanToggle: (userId: string, currentBanStatus: boolean) => void;
  handleRoleChange: (userId: string, newRole: string) => void;
  deleteJobMutation: any;
  updateBanStatusMutation: any;
  updateRoleMutation: any;
  jobToDelete: string | null;
}

const AdminTabs: React.FC<AdminTabsProps> = ({
  activeTab,
  setActiveTab,
  jobs,
  users,
  jobsLoading,
  usersLoading,
  jobsError,
  usersError,
  refetchJobs,
  refetchUsers,
  handleDeleteJob,
  handleBanToggle,
  handleRoleChange,
  deleteJobMutation,
  updateBanStatusMutation,
  updateRoleMutation,
  jobToDelete
}) => {
  return (
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
              jobs={jobs || []}
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
              users={users || []}
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
  );
};

export default AdminTabs;
