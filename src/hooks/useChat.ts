
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { 
  fetchMessagesForJob, 
  sendMessage as sendMessageApi, 
  canAccessJobChat, 
  getChatParticipantInfo,
  Message, 
  supabase 
} from '@/lib/supabase';

export const useChat = (jobId: string | undefined) => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const [participantInfo, setParticipantInfo] = useState<{
    otherPartyId: string;
    otherPartyName: string | null;
    otherPartyAvatar: string | null;
    jobTitle: string;
  } | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Format date to Arabic
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('ar-MA', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Format date for message grouping
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-MA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Function to load messages
  const loadMessages = async () => {
    if (!jobId) return;
    
    try {
      const messagesData = await fetchMessagesForJob(jobId);
      setMessages(messagesData);
    } catch (error) {
      console.error('Error loading messages:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحميل الرسائل",
        variant: "destructive"
      });
    }
  };

  // Function to subscribe to real-time message updates
  const subscribeToMessages = () => {
    if (!jobId) return;

    const channel = supabase
      .channel('message-changes')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'messages',
          filter: `job_id=eq.${jobId}` 
        }, 
        async (payload) => {
          console.log('New message received:', payload);
          
          // Get the sender profile
          const { data: profileData } = await supabase
            .from('profiles')
            .select('full_name, avatar_url')
            .eq('id', payload.new.sender_id)
            .single();
          
          // Create the new message object
          const newMessage: Message = {
            id: payload.new.id,
            job_id: payload.new.job_id,
            sender_id: payload.new.sender_id,
            receiver_id: payload.new.receiver_id,
            text: payload.new.text,
            created_at: payload.new.created_at,
            sender_profile: profileData ? {
              full_name: profileData.full_name,
              avatar_url: profileData.avatar_url
            } : null
          };
          
          setMessages(prev => [...prev, newMessage]);
        }
      )
      .subscribe();

    // Return unsubscribe function
    return () => {
      supabase.removeChannel(channel);
    };
  };

  // Handle sending a message
  const handleSendMessage = async (text: string) => {
    if (!jobId || !participantInfo) return;
    
    setIsSending(true);
    
    try {
      const { error } = await sendMessageApi(
        jobId, 
        participantInfo.otherPartyId, 
        text
      );
      
      if (error) throw error;
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إرسال الرسالة",
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
    }
  };

  // Check if user has access to this chat
  useEffect(() => {
    const checkAccess = async () => {
      if (!jobId) return;

      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          toast({
            title: "غير مسجل الدخول",
            description: "يجب عليك تسجيل الدخول للوصول إلى المحادثة",
            variant: "destructive"
          });
          navigate('/login');
          return;
        }
        
        setCurrentUserId(session.user.id);
        
        const access = await canAccessJobChat(jobId);
        setHasAccess(access);
        
        if (!access) {
          toast({
            title: "وصول مرفوض",
            description: "ليس لديك صلاحية للوصول إلى هذه المحادثة",
            variant: "destructive"
          });
          navigate('/dashboard');
          return;
        }
        
        // Get other party info
        const info = await getChatParticipantInfo(jobId);
        setParticipantInfo(info);
        
        // Fetch messages
        await loadMessages();
        
        // Subscribe to new messages
        const unsubscribe = subscribeToMessages();
        
        return () => {
          if (unsubscribe) unsubscribe();
        };
        
      } catch (error) {
        console.error('Error checking access:', error);
        toast({
          title: "خطأ",
          description: "حدث خطأ أثناء تحميل المحادثة",
          variant: "destructive"
        });
        navigate('/dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    checkAccess();
  }, [jobId, navigate]);
  
  // Group messages by date
  const groupedMessages: { [key: string]: Message[] } = messages.reduce((groups, message) => {
    const date = formatDate(message.created_at);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {} as { [key: string]: Message[] });

  return {
    messages,
    groupedMessages,
    isLoading,
    isSending,
    hasAccess,
    participantInfo,
    currentUserId,
    formatTime,
    formatDate,
    handleSendMessage
  };
};
