// Mock data for the gaming zone application

export const mockBookings = [
  {
    id: 1,
    name: 'John Doe',
    phone: '+91 98765 43210',
    email: 'john@example.com',
    gameType: 'playstation',
    duration: '2',
    timeSlot: '2:00 PM',
    groupSize: '1',
    date: new Date('2024-01-15'),
    total: 240,
    status: 'confirmed',
    createdAt: new Date('2024-01-10')
  },
  {
    id: 2,
    name: 'Sarah Smith',
    phone: '+91 98765 43211',
    email: 'sarah@example.com',
    gameType: 'vr',
    duration: '1',
    timeSlot: '5:00 PM',
    groupSize: '4',
    date: new Date('2024-01-16'),
    total: 400,
    status: 'confirmed',
    createdAt: new Date('2024-01-11')
  },
  {
    id: 3,
    name: 'Mike Johnson',
    phone: '+91 98765 43212',
    email: 'mike@example.com',
    gameType: 'board',
    duration: '3',
    timeSlot: '7:00 PM',
    groupSize: '6',
    date: new Date('2024-01-17'),
    total: 1800,
    status: 'pending',
    createdAt: new Date('2024-01-12')
  }
];

export const mockGameTypes = [
  {
    id: 'playstation',
    name: 'PlayStation',
    description: 'Latest PlayStation consoles with exclusive games',
    icon: '🎮',
    available: true,
    popularGames: ['God of War', 'Spider-Man', 'The Last of Us', 'Horizon Zero Dawn']
  },
  {
    id: 'xbox',
    name: 'Xbox',
    description: 'Xbox Series X/S with Game Pass library',
    icon: '🎮',
    available: true,
    popularGames: ['Halo', 'Forza', 'Gears of War', 'Minecraft']
  },
  {
    id: 'nintendo',
    name: 'Nintendo Switch',
    description: 'Portable and console gaming with Nintendo exclusives',
    icon: '🎮',
    available: true,
    popularGames: ['Mario Odyssey', 'Zelda', 'Mario Kart', 'Smash Bros']
  },
  {
    id: 'vr',
    name: 'VR Gaming',
    description: 'Immersive virtual reality experiences',
    icon: '🥽',
    available: true,
    popularGames: ['Beat Saber', 'Half-Life Alyx', 'Superhot VR', 'Job Simulator']
  },
  {
    id: 'board',
    name: 'Board Games',
    description: 'Classic and modern board games for all ages',
    icon: '🎲',
    available: true,
    popularGames: ['Monopoly', 'Scrabble', 'Catan', 'Pandemic']
  }
];

export const mockTimeSlots = [
  { time: '10:00 AM', available: true },
  { time: '11:00 AM', available: true },
  { time: '12:00 PM', available: false },
  { time: '1:00 PM', available: true },
  { time: '2:00 PM', available: false },
  { time: '3:00 PM', available: true },
  { time: '4:00 PM', available: true },
  { time: '5:00 PM', available: false },
  { time: '6:00 PM', available: true },
  { time: '7:00 PM', available: true },
  { time: '8:00 PM', available: true },
  { time: '9:00 PM', available: true }
];

export const mockGalleryImages = [
  {
    id: 1,
    title: 'PlayStation Gaming Zone',
    category: 'PlayStation',
    description: 'State-of-the-art PlayStation consoles with comfortable gaming chairs',
    url: '/images/playstation-zone.jpg' // Mock URL
  },
  {
    id: 2,
    title: 'Xbox Gaming Area',
    category: 'Xbox',
    description: 'Xbox Series X/S setups with high-definition displays',
    url: '/images/xbox-area.jpg' // Mock URL
  },
  {
    id: 3,
    title: 'Nintendo Switch Station',
    category: 'Nintendo',
    description: 'Portable and docked Nintendo Switch gaming experience',
    url: '/images/nintendo-station.jpg' // Mock URL
  },
  {
    id: 4,
    title: 'VR Gaming Experience',
    category: 'VR',
    description: 'Immersive virtual reality gaming with latest VR headsets',
    url: '/images/vr-experience.jpg' // Mock URL
  },
  {
    id: 5,
    title: 'Board Games Collection',
    category: 'Board Games',
    description: 'Extensive collection of board games for all ages',
    url: '/images/board-games.jpg' // Mock URL
  },
  {
    id: 6,
    title: 'Gaming Lounge',
    category: 'Lounge',
    description: 'Comfortable lounge area for relaxation between gaming sessions',
    url: '/images/gaming-lounge.jpg' // Mock URL
  }
];

export const mockContactInfo = {
  address: '123 Gaming Street, Tech City, TC 12345',
  phone: '+91 98765 43210',
  email: 'info@karthikeyagamesgalaxy.com',
  hours: {
    weekdays: '10:00 AM - 10:00 PM',
    weekends: '10:00 AM - 11:00 PM'
  },
  social: {
    facebook: '#',
    twitter: '#',
    instagram: '#',
    youtube: '#'
  }
};

export const mockPricing = {
  individual: {
    rate: 120,
    description: 'Perfect for solo gaming sessions'
  },
  group: {
    rate: 100,
    minPeople: 3,
    description: 'Discounted rate for groups of 3 or more'
  },
  birthday: {
    rate: 2500,
    duration: 4,
    maxPeople: 8,
    description: 'Special birthday package with decorations'
  }
};