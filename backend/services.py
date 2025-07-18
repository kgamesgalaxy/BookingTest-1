from datetime import datetime, timedelta
from typing import List, Optional
from models import Booking, GameType, GalleryImage, Settings, TimeSlot, AvailabilityResponse, PricingInfo, ContactInfo
from motor.motor_asyncio import AsyncIOMotorDatabase
import logging

logger = logging.getLogger(__name__)

class BookingService:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
        self.collection = db.bookings
    
    def calculate_total(self, duration: int, group_size: int) -> float:
        """Calculate total price based on duration and group size"""
        individual_rate = 120
        group_rate = 100
        group_min_size = 3
        
        if group_size >= group_min_size:
            return group_rate * duration * group_size
        else:
            return individual_rate * duration * group_size
    
    async def create_booking(self, booking_data: dict) -> Booking:
        """Create a new booking"""
        # Calculate total price
        total = self.calculate_total(booking_data['duration'], booking_data['group_size'])
        
        booking = Booking(
            **booking_data,
            total=total,
            status="confirmed"
        )
        
        booking_dict = booking.dict()
        await self.collection.insert_one(booking_dict)
        
        logger.info(f"Created booking for {booking.name} on {booking.date}")
        return booking
    
    async def get_all_bookings(self) -> List[Booking]:
        """Get all bookings"""
        cursor = self.collection.find()
        bookings = []
        async for booking_doc in cursor:
            bookings.append(Booking(**booking_doc))
        return bookings
    
    async def get_booking_by_id(self, booking_id: str) -> Optional[Booking]:
        """Get booking by ID"""
        booking_doc = await self.collection.find_one({"id": booking_id})
        if booking_doc:
            return Booking(**booking_doc)
        return None
    
    async def update_booking(self, booking_id: str, update_data: dict) -> Optional[Booking]:
        """Update booking"""
        update_data['updated_at'] = datetime.utcnow()
        result = await self.collection.update_one(
            {"id": booking_id},
            {"$set": update_data}
        )
        
        if result.modified_count > 0:
            return await self.get_booking_by_id(booking_id)
        return None
    
    async def delete_booking(self, booking_id: str) -> bool:
        """Delete booking"""
        result = await self.collection.delete_one({"id": booking_id})
        return result.deleted_count > 0
    
    async def get_bookings_by_date(self, date: datetime) -> List[Booking]:
        """Get bookings for a specific date"""
        start_date = datetime.combine(date.date(), datetime.min.time())
        end_date = start_date + timedelta(days=1)
        
        cursor = self.collection.find({
            "date": {
                "$gte": start_date,
                "$lt": end_date
            }
        })
        
        bookings = []
        async for booking_doc in cursor:
            bookings.append(Booking(**booking_doc))
        return bookings

class AvailabilityService:
    def __init__(self, booking_service: BookingService):
        self.booking_service = booking_service
        self.time_slots = [
            "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM",
            "4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM"
        ]
    
    async def get_availability_for_date(self, date: datetime) -> AvailabilityResponse:
        """Get available time slots for a specific date"""
        # Get existing bookings for the date
        bookings = await self.booking_service.get_bookings_by_date(date)
        
        # Get booked time slots
        booked_slots = [booking.time_slot for booking in bookings]
        
        # Create availability response
        time_slots = []
        for slot in self.time_slots:
            available = slot not in booked_slots
            time_slots.append(TimeSlot(time=slot, available=available))
        
        return AvailabilityResponse(
            date=date.strftime("%Y-%m-%d"),
            time_slots=time_slots
        )

