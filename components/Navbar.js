"use client";
import { useState } from "react";
import { CiMenuBurger } from "react-icons/ci";
import Sidebar from "@/components/Sidebar";

export default function Navbar({ home }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="relative">
      {/* Navbar */}
      <div className="h-20 bg-zinc-900 shadow-md p-8 flex items-center justify-between bg-[#0a0a0a]">
        <h1 className="text-white text-2xl font-bold">DevStash</h1>
        <div className="relative">
          <button
            className="text-white text-xl p-2 rounded-xl border-1 border-white hover:bg-white hover:text-black transition-all duration-200"
            onClick={toggleSidebar}
          >
            <CiMenuBurger />
          </button>
        </div>
      </div>

      {/* Overlay + Sidebar */}
      {isSidebarOpen && (
        <>
          {/* Full-screen invisible overlay */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsSidebarOpen(false)}
          ></div>

          {/* Sidebar */}
          <div className="absolute top-full right-0 z-50">
            <Sidebar />
          </div>
        </>
      )}
    </div>
  );
}
