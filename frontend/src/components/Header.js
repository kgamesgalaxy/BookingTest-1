import React, { useState, useEffect } from 'react';
import { Menu, X, Phone, Calendar, User, Search } from 'lucide-react';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';
import Logo from './Logo';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-gaming-light/95 backdrop-blur-lg border-b border-gaming-border shadow-gaming-lg' 
        : 'bg-gaming-light/80 backdrop-blur-sm'
    }`}>
      <div className="container mx-auto px-4 py-3 md:py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="cursor-pointer transform hover:scale-105 transition-transform duration-200" onClick={() => navigate('/')}>
            <Logo />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection('games')}
              className="text-gaming-text hover:text-gaming-accent transition-colors duration-200 font-medium relative group"
            >
              Games
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gaming-accent transition-all duration-200 group-hover:w-full"></span>
            </button>
            <button 
              onClick={() => scrollToSection('services')}
              className="text-gaming-text hover:text-gaming-accent transition-colors duration-200 font-medium relative group"
            >
              Services
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gaming-accent transition-all duration-200 group-hover:w-full"></span>
            </button>
            <button 
              onClick={() => navigate('/cancel')}
              className="text-gaming-text hover:text-gaming-accent transition-colors duration-200 font-medium relative group"
            >
              Cancel Booking
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gaming-accent transition-all duration-200 group-hover:w-full"></span>
            </button>
            <button 
              onClick={() => scrollToSection('contact')}
              className="text-gaming-text hover:text-gaming-accent transition-colors duration-200 font-medium relative group"
            >
              Contact
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gaming-accent transition-all duration-200 group-hover:w-full"></span>
            </button>
          </nav>

          {/* Action Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm"
              className="text-gaming-text hover:text-gaming-accent hover:bg-gaming-accent/10"
            >
              <Phone className="w-4 h-4 mr-2" />
              Call
            </Button>
            <Button 
              className="bg-gaming-accent hover:bg-gaming-accent-hover text-gaming-light font-semibold px-6 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-gaming"
              onClick={() => navigate('/booking')}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Book Now
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden p-2 rounded-lg hover:bg-gaming-accent/10 transition-colors duration-200"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? 
              <X className="w-6 h-6 text-gaming-accent" /> : 
              <Menu className="w-6 h-6 text-gaming-text" />
            }
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className={`lg:hidden transition-all duration-300 overflow-hidden ${
          isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <nav className="py-4 space-y-4 border-t border-gaming-border mt-4 bg-gaming-light/95 backdrop-blur-lg rounded-lg shadow-gaming-lg">
            <button 
              onClick={() => scrollToSection('games')}
              className="block w-full text-left text-gaming-text hover:text-gaming-accent hover:bg-gaming-accent/10 transition-colors duration-200 font-medium py-3 px-4 rounded-lg"
            >
              Games
            </button>
            <button 
              onClick={() => scrollToSection('services')}
              className="block w-full text-left text-gaming-text hover:text-gaming-accent hover:bg-gaming-accent/10 transition-colors duration-200 font-medium py-3 px-4 rounded-lg"
            >
              Services
            </button>
            <button 
              onClick={() => scrollToSection('contact')}
              className="block w-full text-left text-gaming-text hover:text-gaming-accent hover:bg-gaming-accent/10 transition-colors duration-200 font-medium py-3 px-4 rounded-lg"
            >
              Contact
            </button>
            <div className="pt-4 space-y-3 px-4">
              <Button 
                variant="ghost" 
                className="w-full justify-center text-gaming-text hover:text-gaming-accent hover:bg-gaming-accent/10 border border-gaming-border"
              >
                <Phone className="w-4 h-4 mr-2" />
                Call Now
              </Button>
              <Button 
                className="w-full bg-gaming-accent hover:bg-gaming-accent-hover text-gaming-light font-semibold shadow-gaming py-3"
                onClick={() => navigate('/booking')}
              >
                <Calendar className="w-4 h-4 mr-2" />
                Book Now
              </Button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;