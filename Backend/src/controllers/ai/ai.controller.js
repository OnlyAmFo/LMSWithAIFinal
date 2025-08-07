import asyncHandler from "../../helpers/asyncHandler.js";
import ResponseConfig from "../../helpers/responseConfig.js";
import ErrorConfig from "../../helpers/errorConfig.js";
import aiService from "../../services/aiService.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Dynamic data loading from training file

/**
 * Test endpoint that returns mock AI analysis without calling AI service
 */
const testStudentPerformance = asyncHandler(async (req, res, next) => {
    const { studentId } = req.params;
    // Path to the generated training data
    const dataPath = path.join(__dirname, "../../../ai_module/ai_training_data.json");
    let trainingData;
    try {
        const raw = fs.readFileSync(dataPath, "utf-8");
        trainingData = JSON.parse(raw);
    } catch (err) {
        console.error('Error loading training data:', err);
        return next(new ErrorConfig(500, "Failed to load training data"));
    }
    // Find the student data (key is studentId, e.g., class1_student1)
    const studentScores = trainingData[studentId];
    if (!studentScores) {
        return next(new ErrorConfig(404, `No data found for studentId: ${studentId}`));
    }
    // Calculate realistic performance metrics from the scores
    const total = studentScores.reduce((sum, s) => sum + s.score, 0);
    const avg = total / studentScores.length;
    const topics = {};
    studentScores.forEach(s => {
        if (!topics[s.topic]) topics[s.topic] = [];
        topics[s.topic].push(s.score);
    });
    const topicAverages = Object.entries(topics).map(([topic, scores]) => ({ topic, avg: scores.reduce((a, b) => a + b, 0) / scores.length }));
    const strong_topics = topicAverages.filter(t => t.avg >= 75).map(t => t.topic);
    const weak_topics = topicAverages.filter(t => t.avg < 60).map(t => t.topic);
    // Simple trend: compare last 3 scores
    const recentScores = studentScores.slice(-3).map(s => s.score);
    let trend_direction = "stable";
    if (recentScores.length === 3) {
        if (recentScores[2] > recentScores[0]) trend_direction = "improving";
        else if (recentScores[2] < recentScores[0]) trend_direction = "declining";
    }
    // Risk level
    let risk_level = "low";
    if (avg < 60) risk_level = "high";
    else if (avg < 75) risk_level = "medium";
    // Suggestions
    const suggestions = [];
    if (weak_topics.length > 0) suggestions.push(`Focus on improving: ${weak_topics.join(", ")}`);
    if (trend_direction === "declining") suggestions.push("Recent performance is declining, seek help.");
    if (risk_level === "high") suggestions.push("Immediate intervention recommended.");
    // Response
    const analysis = {
        student_id: studentId,
        overall_performance: Math.round(avg * 10) / 10,
        performance_level: avg >= 90 ? "excellent" : avg >= 75 ? "good" : avg >= 60 ? "average" : "struggling",
        weak_topics,
        strong_topics,
        trends: {
            trend_direction,
            trend_strength: "moderate",
            recent_performance: recentScores[recentScores.length - 1] || avg
        },
        risk_level,
        confidence_score: Math.round((100 - Math.abs(avg - 75)) * 0.9),
        suggestions
    };
    return res.status(200).json(new ResponseConfig(200, "Test performance analysis completed", analysis));
});

/**
 * Analyze individual student performance
 */
const analyzeStudentPerformance = asyncHandler(async (req, res, next) => {
    const { studentId } = req.params;
    const dataPath = path.join(__dirname, "../../../ai_module/ai_training_data.json");
    let trainingData;
    try {
        const raw = fs.readFileSync(dataPath, "utf-8");
        trainingData = JSON.parse(raw);
    } catch (err) {
        console.error('Error loading training data:', err);
        return next(new ErrorConfig(500, "Failed to load training data"));
    }
    const studentScores = trainingData[studentId];
    if (!studentScores) {
        return next(new ErrorConfig(404, "Student scores not found"));
    }
    try {
        const analysis = await aiService.analyzeStudentPerformance(studentId, studentScores);
        return res.status(200).json(
            new ResponseConfig(200, "Performance analysis completed", analysis)
        );
    } catch (error) {
        console.error('AI Analysis Error:', error);
        return next(new ErrorConfig(500, "Failed to analyze performance"));
    }
});

/**
 * Analyze class performance (for teachers/admins)
 */
