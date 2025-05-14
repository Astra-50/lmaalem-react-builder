
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Navbar from '@/components/Navbar';

interface HandymanProfile {
  id: string;
  full_name: string;
  category: string;
  city: string;
  bio: string;
  avatar_url: string;
  rating: number;
  completed_jobs: number;
  phone_number: string;
}

const HandymanProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [profile, setProfile] = useState<HandymanProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHandymanProfile = async () => {
      try {
        if (!id) return;

        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          console.error('Error fetching handyman profile:', error);
          setError('حدث خطأ أثناء تحميل بيانات المعلم. يرجى المحاولة مرة أخرى');
          return;
        }

        setProfile(data as HandymanProfile);
      } catch (error) {
        console.error('Error:', error);
        setError('حدث خطأ في النظام. يرجى المحاولة مرة أخرى');
      } finally {
        setLoading(false);
      }
    };

    fetchHandymanProfile();
  }, [id]);

  const handleContactClick = () => {
    toast({
      title: "قريبا!",
      description: "سيتم تفعيل خاصية التواصل مع المعلمين قريباً",
    });
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

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
          <h1 className="text-2xl font-bold text-red-600 mb-4">خطأ</h1>
          <p className="text-xl text-gray-600 mb-6">{error || 'لم يتم العثور على المعلم'}</p>
          <Link to="/jobs" className="text-blue-600 hover:underline">
            العودة إلى صفحة المهام
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 rtl">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
          {/* Cover Image (Placeholder) */}
          <div className="h-48 bg-gradient-to-r from-blue-500 to-blue-700 relative"></div>
          
          {/* Profile Info Section */}
          <div className="relative px-6 py-10">
            {/* Avatar */}
            <div className="absolute -top-16 right-6">
              <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
                {profile.avatar_url ? (
                  <AvatarImage src={profile.avatar_url} alt={profile.full_name} />
                ) : (
                  <AvatarFallback className="bg-blue-100 text-blue-800 text-3xl">
                    {profile.full_name?.charAt(0) || "م"}
                  </AvatarFallback>
                )}
              </Avatar>
            </div>
            
            <div className="pt-16 pb-6">
              {/* Basic Info */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">{profile.full_name}</h1>
                  <p className="text-lg text-blue-600 font-semibold">{profile.category}</p>
                </div>
                
                <div className="flex items-center mt-4 md:mt-0 space-x-2 space-x-reverse">
                  <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full font-medium text-sm flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    {profile.rating || 0}
                  </div>
                  
                  <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium text-sm">
                    {profile.completed_jobs || 0} مهمة منجزة
                  </div>
                </div>
              </div>
              
              {/* Location */}
              <div className="flex items-center mt-4 text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                {profile.city || 'غير محدد'}
              </div>
              
              {/* Bio */}
              <div className="mt-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">نبذة تعريفية</h2>
                <p className="text-gray-600">
                  {profile.bio || 'لا توجد معلومات متاحة.'}
                </p>
              </div>
              
              {/* Contact Button */}
              <div className="mt-8">
                <Button 
                  className="w-full md:w-auto px-8 py-2"
                  onClick={handleContactClick}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  تواصل مع المعلم
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HandymanProfile;
