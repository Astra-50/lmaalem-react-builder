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

// Type for user profile
export type UserProfile = {
  id: string;
  full_name: string | null;
  city: string | null;
  category: string | null;
  avatar_url: string | null;
  bio: string | null;
  phone_number: string | null;
  role: string;
};

// Type for chat messages
export type Message = {
  id: string;
  job_id: string;
  sender_id: string;
  receiver_id: string;
  text: string;
  created_at: string;
  sender_profile?: {
    full_name: string | null;
    avatar_url: string | null;
  } | null;
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

// Function to check if user is a handyman
export async function isUserHandyman() {
  try {
    const { data: session } = await supabase.auth.getSession();
    
    if (!session.session) {
      return false;
    }
    
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.session.user.id)
      .single();
    
    if (error) {
      console.error('Error checking user role:', error);
      return false;
    }
    
    return data.role === 'handyman';
  } catch (error) {
    console.error('Error in isUserHandyman:', error);
    return false;
  }
}

// Function to get current user profile
export async function getCurrentUserProfile() {
  try {
    const { data: session } = await supabase.auth.getSession();
    
    if (!session.session) {
      return null;
    }
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.session.user.id)
      .single();
    
    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
    
    return data as UserProfile;
  } catch (error) {
    console.error('Error in getCurrentUserProfile:', error);
    return null;
  }
}

// Function to send a message
export async function sendMessage(jobId: string, receiverId: string, text: string) {
  try {
    const { data: session } = await supabase.auth.getSession();
    
    if (!session.session) {
      throw new Error('يجب عليك تسجيل الدخول لإرسال رسالة');
    }
    
    const { data, error } = await supabase
      .from('messages')
      .insert([{
        job_id: jobId,
        sender_id: session.session.user.id,
        receiver_id: receiverId,
        text: text
      }])
      .select();
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error sending message:', error);
    return { data: null, error };
  }
}

// Function to get all messages for a job
export async function fetchMessagesForJob(jobId: string) {
  try {
    // Modified query to correctly select profiles data
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        profiles!sender_id(
          full_name,
          avatar_url
        )
      `)
      .eq('job_id', jobId)
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    
    // Transform the data to match our expected Message type
    const messages = data.map(message => ({
      ...message,
      sender_profile: message.profiles
    }));
    
    return messages as unknown as Message[];
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
}

// Function to check if user has access to job chat
export async function canAccessJobChat(jobId: string) {
  try {
    const { data: session } = await supabase.auth.getSession();
    
    if (!session.session) {
      return false;
    }
    
    const userId = session.session.user.id;
    
    // Check if user is job owner
    const { data: job } = await supabase
      .from('jobs')
      .select('user_id')
      .eq('id', jobId)
      .single();
    
    if (job && job.user_id === userId) {
      return true;
    }
    
    // Check if user is an accepted handyman for this job
    const { data: application } = await supabase
      .from('applications')
      .select('handyman_id, status')
      .eq('job_id', jobId)
      .eq('handyman_id', userId)
      .eq('status', 'accepted')
      .single();
    
    return !!application;
  } catch (error) {
    console.error('Error checking chat access:', error);
    return false;
  }
}

// Function to get other party's info for chat
export async function getChatParticipantInfo(jobId: string) {
  try {
    const { data: session } = await supabase.auth.getSession();
    
    if (!session.session) {
      throw new Error('يجب عليك تسجيل الدخول');
    }
    
    const userId = session.session.user.id;
    
    // Get job info
    const { data: job } = await supabase
      .from('jobs')
      .select('user_id, title')
      .eq('id', jobId)
      .single();
    
    if (!job) {
      throw new Error('المهمة غير موجودة');
    }
    
    // Check if user is job owner
    const isJobOwner = job.user_id === userId;
    
    if (isJobOwner) {
      // Get accepted handyman info
      const { data: application } = await supabase
        .from('applications')
        .select(`
          handyman_id,
          profiles:handyman_id (
            full_name,
            avatar_url,
            id
          )
        `)
        .eq('job_id', jobId)
        .eq('status', 'accepted')
        .single();
      
      if (!application) {
        throw new Error('لا يوجد معلم مقبول لهذه المهمة');
      }
      
      return {
        otherPartyId: application.handyman_id,
        otherPartyName: application.profiles?.full_name,
        otherPartyAvatar: application.profiles?.avatar_url,
        jobTitle: job.title
      };
    } else {
      // Get job owner info
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, avatar_url')
        .eq('id', job.user_id)
        .single();
      
      return {
        otherPartyId: job.user_id,
        otherPartyName: profile?.full_name,
        otherPartyAvatar: profile?.avatar_url,
        jobTitle: job.title
      };
    }
  } catch (error) {
    console.error('Error getting chat participant:', error);
    throw error;
  }
}
