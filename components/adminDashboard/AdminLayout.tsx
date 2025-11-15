"use client";

import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