const analyzeClassPerformance = asyncHandler(async (req, res, next) => {
    const { classId } = req.params;
    
    // Path to the generated training data
    const dataPath = path.join(__dirname, "../../../ai_module/ai_training_data.json");
    let trainingData;
    try {
        const raw = fs.readFileSync(dataPath, "utf-8");
        trainingData = JSON.parse(raw);
    } catch (err) {
        console.error('Error loading training data:', err);
        return next(new ErrorConfig(500, "Failed to load training data"));
    }
    
    // Find all students for this class
    const classStudents = Object.keys(trainingData).filter(key => key.startsWith(classId + "_"));
    
    if (classStudents.length === 0) {
        return next(new ErrorConfig(404, `No data found for classId: ${classId}`));
    }
    
    // Prepare student scores for AI analysis
    const classStudentScores = classStudents.map(studentId => ({
        student_id: studentId,
        scores: trainingData[studentId]
    }));

    try {
        const analysis = await aiService.analyzeClassPerformance(classStudentScores);
        
        return res.status(200).json(
            new ResponseConfig(200, "Class performance analysis completed", analysis)
        );
    } catch (error) {
        console.error('AI Class Analysis Error:', error);
        return next(new ErrorConfig(500, "Failed to analyze class performance"));
    }
});

/**
 * Get at-risk students (for admin/teacher dashboard)
 */
const getAtRiskStudents = asyncHandler(async (req, res, next) => {
    const { classId } = req.params;
    
    // Path to the generated training data
    const dataPath = path.join(__dirname, "../../../ai_module/ai_training_data.json");
    let trainingData;
    try {
        const raw = fs.readFileSync(dataPath, "utf-8");
        trainingData = JSON.parse(raw);
    } catch (err) {
        console.error('Error loading training data:', err);
        return next(new ErrorConfig(500, "Failed to load training data"));
    }
    
    // Find all students for this class
    const classStudents = Object.keys(trainingData).filter(key => key.startsWith(classId + "_"));
    
    if (classStudents.length === 0) {
        return next(new ErrorConfig(404, `No data found for classId: ${classId}`));
    }
    
    // Prepare student scores for AI analysis
    const classStudentScores = classStudents.map(studentId => ({
        student_id: studentId,
        scores: trainingData[studentId]
    }));

    try {
        const analysis = await aiService.analyzeClassPerformance(classStudentScores);
        
        // Filter at-risk students
        const atRiskStudents = analysis.student_analyses.filter(
            student => student.risk_level === "high" || student.risk_level === "medium"
        );

        return res.status(200).json(
            new ResponseConfig(200, "At-risk students retrieved", {
                at_risk_students: atRiskStudents,
                total_students: analysis.student_analyses.length
            })
        );
    } catch (error) {
        console.error('At-Risk Students Error:', error);
        return next(new ErrorConfig(500, "Failed to get at-risk students"));
    }
});

/**
 * Get performance trends for a student
 */
const getStudentTrends = asyncHandler(async (req, res, next) => {
    const { studentId } = req.params;
    
    // Path to the generated training data
    const dataPath = path.join(__dirname, "../../../ai_module/ai_training_data.json");
    let trainingData;
    try {
        const raw = fs.readFileSync(dataPath, "utf-8");
        trainingData = JSON.parse(raw);
    } catch (err) {
        console.error('Error loading training data:', err);
        return next(new ErrorConfig(500, "Failed to load training data"));
    }
    
    const studentScores = trainingData[studentId];
    
    if (!studentScores) {
        return next(new ErrorConfig(404, "Student scores not found"));
    }

    try {
        const analysis = await aiService.analyzeStudentPerformance(studentId, studentScores);
        
        return res.status(200).json(
            new ResponseConfig(200, "Student trends retrieved", {
                student_id: studentId,
                trend: analysis.trend,
                overall_performance: analysis.overall_performance,
                risk_level: analysis.risk_level
            })
        );
    } catch (error) {
        console.error('Student Trends Error:', error);
        return next(new ErrorConfig(500, "Failed to get student trends"));
    }
});

/**
 * Get AI service health status
 */
const getAIHealth = asyncHandler(async (req, res, next) => {
    try {
        const isHealthy = await aiService.checkHealth();
        
        return res.status(200).json(
            new ResponseConfig(200, "AI service health checked", {
                healthy: isHealthy,
                service: "LMS AI Performance Analysis"
            })
        );
    } catch (error) {
        console.error('AI Health Check Error:', error);
        return res.status(200).json(
            new ResponseConfig(200, "AI service health checked", {
                healthy: false,
                service: "LMS AI Performance Analysis",
                error: error.message
            })
        );
    }
});

/**
 * Test endpoint for class performance analysis
 */
