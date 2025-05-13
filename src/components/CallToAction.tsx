
import React from 'react';
import { Link } from 'react-router-dom';

const CallToAction: React.FC = () => {
  return (
    <section className="py-16 bg-blue-600 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">هل لديك مهمة تحتاج إلى إنجاز؟</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">انشر مهمتك الآن وسيتواصل معك المحترفون المناسبون في دقائق</p>
        <Link to="/post-job" className="inline-block bg-white text-blue-600 font-bold px-8 py-4 rounded-lg hover:bg-gray-100 transition duration-300 text-lg">
          نشر مهمة جديدة <i className="fas fa-arrow-left ml-2"></i>
        </Link>
      </div>
    </section>
  );
};

export default CallToAction;
