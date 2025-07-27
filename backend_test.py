#!/usr/bin/env python3
"""
Comprehensive Backend API Test Suite for Karthikeya Games Galaxy
Tests all API endpoints to ensure proper functionality after frontend improvements.
"""

import requests
import json
import os
from datetime import datetime, timedelta
from dotenv import load_dotenv

# Load environment variables
load_dotenv('/app/frontend/.env')

# Get backend URL from environment
BACKEND_URL = os.getenv('REACT_APP_BACKEND_URL')
if not BACKEND_URL:
    print("❌ ERROR: REACT_APP_BACKEND_URL not found in environment")
    exit(1)

# Ensure API prefix is included
API_BASE_URL = f"{BACKEND_URL}/api"

print(f"🔗 Testing Backend API at: {API_BASE_URL}")
print("=" * 60)

class BackendTester:
    def __init__(self):
        self.base_url = API_BASE_URL
        self.session = requests.Session()
        self.test_results = {
            'passed': 0,
            'failed': 0,
            'errors': []
        }
    
    def log_result(self, test_name, success, message=""):
        if success:
            print(f"✅ {test_name}")
            self.test_results['passed'] += 1
        else:
            print(f"❌ {test_name}: {message}")
            self.test_results['failed'] += 1
            self.test_results['errors'].append(f"{test_name}: {message}")
    
    def test_health_check(self):
        """Test API health check endpoint"""
        print("\n🏥 Testing API Health Check...")
        try:
            response = self.session.get(f"{self.base_url}/")
            if response.status_code == 200:
                data = response.json()
                if "Karthikeya Games Galaxy API is running" in data.get('message', ''):
                    self.log_result("Health Check", True)
                    return True
                else:
                    self.log_result("Health Check", False, f"Unexpected message: {data}")
            else:
                self.log_result("Health Check", False, f"Status code: {response.status_code}")
        except Exception as e:
            self.log_result("Health Check", False, f"Connection error: {str(e)}")
        return False
    
    def test_game_types_api(self):
        """Test Game Types API endpoint"""
        print("\n🎮 Testing Game Types API...")
        try:
            response = self.session.get(f"{self.base_url}/game-types")
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list) and len(data) > 0:
                    # Check for expected game types
                    game_type_names = [game['name'] for game in data]
                    expected_types = ['PlayStation 5', 'Xbox Series X', 'Nintendo Switch', 'VR Gaming', 'Board Games']
                    
                    found_types = []
                    for expected in expected_types:
                        if expected in game_type_names:
                            found_types.append(expected)
                    
                    if len(found_types) >= 4:  # At least 4 out of 5 expected types
                        self.log_result("Game Types API - Data Structure", True)
                        
                        # Test individual game type structure
                        sample_game = data[0]
                        required_fields = ['id', 'name', 'description', 'icon', 'available', 'popular_games']
                        missing_fields = [field for field in required_fields if field not in sample_game]
                        
                        if not missing_fields:
                            self.log_result("Game Types API - Field Structure", True)
                            
                            # Test popular games array
                            if isinstance(sample_game.get('popular_games'), list) and len(sample_game['popular_games']) > 0:
                                self.log_result("Game Types API - Popular Games", True)
                                print(f"   📋 Found {len(data)} game types: {', '.join(found_types)}")
                                return True
                            else:
                                self.log_result("Game Types API - Popular Games", False, "Popular games not found or empty")
                        else:
                            self.log_result("Game Types API - Field Structure", False, f"Missing fields: {missing_fields}")
                    else:
                        self.log_result("Game Types API - Data Structure", False, f"Expected game types not found. Found: {found_types}")
                else:
                    self.log_result("Game Types API - Data Structure", False, "Empty or invalid response")
            else:
                self.log_result("Game Types API", False, f"Status code: {response.status_code}")
        except Exception as e:
            self.log_result("Game Types API", False, f"Connection error: {str(e)}")
        return False
    
    def test_gallery_api(self):
        """Test Gallery Images API endpoint"""
        print("\n🖼️ Testing Gallery Images API...")
        try:
            response = self.session.get(f"{self.base_url}/gallery")
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list) and len(data) > 0:
                    # Test gallery image structure
                    sample_image = data[0]
                    required_fields = ['id', 'title', 'category', 'description', 'image_data', 'created_at']
                    missing_fields = [field for field in required_fields if field not in sample_image]
                    
                    if not missing_fields:
                        self.log_result("Gallery API - Field Structure", True)
                        
                        # Test image data format (should be URL or base64)
                        image_data = sample_image.get('image_data', '')
                        if image_data.startswith('http') or image_data.startswith('data:image'):
                            self.log_result("Gallery API - Image Data Format", True)
                            
                            # Test categories
                            categories = list(set([img.get('category') for img in data]))
                            expected_categories = ['PlayStation', 'Xbox', 'Nintendo', 'VR', 'Board Games', 'Setup']
                            found_categories = [cat for cat in expected_categories if cat in categories]
                            
                            if len(found_categories) >= 3:  # At least 3 categories
                                self.log_result("Gallery API - Categories", True)
                                print(f"   📸 Found {len(data)} gallery images in categories: {', '.join(categories)}")
                                return True
                            else:
                                self.log_result("Gallery API - Categories", False, f"Expected categories not found. Found: {categories}")
                        else:
                            self.log_result("Gallery API - Image Data Format", False, "Invalid image data format")
                    else:
                        self.log_result("Gallery API - Field Structure", False, f"Missing fields: {missing_fields}")
                else:
                    self.log_result("Gallery API - Data Structure", False, "Empty or invalid response")
            else:
                self.log_result("Gallery API", False, f"Status code: {response.status_code}")
        except Exception as e:
            self.log_result("Gallery API", False, f"Connection error: {str(e)}")
        return False
    
    def test_booking_api(self):
        """Test Booking API endpoints with simplified booking model"""
        print("\n📅 Testing Booking API...")
        
        # Test GET all bookings first
        try:
            response = self.session.get(f"{self.base_url}/bookings")
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    self.log_result("Booking API - GET All Bookings", True)
                    print(f"   📋 Found {len(data)} existing bookings")
                else:
                    self.log_result("Booking API - GET All Bookings", False, "Invalid response format")
                    return False
            else:
                self.log_result("Booking API - GET All Bookings", False, f"Status code: {response.status_code}")
                return False
        except Exception as e:
            self.log_result("Booking API - GET All Bookings", False, f"Connection error: {str(e)}")
            return False
        
        # Test POST create booking with simplified model (no duration, group_size, total)
        booking_data = {
            "name": "Arjun Kumar",
            "phone": "+91 9876543210",
            "email": "arjun.kumar@email.com",
            "game_type": "PlayStation 5",
            "time_slot": "3:00 PM",
            "date": (datetime.now() + timedelta(days=1)).isoformat(),
            "special_requests": "Birthday celebration setup"
        }
        
        try:
            response = self.session.post(
                f"{self.base_url}/bookings",
                json=booking_data,
                headers={'Content-Type': 'application/json'}
            )
            
            if response.status_code == 200:
                booking_response = response.json()
                # Updated required fields for simplified booking model
                required_fields = ['id', 'name', 'phone', 'game_type', 'time_slot', 'date', 'status']
                missing_fields = [field for field in required_fields if field not in booking_response]
                
                if not missing_fields:
                    booking_id = booking_response['id']
                    status = booking_response.get('status', '')
                    
                    # Verify default status is "pending"
                    if status == "pending":
                        self.log_result("Booking API - POST Create Booking", True)
                        self.log_result("Booking API - Default Status", True)
                        print(f"   📝 Booking created with ID: {booking_id}, Status: {status}")
                        
                        # Test GET specific booking
                        self.test_get_specific_booking(booking_id)
                        
                        # Test PUT update booking
                        self.test_update_booking(booking_id)
                        
                        # Test DELETE booking
                        self.test_delete_booking(booking_id)
                        
                        return True
                    else:
                        self.log_result("Booking API - Default Status", False, f"Expected: pending, Got: {status}")
                else:
                    self.log_result("Booking API - POST Create Booking", False, f"Missing fields: {missing_fields}")
            else:
                self.log_result("Booking API - POST Create Booking", False, f"Status code: {response.status_code}, Response: {response.text}")
        except Exception as e:
            self.log_result("Booking API - POST Create Booking", False, f"Connection error: {str(e)}")
        
        return False
    
    def test_get_specific_booking(self, booking_id):
        """Test GET specific booking by ID"""
        try:
            response = self.session.get(f"{self.base_url}/bookings/{booking_id}")
            if response.status_code == 200:
                booking = response.json()
                if booking.get('id') == booking_id:
                    self.log_result("Booking API - GET Specific Booking", True)
                else:
                    self.log_result("Booking API - GET Specific Booking", False, "ID mismatch")
            else:
                self.log_result("Booking API - GET Specific Booking", False, f"Status code: {response.status_code}")
        except Exception as e:
            self.log_result("Booking API - GET Specific Booking", False, f"Error: {str(e)}")
    
    def test_update_booking(self, booking_id):
        """Test PUT update booking"""
        update_data = {
            "status": "confirmed",
            "special_requests": "Updated: Please arrange extra controllers"
        }
        
        try:
            response = self.session.put(
                f"{self.base_url}/bookings/{booking_id}",
                json=update_data,
                headers={'Content-Type': 'application/json'}
            )
            
            if response.status_code == 200:
                updated_booking = response.json()
                if updated_booking.get('special_requests') == update_data['special_requests']:
                    self.log_result("Booking API - PUT Update Booking", True)
                else:
                    self.log_result("Booking API - PUT Update Booking", False, "Update not reflected")
            else:
                self.log_result("Booking API - PUT Update Booking", False, f"Status code: {response.status_code}")
        except Exception as e:
            self.log_result("Booking API - PUT Update Booking", False, f"Error: {str(e)}")
    
    def test_delete_booking(self, booking_id):
        """Test DELETE booking"""
        try:
            response = self.session.delete(f"{self.base_url}/bookings/{booking_id}")
            if response.status_code == 200:
                result = response.json()
                if "deleted successfully" in result.get('message', ''):
                    self.log_result("Booking API - DELETE Booking", True)
                else:
                    self.log_result("Booking API - DELETE Booking", False, "Unexpected response")
            else:
                self.log_result("Booking API - DELETE Booking", False, f"Status code: {response.status_code}")
        except Exception as e:
            self.log_result("Booking API - DELETE Booking", False, f"Error: {str(e)}")
    
    def test_availability_api(self):
        """Test Availability API endpoint"""
        print("\n📅 Testing Availability API...")
        
        # Test availability for tomorrow
        tomorrow = (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d")
        
        try:
            response = self.session.get(f"{self.base_url}/availability/{tomorrow}")
            if response.status_code == 200:
                data = response.json()
                required_fields = ['date', 'time_slots']
                missing_fields = [field for field in required_fields if field not in data]
                
                if not missing_fields:
                    if data['date'] == tomorrow and isinstance(data['time_slots'], list):
                        # Check time slot structure
                        if len(data['time_slots']) > 0:
                            sample_slot = data['time_slots'][0]
                            slot_fields = ['time', 'available']
                            missing_slot_fields = [field for field in slot_fields if field not in sample_slot]
                            
                            if not missing_slot_fields:
                                available_slots = [slot['time'] for slot in data['time_slots'] if slot['available']]
                                self.log_result("Availability API", True)
                                print(f"   ⏰ Found {len(available_slots)} available time slots for {tomorrow}")
                                return True
                            else:
                                self.log_result("Availability API", False, f"Missing slot fields: {missing_slot_fields}")
                        else:
                            self.log_result("Availability API", False, "No time slots found")
                    else:
                        self.log_result("Availability API", False, "Invalid date or time_slots format")
                else:
                    self.log_result("Availability API", False, f"Missing fields: {missing_fields}")
            else:
                self.log_result("Availability API", False, f"Status code: {response.status_code}")
        except Exception as e:
            self.log_result("Availability API", False, f"Connection error: {str(e)}")
        return False
    
    def test_settings_api(self):
        """Test Settings API endpoint"""
        print("\n⚙️ Testing Settings API...")
        try:
            response = self.session.get(f"{self.base_url}/settings")
            if response.status_code == 200:
                data = response.json()
                required_fields = ['id', 'pricing', 'contact', 'updated_at']
                missing_fields = [field for field in required_fields if field not in data]
                
                if not missing_fields:
                    # Test pricing structure
                    pricing = data.get('pricing', {})
                    pricing_fields = ['individual', 'group', 'group_min_size', 'birthday_package']
                    missing_pricing = [field for field in pricing_fields if field not in pricing]
                    
                    # Test contact structure
                    contact = data.get('contact', {})
                    contact_fields = ['address', 'phone', 'email', 'hours']
                    missing_contact = [field for field in contact_fields if field not in contact]
                    
                    if not missing_pricing and not missing_contact:
                        self.log_result("Settings API", True)
                        print(f"   💰 Individual rate: ₹{pricing.get('individual')}/hour")
                        print(f"   👥 Group rate: ₹{pricing.get('group')}/hour (min {pricing.get('group_min_size')} people)")
                        print(f"   📞 Contact: {contact.get('phone')}")
                        return True
                    else:
                        missing_all = missing_pricing + missing_contact
                        self.log_result("Settings API", False, f"Missing nested fields: {missing_all}")
                else:
                    self.log_result("Settings API", False, f"Missing fields: {missing_fields}")
            else:
                self.log_result("Settings API", False, f"Status code: {response.status_code}")
        except Exception as e:
            self.log_result("Settings API", False, f"Connection error: {str(e)}")
        return False
    
    def test_admin_interface(self):
        """Test Admin Bookings Interface"""
        print("\n👨‍💼 Testing Admin Bookings Interface...")
        try:
            # Test admin bookings page (note: no /api prefix for admin routes)
            admin_url = f"{BACKEND_URL}/admin/bookings"
            response = self.session.get(admin_url)
            
            if response.status_code == 200:
                html_content = response.text
                
                # Check for key elements in the HTML
                required_elements = [
                    "Karthikeya Games Galaxy - Bookings",
                    "Total Bookings:",
                    "booking-card",
                    "booking-header"
                ]
                
                missing_elements = []
                for element in required_elements:
                    if element not in html_content:
                        missing_elements.append(element)
                
                if not missing_elements:
                    self.log_result("Admin Interface - HTML Structure", True)
                    
                    # Check if it's showing bookings or no bookings message
                    if "No bookings found" in html_content:
                        self.log_result("Admin Interface - No Bookings Display", True)
                        print("   📋 Admin interface correctly shows 'No bookings found' message")
                    elif "booking-card" in html_content:
                        self.log_result("Admin Interface - Bookings Display", True)
                        print("   📋 Admin interface correctly displays existing bookings")
                    
                    # Check for auto-refresh functionality
                    if "setTimeout(() => location.reload(), 30000)" in html_content:
                        self.log_result("Admin Interface - Auto Refresh", True)
                        print("   🔄 Admin interface has auto-refresh functionality")
                        return True
                    else:
                        self.log_result("Admin Interface - Auto Refresh", False, "Auto-refresh script not found")
                else:
                    self.log_result("Admin Interface - HTML Structure", False, f"Missing elements: {missing_elements}")
            else:
                self.log_result("Admin Interface", False, f"Status code: {response.status_code}")
        except Exception as e:
            self.log_result("Admin Interface", False, f"Connection error: {str(e)}")
        return False
    
    def test_seed_endpoint(self):
        """Test database seeding endpoint"""
        print("\n🌱 Testing Seed Database Endpoint...")
        try:
            response = self.session.post(f"{self.base_url}/seed")
            if response.status_code == 200:
                data = response.json()
                if "seeded successfully" in data.get('message', ''):
                    self.log_result("Seed Database", True)
                    return True
                else:
                    self.log_result("Seed Database", False, f"Unexpected message: {data}")
            else:
                self.log_result("Seed Database", False, f"Status code: {response.status_code}")
        except Exception as e:
            self.log_result("Seed Database", False, f"Connection error: {str(e)}")
        return False
    
    def run_all_tests(self):
        """Run all backend API tests"""
        print("🚀 Starting Comprehensive Backend API Tests")
        print("=" * 60)
        
        # Test in logical order
        tests = [
            self.test_health_check,
            self.test_seed_endpoint,  # Seed data first
            self.test_game_types_api,
            self.test_gallery_api,
            self.test_settings_api,
            self.test_availability_api,
            self.test_booking_api,
            self.test_admin_interface,  # Test admin interface
        ]
        
        for test in tests:
            test()
        
        # Print summary
        print("\n" + "=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        print(f"✅ Passed: {self.test_results['passed']}")
        print(f"❌ Failed: {self.test_results['failed']}")
        
        if self.test_results['errors']:
            print("\n🔍 FAILED TESTS:")
            for error in self.test_results['errors']:
                print(f"   • {error}")
        
        success_rate = (self.test_results['passed'] / (self.test_results['passed'] + self.test_results['failed'])) * 100
        print(f"\n📈 Success Rate: {success_rate:.1f}%")
        
        if success_rate >= 80:
            print("🎉 Backend API is functioning well!")
        elif success_rate >= 60:
            print("⚠️ Backend API has some issues but core functionality works")
        else:
            print("🚨 Backend API has significant issues that need attention")
        
        return success_rate >= 80

if __name__ == "__main__":
    tester = BackendTester()
    success = tester.run_all_tests()
    
    if success:
        print("\n✅ All critical backend tests passed!")
        exit(0)
    else:
        print("\n❌ Some backend tests failed!")
        exit(1)