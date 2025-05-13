
import { createClient } from '@supabase/supabase-js';

// These would typically come from environment variables
const supabaseUrl = 'https://your-supabase-url.supabase.co';
const supabaseAnonKey = 'your-supabase-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Example of a type for jobs
export type Job = {
  id: number;
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
    const { data, error } = await supabase
      .from('jobs')
      .insert([job])
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
