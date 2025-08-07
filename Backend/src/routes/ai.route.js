import express from "express";
import {
    testStudentPerformance,
    testClassPerformance,
    testAtRiskStudents,
    analyzeStudentPerformance,
    analyzeClassPerformance,
    getAtRiskStudents,
    getStudentTrends,
    getAIHealth
} from "../controllers/ai/ai.controller.js";
import { authenticateUser } from "../middlewares/authentication/auth.middleware.js";
import { isAuthenticated } from "../middlewares/authentication/role.middleware.js";

const router = express.Router();

// Health check endpoint (no authentication required)
router.route("/health").get(getAIHealth);

// Test endpoints (no authentication required for testing)
router.route("/test/student/:studentId/performance").get(testStudentPerformance);
router.route("/test/student/:studentId/trends").get(getStudentTrends);
router.route("/test/class/:classId/performance").get(testClassPerformance);
router.route("/test/class/:classId/at-risk").get(testAtRiskStudents);

// Student performance analysis (for students and teachers)
router.route("/student/:studentId/performance").get(
    authenticateUser,
    isAuthenticated(["STUDENT", "TEACHER", "ADMIN"]),
    analyzeStudentPerformance
);

// Student trends (for students and teachers)
router.route("/student/:studentId/trends").get(
    authenticateUser,
    isAuthenticated(["STUDENT", "TEACHER", "ADMIN"]),
    getStudentTrends
);

// Class performance analysis (for teachers and admins)
router.route("/class/:classId/performance").get(
    authenticateUser,
    isAuthenticated(["TEACHER", "ADMIN"]),
    analyzeClassPerformance
);

// At-risk students (for teachers and admins)
router.route("/class/:classId/at-risk").get(
    authenticateUser,
    isAuthenticated(["TEACHER", "ADMIN"]),
    getAtRiskStudents
);

export default router; 