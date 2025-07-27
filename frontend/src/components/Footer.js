import React from 'react';
import { Phone, Mail, MapPin, Clock, Facebook, Twitter, Instagram, Youtube, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Logo from './Logo';

const Footer = () => {
  const navigate = useNavigate();
  
  const quickLinks = [
    { name: 'Home', href: '#' },
    { name: 'Services', href: '#services' },
    { name: 'Games', href: '#games' },
    { name: 'Contact', href: '#contact' },
    { name: 'Book Now', href: '/booking', isButton: true }
  ];

  const gamingServices = [
    { name: 'PlayStation 5', href: '#' },
    { name: 'Xbox Series X', href: '#' },
    { name: 'Nintendo Switch', href: '#' },
    { name: 'VR Gaming', href: '#' },
    { name: 'Board Games', href: '#' }
  ];

  const socialLinks = [
    { name: 'Facebook', icon: <Facebook className="w-5 h-5" />, href: '#' },
    { name: 'Twitter', icon: <Twitter className="w-5 h-5" />, href: '#' },
    { name: 'Instagram', icon: <Instagram className="w-5 h-5" />, href: '#' },
    { name: 'YouTube', icon: <Youtube className="w-5 h-5" />, href: '#' }
  ];

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-gaming-light border-t border-gaming-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Logo />
            <p className="text-gaming-text-secondary text-sm">
              Your ultimate gaming destination. Experience the best in console gaming, VR, and board games all under one roof.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="w-10 h-10 bg-gaming-accent-light rounded-lg flex items-center justify-center text-gaming-text-secondary hover:bg-gaming-accent hover:text-gaming-light transition-all duration-200"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-gaming-text mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  {link.isButton ? (
                    <button
                      onClick={() => navigate(link.href)}
                      className="text-gaming-text-secondary hover:text-gaming-accent transition-colors text-sm"
                    >
                      {link.name}
                    </button>
                  ) : (
                    <button
                      onClick={() => link.href.startsWith('#') ? scrollToSection(link.href.slice(1)) : navigate(link.href)}
                      className="text-gaming-text-secondary hover:text-gaming-accent transition-colors text-sm"
                    >
                      {link.name}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Gaming Services */}
          <div>
            <h4 className="text-lg font-semibold text-gaming-text mb-4">
              Gaming Services
            </h4>
            <ul className="space-y-2">
              {gamingServices.map((service, index) => (
                <li key={index}>
                  <a
                    href={service.href}
                    className="text-gaming-text-secondary hover:text-gaming-accent transition-colors text-sm"
                  >
                    {service.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold text-gaming-text mb-4">
              Contact Info
            </h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-gaming-accent mt-0.5" />
                <div>
                  <p className="text-gaming-text-secondary text-sm">
                    537, BAIRAGIPATTEDA RD<br />
                    TIRUPATI-517501
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-gaming-accent" />
                <p className="text-gaming-text-secondary text-sm">+91 77025 28817</p>
              </div>
              
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gaming-accent" />
                <p className="text-gaming-text-secondary text-sm">info@kgg.com</p>
              </div>
              
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-gaming-accent" />
                <p className="text-gaming-text-secondary text-sm">10:00 AM - 11:00 PM</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gaming-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gaming-text-secondary text-sm">
            © 2024 Karthikeya Games Galaxy. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gaming-text-secondary hover:text-gaming-accent text-sm transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-gaming-text-secondary hover:text-gaming-accent text-sm transition-colors">
              Terms of Service
            </a>
            <button 
              onClick={() => navigate('/admin')}
              className="text-gaming-text-secondary hover:text-gaming-accent text-sm transition-colors flex items-center"
            >
              <Shield className="w-3 h-3 mr-1" />
              Admin
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;