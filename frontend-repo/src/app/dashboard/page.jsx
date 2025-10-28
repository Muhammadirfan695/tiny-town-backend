"use client";

import withAuth from "@/authentication/withAuth"; 

function DashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800">Welcome to your Dashboard</h1>
    </div>
  );
}

export default withAuth(DashboardPage);