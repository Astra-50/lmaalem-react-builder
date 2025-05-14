
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
