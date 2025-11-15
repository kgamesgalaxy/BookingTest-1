import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Check, Clock, Users, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ElectricBorder from './ElectricBorder';

const Pricing = () => {
  const navigate = useNavigate();

  const packages = [
    {
      title: "Single Player",
      price: "₹120",
      duration: "per hour",
      description: "Perfect for solo gaming sessions",
      features: [
        "1 Gaming Station",
        "All Gaming Platforms",
        "Board Games Included",
        "Comfortable Seating",
        "Free Wi-Fi"
      ],
      popular: false
    },
    {
      title: "Group Session",
      price: "₹100",
      duration: "per person/hour",
      description: "Best for friends and families (3+ people)",
      features: [
        "Discounted Rate",
        "Multiple Stations",
        "Multiplayer Games",
        "Group Competitions",
        "Free Wi-Fi",
        "Snacks Available"
      ],
      popular: true
    },
    {
      title: "Birthday Package",
      price: "₹2500",
      duration: "4 hours",
      description: "Special celebration package",
      features: [
        "4 Hours Gaming",
        "Up to 8 People",
        "Birthday Decorations",
        "Cake Cutting Space",
        "Photo Session",
        "Party Favor"
      ],
      popular: false
    }
  ];

  return (
    <section id="pricing" className="py-20 px-4 bg-bg-secondary">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
            Simple & Transparent Pricing
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            No hidden fees, no complicated packages. Just straightforward pricing for unlimited gaming fun.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {packages.map((pkg, index) => {
            const colors = ['#7df9ff', '#10b981', '#f97316'];
            const borderColor = colors[index];

            return (
              <ElectricBorder
                key={index}
                color={borderColor}
                speed={pkg.popular ? 1.5 : 1}
                chaos={pkg.popular ? 0.6 : 0.4}
                thickness={2}
                style={{ borderRadius: 24 }}
              >
                <Card className={`relative bg-bg-primary border-0 transition-all duration-300`}>
                  {pkg.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                      <span className="bg-accent-primary text-bg-primary px-4 py-1 rounded-full text-sm font-semibold flex items-center">
                        <Star className="w-4 h-4 mr-1" />
                        Most Popular
                      </span>
                    </div>
                  )}

                  <CardHeader className="text-center">
                    <CardTitle className="text-xl text-text-primary mb-2">
                      {pkg.title}
                    </CardTitle>
                    <div className="mb-4">
                      <span className="text-3xl font-bold text-accent-primary">{pkg.price}</span>
                      <span className="text-text-secondary ml-2">{pkg.duration}</span>
                    </div>
                    <CardDescription className="text-text-secondary">
                      {pkg.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    <ul className="space-y-3 mb-8">
                      {pkg.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center text-text-secondary">
                          <Check className="w-5 h-5 text-accent-primary mr-3" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <Button
                      className={`w-full ${pkg.popular ? 'bg-accent-primary text-bg-primary hover:bg-accent-hover' : 'bg-bg-secondary text-text-primary border border-border-subtle hover:border-accent-primary hover:text-accent-primary'}`}
                      onClick={() => navigate('/booking')}
                    >
                      Book Now
                    </Button>
                  </CardContent>
                </Card>
              </ElectricBorder>
            );
          })}
        </div>

        {/* Additional Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <div className="text-center">
            <Clock className="w-12 h-12 text-accent-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-text-primary mb-2">Flexible Timing</h3>
            <p className="text-text-secondary">Book for as long as you want. Minimum 1 hour sessions.</p>
          </div>
          
          <div className="text-center">
            <Users className="w-12 h-12 text-accent-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-text-primary mb-2">Group Discounts</h3>
            <p className="text-text-secondary">Special rates for groups of 3 or more people.</p>
          </div>
          
          <div className="text-center">
            <Star className="w-12 h-12 text-accent-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-text-primary mb-2">Premium Experience</h3>
            <p className="text-text-secondary">High-end gaming equipment and comfortable environment.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;