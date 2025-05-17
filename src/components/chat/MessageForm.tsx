
import React, { useState } from 'react';
import { Loader, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface MessageFormProps {
  onSendMessage: (message: string) => Promise<void>;
  isSending: boolean;
}

export const MessageForm: React.FC<MessageFormProps> = ({ onSendMessage, isSending }) => {
  const [newMessage, setNewMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    await onSendMessage(newMessage.trim());
    setNewMessage('');
  };

  return (
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
  );
};
