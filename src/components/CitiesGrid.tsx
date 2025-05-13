
import React from 'react';

const CitiesGrid: React.FC = () => {
  const cities = [
    {
      name: "الدار البيضاء",
      professionals: 120
    },
    {
      name: "الرباط",
      professionals: 85
    },
    {
      name: "سلا",
      professionals: 60
    },
    {
      name: "طنجة",
      professionals: 0,
      comingSoon: true
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">نغطي هذه المدن</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">ابحث عن المحترفين في مدينتك</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {cities.map((city, index) => (
            <a key={index} href="#" className="city-card bg-gray-100 rounded-xl p-6 text-center transition duration-300 hover:bg-blue-50 hover:shadow-md">
              <div className="bg-white w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 shadow-sm">
                <i className="fas fa-city text-blue-600 text-2xl"></i>
              </div>
              <h3 className="font-bold text-gray-800 mb-1">{city.name}</h3>
              <p className="text-sm text-gray-600">
                {city.comingSoon ? "قريباً" : `+${city.professionals} محترف`}
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CitiesGrid;
