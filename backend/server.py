from fastapi import FastAPI, APIRouter, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import HTMLResponse
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
# Only load .env file if it exists (for local development)
dotenv_path = ROOT_DIR / '.env'
if dotenv_path.exists():
    load_dotenv(dotenv_path)

# MongoDB connection
try:
    mongo_url = os.environ['MONGO_URL']
    client = AsyncIOMotorClient(mongo_url)
    db = client[os.environ['DB_NAME']]
except KeyError as e:
    print(f"Missing environment variable: {e}")
    raise
except Exception as e:
    print(f"Error connecting to MongoDB: {e}")
    raise

# Initialize services
booking_service = BookingService(db)
availability_service = AvailabilityService(booking_service)
game_type_service = GameTypeService(db)
gallery_service = GalleryService(db)
settings_service = SettingsService(db)

# Create the main app
app = FastAPI(title="Karthikeya Games Galaxy API", version="1.0.0")

# Add TrustedHostMiddleware to allow Railway domains
app.add_middleware(
    TrustedHostMiddleware, allowed_hosts=["kgamesgalaxy-production.up.railway.app", "*.up.railway.app", "localhost", "127.0.0.1"]
)

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

@api_router.post("/bookings/calculate-price")
async def calculate_price(data: dict):
    """Calculate price for a booking"""
    game_type = data.get('game_type')
    duration = data.get('duration', 60)
    num_people = data.get('num_people', 1)
    
    if not game_type:
        raise HTTPException(status_code=400, detail="game_type is required")
    
    try:
        from config import PRICING_PER_HOUR
        
        if game_type not in PRICING_PER_HOUR:
            raise HTTPException(status_code=400, detail=f"Invalid game type: {game_type}")
        
        rate_per_hour = PRICING_PER_HOUR[game_type]
        hours = duration / 60
        total_price = rate_per_hour * hours * num_people
        
        return {
            "game_type": game_type,
            "duration": duration,
            "num_people": num_people,
            "rate_per_hour": rate_per_hour,
            "total_price": round(total_price, 2),
            "breakdown": {
                "rate": f"₹{rate_per_hour}/hour/person",
                "hours": hours,
                "people": num_people,
                "calculation": f"₹{rate_per_hour} × {hours} hours × {num_people} people"
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

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

@api_router.get("/bookings/reference/{reference_number}", response_model=Booking)
async def get_booking_by_reference(reference_number: str):
    """Get booking by reference number"""
    try:
        booking = await booking_service.get_booking_by_reference(reference_number)
        if not booking:
            raise HTTPException(status_code=404, detail="Booking not found")
        return booking
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching booking by reference: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch booking")

@api_router.post("/bookings/reference/{reference_number}/cancel")
async def cancel_booking_by_reference(reference_number: str):
    """Cancel booking by reference number (user self-cancellation)"""
    try:
        booking = await booking_service.get_booking_by_reference(reference_number)
        if not booking:
            raise HTTPException(status_code=404, detail="Booking not found")
        
        # Check if booking is already cancelled
        if booking.status == "cancelled":
            raise HTTPException(status_code=400, detail="Booking is already cancelled")
        
        # Check if cancellation is allowed (1 hour before session)
        from datetime import datetime, timedelta
        session_datetime = booking.date
        current_time = datetime.utcnow()
        cancellation_deadline = session_datetime - timedelta(hours=1)
        
        if current_time > cancellation_deadline:
            raise HTTPException(
                status_code=400, 
                detail="Cancellation not allowed. Must cancel at least 1 hour before session time."
            )
        
        # Update booking status to cancelled
        updated_booking = await booking_service.update_booking(booking.id, {"status": "cancelled"})
        return {
            "message": "Booking cancelled successfully",
            "booking": updated_booking
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error cancelling booking: {e}")
        raise HTTPException(status_code=500, detail="Failed to cancel booking")

# Availability endpoints
@api_router.get("/availability/{date}", response_model=AvailabilityResponse)
async def get_availability(date: str, game_type: str = None, duration: int = 60):
    """Get availability for a specific date, optionally filtered by game type and duration"""
    try:
        date_obj = datetime.strptime(date, "%Y-%m-%d")
        availability = await availability_service.get_availability(date_obj, game_type, duration)
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

# Simple health check endpoint at the app level
@app.get("/")
async def health_check():
    return {"status": "ok", "message": "Karthikeya Games Galaxy backend is running!"}

# Startup event handler
@app.on_event("startup")
async def startup_event():
    logger.info("Application startup event triggered")
    logger.info(f"MONGO_URL is set: {'YES' if 'MONGO_URL' in os.environ else 'NO'}")
    logger.info(f"DB_NAME is set: {'YES' if 'DB_NAME' in os.environ else 'NO'}")

# Admin page to view bookings
@app.get("/admin/bookings", response_class=HTMLResponse)
async def admin_bookings_page():
    """Simple admin page to view all bookings"""
    try:
        bookings = await booking_service.get_all_bookings()

        # Build a simple HTML table for bookings
        rows = []
        for b in bookings:
            if isinstance(b, dict):
                bid = b.get("id", "")
                game_type = b.get("game_type", "")
                start_time = b.get("start_time", "")
            else:
                bid = getattr(b, "id", "")
                game_type = getattr(b, "game_type", "")
                start_time = getattr(b, "start_time", "")
            rows.append(f"<tr><td>{bid}</td><td>{game_type}</td><td>{start_time}</td></tr>")

        html = (
            "<html><head><title>Admin Bookings</title></head><body>"
            "<h1>Bookings</h1>"
            "<table border='1'>"
            "<tr><th>ID</th><th>Game Type</th><th>Start Time</th></tr>"
            f"{''.join(rows)}"
            "</table></body></html>"
        )

        return HTMLResponse(content=html)
    except Exception as e:
        logger.error(f"Error fetching bookings for admin page: {e}")
        raise HTTPException(status_code=500, detail="Failed to load admin bookings")

# Note: Below is an alternate, more styled admin page template.
# It continues the HTML/CSS started elsewhere in the file.
@app.get("/admin/bookings/styled", response_class=HTMLResponse)
async def admin_bookings_styled_page():
    """Styled admin page to view all bookings"""
    try:
        bookings = await booking_service.get_all_bookings()

        # Create simple HTML page
        html_content = """
        <!DOCTYPE html>
        <html>
        <head>
            <title>Karthikeya Games Galaxy - Bookings Admin</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
                .container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                h1 { color: #3b82f6; text-align: center; margin-bottom: 30px; }
                .booking-card { border: 1px solid #e2e8f0; border-radius: 8px; margin: 15px 0; padding: 15px; background: #f8fafc; }
                .booking-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
                .booking-name { font-size: 18px; font-weight: bold; color: #1e293b; }
                .booking-status { padding: 5px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; }
                .status-pending { background: #fef3c7; color: #92400e; }
                .status-confirmed { background: #d1fae5; color: #166534; }
                .booking-details { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; }
                .detail-item { margin: 5px 0; }
                .detail-label { font-weight: bold; color: #475569; }
                .detail-value { color: #1e293b; }
                .no-bookings { text-align: center; color: #64748b; padding: 40px; }
                @media (max-width: 768px) {
                    .booking-header { flex-direction: column; align-items: flex-start; }
                    .booking-details { grid-template-columns: 1fr; }
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>🎮 Karthikeya Games Galaxy - Bookings</h1>
        """
        
        if bookings:
            html_content += f"<p style='text-align: center; color: #64748b;'>Total Bookings: {len(bookings)}</p>"
            
            # Sort bookings by created_at descending (newest first)
            sorted_bookings = sorted(bookings, key=lambda x: x.created_at, reverse=True)
            
            for booking in sorted_bookings:
                game_type_display = {
                    'playstation': '🎮 PlayStation',
                    'playstation_steering': '🏎️ PlayStation + Steering',
                    'xbox': '🎮 Xbox',
                    'nintendo_switch': '🕹️ Nintendo Switch',
                    'vr': '🥽 VR',
                    'board_games': '🎲 Board Games'
                }.get(booking.game_type, booking.game_type)
                
                html_content += f"""
                <div class="booking-card">
                    <div class="booking-header">
                        <div class="booking-name">{booking.name}</div>
                        <div class="booking-status status-{booking.status}">{booking.status.upper()}</div>
                    </div>
                    <div class="booking-details">
                        <div class="detail-item">
                            <span class="detail-label">Phone:</span>
                            <span class="detail-value">{booking.phone}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Email:</span>
                            <span class="detail-value">{booking.email or 'Not provided'}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Game Type:</span>
                            <span class="detail-value">{game_type_display}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Date:</span>
                            <span class="detail-value">{booking.date.strftime('%B %d, %Y')}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Time Slot:</span>
                            <span class="detail-value">{booking.time_slot}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Booking ID:</span>
                            <span class="detail-value">{booking.id[:8]}...</span>
                        </div>
                    </div>
                    {f'<div style="margin-top: 10px;"><span class="detail-label">Special Requests:</span> {booking.special_requests}</div>' if booking.special_requests else ''}
                    <div style="margin-top: 10px; font-size: 12px; color: #64748b;">
                        Created: {booking.created_at.strftime('%B %d, %Y at %I:%M %p')}
                    </div>
                </div>
                """
        else:
            html_content += """
            <div class="no-bookings">
                <h3>No bookings found</h3>
                <p>Bookings will appear here when customers make reservations.</p>
            </div>
            """
        
        html_content += """
            </div>
            <script>
                // Auto-refresh every 30 seconds
                setTimeout(() => location.reload(), 30000);
            </script>
        </body>
        </html>
        """
        
        return html_content

    except Exception as e:
        logger.error(f"Error loading admin page: {e}")
        return f"<html><body><h1>Error loading bookings: {str(e)}</h1></body></html>"

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()


# Logging and startup diagnostics
import os
import logging

# Configure basic logging so startup issues can be diagnosed
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
import os

# Configure basic logging so startup issues can be diagnosed
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8001))
    logger.info(f"Starting server on port {port}")
    uvicorn.run(app, host="0.0.0.0", port=port)

# Logging and startup diagnostics
import logging
import os

# Configure basic logging so startup issues can be diagnosed
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Determine the configured port (falls back to 8001) and log it
try:
    port = int(os.environ.get("PORT", 8001))
except Exception:
    port = 8001
logger.info(f"Configured to start server on port {port}")

@app.on_event("startup")
async def log_startup_event():
    # This will run when FastAPI triggers the startup event (useful when running under uvicorn)
    logger.info("Application startup event triggered. FastAPI app is initializing.")

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8080))
    print(f"Starting server on port {port}")

    # Debug information
    print("Environment variables:")
    print(f"  PORT: {os.environ.get('PORT', 'Not set')}")
    print(f"  MONGO_URL: {'SET' if 'MONGO_URL' in os.environ else 'Not set'}")
    print(f"  DB_NAME: {'SET' if 'DB_NAME' in os.environ else 'Not set'}")

    uvicorn.run(app, host="0.0.0.0", port=port)
