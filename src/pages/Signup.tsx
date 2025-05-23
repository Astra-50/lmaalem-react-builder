
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';

const formSchema = z.object({
  email: z.string().email({ message: 'يرجى إدخال بريد إلكتروني صحيح' }),
  password: z.string().min(6, { message: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' }),
  confirmPassword: z.string(),
  role: z.enum(['client', 'handyman'], {
    required_error: 'يرجى اختيار دورك',
  }),
  termsAgreed: z.boolean().refine(val => val === true, {
    message: 'يجب الموافقة على الشروط والأحكام',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'كلمة المرور غير متطابقة',
  path: ['confirmPassword'],
});

type FormValues = z.infer<typeof formSchema>;

const Signup: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      role: 'client',
      termsAgreed: false,
    },
    mode: 'onChange'
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    
    try {
      // Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            role: data.role,
          }
        }
      });
      
      if (authError) throw authError;
      
      if (authData.user) {
        // Create or update user profile with selected role
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: authData.user.id,
            role: data.role,
          }, { onConflict: 'id' });
          
        if (profileError) throw profileError;
      }
      
      toast.success('تم إنشاء حسابك بنجاح!');
      toast.info('يرجى التحقق من بريدك الإلكتروني لتفعيل حسابك');
      navigate('/');
    } catch (error: any) {
      console.error('Error during signup:', error);
      
      let errorMessage = 'حدث خطأ أثناء إنشاء الحساب. يرجى المحاولة مرة أخرى.';
      
      if (error.message === 'User already registered') {
        errorMessage = 'البريد الإلكتروني مسجل بالفعل';
      } else if (error.message?.includes('weak-password')) {
        errorMessage = 'كلمة المرور ضعيفة جدًا. يرجى اختيار كلمة مرور أقوى';
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50" dir="rtl">
      <Navbar />
      
      <div className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-8">
          <h1 className="text-3xl font-bold text-center mb-6">إنشاء حساب جديد</h1>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-gray-700 font-bold mb-2">البريد الإلكتروني</label>
                <input
                  id="email"
                  type="email"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 arabic-input"
                  placeholder="أدخل بريدك الإلكتروني"
                  {...form.register('email')}
                />
                {form.formState.errors.email && <p className="text-red-500 text-sm mt-1">{form.formState.errors.email.message}</p>}
              </div>
              
              <div>
                <label htmlFor="password" className="block text-gray-700 font-bold mb-2">كلمة المرور</label>
                <input
                  id="password"
                  type="password"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 arabic-input"
                  placeholder="أدخل كلمة المرور"
                  {...form.register('password')}
                />
                {form.formState.errors.password && <p className="text-red-500 text-sm mt-1">{form.formState.errors.password.message}</p>}
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-gray-700 font-bold mb-2">تأكيد كلمة المرور</label>
                <input
                  id="confirmPassword"
                  type="password"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 arabic-input"
                  placeholder="أعد إدخال كلمة المرور"
                  {...form.register('confirmPassword')}
                />
                {form.formState.errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{form.formState.errors.confirmPassword.message}</p>}
              </div>

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="font-bold">اختر دورك</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-2"
                      >
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <RadioGroupItem value="client" id="client" />
                          <Label htmlFor="client" className="mr-2">أنا عميل</Label>
                        </div>
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <RadioGroupItem value="handyman" id="handyman" />
                          <Label htmlFor="handyman" className="mr-2">أنا معلم</Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex items-center">
                <input
                  id="termsAgreed"
                  type="checkbox"
                  className="ml-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  {...form.register('termsAgreed')}
                />
                <label htmlFor="termsAgreed" className="text-gray-700">
                  أوافق على <a href="#" className="text-blue-600 hover:underline">الشروط والأحكام</a>
                </label>
              </div>
              {form.formState.errors.termsAgreed && <p className="text-red-500 text-sm">{form.formState.errors.termsAgreed.message}</p>}
              
              <div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading || !form.formState.isValid}
                >
                  {isLoading ? 'جاري إنشاء الحساب...' : 'إنشاء حساب'}
                </button>
              </div>
            </form>
          </Form>
          
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
