
import { supabase } from '@/integrations/supabase/client';
import { Message } from './types';

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

// Function to get all messages for a job with proper profile joins
export async function fetchMessagesForJob(jobId: string) {
  try {
    // First get all messages
    const { data: messagesData, error: messagesError } = await supabase
      .from('messages')
      .select(`
        id,
        job_id,
        sender_id,
        receiver_id,
        text,
        created_at
      `)
      .eq('job_id', jobId)
      .order('created_at', { ascending: true });
    
    if (messagesError) throw messagesError;
    
    // Then fetch profiles for all unique sender IDs
    const senderIds = [...new Set(messagesData.map(msg => msg.sender_id))];
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url')
      .in('id', senderIds);
    
    if (profilesError) throw profilesError;
    
    // Create a lookup map for profiles
    const profilesMap = new Map();
    profilesData?.forEach(profile => {
      profilesMap.set(profile.id, profile);
    });
    
    // Combine messages with their sender profiles
    const messages = messagesData.map(message => {
      const profile = profilesMap.get(message.sender_id);
      return {
        id: message.id,
        job_id: message.job_id,
        sender_id: message.sender_id,
        receiver_id: message.receiver_id,
        text: message.text,
        created_at: message.created_at,
        sender_profile: profile ? {
          full_name: profile.full_name,
          avatar_url: profile.avatar_url
        } : null
      };
    });
    
    return messages;
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
