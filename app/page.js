"use client";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Action from "@/components/Actions";
export default function Home() {
  return (
    <div className="bg-[#0a0a0a] h-screen">
      <Navbar />
      <div className="flex flex-row  h-full w-full p-2 items-center justify-center gap-18">
        <Action />
      </div>
    </div>
  );
}
