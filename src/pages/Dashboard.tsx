
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import { UserProfile, Job, Application } from '@/lib/supabase';

const Dashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);

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
          setApplications(handymanApplications as Application[]);
        }
      } catch (error) {
        console.error('Error loading dashboard:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  const getStatusBadge = (status: string) => {
    let badgeClasses = "";
    let statusText = "";

    switch (status) {
      case 'pending':
        badgeClasses = "bg-yellow-100 text-yellow-800";
        statusText = "في الانتظار";
        break;
      case 'accepted':
        badgeClasses = "bg-green-100 text-green-800";
        statusText = "تم القبول";
        break;
      case 'rejected':
        badgeClasses = "bg-red-100 text-red-800";
        statusText = "مرفوض";
        break;
      default:
        badgeClasses = "bg-gray-100 text-gray-800";
        statusText = "غير معروف";
    }

    return <Badge className={badgeClasses}>{statusText}</Badge>;
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

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <Navbar />
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">
          {profile?.role === 'client' ? 'لوحة تحكم العميل' : 'لوحة تحكم المعلم'}
        </h1>

        {profile?.role === 'client' && (
          <>
            <section className="mb-10">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">
                    المهام التي نشرتها
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {jobs.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500 mb-4">لم تقم بنشر أي مهام بعد</p>
                      <Button 
                        onClick={() => navigate('/post-job')}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        نشر مهمة جديدة
                      </Button>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-right">عنوان المهمة</TableHead>
                            <TableHead className="text-right">المدينة</TableHead>
                            <TableHead className="text-right">التخصص</TableHead>
                            <TableHead className="text-right">الميزانية</TableHead>
                            <TableHead className="text-right">تاريخ النشر</TableHead>
                            <TableHead className="text-right">العروض</TableHead>
                            <TableHead className="text-right">التفاصيل</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {jobs.map((job) => (
                            <TableRow key={job.id}>
                              <TableCell className="font-medium">{job.title}</TableCell>
                              <TableCell>{job.city}</TableCell>
                              <TableCell>{job.category}</TableCell>
                              <TableCell>{job.budget} درهم</TableCell>
                              <TableCell>{formatDate(job.created_at)}</TableCell>
                              <TableCell>
                                {applications.filter(app => app.job_id === job.id).length}
                              </TableCell>
                              <TableCell>
                                <Button 
                                  variant="outline" 
                                  onClick={() => navigate(`/jobs/${job.id}`)}
                                  className="text-blue-600 border-blue-600 hover:bg-blue-50"
                                >
                                  عرض
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </section>

            <section>
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">
                    العروض المستلمة
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {applications.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">لم تستلم أي عروض بعد</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-right">المهمة</TableHead>
                            <TableHead className="text-right">اسم المعلم</TableHead>
                            <TableHead className="text-right">المدينة</TableHead>
                            <TableHead className="text-right">التخصص</TableHead>
                            <TableHead className="text-right">الميزانية المقترحة</TableHead>
                            <TableHead className="text-right">الحالة</TableHead>
                            <TableHead className="text-right">التفاصيل</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {applications.map((app) => {
                            const jobTitle = jobs.find(j => j.id === app.job_id)?.title || '';
                            return (
                              <TableRow key={app.id}>
                                <TableCell className="font-medium">{jobTitle}</TableCell>
                                <TableCell>{app.profiles?.full_name}</TableCell>
                                <TableCell>{app.profiles?.city}</TableCell>
                                <TableCell>{app.profiles?.category}</TableCell>
                                <TableCell>{app.proposed_budget} درهم</TableCell>
                                <TableCell>{getStatusBadge(app.status)}</TableCell>
                                <TableCell>
                                  <Button 
                                    variant="outline" 
                                    onClick={() => navigate(`/jobs/${app.job_id}`)}
                                    className="text-blue-600 border-blue-600 hover:bg-blue-50"
                                  >
                                    عرض
                                  </Button>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </section>
          </>
        )}

        {profile?.role === 'handyman' && (
          <section>
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold">
                  المهام التي تقدمت لها
                </CardTitle>
              </CardHeader>
              <CardContent>
                {applications.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">لم تتقدم لأي مهام بعد</p>
                    <Button 
                      onClick={() => navigate('/jobs')}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      استعرض المهام المتاحة
                    </Button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-right">عنوان المهمة</TableHead>
                          <TableHead className="text-right">المدينة</TableHead>
                          <TableHead className="text-right">الميزانية المقترحة</TableHead>
                          <TableHead className="text-right">حالة الطلب</TableHead>
                          <TableHead className="text-right">تاريخ التقديم</TableHead>
                          <TableHead className="text-right">التفاصيل</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {applications.map((app) => {
                          const job = app.jobs as unknown as Job;
                          return (
                            <TableRow key={app.id}>
                              <TableCell className="font-medium">{job?.title}</TableCell>
                              <TableCell>{job?.city}</TableCell>
                              <TableCell>{app.proposed_budget} درهم</TableCell>
                              <TableCell>{getStatusBadge(app.status)}</TableCell>
                              <TableCell>{formatDate(app.created_at)}</TableCell>
                              <TableCell>
                                <Button 
                                  variant="outline" 
                                  onClick={() => navigate(`/jobs/${app.job_id}`)}
                                  className="text-blue-600 border-blue-600 hover:bg-blue-50"
                                >
                                  عرض
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </section>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
