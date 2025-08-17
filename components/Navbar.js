"use client";
import { useState } from "react";
import { CiMenuBurger } from "react-icons/ci";
import Sidebar from "@/components/Sidebar";

export default function Navbar() {
  const [sidebar, setSidebar] = useState(false);

  return (
    <div className="relative">
      {/* Navbar */}
      <div className="p-8 flex items-center justify-between">
        <h1 className="text-white text-2xl">DevStash</h1>
        <div
          onMouseEnter={() => setSidebar(true)}
          onMouseLeave={() => setSidebar(false)}
          className="relative"
        >
          <button className="text-white text-2xl">
            <CiMenuBurger />
          </button>

          {/* Sidebar */}
          {sidebar && (
            <div
              className="absolute top-full right-0 z-20"
              onMouseEnter={() => setSidebar(true)}
              onMouseLeave={() => setSidebar(false)}
            >
              <Sidebar />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
