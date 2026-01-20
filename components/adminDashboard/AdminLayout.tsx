"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { getAccessToken } from "@/lib/manage_token";
import { validateUserTypeForRoute, getDashboardRoute } from "@/lib/manage_token/decode_token";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Validate user type on client-side before rendering
    const token = getAccessToken();
    
    if (!token) {
      // No token, redirect to login
      router.replace("/auth/sign-in");
      return;
    }

    // Check if user is admin
    const isAdmin = validateUserTypeForRoute(token, "admin");
    
    if (!isAdmin) {
      // User is not admin, redirect to their correct dashboard
      const correctRoute = getDashboardRoute(token);
      router.replace(correctRoute);
      return;
    }

    // User is valid admin, allow rendering
    setIsValidating(false);
  }, [router]);

  // Show loading state while validating
  if (isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F3F4F5]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-[#F3F4F5] flex items-start lg:gap-5 w-full">
      <div className="min-h-[calc(100vh-5rem)]">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </div>
      <main className="relative w-full lg:w-[84%] min-h-screen">
        <div className="">
          <Navbar onMenuClick={() => setSidebarOpen(true)} />
        </div>
        <div className="w-full lg:mt-4  lg:pr-4">{children}</div>
      </main>
    </section>
  );
}
