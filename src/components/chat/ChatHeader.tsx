
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ChatHeaderProps {
  participantInfo: {
    otherPartyName: string | null;
    otherPartyAvatar: string | null;
    jobTitle: string;
  } | null;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ participantInfo }) => {
  const navigate = useNavigate();
  
  return (
    <>
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
    </>
  );
};
