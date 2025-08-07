import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export interface StudentScore {
  topic: string;
  score: number;
  maxScore: number;
  date: string;
  assignmentType: string;
}

export interface PerformanceAnalysis {
  student_id: string;
  overall_performance: number;
  performance_level: string;
  weak_topics: string[];
  strong_topics: string[];
  trends: {
    trend_direction: string;
    trend_strength: string;
    recent_performance: number;
  };
  suggestions: string[];
  risk_level: string;
  confidence_score: number;
}

export interface ClassPerformance {
  class_id: string;
  average_performance: number;
  performance_distribution: {
    excellent: number;
    good: number;
    average: number;
    struggling: number;
    poor: number;
  };
  top_performers: Array<{
    student_id: string;
    performance: number;
  }>;
  weak_topics: string[];
  strong_topics: string[];
  recommendations: string[];
}

export interface AtRiskStudent {
  student_id: string;
  overall_performance: number;
  risk_level: string;
  weak_topics: string[];
  risk_factors: string[];
  intervention_suggestions: string[];
  last_assessment_date: string;
}

// Dynamic mock data based on student ID
const getMockStudentPerformance = (studentId: string): PerformanceAnalysis => {
  const mockDataByStudent: Record<string, PerformanceAnalysis> = {
    "student1": {
      student_id: studentId,
      overall_performance: 82.5,
      performance_level: "good",
      weak_topics: ["Physics"],
      strong_topics: ["Mathematics", "Chemistry"],
      trends: {
        trend_direction: "improving",
        trend_strength: "moderate",
        recent_performance: 85
      },
      risk_level: "low",
      confidence_score: 87,
      suggestions: [
        "Focus on Physics fundamentals",
        "Practice more problem-solving",
        "Review previous assignments"
      ]
    },
    "student2": {
      student_id: studentId,
      overall_performance: 75.0,
      performance_level: "average",
      weak_topics: ["Mathematics", "Physics"],
      strong_topics: ["Chemistry"],
      trends: {
        trend_direction: "stable",
        trend_strength: "weak",
        recent_performance: 72
      },
      risk_level: "medium",
      confidence_score: 78,
      suggestions: [
        "Need more practice in Mathematics",
        "Focus on Physics concepts",
        "Consider additional tutoring"
      ]
    },
    "student3": {
      student_id: studentId,
      overall_performance: 95.5,
      performance_level: "excellent",
      weak_topics: [],
      strong_topics: ["Mathematics", "Physics", "Chemistry"],
      trends: {
        trend_direction: "improving",
        trend_strength: "strong",
        recent_performance: 98
      },
      risk_level: "low",
      confidence_score: 95,
      suggestions: [
        "Continue excellent work",
        "Consider advanced topics",
        "Help peers with difficult concepts"
      ]
    },
    "student4": {
      student_id: studentId,
      overall_performance: 65.0,
      performance_level: "struggling",
      weak_topics: ["Mathematics", "Physics", "Chemistry"],
      strong_topics: [],
      trends: {
        trend_direction: "declining",
        trend_strength: "strong",
        recent_performance: 60
      },
      risk_level: "high",
      confidence_score: 72,
      suggestions: [
        "Immediate intervention needed",
        "Schedule one-on-one tutoring",
        "Review basic concepts",
        "Consider study group participation"
      ]
    },
    "student5": {
      student_id: studentId,
      overall_performance: 88.0,
      performance_level: "good",
      weak_topics: ["Chemistry"],
      strong_topics: ["Mathematics", "Physics"],
      trends: {
        trend_direction: "improving",
        trend_strength: "moderate",
        recent_performance: 90
      },
      risk_level: "low",
      confidence_score: 85,
      suggestions: [
        "Focus on Chemistry lab work",
        "Practice chemical equations",
        "Review periodic table concepts"
      ]
    },
    "class1_student1": {
      student_id: studentId,
      overall_performance: 79.5,
      performance_level: "good",
      weak_topics: ["Physics"],
      strong_topics: ["Mathematics", "English"],
      trends: {
        trend_direction: "stable",
        trend_strength: "moderate",
        recent_performance: 82
      },
      risk_level: "low",
      confidence_score: 81,
      suggestions: [
        "Work on Physics problem-solving",
        "Practice mathematical applications",
        "Continue strong performance in other subjects"
      ]
    },
    "class1_student2": {
      student_id: studentId,
      overall_performance: 71.0,
      performance_level: "average",
      weak_topics: ["Mathematics", "Physics"],
      strong_topics: ["English", "History"],
      trends: {
        trend_direction: "declining",
        trend_strength: "moderate",
        recent_performance: 68
      },
      risk_level: "medium",
      confidence_score: 74,
      suggestions: [
        "Focus on Mathematics fundamentals",
        "Get help with Physics concepts",
        "Leverage strength in humanities subjects"
      ]
    },
    "class2_student1": {
      student_id: studentId,
      overall_performance: 92.5,
      performance_level: "excellent",
      weak_topics: [],
      strong_topics: ["Mathematics", "Physics", "Chemistry"],
      trends: {
        trend_direction: "improving",
        trend_strength: "strong",
        recent_performance: 95
      },
      risk_level: "low",
      confidence_score: 93,
      suggestions: [
        "Consider advanced placement",
        "Mentor other students",
        "Explore research opportunities"
      ]
    },
    "class2_student2": {
      student_id: studentId,
      overall_performance: 68.0,
      performance_level: "struggling",
      weak_topics: ["Mathematics", "Physics"],
      strong_topics: ["Chemistry"],
      trends: {
        trend_direction: "stable",
        trend_strength: "weak",
        recent_performance: 70
      },
      risk_level: "medium",
      confidence_score: 71,
      suggestions: [
        "Focus on Mathematics basics",
        "Get Physics tutoring",
        "Use Chemistry strength to build confidence"
      ]
    }
  };

  return mockDataByStudent[studentId] || {
    student_id: studentId,
    overall_performance: 75.0,
    performance_level: "average",
    weak_topics: ["General"],
    strong_topics: ["General"],
    trends: {
      trend_direction: "stable",
      trend_strength: "weak",
      recent_performance: 75
    },
    risk_level: "medium",
    confidence_score: 75,
    suggestions: [
      "Continue current study habits",
      "Focus on areas of improvement",
      "Seek help when needed"
    ]
  };
};

