import express from "express";
import {
  createStudentProfile,
  getStudentByAttendanceNumber,
  getAllStudents,
  updateStudentProfile,
  getStudentPerformance,
  deleteStudentProfile
} from "../controllers/student/student.controller.js";
import { authenticateUser } from "../middlewares/authentication/auth.middleware.js";
import { isAuthenticated } from "../middlewares/authentication/role.middleware.js";

const router = express.Router();

// Student routes
router.route("/")
  .post(authenticateUser, isAuthenticated(["ADMIN"]), createStudentProfile)
  .get(authenticateUser, isAuthenticated(["ADMIN", "TEACHER"]), getAllStudents);

router.route("/attendance/:attendanceNumber")
  .get(authenticateUser, isAuthenticated(["STUDENT", "TEACHER", "ADMIN"]), getStudentByAttendanceNumber)
  .patch(authenticateUser, isAuthenticated(["STUDENT", "ADMIN"]), updateStudentProfile)
  .delete(authenticateUser, isAuthenticated(["ADMIN"]), deleteStudentProfile);

router.route("/attendance/:attendanceNumber/performance")
  .get(authenticateUser, isAuthenticated(["STUDENT", "TEACHER", "ADMIN"]), getStudentPerformance);

export default router;
