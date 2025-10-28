import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { MapPin, Phone, Clock, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Contact = () => {
  const navigate = useNavigate();

  const contactInfo = [
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "Visit Us",
      info: "537, BAIRAGIPATTEDA RD",
      subInfo: "TIRUPATI - 517501"
    },
    {
      icon: <Phone className="w-8 h-8" />,
      title: "Call Us",
      info: "+44 7440 070177",
      subInfo: "Available 24/7"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Gaming Hours",
      info: "10:00 AM - 11:00 PM",
      subInfo: "7 Days a Week"
    },
    {
      icon: <Mail className="w-8 h-8" />,
      title: "Email Us",
      info: "info@kgg.com",
      subInfo: "Quick Response"
    }
  ];

  return (
    <section id="contact" className="py-12 lg:py-20 px-4 bg-gaming-light relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-gaming-accent/2 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-gaming-accent/3 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 lg:mb-16">
          <div className="inline-flex items-center space-x-2 bg-gaming-light backdrop-blur-sm px-4 lg:px-6 py-2 lg:py-3 rounded-full border border-gaming-accent/20 mb-4 lg:mb-6 shadow-gaming">
            <Phone className="w-4 h-4 lg:w-5 lg:h-5 text-gaming-accent" />
            <span className="text-gaming-accent font-semibold text-xs lg:text-sm tracking-wider uppercase">
              Contact Us
            </span>
          </div>
          
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gaming-text mb-3 lg:mb-4 animate-fade-in-up">
            Ready to
            <span className="block text-gaming-accent subtle-text">Start Gaming?</span>
          </h2>
          
          <p className="text-base lg:text-lg text-gaming-text-secondary max-w-2xl mx-auto animate-fade-in-up delay-200">
            Get in touch with us to book your gaming session or visit our facility. We're here to provide you with the best gaming experience.
          </p>
        </div>

        {/* Contact Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-8 lg:mb-12">
          {contactInfo.map((contact, index) => (
            <Card 
              key={index}
              className="bg-gaming-card border border-gaming-border hover:border-gaming-accent/30 shadow-gaming hover:shadow-gaming-lg group cursor-pointer transition-all duration-300 hover:scale-105 animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader className="text-center pb-3 lg:pb-4">
                <div className="flex items-center justify-center mb-3 lg:mb-4 group-hover:scale-110 transition-transform duration-300">
                  <div className="p-3 lg:p-4 rounded-xl lg:rounded-2xl bg-gaming-accent-light text-gaming-accent group-hover:bg-gaming-accent group-hover:text-gaming-light transition-all duration-300">
                    {contact.icon}
                  </div>
                </div>
                <CardTitle className="text-base lg:text-lg text-gaming-text group-hover:text-gaming-accent transition-colors duration-300">
                  {contact.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center pt-0">
                <div className="text-sm lg:text-base text-gaming-text font-semibold mb-1">{contact.info}</div>
                <div className="text-gaming-text-secondary text-xs lg:text-sm">{contact.subInfo}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="max-w-2xl mx-auto">
            <div className="bg-gaming-light/80 backdrop-blur-sm rounded-2xl lg:rounded-3xl p-6 lg:p-8 border border-gaming-border shadow-gaming-lg">
              <h3 className="text-xl lg:text-2xl font-bold text-gaming-text mb-3 lg:mb-4">
                Book Your Gaming Session Today
              </h3>
              <p className="text-sm lg:text-base text-gaming-text-secondary mb-4 lg:mb-6">
                Experience premium gaming with our latest consoles and VR equipment. Payment on the day of visit.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 justify-center">
                <Button 
                  size="lg"
                  className="bg-gaming-accent hover:bg-gaming-accent-hover text-gaming-light font-bold px-6 lg:px-8 py-3 lg:py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-gaming-lg text-sm lg:text-base"
                  onClick={() => navigate('/booking')}
                >
                  Book Gaming Session
                </Button>
                <Button 
                  variant="outline"
                  size="lg"
                  className="border-2 border-gaming-accent text-gaming-accent hover:bg-gaming-accent hover:text-gaming-light px-6 lg:px-8 py-3 lg:py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-gaming text-sm lg:text-base"
                  onClick={() => window.open('tel:+447440070177')}
                >
                  Call Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;