const testClassPerformance = asyncHandler(async (req, res, next) => {
    const { classId } = req.params;
    
    // Path to the generated training data
    const dataPath = path.join(__dirname, "../../../ai_module/ai_training_data.json");
    let trainingData;
    try {
        const raw = fs.readFileSync(dataPath, "utf-8");
        trainingData = JSON.parse(raw);
    } catch (err) {
        console.error('Error loading training data:', err);
        return next(new ErrorConfig(500, "Failed to load training data"));
    }
    
    // Find all students for this class (keys like class1_student1, class1_student2, etc.)
    const classStudents = Object.keys(trainingData).filter(key => key.startsWith(classId + "_"));
    
    if (classStudents.length === 0) {
        return next(new ErrorConfig(404, `No data found for classId: ${classId}`));
    }
    
    // Calculate class-wide metrics
    let totalScores = 0;
    let totalAssessments = 0;
    const topicScores = {};
    const studentAverages = [];
    
    classStudents.forEach(studentId => {
        const studentScores = trainingData[studentId];
        if (studentScores && studentScores.length > 0) {
            const studentTotal = studentScores.reduce((sum, s) => sum + s.score, 0);
            const studentAvg = studentTotal / studentScores.length;
            studentAverages.push({ student_id: studentId, average: studentAvg });
            
            totalScores += studentTotal;
            totalAssessments += studentScores.length;
            
            // Aggregate topic scores
            studentScores.forEach(score => {
                if (!topicScores[score.topic]) {
                    topicScores[score.topic] = [];
                }
                topicScores[score.topic].push(score.score);
            });
        }
    });
    
    const classAverage = totalScores / totalAssessments;
    
    // Calculate topic performance
    const topicPerformance = {};
    Object.entries(topicScores).forEach(([topic, scores]) => {
        const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
        let trend = "stable";
        if (scores.length >= 3) {
            const recent = scores.slice(-3);
            if (recent[2] > recent[0]) trend = "improving";
            else if (recent[2] < recent[0]) trend = "declining";
        }
        
        topicPerformance[topic] = {
            average_score: Math.round(avgScore * 10) / 10,
            trend: trend,
            recommendations: [
                avgScore < 70 ? `Focus on ${topic} fundamentals` : `Continue strong ${topic} performance`,
                avgScore < 60 ? "Consider additional tutoring" : "Encourage peer teaching",
                "Regular practice and review"
            ]
        };
    });
    
    // Identify top performers and students needing attention
    studentAverages.sort((a, b) => b.average - a.average);
    const topPerformers = studentAverages.slice(0, Math.ceil(studentAverages.length * 0.3)).map(s => s.student_id);
    const needsAttention = studentAverages.filter(s => s.average < 70).map(s => s.student_id);
    
    // Determine overall trend
    let overallTrend = "stable";
    if (studentAverages.length >= 2) {
        const topHalf = studentAverages.slice(0, Math.ceil(studentAverages.length / 2));
        const bottomHalf = studentAverages.slice(Math.ceil(studentAverages.length / 2));
        const topAvg = topHalf.reduce((sum, s) => sum + s.average, 0) / topHalf.length;
        const bottomAvg = bottomHalf.reduce((sum, s) => sum + s.average, 0) / bottomHalf.length;
        if (topAvg - bottomAvg > 15) overallTrend = "improving";
        else if (bottomAvg < 65) overallTrend = "declining";
    }
    
    // Risk level
    let riskLevel = "low";
    if (classAverage < 65) riskLevel = "high";
    else if (classAverage < 75) riskLevel = "medium";
    
    const classAnalysis = {
        class_id: classId,
        total_students: classStudents.length,
        class_average: Math.round(classAverage * 10) / 10,
        top_performers: topPerformers,
        needs_attention: needsAttention,
        topic_performance: topicPerformance,
        overall_trend: overallTrend,
        risk_level: riskLevel
    };
    
    return res.status(200).json(
        new ResponseConfig(200, "Test class performance analysis completed", classAnalysis)
    );
});

/**
 * Test endpoint for at-risk students
 */
