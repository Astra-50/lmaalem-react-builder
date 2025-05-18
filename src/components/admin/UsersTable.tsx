
import React from 'react';
import { useMutation } from '@tanstack/react-query';
import { UserProfile } from '@/lib/supabase/types';
import { Loader, UserX, Ban } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UsersTableProps {
  users: UserProfile[] | undefined;
  isLoading: boolean;
  handleBanToggle: (userId: string, currentBanStatus: boolean) => void;
  handleRoleChange: (userId: string, newRole: string) => void;
  updateBanStatusMutation: any;
  updateRoleMutation: any;
}

const UsersTable: React.FC<UsersTableProps> = ({
  users,
  isLoading,
  handleBanToggle,
  handleRoleChange,
  updateBanStatusMutation,
  updateRoleMutation
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <Loader className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!users || users.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        لا يوجد مستخدمون
      </div>
    );
  }

  return (
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
  );
};

export default UsersTable;
