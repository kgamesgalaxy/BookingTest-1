import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Play, ArrowRight, Gamepad2, Clock, Users, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroSlides = [
    {
      title: "Premium Gaming",
      subtitle: "Experience",
      description: "Discover the finest gaming platforms including PS5, Xbox Series X, Nintendo Switch, VR, and premium board games in our modern facility.",
      image: "https://images.unsplash.com/photo-1634891392987-e91db6bf9557?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1NzZ8MHwxfHNlYXJjaHw0fHxnYW1pbmclMjBzZXR1cHxlbnwwfHx8d2hpdGV8MTc1MzY1NzEwMnww&ixlib=rb-4.1.0&q=85"
    },
    {
      title: "Modern Gaming",
      subtitle: "Setup",
      description: "Experience gaming like never before with our state-of-the-art equipment and comfortable gaming environment.",
      image: "https://images.unsplash.com/photo-1533381309471-b8e57002fc47?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1NzZ8MHwxfHNlYXJjaHwyfHxnYW1pbmclMjBzZXR1cHxlbnwwfHx8d2hpdGV8MTc1MzY1NzEwMnww&ixlib=rb-4.1.0&q=85"
    },
    {
      title: "Clean Gaming",
      subtitle: "Environment",
      description: "Enjoy gaming in our pristine, modern facility designed for comfort and optimal gaming performance.",
      image: "https://images.unsplash.com/photo-1713511129992-a9320f883070?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1NzZ8MHwxfHNlYXJjaHwzfHxnYW1pbmclMjBzZXR1cHxlbnwwfHx8d2hpdGV8MTc1MzY1NzEwMnww&ixlib=rb-4.1.0&q=85"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gaming-lighter via-gaming-light to-gaming-accent-light/20">
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
              className="w-full h-full object-cover opacity-20"
            />
            {/* Clean Light Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-gaming-light/95 via-gaming-light/90 to-gaming-light/95"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-gaming-lighter/98 via-gaming-light/80 to-gaming-lighter/95"></div>
          </div>
        ))}
      </div>

      {/* Subtle Floating Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-gaming-accent/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${4 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-left">
              <div className="inline-flex items-center space-x-2 bg-gaming-light/80 backdrop-blur-sm px-6 py-3 rounded-full border border-gaming-accent/20 mb-8 animate-fade-in-up shadow-gaming">
                <Gamepad2 className="w-5 h-5 text-gaming-accent" />
                <span className="text-gaming-accent font-semibold text-sm tracking-wider uppercase">
                  Karthikeya Games Galaxy
                </span>
              </div>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight animate-fade-in-up delay-200">
                <span className="text-gaming-text">
                  {heroSlides[currentSlide].title}
                </span>
                <br />
                <span className="text-gaming-accent subtle-text">
                  {heroSlides[currentSlide].subtitle}
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-gaming-text-secondary max-w-2xl leading-relaxed mb-10 animate-fade-in-up delay-300">
                {heroSlides[currentSlide].description}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-12 animate-fade-in-up delay-400">
                <Button 
                  size="lg"
                  className="bg-gaming-accent hover:bg-gaming-accent-hover text-gaming-light font-semibold px-8 py-4 text-lg rounded-xl transition-all duration-300 transform hover:scale-105 shadow-gaming-lg group"
                  onClick={() => navigate('/booking')}
                >
                  <Play className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-200" />
                  Book Now
                  <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform duration-200" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-2 border-gaming-accent text-gaming-accent hover:bg-gaming-accent hover:text-gaming-light px-8 py-4 text-lg rounded-xl transition-all duration-300 transform hover:scale-105 backdrop-blur-sm font-semibold shadow-gaming"
                  onClick={() => scrollToSection('games')}
                >
                  <Gamepad2 className="w-5 h-5 mr-3" />
                  View Games
                </Button>
              </div>
            </div>

            {/* Right Content - Stats */}
            <div className="grid grid-cols-1 gap-6 animate-fade-in-up delay-500">
              <div className="bg-gaming-light/80 backdrop-blur-md p-8 rounded-3xl border border-gaming-border shadow-gaming-lg hover:shadow-gaming-glow transition-all duration-300 group">
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-2xl bg-gaming-accent-light text-gaming-accent">
                    <Gamepad2 className="w-8 h-8" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-gaming-accent">5+</div>
                    <div className="text-gaming-text-secondary font-medium">Gaming Platforms</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gaming-light/80 backdrop-blur-md p-8 rounded-3xl border border-gaming-border shadow-gaming-lg hover:shadow-gaming-glow transition-all duration-300 group">
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-2xl bg-gaming-accent-light text-gaming-accent">
                    <Clock className="w-8 h-8" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-gaming-accent">₹150+</div>
                    <div className="text-gaming-text-secondary font-medium">Per Hour</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gaming-light/80 backdrop-blur-md p-8 rounded-3xl border border-gaming-border shadow-gaming-lg hover:shadow-gaming-glow transition-all duration-300 group">
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-2xl bg-gaming-accent-light text-gaming-accent">
                    <Users className="w-8 h-8" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-gaming-accent">100+</div>
                    <div className="text-gaming-text-secondary font-medium">Happy Gamers</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-gaming-accent w-8 shadow-gaming-glow' 
                : 'bg-gaming-border hover:bg-gaming-accent/50 w-6'
            }`}
          />
        ))}
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 right-8 animate-bounce">
        <div className="w-6 h-10 border-2 border-gaming-accent rounded-full flex justify-center shadow-gaming">
          <div className="w-1 h-3 bg-gaming-accent rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;