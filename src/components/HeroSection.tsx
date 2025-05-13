
import React from 'react';

const HeroSection: React.FC = () => {
  return (
    <section className="bg-gradient-to-r from-blue-500 to-blue-700 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">ابحث عن معلم محترف لجميع أعمال المنزل</h1>
            <p className="text-xl mb-6">تواصل مع أفضل المحترفين في مدينتك للقيام بأعمال السباكة، الكهرباء، النجارة وغيرها من الخدمات المنزلية</p>
            
            <div className="bg-white rounded-lg p-1 flex">
              <input type="text" placeholder="ما هي الخدمة التي تبحث عنها؟" className="flex-grow px-4 py-3 arabic-input focus:outline-none text-gray-800 rounded-r-lg" />
              <select className="bg-gray-100 text-gray-700 px-3 py-3 rounded-l-lg focus:outline-none">
                <option>الدار البيضاء</option>
                <option>الرباط</option>
                <option>سلا</option>
              </select>
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300">
                <i className="fas fa-search ml-2"></i> بحث
              </button>
            </div>
            
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-sm">الأكثر بحثاً:</span>
              <a href="#" className="text-sm bg-white bg-opacity-20 px-3 py-1 rounded-full hover:bg-opacity-30">سباك</a>
              <a href="#" className="text-sm bg-white bg-opacity-20 px-3 py-1 rounded-full hover:bg-opacity-30">كهربائي</a>
              <a href="#" className="text-sm bg-white bg-opacity-20 px-3 py-1 rounded-full hover:bg-opacity-30">نجار</a>
              <a href="#" className="text-sm bg-white bg-opacity-20 px-3 py-1 rounded-full hover:bg-opacity-30">دهان</a>
            </div>
          </div>
          
          <div className="md:w-1/2 flex justify-center">
            <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" alt="Handyman at work" className="rounded-lg shadow-xl w-full max-w-md" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
