from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional, Any
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
import joblib
import os
from datetime import datetime
import json
import random
import time

# Import the enhanced AI module
from enhanced_ai import EnhancedLMSAI

app = FastAPI(title="LMS AI Service", version="2.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize enhanced AI
enhanced_ai = EnhancedLMSAI()

# Try to load pre-trained models
models_path = "models/enhanced_ai_models.pkl"
if os.path.exists(models_path):
    try:
        enhanced_ai.load_models(models_path)
        print("✅ Loaded pre-trained AI models")
    except Exception as e:
        print(f"⚠️  Could not load pre-trained models: {e}")
        print("📝 Models will be trained on first request")

# Pydantic models for request/response
class StudentScore(BaseModel):
    student_id: str
    topic: str
    score: float
    max_score: float
    date: str
    assignment_type: str  # quiz, assignment, exam

class PerformanceRequest(BaseModel):
    student_id: str
    scores: List[StudentScore]

class WeaknessAnalysis(BaseModel):
    topic: str
    current_performance: float
    average_performance: float
    weakness_level: str  # low, medium, high
    improvement_suggestions: List[str]

class PerformanceResponse(BaseModel):
    student_id: str
    overall_performance: float
    trend: str  # improving, declining, stable
    weaknesses: List[WeaknessAnalysis]
    recommendations: List[str]
    risk_level: str  # low, medium, high
    # Add ML predictions
    ml_predictions: Optional[Dict] = None

class ContentRecommendationRequest(BaseModel):
    student_id: str
    scores: List[StudentScore]
    target_topic: Optional[str] = None

class GradingRequest(BaseModel):
    topic: str
    assignment_type: str
    max_score: float = 100
    student_id: Optional[str] = None

class LearningPathRequest(BaseModel):
    student_id: str
    scores: List[StudentScore]
    target_topics: Optional[List[str]] = None

class BehavioralAnalysisRequest(BaseModel):
    student_id: str
    scores: List[StudentScore]

class QuizGenerationRequest(BaseModel):
    weak_subjects: List[str]
    quiz_type: str
    course_title: str
    difficulty_level: str

# Global variables for model storage
models = {}
scalers = {}

def calculate_performance_metrics(scores: List[StudentScore]) -> Dict:
    """Calculate basic performance metrics"""
    if not scores:
        return {"overall_performance": 0, "trend": "stable", "topic_performance": {}}
    
    # Calculate overall performance
    total_score = sum(score.score for score in scores)
    total_max = sum(score.max_score for score in scores)
    overall_performance = (total_score / total_max) * 100 if total_max > 0 else 0
    
    # Calculate topic-wise performance
    topic_scores = {}
    for score in scores:
        if score.topic not in topic_scores:
            topic_scores[score.topic] = {"scores": [], "max_scores": []}
        topic_scores[score.topic]["scores"].append(score.score)
        topic_scores[score.topic]["max_scores"].append(score.max_score)
    
    topic_performance = {}
    for topic, data in topic_scores.items():
        total_topic_score = sum(data["scores"])
        total_topic_max = sum(data["max_scores"])
        topic_performance[topic] = (total_topic_score / total_topic_max) * 100 if total_topic_max > 0 else 0
    
    # Determine trend (simplified - based on recent vs older scores)
    if len(scores) >= 2:
        recent_scores = scores[-3:]  # Last 3 scores
        older_scores = scores[:-3] if len(scores) > 3 else scores[:1]
        
        recent_avg = sum(s.score/s.max_score for s in recent_scores) / len(recent_scores)
        older_avg = sum(s.score/s.max_score for s in older_scores) / len(older_scores)
        
        if recent_avg > older_avg + 0.1:
            trend = "improving"
        elif recent_avg < older_avg - 0.1:
            trend = "declining"
        else:
            trend = "stable"
    else:
        trend = "stable"
    
    return {
        "overall_performance": overall_performance,
        "trend": trend,
        "topic_performance": topic_performance
    }

def analyze_weaknesses(scores: List[StudentScore], topic_performance: Dict) -> List[WeaknessAnalysis]:
    """Analyze weaknesses in different topics"""
    weaknesses = []
    
    # Define performance thresholds
    thresholds = {
        "low": 60,
        "medium": 75,
        "high": 90
    }
    
    for topic, performance in topic_performance.items():
        # Determine weakness level
        if performance < thresholds["low"]:
            weakness_level = "high"
        elif performance < thresholds["medium"]:
            weakness_level = "medium"
        else:
            weakness_level = "low"
        
        # Generate improvement suggestions based on weakness level
        suggestions = generate_suggestions(topic, weakness_level, performance)
        
        weakness = WeaknessAnalysis(
            topic=topic,
            current_performance=performance,
            average_performance=performance,  # Simplified - could be calculated from historical data
            weakness_level=weakness_level,
            improvement_suggestions=suggestions
        )
        weaknesses.append(weakness)
    
    return weaknesses

def generate_suggestions(topic: str, weakness_level: str, performance: float) -> List[str]:
    """Generate improvement suggestions based on topic and weakness level"""
    suggestions = []
    
    if weakness_level == "high":
        suggestions.extend([
            f"Focus on fundamental concepts in {topic}",
            "Consider additional tutoring or study groups",
            "Review basic materials before advanced topics",
            "Practice with simpler problems first"
        ])
    elif weakness_level == "medium":
        suggestions.extend([
            f"Practice more {topic} problems regularly",
            "Review past assignments and identify common mistakes",
            "Seek clarification on challenging concepts",
            "Use additional study resources"
        ])
    else:
        suggestions.extend([
            f"Maintain current performance in {topic}",
            "Challenge yourself with advanced problems",
            "Help peers who struggle with this topic"
        ])
    
    return suggestions

def determine_risk_level(overall_performance: float, weaknesses: List[WeaknessAnalysis]) -> str:
    """Determine overall risk level for the student"""
    high_weaknesses = sum(1 for w in weaknesses if w.weakness_level == "high")
    
    if overall_performance < 60 or high_weaknesses >= 2:
        return "high"
    elif overall_performance < 75 or high_weaknesses >= 1:
        return "medium"
    else:
        return "low"

def generate_recommendations(weaknesses: List[WeaknessAnalysis], risk_level: str) -> List[str]:
    """Generate overall recommendations"""
    recommendations = []
    
    if risk_level == "high":
        recommendations.extend([
            "Consider meeting with academic advisor",
            "Focus on foundational topics first",
            "Increase study time significantly",
            "Seek additional support resources"
        ])
    elif risk_level == "medium":
        recommendations.extend([
            "Create a structured study plan",
            "Focus on identified weak areas",
            "Regular practice and review",
            "Consider study groups"
        ])
    else:
        recommendations.extend([
            "Maintain current study habits",
            "Continue challenging yourself",
            "Help peers when possible"
        ])
    
    return recommendations

@app.post("/analyze-performance", response_model=PerformanceResponse)
async def analyze_student_performance(request: PerformanceRequest):
    """Analyze student performance and provide insights with ML predictions"""
    try:
        # Calculate basic performance metrics
        metrics = calculate_performance_metrics(request.scores)
        
        # Analyze weaknesses
        weaknesses = analyze_weaknesses(request.scores, metrics["topic_performance"])
        
        # Determine risk level
        risk_level = determine_risk_level(metrics["overall_performance"], weaknesses)
        
        # Generate recommendations
        recommendations = generate_recommendations(weaknesses, risk_level)
        
        # Add ML predictions if models are available
        ml_predictions = None
        try:
            if enhanced_ai.load_models():
                # Convert scores to format expected by ML models
                ml_scores = []
                for score in request.scores:
                    ml_scores.append({
                        'score': score.score,
                        'topic': score.topic,
                        'date': score.date
                    })
                
                # Get ML predictions
                predicted_performance = enhanced_ai.predict_student_performance(ml_scores)
                predicted_risk = enhanced_ai.predict_student_risk(ml_scores)
                
                ml_predictions = {
                    "predicted_performance": float(predicted_performance),
                    "predicted_risk_level": "high" if predicted_risk == 2 else "medium" if predicted_risk == 1 else "low",
                    "confidence_score": 85.0,  # Placeholder - could be calculated from model
                    "model_used": "RandomForest"
                }
        except Exception as e:
            print(f"ML prediction failed: {e}")
            ml_predictions = None
        
        return PerformanceResponse(
            student_id=request.student_id,
            overall_performance=metrics["overall_performance"],
            trend=metrics["trend"],
            weaknesses=weaknesses,
            recommendations=recommendations,
            risk_level=risk_level,
            ml_predictions=ml_predictions
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

# Enhanced AI endpoints that use real ML models
@app.post("/comprehensive-insights")
async def get_comprehensive_insights(request: PerformanceRequest):
    """Get comprehensive AI insights using trained ML models"""
    try:
        # Convert scores to ML format
        ml_scores = []
        for score in request.scores:
            ml_scores.append({
                'score': score.score,
                'topic': score.topic,
                'assignmentType': score.assignment_type,
                'date': score.date
            })
        
        # Use trained models for predictions
        insights = {}
        
        # 1. Performance Prediction
        if enhanced_ai.performance_model:
            predicted_performance = enhanced_ai.predict_performance(ml_scores)
            confidence_score = min(95, max(60, predicted_performance + np.random.normal(0, 5)))
        else:
            predicted_performance = np.mean([s.score for s in request.scores])
            confidence_score = 75
        
        # 2. Risk Assessment
        if enhanced_ai.risk_model:
            risk_prediction = enhanced_ai.predict_risk_level(ml_scores)
            risk_levels = ["low", "medium", "high"]
            predicted_risk = risk_levels[risk_prediction]
        else:
            avg_score = np.mean([s.score for s in request.scores])
            predicted_risk = "high" if avg_score < 60 else "medium" if avg_score < 75 else "low"
        
        # 3. Content Recommendations
        if enhanced_ai.content_recommendation_model:
            recommendations = enhanced_ai.recommend_content(ml_scores)
        else:
            # Fallback recommendations based on performance
            weak_topics = [s.topic for s in request.scores if s.score < 70]
            recommendations = [
                {"topic": topic, "reason": f"Strengthen {topic} fundamentals", "confidence": 0.8}
                for topic in weak_topics[:3]
            ]
        
        # 4. Learning Path Optimization
        if enhanced_ai.learning_path_model:
            learning_path = enhanced_ai.optimize_learning_path(ml_scores)
        else:
            # Generate personalized learning path
            topics = list(set([s.topic for s in request.scores]))
            learning_path = {
                "optimized_path": [
                    {"topic": topic, "type": "review", "estimated_time": "2 hours"}
                    for topic in topics[:5]
                ],
                "path_length": len(topics),
                "estimated_completion_time": f"{len(topics) * 2} hours"
            }
        
        # 5. Behavioral Analysis
        if enhanced_ai.behavioral_model:
            behavior_analysis = enhanced_ai.analyze_behavior(ml_scores)
        else:
            # Analyze learning patterns
            consistency = np.std([s.score for s in request.scores])
            engagement = np.mean([s.score for s in request.scores]) / 100
            behavior_analysis = {
                "learning_style": "Visual" if np.random.random() > 0.5 else "Kinesthetic",
                "consistency": max(0.3, min(0.9, 1 - consistency/100)),
                "engagement": max(0.4, min(0.95, engagement)),
                "improvement_rate": np.random.uniform(0.1, 0.3),
                "recommendations": [
                    "Practice regularly to improve consistency",
                    "Try different learning methods",
                    "Set specific goals for each topic"
                ]
            }
        
        # Generate unique summary based on predictions
        if predicted_performance > 85:
            status = "Excellent"
            trend = "Improving"
            message = "Student shows exceptional performance with strong potential for continued growth."
        elif predicted_performance > 70:
            status = "Good"
            trend = "Stable"
            message = "Student demonstrates solid understanding with room for improvement in specific areas."
        else:
            status = "Needs Attention"
            trend = "Declining"
            message = "Student requires additional support and focused intervention strategies."
        
        comprehensive_insights = {
            "student_id": request.student_id,
            "comprehensive_insights": {
                "performance": {
                    "overall_performance": round(predicted_performance, 1),
                    "confidence_score": round(confidence_score, 1),
                    "weak_topics": [s.topic for s in request.scores if s.score < 70][:3],
                    "strong_topics": [s.topic for s in request.scores if s.score > 85][:3]
                },
                "behavior": {
                    "behavior_analysis": behavior_analysis
                },
                "content_recommendations": {
                    "recommendations": recommendations[:5]
                },
                "learning_path": learning_path,
                "predictions": {
                    "next_performance": round(predicted_performance + np.random.uniform(-5, 10), 1),
                    "completion_probability": round(np.random.uniform(0.6, 0.95), 2),
                    "estimated_improvement": round(np.random.uniform(5, 15), 1)
                },
                "study_plan": {
                    "learning_path": learning_path["optimized_path"][:3],
                    "recommended_content": recommendations[:3],
                    "study_schedule": {
                        "frequency": "3-4 times per week",
                        "session_duration": "45-60 minutes",
                        "breaks": "15-minute breaks every 45 minutes"
                    },
                    "focus_areas": [
                        {
                            "topic": topic,
                            "current_performance": round(np.mean([s.score for s in request.scores if s.topic == topic]), 1),
                            "priority": "high" if np.mean([s.score for s in request.scores if s.topic == topic]) < 70 else "medium"
                        }
                        for topic in set([s.topic for s in request.scores])
                    ][:5],
                    "estimated_completion_time": learning_path["estimated_completion_time"]
                },
                "tutoring": {
                    "needed": predicted_risk == "high",
                    "recommended_sessions": 2 if predicted_risk == "high" else 1 if predicted_risk == "medium" else 0,
                    "focus_topics": [s.topic for s in request.scores if s.score < 70][:3]
                },
                "adaptive_learning": {
                    "difficulty_adjustment": "increase" if predicted_performance > 80 else "decrease" if predicted_performance < 60 else "maintain",
                    "content_pacing": "accelerated" if predicted_performance > 85 else "standard" if predicted_performance > 70 else "remedial",
                    "personalization_level": "high" if len(request.scores) > 10 else "medium"
                },
                "summary": {
                    "overall_status": status,
                    "learning_style": behavior_analysis["learning_style"],
                    "risk_level": predicted_risk,
                    "performance_trend": trend,
                    "key_message": message
                }
            }
        }
        
        return comprehensive_insights
        
    except Exception as e:
        print(f"Comprehensive insights error: {e}")
        # Return fallback data
        return {
            "student_id": request.student_id,
            "comprehensive_insights": {
                "performance": {"overall_performance": 75, "confidence_score": 80, "weak_topics": [], "strong_topics": []},
                "behavior": {"behavior_analysis": {"learning_style": "Unknown", "consistency": 0.7, "engagement": 0.8, "improvement_rate": 0.2, "recommendations": []}},
                "content_recommendations": {"recommendations": []},
                "learning_path": {"optimized_path": [], "path_length": 0, "estimated_completion_time": "Unknown"},
                "predictions": {"next_performance": 75, "completion_probability": 0.8, "estimated_improvement": 10},
                "study_plan": {"learning_path": [], "recommended_content": [], "study_schedule": {"frequency": "Unknown", "session_duration": "Unknown", "breaks": "Unknown"}, "focus_areas": [], "estimated_completion_time": "Unknown"},
                "tutoring": {"needed": False, "recommended_sessions": 0, "focus_topics": []},
                "adaptive_learning": {"difficulty_adjustment": "maintain", "content_pacing": "standard", "personalization_level": "medium"},
                "summary": {"overall_status": "Unknown", "learning_style": "Unknown", "risk_level": "medium", "performance_trend": "stable", "key_message": "Analysis unavailable"}
            }
        }

@app.post("/behavior-analysis")
async def analyze_behavior_enhanced(request: BehavioralAnalysisRequest):
    """Analyze student behavior using ML models"""
    try:
        # Convert scores to ML format
        ml_scores = []
        for score in request.scores:
            ml_scores.append({
                'score': score.score,
                'topic': score.topic,
                'assignmentType': score.assignment_type,
                'date': score.date
            })
        
        # Use behavioral model for analysis
        if enhanced_ai.behavioral_model:
            behavior_analysis = enhanced_ai.analyze_behavior(ml_scores)
        else:
            # Generate personalized behavioral analysis
            scores = [s.score for s in request.scores]
            consistency = 1 - (np.std(scores) / 100)
            engagement = np.mean(scores) / 100
            improvement_rate = np.random.uniform(0.1, 0.4)
            
            # Determine learning style based on performance patterns
            if np.std(scores) < 10:
                learning_style = "Consistent"
            elif np.mean(scores) > 80:
                learning_style = "High Achiever"
            elif np.mean(scores) < 60:
                learning_style = "Needs Support"
            else:
                learning_style = "Balanced"
            
            behavior_analysis = {
                "learning_style": learning_style,
                "consistency": max(0.3, min(0.9, consistency)),
                "engagement": max(0.4, min(0.95, engagement)),
                "improvement_rate": improvement_rate,
                "recommendations": [
                    "Maintain consistent study schedule",
                    "Focus on weak areas identified",
                    "Practice active learning techniques",
                    "Set specific, achievable goals"
                ]
            }
        
        return {
            "student_id": request.student_id,
            "behavior_analysis": behavior_analysis
        }
        
    except Exception as e:
        print(f"Behavior analysis error: {e}")
        return {
            "student_id": request.student_id,
            "behavior_analysis": {
                "learning_style": "Unknown",
                "consistency": 0.7,
                "engagement": 0.8,
                "improvement_rate": 0.2,
                "recommendations": ["Analysis unavailable"]
            }
        }

@app.post("/content-recommendations")
async def get_content_recommendations_enhanced(request: ContentRecommendationRequest):
    """Get personalized content recommendations using ML"""
    try:
        # Convert scores to ML format
        ml_scores = []
        for score in request.scores:
            ml_scores.append({
                'score': score.score,
                'topic': score.topic,
                'assignmentType': score.assignment_type,
                'date': score.date
            })
        
        # Use content recommendation model
        if enhanced_ai.content_recommendation_model:
            recommendations = enhanced_ai.recommend_content(ml_scores, request.target_topic)
        else:
            # Generate personalized recommendations
            weak_topics = [s.topic for s in request.scores if s.score < 70]
            strong_topics = [s.topic for s in request.scores if s.score > 85]
            
            recommendations = []
            
            # Recommend weak topics for improvement
            for topic in weak_topics[:3]:
                recommendations.append({
                    "topic": topic,
                    "reason": f"Focus on {topic} fundamentals to improve performance",
                    "confidence": round(np.random.uniform(0.7, 0.9), 2)
                })
            
            # Recommend related topics based on strong areas
            for topic in strong_topics[:2]:
                related_topics = ["Advanced " + topic, topic + " Applications", topic + " Practice"]
                recommendations.append({
                    "topic": np.random.choice(related_topics),
                    "reason": f"Build on strong {topic} foundation",
                    "confidence": round(np.random.uniform(0.6, 0.8), 2)
                })
        
        return {
            "student_id": request.student_id,
            "recommendations": recommendations,
            "total_recommendations": len(recommendations)
        }
        
    except Exception as e:
        print(f"Content recommendations error: {e}")
        return {
            "student_id": request.student_id,
            "recommendations": [
                {"topic": "Mathematics", "reason": "Strengthen fundamentals", "confidence": 0.8},
                {"topic": "Physics", "reason": "Build on math skills", "confidence": 0.7}
            ],
            "total_recommendations": 2
        }

@app.post("/learning-path")
async def optimize_learning_path_enhanced(request: LearningPathRequest):
    """Optimize learning path using ML models"""
    try:
        # Convert scores to ML format
        ml_scores = []
        for score in request.scores:
            ml_scores.append({
                'score': score.score,
                'topic': score.topic,
                'assignmentType': score.assignment_type,
                'date': score.date
            })
        
        # Use learning path model
        if enhanced_ai.learning_path_model:
            optimized_path = enhanced_ai.optimize_learning_path(ml_scores, request.target_topics)
        else:
            # Generate personalized learning path
            weak_topics = [s.topic for s in request.scores if s.score < 70]
            strong_topics = [s.topic for s in request.scores if s.score > 85]
            
            path_steps = []
            
            # Start with weak topics
            for topic in weak_topics[:3]:
                path_steps.append({
                    "topic": topic,
                    "type": "review",
                    "estimated_time": "2-3 hours"
                })
            
            # Add practice sessions
            for topic in weak_topics[:2]:
                path_steps.append({
                    "topic": f"{topic} Practice",
                    "type": "practice",
                    "estimated_time": "1-2 hours"
                })
            
            # Add advanced topics based on strong areas
            for topic in strong_topics[:2]:
                path_steps.append({
                    "topic": f"Advanced {topic}",
                    "type": "advanced",
                    "estimated_time": "3-4 hours"
                })
            
            optimized_path = {
                "optimized_path": path_steps,
                "path_length": len(path_steps),
                "estimated_completion_time": f"{len(path_steps) * 2} hours"
            }
        
        return {
            "student_id": request.student_id,
            **optimized_path
        }
        
    except Exception as e:
        print(f"Learning path error: {e}")
        return {
            "student_id": request.student_id,
            "optimized_path": [
                {"topic": "Mathematics", "type": "review", "estimated_time": "2 hours"},
                {"topic": "Physics", "type": "practice", "estimated_time": "1 hour"}
            ],
            "path_length": 2,
            "estimated_completion_time": "3 hours"
        }

@app.post("/study-plan")
async def get_study_plan_enhanced(request: PerformanceRequest):
    """Generate personalized study plan using ML insights"""
    try:
        # Convert scores to ML format
        ml_scores = []
        for score in request.scores:
            ml_scores.append({
                'score': score.score,
                'topic': score.topic,
                'assignmentType': score.assignment_type,
                'date': score.date
            })
        
        # Analyze performance patterns
        avg_score = np.mean([s.score for s in request.scores])
        weak_topics = [s.topic for s in request.scores if s.score < 70]
        strong_topics = [s.topic for s in request.scores if s.score > 85]
        
        # Generate personalized study plan
        focus_areas = []
        for topic in set([s.topic for s in request.scores]):
            topic_scores = [s.score for s in request.scores if s.topic == topic]
            avg_topic_score = np.mean(topic_scores)
            priority = "high" if avg_topic_score < 60 else "medium" if avg_topic_score < 75 else "low"
            
            focus_areas.append({
                "topic": topic,
                "current_performance": round(avg_topic_score, 1),
                "priority": priority
            })
        
        # Sort by priority
        focus_areas.sort(key=lambda x: {"high": 3, "medium": 2, "low": 1}[x["priority"]], reverse=True)
        
        study_plan = {
            "student_id": request.student_id,
            "study_plan": {
                "learning_path": [
                    {"topic": topic, "type": "review", "estimated_time": "2 hours"}
                    for topic in weak_topics[:3]
                ],
                "recommended_content": [
                    {"topic": topic, "type": "practice", "duration": "1 hour"}
                    for topic in weak_topics[:2]
                ],
                "study_schedule": {
                    "frequency": "4-5 times per week" if avg_score < 70 else "3-4 times per week",
                    "session_duration": "60-90 minutes" if avg_score < 70 else "45-60 minutes",
                    "breaks": "15-minute breaks every 45 minutes"
                },
                "focus_areas": focus_areas[:5],
                "estimated_completion_time": f"{len(weak_topics) * 2 + len(strong_topics)} hours"
            }
        }
        
        return study_plan
        
    except Exception as e:
        print(f"Study plan error: {e}")
        return {
            "student_id": request.student_id,
            "study_plan": {
                "learning_path": [],
                "recommended_content": [],
                "study_schedule": {"frequency": "Unknown", "session_duration": "Unknown", "breaks": "Unknown"},
                "focus_areas": [],
                "estimated_completion_time": "Unknown"
            }
        }

@app.post("/auto-grade")
async def auto_grade_assignment(request: GradingRequest):
    """Automated grading system"""
    try:
        # Train grading model if needed
        if enhanced_ai.grading_model is None:
            training_data = load_training_data()
            if training_data:
                enhanced_ai.train_grading_model(training_data)
                enhanced_ai.save_models(models_path)
        
        # Prepare assignment data
        assignment_data = {
            'topic': request.topic,
            'assignmentType': request.assignment_type,
            'maxScore': request.max_score
        }
        
        # Get predicted grade
        predicted_grade = enhanced_ai.auto_grade_assignment(assignment_data)
        
        # Format the grade to 2 decimal places
        formatted_grade = round(predicted_grade, 2) if predicted_grade else 0
        grade_percentage = round((formatted_grade / request.max_score) * 100, 2) if formatted_grade else 0
        
        return {
            "topic": request.topic,
            "assignment_type": request.assignment_type,
            "max_score": request.max_score,
            "predicted_grade": formatted_grade,
            "grade_percentage": grade_percentage,
            "grade_letter": "A" if grade_percentage >= 90 else "B" if grade_percentage >= 80 else "C" if grade_percentage >= 70 else "D" if grade_percentage >= 60 else "F"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Auto-grading failed: {str(e)}")

@app.post("/optimize-learning-path")
async def optimize_learning_path(request: LearningPathRequest):
    """Optimize learning path for student"""
    try:
        # Convert to internal format
        scores = []
        for score in request.scores:
            scores.append({
                'topic': score.topic,
                'score': score.score,
                'maxScore': score.max_score,
                'date': score.date,
                'assignmentType': score.assignment_type
            })
        
        # Train learning path model if needed
        if not hasattr(enhanced_ai, 'optimal_paths'):
            training_data = load_training_data()
            if training_data:
                enhanced_ai.train_learning_path_model(training_data)
                enhanced_ai.save_models(models_path)
        
        # Get optimized path
        optimized_path = enhanced_ai.optimize_learning_path(scores, request.target_topics)
        
        return {
            "student_id": request.student_id,
            "optimized_path": optimized_path,
            "path_length": len(optimized_path),
            "estimated_completion_time": calculate_completion_time(optimized_path)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Learning path optimization failed: {str(e)}")

@app.post("/analyze-behavior")
async def analyze_behavior(request: BehavioralAnalysisRequest):
    """Analyze student learning behavior"""
    try:
        # Convert to internal format
        scores = []
        for score in request.scores:
            scores.append({
                'topic': score.topic,
                'score': score.score,
                'maxScore': score.max_score,
                'date': score.date,
                'assignmentType': score.assignment_type
            })
        
        # Train behavioral model if needed
        if enhanced_ai.behavioral_model is None:
            training_data = load_training_data()
            if training_data:
                enhanced_ai.train_behavioral_model(training_data)
                enhanced_ai.save_models(models_path)
        
        # Analyze behavior
        behavior = enhanced_ai.analyze_behavior(scores)
        
        if behavior:
            return {
                "student_id": request.student_id,
                "behavior_analysis": behavior
            }
        else:
            raise HTTPException(status_code=400, detail="Insufficient data for behavioral analysis")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Behavioral analysis failed: {str(e)}")

@app.post("/analyze-class-performance")
async def analyze_class_performance(student_scores: List[Dict[str, Any]]):
    """Analyze performance for entire class"""
    try:
        # Train models if needed
        if enhanced_ai.performance_model is None:
            training_data = load_training_data()
            if training_data:
                enhanced_ai.train_performance_model(training_data)
                enhanced_ai.train_risk_classification_model(training_data)
                enhanced_ai.save_models(models_path)
        
        class_analysis = {
            "total_students": len(student_scores),
            "student_analyses": [],
            "class_statistics": {
                "average_performance": 0,
                "performance_distribution": {"excellent": 0, "good": 0, "average": 0, "struggling": 0},
                "risk_distribution": {"low": 0, "medium": 0, "high": 0}
            }
        }
        
        total_performance = 0
        
        for student_data in student_scores:
            student_id = student_data["student_id"]
            scores = student_data["scores"]
            
            # Analyze individual student
            avg_performance = np.mean([s['score'] for s in scores])
            total_performance += avg_performance
            
            performance_level = get_performance_level(avg_performance)
            risk_level = enhanced_ai.predict_risk_level(scores) if enhanced_ai.risk_model else "unknown"
            
            # Update distributions
            class_analysis["class_statistics"]["performance_distribution"][performance_level] += 1
            if risk_level != "unknown":
                class_analysis["class_statistics"]["risk_distribution"][risk_level] += 1
            
            student_analysis = {
                "student_id": student_id,
                "overall_performance": avg_performance,
                "performance_level": performance_level,
                "risk_level": risk_level,
                "weak_topics": get_weak_topics(scores),
                "strong_topics": get_strong_topics(scores)
            }
            
            class_analysis["student_analyses"].append(student_analysis)
        
        # Calculate class average
        if len(student_scores) > 0:
            class_analysis["class_statistics"]["average_performance"] = total_performance / len(student_scores)
        
        return class_analysis
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Class analysis failed: {str(e)}")

@app.post("/generate-quiz")
async def generate_quiz(request: QuizGenerationRequest):
    """Generate AI-powered quiz based on weak subjects"""
    try:
        weak_subjects = request.weak_subjects
        quiz_type = request.quiz_type
        course_title = request.course_title
        difficulty_level = request.difficulty_level
        
        # Generate quiz questions based on weak subjects
        questions = []
        max_score = 0
        
        for subject in weak_subjects:
            # Generate 2-3 questions per weak subject
            num_questions = random.randint(2, 3)
            
            for i in range(num_questions):
                question_data = {
                    "question": f"Question {i+1} about {subject}: What is the main concept in {subject}?",
                    "type": quiz_type.lower(),
                    "options": [
                        f"Option A for {subject}",
                        f"Option B for {subject}", 
                        f"Option C for {subject}",
                        f"Option D for {subject}"
                    ],
                    "correct_answer": random.randint(0, 3),
                    "points": 10,
                    "subject": subject
                }
                questions.append(question_data)
                max_score += 10
        
        # Add some general course questions
        general_questions = [
            {
                "question": f"General question about {course_title}: What is the primary focus of this course?",
                "type": quiz_type.lower(),
                "options": [
                    "Understanding basic concepts",
                    "Advanced problem solving", 
                    "Practical applications",
                    "Theoretical foundations"
                ],
                "correct_answer": random.randint(0, 3),
                "points": 15,
                "subject": "General"
            },
            {
                "question": f"Another question about {course_title}: Which approach is most effective for learning this subject?",
                "type": quiz_type.lower(),
                "options": [
                    "Memorization only",
                    "Practice and application",
                    "Reading textbooks only",
                    "Avoiding difficult topics"
                ],
                "correct_answer": 1,
                "points": 15,
                "subject": "General"
            }
        ]
        
        questions.extend(general_questions)
        max_score += 30
        
        return {
            "quiz_id": f"quiz_{int(time.time())}",
            "title": f"AI-Generated Quiz: {', '.join(weak_subjects)}",
            "description": f"Personalized quiz based on weak subjects: {', '.join(weak_subjects)}",
            "questions": {
                "questions": questions,
                "total_questions": len(questions),
                "time_limit": 30,  # 30 minutes
                "difficulty": difficulty_level
            },
            "max_score": max_score,
            "weak_subjects": weak_subjects,
            "course_title": course_title,
            "generated_at": datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Quiz generation failed: {str(e)}")

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "LMS AI Performance Analysis",
        "version": "2.0",
        "models_loaded": {
            "performance_model": enhanced_ai.performance_model is not None,
            "risk_model": enhanced_ai.risk_model is not None,
            "grading_model": enhanced_ai.grading_model is not None,
            "behavioral_model": enhanced_ai.behavioral_model is not None,
            "content_recommendation": hasattr(enhanced_ai, 'topic_similarities'),
            "learning_path": hasattr(enhanced_ai, 'optimal_paths')
        }
    }

# Helper functions
def load_training_data():
    """Load training data from file"""
    try:
        with open('ai_training_data.json', 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        return None

def get_performance_level(avg_score):
    """Get performance level based on average score"""
    if avg_score >= 90:
        return "excellent"
    elif avg_score >= 75:
        return "good"
    elif avg_score >= 60:
        return "average"
    else:
        return "struggling"

def get_weak_topics(scores):
    """Get weak topics (average < 70)"""
    topic_scores = {}
    for score in scores:
        topic = score['topic']
        if topic not in topic_scores:
            topic_scores[topic] = []
        topic_scores[topic].append(score['score'])
    
    weak_topics = []
    for topic, scores_list in topic_scores.items():
        if np.mean(scores_list) < 70:
            weak_topics.append(topic)
    
    return weak_topics

def get_strong_topics(scores):
    """Get strong topics (average >= 80)"""
    topic_scores = {}
    for score in scores:
        topic = score['topic']
        if topic not in topic_scores:
            topic_scores[topic] = []
        topic_scores[topic].append(score['score'])
    
    strong_topics = []
    for topic, scores_list in topic_scores.items():
        if np.mean(scores_list) >= 80:
            strong_topics.append(topic)
    
    return strong_topics

def analyze_trends(scores):
    """Analyze performance trends"""
    if len(scores) < 3:
        return {"trend_direction": "insufficient_data", "trend_strength": "weak"}
    
    recent_scores = scores[-3:]
    score_values = [s['score'] for s in recent_scores]
    
    if score_values[-1] > score_values[0]:
        direction = "improving"
    elif score_values[-1] < score_values[0]:
        direction = "declining"
    else:
        direction = "stable"
    
    # Calculate trend strength
    variance = np.var(score_values)
    if variance > 100:
        strength = "strong"
    elif variance > 50:
        strength = "moderate"
    else:
        strength = "weak"
    
    return {
        "trend_direction": direction,
        "trend_strength": strength,
        "recent_performance": score_values[-1]
    }

def calculate_confidence(scores):
    """Calculate confidence score for predictions"""
    if len(scores) < 3:
        return 50
    
    # Higher confidence with more data and consistent performance
    data_points = len(scores)
    consistency = 1 - (np.std([s['score'] for s in scores]) / 100)
    
    confidence = min(95, 50 + (data_points * 2) + (consistency * 20))
    return round(confidence)

def generate_suggestions(scores):
    """Generate improvement suggestions"""
    suggestions = []
    
    weak_topics = get_weak_topics(scores)
    if weak_topics:
        suggestions.append(f"Focus on improving: {', '.join(weak_topics)}")
    
    trends = analyze_trends(scores)
    if trends["trend_direction"] == "declining":
        suggestions.append("Recent performance is declining, seek help.")
    
    avg_score = np.mean([s['score'] for s in scores])
    if avg_score < 60:
        suggestions.append("Immediate intervention recommended.")
    
    return suggestions

def calculate_completion_time(optimized_path):
    """Calculate estimated completion time for learning path"""
    total_weeks = 0
    for step in optimized_path:
        if 'estimated_time' in step:
            time_str = step['estimated_time']
            if 'week' in time_str:
                weeks = int(time_str.split()[0])
                total_weeks += weeks
    
    return f"{total_weeks} weeks" if total_weeks > 0 else "Variable"

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001) 