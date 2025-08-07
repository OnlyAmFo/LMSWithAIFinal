"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  TrendingUp,
  Calendar,
  BookOpen,
} from "lucide-react";
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

interface Student {
  id: string;
  attendanceNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  grade?: string;
  section?: string;
  rollNumber?: number;
  parentContact?: string;
  emergencyContact?: string;
  performance: {
    averageScore: number;
    totalAssignments: number;
    completedAssignments: number;
    totalQuizzes: number;
    completedQuizzes: number;
    attendancePercentage: number;
    weakSubjects: string[];
    strongSubjects: string[];
  };
  enrolledCourses: string[];
  createdAt: string;
}

const StudentsPage = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Mock data for demonstration
  useEffect(() => {
    const mockStudents: Student[] = [
      {
        id: "1",
        attendanceNumber: "STU001",
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        grade: "10th",
        section: "A",
        rollNumber: 1,
        parentContact: "+1234567890",
        emergencyContact: "+1234567891",
        performance: {
          averageScore: 85.5,
          totalAssignments: 12,
          completedAssignments: 10,
          totalQuizzes: 8,
          completedQuizzes: 7,
          attendancePercentage: 92.5,
          weakSubjects: ["Mathematics", "Physics"],
          strongSubjects: ["English", "History"],
        },
        enrolledCourses: [
          "Web Development Fundamentals",
          "Database Management",
        ],
        createdAt: "2024-01-01T10:00:00Z",
      },
      {
        id: "2",
        attendanceNumber: "STU002",
        firstName: "Jane",
        lastName: "Smith",
        email: "jane.smith@example.com",
        grade: "11th",
        section: "B",
        rollNumber: 15,
        parentContact: "+1234567892",
        emergencyContact: "+1234567893",
        performance: {
          averageScore: 92.3,
          totalAssignments: 12,
          completedAssignments: 12,
          totalQuizzes: 8,
          completedQuizzes: 8,
          attendancePercentage: 98.2,
          weakSubjects: ["Chemistry"],
          strongSubjects: ["Mathematics", "Physics", "English"],
        },
        enrolledCourses: [
          "Advanced JavaScript",
          "Web Development Fundamentals",
        ],
        createdAt: "2024-01-02T11:30:00Z",
      },
      {
        id: "3",
        attendanceNumber: "STU003",
        firstName: "Mike",
        lastName: "Johnson",
        email: "mike.johnson@example.com",
        grade: "10th",
        section: "A",
        rollNumber: 8,
        parentContact: "+1234567894",
        emergencyContact: "+1234567895",
        performance: {
          averageScore: 78.9,
          totalAssignments: 12,
          completedAssignments: 8,
          totalQuizzes: 8,
          completedQuizzes: 6,
          attendancePercentage: 85.7,
          weakSubjects: ["Mathematics", "Physics", "Chemistry"],
          strongSubjects: ["English"],
        },
        enrolledCourses: ["Web Development Fundamentals"],
        createdAt: "2024-01-03T09:15:00Z",
      },
    ];

    setStudents(mockStudents);
    setFilteredStudents(mockStudents);
    setLoading(false);
  }, []);

  // Filter students based on search term and grade
  useEffect(() => {
    let filtered = students;

    if (searchTerm) {
      filtered = filtered.filter(
        (student) =>
          student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.attendanceNumber
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          student.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedGrade !== "all") {
      filtered = filtered.filter((student) => student.grade === selectedGrade);
    }

    setFilteredStudents(filtered);
  }, [students, searchTerm, selectedGrade]);

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-blue-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getAttendanceColor = (percentage: number) => {
    if (percentage >= 95) return "text-green-600";
    if (percentage >= 85) return "text-blue-600";
    if (percentage >= 75) return "text-yellow-600";
    return "text-red-600";
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
        <h1 className="text-3xl font-bold text-gray-900">Students</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Student
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Student</DialogTitle>
            </DialogHeader>
            <CreateStudentForm
              onClose={() => setIsCreateDialogOpen(false)}
              onSuccess={(newStudent) => {
                setStudents([...students, newStudent]);
                setIsCreateDialogOpen(false);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search by name, attendance number, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedGrade} onValueChange={setSelectedGrade}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by grade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Grades</SelectItem>
            <SelectItem value="9th">9th Grade</SelectItem>
            <SelectItem value="10th">10th Grade</SelectItem>
            <SelectItem value="11th">11th Grade</SelectItem>
            <SelectItem value="12th">12th Grade</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Students</TabsTrigger>
          <TabsTrigger value="high-performers">High Performers</TabsTrigger>
          <TabsTrigger value="at-risk">At Risk</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <StudentList students={filteredStudents} />
        </TabsContent>

        <TabsContent value="high-performers" className="mt-6">
          <StudentList
            students={filteredStudents.filter(
              (s) => s.performance.averageScore >= 90
            )}
          />
        </TabsContent>

        <TabsContent value="at-risk" className="mt-6">
          <StudentList
            students={filteredStudents.filter(
              (s) =>
                s.performance.averageScore < 75 ||
                s.performance.attendancePercentage < 80
            )}
          />
        </TabsContent>

        <TabsContent value="attendance" className="mt-6">
          <StudentList
            students={filteredStudents.filter(
              (s) => s.performance.attendancePercentage < 90
            )}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

const StudentList: React.FC<{ students: Student[] }> = ({ students }) => {
  const getPerformanceColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-blue-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getAttendanceColor = (percentage: number) => {
    if (percentage >= 95) return "text-green-600";
    if (percentage >= 85) return "text-blue-600";
    if (percentage >= 75) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="grid gap-6">
      {students.map((student) => (
        <Card key={student.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={`https://ui-avatars.com/api/?name=${student.firstName}+${student.lastName}&background=random`}
                  />
                  <AvatarFallback>
                    {student.firstName[0]}
                    {student.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-xl">
                    {student.firstName} {student.lastName}
                  </CardTitle>
                  <p className="text-sm text-gray-600">
                    Attendance: {student.attendanceNumber}
                  </p>
                  <p className="text-sm text-gray-600">
                    {student.grade} Grade, Section {student.section}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Badge variant="outline">Roll: {student.rollNumber}</Badge>
                <Badge
                  variant={
                    student.performance.averageScore >= 80
                      ? "default"
                      : "secondary"
                  }
                >
                  {student.performance.averageScore >= 80
                    ? "High Performer"
                    : "Needs Attention"}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Average Score</p>
                  <p
                    className={`font-semibold ${getPerformanceColor(
                      student.performance.averageScore
                    )}`}
                  >
                    {student.performance.averageScore}%
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Assignments</p>
                  <p className="font-semibold">
                    {student.performance.completedAssignments}/
                    {student.performance.totalAssignments}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Attendance</p>
                  <p
                    className={`font-semibold ${getAttendanceColor(
                      student.performance.attendancePercentage
                    )}`}
                  >
                    {student.performance.attendancePercentage}%
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Quizzes</p>
                  <p className="font-semibold">
                    {student.performance.completedQuizzes}/
                    {student.performance.totalQuizzes}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">
                  Weak Subjects:
                </p>
                <div className="flex flex-wrap gap-1">
                  {student.performance.weakSubjects.map((subject, index) => (
                    <Badge
                      key={index}
                      variant="destructive"
                      className="text-xs"
                    >
                      {subject}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">
                  Strong Subjects:
                </p>
                <div className="flex flex-wrap gap-1">
                  {student.performance.strongSubjects.map((subject, index) => (
                    <Badge key={index} variant="default" className="text-xs">
                      {subject}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                View Details
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

interface CreateStudentFormProps {
  onClose: () => void;
  onSuccess: (student: Student) => void;
}

const CreateStudentForm: React.FC<CreateStudentFormProps> = ({
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    grade: "",
    section: "",
    rollNumber: "",
    parentContact: "",
    emergencyContact: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newStudent: Student = {
      id: Date.now().toString(),
      attendanceNumber: `STU${String(Date.now()).slice(-3)}`,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      grade: formData.grade,
      section: formData.section,
      rollNumber: parseInt(formData.rollNumber),
      parentContact: formData.parentContact,
      emergencyContact: formData.emergencyContact,
      performance: {
        averageScore: 0,
        totalAssignments: 0,
        completedAssignments: 0,
        totalQuizzes: 0,
        completedQuizzes: 0,
        attendancePercentage: 0,
        weakSubjects: [],
        strongSubjects: [],
      },
      enrolledCourses: [],
      createdAt: new Date().toISOString(),
    };

    onSuccess(newStudent);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            First Name
          </label>
          <Input
            value={formData.firstName}
            onChange={(e) =>
              setFormData({ ...formData, firstName: e.target.value })
            }
            placeholder="First name"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Last Name
          </label>
          <Input
            value={formData.lastName}
            onChange={(e) =>
              setFormData({ ...formData, lastName: e.target.value })
            }
            placeholder="Last name"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <Input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="student@example.com"
          required
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Grade
          </label>
          <Select
            value={formData.grade}
            onValueChange={(value) =>
              setFormData({ ...formData, grade: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select grade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="9th">9th Grade</SelectItem>
              <SelectItem value="10th">10th Grade</SelectItem>
              <SelectItem value="11th">11th Grade</SelectItem>
              <SelectItem value="12th">12th Grade</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Section
          </label>
          <Select
            value={formData.section}
            onValueChange={(value) =>
              setFormData({ ...formData, section: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select section" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="A">Section A</SelectItem>
              <SelectItem value="B">Section B</SelectItem>
              <SelectItem value="C">Section C</SelectItem>
              <SelectItem value="D">Section D</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Roll Number
          </label>
          <Input
            type="number"
            value={formData.rollNumber}
            onChange={(e) =>
              setFormData({ ...formData, rollNumber: e.target.value })
            }
            placeholder="1"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Parent Contact
          </label>
          <Input
            value={formData.parentContact}
            onChange={(e) =>
              setFormData({ ...formData, parentContact: e.target.value })
            }
            placeholder="+1234567890"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Emergency Contact
          </label>
          <Input
            value={formData.emergencyContact}
            onChange={(e) =>
              setFormData({ ...formData, emergencyContact: e.target.value })
            }
            placeholder="+1234567890"
          />
        </div>
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" className="flex-1">
          Add Student
        </Button>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default StudentsPage;
