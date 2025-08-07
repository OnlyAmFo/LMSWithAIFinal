import asyncHandler from "../../helpers/asyncHandler.js";
import ResponseConfig from "../../helpers/responseConfig.js";
import ErrorConfig from "../../helpers/errorConfig.js";
import prisma from "../../lib/dbConnection.js";

// Create student profile
const createStudentProfile = asyncHandler(async (req, res, next) => {
  const { userId, attendanceNumber, grade, section, rollNumber, parentContact, emergencyContact } = req.body;
  const { role, id } = req.loggedInfo;

  // Only admins can create student profiles
  if (role !== "ADMIN") {
    return next(new ErrorConfig(403, "Only admins can create student profiles"));
  }

  // Validate required fields
  if (!userId || !attendanceNumber) {
    return next(new ErrorConfig(400, "User ID and attendance number are required"));
  }

  // Check if user exists and is a student
  const user = await prisma.user.findUnique({
    where: { id: userId, role: "STUDENT" }
  });

  if (!user) {
    return next(new ErrorConfig(404, "User not found or is not a student"));
  }

  // Check if attendance number already exists
  const existingStudent = await prisma.student.findUnique({
    where: { attendanceNumber }
  });

  if (existingStudent) {
    return next(new ErrorConfig(400, "Attendance number already exists"));
  }

  // Check if user already has a student profile
  const existingProfile = await prisma.student.findUnique({
    where: { userId }
  });

  if (existingProfile) {
    return next(new ErrorConfig(400, "Student profile already exists for this user"));
  }

  const studentProfile = await prisma.student.create({
    data: {
      userId,
      attendanceNumber,
      grade,
      section,
      rollNumber: rollNumber ? parseInt(rollNumber) : null,
      parentContact,
      emergencyContact
    },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          class: true
        }
      }
    }
  });

  return res.status(201).json(
    new ResponseConfig(201, "Student profile created successfully", studentProfile)
  );
});

// Get student by attendance number
const getStudentByAttendanceNumber = asyncHandler(async (req, res, next) => {
  const { attendanceNumber } = req.params;
  const { role, id } = req.loggedInfo;

  const student = await prisma.student.findUnique({
    where: { attendanceNumber },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          class: true,
          profile: true
        }
      }
    }
  });

  if (!student) {
    return next(new ErrorConfig(404, "Student not found"));
  }

  // Check permissions
  if (role === "STUDENT" && student.userId !== id) {
    return next(new ErrorConfig(403, "You can only view your own profile"));
  }

  return res.status(200).json(
    new ResponseConfig(200, "Student profile retrieved successfully", student)
  );
});

// Get all students (for admin/teacher)
const getAllStudents = asyncHandler(async (req, res, next) => {
  const { role } = req.loggedInfo;

  if (role !== "ADMIN" && role !== "TEACHER") {
    return next(new ErrorConfig(403, "You don't have permission to view all students"));
  }

  const students = await prisma.student.findMany({
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          class: true,
          profile: true
        }
      }
    },
    orderBy: {
      user: {
        firstName: "asc"
      }
    }
  });

  return res.status(200).json(
    new ResponseConfig(200, "Students retrieved successfully", students)
  );
});

// Update student profile
const updateStudentProfile = asyncHandler(async (req, res, next) => {
  const { attendanceNumber } = req.params;
  const { grade, section, rollNumber, parentContact, emergencyContact } = req.body;
  const { role, id } = req.loggedInfo;

  const student = await prisma.student.findUnique({
    where: { attendanceNumber },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true
        }
      }
    }
  });

  if (!student) {
    return next(new ErrorConfig(404, "Student not found"));
  }

  // Check permissions
  if (role === "STUDENT" && student.userId !== id) {
    return next(new ErrorConfig(403, "You can only update your own profile"));
  }

  if (role === "TEACHER" && role !== "ADMIN") {
    return next(new ErrorConfig(403, "Teachers cannot update student profiles"));
  }

  const updatedStudent = await prisma.student.update({
    where: { attendanceNumber },
    data: {
      grade: grade || student.grade,
      section: section || student.section,
      rollNumber: rollNumber ? parseInt(rollNumber) : student.rollNumber,
      parentContact: parentContact || student.parentContact,
      emergencyContact: emergencyContact || student.emergencyContact
    },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          class: true,
          profile: true
        }
      }
    }
  });

  return res.status(200).json(
    new ResponseConfig(200, "Student profile updated successfully", updatedStudent)
  );
});

