import express from "express";
import {
  createAssignment,
  getCourseAssignments,
  getAssignmentById,
  updateAssignment,
  deleteAssignment
} from "../controllers/assignment/assignment.controller.js";
import { authenticateUser } from "../middlewares/authentication/auth.middleware.js";
import { isAuthenticated } from "../middlewares/authentication/role.middleware.js";

const router = express.Router();

// Assignment routes
router.route("/")
  .post(authenticateUser, isAuthenticated(["TEACHER", "ADMIN"]), createAssignment);

router.route("/course/:courseId")
  .get(authenticateUser, isAuthenticated(["STUDENT", "TEACHER", "ADMIN"]), getCourseAssignments);

router.route("/:assignmentId")
  .get(authenticateUser, isAuthenticated(["STUDENT", "TEACHER", "ADMIN"]), getAssignmentById)
  .patch(authenticateUser, isAuthenticated(["TEACHER", "ADMIN"]), updateAssignment)
  .delete(authenticateUser, isAuthenticated(["TEACHER", "ADMIN"]), deleteAssignment);

export default router;
