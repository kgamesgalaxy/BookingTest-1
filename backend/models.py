from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
import uuid
import random
import string

def generate_booking_reference():
    """Generate a unique booking reference starting with KGG"""
    random_suffix = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
    return f"KGG{random_suffix}"

class BookingCreate(BaseModel):
    name: str
    phone: str
    email: Optional[str] = None
    game_type: str
    time_slot: str
    date: datetime
    special_requests: Optional[str] = None

class Booking(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    reference_number: str = Field(default_factory=generate_booking_reference)
    name: str
    phone: str
    email: Optional[str] = None
    game_type: str
    time_slot: str
    date: datetime
    status: str = "pending"
    special_requests: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class BookingUpdate(BaseModel):
    status: Optional[str] = None
    special_requests: Optional[str] = None

class GameType(BaseModel):
    id: str
    name: str
    description: str
    icon: str
    available: bool = True
    popular_games: List[str]

class GalleryImageCreate(BaseModel):
    title: str
    category: str
    description: str
    image_data: str  # base64 encoded image

class GalleryImage(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    category: str
    description: str
    image_data: str  # base64 encoded image
    created_at: datetime = Field(default_factory=datetime.utcnow)

class TimeSlot(BaseModel):
    time: str
    available: bool

class AvailabilityResponse(BaseModel):
    date: str
    time_slots: List[TimeSlot]

class PricingInfo(BaseModel):
    individual: float
    group: float
    group_min_size: int
    birthday_package: float
    birthday_duration: int
    birthday_max_people: int

class ContactInfo(BaseModel):
    address: str
    phone: str
    email: str
    hours: str
    social: dict

class Settings(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    pricing: PricingInfo
    contact: ContactInfo
    updated_at: datetime = Field(default_factory=datetime.utcnow)