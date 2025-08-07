"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";

interface AIInsights {
  student_id: string;
  comprehensive_insights: {
    performance: any;
    behavior: any;
    content_recommendations: any;
    learning_path: any;
    predictions: any;
    study_plan: any;
    tutoring: any;
    adaptive_learning: any;
    summary: any;
  };
}

interface BehaviorAnalysis {
  student_id: string;
  behavior_analysis: {
    learning_style: string;
    consistency: number;
    engagement: number;
    improvement_rate: number;
    recommendations: string[];
  };
}

interface ContentRecommendations {
  student_id: string;
  recommendations: Array<{
    topic: string;
    reason: string;
    confidence: number;
  }>;
  total_recommendations: number;
}

interface LearningPath {
  student_id: string;
  optimized_path: Array<{
    topic: string;
    type: string;
    estimated_time: string;
  }>;
  path_length: number;
  estimated_completion_time: string;
}

interface StudyPlan {
  student_id: string;
  study_plan: {
    learning_path: any[];
    recommended_content: any[];
    study_schedule: {
      frequency: string;
      session_duration: string;
      breaks: string;
    };
    focus_areas: Array<{
      topic: string;
      current_performance: number;
      priority: string;
    }>;
    estimated_completion_time: string;
  };
}

interface TutoringRecommendations {
  student_id: string;
  tutoring: {
    needed: boolean;
    recommended_sessions: number;
    focus_topics: string[];
    tutor_preferences: string;
    estimated_duration: string;
    confidence_level: string;
  };
}

interface AdaptiveLearning {
  student_id: string;
  adaptive_learning: {
    difficulty_adjustment: string;
    content_pacing: string;
    personalization_level: string;
    recommended_activities: string[];
    learning_path_adjustment: string;
  };
}

interface AutoGrading {
  topic: string;
  assignment_type: string;
  max_score: number;
  predicted_grade: number;
  grade_percentage: number;
  grade_letter: string;
}

