#!/usr/bin/env python3
"""
Test script for the LMS AI Performance Analysis Module
"""

import requests
import json
from datetime import datetime

# Test data
test_student_scores = {
    "student_id": "test_student_001",
    "scores": [
        {
            "student_id": "test_student_001",
            "topic": "Mathematics",
            "score": 85,
            "max_score": 100,
            "date": "2024-01-15",
            "assignment_type": "quiz"
        },
        {
            "student_id": "test_student_001",
            "topic": "Mathematics",
            "score": 78,
            "max_score": 100,
            "date": "2024-01-20",
            "assignment_type": "assignment"
        },
        {
            "student_id": "test_student_001",
            "topic": "Physics",
            "score": 92,
            "max_score": 100,
            "date": "2024-01-18",
            "assignment_type": "quiz"
        },
        {
            "student_id": "test_student_001",
            "topic": "Physics",
            "score": 65,
            "max_score": 100,
            "date": "2024-01-25",
            "assignment_type": "exam"
        },
        {
            "student_id": "test_student_001",
            "topic": "Chemistry",
            "score": 88,
            "max_score": 100,
            "date": "2024-01-22",
            "assignment_type": "assignment"
        }
    ]
}

def test_health_check():
    """Test the health check endpoint"""
    try:
        response = requests.get("http://localhost:8001/health")
        if response.status_code == 200:
            print("✅ Health check passed")
            return True
        else:
            print(f"❌ Health check failed: {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to AI service. Make sure it's running on port 8001")
        return False

def test_performance_analysis():
    """Test the performance analysis endpoint"""
    try:
        response = requests.post(
            "http://localhost:8001/analyze-performance",
            json=test_student_scores,
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Performance analysis successful")
            print(f"📊 Overall Performance: {result['overall_performance']:.1f}%")
            print(f"📈 Trend: {result['trend']}")
            print(f"⚠️ Risk Level: {result['risk_level']}")
            print(f"🎯 Weaknesses found: {len(result['weaknesses'])}")
            print(f"💡 Recommendations: {len(result['recommendations'])}")
            return True
        else:
            print(f"❌ Performance analysis failed: {response.status_code}")
            print(f"Response: {response.text}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to AI service")
        return False

def test_class_analysis():
    """Test the class performance analysis endpoint"""
    try:
        class_data = [
            test_student_scores,
            {
                "student_id": "test_student_002",
                "scores": [
                    {
                        "student_id": "test_student_002",
                        "topic": "Mathematics",
                        "score": 72,
                        "max_score": 100,
                        "date": "2024-01-15",
                        "assignment_type": "quiz"
                    },
                    {
                        "student_id": "test_student_002",
                        "topic": "Physics",
                        "score": 85,
                        "max_score": 100,
                        "date": "2024-01-18",
                        "assignment_type": "quiz"
                    }
                ]
            }
        ]
        
        response = requests.post(
            "http://localhost:8001/analyze-class-performance",
            json=class_data,
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Class analysis successful")
            print(f"📊 Class Average: {result['class_statistics']['average_performance']:.1f}%")
            print(f"👥 Total Students: {len(result['student_analyses'])}")
            print(f"⚠️ At-risk Students: {result['class_statistics']['at_risk_students']}")
            return True
        else:
            print(f"❌ Class analysis failed: {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to AI service")
        return False

def main():
    """Run all tests"""
    print("🧪 Testing LMS AI Performance Analysis Module")
    print("=" * 50)
    
    # Test health check
    if not test_health_check():
        print("\n❌ Health check failed. Please start the AI service first.")
        print("Run: python main.py")
        return
    
    print("\n" + "=" * 50)
    
    # Test individual performance analysis
    test_performance_analysis()
    
    print("\n" + "=" * 50)
    
    # Test class performance analysis
    test_class_analysis()
    
    print("\n" + "=" * 50)
    print("🎉 All tests completed!")

if __name__ == "__main__":
    main() 