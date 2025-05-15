
import { createClient } from '@supabase/supabase-js';
import { supabase as supabaseClient } from '@/integrations/supabase/client';

// Re-export the supabase client from the integrations folder
export const supabase = supabaseClient;

// Example of a type for jobs
export type Job = {
  id: string;
  title: string;
  description: string;
  city: string;
  category: string;
  budget: number;
  created_at: string;
  user_id?: string;
};

// Type for applications
export type Application = {
  id: string;
  job_id: string;
  handyman_id: string;
  message: string;
  proposed_budget: number;
  status: string;
  created_at: string;
  profiles?: {
    full_name: string | null;
    city: string | null;
    category: string | null;
    avatar_url: string | null;
  };
};

// Function to submit a new job
export async function submitJob(job: Omit<Job, 'id' | 'created_at' | 'user_id'>) {
  try {
    const { data: session } = await supabase.auth.getSession();
    
    if (!session.session) {
      throw new Error('User must be logged in to submit a job');
    }
    
    const { data, error } = await supabase
      .from('jobs')
      .insert([{
        ...job,
        user_id: session.session.user.id
      }])
      .select();
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error submitting job:', error);
    return { data: null, error };
  }
}

// Function to fetch jobs
export async function fetchJobs() {
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching jobs:', error);
    throw error;
  }
  
  return data as Job[];
}

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
