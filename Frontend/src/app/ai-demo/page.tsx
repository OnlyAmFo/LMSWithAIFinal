"use client";

import React, { useState } from "react";
import AIPerformanceCard from "../../components/ai/AIPerformanceCard";
import AIAtRiskStudents from "../../components/ai/AIAtRiskStudents";

const AIDemoPage = () => {
  const [selectedStudent, setSelectedStudent] = useState("student1");
  const [selectedClass, setSelectedClass] = useState("class1");
  const [activeTab, setActiveTab] = useState<"student" | "class">("student");

  const studentOptions = [
    "student1",
    "student2",
    "student3",
    "student4",
    "student5",
    "class1_student1",
    "class1_student2",
    "class2_student1",
    "class2_student2",
  ];

  const classOptions = ["class1", "class2", "class3", "class4", "class5"];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🧠 AI Performance Analysis Demo
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Test the AI-powered performance analysis system with different
            students and classes. This demo shows real-time AI insights using
            machine learning models.
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Tab Selection */}
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveTab("student")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === "student"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                📊 Student Performance
              </button>
              <button
                onClick={() => setActiveTab("class")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === "class"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                👥 At-Risk Students
              </button>
            </div>

            {/* Selection Controls */}
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              {activeTab === "student" && (
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-gray-700">
                    Student ID:
                  </label>
                  <select
                    value={selectedStudent}
                    onChange={(e) => setSelectedStudent(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {studentOptions.map((student) => (
                      <option key={student} value={student}>
                        {student}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {activeTab === "class" && (
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-gray-700">
                    Class ID:
                  </label>
                  <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {classOptions.map((classId) => (
                      <option key={classId} value={classId}>
                        {classId}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* AI Components */}
        <div className="space-y-8">
          {activeTab === "student" && (
            <div>
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Student Performance Analysis
                </h2>
                <p className="text-gray-600">
                  AI-powered analysis for student:{" "}
                  <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                    {selectedStudent}
                  </span>
                </p>
              </div>
              <AIPerformanceCard studentId={selectedStudent} />
            </div>
          )}

          {activeTab === "class" && (
            <div>
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  At-Risk Students Analysis
                </h2>
                <p className="text-gray-600">
                  AI-powered risk assessment for class:{" "}
                  <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                    {selectedClass}
                  </span>
                </p>
              </div>
              <AIAtRiskStudents classId={selectedClass} />
            </div>
          )}
        </div>

        {/* Information Panel */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-4">
            ℹ️ How This Works
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-blue-700 mb-2">
                🤖 AI Technology
              </h4>
              <ul className="text-sm text-blue-600 space-y-1">
                <li>• Machine Learning models trained on 150+ students</li>
                <li>• Performance prediction with 97% accuracy</li>
                <li>• Risk assessment using Random Forest algorithms</li>
                <li>• Real-time analysis of trends and patterns</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-blue-700 mb-2">📊 Features</h4>
              <ul className="text-sm text-blue-600 space-y-1">
                <li>• Individual student performance analysis</li>
                <li>• Topic-wise strength and weakness identification</li>
                <li>
                  • At-risk student detection and intervention suggestions
                </li>
                <li>• Performance trend analysis and predictions</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Quick Test Links */}
        <div className="mt-8 bg-gray-100 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            🧪 Quick Test Links
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => {
                setActiveTab("student");
                setSelectedStudent("student1");
              }}
              className="bg-white border border-gray-300 rounded-lg p-3 text-left hover:shadow-md transition-shadow"
            >
              <div className="font-medium text-gray-800">Test Student 1</div>
              <div className="text-sm text-gray-500">
                Basic performance analysis
              </div>
            </button>
            <button
              onClick={() => {
                setActiveTab("student");
                setSelectedStudent("class1_student1");
              }}
              className="bg-white border border-gray-300 rounded-lg p-3 text-left hover:shadow-md transition-shadow"
            >
              <div className="font-medium text-gray-800">
                Test Class Student
              </div>
              <div className="text-sm text-gray-500">
                Class-specific analysis
              </div>
            </button>
            <button
              onClick={() => {
                setActiveTab("class");
                setSelectedClass("class1");
              }}
              className="bg-white border border-gray-300 rounded-lg p-3 text-left hover:shadow-md transition-shadow"
            >
              <div className="font-medium text-gray-800">Test Class 1</div>
              <div className="text-sm text-gray-500">
                At-risk students analysis
              </div>
            </button>
            <button
              onClick={() => {
                setActiveTab("class");
                setSelectedClass("class2");
              }}
              className="bg-white border border-gray-300 rounded-lg p-3 text-left hover:shadow-md transition-shadow"
            >
              <div className="font-medium text-gray-800">Test Class 2</div>
              <div className="text-sm text-gray-500">Different class data</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIDemoPage;
