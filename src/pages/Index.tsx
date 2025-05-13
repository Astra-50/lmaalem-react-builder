
import React from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import ServiceCards from '@/components/ServiceCards';
import HowItWorks from '@/components/HowItWorks';
import TopHandymen from '@/components/TopHandymen';
import Testimonials from '@/components/Testimonials';
import CitiesGrid from '@/components/CitiesGrid';
import CallToAction from '@/components/CallToAction';
import Footer from '@/components/Footer';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <HeroSection />
      <ServiceCards />
      <HowItWorks />
      <TopHandymen />
      <Testimonials />
      <CitiesGrid />
      <CallToAction />
      <Footer />
    </div>
  );
};

export default Index;
