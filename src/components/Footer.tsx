
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Column 1 */}
          <div>
            <Link to="/" className="text-2xl font-bold text-white flex items-center mb-4">
              <i className="fas fa-hammer ml-2"></i>
              <span>Lmaalem</span>
            </Link>
            <p className="text-gray-400 mb-4">منصة لمعلم توفر حلولاً سهلة وسريعة لجميع احتياجاتك المنزلية من خلال ربطك بأفضل المحترفين في مدينتك.</p>
            <div className="flex space-x-4 space-x-reverse">
              <a href="#" className="text-gray-400 hover:text-white"><i className="fab fa-facebook-f"></i></a>
              <a href="#" className="text-gray-400 hover:text-white"><i className="fab fa-twitter"></i></a>
              <a href="#" className="text-gray-400 hover:text-white"><i className="fab fa-instagram"></i></a>
              <a href="#" className="text-gray-400 hover:text-white"><i className="fab fa-linkedin-in"></i></a>
            </div>
          </div>
          
          {/* Column 2 */}
          <div>
            <h3 className="font-bold text-lg mb-4">روابط سريعة</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-white">الرئيسية</Link></li>
              <li><a href="/#services" className="text-gray-400 hover:text-white">الخدمات</a></li>
              <li><a href="/#how-it-works" className="text-gray-400 hover:text-white">كيف تعمل</a></li>
              <li><a href="#about" className="text-gray-400 hover:text-white">عن لمعلم</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">تواصل معنا</a></li>
            </ul>
          </div>
          
          {/* Column 3 */}
          <div>
            <h3 className="font-bold text-lg mb-4">الخدمات</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white">السباكة</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">الكهرباء</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">الدهان</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">النجارة</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">جميع الخدمات</a></li>
            </ul>
          </div>
          
          {/* Column 4 */}
          <div>
            <h3 className="font-bold text-lg mb-4">تواصل معنا</h3>
            <ul className="space-y-2">
              <li className="flex items-center text-gray-400">
                <i className="fas fa-map-marker-alt ml-2 text-blue-500"></i> الدار البيضاء، المغرب
              </li>
              <li className="flex items-center text-gray-400">
                <i className="fas fa-phone ml-2 text-blue-500"></i> +212 6 12 34 56 78
              </li>
              <li className="flex items-center text-gray-400">
                <i className="fas fa-envelope ml-2 text-blue-500"></i> contact@lmaalem.com
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">© 2023 Lmaalem. جميع الحقوق محفوظة.</p>
            <div className="flex space-x-6 space-x-reverse">
              <a href="#" className="text-gray-400 hover:text-white text-sm">شروط الاستخدام</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm">سياسة الخصوصية</a>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 left-6 z-50">
        <Link to="/post-job" className="w-14 h-14 bg-blue-600 rounded-full shadow-lg flex items-center justify-center text-white hover:bg-blue-700 transition duration-300">
          <i className="fas fa-plus text-xl"></i>
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
