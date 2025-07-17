import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Services from '../components/Services';
import Pricing from '../components/Pricing';
import Gallery from '../components/Gallery';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-primary text-white">
      <Header />
      <Hero />
      <Services />
      <Pricing />
      <Gallery />
      <Contact />
      <Footer />
    </div>
  );
};

export default HomePage;