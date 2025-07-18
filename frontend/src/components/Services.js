import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { gameTypeService } from '../services/api';

const Services = () => {
  const { data: gameTypes, loading } = useApi(gameTypeService.getAll, []);
  const navigate = useNavigate();

  const getIcon = (gameType) => {
    const icons = {
      'ps5': '🎮',
      'xbox': '🎮',
      'switch': '🎮',
      'vr': '🥽',
      'board': '🎲'
    };
    return icons[gameType.id] || '🎮';
  };

  const getGradient = (index) => {
    const gradients = [
      'from-purple-500/20 to-pink-500/20',
      'from-blue-500/20 to-cyan-500/20',
      'from-green-500/20 to-emerald-500/20',
      'from-red-500/20 to-orange-500/20',
      'from-indigo-500/20 to-purple-500/20'
    ];
    return gradients[index % gradients.length];
  };

  if (loading) {
    return (
      <section id="services" className="py-20 px-4 bg-bg-primary">
        <div className="container mx-auto">
          <div className="text-center">
            <div className="text-text-primary animate-pulse">Loading services...</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="services" className="py-20 px-4 bg-bg-primary relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-40 left-10 w-72 h-72 bg-accent-primary opacity-5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-40 right-10 w-96 h-96 bg-accent-primary opacity-3 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4 transform transition-all duration-1000 hover:scale-105">
            Our Gaming Services
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Experience the best gaming platforms and board games all in one place. 
            Whether you're a casual player or hardcore gamer, we have something for everyone.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {gameTypes?.map((gameType, index) => (
            <Card 
              key={gameType.id} 
              className={`bg-bg-secondary border-border-subtle hover:border-accent-primary transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-accent-primary/10 group cursor-pointer relative overflow-hidden bg-gradient-to-br ${getGradient(index)}`}
            >
              {/* Hover Effect Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Floating Animation */}
              <div className="absolute top-4 right-4 w-2 h-2 bg-accent-primary rounded-full animate-pulse"></div>

              <CardHeader className="relative z-10">
                <div className="flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <div className="text-8xl group-hover:animate-bounce">
                    {getIcon(gameType)}
                  </div>
                </div>
                <CardTitle className="text-xl text-text-primary text-center group-hover:text-accent-primary transition-colors duration-300">
                  {gameType.name}
                </CardTitle>
                <CardDescription className="text-text-secondary text-center group-hover:text-text-primary transition-colors duration-300">
                  {gameType.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="relative z-10">
                <ul className="space-y-2 mb-4">
                  {gameType.popular_games?.map((game, idx) => (
                    <li key={idx} className="flex items-center text-text-secondary group-hover:text-text-primary transition-colors duration-300">
                      <div className="w-2 h-2 bg-accent-primary rounded-full mr-3 group-hover:scale-125 transition-transform duration-300"></div>
                      <span className="text-sm">{game}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className="w-full bg-transparent border border-accent-primary text-accent-primary hover:bg-accent-primary hover:text-bg-primary transition-all duration-300 group-hover:scale-105"
                  onClick={() => navigate('/booking')}
                >
                  Book Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pricing Section */}
        <div className="text-center">
          <div className="max-w-2xl mx-auto">
            <p className="text-text-secondary mb-6 text-lg">
              All gaming services available at the same affordable rate
            </p>
            <div className="inline-flex items-center space-x-4 bg-bg-secondary/80 backdrop-blur-sm px-8 py-4 rounded-2xl border border-border-subtle hover:border-accent-primary transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-accent-primary/10 group cursor-pointer">
              <div className="text-4xl font-bold text-accent-primary group-hover:scale-110 transition-transform duration-300">
                ₹120
              </div>
              <div className="text-text-secondary group-hover:text-text-primary transition-colors duration-300">
                <div className="text-lg font-semibold">per hour</div>
                <div className="text-sm">All platforms included</div>
              </div>
            </div>
            
            <div className="mt-8">
              <Button 
                size="lg"
                className="bg-accent-primary text-bg-primary hover:bg-accent-hover transform hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-accent-primary/25 group"
                onClick={() => navigate('/booking')}
              >
                <span className="group-hover:scale-110 transition-transform duration-300">
                  Start Gaming Now
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;