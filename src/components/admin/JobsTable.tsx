
import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteJob } from '@/lib/supabase/admin';
import { Job } from '@/lib/supabase/types';
import { Loader, Trash2 } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface JobsTableProps {
  jobs: Job[] | undefined;
  isLoading: boolean;
  onDeleteClick: (jobId: string) => void;
  deleteJobMutation: any;
  jobToDelete: string | null;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('ar-MA', { style: 'currency', currency: 'MAD' })
    .format(amount)
    .replace('MAD', 'درهم');
};

const JobsTable: React.FC<JobsTableProps> = ({ 
  jobs, 
  isLoading, 
  onDeleteClick,
  deleteJobMutation,
  jobToDelete
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <Loader className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!jobs || jobs.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        لا توجد مهام متاحة
      </div>
    );
  }

  return (
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
                  onClick={() => onDeleteClick(job.id)}
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
  );
};

export default JobsTable;
