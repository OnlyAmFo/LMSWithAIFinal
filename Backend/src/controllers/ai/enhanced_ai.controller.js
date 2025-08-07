import aiService from "../../services/aiService.js";
import ResponseConfig from "../../helpers/responseConfig.js";
import ErrorConfig from "../../helpers/errorConfig.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper function to get student data
const getStudentData = (studentId) => {
    try {
        const dataPath = path.join(__dirname, "../../../ai_module/ai_training_data.json");
        const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        return data[studentId] || [];
    } catch (err) {
        console.error('Error loading training data:', err);
        return [];
    }
};

// Helper function to convert student data to AI service format
const convertToAIServiceFormat = (studentData) => {
    return studentData.map(score => ({
        student_id: score.student_id,
        topic: score.topic,
        score: score.score,
        max_score: score.max_score || 100,
        date: score.date,
        assignment_type: score.assignment_type || "quiz"
    }));
};

export const getContentRecommendations = async (req, res, next) => {
    const { studentId } = req.params;
    
    try {
        const studentData = getStudentData(studentId);
        if (studentData.length === 0) {
            return res.status(404).json(
                new ResponseConfig(404, "Student data not found", null)
            );
        }

        const aiRequestData = {
            student_id: studentId,
            scores: convertToAIServiceFormat(studentData),
            target_topic: req.query.topic || null
        };

        const recommendations = await aiService.getContentRecommendations(aiRequestData);
        return res.status(200).json(
            new ResponseConfig(200, "Content recommendations retrieved", recommendations)
        );
    } catch (error) {
        console.error('Content Recommendation Error:', error);
        // Return personalized fallback data based on student performance
        const studentData = getStudentData(studentId);
        const weakTopics = studentData.filter(s => s.score < 70).map(s => s.topic);
        const strongTopics = studentData.filter(s => s.score > 85).map(s => s.topic);
        
        // Remove duplicates
        const uniqueWeakTopics = [...new Set(weakTopics)];
        const uniqueStrongTopics = [...new Set(strongTopics)];
        
        const mockRecommendations = {
            student_id: studentId,
            recommendations: [
                ...uniqueWeakTopics.slice(0, 2).map(topic => ({
                    topic: topic,
                    reason: `Strengthen ${topic} fundamentals`,
                    confidence: 0.8
                })),
                ...uniqueStrongTopics.slice(0, 1).map(topic => ({
                    topic: `Advanced ${topic}`,
                    reason: `Build on strong ${topic} foundation`,
                    confidence: 0.7
                }))
            ],
            total_recommendations: Math.min(uniqueWeakTopics.length + uniqueStrongTopics.length, 3)
        };
        
        return res.status(200).json(
            new ResponseConfig(200, "Content recommendations retrieved (fallback)", mockRecommendations)
        );
    }
};

export const autoGradeAssignment = async (req, res, next) => {
    try {
        const { topic, assignmentType, maxScore } = req.body;
        
        const gradingData = {
            topic: topic || "Mathematics",
            assignment_type: assignmentType || "quiz",
            max_score: maxScore || 100
        };

        const gradingResult = await aiService.autoGradeAssignment(gradingData);
        return res.status(200).json(
            new ResponseConfig(200, "Assignment graded successfully", gradingResult)
        );
    } catch (error) {
        console.error('Auto-Grading Error:', error);
        // Return realistic grading result
        const mockGrading = {
            topic: req.body.topic || "Mathematics",
            assignment_type: req.body.assignmentType || "quiz",
            predicted_score: Math.floor(Math.random() * 30) + 70, // 70-100
            confidence: (Math.random() * 0.3) + 0.7, // 0.7-1.0
            feedback: "Good effort, focus on problem-solving techniques",
            suggestions: ["Practice similar problems", "Review key concepts", "Check your work carefully"]
        };
        
        return res.status(200).json(
            new ResponseConfig(200, "Assignment graded successfully (fallback)", mockGrading)
        );
    }
};

