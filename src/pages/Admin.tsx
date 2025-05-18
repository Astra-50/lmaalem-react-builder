
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/sonner';
import { Loader, Trash2, UserX, Ban } from 'lucide-react';
import { Job, UserProfile } from '@/lib/supabase/types';

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
      refetchJobs(); // Explicitly refetch jobs
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
      refetchUsers(); // Explicitly refetch users
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
      refetchUsers(); // Explicitly refetch users
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
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-MA', { style: 'currency', currency: 'MAD' })
      .format(amount)
      .replace('MAD', 'درهم');
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
            
            {jobsLoading ? (
              <div className="flex justify-center py-10">
                <Loader className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : jobs && jobs.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>عنوان المهمة</TableHead>
                      <TableHead>المدينة</TableHead>
                      <TableHead>الميزانية</TableHead>
                      <TableHead>تاريخ النشر</TableHead>
                      <TableHead>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {jobs.map((job: Job) => (
                      <TableRow key={job.id}>
                        <TableCell className="font-medium">{job.title}</TableCell>
                        <TableCell>{job.city}</TableCell>
                        <TableCell>{formatCurrency(job.budget)}</TableCell>
                        <TableCell>
                          {new Date(job.created_at).toLocaleDateString('ar-MA')}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteJob(job.id)}
                            disabled={deleteJobMutation.isPending}
                          >
                            {deleteJobMutation.isPending && jobToDelete === job.id ? (
                              <Loader className="h-4 w-4 animate-spin ml-1" />
                            ) : (
                              <Trash2 className="h-4 w-4 ml-1" />
                            )}
                            حذف
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-10 text-gray-500">
                لا توجد مهام متاحة
              </div>
            )}
          </div>
        </TabsContent>
        
        {/* Users Tab */}
        <TabsContent value="users">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold mb-4">جميع المستخدمين</h2>
            
            {usersLoading ? (
              <div className="flex justify-center py-10">
                <Loader className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : users && users.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>الاسم</TableHead>
                      <TableHead>الدور</TableHead>
                      <TableHead>المدينة</TableHead>
                      <TableHead>التخصص</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user: UserProfile) => (
                      <TableRow key={user.id} className={user.banned ? "bg-red-50" : ""}>
                        <TableCell className="font-medium">
                          {user.full_name || "بدون اسم"}
                        </TableCell>
                        <TableCell>
                          <Select
                            defaultValue={user.role}
                            onValueChange={(value) => handleRoleChange(user.id, value)}
                            disabled={updateRoleMutation.isPending}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="client">عميل</SelectItem>
                              <SelectItem value="handyman">حرفي</SelectItem>
                              <SelectItem value="admin">مشرف</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>{user.city || "غير محدد"}</TableCell>
                        <TableCell>{user.category || "غير محدد"}</TableCell>
                        <TableCell>
                          {user.banned ? (
                            <Badge variant="destructive">محظور</Badge>
                          ) : (
                            <Badge variant="outline">نشط</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant={user.banned ? "default" : "destructive"}
                            size="sm"
                            onClick={() => handleBanToggle(user.id, !!user.banned)}
                            disabled={updateBanStatusMutation.isPending}
                          >
                            {updateBanStatusMutation.isPending ? (
                              <Loader className="h-4 w-4 ml-1" />
                            ) : user.banned ? (
                              <UserX className="h-4 w-4 ml-1" />
                            ) : (
                              <Ban className="h-4 w-4 ml-1" />
                            )}
                            {user.banned ? 'إلغاء الحظر' : 'حظر'}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-10 text-gray-500">
                لا يوجد مستخدمون
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تأكيد الحذف</DialogTitle>
            <DialogDescription>
              هل أنت متأكد من أنك تريد حذف هذه المهمة؟ هذا الإجراء لا يمكن التراجع عنه.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={deleteJobMutation.isPending}
            >
              إلغاء
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDeleteJob} 
              disabled={deleteJobMutation.isPending}
            >
              {deleteJobMutation.isPending ? (
                <Loader className="h-4 w-4 animate-spin ml-1" />
              ) : (
                'تأكيد الحذف'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPage;
