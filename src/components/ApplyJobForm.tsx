
import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { submitApplication } from '@/lib/supabase';

const formSchema = z.object({
  message: z.string().min(10, { message: 'الرسالة يجب أن تكون 10 أحرف على الأقل' }),
  proposed_budget: z.coerce.number().positive({ message: 'يجب أن تكون الميزانية قيمة موجبة' }),
});

type FormValues = z.infer<typeof formSchema>;

interface ApplyJobFormProps {
  jobId: string;
}

const ApplyJobForm: React.FC<ApplyJobFormProps> = ({ jobId }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: '',
      proposed_budget: 0,
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      const result = await submitApplication({
        job_id: jobId,
        message: data.message,
        proposed_budget: data.proposed_budget,
      });
      
      if (result.error) {
        throw result.error;
      }
      
      toast.success('تم تقديم عرضك بنجاح');
      form.reset();
      setIsOpen(false);
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error('حدث خطأ أثناء تقديم العرض. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg w-full md:w-auto transition">
          <i className="fas fa-paper-plane ml-2"></i>
          قدم عرضك
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] text-right" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">تقديم عرض</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="proposed_budget"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">الميزانية المقترحة (درهم)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="أدخل الميزانية المقترحة" 
                      {...field}
                      className="text-right"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">رسالة إلى العميل</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="اكتب رسالتك هنا" 
                      className="min-h-32 text-right" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end pt-4">
              <Button 
                type="submit" 
                className="bg-blue-600 hover:bg-blue-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'جاري الإرسال...' : 'إرسال العرض'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ApplyJobForm;
