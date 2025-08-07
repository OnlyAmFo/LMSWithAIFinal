#!/usr/bin/env python3
"""
Enhanced AI Training Script for LMS
Trains multiple AI models with different data variations
"""

import json
import numpy as np
import pandas as pd
from datetime import datetime, timedelta
import random
from enhanced_ai import EnhancedLMSAI
import os

def generate_varied_training_data():
    """Generate varied training data with different scenarios"""
    
    # Define different student types and performance patterns
    student_types = {
        'high_achiever': {'base_score': 85, 'variance': 10, 'trend': 2},
        'consistent_learner': {'base_score': 75, 'variance': 15, 'trend': 0},
        'struggling_learner': {'base_score': 60, 'variance': 20, 'trend': -1},
        'improving_learner': {'base_score': 65, 'variance': 15, 'trend': 3},
        'declining_learner': {'base_score': 80, 'variance': 15, 'trend': -2}
    }
    
    topics = [
        'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science',
        'English', 'History', 'Geography', 'Literature', 'Economics',
        'Psychology', 'Sociology', 'Art', 'Music', 'Physical Education'
    ]
    
    assignment_types = ['quiz', 'assignment', 'exam', 'lab', 'project', 'presentation']
    
    training_data = {}
    
    # Generate data for different classes
    for class_num in range(1, 6):
        class_size = random.randint(20, 35)
        
        for student_num in range(1, class_size + 1):
            student_id = f"class{class_num}_student{student_num}"
            
            # Randomly assign student type
            student_type = random.choice(list(student_types.keys()))
            params = student_types[student_type]
            
            # Generate scores over time
            scores = []
            base_date = datetime(2024, 1, 1)
            
            # Generate 10-20 assessments per student
            num_assessments = random.randint(10, 20)
            
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
                
                # Generate date (spread over 6 months)
                days_offset = random.randint(0, 180)
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

def generate_specialized_scenarios():
    """Generate specialized training scenarios"""
    
    scenarios = {
        'gifted_students': {
            'base_score': 90,
            'variance': 8,
            'trend': 1,
            'topics': ['Advanced Mathematics', 'Physics', 'Computer Science'],
            'count': 15
        },
        'at_risk_students': {
            'base_score': 55,
            'variance': 25,
            'trend': -1,
            'topics': ['Mathematics', 'Physics', 'Chemistry'],
            'count': 20
        },
        'improving_students': {
            'base_score': 60,
            'variance': 20,
            'trend': 4,
            'topics': ['Mathematics', 'Physics', 'Chemistry', 'Biology'],
            'count': 25
        },
        'consistent_performers': {
            'base_score': 75,
            'variance': 12,
            'trend': 0,
            'topics': ['English', 'History', 'Geography', 'Literature'],
            'count': 30
        }
    }
    
    specialized_data = {}
    base_date = datetime(2024, 1, 1)
    
    for scenario_name, params in scenarios.items():
        for i in range(1, params['count'] + 1):
            student_id = f"{scenario_name}_student{i}"
            scores = []
            
            # Generate 12-18 assessments
            num_assessments = random.randint(12, 18)
            
            for j in range(num_assessments):
                trend_factor = params['trend'] * j
                variance = random.gauss(0, params['variance'])
                score = params['base_score'] + trend_factor + variance
                score = max(0, min(100, score))
                
                topic = random.choice(params['topics'])
                assignment_type = random.choice(['quiz', 'assignment', 'exam', 'lab'])
                
                days_offset = random.randint(0, 180)
                date = base_date + timedelta(days=days_offset)
                
                scores.append({
                    'topic': topic,
                    'score': round(score, 1),
                    'maxScore': 100,
                    'date': date.strftime('%Y-%m-%d'),
                    'assignmentType': assignment_type
                })
            
            scores.sort(key=lambda x: x['date'])
            specialized_data[student_id] = scores
    
    return specialized_data

def train_all_models():
    """Train all AI models with comprehensive data"""
    
    print("🚀 Starting Enhanced AI Training...")
    
    # Generate training data
    print("📊 Generating training data...")
    basic_data = generate_varied_training_data()
    specialized_data = generate_specialized_scenarios()
    
    # Combine all data
    all_data = {**basic_data, **specialized_data}
    
    print(f"📈 Generated data for {len(all_data)} students")
    
    # Save training data
    with open('ai_training_data.json', 'w') as f:
        json.dump(all_data, f, indent=2)
    
    print("💾 Training data saved to ai_training_data.json")
    
    # Initialize AI system
    ai = EnhancedLMSAI()
    
    # Train all models
    print("\n🧠 Training AI Models...")
    
    # 1. Performance Prediction Model
    print("1️⃣ Training Performance Prediction Model...")
    if ai.train_performance_model(all_data):
        print("✅ Performance model trained successfully")
    else:
        print("❌ Performance model training failed")
    
    # 2. Risk Classification Model
    print("2️⃣ Training Risk Classification Model...")
    if ai.train_risk_classification_model(all_data):
        print("✅ Risk classification model trained successfully")
    else:
        print("❌ Risk classification model training failed")
    
    # 3. Content Recommendation Model
    print("3️⃣ Training Content Recommendation Model...")
    if ai.train_content_recommendation_model(all_data):
        print("✅ Content recommendation model trained successfully")
    else:
        print("❌ Content recommendation model training failed")
    
    # 4. Automated Grading Model
    print("4️⃣ Training Automated Grading Model...")
    if ai.train_grading_model(all_data):
        print("✅ Automated grading model trained successfully")
    else:
        print("❌ Automated grading model training failed")
    
    # 5. Learning Path Optimization Model
    print("5️⃣ Training Learning Path Optimization Model...")
    if ai.train_learning_path_model(all_data):
        print("✅ Learning path optimization model trained successfully")
    else:
        print("❌ Learning path optimization model training failed")
    
    # 6. Behavioral Analysis Model
    print("6️⃣ Training Behavioral Analysis Model...")
    if ai.train_behavioral_model(all_data):
        print("✅ Behavioral analysis model trained successfully")
    else:
        print("❌ Behavioral analysis model training failed")
    
    # Save all models
    print("\n💾 Saving trained models...")
    os.makedirs('models', exist_ok=True)
    ai.save_models('models/enhanced_ai_models.pkl')
    print("✅ All models saved successfully")
    
    # Test the models
    print("\n🧪 Testing AI Models...")
    test_models(ai, all_data)
    
    return ai

