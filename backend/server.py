from fastapi import FastAPI, APIRouter, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from datetime import datetime
from typing import List, Optional

# Import models and services
from models import (
    Booking, BookingCreate, BookingUpdate, GameType, GalleryImage, 
    GalleryImageCreate, Settings, AvailabilityResponse
)
from services import (
    BookingService, AvailabilityService, GameTypeService, 
    GalleryService, SettingsService
)

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Initialize services
booking_service = BookingService(db)
availability_service = AvailabilityService(booking_service)
game_type_service = GameTypeService(db)
gallery_service = GalleryService(db)
settings_service = SettingsService(db)

# Create the main app
app = FastAPI(title="Karthikeya Games Galaxy API", version="1.0.0")

# Create router with /api prefix
api_router = APIRouter(prefix="/api")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Health check endpoint
@api_router.get("/")
async def root():
    return {"message": "Karthikeya Games Galaxy API is running!"}

# Booking endpoints
@api_router.post("/bookings", response_model=Booking)
async def create_booking(booking_data: BookingCreate):
    """Create a new booking"""
    try:
        booking = await booking_service.create_booking(booking_data.dict())
        return booking
    except Exception as e:
        logger.error(f"Error creating booking: {e}")
        raise HTTPException(status_code=500, detail="Failed to create booking")

@api_router.get("/bookings", response_model=List[Booking])
async def get_all_bookings():
    """Get all bookings"""
    try:
        bookings = await booking_service.get_all_bookings()
        return bookings
    except Exception as e:
        logger.error(f"Error fetching bookings: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch bookings")

@api_router.get("/bookings/{booking_id}", response_model=Booking)
async def get_booking(booking_id: str):
    """Get booking by ID"""
    try:
        booking = await booking_service.get_booking_by_id(booking_id)
        if not booking:
            raise HTTPException(status_code=404, detail="Booking not found")
        return booking
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching booking: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch booking")

@api_router.put("/bookings/{booking_id}", response_model=Booking)
async def update_booking(booking_id: str, update_data: BookingUpdate):
    """Update booking"""
    try:
        booking = await booking_service.update_booking(booking_id, update_data.dict(exclude_unset=True))
        if not booking:
            raise HTTPException(status_code=404, detail="Booking not found")
        return booking
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating booking: {e}")
        raise HTTPException(status_code=500, detail="Failed to update booking")

@api_router.delete("/bookings/{booking_id}")
async def delete_booking(booking_id: str):
    """Delete booking"""
    try:
        deleted = await booking_service.delete_booking(booking_id)
        if not deleted:
            raise HTTPException(status_code=404, detail="Booking not found")
        return {"message": "Booking deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting booking: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete booking")

# Availability endpoints
@api_router.get("/availability/{date}", response_model=AvailabilityResponse)
async def get_availability(date: str):
    """Get availability for a specific date"""
    try:
        date_obj = datetime.strptime(date, "%Y-%m-%d")
        availability = await availability_service.get_availability_for_date(date_obj)
        return availability
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD")
    except Exception as e:
        logger.error(f"Error fetching availability: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch availability")

# Game types endpoints
@api_router.get("/game-types", response_model=List[GameType])
async def get_game_types():
    """Get all game types"""
    try:
        game_types = await game_type_service.get_all_game_types()
        return game_types
    except Exception as e:
        logger.error(f"Error fetching game types: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch game types")

# Gallery endpoints
@api_router.get("/gallery", response_model=List[GalleryImage])
async def get_gallery():
    """Get all gallery images"""
    try:
        images = await gallery_service.get_all_images()
        return images
    except Exception as e:
        logger.error(f"Error fetching gallery: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch gallery")

@api_router.post("/gallery", response_model=GalleryImage)
async def create_gallery_image(image_data: GalleryImageCreate):
    """Create a new gallery image"""
    try:
        image = await gallery_service.create_image(image_data.dict())
        return image
    except Exception as e:
        logger.error(f"Error creating gallery image: {e}")
        raise HTTPException(status_code=500, detail="Failed to create gallery image")

# Settings endpoints
@api_router.get("/settings", response_model=Settings)
async def get_settings():
    """Get application settings"""
    try:
        settings = await settings_service.get_settings()
        if not settings:
            raise HTTPException(status_code=404, detail="Settings not found")
        return settings
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching settings: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch settings")

# Seed data endpoint (for initial setup)
@api_router.post("/seed")
async def seed_database():
    """Seed database with initial data"""
    try:
        await game_type_service.seed_game_types()
        await gallery_service.seed_gallery_images()
        await settings_service.seed_settings()
        logger.info("Database seeded successfully")
        return {"message": "Database seeded successfully"}
    except Exception as e:
        logger.error(f"Error seeding database: {e}")
        raise HTTPException(status_code=500, detail="Failed to seed database")

# Include the router in the main app
app.include_router(api_router)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
