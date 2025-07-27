import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Play, Zap, Users, Trophy, ArrowRight, Gamepad2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroSlides = [
    {
      title: "ULTIMATE GAMING",
      subtitle: "EXPERIENCE",
      description: "Immerse yourself in the future of gaming with PS5, Xbox Series X, Nintendo Switch, VR, and premium board games.",
      image: "https://images.unsplash.com/photo-1614179924047-e1ab49a0a0cf?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzF8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBzZXR1cHxlbnwwfHx8fDE3NTI4Mjc5ODF8MA&ixlib=rb-4.1.0&q=85"
    },
    {
      title: "VR GAMING",
      subtitle: "REVOLUTION",
      description: "Step into virtual worlds with cutting-edge VR technology and experience gaming like never before.",
      image: "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2MzR8MHwxfHNlYXJjaHwxfHxWUiUyMGhlYWRzZXR8ZW58MHx8fHwxNzUyODI5NTY0fDA&ixlib=rb-4.1.0&q=85"
    },
    {
      title: "BOARD GAME",
      subtitle: "PARADISE",
      description: "Discover classic and modern board games in our comfortable lounge designed for memorable gaming sessions.",
      image: "https://images.unsplash.com/photo-1632501641765-e568d28b0015?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwzfHxib2FyZCUyMGdhbWVzfGVufDB8fHx8MTc1MjgyODg4NXww&ixlib=rb-4.1.0&q=85"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Slider */}
      <div className="absolute inset-0">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img 
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            {/* Strong Dark Overlay for Better Text Contrast */}
            <div className="absolute inset-0 bg-gaming-dark/90"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-gaming-dark/95 via-gaming-dark/85 to-gaming-dark/90"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-gaming-dark/98 via-gaming-dark/75 to-gaming-dark/85"></div>
          </div>
        ))}
      </div>

      {/* Animated Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-gaming-accent/40 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Content */}
          <div className="mb-8">
            <div className="inline-flex items-center space-x-2 bg-gaming-accent/20 backdrop-blur-sm px-6 py-3 rounded-full border border-gaming-accent/40 mb-8 animate-fade-in-up">
              <Gamepad2 className="w-5 h-5 text-gaming-accent" />
              <span className="text-gaming-accent font-bold text-sm tracking-wider uppercase">
                Premium Gaming Experience
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight animate-fade-in-up delay-200">
              <span className="text-white drop-shadow-2xl" style={{textShadow: '2px 2px 8px rgba(0,0,0,0.8), 0 0 20px rgba(255,255,255,0.1)'}}>
                {heroSlides[currentSlide].title}
              </span>
              <br />
              <span className="text-gaming-accent drop-shadow-2xl neon-text" style={{textShadow: '2px 2px 8px rgba(0,0,0,0.8), 0 0 15px rgba(0, 212, 255, 0.8)'}}>
                {heroSlides[currentSlide].subtitle}
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white max-w-3xl mx-auto leading-relaxed mb-10 animate-fade-in-up delay-300 font-medium" style={{textShadow: '1px 1px 4px rgba(0,0,0,0.8)'}}>
              {heroSlides[currentSlide].description}
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16 animate-fade-in-up delay-400">
            <Button 
              size="lg"
              className="bg-gaming-accent hover:bg-gaming-accent-hover text-gaming-dark font-bold px-10 py-6 text-lg rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-gaming-glow-strong group"
              onClick={() => navigate('/booking')}
            >
              <Play className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform duration-200" />
              Start Gaming Now
              <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform duration-200" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-2 border-white/80 text-white hover:bg-white hover:text-gaming-dark px-10 py-6 text-lg rounded-xl transition-all duration-300 transform hover:scale-105 backdrop-blur-sm font-bold"
              onClick={() => scrollToSection('games')}
            >
              <Zap className="w-6 h-6 mr-3" />
              Explore Games
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto animate-fade-in-up delay-500">
            <div className="bg-gaming-dark/60 backdrop-blur-md p-8 rounded-3xl border border-gaming-accent/20 hover:border-gaming-accent/50 transition-all duration-300 group">
              <div className="text-4xl font-black text-gaming-accent mb-3 group-hover:scale-110 transition-transform duration-200 neon-text">5+</div>
              <div className="text-white/90 font-semibold text-lg">Gaming Platforms</div>
            </div>
            <div className="bg-gaming-dark/60 backdrop-blur-md p-8 rounded-3xl border border-gaming-accent/20 hover:border-gaming-accent/50 transition-all duration-300 group">
              <div className="text-4xl font-black text-gaming-accent mb-3 group-hover:scale-110 transition-transform duration-200 neon-text">₹120</div>
              <div className="text-white/90 font-semibold text-lg">Per Hour</div>
            </div>
            <div className="bg-gaming-dark/60 backdrop-blur-md p-8 rounded-3xl border border-gaming-accent/20 hover:border-gaming-accent/50 transition-all duration-300 group">
              <div className="text-4xl font-black text-gaming-accent mb-3 group-hover:scale-110 transition-transform duration-200 neon-text">100+</div>
              <div className="text-white/90 font-semibold text-lg">Happy Gamers</div>
            </div>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex space-x-4">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-1 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-gaming-accent w-12 shadow-gaming-glow' 
                : 'bg-white/40 hover:bg-white/60 w-8'
            }`}
          />
        ))}
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 right-8 animate-bounce">
        <div className="w-6 h-10 border-2 border-gaming-accent rounded-full flex justify-center shadow-gaming-glow">
          <div className="w-1 h-3 bg-gaming-accent rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;