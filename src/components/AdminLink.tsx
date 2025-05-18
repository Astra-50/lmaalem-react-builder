
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { isUserAdmin } from '@/lib/supabase/admin';

const AdminLink: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const admin = await isUserAdmin();
        setIsAdmin(admin);
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdmin();
  }, []);

  if (isLoading || !isAdmin) {
    return null;
  }

  return (
    <Link 
      to="/admin"
      className="flex items-center p-2 rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
    >
      <span className="mr-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5Z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      </span>
      لوحة التحكم
    </Link>
  );
};

export default AdminLink;
