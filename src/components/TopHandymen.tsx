
import React from 'react';
import { Link } from 'react-router-dom';

// Mock data for handymen
const HANDYMEN = [
  {
    id: 1,
    name: "عمر الزياني",
    title: "سباك محترف",
    location: "الدار البيضاء",
    tasks: 120,
    rating: 4.9,
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    coverImage: "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    description: "سباك معتمد بخبرة 8 سنوات في إصلاح جميع أنواع التسربات وتركيب الحمامات والمطابخ."
  },
  {
    id: 2,
    name: "يوسف العلوي",
    title: "كهربائي",
    location: "الرباط",
    tasks: 95,
    rating: 4.8,
    image: "https://randomuser.me/api/portraits/men/45.jpg",
    coverImage: "https://images.unsplash.com/photo-1605152276897-4f618f831968?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    description: "كهربائي معتمد متخصص في إصلاح الأعطال الكهربائية وتركيب الأنظمة الكهربائية المنزلية."
  },
  {
    id: 3,
    name: "محمد أمين",
    title: "نجار ودهان",
    location: "سلا",
    tasks: 78,
    rating: 4.7,
    image: "https://randomuser.me/api/portraits/men/67.jpg",
    coverImage: "https://images.unsplash.com/photo-1600585152220-90363fe7e115?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    description: "نجار ودهان محترف متخصص في تركيب الأثاث ودهان الجدران والأسقف بجودة عالية."
  }
];

const TopHandymen: React.FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">أفضل المحترفين في الدار البيضاء</h2>
          <a href="#" className="text-blue-600 hover:underline">عرض الكل</a>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {HANDYMEN.map((handyman) => (
            <div key={handyman.id} className="handyman-card bg-white rounded-xl shadow-md overflow-hidden transition duration-300">
              <div className="relative">
                <img src={handyman.coverImage} alt={handyman.name} className="w-full h-48 object-cover" />
                <div className="absolute top-3 right-3 bg-yellow-400 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center">
                  <i className="fas fa-star ml-1"></i> {handyman.rating}
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center mb-3">
                  <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden ml-3">
                    <img src={handyman.image} alt={handyman.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">{handyman.name}</h3>
                    <p className="text-sm text-gray-600">{handyman.title}</p>
                  </div>
                </div>
                <div className="flex justify-between text-sm text-gray-600 mb-3">
                  <span><i className="fas fa-map-marker-alt ml-1"></i> {handyman.location}</span>
                  <span><i className="fas fa-briefcase ml-1"></i> {handyman.tasks} مهمة</span>
                </div>
                <p className="text-gray-700 text-sm mb-4">{handyman.description}</p>
                <Link 
                  to={`/handyman/${handyman.id}`} 
                  className="block text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300"
                >
                  تواصل مع المعلم <i className="fas fa-arrow-left ml-2"></i>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopHandymen;