// Dynamic mock data based on class ID
const getMockAtRiskStudents = (classId: string): AtRiskStudent[] => {
  const mockDataByClass: Record<string, AtRiskStudent[]> = {
    "class1": [
      {
        student_id: "class1_student1",
        overall_performance: 79.5,
        risk_level: "low",
        weak_topics: ["Physics"],
        risk_factors: ["Inconsistent performance"],
        intervention_suggestions: [
          "Focus on Physics problem-solving",
          "Practice mathematical applications",
          "Continue strong performance in other subjects"
        ],
        last_assessment_date: "2024-01-25"
      },
      {
        student_id: "class1_student2",
        overall_performance: 71.0,
        risk_level: "medium",
        weak_topics: ["Mathematics", "Physics"],
        risk_factors: ["Declining trend", "Multiple weak subjects"],
        intervention_suggestions: [
          "Focus on Mathematics fundamentals",
          "Get help with Physics concepts",
          "Leverage strength in humanities subjects"
        ],
        last_assessment_date: "2024-01-25"
      }
    ],
    "class2": [
      {
        student_id: "class2_student1",
        overall_performance: 92.5,
        risk_level: "low",
        weak_topics: [],
        risk_factors: ["None - excellent performance"],
        intervention_suggestions: [
          "Consider advanced placement",
          "Mentor other students",
          "Explore research opportunities"
        ],
        last_assessment_date: "2024-01-25"
      },
      {
        student_id: "class2_student2",
        overall_performance: 68.0,
        risk_level: "medium",
        weak_topics: ["Mathematics", "Physics"],
        risk_factors: ["Struggling with core subjects", "Below average performance"],
        intervention_suggestions: [
          "Focus on Mathematics basics",
          "Get Physics tutoring",
          "Use Chemistry strength to build confidence"
        ],
        last_assessment_date: "2024-01-25"
      }
    ],
    "class3": [
      {
        student_id: "student3",
        overall_performance: 95.5,
        risk_level: "low",
        weak_topics: [],
        risk_factors: ["None - excellent performance"],
        intervention_suggestions: [
          "Continue excellent work",
          "Consider advanced topics",
          "Help peers with difficult concepts"
        ],
        last_assessment_date: "2024-01-25"
      },
      {
        student_id: "student4",
        overall_performance: 65.0,
        risk_level: "high",
        weak_topics: ["Mathematics", "Physics", "Chemistry"],
        risk_factors: ["Declining trend", "Multiple weak subjects", "Below 70% performance"],
        intervention_suggestions: [
          "Immediate intervention needed",
          "Schedule one-on-one tutoring",
          "Review basic concepts",
          "Consider study group participation"
        ],
        last_assessment_date: "2024-01-25"
      },
      {
        student_id: "student5",
        overall_performance: 88.0,
        risk_level: "low",
        weak_topics: ["Chemistry"],
        risk_factors: ["Minor weakness in one subject"],
        intervention_suggestions: [
          "Focus on Chemistry lab work",
          "Practice chemical equations",
          "Review periodic table concepts"
        ],
        last_assessment_date: "2024-01-25"
      }
    ],
    "class4": [
      {
        student_id: "student1",
        overall_performance: 82.5,
        risk_level: "low",
        weak_topics: ["Physics"],
        risk_factors: ["Minor weakness in one subject"],
        intervention_suggestions: [
          "Focus on Physics fundamentals",
          "Practice more problem-solving",
          "Review previous assignments"
        ],
        last_assessment_date: "2024-01-25"
      },
      {
        student_id: "student2",
        overall_performance: 75.0,
        risk_level: "medium",
        weak_topics: ["Mathematics", "Physics"],
        risk_factors: ["Multiple weak subjects", "Below 80% performance"],
        intervention_suggestions: [
          "Need more practice in Mathematics",
          "Focus on Physics concepts",
          "Consider additional tutoring"
        ],
        last_assessment_date: "2024-01-25"
      }
    ],
    "class5": [
      {
        student_id: "student4",
        overall_performance: 65.0,
        risk_level: "high",
        weak_topics: ["Mathematics", "Physics", "Chemistry"],
        risk_factors: ["Critical performance issues", "All subjects below 70%"],
        intervention_suggestions: [
          "Immediate intervention needed",
          "Schedule one-on-one tutoring",
          "Review basic concepts",
          "Consider study group participation",
          "Parent-teacher conference recommended"
        ],
        last_assessment_date: "2024-01-25"
      }
    ]
  };

  return mockDataByClass[classId] || [
    {
      student_id: "default_student",
      overall_performance: 75.0,
      risk_level: "medium",
      weak_topics: ["General"],
      risk_factors: ["Average performance"],
      intervention_suggestions: [
        "Continue current study habits",
        "Focus on areas of improvement",
        "Seek help when needed"
      ],
      last_assessment_date: "2024-01-25"
    }
  ];
};

