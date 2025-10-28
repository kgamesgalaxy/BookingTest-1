#!/usr/bin/env python3
"""
Specific Backend API Test Suite for Karthikeya Games Galaxy
Tests the exact endpoints and scenarios requested by the user.
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

print(f"🔗 Testing Karthikeya Games Galaxy Backend API at: {API_BASE_URL}")
print("=" * 70)

class KarthikeyaTester:
    def __init__(self):
        self.base_url = API_BASE_URL
        self.session = requests.Session()
        self.test_results = {
            'passed': 0,
            'failed': 0,
            'errors': []
        }
        self.created_booking_reference = None
    
    def log_result(self, test_name, success, message=""):
        if success:
            print(f"✅ {test_name}")
            self.test_results['passed'] += 1
        else:
            print(f"❌ {test_name}: {message}")
            self.test_results['failed'] += 1
            self.test_results['errors'].append(f"{test_name}: {message}")
    
    def test_availability_api_specific_date(self):
        """Test Availability API with specific date: 2025-01-30"""
        print("\n📅 Testing Availability API for 2025-01-30...")
        
        test_date = "2025-01-30"
        
        try:
            response = self.session.get(f"{self.base_url}/availability/{test_date}")
            print(f"   🔗 Request URL: {self.base_url}/availability/{test_date}")
            print(f"   📊 Response Status: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                print(f"   📋 Response Data: {json.dumps(data, indent=2)}")
                
                # Check required structure
                if 'time_slots' in data and isinstance(data['time_slots'], list):
                    time_slots = data['time_slots']
                    
                    if len(time_slots) > 0:
                        # Check time slot structure
                        sample_slot = time_slots[0]
                        if 'time' in sample_slot and 'available' in sample_slot:
                            available_slots = [slot['time'] for slot in time_slots if slot.get('available', False)]
                            
                            self.log_result("Availability API - Structure Check", True)
                            self.log_result("Availability API - Time Slots Array", True)
                            print(f"   ⏰ Total time slots: {len(time_slots)}")
                            print(f"   ✅ Available slots: {len(available_slots)}")
                            print(f"   📝 Available times: {', '.join(available_slots[:5])}{'...' if len(available_slots) > 5 else ''}")
                            return True
                        else:
                            self.log_result("Availability API - Time Slot Structure", False, "Missing 'time' or 'available' fields")
                    else:
                        self.log_result("Availability API - Time Slots Array", False, "Empty time slots array")
                else:
                    self.log_result("Availability API - Structure Check", False, "Missing or invalid 'time_slots' field")
            else:
                self.log_result("Availability API", False, f"Status code: {response.status_code}, Response: {response.text}")
        except Exception as e:
            self.log_result("Availability API", False, f"Connection error: {str(e)}")
        return False
    
    def test_bookings_api_create(self):
        """Test Bookings API - POST with specific test data"""
        print("\n📝 Testing Bookings API - Create Booking...")
        
        # Exact test data as requested
        booking_data = {
            "name": "Test User",
            "phone": "+91 98765 43210",
            "email": "test@example.com",
            "game_type": "playstation",
            "time_slot": "2:00 PM",
            "date": "2025-01-30"
        }
        
        try:
            print(f"   🔗 Request URL: {self.base_url}/bookings")
            print(f"   📋 Request Data: {json.dumps(booking_data, indent=2)}")
            
            response = self.session.post(
                f"{self.base_url}/bookings",
                json=booking_data,
                headers={'Content-Type': 'application/json'}
            )
            
            print(f"   📊 Response Status: {response.status_code}")
            
            if response.status_code == 200:
                booking_response = response.json()
                print(f"   📋 Response Data: {json.dumps(booking_response, indent=2)}")
                
                # Check for reference number with KGG prefix
                reference_number = booking_response.get('reference_number', '')
                if reference_number.startswith('KGG'):
                    self.log_result("Bookings API - Reference Number Generation", True)
                    self.created_booking_reference = reference_number
                    print(f"   🎫 Generated Reference: {reference_number}")
                else:
                    self.log_result("Bookings API - Reference Number Generation", False, f"Reference doesn't start with KGG: {reference_number}")
                
                # Check required fields
                required_fields = ['id', 'name', 'phone', 'email', 'game_type', 'time_slot', 'date', 'reference_number']
                missing_fields = [field for field in required_fields if field not in booking_response]
                
                if not missing_fields:
                    self.log_result("Bookings API - Create Booking", True)
                    self.log_result("Bookings API - Required Fields", True)
                    return True
                else:
                    self.log_result("Bookings API - Required Fields", False, f"Missing fields: {missing_fields}")
            else:
                self.log_result("Bookings API - Create Booking", False, f"Status code: {response.status_code}, Response: {response.text}")
        except Exception as e:
            self.log_result("Bookings API - Create Booking", False, f"Connection error: {str(e)}")
        return False
    
    def test_cancel_booking_api(self):
        """Test Cancel Booking API with valid and invalid reference numbers"""
        print("\n❌ Testing Cancel Booking API...")
        
        # Test with invalid reference number first
        invalid_reference = "INVALID123"
        
        try:
            print(f"   🔗 Testing invalid reference: {invalid_reference}")
            response = self.session.post(f"{self.base_url}/bookings/cancel/{invalid_reference}")
            print(f"   📊 Response Status: {response.status_code}")
            
            if response.status_code == 404:
                self.log_result("Cancel Booking API - Invalid Reference", True)
                print(f"   ✅ Correctly returned 404 for invalid reference")
            else:
                self.log_result("Cancel Booking API - Invalid Reference", False, f"Expected 404, got {response.status_code}")
        except Exception as e:
            self.log_result("Cancel Booking API - Invalid Reference", False, f"Connection error: {str(e)}")
        
        # Test with valid reference number if we have one
        if self.created_booking_reference:
            try:
                print(f"   🔗 Testing valid reference: {self.created_booking_reference}")
                response = self.session.post(f"{self.base_url}/bookings/cancel/{self.created_booking_reference}")
                print(f"   📊 Response Status: {response.status_code}")
                
                if response.status_code == 200:
                    cancel_response = response.json()
                    print(f"   📋 Response Data: {json.dumps(cancel_response, indent=2)}")
                    self.log_result("Cancel Booking API - Valid Reference", True)
                    return True
                elif response.status_code == 400:
                    # Could be cancellation deadline issue
                    error_response = response.json()
                    if "1 hour before" in error_response.get('detail', ''):
                        self.log_result("Cancel Booking API - Cancellation Rule", True)
                        print(f"   ⏰ Correctly enforced 1-hour cancellation rule")
                        return True
                    else:
                        self.log_result("Cancel Booking API - Valid Reference", False, f"Unexpected 400 error: {error_response}")
                else:
                    self.log_result("Cancel Booking API - Valid Reference", False, f"Status code: {response.status_code}, Response: {response.text}")
            except Exception as e:
                self.log_result("Cancel Booking API - Valid Reference", False, f"Connection error: {str(e)}")
        else:
            print("   ⚠️ No valid booking reference available for testing")
        
        return False
    
    def test_settings_api(self):
        """Test Settings API - GET settings"""
        print("\n⚙️ Testing Settings API...")
        
        try:
            response = self.session.get(f"{self.base_url}/settings")
            print(f"   🔗 Request URL: {self.base_url}/settings")
            print(f"   📊 Response Status: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                print(f"   📋 Response Data: {json.dumps(data, indent=2)}")
                
                # Check for game types configuration
                if 'game_types' in data or 'pricing' in data:
                    self.log_result("Settings API - Configuration Data", True)
                    
                    # Check if game types are configured
                    if 'game_types' in data:
                        game_types = data['game_types']
                        if isinstance(game_types, list) and len(game_types) > 0:
                            self.log_result("Settings API - Game Types Configuration", True)
                            print(f"   🎮 Game types configured: {len(game_types)}")
                        else:
                            self.log_result("Settings API - Game Types Configuration", False, "Empty or invalid game types")
                    
                    return True
                else:
                    self.log_result("Settings API - Configuration Data", False, "Missing configuration data")
            else:
                self.log_result("Settings API", False, f"Status code: {response.status_code}, Response: {response.text}")
        except Exception as e:
            self.log_result("Settings API", False, f"Connection error: {str(e)}")
        return False
    
    def test_admin_bookings_api(self):
        """Test Admin API - GET all bookings"""
        print("\n👨‍💼 Testing Admin API - Get All Bookings...")
        
        try:
            response = self.session.get(f"{self.base_url}/admin/bookings")
            print(f"   🔗 Request URL: {self.base_url}/admin/bookings")
            print(f"   📊 Response Status: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                print(f"   📋 Response Type: {type(data)}")
                
                if isinstance(data, list):
                    self.log_result("Admin API - Get All Bookings", True)
                    print(f"   📊 Total bookings retrieved: {len(data)}")
                    
                    if len(data) > 0:
                        # Check structure of first booking
                        sample_booking = data[0]
                        required_fields = ['id', 'name', 'phone', 'game_type', 'time_slot', 'date']
                        missing_fields = [field for field in required_fields if field not in sample_booking]
                        
                        if not missing_fields:
                            self.log_result("Admin API - Booking Structure", True)
                            print(f"   ✅ Booking structure is valid")
                        else:
                            self.log_result("Admin API - Booking Structure", False, f"Missing fields: {missing_fields}")
                    
                    return True
                else:
                    self.log_result("Admin API - Get All Bookings", False, f"Expected list, got {type(data)}")
            else:
                self.log_result("Admin API - Get All Bookings", False, f"Status code: {response.status_code}, Response: {response.text}")
        except Exception as e:
            self.log_result("Admin API - Get All Bookings", False, f"Connection error: {str(e)}")
        return False
    
    def run_specific_tests(self):
        """Run the specific tests requested by the user"""
        print("🎮 Starting Karthikeya Games Galaxy Specific Backend Tests")
        print("=" * 70)
        
        # Test in the order requested
        tests = [
            ("Availability API (/api/availability/2025-01-30)", self.test_availability_api_specific_date),
            ("Bookings API (/api/bookings) - POST", self.test_bookings_api_create),
            ("Cancel Booking API (/api/bookings/cancel/{reference})", self.test_cancel_booking_api),
            ("Settings API (/api/settings)", self.test_settings_api),
            ("Admin API (/api/admin/bookings)", self.test_admin_bookings_api),
        ]
        
        for test_name, test_func in tests:
            print(f"\n🔍 {test_name}")
            test_func()
        
        # Print summary
        print("\n" + "=" * 70)
        print("📊 KARTHIKEYA GAMES GALAXY TEST SUMMARY")
        print("=" * 70)
        print(f"✅ Passed: {self.test_results['passed']}")
        print(f"❌ Failed: {self.test_results['failed']}")
        
        if self.test_results['errors']:
            print("\n🔍 FAILED TESTS:")
            for error in self.test_results['errors']:
                print(f"   • {error}")
        
        success_rate = (self.test_results['passed'] / (self.test_results['passed'] + self.test_results['failed'])) * 100 if (self.test_results['passed'] + self.test_results['failed']) > 0 else 0
        print(f"\n📈 Success Rate: {success_rate:.1f}%")
        
        if success_rate >= 90:
            print("🎉 Karthikeya Games Galaxy Backend API is working excellently!")
        elif success_rate >= 70:
            print("✅ Karthikeya Games Galaxy Backend API is working well with minor issues")
        else:
            print("🚨 Karthikeya Games Galaxy Backend API has significant issues")
        
        return success_rate >= 70

if __name__ == "__main__":
    tester = KarthikeyaTester()
    success = tester.run_specific_tests()
    
    if success:
        print("\n✅ Karthikeya Games Galaxy backend tests completed successfully!")
        exit(0)
    else:
        print("\n❌ Some Karthikeya Games Galaxy backend tests failed!")
        exit(1)