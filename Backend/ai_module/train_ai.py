#!/usr/bin/env python3
"""
LMS AI Training Script
This script generates training data and trains the AI models for performance prediction and risk assessment.
"""

import os
import sys
from enhanced_ai import EnhancedLMSAI
from data_generator import LMSDataGenerator

def main():
    print("🚀 LMS AI Training System")
    print("=" * 50)
    
    # Step 1: Generate Training Data
    print("\n📊 Step 1: Generating Training Data...")
    generator = LMSDataGenerator()
    
    # Generate realistic data for multiple classes
    print("Generating data for 5 classes with 30 students each...")
    training_data = generator.generate_multiple_classes(num_classes=5, students_per_class=30)
    
    # Save the training data
    generator.save_data(training_data, "ai_training_data.json")
    
    print(f"✅ Generated data for {len(training_data)} students")
    
    # Step 2: Train AI Models
    print("\n🧠 Step 2: Training AI Models...")
    ai = EnhancedLMSAI()
    
    # Train the models
    success = ai.train_models(training_data)
    
    if success:
        print("✅ AI models trained successfully!")
        
        # Step 3: Test the Models
        print("\n🧪 Step 3: Testing AI Models...")
        
        # Test with a sample student
        sample_student = list(training_data.keys())[0]
        sample_scores = training_data[sample_student]
        
        print(f"Testing with student: {sample_student}")
        
        # Predict performance
        predicted_performance = ai.predict_student_performance(sample_scores)
        predicted_risk = ai.predict_student_risk(sample_scores)
        
        # Calculate actual average
        actual_avg = sum(s['score'] for s in sample_scores) / len(sample_scores)
        
        print(f"Actual Average: {actual_avg:.1f}")
        print(f"Predicted Performance: {predicted_performance:.1f}")
        print(f"Predicted Risk Level: {predicted_risk}")
        
        # Step 4: Show Model Performance
        print("\n📈 Step 4: Model Performance Summary...")
        print("✅ Performance Prediction Model: Ready")
        print("✅ Risk Classification Model: Ready")
        print("✅ Models saved to 'models/' directory")
        
        # Step 5: Integration Instructions
        print("\n🔗 Step 5: Integration Instructions...")
        print("1. Models are saved in 'models/' directory")
        print("2. Use EnhancedLMSAI class in your main.py")
        print("3. Call load_models() to load trained models")
        print("4. Use predict_student_performance() and predict_student_risk()")
        
        return True
    else:
        print("❌ Failed to train models. Check your data.")
        return False

def test_models():
    """Test the trained models with sample data"""
    print("\n🧪 Testing Trained Models...")
    
    ai = EnhancedLMSAI()
    
    if not ai.load_models():
        print("❌ No trained models found. Run training first.")
        return
    
    # Load test data
    generator = LMSDataGenerator()
    test_data = generator.load_data("ai_training_data.json")
    
    if not test_data:
        print("❌ No test data found.")
        return
    
    # Test with 5 random students
    import random
    test_students = random.sample(list(test_data.keys()), 5)
    
    print(f"Testing with {len(test_students)} students:")
    print("-" * 60)
    
    for student_id in test_students:
        scores = test_data[student_id]
        actual_avg = sum(s['score'] for s in scores) / len(scores)
        
        predicted_perf = ai.predict_student_performance(scores)
        predicted_risk = ai.predict_student_risk(scores)
        
        print(f"Student: {student_id}")
        print(f"  Actual Avg: {actual_avg:.1f}")
        print(f"  Predicted: {predicted_perf:.1f}")
        print(f"  Risk Level: {predicted_risk}")
        print(f"  Error: {abs(actual_avg - predicted_perf):.1f}")
        print()

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "test":
        test_models()
    else:
        main() 