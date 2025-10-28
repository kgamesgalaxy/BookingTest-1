import React from 'react';
import { Card, CardContent } from './ui/card';
import { Star, Play, Users, Trophy } from 'lucide-react';
import { Tilt } from './ui/tilt';

const FeaturedGames = () => {
  const featuredGames = [
    {
      id: 1,
      title: "Spider-Man 2",
      platform: "PlayStation 5",
      category: "Action Adventure",
      rating: 4.9,
      players: "1 Player",
      image: "https://images.unsplash.com/photo-1577054533619-87061b764cb1?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzB8MHwxfHNlYXJjaHwyfHxtb2Rlcm4lMjBnYW1pbmd8ZW58MHx8fHdoaXRlfDE3NTM2NTcxMDh8MA&ixlib=rb-4.1.0&q=85",
      isNew: true,
      isPopular: false
    },
    {
      id: 2,
      title: "Halo Infinite",
      platform: "Xbox Series X",
      category: "First Person Shooter",
      rating: 4.7,
      players: "1-16 Players",
      image: "https://images.unsplash.com/photo-1533381309471-b8e57002fc47?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1NzZ8MHwxfHNlYXJjaHwyfHxnYW1pbmclMjBzZXR1cHxlbnwwfHx8d2hpdGV8MTc1MzY1NzEwMnww&ixlib=rb-4.1.0&q=85",
      isNew: false,
      isPopular: true
    },
    {
      id: 3,
      title: "Beat Saber",
      platform: "VR Gaming",
      category: "Rhythm VR",
      rating: 4.8,
      players: "1 Player",
      image: "https://images.unsplash.com/photo-1591182136289-67ff16828fd4?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzB8MHwxfHNlYXJjaHw0fHxtb2Rlcm4lMjBnYW1pbmd8ZW58MHx8fHdhaXRlfDE3NTM2NTcxMDh8MA&ixlib=rb-4.1.0&q=85",
      isNew: false,
      isPopular: true
    },
    {
      id: 4,
      title: "Settlers of Catan",
      platform: "Board Games",
      category: "Strategy",
      rating: 4.6,
      players: "3-4 Players",
      image: "https://images.unsplash.com/photo-1713511129992-a9320f883070?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1NzZ8MHwxfHNlYXJjaHwzfHxnYW1pbmclMjBzZXR1cHxlbnwwfHx8d2hpdGV8MTc1MzY1NzEwMnww&ixlib=rb-4.1.0&q=85",
      isNew: false,
      isPopular: false
    }
  ];

  return (
    <section id="games" className="py-12 lg:py-20 px-4 bg-gaming-light relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-gaming-accent/3 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-gaming-accent/2 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 lg:mb-16">
          <div className="inline-flex items-center space-x-2 bg-gaming-light backdrop-blur-sm px-4 lg:px-6 py-2 lg:py-3 rounded-full border border-gaming-accent/20 mb-4 lg:mb-6 shadow-gaming">
            <Trophy className="w-4 h-4 lg:w-5 lg:h-5 text-gaming-accent" />
            <span className="text-gaming-accent font-semibold text-xs lg:text-sm tracking-wider uppercase">
              Top Rated Games
            </span>
          </div>
          
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gaming-text mb-3 lg:mb-4 animate-fade-in-up">
            Best Gaming
            <span className="block text-gaming-accent subtle-text">Experiences</span>
          </h2>
          
          <p className="text-base lg:text-lg text-gaming-text-secondary max-w-2xl mx-auto animate-fade-in-up delay-200">
            Discover the highest-rated and most popular games across all platforms. From blockbuster console titles to immersive VR and strategic board games.
          </p>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {featuredGames.map((game, index) => (
            <Tilt key={game.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
              <Card 
                className={`bg-gaming-card border border-gaming-border hover:border-gaming-accent/30 shadow-gaming hover:shadow-gaming-lg group cursor-pointer transition-all duration-300`}
              >
                <CardContent className="p-0">
                {/* Game Image */}
                <div className="relative overflow-hidden rounded-t-2xl">
                  <img 
                    src={game.image}
                    alt={game.title}
                    className="w-full h-40 sm:h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-gaming-text/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-4 right-4">
                      <button className="w-full bg-gaming-accent hover:bg-gaming-accent-hover text-gaming-light font-semibold py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-gaming text-sm">
                        <Play className="w-3 h-3 lg:w-4 lg:h-4 inline mr-2" />
                        Play Now
                      </button>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="absolute top-3 lg:top-4 left-3 lg:left-4 flex space-x-2">
                    {game.isNew && (
                      <span className="bg-gaming-accent text-gaming-light text-xs font-bold px-2 lg:px-3 py-1 rounded-full shadow-gaming">
                        NEW
                      </span>
                    )}
                    {game.isPopular && (
                      <span className="bg-red-500 text-white text-xs font-bold px-2 lg:px-3 py-1 rounded-full shadow-gaming">
                        POPULAR
                      </span>
                    )}
                  </div>

                  {/* Rating */}
                  <div className="absolute top-3 lg:top-4 right-3 lg:right-4 flex items-center space-x-1 bg-gaming-light/90 backdrop-blur-sm px-2 lg:px-3 py-1 rounded-full shadow-gaming">
                    <Star className="w-3 h-3 text-yellow-500 fill-current" />
                    <span className="text-gaming-text text-xs font-semibold">{game.rating}</span>
                  </div>
                </div>

                {/* Game Info */}
                <div className="p-4 lg:p-6">
                  <div className="mb-2 lg:mb-3">
                    <h3 className="font-bold text-base lg:text-lg text-gaming-text group-hover:text-gaming-accent transition-colors duration-200">
                      {game.title}
                    </h3>
                    <p className="text-sm text-gaming-accent font-medium">{game.platform}</p>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gaming-text-secondary">
                    <span>{game.category}</span>
                    <div className="flex items-center space-x-1">
                      <Users className="w-3 h-3" />
                      <span>{game.players}</span>
                    </div>
                  </div>
                </div>
                </CardContent>
              </Card>
            </Tilt>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-8 lg:mt-12">
          <button className="bg-gaming-accent hover:bg-gaming-accent-hover text-gaming-light font-semibold px-6 lg:px-8 py-3 lg:py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-gaming-lg text-sm lg:text-base">
            <Trophy className="w-4 h-4 inline mr-2" />
            View All Games
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedGames;