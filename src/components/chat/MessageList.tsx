
import React, { useRef, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Message } from '@/lib/supabase/types';

interface MessageListProps {
  groupedMessages: { [key: string]: Message[] };
  currentUserId: string | null;
  formatDate: (dateString: string) => string;
  formatTime: (dateString: string) => string;
}

export const MessageList: React.FC<MessageListProps> = ({ 
  groupedMessages, 
  currentUserId, 
  formatDate, 
  formatTime 
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [groupedMessages]);

  if (Object.keys(groupedMessages).length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400">
        <p>لا توجد رسائل بعد. ابدأ المحادثة الآن!</p>
      </div>
    );
  }

  return (
    <>
      {Object.entries(groupedMessages).map(([date, dateMessages]) => (
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
      ))}
      <div ref={messagesEndRef} />
    </>
  );
};