const EnhancedAIDemo = () => {
  const [selectedStudent, setSelectedStudent] = useState("class1_student1");
  const [selectedFeature, setSelectedFeature] = useState("comprehensive");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const students = [
    "class1_student1",
    "class1_student2",
    "class2_student1",
    "gifted_students_student1",
    "at_risk_students_student1",
    "improving_students_student1",
  ];

  const features = [
    {
      id: "comprehensive",
      name: "Comprehensive AI Insights",
      description: "Complete analysis of student performance and behavior",
    },
    {
      id: "behavior",
      name: "Behavior Analysis",
      description: "Learning style and behavioral patterns",
    },
    {
      id: "content",
      name: "Content Recommendations",
      description: "Personalized learning material suggestions",
    },
    {
      id: "learning-path",
      name: "Learning Path Optimization",
      description: "Optimized learning sequence",
    },
    {
      id: "study-plan",
      name: "Personalized Study Plan",
      description: "Custom study schedule and focus areas",
    },
    {
      id: "tutoring",
      name: "Tutoring Recommendations",
      description: "Intelligent tutoring suggestions",
    },
    {
      id: "adaptive",
      name: "Adaptive Learning",
      description: "Dynamic learning adjustments",
    },
    {
      id: "auto-grade",
      name: "Auto-Grading",
      description: "Automated assignment grading",
    },
  ];

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      let endpoint = "";
      switch (selectedFeature) {
        case "comprehensive":
          endpoint = `/api/v1/enhanced-ai/test/comprehensive-insights/${selectedStudent}`;
          break;
        case "behavior":
          endpoint = `/api/v1/enhanced-ai/test/behavior-analysis/${selectedStudent}`;
          break;
        case "content":
          endpoint = `/api/v1/enhanced-ai/test/content-recommendations/${selectedStudent}`;
          break;
        case "learning-path":
          endpoint = `/api/v1/enhanced-ai/test/learning-path/${selectedStudent}`;
          break;
        case "study-plan":
          endpoint = `/api/v1/enhanced-ai/test/study-plan/${selectedStudent}`;
          break;
        case "tutoring":
          endpoint = `/api/v1/enhanced-ai/test/tutoring-recommendations/${selectedStudent}`;
          break;
        case "adaptive":
          endpoint = `/api/v1/enhanced-ai/test/adaptive-learning/${selectedStudent}`;
          break;
        case "auto-grade":
          // For auto-grading, we'll use a POST request with sample data
          const gradingData = {
            topic: "Mathematics",
            assignmentType: "quiz",
            maxScore: 100,
          };
          const response = await axios.post(
            "http://localhost:5000/api/v1/enhanced-ai/test/auto-grade",
            gradingData
          );
          setData(response.data);
          setLoading(false);
          return;
      }

      const response = await axios.get(`http://localhost:5000${endpoint}`);
      setData(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedStudent, selectedFeature]);

  const renderComprehensiveInsights = (insights: AIInsights) => {
    const { comprehensive_insights } = insights;

    // Add null checks and fallback data
    const summary = comprehensive_insights?.summary || {};
    const performance = comprehensive_insights?.performance || {};
    const behavior = comprehensive_insights?.behavior || {};
    const contentRecommendations =
      comprehensive_insights?.content_recommendations || {};
    const learningPath = comprehensive_insights?.learning_path || {};

    return (
      <div className="space-y-6">
        {/* Summary Card */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-2">AI Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm opacity-90">Status</p>
              <p className="font-semibold">
                {summary.overall_status || "Unknown"}
              </p>
            </div>
            <div>
              <p className="text-sm opacity-90">Learning Style</p>
              <p className="font-semibold">
                {summary.learning_style || "Unknown"}
              </p>
            </div>
            <div>
              <p className="text-sm opacity-90">Risk Level</p>
              <p className="font-semibold">{summary.risk_level || "Unknown"}</p>
            </div>
            <div>
              <p className="text-sm opacity-90">Trend</p>
              <p className="font-semibold">
                {summary.performance_trend || "Unknown"}
              </p>
            </div>
          </div>
          <p className="mt-4 text-sm opacity-90">
            {summary.key_message || "No summary available"}
          </p>
        </div>

        {/* Performance Analysis */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Performance Analysis</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Overall Performance</p>
              <p className="text-2xl font-bold text-blue-600">
                {performance.overall_performance || 0}%
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Confidence Score</p>
              <p className="text-2xl font-bold text-green-600">
                {performance.confidence_score || 0}%
              </p>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-2">Weak Topics</p>
            <div className="flex flex-wrap gap-2">
              {(performance.weak_topics || []).map(
                (topic: string, index: number) => (
                  <span
                    key={index}
                    className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm"
                  >
                    {topic}
                  </span>
                )
              )}
            </div>
          </div>
        </div>

        {/* Behavior Analysis */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Learning Behavior</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Learning Style</p>
              <p className="font-semibold">
                {behavior.behavior_analysis?.learning_style || "Unknown"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Consistency</p>
              <p className="font-semibold">
                {((behavior.behavior_analysis?.consistency || 0) * 100).toFixed(
                  1
                )}
                %
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Engagement</p>
              <p className="font-semibold">
                {((behavior.behavior_analysis?.engagement || 0) * 100).toFixed(
                  1
                )}
                %
              </p>
            </div>
          </div>
        </div>

        {/* Content Recommendations */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Recommended Content</h3>
          <div className="space-y-3">
            {(contentRecommendations.recommendations || []).map(
              (rec: any, index: number) => (
                <div key={index} className="border-l-4 border-blue-500 pl-4">
                  <p className="font-semibold">
                    {rec.topic || "Unknown Topic"}
                  </p>
                  <p className="text-sm text-gray-600">
                    {rec.reason || "No reason provided"}
                  </p>
                  <p className="text-xs text-gray-500">
                    Confidence: {((rec.confidence || 0) * 100).toFixed(1)}%
                  </p>
                </div>
              )
            )}
          </div>
        </div>

        {/* Learning Path */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">
            Optimized Learning Path
          </h3>
          <div className="space-y-3">
            {(learningPath.optimized_path || []).map(
              (step: any, index: number) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-semibold">
                      {step.topic || "Unknown Topic"}
                    </p>
                    <p className="text-sm text-gray-600">
                      {step.type || "Unknown Type"} •{" "}
                      {step.estimated_time || "Unknown Time"}
                    </p>
                  </div>
                </div>
              )
            )}
          </div>
          <p className="mt-4 text-sm text-gray-600">
            Estimated completion:{" "}
            {learningPath.estimated_completion_time || "Unknown"}
          </p>
        </div>
      </div>
    );
  };

  const renderBehaviorAnalysis = (data: BehaviorAnalysis) => {
    const { behavior_analysis } = data;

    // Add null checks and fallback data
    const learningStyle = behavior_analysis?.learning_style || "Unknown";
    const improvementRate = behavior_analysis?.improvement_rate || 0;
    const consistency = behavior_analysis?.consistency || 0;
    const engagement = behavior_analysis?.engagement || 0;
    const recommendations = behavior_analysis?.recommendations || [];

    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-4">Learning Behavior Analysis</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm opacity-90">Learning Style</p>
              <p className="text-2xl font-bold">{learningStyle}</p>
            </div>
            <div>
              <p className="text-sm opacity-90">Improvement Rate</p>
              <p className="text-2xl font-bold">
                {(improvementRate * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h4 className="font-semibold mb-4">Performance Metrics</h4>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Consistency</p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${consistency * 100}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-500">
                  {(consistency * 100).toFixed(1)}%
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Engagement</p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: `${engagement * 100}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-500">
                  {(engagement * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h4 className="font-semibold mb-4">Recommendations</h4>
            {recommendations.length > 0 ? (
              <ul className="space-y-2">
                {recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span className="text-sm">{rec}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm">
                No recommendations available
              </p>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderContentRecommendations = (data: ContentRecommendations) => {
    // Add null checks and fallback data
    const recommendations = data.recommendations || [];
    const totalRecommendations =
      data.total_recommendations || recommendations.length;

    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-2">Content Recommendations</h3>
          <p className="text-sm opacity-90">
            {totalRecommendations} personalized recommendations found
          </p>
        </div>

        {recommendations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendations.map((rec, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500"
              >
                <h4 className="font-semibold text-lg mb-2">
                  {rec.topic || "Unknown Topic"}
                </h4>
                <p className="text-gray-600 text-sm mb-3">
                  {rec.reason || "No reason provided"}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Confidence</span>
                  <span className="font-semibold text-purple-600">
                    {((rec.confidence || 0) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full"
                    style={{ width: `${(rec.confidence || 0) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <p className="text-gray-500">
              No content recommendations available
            </p>
          </div>
        )}
      </div>
    );
  };

  const renderLearningPath = (data: LearningPath) => {
    // Add null checks and fallback data
    const optimizedPath = data.optimized_path || [];
    const pathLength = data.path_length || optimizedPath.length;
    const completionTime = data.estimated_completion_time || "Unknown";

    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-2">Optimized Learning Path</h3>
          <p className="text-sm opacity-90">
            {pathLength} steps • {completionTime}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          {optimizedPath.length > 0 ? (
            <div className="space-y-4">
              {optimizedPath.map((step, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">
                      {step.topic || "Unknown Topic"}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {step.type || "Unknown Type"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      {step.estimated_time || "Unknown Time"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No learning path data available</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderStudyPlan = (data: StudyPlan) => {
    const { study_plan } = data;

    // Add null checks and fallback data
    const schedule = study_plan?.study_schedule || {};
    const focusAreas = study_plan?.focus_areas || [];
    const completionTime = study_plan?.estimated_completion_time || "Unknown";

    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-2">Personalized Study Plan</h3>
          <p className="text-sm opacity-90">
            Estimated completion: {completionTime}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h4 className="font-semibold mb-4">Study Schedule</h4>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Frequency</p>
                <p className="font-semibold">
                  {schedule.frequency || "Not specified"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Session Duration</p>
                <p className="font-semibold">
                  {schedule.session_duration || "Not specified"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Breaks</p>
                <p className="font-semibold">
                  {schedule.breaks || "Not specified"}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h4 className="font-semibold mb-4">Focus Areas</h4>
            {focusAreas.length > 0 ? (
              <div className="space-y-3">
                {focusAreas.map((area, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <span className="font-medium">
                      {area.topic || "Unknown Topic"}
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">
                        {area.current_performance || 0}%
                      </span>
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          area.priority === "high"
                            ? "bg-red-100 text-red-800"
                            : area.priority === "medium"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {area.priority || "unknown"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No focus areas available</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderTutoringRecommendations = (data: TutoringRecommendations) => {
    const { tutoring } = data;

    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-4">Tutoring Recommendations</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <span className="text-sm opacity-90">Tutoring Needed:</span>
              <span
                className={`px-2 py-1 rounded text-xs font-semibold ${
                  tutoring.needed ? "bg-red-500" : "bg-green-500"
                }`}
              >
                {tutoring.needed ? "Yes" : "No"}
              </span>
            </div>
            <div>
              <span className="text-sm opacity-90">Recommended Sessions:</span>
              <span className="ml-2 font-semibold">
                {tutoring.recommended_sessions}
              </span>
            </div>
            <div>
              <span className="text-sm opacity-90">Focus Topics:</span>
              <span className="ml-2 font-semibold">
                {tutoring.focus_topics && tutoring.focus_topics.length > 0
                  ? tutoring.focus_topics.join(", ")
                  : "None identified"}
              </span>
            </div>
            <div>
              <span className="text-sm opacity-90">Tutor Preferences:</span>
              <span className="ml-2 font-semibold">
                {tutoring.tutor_preferences}
              </span>
            </div>
            <div>
              <span className="text-sm opacity-90">Estimated Duration:</span>
              <span className="ml-2 font-semibold">
                {tutoring.estimated_duration}
              </span>
            </div>
            <div>
              <span className="text-sm opacity-90">Confidence Level:</span>
              <span className="ml-2 font-semibold">
                {tutoring.confidence_level}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderAdaptiveLearning = (data: AdaptiveLearning) => {
    const { adaptive_learning } = data;

    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-4">
            Adaptive Learning Suggestions
          </h3>
          <div className="space-y-3">
            <div>
              <span className="text-sm opacity-90">Difficulty Adjustment:</span>
              <span className="ml-2 font-semibold capitalize">
                {adaptive_learning.difficulty_adjustment}
              </span>
            </div>
            <div>
              <span className="text-sm opacity-90">Content Pacing:</span>
              <span className="ml-2 font-semibold capitalize">
                {adaptive_learning.content_pacing}
              </span>
            </div>
            <div>
              <span className="text-sm opacity-90">Personalization Level:</span>
              <span className="ml-2 font-semibold capitalize">
                {adaptive_learning.personalization_level}
              </span>
            </div>
            <div>
              <span className="text-sm opacity-90">
                Recommended Activities:
              </span>
              <div className="mt-1">
                {adaptive_learning.recommended_activities &&
                adaptive_learning.recommended_activities.length > 0 ? (
                  <ul className="list-disc list-inside space-y-1">
                    {adaptive_learning.recommended_activities.map(
                      (activity, index) => (
                        <li key={index} className="text-sm">
                          {activity}
                        </li>
                      )
                    )}
                  </ul>
                ) : (
                  <span className="text-sm">
                    No specific activities recommended
                  </span>
                )}
              </div>
            </div>
            <div>
              <span className="text-sm opacity-90">
                Learning Path Adjustment:
              </span>
              <span className="ml-2 font-semibold">
                {adaptive_learning.learning_path_adjustment}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderAutoGrading = (data: AutoGrading) => {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-green-500 to-lime-600 text-white p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-4">Auto-Grading Result</h3>
          <div className="space-y-3">
            <div>
              <span className="text-sm opacity-90">Topic:</span>
              <span className="ml-2 font-semibold">{data.topic}</span>
            </div>
            <div>
              <span className="text-sm opacity-90">Assignment Type:</span>
              <span className="ml-2 font-semibold capitalize">
                {data.assignment_type}
              </span>
            </div>
            <div>
              <span className="text-sm opacity-90">Max Score:</span>
              <span className="ml-2 font-semibold">{data.max_score}</span>
            </div>
            <div>
              <span className="text-sm opacity-90">Predicted Grade:</span>
              <span className="ml-2 font-semibold">{data.predicted_grade}</span>
            </div>
            <div>
              <span className="text-sm opacity-90">Grade Percentage:</span>
              <span className="ml-2 font-semibold">
                {data.grade_percentage}%
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm opacity-90">Grade Letter:</span>
              <span
                className={`px-3 py-1 rounded text-sm font-bold ${
                  data.grade_letter === "A"
                    ? "bg-green-600"
                    : data.grade_letter === "B"
                    ? "bg-blue-600"
                    : data.grade_letter === "C"
                    ? "bg-yellow-600"
                    : data.grade_letter === "D"
                    ? "bg-orange-600"
                    : "bg-red-600"
                }`}
              >
                {data.grade_letter}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderData = () => {
    if (!data || !data.data) {
      return (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">No Data Available</h3>
          <p className="text-gray-600">
            Please try selecting a different student or feature.
          </p>
        </div>
      );
    }

    const responseData = data.data;

    switch (selectedFeature) {
      case "comprehensive":
        if (responseData.comprehensive_insights) {
          return renderComprehensiveInsights(responseData);
        }
        break;
      case "behavior":
        if (responseData.behavior_analysis) {
          return renderBehaviorAnalysis(responseData);
        }
        break;
      case "content":
        if (responseData.recommendations) {
          return renderContentRecommendations(responseData);
        }
        break;
      case "learning-path":
        if (responseData.optimized_path) {
          return renderLearningPath(responseData);
        }
        break;
      case "study-plan":
        if (responseData.study_plan) {
          return renderStudyPlan(responseData);
        }
        break;
      case "tutoring":
        if (responseData.tutoring) {
          return renderTutoringRecommendations(responseData);
        }
        break;
      case "adaptive":
        if (responseData.adaptive_learning) {
          return renderAdaptiveLearning(responseData);
        }
        break;
      case "auto-grade":
        // Auto-grading returns the data directly, not nested
        return renderAutoGrading(responseData);
      default:
        return (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Raw Data</h3>
            <pre className="text-sm overflow-auto">
              {JSON.stringify(responseData, null, 2)}
            </pre>
          </div>
        );
    }

    // Fallback for when data structure doesn't match expected format
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Data Structure Error</h3>
        <p className="text-gray-600 mb-4">
          The data structure doesn't match the expected format for this feature.
        </p>
        <pre className="text-sm overflow-auto bg-gray-100 p-4 rounded">
          {JSON.stringify(responseData, null, 2)}
        </pre>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🧠 Enhanced AI Demo
          </h1>
          <p className="text-lg text-gray-600">
            Explore the advanced AI features of our LMS
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Student
              </label>
              <select
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {students.map((student) => (
                  <option key={student} value={student}>
                    {student
                      .replace(/_/g, " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select AI Feature
              </label>
              <select
                value={selectedFeature}
                onChange={(e) => setSelectedFeature(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {features.map((feature) => (
                  <option key={feature.id} value={feature.id}>
                    {feature.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-sm text-gray-600">
              {features.find((f) => f.id === selectedFeature)?.description}
            </p>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading AI insights...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Data Display */}
        {!loading && !error && renderData()}
      </div>
    </div>
  );
};

export default EnhancedAIDemo;
