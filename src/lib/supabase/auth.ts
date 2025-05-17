
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from './types';

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
