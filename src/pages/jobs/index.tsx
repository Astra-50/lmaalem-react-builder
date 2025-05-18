
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Loader } from 'lucide-react';
import { fetchJobs } from '@/lib/supabase/jobs';
import { Job } from '@/lib/supabase/types';

const JobsPage: React.FC = () => {
  const navigate = useNavigate();
  
  const { data: jobs, isLoading, error } = useQuery({
    queryKey: ['jobs'],
    queryFn: fetchJobs
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-MA', { style: 'currency', currency: 'MAD' })
      .format(amount)
      .replace('MAD', 'درهم');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12 flex-grow">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold">المهام المتاحة</h1>
          <p className="mt-2 text-gray-600">تصفح المهام المتاحة وابحث عن فرصة عمل تناسب مهاراتك</p>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader className="animate-spin h-10 w-10 text-blue-600" />
          </div>
        ) : error ? (
          <div className="text-center text-red-600 p-8 bg-white rounded-lg shadow-md">
            <p>حدث خطأ أثناء تحميل المهام. الرجاء المحاولة مرة أخرى.</p>
          </div>
        ) : jobs?.length === 0 ? (
          <div className="text-center text-gray-600 p-12 bg-white rounded-lg shadow-md">
            <p className="text-xl">لا توجد مهام حالياً</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs?.map((job) => (
              <div 
                key={job.id}
                className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer transition-transform hover:scale-105 hover:shadow-lg"
                onClick={() => navigate(`/jobs/${job.id}`)}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <h2 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">{job.title}</h2>
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      {job.category}
                    </span>
                  </div>

                  <div className="mt-4 space-y-3">
                    <div className="flex items-center">
                      <i className="fas fa-map-marker-alt text-gray-500 ml-2"></i>
                      <span className="text-gray-600">{job.city}</span>
                    </div>
                    
                    <div className="flex items-center">
                      <i className="fas fa-money-bill-wave text-gray-500 ml-2"></i>
                      <span className="text-green-600 font-semibold">{formatCurrency(job.budget)}</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between items-center">
                    <button className="text-blue-600 hover:text-blue-800 font-medium transition-colors">
                      التفاصيل <i className="fas fa-arrow-left mr-1"></i>
                    </button>
                    <span className="text-xs text-gray-500">
                      {new Date(job.created_at).toLocaleDateString('ar-MA')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default JobsPage;