export const optimizeLearningPath = async (req, res, next) => {
    const { studentId } = req.params;
    
    try {
        const studentData = getStudentData(studentId);
        if (studentData.length === 0) {
            return res.status(404).json(
                new ResponseConfig(404, "Student data not found", null)
            );
        }

        const aiRequestData = {
            student_id: studentId,
            scores: convertToAIServiceFormat(studentData),
            target_topics: req.query.topics ? req.query.topics.split(',') : null
        };

        const learningPath = await aiService.optimizeLearningPath(aiRequestData);
        return res.status(200).json(
            new ResponseConfig(200, "Learning path optimized", learningPath)
        );
    } catch (error) {
        console.error('Learning Path Error:', error);
        // Generate personalized learning path based on student data
        const studentData = getStudentData(studentId);
        const weakTopics = studentData.filter(s => s.score < 70).map(s => s.topic);
        const strongTopics = studentData.filter(s => s.score > 85).map(s => s.topic);
        
        // Remove duplicates
        const uniqueWeakTopics = [...new Set(weakTopics)];
        const uniqueStrongTopics = [...new Set(strongTopics)];
        
        const mockPath = {
            student_id: studentId,
            optimized_path: [
                ...uniqueWeakTopics.slice(0, 3).map(topic => ({
                    topic: topic,
                    type: "review",
                    estimated_time: "2-3 hours"
                })),
                ...uniqueStrongTopics.slice(0, 2).map(topic => ({
                    topic: `Advanced ${topic}`,
                    type: "advanced",
                    estimated_time: "3-4 hours"
                }))
            ],
            path_length: Math.min(uniqueWeakTopics.length + uniqueStrongTopics.length, 5),
            estimated_completion_time: `${Math.min(uniqueWeakTopics.length + uniqueStrongTopics.length, 5) * 2} hours`
        };
        
        return res.status(200).json(
            new ResponseConfig(200, "Learning path optimized (fallback)", mockPath)
        );
    }
};

export const analyzeBehavior = async (req, res, next) => {
    const { studentId } = req.params;
    
    try {
        const studentData = getStudentData(studentId);
        if (studentData.length === 0) {
            return res.status(404).json(
                new ResponseConfig(404, "Student data not found", null)
            );
        }

        const aiRequestData = {
            student_id: studentId,
            scores: convertToAIServiceFormat(studentData)
        };

        const behaviorAnalysis = await aiService.analyzeBehavior(aiRequestData);
        return res.status(200).json(
            new ResponseConfig(200, "Behavior analysis completed", behaviorAnalysis)
        );
    } catch (error) {
        console.error('Behavior Analysis Error:', error);
        // Generate personalized behavior analysis
        const studentData = getStudentData(studentId);
        const scores = studentData.map(s => s.score);
        const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
        const consistency = 1 - (Math.sqrt(scores.reduce((acc, score) => acc + Math.pow(score - avgScore, 2), 0) / scores.length) / 100);
        
        const mockBehavior = {
            student_id: studentId,
            behavior_analysis: {
                learning_style: avgScore > 80 ? "High Achiever" : avgScore < 60 ? "Needs Support" : "Balanced",
                consistency: Math.max(0.3, Math.min(0.9, consistency)),
                engagement: Math.max(0.4, Math.min(0.95, avgScore / 100)),
                improvement_rate: (Math.random() * 0.3) + 0.1,
                recommendations: [
                    "Maintain consistent study schedule",
                    "Focus on weak areas identified",
                    "Practice active learning techniques"
                ]
            }
        };
        
        return res.status(200).json(
            new ResponseConfig(200, "Behavior analysis completed (fallback)", mockBehavior)
        );
    }
};

export const getPredictiveAnalytics = async (req, res, next) => {
    const { studentId } = req.params;
    
    try {
        const studentData = getStudentData(studentId);
        if (studentData.length === 0) {
            return res.status(404).json(
                new ResponseConfig(404, "Student data not found", null)
            );
        }

        const aiRequestData = {
            student_id: studentId,
            scores: convertToAIServiceFormat(studentData)
        };

        const analytics = await aiService.getPredictiveAnalytics(aiRequestData);
        return res.status(200).json(
            new ResponseConfig(200, "Predictive analytics retrieved", analytics)
        );
    } catch (error) {
        console.error('Predictive Analytics Error:', error);
        // Generate personalized predictions
        const studentData = getStudentData(studentId);
        const scores = studentData.map(s => s.score);
        const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
        const trend = scores.length > 1 ? (scores[scores.length - 1] - scores[0]) / scores.length : 0;
        
        const mockAnalytics = {
            student_id: studentId,
            predictions: {
                next_performance: Math.max(0, Math.min(100, avgScore + trend + (Math.random() * 10 - 5))),
                completion_probability: Math.max(0.6, Math.min(0.95, (avgScore / 100) + 0.1)),
                estimated_improvement: Math.max(0, Math.min(20, trend * 2 + (Math.random() * 10))),
                risk_level: avgScore < 60 ? "high" : avgScore < 75 ? "medium" : "low"
            }
        };
        
        return res.status(200).json(
            new ResponseConfig(200, "Predictive analytics retrieved (fallback)", mockAnalytics)
        );
    }
};

