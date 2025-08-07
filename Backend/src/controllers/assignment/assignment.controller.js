import asyncHandler from "../../helpers/asyncHandler.js";
import ResponseConfig from "../../helpers/responseConfig.js";
import ErrorConfig from "../../helpers/errorConfig.js";
import prisma from "../../lib/dbConnection.js";

// Create assignment
const createAssignment = asyncHandler(async (req, res, next) => {
  const { title, description, courseId, dueDate, maxScore, timeLimit } = req.body;
  const teacherId = req.loggedInfo.id;

  // Validate required fields
  if (!title || !description || !courseId || !dueDate || !maxScore) {
    return next(new ErrorConfig(400, "All required fields must be provided"));
  }

  // Check if course exists and teacher owns it
  const course = await prisma.course.findUnique({
    where: { id: courseId, teacherId }
  });

  if (!course) {
    return next(new ErrorConfig(404, "Course not found or you don't have permission"));
  }

  const assignment = await prisma.assignment.create({
    data: {
      title,
      description,
      courseId,
      teacherId,
      dueDate: new Date(dueDate),
      maxScore: parseFloat(maxScore),
      timeLimit: timeLimit ? parseInt(timeLimit) : null
    },
    include: {
      course: true,
      teacher: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true
        }
      }
    }
  });

  return res.status(201).json(
    new ResponseConfig(201, "Assignment created successfully", assignment)
  );
});

// Get all assignments for a course
const getCourseAssignments = asyncHandler(async (req, res, next) => {
  const { courseId } = req.params;
  const { role, id } = req.loggedInfo;

  // Check if user has access to this course
  let course;
  if (role === "TEACHER" || role === "ADMIN") {
    course = await prisma.course.findFirst({
      where: { id: courseId, teacherId: id }
    });
  } else {
    // For students, check if they're enrolled
    const enrollment = await prisma.enrollment.findUnique({
      where: { userId: id, courseId }
    });
    if (!enrollment) {
      return next(new ErrorConfig(403, "You don't have access to this course"));
    }
    course = await prisma.course.findUnique({ where: { id: courseId } });
  }

  if (!course) {
    return next(new ErrorConfig(404, "Course not found"));
  }

  const assignments = await prisma.assignment.findMany({
    where: { courseId },
    include: {
      course: {
        select: {
          id: true,
          title: true
        }
      },
      teacher: {
        select: {
          id: true,
          firstName: true,
          lastName: true
        }
      },
      submissions: role === "STUDENT" ? {
        where: { studentId: id },
        select: {
          id: true,
          status: true,
          score: true,
          submittedAt: true
        }
      } : false
    },
    orderBy: { createdAt: "desc" }
  });

  return res.status(200).json(
    new ResponseConfig(200, "Assignments retrieved successfully", assignments)
  );
});

// Get assignment by ID
const getAssignmentById = asyncHandler(async (req, res, next) => {
  const { assignmentId } = req.params;
  const { role, id } = req.loggedInfo;

  const assignment = await prisma.assignment.findUnique({
    where: { id: assignmentId },
    include: {
      course: {
        select: {
          id: true,
          title: true,
          teacherId: true
        }
      },
      teacher: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true
        }
      },
      submissions: role === "TEACHER" || role === "ADMIN" ? {
        include: {
          student: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true
            }
          }
        }
      } : {
        where: { studentId: id },
        include: {
          student: {
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

  if (!assignment) {
    return next(new ErrorConfig(404, "Assignment not found"));
  }

  // Check permissions
  if (role === "STUDENT") {
    const enrollment = await prisma.enrollment.findUnique({
      where: { userId: id, courseId: assignment.courseId }
    });
    if (!enrollment) {
      return next(new ErrorConfig(403, "You don't have access to this assignment"));
    }
  } else if (role === "TEACHER" && assignment.teacherId !== id) {
    return next(new ErrorConfig(403, "You don't have permission to view this assignment"));
  }

  return res.status(200).json(
    new ResponseConfig(200, "Assignment retrieved successfully", assignment)
  );
});

// Update assignment
const updateAssignment = asyncHandler(async (req, res, next) => {
  const { assignmentId } = req.params;
  const { title, description, dueDate, maxScore, timeLimit, status } = req.body;
  const teacherId = req.loggedInfo.id;

  const assignment = await prisma.assignment.findUnique({
    where: { id: assignmentId, teacherId }
  });

  if (!assignment) {
    return next(new ErrorConfig(404, "Assignment not found or you don't have permission"));
  }

  const updatedAssignment = await prisma.assignment.update({
    where: { id: assignmentId },
    data: {
      title: title || assignment.title,
      description: description || assignment.description,
      dueDate: dueDate ? new Date(dueDate) : assignment.dueDate,
      maxScore: maxScore ? parseFloat(maxScore) : assignment.maxScore,
      timeLimit: timeLimit ? parseInt(timeLimit) : assignment.timeLimit,
      status: status || assignment.status
    },
    include: {
      course: true,
      teacher: {
        select: {
          id: true,
          firstName: true,
          lastName: true
        }
      }
    }
  });

  return res.status(200).json(
    new ResponseConfig(200, "Assignment updated successfully", updatedAssignment)
  );
});

// Delete assignment
const deleteAssignment = asyncHandler(async (req, res, next) => {
  const { assignmentId } = req.params;
  const teacherId = req.loggedInfo.id;

  const assignment = await prisma.assignment.findUnique({
    where: { id: assignmentId, teacherId }
  });

  if (!assignment) {
    return next(new ErrorConfig(404, "Assignment not found or you don't have permission"));
  }

  await prisma.assignment.delete({
    where: { id: assignmentId }
  });

  return res.status(200).json(
    new ResponseConfig(200, "Assignment deleted successfully")
  );
});

export {
  createAssignment,
  getCourseAssignments,
  getAssignmentById,
  updateAssignment,
  deleteAssignment
};
