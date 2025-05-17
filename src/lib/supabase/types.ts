
// Types for the supabase database entities
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
  banned?: boolean | null; // Add the banned property
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

// Re-export from supabase client
export { supabase } from '@/integrations/supabase/client';
