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
                "popular_games": ["Spider-Man 2", "God of War Ragnarök", "Horizon Forbidden West", "The Last of Us Part I"]
            },
            {
                "id": "xbox",
                "name": "Xbox Series X",
                "description": "Xbox Series X with Game Pass library and 4K gaming",
                "icon": "🎮",
                "available": True,
                "popular_games": ["Halo Infinite", "Forza Horizon 5", "Gears 5", "Minecraft"]
            },
            {
                "id": "switch",
                "name": "Nintendo Switch",
                "description": "Nintendo Switch with exclusive games and portable gaming",
                "icon": "🎮",
                "available": True,
                "popular_games": ["Super Mario Odyssey", "The Legend of Zelda", "Mario Kart 8", "Super Smash Bros"]
            },
            {
                "id": "vr",
                "name": "VR Gaming",
                "description": "Immersive virtual reality gaming with latest VR headsets",
                "icon": "🥽",
                "available": True,
                "popular_games": ["Beat Saber", "Half-Life: Alyx", "Superhot VR", "Job Simulator"]
            },
            {
                "id": "board",
                "name": "Board Games",
                "description": "Classic and modern board games for all ages and groups",
                "icon": "🎲",
                "available": True,
                "popular_games": ["Monopoly", "Scrabble", "Settlers of Catan", "Pandemic"]
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
        """Seed initial gallery images (with placeholder data)"""
        gallery_data = [
            {
                "title": "PlayStation Gaming Zone",
                "category": "PlayStation",
                "description": "State-of-the-art PlayStation consoles with comfortable gaming chairs",
                "image_data": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9IiMxMTEzMTMiLz48dGV4dCB4PSIyMDAiIHk9IjE1MCIgZmlsbD0iI0RBRkYwMSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjIwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5QbGF5U3RhdGlvbiBab25lPC90ZXh0Pjwvc3ZnPg=="
            },
            {
                "title": "Xbox Gaming Area",
                "category": "Xbox",
                "description": "Xbox Series X/S setups with high-definition displays",
                "image_data": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9IiMxQTFDMUUiLz48dGV4dCB4PSIyMDAiIHk9IjE1MCIgZmlsbD0iI0RBRkYwMSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjIwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5YYm94IEFyZWE8L3RleHQ+PC9zdmc+"
            },
            {
                "title": "Nintendo Switch Station",
                "category": "Nintendo",
                "description": "Portable and docked Nintendo Switch gaming experience",
                "image_data": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9IiMyNjI4MkEiLz48dGV4dCB4PSIyMDAiIHk9IjE1MCIgZmlsbD0iI0RBRkYwMSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjIwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5OaW50ZW5kbyBTdGF0aW9uPC90ZXh0Pjwvc3ZnPg=="
            },
            {
                "title": "VR Gaming Experience",
                "category": "VR",
                "description": "Immersive virtual reality gaming with latest VR headsets",
                "image_data": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9IiMxMTEzMTMiLz48dGV4dCB4PSIyMDAiIHk9IjE1MCIgZmlsbD0iI0RBRkYwMSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjIwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5WUiBFeHBlcmllbmNlPC90ZXh0Pjwvc3ZnPg=="
            },
            {
                "title": "Board Games Collection",
                "category": "Board Games",
                "description": "Extensive collection of board games for all ages",
                "image_data": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9IiMxQTFDMUUiLz48dGV4dCB4PSIyMDAiIHk9IjE1MCIgZmlsbD0iI0RBRkYwMSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjIwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5Cb2FyZCBHYW1lczwvdGV4dD48L3N2Zz4="
            },
            {
                "title": "Gaming Lounge",
                "category": "Lounge",
                "description": "Comfortable lounge area for relaxation between gaming sessions",
                "image_data": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9IiMyNjI4MkEiLz48dGV4dCB4PSIyMDAiIHk9IjE1MCIgZmlsbD0iI0RBRkYwMSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjIwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5HYW1pbmcgTG91bmdlPC90ZXh0Pjwvc3ZnPg=="
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