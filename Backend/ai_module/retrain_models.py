#!/usr/bin/env python3
"""
AI Model Retraining Script
Shows how to retrain models with new data to get different predictions
"""

import json
import numpy as np
import pandas as pd
from datetime import datetime, timedelta
import random
from enhanced_ai import EnhancedLMSAI
import os

def generate_new_training_data(scenario="improved"):
    """Generate new training data with different patterns"""
    
    if scenario == "improved":
        # Students are performing better overall
        student_types = {
            'excellent_achiever': {'base_score': 92, 'variance': 8, 'trend': 3},
            'good_learner': {'base_score': 82, 'variance': 12, 'trend': 2},
            'average_learner': {'base_score': 75, 'variance': 15, 'trend': 1},
            'struggling_but_improving': {'base_score': 65, 'variance': 18, 'trend': 4},
            'needs_support': {'base_score': 55, 'variance': 20, 'trend': 2}
        }
    elif scenario == "declining":
        # Students are performing worse overall
        student_types = {
            'declining_achiever': {'base_score': 75, 'variance': 15, 'trend': -3},
            'struggling_learner': {'base_score': 60, 'variance': 20, 'trend': -2},
            'at_risk': {'base_score': 45, 'variance': 25, 'trend': -4},
            'failing': {'base_score': 35, 'variance': 30, 'trend': -5}
        }
    elif scenario == "mixed":
        # Mixed performance patterns
        student_types = {
            'high_achiever': {'base_score': 88, 'variance': 10, 'trend': 1},
            'consistent_learner': {'base_score': 78, 'variance': 12, 'trend': 0},
            'improving_learner': {'base_score': 70, 'variance': 15, 'trend': 3},
            'struggling_learner': {'base_score': 58, 'variance': 18, 'trend': -1},
            'at_risk': {'base_score': 45, 'variance': 22, 'trend': -2}
        }
    
    topics = [
        'Advanced Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science',
        'Data Science', 'Machine Learning', 'Statistics', 'Calculus', 'Linear Algebra',
        'Programming', 'Web Development', 'Database Systems', 'Software Engineering'
    ]
    
    assignment_types = ['quiz', 'assignment', 'exam', 'lab', 'project', 'presentation', 'research']
    
    training_data = {}
    
    # Generate data for different classes
    for class_num in range(1, 4):
        class_size = random.randint(25, 40)
        
        for student_num in range(1, class_size + 1):
            student_id = f"class{class_num}_student{student_num}"
            
            # Randomly assign student type
            student_type = random.choice(list(student_types.keys()))
            params = student_types[student_type]
            
            # Generate scores over time
            scores = []
            base_date = datetime(2024, 6, 1)  # More recent data
            
            # Generate 15-25 assessments per student (more data)
            num_assessments = random.randint(15, 25)
            
            for i in range(num_assessments):
                # Calculate score with trend and variance
                trend_factor = params['trend'] * i
                variance = random.gauss(0, params['variance'])
                score = params['base_score'] + trend_factor + variance
                
                # Ensure score is within bounds
                score = max(0, min(100, score))
                
                # Random topic and assignment type
                topic = random.choice(topics)
                assignment_type = random.choice(assignment_types)
                
                # Generate date (spread over 8 months)
                days_offset = random.randint(0, 240)
                date = base_date + timedelta(days=days_offset)
                
                scores.append({
                    'topic': topic,
                    'score': round(score, 1),
                    'maxScore': 100,
                    'date': date.strftime('%Y-%m-%d'),
                    'assignmentType': assignment_type
                })
            
            # Sort by date
            scores.sort(key=lambda x: x['date'])
            training_data[student_id] = scores
    
    return training_data

def retrain_models_with_new_data(scenario="improved"):
    """Retrain all models with new data"""
    
    print(f"🔄 Retraining models with {scenario} scenario...")
    
    # Generate new training data
    new_training_data = generate_new_training_data(scenario)
    
    # Save new training data
    with open('ai_training_data_new.json', 'w') as f:
        json.dump(new_training_data, f, indent=2)
    
    print(f"✅ Generated new training data with {len(new_training_data)} students")
    
    # Initialize AI
    ai = EnhancedLMSAI()
    
    # Train all models with new data
    print("🧠 Training performance prediction model...")
    performance_success = ai.train_performance_model(new_training_data)
    
    print("🎯 Training risk classification model...")
    risk_success = ai.train_risk_classification_model(new_training_data)
    
    print("📚 Training content recommendation model...")
    content_success = ai.train_content_recommendation_model(new_training_data)
    
    print("📝 Training grading model...")
    grading_success = ai.train_grading_model(new_training_data)
    
    print("🛤️ Training learning path model...")
    learning_path_success = ai.train_learning_path_model(new_training_data)
    
    print("🧠 Training behavioral analysis model...")
    behavioral_success = ai.train_behavioral_model(new_training_data)
    
    # Save all models
    if any([performance_success, risk_success, content_success, grading_success, learning_path_success, behavioral_success]):
        ai.save_models('models/enhanced_ai_models_new.pkl')
        print("✅ Models saved successfully!")
        
        # Test the new models
        test_new_models(ai, new_training_data)
        
        return True
    else:
        print("❌ Model training failed!")
        return False

