
import React from 'react';
import { Link } from 'react-router-dom';

const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: 1,
      title: "حدد الخدمة المطلوبة",
      description: "اختر من بين عشرات الخدمات المنزلية المتاحة أو صف ما تحتاجه بالتفصيل"
    },
    {
      number: 2,
      title: "تواصل مع المحترفين",
      description: "ستتلقى عروضاً من محترفين معتمدين في منطقتك مع أسعار وتقييمات"
    },
    {
      number: 3,
      title: "احصل على الخدمة",
      description: "اختر المحترف المناسب وحدد الموعد المثالي لتنفيذ المهمة"
    }
  ];

  return (
    <section id="how-it-works" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">كيف تعمل منصة لمعلم؟</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">3 خطوات بسيطة للحصول على الخدمة التي تحتاجها</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div key={step.number} className="bg-white p-8 rounded-xl shadow-sm text-center">
              <div className="bg-blue-100 w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6 text-blue-600 font-bold text-2xl">
                {step.number}
              </div>
              <h3 className="font-bold text-xl text-gray-800 mb-3">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-12 bg-blue-600 rounded-xl p-8 text-white">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-2/3 mb-6 md:mb-0">
              <h3 className="text-2xl font-bold mb-3">هل أنت محترف وتريد العمل معنا؟</h3>
              <p>انضم إلى شبكة المحترفين المعتمدين لدينا وابدأ في تلقي طلبات العمل من العملاء في منطقتك</p>
            </div>
            <div className="md:w-1/3 text-center md:text-right">
              <Link to="/signup" className="inline-block bg-white text-blue-600 font-bold px-6 py-3 rounded-lg hover:bg-gray-100 transition duration-300">
                سجل كمحترف <i className="fas fa-arrow-left ml-2"></i>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
