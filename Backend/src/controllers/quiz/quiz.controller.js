import asyncHandler from "../../helpers/asyncHandler.js";
import ResponseConfig from "../../helpers/responseConfig.js";
import ErrorConfig from "../../helpers/errorConfig.js";
import prisma from "../../lib/dbConnection.js";
import axios from "axios";

// Generate AI-powered quiz based on weak subjects
const generateAIQuiz = asyncHandler(async (req, res, next) => {
  const { courseId, studentId, weakSubjects, quizType, timeLimit } = req.body;
  const teacherId = req.loggedInfo.id;

  // Validate required fields
  if (!courseId || !studentId || !weakSubjects || !quizType) {
    return next(new ErrorConfig(400, "Course ID, student ID, weak subjects, and quiz type are required"));
  }

  // Check if course exists and teacher owns it
  const course = await prisma.course.findUnique({
    where: { id: courseId, teacherId }
  });

  if (!course) {
    return next(new ErrorConfig(404, "Course not found or you don't have permission"));
  }

  // Check if student is enrolled in the course
  const enrollment = await prisma.enrollment.findUnique({
    where: { userId: studentId, courseId }
  });

  if (!enrollment) {
    return next(new ErrorConfig(404, "Student is not enrolled in this course"));
  }

  try {
    // Call AI service to generate quiz questions based on weak subjects
    const aiResponse = await axios.post(`${process.env.AI_SERVICE_URL || 'http://localhost:8001'}/generate-quiz`, {
      weak_subjects: weakSubjects,
      quiz_type: quizType,
      course_title: course.title,
      difficulty_level: "adaptive" // AI will determine based on student performance
    });

    const aiQuizData = aiResponse.data;

    // Create quiz in database
    const quiz = await prisma.quiz.create({
      data: {
        title: `AI-Generated Quiz: ${weakSubjects.join(", ")}`,
        description: `Personalized quiz based on weak subjects: ${weakSubjects.join(", ")}`,
        courseId,
        teacherId,
        quizType,
        questions: aiQuizData.questions,
        timeLimit: timeLimit || 30, // Default 30 minutes
        maxScore: aiQuizData.max_score || 100
      },
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
        }
      }
    });

    return res.status(201).json(
      new ResponseConfig(201, "AI-powered quiz generated successfully", quiz)
    );

  } catch (error) {
    console.error("AI Quiz Generation Error:", error);
    
    // Fallback: Create a basic quiz if AI service fails
    const fallbackQuiz = await prisma.quiz.create({
      data: {
        title: `Quiz: ${weakSubjects.join(", ")}`,
        description: `Quiz covering weak subjects: ${weakSubjects.join(", ")}`,
        courseId,
        teacherId,
        quizType,
        questions: {
          questions: [
            {
              question: "What is the main topic of this subject?",
              type: "multiple_choice",
              options: ["Option A", "Option B", "Option C", "Option D"],
              correct_answer: 0,
              points: 10
            }
          ]
        },
        timeLimit: timeLimit || 30,
        maxScore: 100
      },
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
        }
      }
    });

    return res.status(201).json(
      new ResponseConfig(201, "Quiz created successfully (fallback)", fallbackQuiz)
    );
  }
});

// Create manual quiz
const createQuiz = asyncHandler(async (req, res, next) => {
  const { title, description, courseId, quizType, questions, timeLimit, maxScore } = req.body;
  const teacherId = req.loggedInfo.id;

  // Validate required fields
  if (!title || !description || !courseId || !quizType || !questions) {
    return next(new ErrorConfig(400, "All required fields must be provided"));
  }

  // Check if course exists and teacher owns it
  const course = await prisma.course.findUnique({
    where: { id: courseId, teacherId }
  });

  if (!course) {
    return next(new ErrorConfig(404, "Course not found or you don't have permission"));
  }

  const quiz = await prisma.quiz.create({
    data: {
      title,
      description,
      courseId,
      teacherId,
      quizType,
      questions,
      timeLimit: timeLimit || null,
      maxScore: maxScore || 100
    },
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
      }
    }
  });

  return res.status(201).json(
    new ResponseConfig(201, "Quiz created successfully", quiz)
  );
});

// Get all quizzes for a course
const getCourseQuizzes = asyncHandler(async (req, res, next) => {
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

  const quizzes = await prisma.quiz.findMany({
    where: { courseId, isActive: true },
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
      attempts: role === "STUDENT" ? {
        where: { studentId: id },
        select: {
          id: true,
          score: true,
          completedAt: true
        }
      } : false
    },
    orderBy: { createdAt: "desc" }
  });

  return res.status(200).json(
    new ResponseConfig(200, "Quizzes retrieved successfully", quizzes)
  );
});

