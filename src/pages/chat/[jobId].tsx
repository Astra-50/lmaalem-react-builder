
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader, Send } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from '@/hooks/use-toast';
import { 
  fetchMessagesForJob, 
  sendMessage, 
  canAccessJobChat, 
  getChatParticipantInfo, 
  Message,
  supabase
} from '@/lib/supabase';

const ChatPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Function to scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

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
        subscribeToMessages();
        
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

  // Scroll to bottom when messages update
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
          // Fetch the complete message with sender info
          const { data, error } = await supabase
            .from('messages')
            .select(`
              *,
              profiles!sender_id(
                full_name,
                avatar_url
              )
            `)
            .eq('id', payload.new.id)
            .single();
          
          if (!error && data) {
            // Transform the data to match our Message type
            const message = {
              ...data,
              sender_profile: data.profiles
            };
            setMessages(prev => [...prev, message as unknown as Message]);
          }
        }
      )
      .subscribe();

    // Return unsubscribe function
    return () => {
      supabase.removeChannel(channel);
    };
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !jobId || !participantInfo) return;
    
    setIsSending(true);
    
    try {
      const { error } = await sendMessage(
        jobId, 
        participantInfo.otherPartyId, 
        newMessage.trim()
      );
      
      if (error) throw error;
      
      setNewMessage('');
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

  // Group messages by date
  const groupedMessages: { [key: string]: Message[] } = messages.reduce((groups, message) => {
    const date = formatDate(message.created_at);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {} as { [key: string]: Message[] });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex justify-center items-center">
          <Loader className="animate-spin h-10 w-10 text-blue-600" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow container mx-auto px-4 py-12 text-center">
          <h2 className="text-2xl font-bold mb-4">غير مصرح بالوصول</h2>
          <p className="mb-6">ليس لديك صلاحية للوصول إلى هذه المحادثة.</p>
          <Button onClick={() => navigate('/dashboard')}>العودة للوحة التحكم</Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-6 flex-grow flex flex-col">
        <div className="mb-4">
          <Button 
            variant="outline"
            onClick={() => navigate('/dashboard')}
            className="mb-4"
          >
            العودة للوحة التحكم
          </Button>
        </div>
        
        {participantInfo && (
          <div className="bg-white rounded-lg shadow-sm p-4 mb-4 flex items-center">
            <Avatar className="h-12 w-12 mr-4">
              <AvatarImage src={participantInfo.otherPartyAvatar || ''} alt={participantInfo.otherPartyName || ''} />
              <AvatarFallback>{participantInfo.otherPartyName?.[0] || '؟'}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-lg font-semibold">{participantInfo.otherPartyName || 'مستخدم'}</h2>
              <p className="text-gray-600">
                {participantInfo.jobTitle || 'محادثة'}
              </p>
            </div>
          </div>
        )}
        
        <div className="flex-grow flex flex-col bg-white rounded-lg shadow-sm mb-4 overflow-hidden">
          <div className="flex-grow overflow-y-auto p-4" style={{ minHeight: "300px", maxHeight: "60vh" }}>
            {Object.keys(groupedMessages).length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-400">
                <p>لا توجد رسائل بعد. ابدأ المحادثة الآن!</p>
              </div>
            ) : (
              Object.entries(groupedMessages).map(([date, dateMessages]) => (
                <div key={date} className="mb-4">
                  <div className="text-center my-2">
                    <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                      {date}
                    </span>
                  </div>
                  
                  {dateMessages.map(message => {
                    const isCurrentUser = currentUserId === message.sender_id;
                    
                    return (
                      <div 
                        key={message.id} 
                        className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-3`}
                      >
                        <div className={`max-w-[70%] flex ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'} items-end`}>
                          {!isCurrentUser && (
                            <Avatar className="h-8 w-8 mr-2">
                              <AvatarImage src={message.sender_profile?.avatar_url || ''} alt={message.sender_profile?.full_name || ''} />
                              <AvatarFallback>{message.sender_profile?.full_name?.[0] || '؟'}</AvatarFallback>
                            </Avatar>
                          )}
                          
                          <div 
                            className={`rounded-lg py-2 px-4 inline-block ${
                              isCurrentUser 
                                ? 'bg-blue-600 text-white rounded-br-none' 
                                : 'bg-gray-100 text-gray-800 rounded-bl-none'
                            }`}
                          >
                            <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                            <span className={`text-xs ${isCurrentUser ? 'text-blue-200' : 'text-gray-500'} block`}>
                              {formatTime(message.created_at)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <form onSubmit={handleSubmit} className="border-t border-gray-200 p-4">
            <div className="flex">
              <Textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="اكتب رسالتك هنا..."
                className="flex-grow resize-none arabic-input"
                rows={2}
                disabled={isSending}
              />
              <Button 
                type="submit" 
                className="mr-2 self-end" 
                disabled={!newMessage.trim() || isSending}
              >
                {isSending ? (
                  <Loader className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <span className="ml-2">إرسال</span>
                    <Send className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ChatPage;