class AIService {
  private api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Add request interceptor to include auth token
  constructor() {
    this.api.interceptors.request.use((config) => {
      // You can add authentication token here if needed
      // const token = localStorage.getItem('token');
      // if (token) {
      //   config.headers.Authorization = `Bearer ${token}`;
      // }
      return config;
    });
  }

  // Get student performance analysis (using mock data for now)
  async getStudentPerformance(studentId: string): Promise<PerformanceAnalysis> {
    try {
      // Try to call the backend first
      const response = await this.api.get(`/ai/test/student/${studentId}/performance`);
      return response.data.data;
    } catch (error) {
      // If backend fails, use mock data
      console.log('Backend unavailable, using mock data for student:', studentId);
      return getMockStudentPerformance(studentId);
    }
  }

  // Get student trends
  async getStudentTrends(studentId: string): Promise<any> {
    try {
      const response = await this.api.get(`/ai/test/student/${studentId}/trends`);
      return response.data.data;
    } catch (error) {
      console.log('Backend unavailable, using mock trends data for student:', studentId);
      const mockData = getMockStudentPerformance(studentId);
      return {
        student_id: studentId,
        trend: mockData.trends.trend_direction,
        overall_performance: mockData.overall_performance,
        risk_level: mockData.risk_level
      };
    }
  }

  // Get class performance analysis
  async getClassPerformance(classId: string): Promise<ClassPerformance> {
    try {
      const response = await this.api.get(`/ai/test/class/${classId}/performance`);
      return response.data.data;
    } catch (error) {
      console.log('Backend unavailable, using mock class data for class:', classId);
      return {
        class_id: classId,
        average_performance: 78.5,
        performance_distribution: {
          excellent: 2,
          good: 3,
          average: 2,
          struggling: 1,
          poor: 0
        },
        top_performers: [
          { student_id: "student1", performance: 82.5 },
          { student_id: "student2", performance: 75.0 }
        ],
        weak_topics: ["Physics", "Mathematics"],
        strong_topics: ["Chemistry", "English"],
        recommendations: [
          "Focus on Physics fundamentals",
          "Provide additional Mathematics support",
          "Encourage group study sessions"
        ]
      };
    }
  }

  // Get at-risk students for a class (using mock data for now)
  async getAtRiskStudents(classId: string): Promise<AtRiskStudent[]> {
    try {
      // Try to call the backend first
      const response = await this.api.get(`/ai/test/class/${classId}/at-risk`);
      return response.data.data.at_risk_students;
    } catch (error) {
      // If backend fails, use mock data
      console.log('Backend unavailable, using mock at-risk data for class:', classId);
      return getMockAtRiskStudents(classId);
    }
  }

  // Health check for AI service
  async checkAIHealth(): Promise<boolean> {
    try {
      const response = await this.api.get('/ai/health');
      return response.data.data.healthy;
    } catch (error) {
      console.error('AI service health check failed:', error);
      return false;
    }
  }

  // Submit student scores for analysis (for future use with real data)
  async submitStudentScores(studentId: string, scores: StudentScore[]): Promise<PerformanceAnalysis> {
    try {
      const response = await this.api.post(`/ai/student/${studentId}/performance`, {
        student_id: studentId,
        scores: scores,
      });
      return response.data.data;
    } catch (error) {
      console.error('Error submitting student scores:', error);
      throw new Error('Failed to submit student scores for analysis');
    }
  }
}

export default new AIService(); 