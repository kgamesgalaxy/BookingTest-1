import React, { useEffect } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import HeroBot from '../components/HeroBot';
import FeaturedGames from '../components/FeaturedGames';
import LatestGames from '../components/LatestGames';
import Announcements from '../components/Announcements';
import Services from '../components/Services';
import Gallery from '../components/Gallery';
import Pricing from '../components/Pricing';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import ScrollReveal from '../components/ui/scroll-reveal';

const HomePage = () => {
  // Set page title
  useEffect(() => {
    document.title = "Karthikeya's Games Galaxy - Don't be bored , get ON-BOARD";
  }, []);

  return (
    <div className="min-h-screen bg-gaming-lighter text-gaming-text overflow-x-hidden">
      <Header />
      <Hero />
      <div className="container mx-auto px-4 -mt-12">
        <ScrollReveal effect="sr-zoom-in">
          <HeroBot />
        </ScrollReveal>
      </div>
      <ScrollReveal><LatestGames /></ScrollReveal>
      <ScrollReveal><FeaturedGames /></ScrollReveal>
      <ScrollReveal><Announcements /></ScrollReveal>
      <ScrollReveal><Services /></ScrollReveal>
      <ScrollReveal><Contact /></ScrollReveal>
      <Footer />
    </div>
  );
};

export default HomePage;