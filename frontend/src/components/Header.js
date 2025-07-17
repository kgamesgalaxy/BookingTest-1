import React, { useState } from 'react';
import { Menu, X, Gamepad2, Phone } from 'lucide-react';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-secondary border-b border-border-subtle sticky top-0 z-50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Gamepad2 className="w-8 h-8 text-accent-primary" />
            <h1 className="text-2xl font-bold text-accent-primary">
              Karthikeya Games Galaxy
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection('services')}
              className="text-text-secondary hover:text-accent-primary transition-colors"
            >
              Services
            </button>
            <button 
              onClick={() => scrollToSection('pricing')}
              className="text-text-secondary hover:text-accent-primary transition-colors"
            >
              Pricing
            </button>
            <button 
              onClick={() => scrollToSection('gallery')}
              className="text-text-secondary hover:text-accent-primary transition-colors"
            >
              Gallery
            </button>
            <button 
              onClick={() => scrollToSection('contact')}
              className="text-text-secondary hover:text-accent-primary transition-colors"
            >
              Contact
            </button>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm"
              className="text-text-secondary hover:text-accent-primary"
            >
              <Phone className="w-4 h-4 mr-2" />
              Call Now
            </Button>
            <Button 
              className="bg-accent-primary text-bg-primary hover:bg-accent-hover"
              onClick={() => navigate('/booking')}
            >
              Book Now
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-border-subtle">
            <div className="flex flex-col space-y-4 mt-4">
              <button 
                onClick={() => scrollToSection('services')}
                className="text-text-secondary hover:text-accent-primary transition-colors text-left"
              >
                Services
              </button>
              <button 
                onClick={() => scrollToSection('pricing')}
                className="text-text-secondary hover:text-accent-primary transition-colors text-left"
              >
                Pricing
              </button>
              <button 
                onClick={() => scrollToSection('gallery')}
                className="text-text-secondary hover:text-accent-primary transition-colors text-left"
              >
                Gallery
              </button>
              <button 
                onClick={() => scrollToSection('contact')}
                className="text-text-secondary hover:text-accent-primary transition-colors text-left"
              >
                Contact
              </button>
              <Button 
                className="bg-accent-primary text-bg-primary hover:bg-accent-hover w-full"
                onClick={() => navigate('/booking')}
              >
                Book Now
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;