const testAtRiskStudents = asyncHandler(async (req, res, next) => {
    const { classId } = req.params;
    
    // Path to the generated training data
    const dataPath = path.join(__dirname, "../../../ai_module/ai_training_data.json");
    let trainingData;
    try {
        const raw = fs.readFileSync(dataPath, "utf-8");
        trainingData = JSON.parse(raw);
    } catch (err) {
        console.error('Error loading training data:', err);
        return next(new ErrorConfig(500, "Failed to load training data"));
    }
    
    // Find all students for this class (keys like class1_student1, class1_student2, etc.)
    const classStudents = Object.keys(trainingData).filter(key => key.startsWith(classId + "_"));
    
    if (classStudents.length === 0) {
        return next(new ErrorConfig(404, `No data found for classId: ${classId}`));
    }
    
    // Analyze each student's performance
    const atRiskStudents = [];
    let highRiskCount = 0;
    let mediumRiskCount = 0;
    let lowRiskCount = 0;
    
    classStudents.forEach(studentId => {
        const studentScores = trainingData[studentId];
        if (studentScores && studentScores.length > 0) {
            // Calculate student performance metrics
            const total = studentScores.reduce((sum, s) => sum + s.score, 0);
            const avg = total / studentScores.length;
            
            // Identify weak topics (topics with average < 70)
            const topicScores = {};
            studentScores.forEach(score => {
                if (!topicScores[score.topic]) {
                    topicScores[score.topic] = [];
                }
                topicScores[score.topic].push(score.score);
            });
            
            const weakTopics = [];
            Object.entries(topicScores).forEach(([topic, scores]) => {
                const topicAvg = scores.reduce((a, b) => a + b, 0) / scores.length;
                if (topicAvg < 70) {
                    weakTopics.push(topic);
                }
            });
            
            // Determine risk level
            let riskLevel = "low";
            let riskFactors = [];
            
            if (avg < 60) {
                riskLevel = "high";
                riskFactors.push("Critical performance issues", "Below 60% average");
                highRiskCount++;
            } else if (avg < 75) {
                riskLevel = "medium";
                riskFactors.push("Below average performance");
                mediumRiskCount++;
            } else {
                lowRiskCount++;
            }
            
            if (weakTopics.length > 2) {
                riskFactors.push("Multiple weak subjects");
            }
            
            if (weakTopics.length === 0 && avg >= 90) {
                riskFactors.push("None - excellent performance");
            } else if (weakTopics.length === 1) {
                riskFactors.push("Minor weakness in one subject");
            }
            
            // Generate intervention suggestions based on performance
            const interventionSuggestions = [];
            if (riskLevel === "high") {
                interventionSuggestions.push("Immediate intervention needed");
                interventionSuggestions.push("Schedule one-on-one tutoring");
                interventionSuggestions.push("Review basic concepts");
                interventionSuggestions.push("Consider study group participation");
                if (avg < 50) {
                    interventionSuggestions.push("Parent-teacher conference recommended");
                }
            } else if (riskLevel === "medium") {
                interventionSuggestions.push("Focus on weak subject fundamentals");
                interventionSuggestions.push("Get help with difficult concepts");
                interventionSuggestions.push("Consider additional tutoring");
                if (weakTopics.length > 0) {
                    interventionSuggestions.push(`Focus on: ${weakTopics.join(", ")}`);
                }
            } else {
                if (avg >= 90) {
                    interventionSuggestions.push("Consider advanced placement");
                    interventionSuggestions.push("Mentor other students");
                    interventionSuggestions.push("Explore research opportunities");
                } else {
                    interventionSuggestions.push("Continue strong performance");
                    interventionSuggestions.push("Focus on areas of improvement");
                    if (weakTopics.length > 0) {
                        interventionSuggestions.push(`Work on: ${weakTopics.join(", ")}`);
                    }
                }
            }
            
            // Get the most recent assessment date
            const dates = studentScores.map(s => new Date(s.date)).sort((a, b) => b - a);
            const lastAssessmentDate = dates[0] ? dates[0].toISOString().split('T')[0] : "2024-01-25";
            
            atRiskStudents.push({
                student_id: studentId,
                overall_performance: Math.round(avg * 10) / 10,
                risk_level: riskLevel,
                weak_topics: weakTopics,
                risk_factors: riskFactors,
                intervention_suggestions: interventionSuggestions,
                last_assessment_date: lastAssessmentDate
            });
        }
    });
    
    // Sort by risk level (high -> medium -> low) and then by performance
    atRiskStudents.sort((a, b) => {
        const riskOrder = { "high": 3, "medium": 2, "low": 1 };
        if (riskOrder[a.risk_level] !== riskOrder[b.risk_level]) {
            return riskOrder[b.risk_level] - riskOrder[a.risk_level];
        }
        return a.overall_performance - b.overall_performance;
    });
    
    const atRiskData = {
        class_id: classId,
        total_students: classStudents.length,
        at_risk_students: atRiskStudents,
        summary: {
            high_risk_count: highRiskCount,
            medium_risk_count: mediumRiskCount,
            low_risk_count: lowRiskCount
        }
    };
    
    return res.status(200).json(
        new ResponseConfig(200, "Test at-risk students analysis completed", atRiskData)
    );
});

export {
    testStudentPerformance,
    analyzeStudentPerformance,
    analyzeClassPerformance,
    getAtRiskStudents,
    getStudentTrends,
    getAIHealth,
    testClassPerformance,
    testAtRiskStudents
}; 