class GameTypeService:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
        self.collection = db.game_types
    
    async def get_all_game_types(self) -> List[GameType]:
        """Get all game types"""
        cursor = self.collection.find()
        game_types = []
        async for game_type_doc in cursor:
            game_types.append(GameType(**game_type_doc))
        return game_types
    
    async def seed_game_types(self):
        """Seed initial game types data"""
        game_types_data = [
            {
                "id": "ps5",
                "name": "PlayStation 5",
                "description": "Latest PlayStation 5 console with exclusive games and 4K gaming",
                "icon": "🎮",
                "available": True,
                "popular_games": [
                    "Spider-Man 2", "God of War Ragnarök", "Horizon Forbidden West", 
                    "The Last of Us Part I", "Demon's Souls", "Ratchet & Clank: Rift Apart",
                    "Gran Turismo 7", "Ghost of Tsushima Director's Cut", "Final Fantasy VII Rebirth"
                ]
            },
            {
                "id": "xbox",
                "name": "Xbox Series X",
                "description": "Xbox Series X with Game Pass library and 4K gaming",
                "icon": "🎮",
                "available": True,
                "popular_games": [
                    "Halo Infinite", "Forza Horizon 5", "Starfield", "Hi-Fi Rush",
                    "Gears 5", "Microsoft Flight Simulator", "Minecraft",
                    "Sea of Thieves", "Ori and the Will of the Wisps", "Cyberpunk 2077"
                ]
            },
            {
                "id": "switch",
                "name": "Nintendo Switch",
                "description": "Nintendo Switch with exclusive games and portable gaming",
                "icon": "🎮",
                "available": True,
                "popular_games": [
                    "The Legend of Zelda: Tears of the Kingdom", "Super Mario Bros. Wonder",
                    "Super Mario Odyssey", "Mario Kart 8 Deluxe", "Super Smash Bros. Ultimate",
                    "Animal Crossing: New Horizons", "Pokémon Scarlet/Violet", 
                    "Splatoon 3", "Metroid Dread", "Fire Emblem Engage"
                ]
            },
            {
                "id": "vr",
                "name": "VR Gaming",
                "description": "Immersive virtual reality gaming with latest VR headsets",
                "icon": "🥽",
                "available": True,
                "popular_games": [
                    "Beat Saber", "Half-Life: Alyx", "Superhot VR", "Resident Evil 4 VR",
                    "Pavlov VR", "The Walking Dead: Saints & Sinners", "Pistol Whip",
                    "Blade & Sorcery", "Boneworks", "Arizona Sunshine"
                ]
            },
            {
                "id": "board",
                "name": "Board Games",
                "description": "Classic and modern board games for all ages and groups",
                "icon": "🎲",
                "available": True,
                "popular_games": [
                    "Monopoly", "Scrabble", "Settlers of Catan", "Ticket to Ride",
                    "Azul", "Splendor", "7 Wonders", "Pandemic", "Codenames",
                    "King of Tokyo", "Dixit", "Sequence", "UNO", "Jenga", "Chess",
                    "Backgammon", "Ludo", "Snakes & Ladders", "Carrom"
                ]
            }
        ]
        
        # Clear existing data
        await self.collection.delete_many({})
        
        # Insert new data
        await self.collection.insert_many(game_types_data)
        logger.info("Game types seeded successfully")

