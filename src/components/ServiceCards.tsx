
import React from 'react';

const ServiceCards: React.FC = () => {
  const services = [
    {
      icon: "fas fa-faucet",
      title: "السباكة",
      description: "إصلاح تسربات المياه، تركيب الحمامات وغيرها"
    },
    {
      icon: "fas fa-bolt",
      title: "الكهرباء",
      description: "إصلاح الأعطال الكهربائية، تركيب الإنارة"
    },
    {
      icon: "fas fa-paint-roller",
      title: "الدهان",
      description: "دهان الجدران، الأسقف، الأبواب والنوافذ"
    },
    {
      icon: "fas fa-couch",
      title: "النجارة",
      description: "تركيب الأثاث، إصلاح الأبواب والنوافذ"
    },
    {
      icon: "fas fa-tools",
      title: "أعمال عامة",
      description: "جميع الأعمال المنزلية التي تحتاجها"
    }
  ];

  return (
    <section id="services" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">خدماتنا الشائعة</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">اختر من بين مجموعة واسعة من الخدمات المنزلية التي يقدمها محترفون معتمدون</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {services.map((service, index) => (
            <a key={index} href="#" className="service-card bg-white rounded-xl shadow-md p-6 text-center transition duration-300 hover:shadow-lg">
              <div className="bg-blue-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <i className={`${service.icon} text-blue-600 text-2xl`}></i>
              </div>
              <h3 className="font-bold text-gray-800 mb-1">{service.title}</h3>
              <p className="text-sm text-gray-600">{service.description}</p>
            </a>
          ))}
        </div>
        
        <div className="text-center mt-10">
          <a href="#" className="inline-block border-2 border-blue-600 text-blue-600 font-bold px-6 py-3 rounded-lg hover:bg-blue-600 hover:text-white transition duration-300">
            عرض جميع الخدمات <i className="fas fa-arrow-left ml-2"></i>
          </a>
        </div>
      </div>
    </section>
  );
};

export default ServiceCards;
