import React from 'react';
import { Megaphone, CalendarDays, Bell } from 'lucide-react';
import { Card, CardContent } from './ui/card';

const Announcements = () => {
  const announcements = [
    {
      id: 'festive-offer',
      title: 'Weekend Squad Deals',
      date: 'Every Fri-Sun',
      details: 'Group bookings get extended time on PS5, Xbox, and VR.',
    },
    {
      id: 'new-hours',
      title: 'Extended Hours',
      date: 'Now till 11 PM',
      details: 'We are open late for evening gaming sessions.',
    },
    {
      id: 'tournament',
      title: 'FIFA and Mario Kart Mini Tournaments',
      date: 'Coming Soon',
      details: 'Compete with friends and win free sessions.',
    },
  ];

  return (
    <section id="announcements" className="py-12 lg:py-20 px-4 bg-gaming-light relative overflow-hidden">
      <div className="container mx-auto">
        <div className="text-center mb-12 lg:mb-16">
          <div className="inline-flex items-center space-x-2 bg-gaming-light backdrop-blur-sm px-4 lg:px-6 py-2 lg:py-3 rounded-full border border-gaming-accent/20 mb-4 lg:mb-6 shadow-gaming">
            <Megaphone className="w-4 h-4 lg:w-5 lg:h-5 text-gaming-accent" />
            <span className="text-gaming-accent font-semibold text-xs lg:text-sm tracking-wider uppercase">
              Announcements
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gaming-text mb-3 lg:mb-4">
            Whats New at KGG
            <span className="block text-gaming-accent subtle-text">Stay Updated</span>
          </h2>
          <p className="text-base lg:text-lg text-gaming-text-secondary max-w-2xl mx-auto">
            News, offers, and updates for gamers and families.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {announcements.map((item, index) => (
            <Card key={item.id} className="bg-gaming-card border border-gaming-border shadow-gaming hover:shadow-gaming-lg transition-all animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gaming-text">{item.title}</h3>
                  <Bell className="w-4 h-4 text-gaming-accent" />
                </div>
                <div className="flex items-center gap-2 text-gaming-text-secondary text-sm mb-3">
                  <CalendarDays className="w-4 h-4" />
                  <span>{item.date}</span>
                </div>
                <p className="text-gaming-text-secondary text-sm">{item.details}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Announcements;


