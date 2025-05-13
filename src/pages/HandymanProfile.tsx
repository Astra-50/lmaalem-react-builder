
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Mock data for handymen - in a real app, this would come from Supabase
const HANDYMEN = [
  {
    id: "1",
    name: "عمر الزياني",
    title: "سباك محترف",
    location: "الدار البيضاء",
    tasks: 120,
    rating: 4.9,
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    coverImage: "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    description: "سباك معتمد بخبرة 8 سنوات في إصلاح جميع أنواع التسربات وتركيب الحمامات والمطابخ.",
    services: ["تركيب حنفيات", "إصلاح تسربات", "تركيب سخانات المياه", "تركيب وصيانة المراحيض"],
    reviews: [
      { id: 1, user: "أحمد", avatar: "https://randomuser.me/api/portraits/men/54.jpg", rating: 5, comment: "عمل ممتاز وسريع. أنصح بالتعامل معه." },
      { id: 2, user: "سارة", avatar: "https://randomuser.me/api/portraits/women/32.jpg", rating: 5, comment: "خدمة احترافية وسعر مناسب. شكراً جزيلاً." },
      { id: 3, user: "محمد", avatar: "https://randomuser.me/api/portraits/men/45.jpg", rating: 4, comment: "قام بإصلاح التسرب بشكل جيد ولكن تأخر قليلاً عن الموعد." }
    ],
    phone: "+212612345678",
    email: "omar.ziani@lmaalem.com"
  },
  {
    id: "2",
    name: "يوسف العلوي",
    title: "كهربائي",
    location: "الرباط",
    tasks: 95,
    rating: 4.8,
    image: "https://randomuser.me/api/portraits/men/45.jpg",
    coverImage: "https://images.unsplash.com/photo-1605152276897-4f618f831968?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    description: "كهربائي معتمد متخصص في إصلاح الأعطال الكهربائية وتركيب الأنظمة الكهربائية المنزلية.",
    services: ["إصلاح الأعطال الكهربائية", "تركيب المصابيح", "تأسيس الكهرباء", "تركيب لوحات الكهرباء"],
    reviews: [
      { id: 1, user: "سمير", avatar: "https://randomuser.me/api/portraits/men/22.jpg", rating: 5, comment: "خدمة مميزة وسريعة." },
      { id: 2, user: "ليلى", avatar: "https://randomuser.me/api/portraits/women/65.jpg", rating: 4, comment: "عمل جيد ولكن السعر كان مرتفعاً قليلاً." }
    ],
    phone: "+212698765432",
    email: "youssef.alaoui@lmaalem.com"
  },
  {
    id: "3",
    name: "محمد أمين",
    title: "نجار ودهان",
    location: "سلا",
    tasks: 78,
    rating: 4.7,
    image: "https://randomuser.me/api/portraits/men/67.jpg",
    coverImage: "https://images.unsplash.com/photo-1600585152220-90363fe7e115?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    description: "نجار ودهان محترف متخصص في تركيب الأثاث ودهان الجدران والأسقف بجودة عالية.",
    services: ["تركيب أثاث", "دهان جدران", "إصلاح أبواب ونوافذ", "تصميم وتنفيذ ديكورات خشبية"],
    reviews: [
      { id: 1, user: "نادية", avatar: "https://randomuser.me/api/portraits/women/42.jpg", rating: 5, comment: "عمل احترافي وإتقان في التنفيذ." },
      { id: 2, user: "حسن", avatar: "https://randomuser.me/api/portraits/men/33.jpg", rating: 5, comment: "دقيق في الموعد وملتزم بما تم الاتفاق عليه." }
    ],
    phone: "+212677889900",
    email: "mohamed.amine@lmaalem.com"
  }
];

const HandymanProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const handyman = HANDYMEN.find(h => h.id === id);

  if (!handyman) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow container mx-auto px-4 py-12 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">المعلم غير موجود</h1>
            <p className="text-gray-600 mb-6">لم يتم العثور على المعلم المطلوب.</p>
            <Link to="/" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300">
              العودة إلى الصفحة الرئيسية
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className="flex-grow">
        {/* Cover and Profile Section */}
        <div className="relative">
          <div className="h-60 w-full bg-gray-300 overflow-hidden">
            <img src={handyman.coverImage} alt="Cover" className="w-full h-full object-cover" />
          </div>
          <div className="container mx-auto px-4">
            <div className="bg-white rounded-xl shadow-md p-6 -mt-16 relative z-10">
              <div className="flex flex-col md:flex-row items-start md:items-center">
                <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden mb-4 md:mb-0 md:ml-6">
                  <img src={handyman.image} alt={handyman.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-grow">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-2">
                    <h1 className="text-2xl font-bold">{handyman.name}</h1>
                    <div className="flex items-center bg-yellow-400 text-white px-3 py-1 rounded-full text-sm mt-2 md:mt-0">
                      <i className="fas fa-star ml-1"></i>
                      <span>{handyman.rating}</span>
                    </div>
                  </div>
                  <p className="text-blue-600 font-semibold">{handyman.title}</p>
                  <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                    <span><i className="fas fa-map-marker-alt ml-1"></i> {handyman.location}</span>
                    <span><i className="fas fa-briefcase ml-1"></i> {handyman.tasks} مهمة</span>
                    <span><i className="fas fa-clock ml-1"></i> ينضم للطلبات في غضون ساعة</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Content Section */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* About */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold mb-4">نبذة عن المعلم</h2>
                <p className="text-gray-700">{handyman.description}</p>
              </div>
              
              {/* Services */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold mb-4">الخدمات</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {handyman.services.map((service, index) => (
                    <div key={index} className="flex items-center">
                      <i className="fas fa-check text-green-500 ml-2"></i>
                      <span>{service}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Reviews */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">التقييمات</h2>
                  <span className="text-gray-600">{handyman.reviews.length} تقييم</span>
                </div>
                
                <div className="space-y-6">
                  {handyman.reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-200 pb-6 last:border-0 last:pb-0">
                      <div className="flex items-start">
                        <div className="w-12 h-12 rounded-full overflow-hidden ml-4">
                          <img src={review.avatar} alt={review.user} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-grow">
                          <div className="flex justify-between">
                            <h4 className="font-bold">{review.user}</h4>
                            <div className="flex text-yellow-400">
                              {[...Array(review.rating)].map((_, i) => (
                                <i key={i} className="fas fa-star"></i>
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-700 mt-1">{review.comment}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Contact Card */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="font-bold text-lg mb-4">تواصل مع المعلم</h3>
                
                <Link
                  to="/post-job"
                  className="block w-full bg-blue-600 text-white text-center py-3 rounded-lg hover:bg-blue-700 transition duration-300 mb-4"
                >
                  <i className="fas fa-plus ml-2"></i> نشر مهمة
                </Link>
                
                <div className="space-y-4">
                  <a href={`tel:${handyman.phone}`} className="flex items-center text-gray-700 hover:text-blue-600">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center ml-3">
                      <i className="fas fa-phone text-blue-600"></i>
                    </div>
                    <span>{handyman.phone}</span>
                  </a>
                  
                  <a href={`mailto:${handyman.email}`} className="flex items-center text-gray-700 hover:text-blue-600">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center ml-3">
                      <i className="fas fa-envelope text-blue-600"></i>
                    </div>
                    <span>{handyman.email}</span>
                  </a>
                  
                  <a href="#" className="flex items-center text-gray-700 hover:text-blue-600">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center ml-3">
                      <i className="fab fa-whatsapp text-blue-600"></i>
                    </div>
                    <span>تواصل عبر واتساب</span>
                  </a>
                </div>
              </div>
              
              {/* Availability Card */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="font-bold text-lg mb-4">أوقات العمل</h3>
                <ul className="space-y-2">
                  <li className="flex justify-between">
                    <span>الاثنين - الجمعة</span>
                    <span>8:00 - 18:00</span>
                  </li>
                  <li className="flex justify-between">
                    <span>السبت</span>
                    <span>9:00 - 16:00</span>
                  </li>
                  <li className="flex justify-between">
                    <span>الأحد</span>
                    <span>مغلق</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default HandymanProfile;
