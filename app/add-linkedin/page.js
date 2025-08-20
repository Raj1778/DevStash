"use client";
import { useState } from "react";

export default function AddLinkedinPage() {
  const [username, setUsername] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Saved LinkedIn username:", username);
    // Later: save to DB or localStorage
    localStorage.setItem("linkedinUsername", username);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <div className="w-full max-w-md bg-neutral-900/70 backdrop-blur-lg p-6 rounded-2xl shadow-md">
        <h1 className="text-2xl font-semibold mb-4">Connect LinkedIn</h1>
        <p className="text-gray-400 mb-6">
          Enter your LinkedIn username to link your profile.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="LinkedIn username"
            className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="px-5 py-2 bg-blue-600 rounded-lg hover:bg-blue-500 active:scale-95 active:translate-y-[2px] transition"
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
}
