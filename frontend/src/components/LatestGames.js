import React from 'react';
import { Card, CardContent } from './ui/card';
import { Tilt } from './ui/tilt';
import { Sparkles, Megaphone, Gamepad2, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LatestGames = () => {
  const navigate = useNavigate();

  const latest = [
    {
      id: 'ghost-of-yotei',
      title: 'Ghost of Yotei',
      platform: 'PlayStation 5',
      note: 'New arrival',
      image: 'https://www.gamespot.com/a/uploads/scale_super/1601/16018044/4481011-ghost-yotei.jpg',
    },
    {
      id: 'gta5',
      title: 'Grand Theft Auto V',
      platform: 'PS5 / Xbox Series X',
      note: 'Fan favorite',
      image: 'https://images.unsplash.com/photo-1702139806712-5edeca150042?crop=entropy&cs=srgb&fm=jpg&q=85',
    },
    {
      id: 'mario-kart-8',
      title: 'Mario Kart 8 Deluxe',
      platform: 'Nintendo Switch',
      note: 'Party ready',
      image: 'https://images.unsplash.com/photo-1599409636295-e3cf3538f212?crop=entropy&cs=srgb&fm=jpg&q=85',
    },
    {
      id: 'beat-saber',
      title: 'Beat Saber',
      platform: 'Meta Quest VR',
      note: 'VR hit',
      image: 'https://images.unsplash.com/photo-1574758519652-904df1f8df4c?crop=entropy&cs=srgb&fm=jpg&q=85',
    },
  ];

  return (
    <section id="latest" className="py-12 lg:py-20 px-4 bg-gaming-lighter relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-10 left-10 w-72 h-72 bg-gaming-accent/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-10 w-72 h-72 bg-gaming-accent/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto relative z-10">
        <div className="text-center mb-12 lg:mb-16">
          <div className="inline-flex items-center space-x-2 bg-gaming-light backdrop-blur-sm px-4 lg:px-6 py-2 lg:py-3 rounded-full border border-gaming-accent/20 mb-4 lg:mb-6 shadow-gaming">
            <Sparkles className="w-4 h-4 lg:w-5 lg:h-5 text-gaming-accent" />
            <span className="text-gaming-accent font-semibold text-xs lg:text-sm tracking-wider uppercase">
              Latest Arrivals
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gaming-text mb-3 lg:mb-4">
            Fresh Games
            <span className="block text-gaming-accent subtle-text">Now Playable</span>
          </h2>
          <p className="text-base lg:text-lg text-gaming-text-secondary max-w-2xl mx-auto">
            New titles and community favorites across PS5, Xbox, Switch, VR, and board games.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {latest.map((game, index) => (
            <Tilt key={game.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
              <Card
                onClick={() => navigate('/booking')}
                className="bg-gaming-card border border-gaming-border hover:border-gaming-accent/30 shadow-gaming hover:shadow-gaming-lg transition-all duration-300 cursor-pointer"
              >
                <CardContent className="p-0">
                <div className="relative overflow-hidden rounded-t-2xl">
                  <img src={game.image} alt={game.title} className="w-full h-44 object-cover" />
                  <div className="absolute top-3 left-3 bg-gaming-accent text-gaming-light text-xs font-bold px-3 py-1 rounded-full shadow-gaming">
                    {game.note}
                  </div>
                </div>
                <div className="p-4 lg:p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-base lg:text-lg text-gaming-text">{game.title}</h3>
                      <p className="text-sm text-gaming-accent font-medium">{game.platform}</p>
                    </div>
                    <TrendingUp className="w-4 h-4 text-gaming-accent" />
                  </div>
                </div>
                </CardContent>
              </Card>
            </Tilt>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LatestGames;


