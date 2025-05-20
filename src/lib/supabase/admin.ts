
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from './types';

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
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching all jobs:', error);
    throw error;
  }
  
  return data;
}

// Function to delete a job
export async function deleteJob(jobId: string) {
  const { error } = await supabase
    .from('jobs')
    .delete()
    .eq('id', jobId);
  
  if (error) {
    console.error('Error deleting job:', error);
    throw error;
  }
  
  return true;
}

// Function to fetch all users
export async function fetchAllUsers() {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('full_name', { ascending: true });
  
  if (error) {
    console.error('Error fetching all users:', error);
    throw error;
  }
  
  return data;
}

// Function to update user ban status
export async function updateUserBanStatus(userId: string, banned: boolean) {
  const { error } = await supabase
    .from('profiles')
    .update({ banned })
    .eq('id', userId);
  
  if (error) {
    console.error('Error updating user ban status:', error);
    throw error;
  }
  
  return true;
}

// Function to update user role
export async function updateUserRole(userId: string, role: string) {
  const { error } = await supabase
    .from('profiles')
    .update({ role })
    .eq('id', userId);
  
  if (error) {
    console.error('Error updating user role:', error);
    throw error;
  }
  
  return true;
}

// Function to make a specific user admin by email
export async function makeUserAdminByEmail(email: string) {
  try {
    // First get the user ID from their email
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .maybeSingle();
    
    if (userError) {
      console.error('Error finding user by email:', userError);
      throw userError;
    }
    
    if (!userData) {
      throw new Error(`User with email ${email} not found`);
    }
    
    // Then update their role to admin
    const { error } = await supabase
      .from('profiles')
      .update({ role: 'admin' })
      .eq('id', userData.id);
    
    if (error) {
      console.error('Error updating user to admin:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error in makeUserAdminByEmail:', error);
    throw error;
  }
}