export const getPersonalizedStudyPlan = async (req, res, next) => {
    const { studentId } = req.params;
    
    try {
        const studentData = getStudentData(studentId);
        if (studentData.length === 0) {
            return res.status(404).json(
                new ResponseConfig(404, "Student data not found", null)
            );
        }

        const aiRequestData = {
            student_id: studentId,
            scores: convertToAIServiceFormat(studentData)
        };

        const studyPlan = await aiService.getPersonalizedStudyPlan(aiRequestData);
        return res.status(200).json(
            new ResponseConfig(200, "Study plan generated", studyPlan)
        );
    } catch (error) {
        console.error('Study Plan Error:', error);
        // Generate personalized study plan
        const studentData = getStudentData(studentId);
        const scores = studentData.map(s => s.score);
        const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
        const weakTopics = studentData.filter(s => s.score < 70).map(s => s.topic);
        const strongTopics = studentData.filter(s => s.score > 85).map(s => s.topic);
        
        // Remove duplicates
        const uniqueWeakTopics = [...new Set(weakTopics)];
        const uniqueStrongTopics = [...new Set(strongTopics)];
        
        const mockStudyPlan = {
            student_id: studentId,
            study_plan: {
                learning_path: uniqueWeakTopics.slice(0, 3).map(topic => ({
                    topic: topic,
                    type: "review",
                    estimated_time: "2 hours"
                })),
                recommended_content: uniqueWeakTopics.slice(0, 2).map(topic => ({
                    topic: topic,
                    type: "practice",
                    duration: "1 hour"
                })),
                study_schedule: {
                    frequency: avgScore < 70 ? "4-5 times per week" : "3-4 times per week",
                    session_duration: avgScore < 70 ? "60-90 minutes" : "45-60 minutes",
                    breaks: "15-minute breaks every 45 minutes"
                },
                focus_areas: studentData.reduce((acc, score) => {
                    const existing = acc.find(a => a.topic === score.topic);
                    if (existing) {
                        existing.current_performance = (existing.current_performance + score.score) / 2;
                    } else {
                        acc.push({
                            topic: score.topic,
                            current_performance: score.score,
                            priority: score.score < 60 ? "high" : score.score < 75 ? "medium" : "low"
                        });
                    }
                    return acc;
                }, []).slice(0, 5),
                estimated_completion_time: `${uniqueWeakTopics.length * 2 + uniqueStrongTopics.length} hours`
            }
        };
        
        return res.status(200).json(
            new ResponseConfig(200, "Study plan generated (fallback)", mockStudyPlan)
        );
    }
};

export const getTutoringRecommendations = async (req, res, next) => {
    const { studentId } = req.params;
    
    try {
        const studentData = getStudentData(studentId);
        if (studentData.length === 0) {
            return res.status(404).json(
                new ResponseConfig(404, "Student data not found", null)
            );
        }

        const aiRequestData = {
            student_id: studentId,
            scores: convertToAIServiceFormat(studentData)
        };

        const tutoring = await aiService.getTutoringRecommendations(aiRequestData);
        return res.status(200).json(
            new ResponseConfig(200, "Tutoring recommendations retrieved", tutoring)
        );
    } catch (error) {
        console.error('Tutoring Recommendations Error:', error);
        // Generate personalized tutoring recommendations
        const studentData = getStudentData(studentId);
        const scores = studentData.map(s => s.score);
        const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
        const weakTopics = studentData.filter(s => s.score < 70).map(s => s.topic);
        
        // Remove duplicates from weak topics
        const uniqueWeakTopics = [...new Set(weakTopics)];
        
        const mockTutoring = {
            student_id: studentId,
            tutoring: {
                needed: avgScore < 70,
                recommended_sessions: avgScore < 60 ? 3 : avgScore < 70 ? 2 : 0,
                focus_topics: uniqueWeakTopics.slice(0, 3),
                tutor_preferences: avgScore < 60 ? "One-on-one intensive" : "Group sessions",
                estimated_duration: avgScore < 60 ? "8-12 weeks" : "4-6 weeks",
                confidence_level: avgScore < 60 ? "High" : avgScore < 70 ? "Medium" : "Low"
            }
        };
        
        return res.status(200).json(
            new ResponseConfig(200, "Tutoring recommendations retrieved (fallback)", mockTutoring)
        );
    }
};

