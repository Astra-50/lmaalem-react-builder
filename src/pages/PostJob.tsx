
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { submitJob } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const formSchema = z.object({
  title: z.string().min(5, { message: 'العنوان يجب أن يكون 5 أحرف على الأقل' }),
  description: z.string().min(10, { message: 'الوصف يجب أن يكون 10 أحرف على الأقل' }),
  city: z.string().min(1, { message: 'يرجى اختيار المدينة' }),
  category: z.string().min(1, { message: 'يرجى اختيار الفئة' }),
  budget: z.string().refine(val => !isNaN(Number(val)) && Number(val) > 0, {
    message: 'يرجى إدخال مبلغ صحيح'
  })
});

type FormValues = z.infer<typeof formSchema>;

const PostJob: React.FC = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      city: '',
      category: '',
      budget: ''
    }
  });

  const cities = ['الدار البيضاء', 'الرباط', 'سلا', 'طنجة'];
  const categories = ['السباكة', 'الكهرباء', 'الدهان', 'النجارة', 'أعمال عامة'];

  const mutation = useMutation({
    mutationFn: (data: FormValues) => {
      return submitJob({
        title: data.title,
        description: data.description,
        city: data.city,
        category: data.category,
        budget: Number(data.budget)
      });
    },
    onSuccess: () => {
      toast.success('تم نشر المهمة بنجاح!');
      reset();
    },
    onError: (error) => {
      console.error('Error submitting job:', error);
      toast.error('حدث خطأ أثناء نشر المهمة. يرجى المحاولة مرة أخرى.');
    }
  });

  const onSubmit = (data: FormValues) => {
    mutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-8">
          <h1 className="text-3xl font-bold text-center mb-8">نشر مهمة جديدة</h1>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-gray-700 font-bold mb-2">عنوان المهمة</label>
              <input
                id="title"
                type="text"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 arabic-input"
                placeholder="مثال: تركيب حنفية في المطبخ"
                {...register('title')}
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
            </div>
            
            <div>
              <label htmlFor="description" className="block text-gray-700 font-bold mb-2">وصف المهمة</label>
              <textarea
                id="description"
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 arabic-input"
                placeholder="اشرح تفاصيل المهمة بدقة لتحصل على عروض مناسبة"
                {...register('description')}
              ></textarea>
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="city" className="block text-gray-700 font-bold mb-2">المدينة</label>
                <select
                  id="city"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 arabic-input"
                  {...register('city')}
                >
                  <option value="">اختر المدينة</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
                {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>}
              </div>
              
              <div>
                <label htmlFor="category" className="block text-gray-700 font-bold mb-2">نوع الخدمة</label>
                <select
                  id="category"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 arabic-input"
                  {...register('category')}
                >
                  <option value="">اختر نوع الخدمة</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
              </div>
            </div>
            
            <div>
              <label htmlFor="budget" className="block text-gray-700 font-bold mb-2">الميزانية التقريبية (بالدرهم)</label>
              <input
                id="budget"
                type="number"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 arabic-input"
                placeholder="أدخل الميزانية التقريبية"
                {...register('budget')}
              />
              {errors.budget && <p className="text-red-500 text-sm mt-1">{errors.budget.message}</p>}
            </div>
            
            <div className="text-center">
              <button
                type="submit"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition duration-300 font-bold"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? 'جاري النشر...' : 'نشر المهمة'}
              </button>
            </div>
          </form>
          
          {mutation.isError && (
            <div className="mt-6 bg-red-50 text-red-600 p-4 rounded-lg">
              حدث خطأ أثناء نشر المهمة. يرجى المحاولة مرة أخرى.
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PostJob;
