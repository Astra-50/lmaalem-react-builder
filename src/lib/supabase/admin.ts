
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from './types';
import { toast } from '@/components/ui/sonner';

// Function to check if current user is an admin
export async function isUserAdmin() {
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
    
    return data.role === 'admin';
  } catch (error) {
    console.error('Error in isUserAdmin:', error);
    return false;
  }
}

// Function to fetch all jobs
export async function fetchAllJobs() {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching all jobs:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error in fetchAllJobs:', error);
    throw error;
  }
}

// Function to delete a job
export async function deleteJob(jobId: string) {
  try {
    const { error, count } = await supabase
      .from('jobs')
      .delete()
      .eq('id', jobId)
      .select('count');
    
    if (error) {
      console.error('Error deleting job:', error);
      throw error;
    }
    
    // Check if any rows were affected
    if (!count || count === 0) {
      throw new Error('No job was deleted. You might not have permission.');
    }
    
    return true;
  } catch (error) {
    console.error('Error in deleteJob:', error);
    throw error;
  }
}

// Function to fetch all users
export async function fetchAllUsers() {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('full_name', { ascending: true });
    
    if (error) {
      console.error('Error fetching all users:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error in fetchAllUsers:', error);
    throw error;
  }
}

// Function to update user ban status
export async function updateUserBanStatus(userId: string, banned: boolean) {
  try {
    const { error, count } = await supabase
      .from('profiles')
      .update({ banned })
      .eq('id', userId)
      .select('count');
    
    if (error) {
      console.error('Error updating user ban status:', error);
      throw error;
    }
    
    // Check if any rows were affected
    if (!count || count === 0) {
      throw new Error('No user was updated. You might not have permission.');
    }
    
    return true;
  } catch (error) {
    console.error('Error in updateUserBanStatus:', error);
    throw error;
  }
}

// Function to update user role
export async function updateUserRole(userId: string, role: string) {
  try {
    const { error, count } = await supabase
      .from('profiles')
      .update({ role })
      .eq('id', userId)
      .select('count');
    
    if (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
    
    // Check if any rows were affected
    if (!count || count === 0) {
      throw new Error('No user role was updated. You might not have permission.');
    }
    
    return true;
  } catch (error) {
    console.error('Error in updateUserRole:', error);
    throw error;
  }
}
