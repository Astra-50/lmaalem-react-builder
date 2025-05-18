
import React from 'react';
import { useParams } from 'react-router-dom';
import { Loader } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ChatHeader } from '@/components/chat/ChatHeader';
import { MessageList } from '@/components/chat/MessageList';
import { MessageForm } from '@/components/chat/MessageForm';
import { useChat } from '@/hooks/useChat';

const ChatPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const { 
    groupedMessages,
    isLoading,
    isSending,
    hasAccess,
    participantInfo,
    currentUserId,
    formatTime,
    formatDate,
    handleSendMessage
  } = useChat(jobId);

  // Loading state
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
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-6 flex-grow flex flex-col">
        <ChatHeader participantInfo={participantInfo} />
        
        <div className="flex-grow flex flex-col bg-white rounded-lg shadow-sm mb-4 overflow-hidden">
          <div className="flex-grow overflow-y-auto p-4" style={{ minHeight: "300px", maxHeight: "60vh" }}>
            <MessageList 
              groupedMessages={groupedMessages}
              currentUserId={currentUserId}
              formatDate={formatDate}
              formatTime={formatTime}
            />
          </div>
          
          <MessageForm 
            onSendMessage={handleSendMessage}
            isSending={isSending}
          />
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ChatPage;