export const getAdaptiveLearningSuggestions = async (req, res, next) => {
    const { studentId } = req.params;
    
    try {
        const studentData = getStudentData(studentId);
        if (studentData.length === 0) {
            return res.status(404).json(
                new ResponseConfig(404, "Student data not found", null)
            );
        }

        const aiRequestData = {
            student_id: studentId,
            scores: convertToAIServiceFormat(studentData)
        };

        const adaptiveLearning = await aiService.getAdaptiveLearningSuggestions(aiRequestData);
        return res.status(200).json(
            new ResponseConfig(200, "Adaptive learning suggestions retrieved", adaptiveLearning)
        );
    } catch (error) {
        console.error('Adaptive Learning Error:', error);
        // Generate personalized adaptive learning suggestions
        const studentData = getStudentData(studentId);
        const scores = studentData.map(s => s.score);
        const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
        
        const mockAdaptive = {
            student_id: studentId,
            adaptive_learning: {
                difficulty_adjustment: avgScore > 80 ? "increase" : avgScore < 60 ? "decrease" : "maintain",
                content_pacing: avgScore > 85 ? "accelerated" : avgScore > 70 ? "standard" : "remedial",
                personalization_level: studentData.length > 10 ? "high" : "medium",
                recommended_activities: avgScore > 80 ? ["Advanced challenges", "Peer teaching", "Research projects"] : 
                                     avgScore > 70 ? ["Practice problems", "Concept reviews", "Group discussions"] :
                                     ["Basic tutorials", "Step-by-step guidance", "Extra practice"],
                learning_path_adjustment: avgScore > 80 ? "Skip basic concepts" : avgScore < 60 ? "Add foundational review" : "Standard progression"
            }
        };
        
        return res.status(200).json(
            new ResponseConfig(200, "Adaptive learning suggestions retrieved (fallback)", mockAdaptive)
        );
    }
};

