"use client";

const DashboardPage = () => {
  // In a real app, fetch user info and dashboard data here
  return (
    <div className="max-w-3xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">Dashboard</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-lg mb-4">Welcome to your dashboard!</p>
        {/* Add user info, stats, and navigation here */}
        <ul className="list-disc pl-5">
          <li>View your enrolled courses</li>
          <li>Check your progress</li>
          <li>Update your profile</li>
        </ul>
      </div>
    </div>
  );
};

export default DashboardPage;
