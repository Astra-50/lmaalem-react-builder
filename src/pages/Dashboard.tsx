
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Loader, Clock, CheckCircle, XCircle, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { UserProfile, Job, Application } from '@/lib/supabase';
import AdminLink from '@/components/AdminLink';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

// Define an extended type for Application with jobs field
interface ApplicationWithJob extends Application {
  jobs?: Job;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<ApplicationWithJob[]>([]);

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          navigate('/login');
          return;
        }

        // Fetch user profile to get role
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (profileError) throw profileError;
        setProfile(profileData as UserProfile);

        // Fetch data based on role
        if (profileData.role === 'client') {
          // For clients: fetch their posted jobs
          const { data: jobsData, error: jobsError } = await supabase
            .from('jobs')
            .select('*')
            .eq('user_id', session.user.id)
            .order('created_at', { ascending: false });
          
          if (jobsError) throw jobsError;
          setJobs(jobsData as Job[]);

          // Fetch applications for all client jobs
          if (jobsData.length > 0) {
            const jobIds = jobsData.map(job => job.id);
            const { data: applicationsData, error: applicationsError } = await supabase
              .from('applications')
              .select(`
                *,
                profiles:handyman_id (
                  full_name,
                  city,
                  category,
                  avatar_url
                )
              `)
              .in('job_id', jobIds)
              .order('created_at', { ascending: false });
            
            if (applicationsError) throw applicationsError;
            setApplications(applicationsData as Application[]);
          }
        } else if (profileData.role === 'handyman') {
          // For handymen: fetch applications they've submitted
          const { data: handymanApplications, error: applicationError } = await supabase
            .from('applications')
            .select(`
              *,
              jobs (*)
            `)
            .eq('handyman_id', session.user.id)
            .order('created_at', { ascending: false });
          
          if (applicationError) throw applicationError;
          setApplications(handymanApplications as ApplicationWithJob[]);
        }
      } catch (error) {
        console.error('Error loading dashboard:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  // Status badge renderer
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-500"><Clock className="h-3 w-3 mr-1" /> في الانتظار</Badge>;
      case 'accepted':
        return <Badge className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" /> تم القبول</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500"><XCircle className="h-3 w-3 mr-1" /> مرفوض</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ar-MA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto py-10 px-4 flex justify-center items-center">
          <div className="text-center">
            <p className="text-lg">جاري تحميل البيانات...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto py-10 px-4 flex justify-center items-center">
          <div className="text-center">
            <p className="text-lg">عذراً، لم يتم العثور على المستخدم.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex flex-col items-center mb-6 text-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={profile?.avatar_url || ''} alt={profile?.full_name || ''} />
                  <AvatarFallback>{profile?.full_name?.[0] || '?'}</AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-bold">{profile?.full_name || 'المستخدم'}</h2>
                <p className="text-gray-600 mt-1">{profile?.role === 'handyman' ? 'حرفي' : 'عميل'}</p>
                
                {/* Add AdminLink component here */}
                <div className="mt-3 w-full">
                  <AdminLink />
                </div>
              </div>
              
              {/* ... keep existing code (rest of the sidebar) */}
            </div>
          </div>
          
          {/* Main content */}
          <div className="lg:col-span-9">
            <h1 className="text-2xl md:text-3xl font-bold mb-6">
              {profile?.role === 'handyman' ? 'لوحة تحكم المعلم' : 'لوحة تحكم العميل'}
            </h1>

            {profile?.role === 'client' ? (
              // CLIENT DASHBOARD
              <div className="space-y-8">
                {/* Jobs Posted Section */}
                <section>
                  <h2 className="text-xl font-semibold mb-4">المهام التي نشرتها</h2>
                  {jobs.length > 0 ? (
                    <div className="space-y-4">
                      {jobs.map((job) => (
                        <Card key={job.id}>
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <CardTitle className="text-lg">{job.title}</CardTitle>
                              <Badge>{job.category}</Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="mb-4">
                              <p className="text-gray-700 mb-2"><span className="font-medium">المدينة:</span> {job.city}</p>
                              <p className="text-gray-700 mb-2"><span className="font-medium">الميزانية:</span> {job.budget} درهم</p>
                              <p className="text-gray-700"><span className="font-medium">تاريخ النشر:</span> {formatDate(job.created_at)}</p>
                            </div>
                            
                            <div className="flex space-x-2 space-x-reverse">
                              <Button 
                                variant="outline" 
                                onClick={() => navigate(`/jobs/${job.id}`)}
                                className="text-blue-600 border-blue-600 hover:bg-blue-50"
                              >
                                عرض التفاصيل
                              </Button>
                              
                              {/* Add chat button for jobs with accepted applications */}
                              {applications.some(app => 
                                app.job_id === job.id && app.status === 'accepted'
                              ) && (
                                <Button 
                                  onClick={() => navigate(`/chat/${job.id}`)}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <MessageCircle className="h-4 w-4 ml-2" />
                                  المحادثة
                                </Button>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="py-8 text-center text-gray-500">
                        <p className="mb-4">لم تقم بنشر أي مهام بعد</p>
                        <Button onClick={() => navigate('/post-job')}>إنشاء مهمة جديدة</Button>
                      </CardContent>
                    </Card>
                  )}
                </section>
                
                {/* Applications Received Section */}
                <section>
                  <h2 className="text-xl font-semibold mb-4">العروض المستلمة</h2>
                  {applications.length > 0 ? (
                    <Card>
                      <CardContent className="overflow-auto py-6">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>المهمة</TableHead>
                              <TableHead>اسم الحرفي</TableHead>
                              <TableHead>السعر المقترح</TableHead>
                              <TableHead>الحالة</TableHead>
                              <TableHead>التاريخ</TableHead>
                              <TableHead>الإجراءات</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {applications.map((app) => (
                              <TableRow key={app.id}>
                                <TableCell className="font-medium">
                                  {jobs.find(job => job.id === app.job_id)?.title}
                                </TableCell>
                                <TableCell>{app.profiles?.full_name}</TableCell>
                                <TableCell>{app.proposed_budget} درهم</TableCell>
                                <TableCell>{getStatusBadge(app.status)}</TableCell>
                                <TableCell>{formatDate(app.created_at)}</TableCell>
                                <TableCell>
                                  <div className="flex space-x-2 space-x-reverse">
                                    <Button 
                                      variant="outline" 
                                      onClick={() => navigate(`/jobs/${app.job_id}`)}
                                      className="text-blue-600 border-blue-600 hover:bg-blue-50"
                                    >
                                      عرض
                                    </Button>
                                    
                                    {app.status === 'accepted' && (
                                      <Button 
                                        onClick={() => navigate(`/chat/${app.job_id}`)}
                                        size="sm"
                                        className="bg-green-600 hover:bg-green-700"
                                      >
                                        <MessageCircle className="h-4 w-4" />
                                      </Button>
                                    )}
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card>
                      <CardContent className="py-8 text-center text-gray-500">
                        <p>لا توجد عروض مستلمة بعد</p>
                      </CardContent>
                    </Card>
                  )}
                </section>
              </div>
            ) : (
              // HANDYMAN DASHBOARD
              <div className="space-y-8">
                <section>
                  <h2 className="text-xl font-semibold mb-4">المهام التي تقدمت لها</h2>
                  {applications.length > 0 ? (
                    <Card>
                      <CardContent className="overflow-auto py-6">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>المهمة</TableHead>
                              <TableHead>المدينة</TableHead>
                              <TableHead>السعر المقترح</TableHead>
                              <TableHead>الحالة</TableHead>
                              <TableHead>التاريخ</TableHead>
                              <TableHead>الإجراءات</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {applications.map((app) => (
                              <TableRow key={app.id}>
                                <TableCell className="font-medium">{app.jobs?.title || 'المهمة غير متوفرة'}</TableCell>
                                <TableCell>{app.jobs?.city || '-'}</TableCell>
                                <TableCell>{app.proposed_budget} درهم</TableCell>
                                <TableCell>{getStatusBadge(app.status)}</TableCell>
                                <TableCell>{formatDate(app.created_at)}</TableCell>
                                <TableCell>
                                  <div className="flex space-x-2 space-x-reverse">
                                    <Button 
                                      variant="outline" 
                                      onClick={() => navigate(`/jobs/${app.job_id}`)}
                                      className="text-blue-600 border-blue-600 hover:bg-blue-50"
                                    >
                                      عرض
                                    </Button>
                                    
                                    {app.status === 'accepted' && (
                                      <Button 
                                        onClick={() => navigate(`/chat/${app.job_id}`)}
                                        size="sm"
                                        className="bg-green-600 hover:bg-green-700"
                                      >
                                        <MessageCircle className="h-4 w-4" />
                                      </Button>
                                    )}
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card>
                      <CardContent className="py-8 text-center text-gray-500">
                        <p className="mb-4">لم تتقدم لأي مهام بعد</p>
                        <Button onClick={() => navigate('/jobs')}>استعرض المهام المتاحة</Button>
                      </CardContent>
                    </Card>
                  )}
                </section>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
