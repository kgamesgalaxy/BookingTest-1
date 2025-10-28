import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { gameTypeService } from '../services/api';
import { Gamepad2, Monitor, Headphones, Dice6, ArrowRight, Star } from 'lucide-react';
import { Tilt } from './ui/tilt';

const Services = () => {
  const { data: gameTypes, loading } = useApi(gameTypeService.getAll, []);
  const navigate = useNavigate();

  const getIcon = (gameType) => {
    const iconMap = {
      'ps5': <Gamepad2 className="w-12 h-12" />,
      'xbox': <Monitor className="w-12 h-12" />,
      'switch': <Gamepad2 className="w-12 h-12" />,
      'vr': <Headphones className="w-12 h-12" />,
      'board': <Dice6 className="w-12 h-12" />
    };
    return iconMap[gameType.id] || <Gamepad2 className="w-12 h-12" />;
  };

  const getPlatformColor = (gameType) => {
    const colorMap = {
      'ps5': 'from-blue-500/20 to-purple-500/20',
      'xbox': 'from-green-500/20 to-emerald-500/20',
      'switch': 'from-red-500/20 to-orange-500/20',
      'vr': 'from-purple-500/20 to-pink-500/20',
      'board': 'from-orange-500/20 to-yellow-500/20'
    };
    return colorMap[gameType.id] || 'from-gaming-accent/20 to-gaming-accent/5';
  };

  if (loading) {
    return (
      <section id="services" className="py-20 px-4 bg-gaming-lighter">
        <div className="container mx-auto">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 animate-pulse">
              <Gamepad2 className="w-6 h-6 text-gaming-accent" />
              <span className="text-gaming-text text-lg">Loading gaming services...</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="services" className="py-12 lg:py-20 px-4 bg-gaming-lighter relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-40 left-10 w-80 h-80 bg-gaming-accent/3 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 right-10 w-96 h-96 bg-gaming-accent/2 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 lg:mb-16">
          <div className="inline-flex items-center space-x-2 bg-gaming-light backdrop-blur-sm px-4 lg:px-6 py-2 lg:py-3 rounded-full border border-gaming-accent/20 mb-4 lg:mb-6 shadow-gaming">
            <Star className="w-4 h-4 lg:w-5 lg:h-5 text-gaming-accent" />
            <span className="text-gaming-accent font-semibold text-xs lg:text-sm tracking-wider uppercase">
              Gaming Services
            </span>
          </div>
          
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gaming-text mb-3 lg:mb-4 animate-fade-in-up">
            Premium Gaming
            <span className="block text-gaming-accent subtle-text">Platforms</span>
          </h2>
          
          <p className="text-base lg:text-lg text-gaming-text-secondary max-w-2xl mx-auto animate-fade-in-up delay-200">
            Experience the best gaming platforms and board games all in one place. From cutting-edge consoles to immersive VR and classic board games.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-8 lg:mb-12">
          {gameTypes?.map((gameType, index) => (
            <Tilt key={gameType.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
            <Card 
              className={`bg-gaming-card border border-gaming-border hover:border-gaming-accent/30 shadow-gaming hover:shadow-gaming-lg group cursor-pointer transition-all duration-300`}
            >
              {/* Status Indicator */}
              <div className="absolute top-3 lg:top-4 right-3 lg:right-4 w-2.5 h-2.5 lg:w-3 lg:h-3 bg-gaming-accent rounded-full animate-pulse shadow-gaming"></div>

              <CardHeader className="relative z-10 text-center pb-3 lg:pb-4">
                <div className="flex items-center justify-center mb-3 lg:mb-4 group-hover:scale-110 transition-transform duration-300">
                  <div className="p-3 lg:p-4 rounded-xl lg:rounded-2xl bg-gaming-accent-light text-gaming-accent group-hover:bg-gaming-accent group-hover:text-gaming-light transition-all duration-300">
                    {getIcon(gameType)}
                  </div>
                </div>
                
                <CardTitle className="text-lg lg:text-xl text-gaming-text group-hover:text-gaming-accent transition-colors duration-300 mb-2">
                  {gameType.name}
                </CardTitle>
                
                <CardDescription className="text-sm lg:text-base text-gaming-text-secondary group-hover:text-gaming-text transition-colors duration-300">
                  {gameType.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="relative z-10 pt-0">
                {/* Popular Games Preview */}
                <div className="mb-4 lg:mb-6">
                  <h4 className="text-xs lg:text-sm font-semibold text-gaming-accent mb-2 lg:mb-3 uppercase tracking-wider">
                    Popular Games:
                  </h4>
                  <div className="space-y-1.5 lg:space-y-2">
                    {gameType.popular_games?.slice(0, 4).map((game, idx) => (
                      <div key={idx} className="flex items-center text-gaming-text-secondary group-hover:text-gaming-text transition-colors duration-300">
                        <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-gaming-accent rounded-full mr-2 lg:mr-3 group-hover:scale-125 transition-transform duration-300"></div>
                        <span className="text-xs lg:text-sm">{game}</span>
                      </div>
                    ))}
                    {gameType.popular_games?.length > 4 && (
                      <div className="flex items-center text-gaming-accent">
                        <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-gaming-accent rounded-full mr-2 lg:mr-3"></div>
                        <span className="text-xs lg:text-sm font-medium">+{gameType.popular_games.length - 4} more games</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Action Button */}
                <Button 
                  className="w-full bg-transparent border-2 border-gaming-accent/30 text-gaming-accent hover:bg-gaming-accent hover:text-gaming-light transition-all duration-300 group-hover:scale-105 shadow-gaming text-sm lg:text-base py-2 lg:py-3"
                  onClick={() => navigate('/booking')}
                >
                  Book Session
                  <ArrowRight className="w-3 h-3 lg:w-4 lg:h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                </Button>
              </CardContent>
            </Card>
            </Tilt>
          ))}
        </div>

        {/* Pricing Section */}
        <div className="text-center animate-fade-in-up delay-500">
          <div className="max-w-3xl mx-auto">
            <div className="bg-gaming-light/80 backdrop-blur-sm rounded-2xl lg:rounded-3xl p-6 lg:p-8 border border-gaming-border shadow-gaming-lg hover:shadow-gaming-glow transition-all duration-300">
              <h3 className="text-xl lg:text-2xl font-bold text-gaming-text mb-3 lg:mb-4">
                Flexible Pricing, All Platforms
              </h3>
              <p className="text-sm lg:text-base text-gaming-text-secondary mb-4 lg:mb-6">
                Pricing varies by game and platform - starting from our base rate
              </p>
              
              <div className="flex items-center justify-center space-x-4 mb-4 lg:mb-6">
                <div className="text-center">
                  <div className="text-3xl lg:text-4xl font-bold text-gaming-accent subtle-text">₹150+</div>
                  <div className="text-sm lg:text-base text-gaming-text-secondary">per hour</div>
                </div>
                <div className="w-px h-12 bg-gaming-border"></div>
                <div className="text-center">
                  <div className="text-xl lg:text-2xl font-bold text-gaming-text">All Platforms</div>
                  <div className="text-sm lg:text-base text-gaming-text-secondary">available</div>
                </div>
              </div>
              
              <Button 
                size="lg"
                className="bg-gaming-accent hover:bg-gaming-accent-hover text-gaming-light font-bold px-8 lg:px-12 py-3 lg:py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-gaming-lg text-sm lg:text-base"
                onClick={() => navigate('/booking')}
              >
                <Gamepad2 className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
                Start Gaming Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;