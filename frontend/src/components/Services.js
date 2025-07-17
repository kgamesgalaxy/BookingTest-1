import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Gamepad2, Tv, Joystick, Glasses, Dice6 } from 'lucide-react';

const Services = () => {
  const services = [
    {
      icon: <Gamepad2 className="w-12 h-12 text-accent-primary" />,
      title: "PlayStation Gaming",
      description: "Latest PlayStation consoles with exclusive games and multiplayer experiences",
      features: ["PS5 & PS4 Consoles", "Exclusive Titles", "Multiplayer Support", "4K Gaming"]
    },
    {
      icon: <Tv className="w-12 h-12 text-accent-primary" />,
      title: "Xbox Gaming",
      description: "Xbox Series X/S and Xbox One with Game Pass library access",
      features: ["Xbox Series X/S", "Game Pass Library", "Xbox Live Gold", "HDR Gaming"]
    },
    {
      icon: <Joystick className="w-12 h-12 text-accent-primary" />,
      title: "Nintendo Switch",
      description: "Portable and console gaming with Nintendo's exclusive titles",
      features: ["Switch OLED", "Exclusive Nintendo Games", "Portable Gaming", "Local Multiplayer"]
    },
    {
      icon: <Glasses className="w-12 h-12 text-accent-primary" />,
      title: "VR Gaming",
      description: "Immersive virtual reality experiences with cutting-edge technology",
      features: ["VR Headsets", "Immersive Games", "Virtual Worlds", "Motion Controllers"]
    },
    {
      icon: <Dice6 className="w-12 h-12 text-accent-primary" />,
      title: "Board Games",
      description: "Classic and modern board games for family fun and strategy",
      features: ["Strategy Games", "Family Games", "Card Games", "Party Games"]
    }
  ];

  return (
    <section id="services" className="py-20 px-4 bg-bg-primary">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
            Our Gaming Services
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Experience the best gaming platforms and board games all in one place. 
            Whether you're a casual player or hardcore gamer, we have something for everyone.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="bg-bg-secondary border-border-subtle hover:border-accent-primary transition-all duration-300 hover:transform hover:scale-105">
              <CardHeader>
                <div className="flex items-center justify-center mb-4">
                  {service.icon}
                </div>
                <CardTitle className="text-xl text-text-primary text-center">
                  {service.title}
                </CardTitle>
                <CardDescription className="text-text-secondary text-center">
                  {service.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-text-secondary">
                      <div className="w-2 h-2 bg-accent-primary rounded-full mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-text-secondary mb-6">
            All gaming services available at the same affordable rate
          </p>
          <div className="inline-flex items-center space-x-2 bg-bg-secondary px-6 py-3 rounded-lg border border-border-subtle">
            <span className="text-2xl font-bold text-accent-primary">₹120</span>
            <span className="text-text-secondary">per hour</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;