"use client";

import React, { useState, useEffect } from "react";
import aiService, { AtRiskStudent } from "../../services/aiService";

interface AIAtRiskStudentsProps {
  classId: string;
}

const AIAtRiskStudents: React.FC<AIAtRiskStudentsProps> = ({ classId }) => {
  const [atRiskStudents, setAtRiskStudents] = useState<AtRiskStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRiskLevel, setSelectedRiskLevel] = useState<string>("all");

  useEffect(() => {
    const fetchAtRiskStudents = async () => {
      try {
        setLoading(true);
        const data = await aiService.getAtRiskStudents(classId);
        setAtRiskStudents(data);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to fetch at-risk students"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAtRiskStudents();
  }, [classId]);

  const filteredStudents =
    selectedRiskLevel === "all"
      ? atRiskStudents
      : atRiskStudents.filter(
          (student) => student.risk_level === selectedRiskLevel
        );

  const getRiskLevelColor = (level: string) => {
    if (!level) return "text-gray-600 bg-gray-100 border-gray-200";

    switch (level.toLowerCase()) {
      case "high":
        return "text-red-600 bg-red-100 border-red-200";
      case "medium":
        return "text-yellow-600 bg-yellow-100 border-yellow-200";
      case "low":
        return "text-green-600 bg-green-100 border-green-200";
      default:
        return "text-gray-600 bg-gray-100 border-gray-200";
    }
  };

  const getPerformanceColor = (performance: number) => {
    if (performance >= 80) return "text-green-600";
    if (performance >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getRiskLevelCount = (level: string) => {
    return atRiskStudents.filter((student) => student.risk_level === level)
      .length;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border border-gray-200 rounded-lg p-4">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center">
          <svg
            className="w-5 h-5 text-red-400 mr-2"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          <h3 className="text-lg font-semibold text-red-800">
            Error Loading At-Risk Students
          </h3>
        </div>
        <p className="text-red-600 mt-2">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          At-Risk Students Analysis
        </h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Class ID:</span>
          <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
            {classId}
          </span>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-red-600">
            {getRiskLevelCount("high")}
          </div>
          <div className="text-sm text-red-600">High Risk</div>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-yellow-600">
            {getRiskLevelCount("medium")}
          </div>
          <div className="text-sm text-yellow-600">Medium Risk</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-600">
            {getRiskLevelCount("low")}
          </div>
          <div className="text-sm text-green-600">Low Risk</div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-600">
            {atRiskStudents.length}
          </div>
          <div className="text-sm text-blue-600">Total At-Risk</div>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="mb-6">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">
            Filter by Risk Level:
          </label>
          <select
            value={selectedRiskLevel}
            onChange={(e) => setSelectedRiskLevel(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Risk Levels</option>
            <option value="high">High Risk</option>
            <option value="medium">Medium Risk</option>
            <option value="low">Low Risk</option>
          </select>
          <span className="text-sm text-gray-500">
            Showing {filteredStudents.length} of {atRiskStudents.length}{" "}
            students
          </span>
        </div>
      </div>

      {/* Students List */}
      {filteredStudents.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-400 text-6xl mb-4">🎉</div>
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            No At-Risk Students
          </h3>
          <p className="text-gray-500">
            {selectedRiskLevel === "all"
              ? "Great news! No students are currently identified as at-risk."
              : `No students with ${selectedRiskLevel} risk level found.`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredStudents.map((student, index) => {
            // Safe data access with fallbacks
            const safeStudent = {
              student_id: student.student_id || "Unknown Student",
              overall_performance: student.overall_performance || 0,
              risk_level: student.risk_level || "Unknown",
              weak_topics: student.weak_topics || [],
              risk_factors: student.risk_factors || [],
              intervention_suggestions: student.intervention_suggestions || [],
              last_assessment_date:
                student.last_assessment_date || new Date().toISOString(),
            };

            return (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600">
                        {safeStudent.student_id.split("_").pop() || "S"}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {safeStudent.student_id}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Last Assessment:{" "}
                        {new Date(
                          safeStudent.last_assessment_date
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <div
                        className={`text-lg font-bold ${getPerformanceColor(
                          safeStudent.overall_performance
                        )}`}
                      >
                        {safeStudent.overall_performance}%
                      </div>
                      <div className="text-sm text-gray-500">Performance</div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium border ${getRiskLevelColor(
                        safeStudent.risk_level
                      )}`}
                    >
                      {safeStudent.risk_level.toUpperCase()} RISK
                    </span>
                  </div>
                </div>

                {/* Risk Factors */}
                {safeStudent.risk_factors.length > 0 && (
                  <div className="mb-3">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Risk Factors:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {safeStudent.risk_factors.map((factor, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded"
                        >
                          {factor}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Weak Topics */}
                {safeStudent.weak_topics.length > 0 && (
                  <div className="mb-3">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Weak Topics:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {safeStudent.weak_topics.map((topic, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Intervention Suggestions */}
                {safeStudent.intervention_suggestions.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Intervention Suggestions:
                    </h4>
                    <ul className="space-y-1">
                      {safeStudent.intervention_suggestions.map(
                        (suggestion, idx) => (
                          <li
                            key={idx}
                            className="flex items-start space-x-2 text-sm text-gray-600"
                          >
                            <span className="text-blue-500 mt-1">•</span>
                            <span>{suggestion}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}

                {/* No data message */}
                {safeStudent.risk_factors.length === 0 &&
                  safeStudent.weak_topics.length === 0 &&
                  safeStudent.intervention_suggestions.length === 0 && (
                    <div className="text-center py-4">
                      <p className="text-gray-500 text-sm">
                        No detailed analysis available for this student
                      </p>
                    </div>
                  )}
              </div>
            );
          })}
        </div>
      )}

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>AI-powered risk assessment using machine learning</span>
          <span>Last updated: {new Date().toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};

export default AIAtRiskStudents;
