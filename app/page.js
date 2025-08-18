"use client";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Action from "@/components/Action";
import SearchBar from "@/components/SearchBar";
import Recent from "@/components/Recent";
import { FloatingDockDemo } from "@/components/dock";

export default function Home() {
  return (
    <div className="bg-[#0a0a0a] h-screen min-w-[320px] flex flex-col">
      {/* Top Section */}
      <Navbar />
      <hr className="border-neutral-800" />
      {/* <SearchBar /> */}
      <Recent />
      {/* <div className="flex flex-row w-full p-2 my-2 items-center justify-center">
        <Action />
      </div> */}

      {/* Spacer to push dock to bottom */}
      <div className="flex-1" />

      {/* Bottom Floating Dock */}
      <div className="w-full flex items-center justify-center mb-4">
        <FloatingDockDemo />
      </div>
    </div>
  );
}
