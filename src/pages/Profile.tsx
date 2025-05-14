
import React, { useState, useEffect } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "@/components/ui/sonner";
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import Navbar from '@/components/Navbar';

// Form validation schema
const profileSchema = z.object({
  full_name: z.string().min(2, { message: "الإسم يجب أن يكون على الأقل حرفين" }),
  phone_number: z.string().optional(),
  city: z.string().optional(),
  category: z.string().optional(),
  bio: z.string().optional(),
});

// Categories for dropdown
const categories = [
  { value: "", label: "اختر التخصص" },
  { value: "سباكة", label: "سباكة" },
  { value: "كهرباء", label: "كهرباء" },
  { value: "نجارة", label: "نجارة" },
  { value: "دهان", label: "دهان" },
  { value: "تكييف", label: "تكييف" },
  { value: "بناء", label: "بناء" },
  { value: "أخرى", label: "أخرى" }
];

// Cities for dropdown
const cities = [
  { value: "", label: "اختر المدينة" },
  { value: "الدار البيضاء", label: "الدار البيضاء" },
  { value: "الرباط", label: "الرباط" },
  { value: "فاس", label: "فاس" },
  { value: "طنجة", label: "طنجة" },
  { value: "مراكش", label: "مراكش" },
  { value: "أكادير", label: "أكادير" }
];

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: "",
      phone_number: "",
      city: "",
      category: "",
      bio: "",
    },
  });

  // Check authentication and fetch user data
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          navigate('/login');
          return;
        }
        
        setUserId(user.id);
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
          toast("خطأ", {
            description: "حدث خطأ أثناء تحميل البيانات. يرجى المحاولة مرة أخرى"
          });
          return;
        }

        if (data) {
          form.reset({
            full_name: data.full_name || "",
            phone_number: data.phone_number || "",
            city: data.city || "",
            category: data.category || "",
            bio: data.bio || "",
          });

          if (data.avatar_url) {
            setAvatarUrl(data.avatar_url);
          }
        }
      } catch (error) {
        console.error('Error:', error);
        toast("خطأ", {
          description: "حدث خطأ في النظام. يرجى المحاولة مرة أخرى"
        });
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0 || !userId) {
        return;
      }

      setUploading(true);
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${userId}/${uuidv4()}.${fileExt}`;

      const { data, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL for the uploaded file
      const { data: publicURL } = supabase.storage.from('avatars').getPublicUrl(filePath);
      
      if (publicURL) {
        setAvatarUrl(publicURL.publicUrl);

        // Update avatar_url in profiles table
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ avatar_url: publicURL.publicUrl })
          .eq('id', userId);

        if (updateError) throw updateError;

        toast("تم التحديث", {
          description: "تم تحديث صورة الملف الشخصي بنجاح"
        });
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast("خطأ", {
        description: "حدث خطأ أثناء رفع الصورة. يرجى المحاولة مرة أخرى"
      });
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data: z.infer<typeof profileSchema>) => {
    try {
      setLoading(true);
      
      if (!userId) return;

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: data.full_name,
          phone_number: data.phone_number,
          city: data.city,
          category: data.category,
          bio: data.bio,
        })
        .eq('id', userId);

      if (error) throw error;

      toast("تم التحديث", {
        description: "تم تحديث بيانات الملف الشخصي بنجاح"
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast("خطأ", {
        description: "حدث خطأ أثناء تحديث البيانات. يرجى المحاولة مرة أخرى"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <p className="text-xl text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 rtl">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-800 mb-2">الملف الشخصي</CardTitle>
            <CardDescription>تعديل المعلومات الشخصية</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center mb-8">
              <div className="relative">
                <Avatar className="h-24 w-24 border-2 border-blue-500">
                  {avatarUrl ? (
                    <AvatarImage src={avatarUrl} alt="صورة الملف الشخصي" />
                  ) : (
                    <AvatarFallback className="bg-blue-100 text-blue-800 text-xl">
                      {form.getValues().full_name?.charAt(0) || "U"}
                    </AvatarFallback>
                  )}
                </Avatar>
                <label 
                  htmlFor="avatar-upload" 
                  className="absolute -bottom-2 -left-2 bg-blue-500 text-white p-1 rounded-full cursor-pointer hover:bg-blue-600 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                </label>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarUpload}
                  disabled={uploading}
                />
              </div>
              {uploading && <p className="text-sm text-gray-500 mt-2">جاري الرفع...</p>}
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="full_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">الإسم بالكامل</FormLabel>
                      <FormControl>
                        <Input placeholder="أدخل الإسم الكامل" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">رقم الهاتف</FormLabel>
                      <FormControl>
                        <Input placeholder="أدخل رقم الهاتف" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">المدينة</FormLabel>
                        <FormControl>
                          <select
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            {...field}
                          >
                            {cities.map(city => (
                              <option key={city.value} value={city.value}>{city.label}</option>
                            ))}
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">التخصص</FormLabel>
                        <FormControl>
                          <select
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            {...field}
                          >
                            {categories.map(category => (
                              <option key={category.value} value={category.value}>{category.label}</option>
                            ))}
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">نبذة تعريفية</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="أدخل نبذة تعريفية عنك ومهاراتك المهنية" 
                          className="min-h-[120px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-center">
                  <Button 
                    type="submit" 
                    className="w-full md:w-auto px-8"
                    disabled={loading}
                  >
                    {loading ? "جاري الحفظ..." : "حفظ التغييرات"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
