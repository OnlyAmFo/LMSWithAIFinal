"use client";

import React, { useState, useEffect } from "react";
import aiService, { PerformanceAnalysis } from "../../services/aiService";

interface AIPerformanceCardProps {
  studentId: string;
}

const AIPerformanceCard: React.FC<AIPerformanceCardProps> = ({ studentId }) => {
  const [performanceData, setPerformanceData] =
    useState<PerformanceAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPerformanceData = async () => {
      try {
        setLoading(true);
        const data = await aiService.getStudentPerformance(studentId);
        setPerformanceData(data);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to fetch performance data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPerformanceData();
  }, [studentId]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
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
            Error Loading AI Analysis
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

  if (!performanceData) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-yellow-800">
          No Performance Data Available
        </h3>
        <p className="text-yellow-600 mt-2">
          No AI analysis data found for this student.
        </p>
      </div>
    );
  }

  const getPerformanceColor = (level: string) => {
    if (!level) return "text-gray-600 bg-gray-100";

    switch (level.toLowerCase()) {
      case "excellent":
        return "text-green-600 bg-green-100";
      case "good":
        return "text-blue-600 bg-blue-100";
      case "average":
        return "text-yellow-600 bg-yellow-100";
      case "struggling":
        return "text-orange-600 bg-orange-100";
      case "poor":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getRiskColor = (level: string) => {
    if (!level) return "text-gray-600 bg-gray-100";

    switch (level.toLowerCase()) {
      case "low":
        return "text-green-600 bg-green-100";
      case "medium":
        return "text-yellow-600 bg-yellow-100";
      case "high":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getTrendIcon = (direction: string) => {
    if (!direction) return "→";

    switch (direction.toLowerCase()) {
      case "improving":
        return "↗️";
      case "declining":
        return "↘️";
      case "stable":
        return "→";
      default:
        return "→";
    }
  };

  // Safe data access with fallbacks
  const safeData = {
    overall_performance: performanceData.overall_performance || 0,
    performance_level: performanceData.performance_level || "Unknown",
    confidence_score: performanceData.confidence_score || 0,
    risk_level: performanceData.risk_level || "Unknown",
    trends: {
      trend_direction: performanceData.trends?.trend_direction || "stable",
      trend_strength: performanceData.trends?.trend_strength || "weak",
      recent_performance: performanceData.trends?.recent_performance || 0,
    },
    strong_topics: performanceData.strong_topics || [],
    weak_topics: performanceData.weak_topics || [],
    suggestions: performanceData.suggestions || [],
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          AI Performance Analysis
        </h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Student ID:</span>
          <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
            {studentId}
          </span>
        </div>
      </div>

      {/* Overall Performance */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">Overall Performance</h3>
          <div className="text-3xl font-bold">
            {safeData.overall_performance}%
          </div>
          <div className="text-sm opacity-90">{safeData.performance_level}</div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">Confidence Score</h3>
          <div className="text-3xl font-bold">{safeData.confidence_score}%</div>
          <div className="text-sm opacity-90">AI Confidence</div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">Risk Level</h3>
          <div className="text-3xl font-bold">{safeData.risk_level}</div>
          <div className="text-sm opacity-90">Assessment Risk</div>
        </div>
      </div>

      {/* Performance Level Badge */}
      <div className="mb-6">
        <span
          className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getPerformanceColor(
            safeData.performance_level
          )}`}
        >
          {safeData.performance_level} Performance
        </span>
      </div>

      {/* Trends */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          Performance Trends
        </h3>
        <div className="flex items-center space-x-4">
          <span className="text-2xl">
            {getTrendIcon(safeData.trends.trend_direction)}
          </span>
          <div>
            <p className="font-medium text-gray-800">
              {safeData.trends.trend_direction} (
              {safeData.trends.trend_strength})
            </p>
            <p className="text-sm text-gray-600">
              Recent Performance: {safeData.trends.recent_performance}%
            </p>
          </div>
        </div>
      </div>

      {/* Topics Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Strong Topics
          </h3>
          <div className="space-y-2">
            {safeData.strong_topics.length > 0 ? (
              safeData.strong_topics.map((topic, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">{topic}</span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">
                No strong topics identified
              </p>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Areas for Improvement
          </h3>
          <div className="space-y-2">
            {safeData.weak_topics.length > 0 ? (
              safeData.weak_topics.map((topic, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-gray-700">{topic}</span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No weak areas identified</p>
            )}
          </div>
        </div>
      </div>

      {/* AI Suggestions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-800 mb-3">
          AI Recommendations
        </h3>
        {safeData.suggestions.length > 0 ? (
          <ul className="space-y-2">
            {safeData.suggestions.map((suggestion, index) => (
              <li key={index} className="flex items-start space-x-2">
                <span className="text-blue-500 mt-1">•</span>
                <span className="text-blue-700">{suggestion}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-blue-600 text-sm">
            No specific recommendations available
          </p>
        )}
      </div>

      {/* ML Predictions Section */}
      {performanceData.ml_predictions && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4 mt-4">
          <h3 className="text-lg font-semibold text-purple-800 mb-3">
            🤖 Machine Learning Predictions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-3 border border-purple-200">
              <div className="text-sm text-purple-600 font-medium">
                Predicted Performance
              </div>
              <div className="text-2xl font-bold text-purple-800">
                {performanceData.ml_predictions.predicted_performance}%
              </div>
              <div className="text-xs text-purple-500">
                ML Model: {performanceData.ml_predictions.model_used}
              </div>
            </div>
            <div className="bg-white rounded-lg p-3 border border-purple-200">
              <div className="text-sm text-purple-600 font-medium">
                Predicted Risk
              </div>
              <div
                className={`text-2xl font-bold ${
                  performanceData.ml_predictions.predicted_risk_level === "high"
                    ? "text-red-600"
                    : performanceData.ml_predictions.predicted_risk_level ===
                      "medium"
                    ? "text-yellow-600"
                    : "text-green-600"
                }`}
              >
                {performanceData.ml_predictions.predicted_risk_level.toUpperCase()}
              </div>
              <div className="text-xs text-purple-500">AI Assessment</div>
            </div>
            <div className="bg-white rounded-lg p-3 border border-purple-200">
              <div className="text-sm text-purple-600 font-medium">
                Confidence
              </div>
              <div className="text-2xl font-bold text-purple-800">
                {performanceData.ml_predictions.confidence_score}%
              </div>
              <div className="text-xs text-purple-500">Model Confidence</div>
            </div>
          </div>

          {/* Comparison with Rule-based Analysis */}
          <div className="mt-4 p-3 bg-white rounded-lg border border-purple-200">
            <h4 className="text-sm font-semibold text-purple-700 mb-2">
              Analysis Comparison
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="font-medium text-purple-600">
                  Rule-based Analysis:
                </div>
                <div>Performance: {safeData.overall_performance}%</div>
                <div>Risk: {safeData.risk_level}</div>
              </div>
              <div>
                <div className="font-medium text-purple-600">
                  ML Prediction:
                </div>
                <div>
                  Performance:{" "}
                  {performanceData.ml_predictions.predicted_performance}%
                </div>
                <div>
                  Risk: {performanceData.ml_predictions.predicted_risk_level}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Last Updated */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          {performanceData.ml_predictions
            ? "AI Analysis generated using machine learning models"
            : "AI Analysis generated using rule-based algorithms"}
        </p>
      </div>
    </div>
  );
};

export default AIPerformanceCard;
