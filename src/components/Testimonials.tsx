
import React from 'react';

const Testimonials: React.FC = () => {
  const testimonials = [
    {
      id: 1,
      name: "سارة الفاسي",
      image: "https://randomuser.me/api/portraits/women/32.jpg",
      rating: 5,
      text: "استفدت من خدمات السباكة عبر المنصة وكانت تجربة رائعة. المعلم كان محترفاً جداً وأنهى العمل في الوقت المحدد وبجودة عالية. سأستخدم المنصة دائماً للحصول على الخدمات المنزلية."
    },
    {
      id: 2,
      name: "أحمد الرباطي",
      image: "https://randomuser.me/api/portraits/men/54.jpg",
      rating: 5,
      text: "كنت بحاجة إلى كهربائي لإصلاح عطل في منزلي، وبفضل منصة لمعلم وجدت محترفاً ممتازاً في منطقتي. السعر كان مناسباً والعمل تم بإتقان. شكراً لمعلم على هذه الخدمة المميزة."
    },
    {
      id: 3,
      name: "نورا السلاوي",
      image: "https://randomuser.me/api/portraits/women/68.jpg",
      rating: 4.5,
      text: "استعنت بمعلم لدهان شقتي الجديدة وكان اختياراً موفقاً. المحترف الذي تواصلت معه عبر المنصة كان دقيقاً في الموعد ومهتماً بكل التفاصيل. النتيجة كانت أفضل مما توقعت وسعر مناسب."
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">آراء عملائنا</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">ما يقوله عملاؤنا عن تجربتهم مع منصة لمعلم</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden ml-3">
                  <img src={testimonial.image} alt={testimonial.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">{testimonial.name}</h4>
                  <div className="flex text-yellow-400 text-sm">
                    {[...Array(Math.floor(testimonial.rating))].map((_, i) => (
                      <i key={i} className="fas fa-star"></i>
                    ))}
                    {testimonial.rating % 1 !== 0 && <i className="fas fa-star-half-alt"></i>}
                  </div>
                </div>
              </div>
              <p className="text-gray-700">{testimonial.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
