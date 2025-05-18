
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from './types';
import { toast } from '@/components/ui/sonner';

// Define simpler flat types to avoid deep type instantiation
type AdminActionResult = {
  success: boolean;
  message: string;
  data?: any;
  error?: any;
};

type FlatProfileWithRole = {
  id: string;
  full_name: string | null;
  role: string;
  email?: string;
};

/**
 * Makes a user an admin by their email address
 */
export async function makeUserAdminByEmail(email: string): Promise<AdminActionResult> {
  try {
    // First find the user profile that matches this email by querying the auth API endpoint
    // Note: We need to use the RPC function for this since we can't directly query auth.users
    const { data: userData, error: userError } = await supabase
      .rpc('get_user_id_by_email', { email_input: email });
    
    if (userError || !userData) {
      console.error('Error finding user by email:', userError);
      return {
        success: false,
        message: `User with email ${email} not found`,
        error: userError
      };
    }
    
    // Update the user's role to admin
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ role: 'admin' })
      .eq('id', userData);
    
    if (updateError) {
      console.error('Error updating user role:', updateError);
      return {
        success: false,
        message: 'Failed to update user role',
        error: updateError
      };
    }
    
    return {
      success: true,
      message: `User ${email} is now an admin`,
    };
  } catch (error) {
    console.error('Unexpected error in makeUserAdminByEmail:', error);
    return {
      success: false,
      message: 'An unexpected error occurred',
      error
    };
  }
}

/**
 * Get all users with their roles
 * Uses simplified return types to prevent deep type instantiation
 */
export async function getAllUsers(): Promise<FlatProfileWithRole[]> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, role');
    
    if (error) {
      console.error('Error fetching users:', error);
      toast('Error', {
        description: 'Failed to fetch users',
        variant: 'destructive',
      });
      return [];
    }
    
    return data as FlatProfileWithRole[];
  } catch (error) {
    console.error('Unexpected error in getAllUsers:', error);
    toast('Error', {
      description: 'An unexpected error occurred',
      variant: 'destructive',
    });
    return [];
  }
}

/**
 * Checks if the current user is an admin
 * Uses a security definer function to prevent infinite recursion in RLS policies
 */
export async function isCurrentUserAdmin(): Promise<boolean> {
  const { data: session } = await supabase.auth.getSession();
  
  if (!session.session) {
    return false;
  }
  
  try {
    const { data, error } = await supabase
      .rpc('is_admin', { user_id: session.session.user.id });
    
    if (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error('Unexpected error in isCurrentUserAdmin:', error);
    return false;
  }
}

/**
 * Updates a user's role
 * Uses simplified return types to prevent deep type instantiation
 */
export async function updateUserRole(userId: string, role: string): Promise<AdminActionResult> {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ role })
      .eq('id', userId);
    
    if (error) {
      console.error('Error updating user role:', error);
      return {
        success: false,
        message: 'Failed to update user role',
        error
      };
    }
    
    return {
      success: true,
      message: `User role updated to ${role}`,
    };
  } catch (error) {
    console.error('Unexpected error in updateUserRole:', error);
    return {
      success: false,
      message: 'An unexpected error occurred',
      error
    };
  }
}
