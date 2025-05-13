
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const formSchema = z.object({
  name: z.string().min(3, { message: 'الاسم يجب أن يكون 3 أحرف على الأقل' }),
  email: z.string().email({ message: 'يرجى إدخال بريد إلكتروني صحيح' }),
  phone: z.string().min(10, { message: 'يرجى إدخال رقم هاتف صحيح' }),
  password: z.string().min(6, { message: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' }),
  confirmPassword: z.string(),
  accountType: z.enum(['client', 'professional']),
  termsAgreed: z.literal(true, {
    errorMap: () => ({ message: 'يجب الموافقة على الشروط والأحكام' }),
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'كلمة المرور غير متطابقة',
  path: ['confirmPassword'],
});

type FormValues = z.infer<typeof formSchema>;

const Signup: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors }, watch } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      accountType: 'client',
      termsAgreed: false,
    }
  });

  const accountType = watch('accountType');

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    
    try {
      // Simulate signup delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, we'll just show a success toast
      console.log('Signup data:', data);
      toast.success('تم إنشاء حسابك بنجاح!');
      
      // In a real implementation, you would handle registration with Supabase here
    } catch (error) {
      console.error('Error during signup:', error);
      toast.error('حدث خطأ أثناء إنشاء الحساب. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-8">
          <h1 className="text-3xl font-bold text-center mb-6">إنشاء حساب جديد</h1>
          
          <div className="mb-6">
            <div className="flex rounded-lg overflow-hidden border border-gray-300">
              <button
                type="button"
                className={`flex-1 py-3 px-4 text-center ${accountType === 'client' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
                onClick={() => {
                  const element = document.getElementById('accountType-client') as HTMLInputElement;
                  if (element) element.checked = true;
                }}
              >
                عميل
              </button>
              <button
                type="button"
                className={`flex-1 py-3 px-4 text-center ${accountType === 'professional' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
                onClick={() => {
                  const element = document.getElementById('accountType-professional') as HTMLInputElement;
                  if (element) element.checked = true;
                }}
              >
                محترف
              </button>
            </div>
            <div className="hidden">
              <input
                type="radio"
                id="accountType-client"
                value="client"
                {...register('accountType')}
              />
              <input
                type="radio"
                id="accountType-professional"
                value="professional"
                {...register('accountType')}
              />
            </div>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-gray-700 font-bold mb-2">الاسم الكامل</label>
              <input
                id="name"
                type="text"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 arabic-input"
                placeholder="أدخل اسمك الكامل"
                {...register('name')}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
            </div>
            
            <div>
              <label htmlFor="email" className="block text-gray-700 font-bold mb-2">البريد الإلكتروني</label>
              <input
                id="email"
                type="email"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 arabic-input"
                placeholder="أدخل بريدك الإلكتروني"
                {...register('email')}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-gray-700 font-bold mb-2">رقم الهاتف</label>
              <input
                id="phone"
                type="tel"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 arabic-input"
                placeholder="أدخل رقم هاتفك"
                {...register('phone')}
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
            </div>
            
            <div>
              <label htmlFor="password" className="block text-gray-700 font-bold mb-2">كلمة المرور</label>
              <input
                id="password"
                type="password"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 arabic-input"
                placeholder="أدخل كلمة المرور"
                {...register('password')}
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-gray-700 font-bold mb-2">تأكيد كلمة المرور</label>
              <input
                id="confirmPassword"
                type="password"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 arabic-input"
                placeholder="أعد إدخال كلمة المرور"
                {...register('confirmPassword')}
              />
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
            </div>
            
            <div className="flex items-center">
              <input
                id="termsAgreed"
                type="checkbox"
                className="ml-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                {...register('termsAgreed')}
              />
              <label htmlFor="termsAgreed" className="text-gray-700">
                أوافق على <a href="#" className="text-blue-600 hover:underline">الشروط والأحكام</a>
              </label>
            </div>
            {errors.termsAgreed && <p className="text-red-500 text-sm">{errors.termsAgreed.message}</p>}
            
            <div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300 font-bold"
                disabled={isLoading}
              >
                {isLoading ? 'جاري إنشاء الحساب...' : 'إنشاء حساب'}
              </button>
            </div>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              لديك حساب بالفعل؟{' '}
              <Link to="/login" className="text-blue-600 hover:underline">تسجيل الدخول</Link>
            </p>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Signup;
