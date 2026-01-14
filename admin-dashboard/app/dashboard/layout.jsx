"use client";

import Sidebar from '@/components/dashboard/Sidebar';
import Header from '@/components/dashboard/Header';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function DashboardLayout({ children }) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100 flex">
        <Sidebar />
        <div className="flex-1">
          <Header />
          <main className="p-6">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}