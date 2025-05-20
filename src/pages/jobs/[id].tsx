
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Loader, CheckCircle, MessageCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/hooks/use-toast';
import { 
  fetchApplicationsForJob, 
  Application, 
  isUserHandyman,
  supabase
} from '@/lib/supabase';
import ApplyJobForm from '@/components/ApplyJobForm';

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
  const [isJobOwner, setIsJobOwner] = useState(false);
  const [isHandyman, setIsHandyman] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoadingApplications, setIsLoadingApplications] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  
  // Fetch job details
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

  // Check if current user is job owner and fetch applications if they are
  useEffect(() => {
    const checkUserStatus = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      setIsLoggedIn(!!session);
      
      if (session && job) {
        // Set current user ID
        setCurrentUserId(session.user.id);
        
        // Check if user is job owner
        setIsJobOwner(session.user.id === job.user_id);
        
        // Check if user is a handyman
        const handymanStatus = await isUserHandyman();
        setIsHandyman(handymanStatus);
        
        // If user is job owner, fetch applications
        if (session.user.id === job.user_id) {
          fetchApplications();
        }
      } else {
        setIsJobOwner(false);
      }
    };

    if (job) {
      checkUserStatus();
    }
  }, [job]);

  const fetchApplications = async () => {
    if (!id) return;
    
    setIsLoadingApplications(true);
    try {
      // Fetch applications with profiles
      const data = await fetchApplicationsForJob(id);
      setApplications(data);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحميل العروض",
        variant: "destructive"
      });
    } finally {
      setIsLoadingApplications(false);
    }
  };

  const handleAcceptApplication = async (applicationId: string) => {
    try {
      // Update status to accepted
      const { error } = await supabase
        .from('applications')
        .update({ status: 'accepted' })
        .eq('id', applicationId)
        .eq('job_id', id);
      
      if (error) throw error;
      
      // Update local state to reflect the change
      setApplications(prevApps => 
        prevApps.map(app => 
          app.id === applicationId ? { ...app, status: 'accepted' } : app
        )
      );
      
      toast({
        title: "تم قبول العرض",
        description: "تم قبول عرض الحرفي بنجاح",
      });
      
    } catch (error) {
      console.error('Error accepting application:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء قبول العرض",
        variant: "destructive"
      });
    }
  };

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

              {isLoggedIn && isHandyman && !isJobOwner && (
                <div className="mt-10 pt-6 border-t border-gray-200">
                  <ApplyJobForm jobId={job.id} />
                </div>
              )}
              
              {!isLoggedIn && (
                <div className="mt-10 pt-6 border-t border-gray-200 text-center">
                  <p className="text-gray-600 mb-4">يجب عليك تسجيل الدخول كحرفي لتتمكن من تقديم عرض</p>
                  <Button
                    onClick={() => navigate('/login')}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    تسجيل الدخول
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          {/* Applications section - visible only to job owner */}
          {isJobOwner && (
            <div className="mt-8">
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-8">
                  <h2 className="text-xl font-bold mb-6">العروض المقدمة</h2>
                  
                  {isLoadingApplications ? (
                    <div className="space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex items-start gap-4 p-4 border border-gray-100 rounded-lg">
                          <Skeleton className="h-12 w-12 rounded-full" />
                          <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-1/3" />
                            <Skeleton className="h-4 w-1/4" />
                            <Skeleton className="h-20 w-full" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : applications.length === 0 ? (
                    <div className="text-center py-10 text-gray-500">
                      <p className="text-lg">لا توجد عروض بعد</p>
                      <p className="mt-2">سيظهر هنا العروض المقدمة من الحرفيين</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {applications.map((application) => (
                        <Card key={application.id} className={`overflow-hidden ${application.status === 'accepted' ? 'border-green-500 border-2' : ''}`}>
                          <CardContent className="p-0">
                            <div className="p-6">
                              <div className="flex items-start gap-4 flex-wrap sm:flex-nowrap">
                                <Avatar className="h-14 w-14 border">
                                  <AvatarImage src={application.profiles?.avatar_url || ''} alt={application.profiles?.full_name || ''} />
                                  <AvatarFallback>{application.profiles?.full_name?.[0] || '?'}</AvatarFallback>
                                </Avatar>
                                
                                <div className="flex-1">
                                  <div className="flex justify-between flex-wrap gap-2">
                                    <div>
                                      <h3 className="font-bold text-lg">{application.profiles?.full_name || 'حرفي'}</h3>
                                      <div className="text-gray-600 text-sm flex flex-wrap gap-x-4 mt-1">
                                        {application.profiles?.city && (
                                          <span>
                                            <i className="fas fa-map-marker-alt ml-1"></i>
                                            {application.profiles.city}
                                          </span>
                                        )}
                                        {application.profiles?.category && (
                                          <span>
                                            <i className="fas fa-briefcase ml-1"></i>
                                            {application.profiles.category}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                    <div className="text-green-600 font-bold text-lg">
                                      {formatCurrency(application.proposed_budget)}
                                    </div>
                                  </div>
                                  
                                  <div className="mt-4 bg-gray-50 p-4 rounded-md text-gray-700">
                                    {application.message}
                                  </div>
                                  
                                  <div className="mt-4 flex justify-between items-center">
                                    <div className="text-gray-500 text-sm">
                                      {formatDate(application.created_at)}
                                    </div>
                                    
                                    {application.status === 'accepted' ? (
                                      <div className="flex space-x-2 space-x-reverse">
                                        <div className="flex items-center text-green-600 mr-2">
                                          <CheckCircle className="w-5 h-5 ml-2" />
                                          <span>تم القبول</span>
                                        </div>
                                        
                                        <Button 
                                          onClick={() => navigate(`/chat/${job.id}`)}
                                          className="bg-green-600 hover:bg-green-700"
                                        >
                                          <MessageCircle className="w-4 h-4 ml-2" />
                                          محادثة
                                        </Button>
                                      </div>
                                    ) : (
                                      <Button 
                                        onClick={() => handleAcceptApplication(application.id)}
                                        className="bg-green-600 hover:bg-green-700"
                                      >
                                        قبول العرض
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* If user is a handyman with accepted application, show chat button */}
          {isHandyman && !isJobOwner && applications.some(app => 
            app.handyman_id === currentUserId && 
            app.job_id === job.id && 
            app.status === 'accepted'
          ) && (
            <div className="mt-6 flex justify-center">
              <Button 
                onClick={() => navigate(`/chat/${job.id}`)}
                className="bg-green-600 hover:bg-green-700"
                size="lg"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                بدء المحادثة مع العميل
              </Button>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default JobDetailPage;
