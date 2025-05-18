
import { supabase } from '@/integrations/supabase/client';
import { Application } from './types';

// Function to submit a job application
export async function submitApplication(application: Omit<Application, 'id' | 'created_at' | 'status' | 'handyman_id'>) {
  try {
    const { data: session } = await supabase.auth.getSession();
    
    if (!session.session) {
      throw new Error('User must be logged in to submit an application');
    }
    
    const { data, error } = await supabase
      .from('applications')
      .insert([{
        ...application,
        status: 'pending',
        handyman_id: session.session.user.id
      }])
      .select();
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error submitting application:', error);
    return { data: null, error };
  }
}

// Function to fetch applications for a specific job
export async function fetchApplicationsForJob(jobId: string) {
  try {
    const { data, error } = await supabase
      .from('applications')
      .select(`
        id,
        job_id,
        handyman_id,
        message,
        proposed_budget,
        status,
        created_at,
        profiles:handyman_id (
          full_name,
          city,
          category,
          avatar_url
        )
      `)
      .eq('job_id', jobId);
    
    if (error) {
      console.error('Error fetching applications:', error);
      throw error;
    }
    
    return data as Application[];
  } catch (error) {
    console.error('Error in fetchApplicationsForJob:', error);
    throw error;
  }
}

// Function to accept an application
export async function acceptApplication(applicationId: string) {
  const { data, error } = await supabase
    .from('applications')
    .update({ status: 'accepted' })
    .eq('id', applicationId)
    .select();
  
  if (error) {
    console.error('Error accepting application:', error);
    throw error;
  }
  
  return data;
}
