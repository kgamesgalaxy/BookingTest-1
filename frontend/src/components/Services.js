import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { useApi } from '../hooks/useApi';
import { gameTypeService } from '../services/api';

const Services = () => {
  const { data: gameTypes, loading } = useApi(gameTypeService.getAll, []);

  const getIcon = (gameType) => {
    const icons = {
      'playstation': '🎮',
      'xbox': '🎮',
      'nintendo': '🎮',
      'vr': '🥽',
      'board': '🎲'
    };
    return icons[gameType.id] || '🎮';
  };

  if (loading) {
    return (
      <section id="services" className="py-20 px-4 bg-bg-primary">
        <div className="container mx-auto">
          <div className="text-center">
            <div className="text-text-primary">Loading services...</div>
          </div>
        </div>
      </section>
    );
  }

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
          {gameTypes?.map((gameType, index) => (
            <Card key={gameType.id} className="bg-bg-secondary border-border-subtle hover:border-accent-primary transition-all duration-300 hover:transform hover:scale-105">
              <CardHeader>
                <div className="flex items-center justify-center mb-4">
                  <span className="text-6xl">{getIcon(gameType)}</span>
                </div>
                <CardTitle className="text-xl text-text-primary text-center">
                  {gameType.name}
                </CardTitle>
                <CardDescription className="text-text-secondary text-center">
                  {gameType.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {gameType.popular_games?.map((game, idx) => (
                    <li key={idx} className="flex items-center text-text-secondary">
                      <div className="w-2 h-2 bg-accent-primary rounded-full mr-3"></div>
                      {game}
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