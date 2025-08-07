"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Brain, Plus, Edit, Trash2, Eye, Play, Clock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Quiz {
  id: string;
  title: string;
  description: string;
  courseId: string;
  courseTitle?: string;
  quizType:
    | "MULTIPLE_CHOICE"
    | "TRUE_FALSE"
    | "SHORT_ANSWER"
    | "ESSAY"
    | "MIXED";
  questions: any[];
  timeLimit?: number;
  maxScore: number;
  isActive: boolean;
  attemptsCount?: number;
  createdAt: string;
  isAIGenerated?: boolean;
}

interface Course {
  id: string;
  title: string;
}

interface AIQuizRequest {
  weak_subjects: string[];
  quiz_type: string;
  course_title: string;
  difficulty_level: string;
}

const QuizzesPage = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isAIGenerateDialogOpen, setIsAIGenerateDialogOpen] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);

  // Mock data for demonstration
  useEffect(() => {
    const mockQuizzes: Quiz[] = [
      {
        id: "1",
        title: "JavaScript Fundamentals Quiz",
        description: "Test your knowledge of JavaScript basics",
        courseId: "1",
        courseTitle: "Web Development Fundamentals",
        quizType: "MULTIPLE_CHOICE",
        questions: [
          {
            question:
              "What is the correct way to declare a variable in JavaScript?",
            options: [
              "var x = 5;",
              "variable x = 5;",
              "v x = 5;",
              "declare x = 5;",
            ],
            correct_answer: 0,
            points: 10,
          },
        ],
        timeLimit: 30,
        maxScore: 100,
        isActive: true,
        attemptsCount: 25,
        createdAt: "2024-01-01T10:00:00Z",
      },
      {
        id: "2",
        title: "AI-Generated: Database Concepts",
        description: "Personalized quiz based on weak subjects",
        courseId: "2",
        courseTitle: "Database Management",
        quizType: "MIXED",
        questions: [],
        timeLimit: 45,
        maxScore: 150,
        isActive: true,
        attemptsCount: 12,
        createdAt: "2024-01-05T14:30:00Z",
        isAIGenerated: true,
      },
      {
        id: "3",
        title: "React State Management",
        description: "Advanced concepts in React state management",
        courseId: "1",
        courseTitle: "Web Development Fundamentals",
        quizType: "MULTIPLE_CHOICE",
        questions: [],
        timeLimit: 60,
        maxScore: 120,
        isActive: false,
        attemptsCount: 8,
        createdAt: "2024-01-10T09:15:00Z",
      },
    ];

    const mockCourses: Course[] = [
      { id: "1", title: "Web Development Fundamentals" },
      { id: "2", title: "Database Management" },
      { id: "3", title: "Advanced JavaScript" },
    ];

    setQuizzes(mockQuizzes);
    setCourses(mockCourses);
    setLoading(false);
  }, []);

  const getQuizTypeColor = (type: string) => {
    switch (type) {
      case "MULTIPLE_CHOICE":
        return "bg-blue-100 text-blue-800";
      case "TRUE_FALSE":
        return "bg-green-100 text-green-800";
      case "SHORT_ANSWER":
        return "bg-yellow-100 text-yellow-800";
      case "ESSAY":
        return "bg-purple-100 text-purple-800";
      case "MIXED":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const generateAIQuiz = async (request: AIQuizRequest) => {
    setAiGenerating(true);

    try {
      // Simulate AI quiz generation
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const newQuiz: Quiz = {
        id: Date.now().toString(),
        title: `AI-Generated: ${request.course_title} Quiz`,
        description: `Personalized quiz based on weak subjects: ${request.weak_subjects.join(
          ", "
        )}`,
        courseId:
          courses.find((c) => c.title === request.course_title)?.id || "1",
        courseTitle: request.course_title,
        quizType: request.quiz_type.toUpperCase() as any,
        questions: [
          {
            question: `Question about ${request.weak_subjects[0]}: What is the main concept?`,
            options: ["Option A", "Option B", "Option C", "Option D"],
            correct_answer: 0,
            points: 10,
          },
        ],
        timeLimit: 30,
        maxScore: 100,
        isActive: true,
        attemptsCount: 0,
        createdAt: new Date().toISOString(),
        isAIGenerated: true,
      };

      setQuizzes([...quizzes, newQuiz]);
      setIsAIGenerateDialogOpen(false);
    } catch (error) {
      console.error("Failed to generate AI quiz:", error);
    } finally {
      setAiGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Quizzes</h1>
        <div className="flex gap-2">
          <Dialog
            open={isAIGenerateDialogOpen}
            onOpenChange={setIsAIGenerateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Brain className="h-4 w-4" />
                AI Generate
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Generate AI Quiz</DialogTitle>
              </DialogHeader>
              <AIGenerateQuizForm
                courses={courses}
                onClose={() => setIsAIGenerateDialogOpen(false)}
                onGenerate={generateAIQuiz}
                generating={aiGenerating}
              />
            </DialogContent>
          </Dialog>

          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create Quiz
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Quiz</DialogTitle>
              </DialogHeader>
              <CreateQuizForm
                courses={courses}
                onClose={() => setIsCreateDialogOpen(false)}
                onSuccess={(newQuiz) => {
                  setQuizzes([...quizzes, newQuiz]);
                  setIsCreateDialogOpen(false);
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All Quizzes</TabsTrigger>
          <TabsTrigger value="ai">AI Generated</TabsTrigger>
          <TabsTrigger value="manual">Manual</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <QuizList quizzes={quizzes} />
        </TabsContent>

        <TabsContent value="ai" className="mt-6">
          <QuizList quizzes={quizzes.filter((q) => q.isAIGenerated)} />
        </TabsContent>

        <TabsContent value="manual" className="mt-6">
          <QuizList quizzes={quizzes.filter((q) => !q.isAIGenerated)} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

const QuizList: React.FC<{ quizzes: Quiz[] }> = ({ quizzes }) => {
  const getQuizTypeColor = (type: string) => {
    switch (type) {
      case "MULTIPLE_CHOICE":
        return "bg-blue-100 text-blue-800";
      case "TRUE_FALSE":
        return "bg-green-100 text-green-800";
      case "SHORT_ANSWER":
        return "bg-yellow-100 text-yellow-800";
      case "ESSAY":
        return "bg-purple-100 text-purple-800";
      case "MIXED":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="grid gap-6">
      {quizzes.map((quiz) => (
        <Card key={quiz.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <CardTitle className="text-xl">{quiz.title}</CardTitle>
                {quiz.isAIGenerated && (
                  <Brain className="h-4 w-4 text-blue-600" />
                )}
              </div>
              <div className="flex gap-2">
                <Badge className={getQuizTypeColor(quiz.quizType)}>
                  {quiz.quizType.replace("_", " ")}
                </Badge>
                <Badge variant={quiz.isActive ? "default" : "secondary"}>
                  {quiz.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Course: {quiz.courseTitle}
            </p>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">{quiz.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  {quiz.timeLimit || "No"} min
                </span>
              </div>
              <div className="text-sm text-gray-600">
                Max Score: {quiz.maxScore} points
              </div>
              <div className="text-sm text-gray-600">
                Questions: {quiz.questions.length}
              </div>
              <div className="text-sm text-gray-600">
                Attempts: {quiz.attemptsCount || 0}
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                View
              </Button>
              <Button variant="outline" size="sm">
                <Play className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

interface CreateQuizFormProps {
  courses: Course[];
  onClose: () => void;
  onSuccess: (quiz: Quiz) => void;
}

const CreateQuizForm: React.FC<CreateQuizFormProps> = ({
  courses,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    courseId: "",
    quizType: "MULTIPLE_CHOICE",
    timeLimit: "",
    maxScore: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newQuiz: Quiz = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      courseId: formData.courseId,
      courseTitle: courses.find((c) => c.id === formData.courseId)?.title,
      quizType: formData.quizType as any,
      questions: [],
      timeLimit: formData.timeLimit ? parseInt(formData.timeLimit) : undefined,
      maxScore: parseFloat(formData.maxScore),
      isActive: true,
      attemptsCount: 0,
      createdAt: new Date().toISOString(),
    };

    onSuccess(newQuiz);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Title
        </label>
        <Input
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Quiz title"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <Textarea
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Quiz description"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Course
        </label>
        <Select
          value={formData.courseId}
          onValueChange={(value) =>
            setFormData({ ...formData, courseId: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a course" />
          </SelectTrigger>
          <SelectContent>
            {courses.map((course) => (
              <SelectItem key={course.id} value={course.id}>
                {course.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Quiz Type
        </label>
        <Select
          value={formData.quizType}
          onValueChange={(value) =>
            setFormData({ ...formData, quizType: value })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="MULTIPLE_CHOICE">Multiple Choice</SelectItem>
            <SelectItem value="TRUE_FALSE">True/False</SelectItem>
            <SelectItem value="SHORT_ANSWER">Short Answer</SelectItem>
            <SelectItem value="ESSAY">Essay</SelectItem>
            <SelectItem value="MIXED">Mixed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Time Limit (minutes)
        </label>
        <Input
          type="number"
          value={formData.timeLimit}
          onChange={(e) =>
            setFormData({ ...formData, timeLimit: e.target.value })
          }
          placeholder="30"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Max Score
        </label>
        <Input
          type="number"
          value={formData.maxScore}
          onChange={(e) =>
            setFormData({ ...formData, maxScore: e.target.value })
          }
          placeholder="100"
          required
        />
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" className="flex-1">
          Create Quiz
        </Button>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

interface AIGenerateQuizFormProps {
  courses: Course[];
  onClose: () => void;
  onGenerate: (request: AIQuizRequest) => void;
  generating: boolean;
}

const AIGenerateQuizForm: React.FC<AIGenerateQuizFormProps> = ({
  courses,
  onClose,
  onGenerate,
  generating,
}) => {
  const [formData, setFormData] = useState({
    weak_subjects: ["JavaScript", "React", "State Management"],
    quiz_type: "MULTIPLE_CHOICE",
    course_title: "",
    difficulty_level: "MEDIUM",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Course
        </label>
        <Select
          value={formData.course_title}
          onValueChange={(value) =>
            setFormData({ ...formData, course_title: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a course" />
          </SelectTrigger>
          <SelectContent>
            {courses.map((course) => (
              <SelectItem key={course.id} value={course.title}>
                {course.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Weak Subjects (comma-separated)
        </label>
        <Input
          value={formData.weak_subjects.join(", ")}
          onChange={(e) =>
            setFormData({
              ...formData,
              weak_subjects: e.target.value.split(",").map((s) => s.trim()),
            })
          }
          placeholder="JavaScript, React, State Management"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Quiz Type
        </label>
        <Select
          value={formData.quiz_type}
          onValueChange={(value) =>
            setFormData({ ...formData, quiz_type: value })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="MULTIPLE_CHOICE">Multiple Choice</SelectItem>
            <SelectItem value="TRUE_FALSE">True/False</SelectItem>
            <SelectItem value="SHORT_ANSWER">Short Answer</SelectItem>
            <SelectItem value="MIXED">Mixed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Difficulty Level
        </label>
        <Select
          value={formData.difficulty_level}
          onValueChange={(value) =>
            setFormData({ ...formData, difficulty_level: value })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="EASY">Easy</SelectItem>
            <SelectItem value="MEDIUM">Medium</SelectItem>
            <SelectItem value="HARD">Hard</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" className="flex-1" disabled={generating}>
          {generating ? "Generating..." : "Generate AI Quiz"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={generating}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default QuizzesPage;
