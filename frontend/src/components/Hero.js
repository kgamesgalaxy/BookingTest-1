import React from 'react';
import { Button } from './ui/button';
import { Play, Calendar, Users, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative py-20 px-4 bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-primary">
      <div className="container mx-auto">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl font-bold text-text-primary mb-6 leading-tight">
            Ultimate Gaming Experience
            <span className="block text-accent-primary">For All Ages</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-text-secondary mb-8 max-w-2xl mx-auto">
            Dive into the world of gaming at Karthikeya Games Galaxy! PlayStation, Xbox, Nintendo Switch, VR, and Board Games - all under one roof.
          </p>

          {/* Key Features */}
          <div className="flex flex-wrap justify-center gap-6 mb-10">
            <div className="flex items-center space-x-2 text-text-secondary">
              <Users className="w-5 h-5 text-accent-primary" />
              <span>All Ages Welcome</span>
            </div>
            <div className="flex items-center space-x-2 text-text-secondary">
              <Clock className="w-5 h-5 text-accent-primary" />
              <span>Hourly Pricing</span>
            </div>
            <div className="flex items-center space-x-2 text-text-secondary">
              <Calendar className="w-5 h-5 text-accent-primary" />
              <span>Easy Booking</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-accent-primary text-bg-primary hover:bg-accent-hover transform hover:scale-105 transition-all duration-200"
              onClick={() => navigate('/booking')}
            >
              <Play className="w-5 h-5 mr-2" />
              Book Your Gaming Session
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-accent-primary text-accent-primary hover:bg-accent-primary hover:text-bg-primary"
              onClick={() => scrollToSection('services')}
            >
              Explore Games
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-bg-secondary p-6 rounded-lg border border-border-subtle">
              <div className="text-3xl font-bold text-accent-primary mb-2">5+</div>
              <div className="text-text-secondary">Gaming Platforms</div>
            </div>
            <div className="bg-bg-secondary p-6 rounded-lg border border-border-subtle">
              <div className="text-3xl font-bold text-accent-primary mb-2">₹120</div>
              <div className="text-text-secondary">Per Hour</div>
            </div>
            <div className="bg-bg-secondary p-6 rounded-lg border border-border-subtle">
              <div className="text-3xl font-bold text-accent-primary mb-2">100+</div>
              <div className="text-text-secondary">Happy Gamers</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;