import React from 'react';
import { Phone, Mail, MapPin, Clock, Facebook, Twitter, Instagram, Youtube, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Logo from './Logo';

const Footer = () => {
  const quickLinks = [
    { name: 'Home', href: '#' },
    { name: 'Services', href: '#services' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Contact', href: '#contact' }
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
    <footer className="bg-bg-secondary border-t border-border-subtle">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Logo />
            <p className="text-text-secondary text-sm">
              Your ultimate gaming destination. Experience the best in console gaming, VR, and board games all under one roof.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="w-10 h-10 bg-bg-tertiary rounded-lg flex items-center justify-center text-text-secondary hover:bg-accent-primary hover:text-bg-primary transition-all duration-200"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-text-primary mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => scrollToSection(link.href.replace('#', ''))}
                    className="text-text-secondary hover:text-accent-primary transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Gaming Services */}
          <div>
            <h4 className="text-lg font-semibold text-text-primary mb-4">
              Gaming Services
            </h4>
            <ul className="space-y-2">
              {gamingServices.map((service, index) => (
                <li key={index}>
                  <a
                    href={service.href}
                    className="text-text-secondary hover:text-accent-primary transition-colors duration-200 text-sm"
                  >
                    {service.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold text-text-primary mb-4">
              Contact Info
            </h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-accent-primary mt-0.5" />
                <div>
                  <p className="text-text-secondary text-sm">
                    537, BAIRAGIPATTEDA RD<br />
                    TIRUPATI-517501
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-accent-primary" />
                <p className="text-text-secondary text-sm">+91 77025 28817</p>
              </div>
              
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-accent-primary" />
                <p className="text-text-secondary text-sm">info@karthikeyagamesgalaxy.com</p>
              </div>
              
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-accent-primary" />
                <p className="text-text-secondary text-sm">10:00 AM - 10:00 PM</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border-subtle mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-text-secondary text-sm">
            © 2024 Karthikeya Games Galaxy. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-text-secondary hover:text-accent-primary text-sm transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-text-secondary hover:text-accent-primary text-sm transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-text-secondary hover:text-accent-primary text-sm transition-colors">
              Refund Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;