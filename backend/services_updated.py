from datetime import datetime, timedelta, time
from typing import List, Optional, Dict
from models import Booking, GameType, GalleryImage, Settings, TimeSlot, AvailabilityResponse, PricingInfo, ContactInfo
from motor.motor_asyncio import AsyncIOMotorDatabase
from config import RESOURCE_CAPACITY, PRICING_PER_HOUR, START_TIME, END_TIME, SLOT_INTERVAL
import logging

logger = logging.getLogger(__name__)

class BookingService:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
        self.collection = db.bookings
    
    def calculate_price(self, game_type: str, duration: int, num_people: int) -> float:
        """Calculate total price based on game type, duration, and number of people"""
        if game_type not in PRICING_PER_HOUR:
            raise ValueError(f"Invalid game type: {game_type}")
        
        rate_per_hour = PRICING_PER_HOUR[game_type]
        hours = duration / 60  # Convert minutes to hours
        total_price = rate_per_hour * hours * num_people
        
        return round(total_price, 2)
    
    async def create_booking(self, booking_data: dict) -> Booking:
        """Create a new booking with price calculation"""
        # Calculate price
        price = self.calculate_price(
            booking_data['game_type'],
            booking_data.get('duration', 60),
            booking_data.get('num_people', 1)
        )
        
        booking_data['price'] = price
        booking_data['status'] = 'pending'
        
        booking = Booking(**booking_data)
        booking_dict = booking.dict()
        await self.collection.insert_one(booking_dict)
        
        logger.info(f"Created booking for {booking.name} on {booking.date} - Price: ₹{price}")
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
    
    async def get_booking_by_reference(self, reference_number: str) -> Optional[Booking]:
        """Get booking by reference number"""
        booking_doc = await self.collection.find_one({"reference_number": reference_number})
        if booking_doc:
            return Booking(**booking_doc)
        return None
    
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
    
    async def get_bookings_by_date_and_game_type(self, date: datetime, game_type: str) -> List[Booking]:
        """Get bookings for a specific date and game type"""
        start_date = datetime.combine(date.date(), datetime.min.time())
        end_date = start_date + timedelta(days=1)
        
        cursor = self.collection.find({
            "date": {
                "$gte": start_date,
                "$lt": end_date
            },
            "game_type": game_type
        })
        
        bookings = []
        async for booking_doc in cursor:
            bookings.append(Booking(**booking_doc))
        return bookings

class AvailabilityService:
    def __init__(self, booking_service: BookingService):
        self.booking_service = booking_service
    
    def generate_time_slots(self) -> List[str]:
        """Generate 30-minute interval time slots"""
        slots = []
        current_time = time(START_TIME, 0)
        end_time = time(END_TIME, 0)
        
        while current_time < end_time:
            # Format time as 12-hour format
            hour = current_time.hour
            minute = current_time.minute
            am_pm = "AM" if hour < 12 else "PM"
            display_hour = hour if hour <= 12 else hour - 12
            if display_hour == 0:
                display_hour = 12
            
            time_str = f"{display_hour}:{minute:02d} {am_pm}"
            slots.append(time_str)
            
            # Add 30 minutes
            total_minutes = current_time.hour * 60 + current_time.minute + SLOT_INTERVAL
            new_hour = total_minutes // 60
            new_minute = total_minutes % 60
            current_time = time(new_hour, new_minute)
        
        return slots
    
    def get_slots_for_duration(self, start_slot: str, duration: int) -> List[str]:
        """Get all slots needed for a booking duration"""
        all_slots = self.generate_time_slots()
        if start_slot not in all_slots:
            return []
        
        start_index = all_slots.index(start_slot)
        num_slots = duration // SLOT_INTERVAL
        
        return all_slots[start_index:start_index + num_slots]
    
    async def check_capacity_for_slot(self, date: datetime, time_slot: str, game_type: str, duration: int) -> Dict:
        """Check capacity for a specific time slot considering duration"""
        # Get all bookings for this date and game type
        bookings = await self.booking_service.get_bookings_by_date_and_game_type(date, game_type)
        
        # Get required slots for this duration
        required_slots = self.get_slots_for_duration(time_slot, duration)
        
        # Count bookings for each required slot
        max_capacity = RESOURCE_CAPACITY.get(game_type, 1)
        
        # Check each required slot
        for slot in required_slots:
            slot_bookings = 0
            for booking in bookings:
                # Check if this booking overlaps with this slot
                booking_slots = self.get_slots_for_duration(booking.time_slot, booking.duration)
                if slot in booking_slots:
                    slot_bookings += 1
            
            # If any slot is full, the time slot is not available
            if slot_bookings >= max_capacity:
                return {
                    "available": False,
                    "booked": slot_bookings,
                    "capacity": max_capacity
                }
        
        # All slots available
        slot_bookings = 0
        for booking in bookings:
            booking_slots = self.get_slots_for_duration(booking.time_slot, booking.duration)
            if time_slot in booking_slots:
                slot_bookings += 1
        
        return {
            "available": True,
            "booked": slot_bookings,
            "capacity": max_capacity
        }
    
    async def get_availability(self, date: datetime, game_type: str = None, duration: int = 60) -> AvailabilityResponse:
        """Get availability for a specific date, optionally filtered by game type"""
        time_slots = []
        all_time_slots = self.generate_time_slots()
        
        for slot in all_time_slots:
            if game_type:
                capacity_info = await self.check_capacity_for_slot(date, slot, game_type, duration)
                time_slots.append(TimeSlot(
                    time=slot,
                    available=capacity_info["available"],
                    booked=capacity_info["booked"],
                    capacity=capacity_info["capacity"]
                ))
            else:
                # If no game type specified, check if any resource is available
                time_slots.append(TimeSlot(
                    time=slot,
                    available=True  # Simplified for now
                ))
        
        return AvailabilityResponse(
            date=date.date(),
            time_slots=time_slots
        )

# Rest of the services remain the same...
class GameTypeService:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
        self.collection = db.game_types
    
    async def get_all(self) -> List[GameType]:
        cursor = self.collection.find()
        game_types = []
        async for doc in cursor:
            game_types.append(GameType(**doc))
        return game_types

class GalleryService:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
        self.collection = db.gallery
    
    async def get_all(self) -> List[GalleryImage]:
        cursor = self.collection.find()
        images = []
        async for doc in cursor:
            images.append(GalleryImage(**doc))
        return images

class SettingsService:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
        self.collection = db.settings
    
    async def get_settings(self) -> Optional[Settings]:
        doc = await self.collection.find_one()
        if doc:
            return Settings(**doc)
        return None