// Get quiz by ID
const getQuizById = asyncHandler(async (req, res, next) => {
  const { quizId } = req.params;
  const { role, id } = req.loggedInfo;

  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
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
          lastName: true
        }
      },
      attempts: role === "STUDENT" ? {
        where: { studentId: id },
        select: {
          id: true,
          score: true,
          completedAt: true,
          timeTaken: true
        }
      } : {
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
      }
    }
  });

  if (!quiz) {
    return next(new ErrorConfig(404, "Quiz not found"));
  }

  // Check permissions
  if (role === "STUDENT") {
    const enrollment = await prisma.enrollment.findUnique({
      where: { userId: id, courseId: quiz.courseId }
    });
    if (!enrollment) {
      return next(new ErrorConfig(403, "You don't have access to this quiz"));
    }
  } else if (role === "TEACHER" && quiz.teacherId !== id) {
    return next(new ErrorConfig(403, "You don't have permission to view this quiz"));
  }

  return res.status(200).json(
    new ResponseConfig(200, "Quiz retrieved successfully", quiz)
  );
});

// Submit quiz attempt
const submitQuizAttempt = asyncHandler(async (req, res, next) => {
  const { quizId } = req.params;
  const { answers, timeTaken } = req.body;
  const studentId = req.loggedInfo.id;

  // Check if quiz exists and is active
  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId, isActive: true }
  });

  if (!quiz) {
    return next(new ErrorConfig(404, "Quiz not found or inactive"));
  }

  // Check if student is enrolled in the course
  const enrollment = await prisma.enrollment.findUnique({
    where: { userId: studentId, courseId: quiz.courseId }
  });

  if (!enrollment) {
    return next(new ErrorConfig(403, "You don't have access to this quiz"));
  }

  // Check if student has already attempted this quiz
  const existingAttempt = await prisma.quizAttempt.findFirst({
    where: { quizId, studentId }
  });

  if (existingAttempt) {
    return next(new ErrorConfig(400, "You have already attempted this quiz"));
  }

  // Calculate score based on answers
  let score = 0;
  const questions = quiz.questions.questions || [];
  
  questions.forEach((question, index) => {
    if (answers[index] === question.correct_answer) {
      score += question.points || 10;
    }
  });

  const attempt = await prisma.quizAttempt.create({
    data: {
      quizId,
      studentId,
      answers,
      score,
      timeTaken,
      completedAt: new Date()
    },
    include: {
      quiz: {
        select: {
          id: true,
          title: true,
          maxScore: true
        }
      },
      student: {
        select: {
          id: true,
          firstName: true,
          lastName: true
        }
      }
    }
  });

  return res.status(201).json(
    new ResponseConfig(201, "Quiz attempt submitted successfully", attempt)
  );
});

// Update quiz
const updateQuiz = asyncHandler(async (req, res, next) => {
  const { quizId } = req.params;
  const { title, description, questions, timeLimit, maxScore, isActive } = req.body;
  const teacherId = req.loggedInfo.id;

  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId, teacherId }
  });

  if (!quiz) {
    return next(new ErrorConfig(404, "Quiz not found or you don't have permission"));
  }

  const updatedQuiz = await prisma.quiz.update({
    where: { id: quizId },
    data: {
      title: title || quiz.title,
      description: description || quiz.description,
      questions: questions || quiz.questions,
      timeLimit: timeLimit !== undefined ? parseInt(timeLimit) : quiz.timeLimit,
      maxScore: maxScore ? parseFloat(maxScore) : quiz.maxScore,
      isActive: isActive !== undefined ? isActive : quiz.isActive
    },
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
      }
    }
  });

  return res.status(200).json(
    new ResponseConfig(200, "Quiz updated successfully", updatedQuiz)
  );
});

// Delete quiz
const deleteQuiz = asyncHandler(async (req, res, next) => {
  const { quizId } = req.params;
  const teacherId = req.loggedInfo.id;

  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId, teacherId }
  });

  if (!quiz) {
    return next(new ErrorConfig(404, "Quiz not found or you don't have permission"));
  }

  await prisma.quiz.delete({
    where: { id: quizId }
  });

  return res.status(200).json(
    new ResponseConfig(200, "Quiz deleted successfully")
  );
});

export {
  generateAIQuiz,
  createQuiz,
  getCourseQuizzes,
  getQuizById,
  submitQuizAttempt,
  updateQuiz,
  deleteQuiz
};