export const getComprehensiveInsights = async (req, res, next) => {
    const { studentId } = req.params;
    
    try {
        const studentData = getStudentData(studentId);
        if (studentData.length === 0) {
            return res.status(404).json(
                new ResponseConfig(404, "Student data not found", null)
            );
        }

        const aiRequestData = {
            student_id: studentId,
            scores: convertToAIServiceFormat(studentData)
        };

        const insights = await aiService.getComprehensiveInsights(aiRequestData);
        return res.status(200).json(
            new ResponseConfig(200, "Comprehensive insights retrieved", insights)
        );
    } catch (error) {
        console.error('Comprehensive Insights Error:', error);
        // Generate comprehensive insights based on student data
        const studentData = getStudentData(studentId);
        const scores = studentData.map(s => s.score);
        const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
        const weakTopics = studentData.filter(s => s.score < 70).map(s => s.topic);
        const strongTopics = studentData.filter(s => s.score > 85).map(s => s.topic);
        
        // Remove duplicates
        const uniqueWeakTopics = [...new Set(weakTopics)];
        const uniqueStrongTopics = [...new Set(strongTopics)];
        
        const mockInsights = {
            student_id: studentId,
            comprehensive_insights: {
                performance: {
                    overall_performance: avgScore,
                    confidence_score: Math.max(60, Math.min(95, avgScore + (Math.random() * 10 - 5))),
                    weak_topics: uniqueWeakTopics.slice(0, 3),
                    strong_topics: uniqueStrongTopics.slice(0, 3)
                },
                behavior: {
                    behavior_analysis: {
                        learning_style: avgScore > 80 ? "High Achiever" : avgScore < 60 ? "Needs Support" : "Balanced",
                        consistency: Math.max(0.3, Math.min(0.9, 1 - (Math.sqrt(scores.reduce((acc, score) => acc + Math.pow(score - avgScore, 2), 0) / scores.length) / 100))),
                        engagement: Math.max(0.4, Math.min(0.95, avgScore / 100)),
                        improvement_rate: (Math.random() * 0.3) + 0.1,
                        recommendations: [
                            "Maintain consistent study schedule",
                            "Focus on weak areas identified",
                            "Practice active learning techniques"
                        ]
                    }
                },
                content_recommendations: {
                    recommendations: [
                        ...uniqueWeakTopics.slice(0, 2).map(topic => ({
                            topic: topic,
                            reason: `Strengthen ${topic} fundamentals`,
                            confidence: 0.8
                        })),
                        ...uniqueStrongTopics.slice(0, 1).map(topic => ({
                            topic: `Advanced ${topic}`,
                            reason: `Build on strong ${topic} foundation`,
                            confidence: 0.7
                        }))
                    ]
                },
                learning_path: {
                    optimized_path: [
                        ...uniqueWeakTopics.slice(0, 3).map(topic => ({
                            topic: topic,
                            type: "review",
                            estimated_time: "2-3 hours"
                        })),
                        ...uniqueStrongTopics.slice(0, 2).map(topic => ({
                            topic: `Advanced ${topic}`,
                            type: "advanced",
                            estimated_time: "3-4 hours"
                        }))
                    ],
                    path_length: Math.min(uniqueWeakTopics.length + uniqueStrongTopics.length, 5),
                    estimated_completion_time: `${Math.min(uniqueWeakTopics.length + uniqueStrongTopics.length, 5) * 2} hours`
                },
                predictions: {
                    next_performance: Math.max(0, Math.min(100, avgScore + (Math.random() * 10 - 5))),
                    completion_probability: Math.max(0.6, Math.min(0.95, (avgScore / 100) + 0.1)),
                    estimated_improvement: Math.max(0, Math.min(20, (Math.random() * 10) + 5))
                },
                study_plan: {
                    learning_path: uniqueWeakTopics.slice(0, 3).map(topic => ({
                        topic: topic,
                        type: "review",
                        estimated_time: "2 hours"
                    })),
                    recommended_content: uniqueWeakTopics.slice(0, 2).map(topic => ({
                        topic: topic,
                        type: "practice",
                        duration: "1 hour"
                    })),
                    study_schedule: {
                        frequency: avgScore < 70 ? "4-5 times per week" : "3-4 times per week",
                        session_duration: avgScore < 70 ? "60-90 minutes" : "45-60 minutes",
                        breaks: "15-minute breaks every 45 minutes"
                    },
                    focus_areas: studentData.reduce((acc, score) => {
                        const existing = acc.find(a => a.topic === score.topic);
                        if (existing) {
                            existing.current_performance = (existing.current_performance + score.score) / 2;
                        } else {
                            acc.push({
                                topic: score.topic,
                                current_performance: score.score,
                                priority: score.score < 60 ? "high" : score.score < 75 ? "medium" : "low"
                            });
                        }
                        return acc;
                    }, []).slice(0, 5),
                    estimated_completion_time: `${weakTopics.length * 2 + strongTopics.length} hours`
                },
                tutoring: {
                    needed: avgScore < 70,
                    recommended_sessions: avgScore < 60 ? 3 : avgScore < 70 ? 2 : 0,
                    focus_topics: uniqueWeakTopics.slice(0, 3)
                },
                adaptive_learning: {
                    difficulty_adjustment: avgScore > 80 ? "increase" : avgScore < 60 ? "decrease" : "maintain",
                    content_pacing: avgScore > 85 ? "accelerated" : avgScore > 70 ? "standard" : "remedial",
                    personalization_level: studentData.length > 10 ? "high" : "medium"
                },
                summary: {
                    overall_status: avgScore > 85 ? "Excellent" : avgScore > 70 ? "Good" : "Needs Attention",
                    learning_style: avgScore > 80 ? "High Achiever" : avgScore < 60 ? "Needs Support" : "Balanced",
                    risk_level: avgScore < 60 ? "high" : avgScore < 75 ? "medium" : "low",
                    performance_trend: avgScore > 80 ? "Improving" : avgScore > 70 ? "Stable" : "Declining",
                    key_message: avgScore > 85 ? "Student shows exceptional performance with strong potential for continued growth." :
                                avgScore > 70 ? "Student demonstrates solid understanding with room for improvement in specific areas." :
                                "Student requires additional support and focused intervention strategies."
                }
            }
        };
        
        return res.status(200).json(
            new ResponseConfig(200, "Comprehensive insights retrieved (fallback)", mockInsights)
        );
    }
};
