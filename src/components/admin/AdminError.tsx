
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface AdminErrorProps {
  title: string;
  message: string;
}

const AdminError: React.FC<AdminErrorProps> = ({ title, message }) => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4" dir="rtl">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
        <h2 className="text-xl font-semibold text-red-700 mb-2">{title}</h2>
        <p className="text-gray-700 mb-4">{message}</p>
        <button 
          onClick={() => navigate('/')} 
          className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition-colors"
        >
          العودة للصفحة الرئيسية
        </button>
      </div>
    </div>
  );
};

export default AdminError;
