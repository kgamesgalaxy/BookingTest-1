import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { MapPin, Phone, Clock, Mail, Navigation } from 'lucide-react';

const Contact = () => {
  const contactInfo = [
    {
      icon: <MapPin className="w-6 h-6 text-accent-primary" />,
      title: "Location",
      details: "537, BAIRAGIPATTEDA RD, TIRUPATI-517501",
      description: "Located in Tirupati, Andhra Pradesh"
    },
    {
      icon: <Phone className="w-6 h-6 text-accent-primary" />,
      title: "Phone",
      details: "+91 77025 28817",
      description: "Call us for bookings or any queries"
    },
    {
      icon: <Clock className="w-6 h-6 text-accent-primary" />,
      title: "Hours",
      details: "10:00 AM - 10:00 PM",
      description: "Open 7 days a week"
    },
    {
      icon: <Mail className="w-6 h-6 text-accent-primary" />,
      title: "Email",
      details: "info@karthikeyagamesgalaxy.com",
      description: "Send us your questions anytime"
    }
  ];

  const handleGetDirections = () => {
    // Mock functionality - in real implementation, this would open maps
    window.open('https://maps.google.com', '_blank');
  };

  return (
    <section id="contact" className="py-20 px-4 bg-bg-secondary">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
            Visit Us Today
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Ready to start your gaming adventure? Find us, call us, or simply drop by. We're here to make your gaming experience unforgettable.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-6">
            {contactInfo.map((info, index) => (
              <Card key={index} className="bg-bg-primary border-border-subtle hover:border-accent-primary transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    {info.icon}
                    <CardTitle className="text-lg text-text-primary">
                      {info.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-text-primary font-semibold mb-1">{info.details}</p>
                  <CardDescription className="text-text-secondary">
                    {info.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Map and Actions */}
          <div className="space-y-6">
            {/* Mock Map */}
            <Card className="bg-bg-primary border-border-subtle">
              <CardContent className="p-0">
                <div className="aspect-video bg-gradient-to-br from-bg-tertiary to-bg-secondary rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-16 h-16 text-accent-primary mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-text-primary mb-2">
                      Find Us Here
                    </h3>
                    <p className="text-text-secondary mb-6">
                      Located in the heart of Tech City
                    </p>
                    <Button 
                      onClick={handleGetDirections}
                      className="bg-accent-primary text-bg-primary hover:bg-accent-hover"
                    >
                      <Navigation className="w-4 h-4 mr-2" />
                      Get Directions
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button 
                size="lg"
                className="bg-accent-primary text-bg-primary hover:bg-accent-hover"
                onClick={() => window.open('tel:+917702528817', '_self')}
              >
                <Phone className="w-5 h-5 mr-2" />
                Call Now
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-accent-primary text-accent-primary hover:bg-accent-primary hover:text-bg-primary"
                onClick={() => window.open('mailto:info@karthikeyagamesgalaxy.com', '_self')}
              >
                <Mail className="w-5 h-5 mr-2" />
                Send Email
              </Button>
            </div>

            {/* Additional Info */}
            <Card className="bg-bg-primary border-border-subtle">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-text-primary mb-3">
                  Why Choose Us?
                </h3>
                <ul className="space-y-2 text-text-secondary">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-accent-primary rounded-full mr-3"></div>
                    Latest gaming consoles and equipment
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-accent-primary rounded-full mr-3"></div>
                    Comfortable and clean gaming environment
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-accent-primary rounded-full mr-3"></div>
                    Friendly and helpful staff
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-accent-primary rounded-full mr-3"></div>
                    Affordable pricing for all
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;