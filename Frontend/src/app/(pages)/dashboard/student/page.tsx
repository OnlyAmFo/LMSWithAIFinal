"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Calendar,
  BookOpen,
  Clock,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Assignment {
  id: string;
  title: string;
  description: string;
  courseTitle: string;
  dueDate: string;
  maxScore: number;
  status: "NOT_SUBMITTED" | "SUBMITTED" | "GRADED" | "LATE";
  score?: number;
  submittedAt?: string;
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  courseTitle: string;
  quizType: string;
  timeLimit?: number;
  maxScore: number;
  isActive: boolean;
  score?: number;
  completedAt?: string;
  isAIGenerated?: boolean;
}

interface Performance {
  averageScore: number;
  totalAssignments: number;
  completedAssignments: number;
  totalQuizzes: number;
  completedQuizzes: number;
  attendancePercentage: number;
  weakSubjects: string[];
  strongSubjects: string[];
  recentProgress: {
    date: string;
    score: number;
    type: "assignment" | "quiz";
  }[];
}

const StudentDashboard = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [performance, setPerformance] = useState<Performance | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration
  useEffect(() => {
    const mockAssignments: Assignment[] = [
      {
        id: "1",
        title: "Introduction to React",
        description: "Create a simple React component with state management",
        courseTitle: "Web Development Fundamentals",
        dueDate: "2024-01-15T23:59:00Z",
        maxScore: 100,
        status: "GRADED",
        score: 85,
        submittedAt: "2024-01-14T10:30:00Z",
      },
      {
        id: "2",
        title: "Database Design Project",
        description: "Design and implement a normalized database schema",
        courseTitle: "Database Management",
        dueDate: "2024-01-20T23:59:00Z",
        maxScore: 150,
        status: "SUBMITTED",
        submittedAt: "2024-01-19T15:45:00Z",
      },
      {
        id: "3",
        title: "API Integration Assignment",
        description: "Integrate external APIs into your application",
        courseTitle: "Web Development Fundamentals",
        dueDate: "2024-01-25T23:59:00Z",
        maxScore: 120,
        status: "NOT_SUBMITTED",
      },
    ];

    const mockQuizzes: Quiz[] = [
      {
        id: "1",
        title: "JavaScript Fundamentals Quiz",
        description: "Test your knowledge of JavaScript basics",
        courseTitle: "Web Development Fundamentals",
        quizType: "MULTIPLE_CHOICE",
        timeLimit: 30,
        maxScore: 100,
        isActive: true,
        score: 92,
        completedAt: "2024-01-10T14:20:00Z",
      },
      {
        id: "2",
        title: "AI-Generated: Database Concepts",
        description: "Personalized quiz based on weak subjects",
        courseTitle: "Database Management",
        quizType: "MIXED",
        timeLimit: 45,
        maxScore: 150,
        isActive: true,
        isAIGenerated: true,
      },
      {
        id: "3",
        title: "React State Management",
        description: "Advanced concepts in React state management",
        courseTitle: "Web Development Fundamentals",
        quizType: "MULTIPLE_CHOICE",
        timeLimit: 60,
        maxScore: 120,
        isActive: false,
        score: 78,
        completedAt: "2024-01-12T09:15:00Z",
      },
    ];

    const mockPerformance: Performance = {
      averageScore: 85.5,
      totalAssignments: 12,
      completedAssignments: 10,
      totalQuizzes: 8,
      completedQuizzes: 7,
      attendancePercentage: 92.5,
      weakSubjects: ["Mathematics", "Physics"],
      strongSubjects: ["English", "History", "JavaScript"],
      recentProgress: [
        { date: "2024-01-10", score: 92, type: "quiz" },
        { date: "2024-01-12", score: 78, type: "quiz" },
        { date: "2024-01-14", score: 85, type: "assignment" },
        { date: "2024-01-15", score: 88, type: "assignment" },
      ],
    };

    setAssignments(mockAssignments);
    setQuizzes(mockQuizzes);
    setPerformance(mockPerformance);
    setLoading(false);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "GRADED":
        return "bg-green-100 text-green-800";
      case "SUBMITTED":
        return "bg-blue-100 text-blue-800";
      case "NOT_SUBMITTED":
        return "bg-yellow-100 text-yellow-800";
      case "LATE":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "GRADED":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "SUBMITTED":
        return <Clock className="h-4 w-4 text-blue-600" />;
      case "NOT_SUBMITTED":
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case "LATE":
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Student Dashboard
      </h1>

      {/* Performance Overview */}
      {performance && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Average Score
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {performance.averageScore}%
              </div>
              <Progress value={performance.averageScore} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Assignments</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {performance.completedAssignments}/
                {performance.totalAssignments}
              </div>
              <Progress
                value={
                  (performance.completedAssignments /
                    performance.totalAssignments) *
                  100
                }
                className="mt-2"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Quizzes</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {performance.completedQuizzes}/{performance.totalQuizzes}
              </div>
              <Progress
                value={
                  (performance.completedQuizzes / performance.totalQuizzes) *
                  100
                }
                className="mt-2"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Attendance</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {performance.attendancePercentage}%
              </div>
              <Progress
                value={performance.attendancePercentage}
                className="mt-2"
              />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Subject Analysis */}
      {performance && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Strong Subjects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {performance.strongSubjects.map((subject, index) => (
                  <Badge key={index} variant="default">
                    {subject}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Areas for Improvement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {performance.weakSubjects.map((subject, index) => (
                  <Badge key={index} variant="destructive">
                    {subject}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="assignments" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
          <TabsTrigger value="progress">Recent Progress</TabsTrigger>
        </TabsList>

        <TabsContent value="assignments" className="mt-6">
          <div className="grid gap-6">
            {assignments.map((assignment) => (
              <Card
                key={assignment.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">
                        {assignment.title}
                      </CardTitle>
                      <p className="text-sm text-gray-600 mt-1">
                        Course: {assignment.courseTitle}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(assignment.status)}
                      <Badge className={getStatusColor(assignment.status)}>
                        {assignment.status.replace("_", " ")}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">{assignment.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        Due: {formatDate(assignment.dueDate)}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      Max Score: {assignment.maxScore} points
                    </div>
                    {assignment.score && (
                      <div className="text-sm text-gray-600">
                        Your Score: {assignment.score}/{assignment.maxScore}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    {assignment.status === "NOT_SUBMITTED" && (
                      <Button size="sm">Submit Assignment</Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="quizzes" className="mt-6">
          <div className="grid gap-6">
            {quizzes.map((quiz) => (
              <Card key={quiz.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-xl">{quiz.title}</CardTitle>
                      {quiz.isAIGenerated && (
                        <Badge variant="outline" className="text-xs">
                          AI Generated
                        </Badge>
                      )}
                    </div>
                    <Badge variant={quiz.isActive ? "default" : "secondary"}>
                      {quiz.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Course: {quiz.courseTitle}
                  </p>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">{quiz.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {quiz.timeLimit || "No"} min
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      Max Score: {quiz.maxScore} points
                    </div>
                    {quiz.score && (
                      <div className="text-sm text-gray-600">
                        Your Score: {quiz.score}/{quiz.maxScore}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    {quiz.isActive && !quiz.completedAt && (
                      <Button size="sm">Start Quiz</Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="progress" className="mt-6">
          {performance && (
            <Card>
              <CardHeader>
                <CardTitle>Recent Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {performance.recentProgress.map((progress, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-full ${
                            progress.type === "quiz"
                              ? "bg-blue-100"
                              : "bg-green-100"
                          }`}
                        >
                          {progress.type === "quiz" ? (
                            <BookOpen className="h-4 w-4 text-blue-600" />
                          ) : (
                            <BookOpen className="h-4 w-4 text-green-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium capitalize">
                            {progress.type}
                          </p>
                          <p className="text-sm text-gray-600">
                            {progress.date}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{progress.score}%</p>
                        <p className="text-sm text-gray-600">Score</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentDashboard;