def test_new_models(ai, data):
    """Test the newly trained models"""
    
    print("\n🧪 Testing new models...")
    
    # Test with a few students
    test_students = list(data.keys())[:3]
    
    for student_id in test_students:
        student_scores = data[student_id]
        
        print(f"\n📊 Testing student: {student_id}")
        
        # Test performance prediction
        if ai.performance_model:
            predicted_performance = ai.predict_performance(student_scores)
            actual_avg = np.mean([s['score'] for s in student_scores])
            print(f"   Performance Prediction: {predicted_performance:.1f} (Actual: {actual_avg:.1f})")
        
        # Test risk classification
        if ai.risk_model:
            risk_level = ai.predict_risk_level(student_scores)
            print(f"   Risk Level: {risk_level}")
        
        # Test content recommendations
        if ai.content_recommendation_model:
            recommendations = ai.recommend_content(student_scores)
            print(f"   Content Recommendations: {len(recommendations)} items")
        
        # Test learning path
        if ai.learning_path_model:
            learning_path = ai.optimize_learning_path(student_scores)
            print(f"   Learning Path Length: {learning_path['path_length']} steps")
        
        # Test behavioral analysis
        if ai.behavioral_model:
            behavior = ai.analyze_behavior(student_scores)
            print(f"   Learning Style: {behavior['learning_style']}")

def compare_predictions():
    """Compare predictions before and after retraining"""
    
    print("\n🔄 Loading old and new models...")
    
    # Load old models
    ai_old = EnhancedLMSAI()
    try:
        ai_old.load_models('models/enhanced_ai_models.pkl')
        print("✅ Old models loaded")
    except:
        print("❌ Old models not found")
        return
    
    # Load new models
    ai_new = EnhancedLMSAI()
    try:
        ai_new.load_models('models/enhanced_ai_models_new.pkl')
        print("✅ New models loaded")
    except:
        print("❌ New models not found")
        return
    
    # Load test data
    try:
        with open('ai_training_data.json', 'r') as f:
            old_data = json.load(f)
        with open('ai_training_data_new.json', 'r') as f:
            new_data = json.load(f)
    except:
        print("❌ Training data not found")
        return
    
    # Compare predictions
    test_student = list(old_data.keys())[0]
    student_scores = old_data[test_student]
    
    print(f"\n📊 Comparing predictions for student: {test_student}")
    
    # Performance prediction comparison
    if ai_old.performance_model and ai_new.performance_model:
        old_prediction = ai_old.predict_performance(student_scores)
        new_prediction = ai_new.predict_performance(student_scores)
        actual_avg = np.mean([s['score'] for s in student_scores])
        
        print(f"   Performance Prediction:")
        print(f"     Old Model: {old_prediction:.1f}")
        print(f"     New Model: {new_prediction:.1f}")
        print(f"     Actual: {actual_avg:.1f}")
        print(f"     Difference: {new_prediction - old_prediction:.1f}")
    
    # Risk classification comparison
    if ai_old.risk_model and ai_new.risk_model:
        old_risk = ai_old.predict_risk_level(student_scores)
        new_risk = ai_new.predict_risk_level(student_scores)
        
        print(f"   Risk Classification:")
        print(f"     Old Model: {old_risk}")
        print(f"     New Model: {new_risk}")

def main():
    """Main function to demonstrate model retraining"""
    
    print("🚀 AI Model Retraining Demo")
    print("=" * 50)
    
    # Show different scenarios
    scenarios = ["improved", "declining", "mixed"]
    
    for scenario in scenarios:
        print(f"\n📈 Training with {scenario} scenario...")
        
        # Retrain models
        success = retrain_models_with_new_data(scenario)
        
        if success:
            print(f"✅ Models retrained with {scenario} scenario!")
            
            # Compare predictions
            compare_predictions()
            
            # Ask user if they want to continue
            if scenario != scenarios[-1]:
                input("\nPress Enter to continue with next scenario...")
    
    print("\n🎉 Retraining demo completed!")
    print("\n📝 Summary:")
    print("- Different training data = Different predictions")
    print("- More recent data = More accurate predictions")
    print("- Better data quality = Better AI insights")

if __name__ == "__main__":
    main()
