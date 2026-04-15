import requests
import sys
import json
from datetime import datetime

class JSEAPITester:
    def __init__(self, base_url="https://prompt-genius-hub.preview.emergentagent.com"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []

    def run_test(self, name, method, endpoint, expected_status, data=None, timeout=30):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=timeout)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=timeout)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    print(f"   Response: {json.dumps(response_data, indent=2)[:200]}...")
                    return True, response_data
                except:
                    return True, response.text
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:200]}...")
                self.failed_tests.append({
                    "test": name,
                    "expected": expected_status,
                    "actual": response.status_code,
                    "response": response.text[:200]
                })
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.failed_tests.append({
                "test": name,
                "error": str(e)
            })
            return False, {}

    def test_health_endpoint(self):
        """Test health endpoint"""
        return self.run_test(
            "Health Check",
            "GET",
            "api/health",
            200
        )

    def test_council_of_experts(self):
        """Test Council of Experts endpoint"""
        test_question = "Should our small business invest in AI automation tools?"
        return self.run_test(
            "Council of Experts",
            "POST",
            "api/ai/council",
            200,
            data={"question": test_question},
            timeout=60  # AI responses take longer
        )

    def test_council_validation(self):
        """Test Council of Experts input validation"""
        return self.run_test(
            "Council Input Validation",
            "POST",
            "api/ai/council",
            400,
            data={"question": "hi"}  # Too short
        )

    def test_bicameral_pipeline(self):
        """Test Bicameral Pipeline endpoint"""
        test_draft = "AI is revolutionizing business operations by automating repetitive tasks and providing data-driven insights that help companies make better decisions faster."
        return self.run_test(
            "Bicameral Pipeline",
            "POST",
            "api/ai/bicameral/verify",
            200,
            data={"draft": test_draft, "context": "professional AI education content"},
            timeout=60  # AI responses take longer
        )

    def test_bicameral_validation(self):
        """Test Bicameral Pipeline input validation"""
        return self.run_test(
            "Bicameral Input Validation",
            "POST",
            "api/ai/bicameral/verify",
            400,
            data={"draft": "short"}  # Too short
        )

    def test_progress_endpoints(self):
        """Test progress tracking endpoints"""
        # Test saving progress
        progress_data = {
            "exercise_id": "test-exercise",
            "score": 85,
            "completed": True,
            "data": {"test": "data"}
        }
        
        save_success, _ = self.run_test(
            "Save Progress",
            "POST",
            "api/progress",
            200,
            data=progress_data
        )
        
        if save_success:
            # Test getting progress
            get_success, response = self.run_test(
                "Get Progress",
                "GET",
                "api/progress",
                200
            )
            return get_success
        
        return save_success

def main():
    print("🚀 Starting JSE AI Mastery API Tests")
    print("=" * 50)
    
    # Setup
    tester = JSEAPITester()
    
    # Run basic tests first
    print("\n📋 BASIC API TESTS")
    print("-" * 30)
    tester.test_health_endpoint()
    tester.test_progress_endpoints()
    
    # Test input validation
    print("\n🔒 INPUT VALIDATION TESTS")
    print("-" * 30)
    tester.test_council_validation()
    tester.test_bicameral_validation()
    
    # Test AI endpoints (these take longer)
    print("\n🤖 LIVE AI INTEGRATION TESTS")
    print("-" * 30)
    print("⚠️  These tests use live Claude API and may take 10-30 seconds each")
    
    council_success, council_data = tester.test_council_of_experts()
    if council_success and council_data:
        print("   Council response structure check:")
        required_keys = ['optimist', 'skeptic', 'strategist', 'community', 'synthesis']
        for key in required_keys:
            if key in council_data.get('data', {}):
                print(f"   ✅ {key} perspective found")
            else:
                print(f"   ❌ {key} perspective missing")
    
    bicameral_success, bicameral_data = tester.test_bicameral_pipeline()
    if bicameral_success and bicameral_data:
        print("   Bicameral response structure check:")
        required_keys = ['score', 'pass', 'strengths', 'violations', 'fixes', 'summary']
        for key in required_keys:
            if key in bicameral_data.get('data', {}):
                print(f"   ✅ {key} field found")
            else:
                print(f"   ❌ {key} field missing")

    # Print results
    print("\n" + "=" * 50)
    print(f"📊 FINAL RESULTS")
    print(f"Tests passed: {tester.tests_passed}/{tester.tests_run}")
    print(f"Success rate: {round((tester.tests_passed/tester.tests_run)*100)}%")
    
    if tester.failed_tests:
        print(f"\n❌ FAILED TESTS:")
        for failure in tester.failed_tests:
            error_msg = failure.get('error', f"Expected {failure.get('expected')}, got {failure.get('actual')}")
            print(f"   • {failure.get('test', 'Unknown')}: {error_msg}")
    
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())