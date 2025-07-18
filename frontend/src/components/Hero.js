import React from 'react';
import { Button } from './ui/button';
import { Play, Calendar, Users, Clock, Star, Zap, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const features = [
    { icon: <Users className="w-5 h-5" />, text: "All Ages Welcome" },
    { icon: <Clock className="w-5 h-5" />, text: "Hourly Pricing" },
    { icon: <Calendar className="w-5 h-5" />, text: "Easy Booking" },
    { icon: <Star className="w-5 h-5" />, text: "Premium Experience" }
  ];

  const stats = [
    { number: "5+", label: "Gaming Platforms", icon: <Zap className="w-8 h-8" /> },
    { number: "₹120", label: "Per Hour", icon: <Trophy className="w-8 h-8" /> },
    { number: "100+", label: "Happy Gamers", icon: <Users className="w-8 h-8" /> }
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-primary">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-64 h-64 bg-accent-primary opacity-5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent-primary opacity-3 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-accent-primary opacity-10 rounded-full blur-2xl animate-bounce"></div>
      </div>

      {/* Hero Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1614179924047-e1ab49a0a0cf?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzF8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBzZXR1cHxlbnwwfHx8fDE3NTI4Mjc5ODF8MA&ixlib=rb-4.1.0&q=85"
          alt="Modern Gaming Setup"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-bg-primary via-bg-primary/80 to-bg-primary/60"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto text-center">
          {/* Main Heading with Animation */}
          <div className="mb-8 space-y-4">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-text-primary leading-tight">
              <span className="block transform transition-all duration-1000 hover:scale-105">
                Ultimate Gaming Experience
              </span>
              <span className="block text-accent-primary transform transition-all duration-1000 hover:scale-105 delay-300">
                For All Ages
              </span>
            </h1>
            
            {/* Animated Subheading */}
            <div className="relative">
              <p className="text-lg md:text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed transform transition-all duration-1000 hover:text-text-primary">
                Dive into the world of gaming at Karthikeya Games Galaxy! PlayStation 5, Xbox Series X, Nintendo Switch, VR, and Board Games - all under one roof with premium gaming setups.
              </p>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-accent-primary rounded-full"></div>
            </div>
          </div>

          {/* Interactive Features */}
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="flex items-center space-x-2 bg-bg-secondary/80 backdrop-blur-sm px-4 py-2 rounded-full border border-border-subtle hover:border-accent-primary transition-all duration-300 hover:scale-105 hover:bg-bg-secondary group cursor-pointer"
              >
                <div className="text-accent-primary group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <span className="text-text-secondary group-hover:text-text-primary transition-colors duration-300">
                  {feature.text}
                </span>
              </div>
            ))}
          </div>

          {/* CTA Buttons with Enhanced Styling */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button 
              size="lg"
              className="bg-accent-primary text-bg-primary hover:bg-accent-hover transform hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-accent-primary/25 group relative overflow-hidden"
              onClick={() => navigate('/booking')}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
              Book Your Gaming Session
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-accent-primary text-accent-primary hover:bg-accent-primary hover:text-bg-primary transform hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-accent-primary/25 group"
              onClick={() => scrollToSection('services')}
            >
              <Zap className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
              Explore Games
            </Button>
          </div>

          {/* Enhanced Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="bg-bg-secondary/80 backdrop-blur-sm p-6 rounded-2xl border border-border-subtle hover:border-accent-primary transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-accent-primary/10 group cursor-pointer relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="text-accent-primary mb-3 flex justify-center group-hover:scale-110 transition-transform duration-300">
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold text-accent-primary mb-2 group-hover:scale-105 transition-transform duration-300">
                    {stat.number}
                  </div>
                  <div className="text-text-secondary group-hover:text-text-primary transition-colors duration-300">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Animation Elements */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-accent-primary rounded-full flex justify-center">
          <div className="w-1 h-3 bg-accent-primary rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;