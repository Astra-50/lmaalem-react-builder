
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Loader } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';

type Job = {
  id: string;
  title: string;
  description: string;
  city: string;
  category: string;
  budget: number;
  created_at: string;
  user_id: string;
};

const JobDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { data: job, isLoading, error } = useQuery({
    queryKey: ['job', id],
    queryFn: async () => {
      if (!id) throw new Error('لم يتم توفير معرف المهمة');
      
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          // PGRST116 means the resource was not found
          return null;
        }
        throw error;
      }
      
      return data as Job;
    }
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-MA', { style: 'currency', currency: 'MAD' })
      .format(amount)
      .replace('MAD', 'درهم');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-MA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex justify-center items-center">
          <Loader className="animate-spin h-10 w-10 text-blue-600" />
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow container mx-auto px-4 py-12">
          <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-xl shadow-md text-center">
            <h2 className="text-xl font-bold mb-2">حدث خطأ</h2>
            <p>لم نتمكن من تحميل تفاصيل المهمة. الرجاء المحاولة مرة أخرى لاحقاً.</p>
            <button 
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
              onClick={() => navigate('/jobs')}
            >
              العودة إلى قائمة المهام
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow container mx-auto px-4 py-12">
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-6 rounded-xl shadow-md text-center">
            <h2 className="text-xl font-bold mb-2">لم يتم العثور على المهمة</h2>
            <p>المهمة التي تبحث عنها غير موجودة أو تم حذفها.</p>
            <button 
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              onClick={() => navigate('/jobs')}
            >
              العودة إلى قائمة المهام
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12 flex-grow">
        <div className="max-w-4xl mx-auto">
          {/* Navigation */}
          <div className="mb-6">
            <button 
              onClick={() => navigate('/jobs')}
              className="text-blue-600 hover:text-blue-800 transition flex items-center"
            >
              <i className="fas fa-arrow-right ml-2"></i>
              <span>العودة إلى قائمة المهام</span>
            </button>
          </div>
          
          {/* Main content */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-8">
              <div className="flex justify-between items-start flex-wrap gap-4">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{job.title}</h1>
                <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                  {job.category}
                </span>
              </div>

              <div className="my-6 space-y-2">
                <div className="flex items-center">
                  <i className="fas fa-map-marker-alt text-gray-500 ml-2 w-5"></i>
                  <span className="text-gray-700">{job.city}</span>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-calendar-alt text-gray-500 ml-2 w-5"></i>
                  <span className="text-gray-700">تم النشر: {formatDate(job.created_at)}</span>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-money-bill-wave text-gray-500 ml-2 w-5"></i>
                  <span className="text-green-600 font-semibold text-lg">{formatCurrency(job.budget)}</span>
                </div>
              </div>

              <div className="mt-8 border-t border-gray-200 pt-6">
                <h2 className="text-xl font-bold mb-4">وصف المهمة</h2>
                <div className="text-gray-700 whitespace-pre-line">
                  {job.description}
                </div>
              </div>

              <div className="mt-10 pt-6 border-t border-gray-200">
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg w-full md:w-auto transition">
                  <i className="fas fa-paper-plane ml-2"></i>
                  قدم عرضك
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default JobDetailPage;
