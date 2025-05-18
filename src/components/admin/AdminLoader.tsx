
import React from 'react';
import { Loader } from 'lucide-react';

const AdminLoader: React.FC<{ message: string }> = ({ message }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center" dir="rtl">
      <Loader className="h-10 w-10 animate-spin text-primary mb-4" />
      <p className="text-lg text-gray-600">{message}</p>
    </div>
  );
};

export default AdminLoader;
