"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Calendar, Plus, Edit, Trash2, Eye } from "lucide-react";
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

interface Assignment {
  id: string;
  title: string;
  description: string;
  courseId: string;
  courseTitle?: string;
  dueDate: string;
  maxScore: number;
  status: "DRAFT" | "PUBLISHED" | "CLOSED";
  submissionsCount?: number;
  createdAt: string;
}

interface Course {
  id: string;
  title: string;
}

const AssignmentsPage = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(
    null
  );

  // Mock data for demonstration
  useEffect(() => {
    const mockAssignments: Assignment[] = [
      {
        id: "1",
        title: "Introduction to React",
        description: "Create a simple React component with state management",
        courseId: "1",
        courseTitle: "Web Development Fundamentals",
        dueDate: "2024-01-15T23:59:00Z",
        maxScore: 100,
        status: "PUBLISHED",
        submissionsCount: 15,
        createdAt: "2024-01-01T10:00:00Z",
      },
      {
        id: "2",
        title: "Database Design Project",
        description: "Design and implement a normalized database schema",
        courseId: "2",
        courseTitle: "Database Management",
        dueDate: "2024-01-20T23:59:00Z",
        maxScore: 150,
        status: "DRAFT",
        submissionsCount: 0,
        createdAt: "2024-01-05T14:30:00Z",
      },
      {
        id: "3",
        title: "API Integration Assignment",
        description: "Integrate external APIs into your application",
        courseId: "1",
        courseTitle: "Web Development Fundamentals",
        dueDate: "2024-01-25T23:59:00Z",
        maxScore: 120,
        status: "PUBLISHED",
        submissionsCount: 8,
        createdAt: "2024-01-10T09:15:00Z",
      },
    ];

    const mockCourses: Course[] = [
      { id: "1", title: "Web Development Fundamentals" },
      { id: "2", title: "Database Management" },
      { id: "3", title: "Advanced JavaScript" },
    ];

    setAssignments(mockAssignments);
    setCourses(mockCourses);
    setLoading(false);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PUBLISHED":
        return "bg-green-100 text-green-800";
      case "DRAFT":
        return "bg-yellow-100 text-yellow-800";
      case "CLOSED":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Assignments</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Assignment
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Assignment</DialogTitle>
            </DialogHeader>
            <CreateAssignmentForm
              courses={courses}
              onClose={() => setIsCreateDialogOpen(false)}
              onSuccess={(newAssignment) => {
                setAssignments([...assignments, newAssignment]);
                setIsCreateDialogOpen(false);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {assignments.map((assignment) => (
          <Card
            key={assignment.id}
            className="hover:shadow-lg transition-shadow"
          >
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{assignment.title}</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    Course: {assignment.courseTitle}
                  </p>
                </div>
                <Badge className={getStatusColor(assignment.status)}>
                  {assignment.status}
                </Badge>
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
                <div className="text-sm text-gray-600">
                  Submissions: {assignment.submissionsCount || 0}
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  View
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
    </div>
  );
};

interface CreateAssignmentFormProps {
  courses: Course[];
  onClose: () => void;
  onSuccess: (assignment: Assignment) => void;
}

const CreateAssignmentForm: React.FC<CreateAssignmentFormProps> = ({
  courses,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    courseId: "",
    dueDate: "",
    maxScore: "",
    status: "DRAFT",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newAssignment: Assignment = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      courseId: formData.courseId,
      courseTitle: courses.find((c) => c.id === formData.courseId)?.title,
      dueDate: formData.dueDate,
      maxScore: parseFloat(formData.maxScore),
      status: formData.status as "DRAFT" | "PUBLISHED" | "CLOSED",
      submissionsCount: 0,
      createdAt: new Date().toISOString(),
    };

    onSuccess(newAssignment);
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
          placeholder="Assignment title"
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
          placeholder="Assignment description"
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
          Due Date
        </label>
        <Input
          type="datetime-local"
          value={formData.dueDate}
          onChange={(e) =>
            setFormData({ ...formData, dueDate: e.target.value })
          }
          required
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

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Status
        </label>
        <Select
          value={formData.status}
          onValueChange={(value) => setFormData({ ...formData, status: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="DRAFT">Draft</SelectItem>
            <SelectItem value="PUBLISHED">Published</SelectItem>
            <SelectItem value="CLOSED">Closed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" className="flex-1">
          Create Assignment
        </Button>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default AssignmentsPage;
