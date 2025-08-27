"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function OnboardingLeetcode() {
  const [leetcodeUsername, setLeetcodeUsername] = useState("");
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (leetcodeUsername.trim()) {
        await fetch("/api/me", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ leetcodeUsername: leetcodeUsername.trim() })
        });
      }
      router.push("/");
    } catch {}
    finally { setSaving(false); }
  };

  const handleSkip = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6 py-12">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-light text-white mb-2">Connect LeetCode</h1>
          <p className="text-gray-400">Add your LeetCode username to show progress and stats</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 border border-gray-700 rounded-xl bg-gray-900/20 space-y-5">
          <div>
            <label htmlFor="leetcodeUsername" className="block text-sm text-gray-300 mb-2">LeetCode Username</label>
            <input
              id="leetcodeUsername"
              name="leetcodeUsername"
              value={leetcodeUsername}
              onChange={(e) => setLeetcodeUsername(e.target.value)}
              placeholder="e.g. jane_doe"
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
            />
          </div>

          <button type="submit" disabled={saving} className="w-full py-3 bg-white text-black rounded-lg font-medium hover:bg-gray-200 disabled:bg-gray-400 transition-colors">
            {saving ? "Saving..." : "Finish"}
          </button>

          <button type="button" onClick={handleSkip} className="w-full py-3 text-gray-300 hover:text-white transition-colors">
            Skip for now
          </button>
        </form>
      </div>
    </div>
  );
}