// Get student performance (AI-powered insights)
const getStudentPerformance = asyncHandler(async (req, res, next) => {
  const { attendanceNumber } = req.params;
  const { role, id } = req.loggedInfo;

  const student = await prisma.student.findUnique({
    where: { attendanceNumber },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true
        }
      }
    }
  });

  if (!student) {
    return next(new ErrorConfig(404, "Student not found"));
  }

  // Check permissions
  if (role === "STUDENT" && student.userId !== id) {
    return next(new ErrorConfig(403, "You can only view your own performance"));
  }

  // Get student's enrollments and related data
  const enrollments = await prisma.enrollment.findMany({
    where: { userId: student.userId },
    include: {
      course: {
        select: {
          id: true,
          title: true,
          teacher: {
            select: {
              id: true,
              firstName: true,
              lastName: true
            }
          }
        }
      }
    }
  });

  // Get quiz attempts
  const quizAttempts = await prisma.quizAttempt.findMany({
    where: { studentId: student.userId },
    include: {
      quiz: {
        select: {
          id: true,
          title: true,
          maxScore: true,
          course: {
            select: {
              id: true,
              title: true
            }
          }
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  // Get assignment submissions
  const submissions = await prisma.submission.findMany({
    where: { studentId: student.userId },
    include: {
      assignment: {
        select: {
          id: true,
          title: true,
          maxScore: true,
          course: {
            select: {
              id: true,
              title: true
            }
          }
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  // Get attendance records
  const attendance = await prisma.attendance.findMany({
    where: { studentId: student.userId },
    include: {
      course: {
        select: {
          id: true,
          title: true
        }
      }
    },
    orderBy: { date: "desc" }
  });

  // Calculate performance metrics
  const totalQuizzes = quizAttempts.length;
  const totalAssignments = submissions.length;
  const totalAttendance = attendance.length;

  const averageQuizScore = totalQuizzes > 0 
    ? quizAttempts.reduce((sum, attempt) => sum + (attempt.score || 0), 0) / totalQuizzes 
    : 0;

  const averageAssignmentScore = totalAssignments > 0
    ? submissions.reduce((sum, submission) => sum + (submission.score || 0), 0) / totalAssignments
    : 0;

  const attendanceRate = totalAttendance > 0
    ? (attendance.filter(a => a.status === "PRESENT").length / totalAttendance) * 100
    : 0;

  const performance = {
    student: student.user,
    attendanceNumber: student.attendanceNumber,
    enrollments,
    quizAttempts,
    submissions,
    attendance,
    metrics: {
      totalQuizzes,
      totalAssignments,
      totalAttendance,
      averageQuizScore: Math.round(averageQuizScore * 100) / 100,
      averageAssignmentScore: Math.round(averageAssignmentScore * 100) / 100,
      attendanceRate: Math.round(attendanceRate * 100) / 100
    }
  };

  return res.status(200).json(
    new ResponseConfig(200, "Student performance retrieved successfully", performance)
  );
});

// Delete student profile
const deleteStudentProfile = asyncHandler(async (req, res, next) => {
  const { attendanceNumber } = req.params;
  const { role } = req.loggedInfo;

  if (role !== "ADMIN") {
    return next(new ErrorConfig(403, "Only admins can delete student profiles"));
  }

  const student = await prisma.student.findUnique({
    where: { attendanceNumber }
  });

  if (!student) {
    return next(new ErrorConfig(404, "Student not found"));
  }

  await prisma.student.delete({
    where: { attendanceNumber }
  });

  return res.status(200).json(
    new ResponseConfig(200, "Student profile deleted successfully")
  );
});

export {
  createStudentProfile,
  getStudentByAttendanceNumber,
  getAllStudents,
  updateStudentProfile,
  getStudentPerformance,
  deleteStudentProfile
};
