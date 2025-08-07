import express from "express";
import {
  generateAIQuiz,
  createQuiz,
  getCourseQuizzes,
  getQuizById,
  submitQuizAttempt,
  updateQuiz,
  deleteQuiz
} from "../controllers/quiz/quiz.controller.js";
import { authenticateUser } from "../middlewares/authentication/auth.middleware.js";
import { isAuthenticated } from "../middlewares/authentication/role.middleware.js";

const router = express.Router();

// Quiz routes
router.route("/ai-generate")
  .post(authenticateUser, isAuthenticated(["TEACHER", "ADMIN"]), generateAIQuiz);

router.route("/")
  .post(authenticateUser, isAuthenticated(["TEACHER", "ADMIN"]), createQuiz);

router.route("/course/:courseId")
  .get(authenticateUser, isAuthenticated(["STUDENT", "TEACHER", "ADMIN"]), getCourseQuizzes);

router.route("/:quizId")
  .get(authenticateUser, isAuthenticated(["STUDENT", "TEACHER", "ADMIN"]), getQuizById)
  .patch(authenticateUser, isAuthenticated(["TEACHER", "ADMIN"]), updateQuiz)
  .delete(authenticateUser, isAuthenticated(["TEACHER", "ADMIN"]), deleteQuiz);

router.route("/:quizId/attempt")
  .post(authenticateUser, isAuthenticated(["STUDENT"]), submitQuizAttempt);

export default router;
