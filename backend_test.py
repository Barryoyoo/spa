#!/usr/bin/env python3

import requests
import sys
import json
from datetime import datetime, timedelta
import time

class SpaAPITester:
    def __init__(self):
        # Use the public URL from frontend .env
        self.base_url = "https://indulgence-nrb.preview.emergentagent.com/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def log_result(self, test_name, status, message, response_data=None):
        """Log test result"""
        self.tests_run += 1
        if status == "PASS":
            self.tests_passed += 1
        
        result = {
            "test": test_name,
            "status": status,
            "message": message,
            "timestamp": datetime.now().isoformat()
        }
        if response_data:
            result["response"] = response_data
        
        self.test_results.append(result)
        
        status_symbol = "✅" if status == "PASS" else "❌"
        print(f"{status_symbol} {test_name}: {message}")

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        
        if headers is None:
            headers = {'Content-Type': 'application/json'}
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=30)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=30)
            else:
                raise ValueError(f"Unsupported method: {method}")

            success = response.status_code == expected_status
            
            if success:
                try:
                    response_json = response.json()
                    self.log_result(name, "PASS", f"Status: {response.status_code}", response_json)
                    return True, response_json
                except json.JSONDecodeError:
                    self.log_result(name, "PASS", f"Status: {response.status_code} (No JSON response)")
                    return True, {}
            else:
                try:
                    error_data = response.json()
                    self.log_result(name, "FAIL", f"Expected {expected_status}, got {response.status_code} - {error_data}")
                except:
                    self.log_result(name, "FAIL", f"Expected {expected_status}, got {response.status_code} - {response.text[:200]}")
                return False, {}

        except requests.exceptions.Timeout:
            self.log_result(name, "FAIL", "Request timed out")
            return False, {}
        except requests.exceptions.ConnectionError:
            self.log_result(name, "FAIL", "Connection error - API may be down")
            return False, {}
        except Exception as e:
            self.log_result(name, "FAIL", f"Error: {str(e)}")
            return False, {}

    def test_api_root(self):
        """Test API root endpoint"""
        return self.run_test("API Root", "GET", "", 200)

    def test_get_services(self):
        """Test services endpoint"""
        success, response = self.run_test("Get Services", "GET", "services", 200)
        if success and isinstance(response, list):
            service_count = len(response)
            if service_count >= 8:
                self.log_result("Services Count", "PASS", f"Found {service_count} services")
                # Check if services have required fields
                if response and all(key in response[0] for key in ['id', 'name', 'description', 'price']):
                    self.log_result("Services Structure", "PASS", "Services have required fields")
                    return True
                else:
                    self.log_result("Services Structure", "FAIL", "Services missing required fields")
            else:
                self.log_result("Services Count", "FAIL", f"Expected at least 8 services, got {service_count}")
        return success

    def test_contact_form(self):
        """Test contact form submission"""
        test_data = {
            "name": "Test User",
            "email": "test@example.com", 
            "phone": "+254712345678",
            "subject": "Test Message",
            "message": "This is a test message from automated testing."
        }
        
        success, response = self.run_test("Contact Form", "POST", "contact", 200, test_data)
        if success and response.get("success"):
            self.log_result("Contact Response", "PASS", "Contact form returned success response")
            return True
        elif success:
            self.log_result("Contact Response", "FAIL", "Contact form did not return success response")
        return success

    def test_booking_form(self):
        """Test booking form submission"""
        # Get tomorrow's date
        tomorrow = (datetime.now() + timedelta(days=1)).strftime("%A, %B %d, %Y")
        
        test_data = {
            "name": "Test Booking User",
            "email": "booking@example.com",
            "phone": "+254712345678", 
            "service": "Swedish Massage",
            "date": tomorrow,
            "time": "02:00 PM",
            "therapist": "Any available",
            "notes": "This is a test booking from automated testing."
        }
        
        success, response = self.run_test("Booking Form", "POST", "booking", 200, test_data)
        if success and response.get("success"):
            self.log_result("Booking Response", "PASS", "Booking form returned success response")
            return True
        elif success:
            self.log_result("Booking Response", "FAIL", "Booking form did not return success response")
        return success

    def test_invalid_contact_data(self):
        """Test contact form with invalid data"""
        invalid_data = {
            "name": "",  # Empty name
            "email": "invalid-email",  # Invalid email
            "phone": "123",  # Too short phone
            "subject": "",  # Empty subject
            "message": "hi"  # Too short message
        }
        
        # Should return 422 validation error
        success, response = self.run_test("Contact Validation", "POST", "contact", 422, invalid_data)
        return success

    def test_invalid_booking_data(self):
        """Test booking form with invalid data"""
        invalid_data = {
            "name": "",  # Empty name
            "email": "invalid-email",  # Invalid email
            "phone": "123",  # Too short phone
            "service": "",  # Empty service
            "date": "",  # Empty date
            "time": ""  # Empty time
        }
        
        # Should return 422 validation error
        success, response = self.run_test("Booking Validation", "POST", "booking", 422, invalid_data)
        return success

    def run_all_tests(self):
        """Run all API tests"""
        print("🚀 Starting Amani Temptress Spa API Tests...")
        print("=" * 50)
        
        # Basic API tests
        self.test_api_root()
        self.test_get_services()
        
        # Form submission tests
        self.test_contact_form()
        self.test_booking_form()
        
        # Validation tests
        self.test_invalid_contact_data()
        self.test_invalid_booking_data()
        
        # Print summary
        print("\n" + "=" * 50)
        print(f"📊 Test Results: {self.tests_passed}/{self.tests_run} tests passed")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All tests passed!")
            return 0
        else:
            print("⚠️ Some tests failed!")
            return 1

    def get_test_results(self):
        """Get detailed test results"""
        return {
            "summary": f"{self.tests_passed}/{self.tests_run} tests passed",
            "tests": self.test_results,
            "success_rate": (self.tests_passed / self.tests_run * 100) if self.tests_run > 0 else 0
        }

def main():
    tester = SpaAPITester()
    exit_code = tester.run_all_tests()
    
    # Save results to file
    with open('/app/test_reports/backend_api_results.json', 'w') as f:
        json.dump(tester.get_test_results(), f, indent=2)
    
    return exit_code

if __name__ == "__main__":
    sys.exit(main())