class GalleryService:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
        self.collection = db.gallery
    
    async def get_all_images(self) -> List[GalleryImage]:
        """Get all gallery images"""
        cursor = self.collection.find()
        images = []
        async for image_doc in cursor:
            images.append(GalleryImage(**image_doc))
        return images
    
    async def create_image(self, image_data: dict) -> GalleryImage:
        """Create a new gallery image"""
        image = GalleryImage(**image_data)
        image_dict = image.dict()
        await self.collection.insert_one(image_dict)
        return image
    
    async def seed_gallery_images(self):
        """Seed initial gallery images with real gaming platform images"""
        gallery_data = [
            {
                "title": "PlayStation 5 Gaming Setup",
                "category": "PlayStation",
                "description": "Latest PlayStation 5 console with DualSense controller and 4K gaming",
                "image_data": "https://images.unsplash.com/photo-1607853202273-797f1c22a38e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njd8MHwxfHNlYXJjaHwxfHxQbGF5U3RhdGlvbiUyMDV8ZW58MHx8fHwxNzUyODI4ODA4fDA&ixlib=rb-4.1.0&q=85"
            },
            {
                "title": "Xbox Series X Gaming Station",
                "category": "Xbox",
                "description": "Xbox Series X console with wireless controller and Game Pass library",
                "image_data": "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHwxfHxYYm94JTIwU2VyaWVzJTIwWHxlbnwwfHx8fDE3NTI4Mjg4MTZ8MA&ixlib=rb-4.1.0&q=85"
            },
            {
                "title": "Nintendo Switch Gaming",
                "category": "Nintendo",
                "description": "Nintendo Switch with Joy-Con controllers for portable and docked gaming",
                "image_data": "https://images.unsplash.com/photo-1612036781124-847f8939b154?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzB8MHwxfHNlYXJjaHwxfHxOaW50ZW5kbyUyMFN3aXRjaHxlbnwwfHx8fDE3NTI4Mjg4MjJ8MA&ixlib=rb-4.1.0&q=85"
            },
            {
                "title": "VR Gaming Experience",
                "category": "VR",
                "description": "Immersive virtual reality gaming with advanced VR headsets and controllers",
                "image_data": "https://images.unsplash.com/photo-1535223289827-42f1e9919769?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzh8MHwxfHNlYXJjaHwyfHxWUiUyMGdhbWluZ3xlbnwwfHx8fDE3NTI4Mjg4MzF8MA&ixlib=rb-4.1.0&q=85"
            },
            {
                "title": "Board Games Collection",
                "category": "Board Games",
                "description": "Extensive collection of classic and modern board games for all ages",
                "image_data": "https://images.unsplash.com/photo-1632501641765-e568d28b0015?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwzfHxib2FyZCUyMGdhbWVzfGVufDB8fHx8MTc1MjgyODg4NXww&ixlib=rb-4.1.0&q=85"
            },
            {
                "title": "Family Board Game Session",
                "category": "Events",
                "description": "Families and friends enjoying board games together in our comfortable gaming lounge",
                "image_data": "https://images.unsplash.com/photo-1577897113292-3b95936e5206?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzl8MHwxfHNlYXJjaHwxfHxmYW1pbHklMjBnYW1lc3xlbnwwfHx8fDE3NTI4Mjg4OTN8MA&ixlib=rb-4.1.0&q=85"
            },
            {
                "title": "Gaming Tournament Setup",
                "category": "Esports",
                "description": "Professional gaming tournaments and competitive gaming events",
                "image_data": "https://images.pexels.com/photos/7915214/pexels-photo-7915214.jpeg"
            },
            {
                "title": "Modern Gaming Lounge",
                "category": "Setup",
                "description": "State-of-the-art gaming setup with RGB lighting and comfortable seating",
                "image_data": "https://images.unsplash.com/photo-1614179924047-e1ab49a0a0cf?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzF8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBzZXR1cHxlbnwwfHx8fDE3NTI4Mjc5ODF8MA&ixlib=rb-4.1.0&q=85"
            },
            {
                "title": "Group Gaming Sessions",
                "category": "Group",
                "description": "Birthday parties and group gaming events in our spacious gaming area",
                "image_data": "https://images.pexels.com/photos/7915255/pexels-photo-7915255.jpeg"
            },
            {
                "title": "Premium PlayStation Console",
                "category": "PlayStation",
                "description": "Premium PlayStation 5 gaming setup with latest exclusive games",
                "image_data": "https://images.pexels.com/photos/32967534/pexels-photo-32967534.jpeg"
            },
            {
                "title": "Xbox Gaming Environment",
                "category": "Xbox",
                "description": "Professional Xbox Series X gaming station with premium accessories",
                "image_data": "https://images.unsplash.com/photo-1683823362932-6f7599661d22?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHwyfHxYYm94JTIwU2VyaWVzJTIwWHxlbnwwfHx8fDE3NTI4Mjg4MTZ8MA&ixlib=rb-4.1.0&q=85"
            },
            {
                "title": "Active Board Game Play",
                "category": "Board Games",
                "description": "Engaging board game sessions with colorful game pieces and dice",
                "image_data": "https://images.unsplash.com/photo-1629760946220-5693ee4c46ac?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxib2FyZCUyMGdhbWVzfGVufDB8fHx8MTc1MjgyODg4NXww&ixlib=rb-4.1.0&q=85"
            }
        ]
        
        # Clear existing data
        await self.collection.delete_many({})
        
        # Insert new data
        await self.collection.insert_many(gallery_data)
        logger.info("Gallery images seeded successfully")

class SettingsService:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
        self.collection = db.settings
    
    async def get_settings(self) -> Optional[Settings]:
        """Get application settings"""
        settings_doc = await self.collection.find_one({})
        if settings_doc:
            return Settings(**settings_doc)
        return None
    
    async def update_settings(self, settings_data: dict) -> Settings:
        """Update application settings"""
        settings_data['updated_at'] = datetime.utcnow()
        
        result = await self.collection.update_one(
            {},
            {"$set": settings_data},
            upsert=True
        )
        
        return await self.get_settings()
    
    async def seed_settings(self):
        """Seed initial settings data"""
        settings_data = {
            "pricing": {
                "individual": 120.0,
                "group": 100.0,
                "group_min_size": 3,
                "birthday_package": 2500.0,
                "birthday_duration": 4,
                "birthday_max_people": 8
            },
            "contact": {
                "address": "123 Gaming Street, Tech City, TC 12345",
                "phone": "+91 98765 43210",
                "email": "info@karthikeyagamesgalaxy.com",
                "hours": "10:00 AM - 10:00 PM",
                "social": {
                    "facebook": "#",
                    "twitter": "#",
                    "instagram": "#",
                    "youtube": "#"
                }
            }
        }
        
        # Clear existing data
        await self.collection.delete_many({})
        
        # Insert new data
        await self.collection.insert_one(settings_data)
        logger.info("Settings seeded successfully")