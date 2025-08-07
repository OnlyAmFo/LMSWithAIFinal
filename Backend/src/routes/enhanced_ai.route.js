import express from "express";
import {
    getContentRecommendations,
    autoGradeAssignment,
    optimizeLearningPath,
    analyzeBehavior,
    getPredictiveAnalytics,
    getPersonalizedStudyPlan,
    getTutoringRecommendations,
    getAdaptiveLearningSuggestions,
    getComprehensiveInsights
} from "../controllers/ai/enhanced_ai.controller.js";
import { authenticateUser } from "../middlewares/authentication/auth.middleware.js";
import { isAuthenticated } from "../middlewares/authentication/role.middleware.js";

const router = express.Router();

// Enhanced AI Routes (Authenticated)
router.route("/content-recommendations/:studentId")
    .get(authenticateUser, isAuthenticated(["STUDENT", "TEACHER", "ADMIN"]), getContentRecommendations);

router.route("/auto-grade")
    .post(authenticateUser, isAuthenticated(["TEACHER", "ADMIN"]), autoGradeAssignment);

router.route("/learning-path/:studentId")
    .get(authenticateUser, isAuthenticated(["STUDENT", "TEACHER", "ADMIN"]), optimizeLearningPath);

router.route("/behavior-analysis/:studentId")
    .get(authenticateUser, isAuthenticated(["STUDENT", "TEACHER", "ADMIN"]), analyzeBehavior);

router.route("/predictive-analytics/:studentId")
    .get(authenticateUser, isAuthenticated(["STUDENT", "TEACHER", "ADMIN"]), getPredictiveAnalytics);

router.route("/study-plan/:studentId")
    .get(authenticateUser, isAuthenticated(["STUDENT", "TEACHER", "ADMIN"]), getPersonalizedStudyPlan);

router.route("/tutoring-recommendations/:studentId")
    .get(authenticateUser, isAuthenticated(["STUDENT", "TEACHER", "ADMIN"]), getTutoringRecommendations);

router.route("/adaptive-learning/:studentId")
    .get(authenticateUser, isAuthenticated(["STUDENT", "TEACHER", "ADMIN"]), getAdaptiveLearningSuggestions);

router.route("/comprehensive-insights/:studentId")
    .get(authenticateUser, isAuthenticated(["STUDENT", "TEACHER", "ADMIN"]), getComprehensiveInsights);

// Test routes (no authentication required)
router.route("/test/content-recommendations/:studentId")
    .get(getContentRecommendations);

router.route("/test/auto-grade")
    .post(autoGradeAssignment);

router.route("/test/learning-path/:studentId")
    .get(optimizeLearningPath);

router.route("/test/behavior-analysis/:studentId")
    .get(analyzeBehavior);

router.route("/test/predictive-analytics/:studentId")
    .get(getPredictiveAnalytics);

router.route("/test/study-plan/:studentId")
    .get(getPersonalizedStudyPlan);

router.route("/test/tutoring-recommendations/:studentId")
    .get(getTutoringRecommendations);

router.route("/test/adaptive-learning/:studentId")
    .get(getAdaptiveLearningSuggestions);

router.route("/test/comprehensive-insights/:studentId")
    .get(getComprehensiveInsights);

export default router;
