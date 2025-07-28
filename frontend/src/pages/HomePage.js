import React, { useEffect } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import FeaturedGames from '../components/FeaturedGames';
import Services from '../components/Services';
import Gallery from '../components/Gallery';
import Pricing from '../components/Pricing';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

const HomePage = () => {
  // Set page title
  useEffect(() => {
    document.title = "Karthikeya's Games Galaxy - Don't be bored , get ON-BOARD";
  }, []);

  return (
    <div className="min-h-screen bg-gaming-lighter text-gaming-text overflow-x-hidden">
      <Header />
      <Hero />
      <FeaturedGames />
      <Services />
      <Contact />
      <Footer />
    </div>
  );
};

export default HomePage;