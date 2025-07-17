# Backend Integration Contracts - Karthikeya Games Galaxy

## Current Frontend Implementation Status
- ✅ Modern dark theme with neon green accents
- ✅ Professional gaming zone aesthetic
- ✅ Complete booking system with mock data
- ✅ Services showcase and pricing display
- ✅ Gallery and contact information
- ✅ Responsive design for all devices

## Mock Data Analysis

### Current Mock Data Location: `/app/frontend/src/data/mockData.js`

#### 1. Bookings Data Structure
```javascript
{
  id: number,
  name: string,
  phone: string,
  email: string,
  gameType: string, // 'playstation', 'xbox', 'nintendo', 'vr', 'board'
  duration: string, // hours as string
  timeSlot: string, // '10:00 AM', '11:00 AM', etc.
  groupSize: string, // number of people as string
  date: Date,
  total: number, // calculated price
  status: string, // 'confirmed', 'pending', 'cancelled'
  createdAt: Date,
  specialRequests?: string
}
```

#### 2. Game Types Data
```javascript
{
  id: string,
  name: string,
  description: string,
  icon: string,
  available: boolean,
  popularGames: string[]
}
```

#### 3. Gallery Images
```javascript
{
  id: number,
  title: string,
  category: string,
  description: string,
  url: string
}
```

#### 4. Contact Information
```javascript
{
  address: string,
  phone: string,
  email: string,
  hours: object,
  social: object
}
```

#### 5. Time Slots
```javascript
{
  time: string,
  available: boolean
}
```

## API Contracts to Implement

### Base URL: `${REACT_APP_BACKEND_URL}/api`

### 1. Bookings API

#### `POST /api/bookings`
**Purpose**: Create a new booking
**Body**:
```json
{
  "name": "string",
  "phone": "string",
  "email": "string",
  "gameType": "string",
  "duration": "string",
  "timeSlot": "string",
  "groupSize": "string",
  "date": "ISO date string",
  "specialRequests": "string"
}
```
**Response**:
```json
{
  "id": "string",
  "name": "string",
  "phone": "string",
  "email": "string",
  "gameType": "string",
  "duration": "string",
  "timeSlot": "string",
  "groupSize": "string",
  "date": "ISO date string",
  "total": "number",
  "status": "confirmed",
  "createdAt": "ISO date string",
  "specialRequests": "string"
}
```

#### `GET /api/bookings`
**Purpose**: Get all bookings (admin use)
**Response**: Array of booking objects

#### `GET /api/bookings/{id}`
**Purpose**: Get specific booking by ID
**Response**: Single booking object

#### `PUT /api/bookings/{id}`
**Purpose**: Update booking status
**Body**:
```json
{
  "status": "confirmed" | "pending" | "cancelled"
}
```

#### `DELETE /api/bookings/{id}`
**Purpose**: Cancel/delete booking

### 2. Availability API

#### `GET /api/availability/{date}`
**Purpose**: Check available time slots for a specific date
**Response**:
```json
{
  "date": "ISO date string",
  "timeSlots": [
    {
      "time": "string",
      "available": "boolean"
    }
  ]
}
```

### 3. Game Types API

#### `GET /api/game-types`
**Purpose**: Get all available game types
**Response**: Array of game type objects

### 4. Gallery API

#### `GET /api/gallery`
**Purpose**: Get all gallery images
**Response**: Array of gallery image objects

#### `POST /api/gallery`
**Purpose**: Upload new gallery image (admin)
**Body**: FormData with image file

### 5. Contact/Settings API

#### `GET /api/settings`
**Purpose**: Get business settings (hours, contact info, pricing)
**Response**:
```json
{
  "pricing": {
    "individual": 120,
    "group": 100,
    "groupMinSize": 3
  },
  "contact": {
    "address": "string",
    "phone": "string",
    "email": "string",
    "hours": "string"
  }
}
```

## MongoDB Models to Create

### 1. Booking Model
```python
class Booking(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    phone: str
    email: Optional[str] = None
    game_type: str
    duration: int
    time_slot: str
    group_size: int
    date: datetime
    total: float
    status: str = "confirmed"
    special_requests: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
```

### 2. GameType Model
```python
class GameType(BaseModel):
    id: str
    name: str
    description: str
    icon: str
    available: bool = True
    popular_games: List[str]
```

### 3. GalleryImage Model
```python
class GalleryImage(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    category: str
    description: str
    image_data: str  # base64 encoded image
    created_at: datetime = Field(default_factory=datetime.utcnow)
```

### 4. Settings Model
```python
class Settings(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    pricing: dict
    contact: dict
    business_hours: dict
    updated_at: datetime = Field(default_factory=datetime.utcnow)
```

## Frontend Integration Plan

### 1. Replace Mock Data Calls
- **BookingPage.js**: Replace local state management with API calls
- **HomePage.js**: Fetch real-time availability and pricing
- **Gallery.js**: Load images from database
- **Contact.js**: Load real contact information

### 2. API Service Layer
Create `/app/frontend/src/services/api.js`:
```javascript
const API_BASE = process.env.REACT_APP_BACKEND_URL + '/api';

export const bookingService = {
  create: (bookingData) => axios.post(`${API_BASE}/bookings`, bookingData),
  getAll: () => axios.get(`${API_BASE}/bookings`),
  getById: (id) => axios.get(`${API_BASE}/bookings/${id}`),
  update: (id, data) => axios.put(`${API_BASE}/bookings/${id}`, data),
  delete: (id) => axios.delete(`${API_BASE}/bookings/${id}`)
};

export const availabilityService = {
  getByDate: (date) => axios.get(`${API_BASE}/availability/${date}`)
};

export const gameTypeService = {
  getAll: () => axios.get(`${API_BASE}/game-types`)
};

export const galleryService = {
  getAll: () => axios.get(`${API_BASE}/gallery`)
};

export const settingsService = {
  get: () => axios.get(`${API_BASE}/settings`)
};
```

### 3. Error Handling
- Implement proper error handling with toast notifications
- Add loading states for all API calls
- Graceful fallbacks for network issues

### 4. Real-time Features
- Live availability checking
- Booking confirmation system
- Status updates

## Pricing Logic
- **Individual**: ₹120/hour
- **Group (3+ people)**: ₹100/hour per person
- **Birthday Package**: ₹2500 for 4 hours (up to 8 people)

## Integration Steps
1. ✅ Create backend models and endpoints
2. ✅ Seed database with initial data
3. ✅ Replace mock data calls with API calls
4. ✅ Test all functionality
5. ✅ Add error handling and loading states
6. ✅ Implement real-time availability checking

## Security Considerations
- Input validation for all booking data
- Rate limiting for booking endpoints
- Basic authentication for admin endpoints
- Data sanitization for special requests

## Success Metrics
- Bookings can be created and stored in database
- Real-time availability updates
- Gallery images load from database
- Contact information is dynamic
- No breaking changes to existing UI/UX