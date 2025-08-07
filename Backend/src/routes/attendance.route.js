import express from "express";
import {
  createAttendance,
  getAllAttendance,
  deleteAttendance,
  updateAttendance,
  getAttendanceById,
} from "../controllers/attendance/attendance.controller.js";
import { authenticateUser } from "../middlewares/authentication/auth.middleware.js";
import { isAuthenticated } from "../middlewares/authentication/role.middleware.js";

const router = express.Router();

router
  .route("/attendance/:attendanceId")
  .get(
    authenticateUser,
    isAuthenticated(["TEACHER", "ADMIN"]),
    getAttendanceById
  );
router
  .route("/create-attendance")
  .post(
    authenticateUser,
    isAuthenticated(["TEACHER", "ADMIN"]),
    createAttendance
  );
router
  .route("/attendance")
  .get(
    authenticateUser,
    isAuthenticated(["TEACHER", "ADMIN"]),
    getAllAttendance
  );
router
  .route("/delete-attendance/:attendanceId")
  .delete(
    authenticateUser,
    isAuthenticated(["TEACHER", "ADMIN"]),
    deleteAttendance
  );
router
  .route("/update-attendance/:attendanceId")
  .patch(
    authenticateUser,
    isAuthenticated(["TEACHER", "ADMIN"]),
    updateAttendance
  );

export default router;