def test_models(ai, data):
    """Test all trained models"""
    
    print("\n📊 Testing AI Models with Sample Data...")
    
    # Get a sample student
    sample_student_id = list(data.keys())[0]
    sample_scores = data[sample_student_id]
    
    print(f"Testing with student: {sample_student_id}")
    print(f"Number of assessments: {len(sample_scores)}")
    
    # Test Performance Prediction
    if ai.performance_model:
        predicted_performance = ai.predict_performance(sample_scores)
        print(f"🎯 Predicted Performance: {predicted_performance:.1f}%")
    
    # Test Risk Classification
    if ai.risk_model:
        risk_level = ai.predict_risk_level(sample_scores)
        print(f"⚠️  Predicted Risk Level: {risk_level}")
    
    # Test Content Recommendations
    if hasattr(ai, 'topic_similarities'):
        recommendations = ai.recommend_content(sample_scores)
        print(f"📚 Content Recommendations: {len(recommendations)} found")
        for i, rec in enumerate(recommendations[:3]):
            print(f"   {i+1}. {rec['topic']} ({rec['confidence']:.2f})")
    
    # Test Automated Grading
    if ai.grading_model:
        test_assignment = {
            'topic': 'Mathematics',
            'assignmentType': 'quiz',
            'maxScore': 100
        }
        predicted_grade = ai.auto_grade_assignment(test_assignment)
        print(f"📝 Predicted Grade: {predicted_grade:.1f}%")
    
    # Test Learning Path Optimization
    if hasattr(ai, 'optimal_paths'):
        optimized_path = ai.optimize_learning_path(sample_scores)
        print(f"🛤️  Optimized Learning Path: {len(optimized_path)} steps")
        for i, step in enumerate(optimized_path[:3]):
            print(f"   {i+1}. {step['topic']} ({step['type']})")
    
    # Test Behavioral Analysis
    if ai.behavioral_model:
        behavior = ai.analyze_behavior(sample_scores)
        if behavior:
            print(f"🧠 Learning Style: {behavior['learning_style']}")
            print(f"📈 Consistency: {behavior['consistency']:.2f}")
            print(f"🎯 Engagement: {behavior['engagement']:.2f}")

def generate_model_report():
    """Generate a comprehensive report of the AI models"""
    
    report = {
        'training_date': datetime.now().isoformat(),
        'models_trained': [
            'Performance Prediction Model',
            'Risk Classification Model', 
            'Content Recommendation Model',
            'Automated Grading Model',
            'Learning Path Optimization Model',
            'Behavioral Analysis Model'
        ],
        'features': {
            'performance_prediction': 'Predicts future student performance based on historical data',
            'risk_classification': 'Classifies students into low/medium/high risk categories',
            'content_recommendation': 'Recommends relevant content based on student performance',
            'automated_grading': 'Automatically grades assignments based on patterns',
            'learning_path_optimization': 'Optimizes learning sequences for maximum effectiveness',
            'behavioral_analysis': 'Analyzes learning behavior and provides personalized recommendations'
        },
        'usage_examples': {
            'student_dashboard': 'Show personalized recommendations and learning paths',
            'teacher_dashboard': 'Identify at-risk students and optimize teaching strategies',
            'admin_dashboard': 'Monitor overall class performance and trends',
            'automated_feedback': 'Provide instant feedback on assignments and quizzes'
        }
    }
    
    with open('ai_model_report.json', 'w') as f:
        json.dump(report, f, indent=2)
    
    print("📋 AI Model Report generated: ai_model_report.json")

if __name__ == "__main__":
    print("🎓 Enhanced LMS AI Training System")
    print("=" * 50)
    
    # Train all models
    ai = train_all_models()
    
    # Generate report
    generate_model_report()
    
    print("\n🎉 Enhanced AI Training Complete!")
    print("=" * 50)
    print("✅ All AI models trained and saved")
    print("✅ Training data generated and saved")
    print("✅ Model report generated")
    print("\n🚀 Ready to use enhanced AI features!")
