
import { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
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
            <a href="/#services" className="text-gray-700 hover:text-blue-600">الخدمات</a>
            <a href="/#how-it-works" className="text-gray-700 hover:text-blue-600">كيف تعمل</a>
            <a href="/#about" className="text-gray-700 hover:text-blue-600">عن لمعلم</a>
            
            <div className="dropdown relative">
              <button className="text-gray-700 hover:text-blue-600 flex items-center">
                <span>الدخول</span>
                <i className="fas fa-chevron-down mr-1 text-sm"></i>
              </button>
              <div className="dropdown-menu absolute hidden right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                <Link to="/login" className="block px-4 py-2 text-gray-700 hover:bg-blue-50">تسجيل الدخول</Link>
                <Link to="/signup" className="block px-4 py-2 text-gray-700 hover:bg-blue-50">إنشاء حساب</Link>
                <div className="border-t border-gray-200"></div>
                <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-blue-50">للمحترفين</a>
              </div>
            </div>
            
            <Link to="/post-job" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300">
              <i className="fas fa-plus ml-1"></i> نشر مهمة
            </Link>
          </div>
        </div>
        
        {/* Mobile Menu */}
        <div className={`${mobileMenuOpen ? 'block' : 'hidden'} md:hidden mt-4 pb-3`}>
          <Link to="/" className="block py-2 text-gray-700 hover:text-blue-600">الرئيسية</Link>
          <a href="/#services" className="block py-2 text-gray-700 hover:text-blue-600">الخدمات</a>
          <a href="/#how-it-works" className="block py-2 text-gray-700 hover:text-blue-600">كيف تعمل</a>
          <a href="/#about" className="block py-2 text-gray-700 hover:text-blue-600">عن لمعلم</a>
          <div className="border-t border-gray-200 my-2"></div>
          <Link to="/login" className="block py-2 text-gray-700 hover:text-blue-600">تسجيل الدخول</Link>
          <Link to="/signup" className="block py-2 text-gray-700 hover:text-blue-600">إنشاء حساب</Link>
          <a href="#" className="block py-2 text-gray-700 hover:text-blue-600">للمحترفين</a>
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
