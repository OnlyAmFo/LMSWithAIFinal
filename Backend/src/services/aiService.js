import axios from "axios";

const AI_BASE_URL = process.env.AI_SERVICE_URL || "http://localhost:8001";

class AIService {
    constructor() {
        this.baseURL = AI_BASE_URL;
    }

    async makeRequest(endpoint, method = 'GET', data = null) {
        try {
            const config = {
                method,
                url: `${this.baseURL}${endpoint}`,
                headers: {
                    'Content-Type': 'application/json',
                },
            };

            if (data) {
                config.data = data;
            }

            const response = await axios(config);
            return response.data;
        } catch (error) {
            console.error(`AI Service Error (${endpoint}):`, error.message);
            throw error;
        }
    }

    // Enhanced AI methods that use real ML models
    async getComprehensiveInsights(requestData) {
        return await this.makeRequest('/comprehensive-insights', 'POST', requestData);
    }

    async analyzeBehavior(requestData) {
        return await this.makeRequest('/behavior-analysis', 'POST', requestData);
    }

    async getContentRecommendations(requestData) {
        return await this.makeRequest('/content-recommendations', 'POST', requestData);
    }

    async optimizeLearningPath(requestData) {
        return await this.makeRequest('/learning-path', 'POST', requestData);
    }

    async getStudyPlan(requestData) {
        return await this.makeRequest('/study-plan', 'POST', requestData);
    }

    async autoGradeAssignment(gradingData) {
        return await this.makeRequest('/auto-grade', 'POST', gradingData);
    }

    // Legacy methods for backward compatibility
    async analyzeStudentPerformance(studentId, scores) {
        const requestData = {
            student_id: studentId,
            scores: scores.map(score => ({
                student_id: score.student_id || studentId,
                topic: score.topic,
                score: score.score,
                max_score: score.max_score || 100,
                date: score.date,
                assignment_type: score.assignment_type || "quiz"
            }))
        };
        return await this.makeRequest('/analyze-performance', 'POST', requestData);
    }

    async analyzeClassPerformance(classId) {
        return await this.makeRequest('/analyze-class-performance', 'POST', { class_id: classId });
    }

    async checkHealth() {
        return await this.makeRequest('/health', 'GET');
    }

    // Helper methods for comprehensive insights
    async getPredictiveAnalytics(requestData) {
        // This would use the comprehensive insights endpoint
        const insights = await this.getComprehensiveInsights(requestData);
        return {
            student_id: requestData.student_id,
            predictions: insights.comprehensive_insights?.predictions || {}
        };
    }

    async getPersonalizedStudyPlan(requestData) {
        return await this.getStudyPlan(requestData);
    }

    async getTutoringRecommendations(requestData) {
        const insights = await this.getComprehensiveInsights(requestData);
        return {
            student_id: requestData.student_id,
            tutoring: insights.comprehensive_insights?.tutoring || {}
        };
    }

    async getAdaptiveLearningSuggestions(requestData) {
        const insights = await this.getComprehensiveInsights(requestData);
        return {
            student_id: requestData.student_id,
            adaptive_learning: insights.comprehensive_insights?.adaptive_learning || {}
        };
    }
}

export default new AIService(); 