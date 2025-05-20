
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setIsLoggedIn(!!data.session);
    };
    
    checkAuth();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsLoggedIn(!!session);
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-blue-600 flex items-center">
              <i className="fas fa-hammer ml-2"></i>
              <span>Lmaalem</span>
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={toggleMobileMenu} className="text-gray-700 focus:outline-none">
              <i className="fas fa-bars text-2xl"></i>
            </button>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6 space-x-reverse">
            <Link to="/" className="text-gray-700 hover:text-blue-600">الرئيسية</Link>
            <Link to="/jobs" className="text-gray-700 hover:text-blue-600">المهام</Link>
            <a href="/#services" className="text-gray-700 hover:text-blue-600">الخدمات</a>
            <a href="/#how-it-works" className="text-gray-700 hover:text-blue-600">كيف تعمل</a>
            
            {isLoggedIn ? (
              <div className="relative">
                <button 
                  className="text-gray-700 hover:text-blue-600 flex items-center"
                  onClick={toggleUserMenu}
                >
                  <span>حسابي</span>
                  <i className="fas fa-chevron-down mr-1 text-sm"></i>
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <Link to="/dashboard" className="block px-4 py-2 text-gray-700 hover:bg-blue-50">لوحة التحكم</Link>
                    <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-blue-50">الملف الشخصي</Link>
                    <div className="border-t border-gray-200"></div>
                    <button onClick={handleLogout} className="w-full text-right block px-4 py-2 text-gray-700 hover:bg-blue-50">تسجيل الخروج</button>
                  </div>
                )}
              </div>
            ) : (
              <div className="relative">
                <button 
                  className="text-gray-700 hover:text-blue-600 flex items-center"
                  onClick={toggleUserMenu}
                >
                  <span>الدخول</span>
                  <i className="fas fa-chevron-down mr-1 text-sm"></i>
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <Link to="/login" className="block px-4 py-2 text-gray-700 hover:bg-blue-50">تسجيل الدخول</Link>
                    <Link to="/signup" className="block px-4 py-2 text-gray-700 hover:bg-blue-50">إنشاء حساب</Link>
                    <div className="border-t border-gray-200"></div>
                    <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-blue-50">للمحترفين</a>
                  </div>
                )}
              </div>
            )}
            
            <Link to="/post-job" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300">
              <i className="fas fa-plus ml-1"></i> نشر مهمة
            </Link>
          </div>
        </div>
        
        {/* Mobile Menu */}
        <div className={`${mobileMenuOpen ? 'block' : 'hidden'} md:hidden mt-4 pb-3`}>
          <Link to="/" className="block py-2 text-gray-700 hover:text-blue-600">الرئيسية</Link>
          <Link to="/jobs" className="block py-2 text-gray-700 hover:text-blue-600">المهام</Link>
          <a href="/#services" className="block py-2 text-gray-700 hover:text-blue-600">الخدمات</a>
          <a href="/#how-it-works" className="block py-2 text-gray-700 hover:text-blue-600">كيف تعمل</a>
          <div className="border-t border-gray-200 my-2"></div>
          
          {isLoggedIn ? (
            <>
              <Link to="/dashboard" className="block py-2 text-gray-700 hover:text-blue-600">لوحة التحكم</Link>
              <Link to="/profile" className="block py-2 text-gray-700 hover:text-blue-600">الملف الشخصي</Link>
              <button onClick={handleLogout} className="block w-full text-right py-2 text-gray-700 hover:text-blue-600">تسجيل الخروج</button>
            </>
          ) : (
            <>
              <Link to="/login" className="block py-2 text-gray-700 hover:text-blue-600">تسجيل الدخول</Link>
              <Link to="/signup" className="block py-2 text-gray-700 hover:text-blue-600">إنشاء حساب</Link>
              <a href="#" className="block py-2 text-gray-700 hover:text-blue-600">للمحترفين</a>
            </>
          )}
          
          <div className="mt-2">
            <Link to="/post-job" className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300">
              <i className="fas fa-plus ml-1"></i> نشر مهمة
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
