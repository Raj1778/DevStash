// app/my-account/page.js
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function MyAccountPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();
  
  const [settings, setSettings] = useState({
    // Profile
    displayName: "",
    email: "",
    bio: "Full-stack developer passionate about clean code",
    githubUsername: "",
    leetcodeUsername: "",

    // Preferences
    theme: "dark",
    language: "javascript",
    notifications: true,
    emailUpdates: false,

    // Privacy
    profilePublic: true,
    showEmail: false,
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/me");
        if (res.ok) {
          const data = await res.json();
          if (data && data.user) {
            setUser(data.user);
            setSettings(prev => ({
              ...prev,
              displayName: data.user.name || "",
              email: data.user.email || "",
              githubUsername: data.user.githubUsername || "",
              leetcodeUsername: data.user.leetcodeUsername || ""
            }));
          }
        } else {
          router.push("/login");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const handleChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");

    try {
      const res = await fetch("/api/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: settings.displayName,
          githubUsername: settings.githubUsername,
          leetcodeUsername: settings.leetcodeUsername
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setMessage("Settings updated successfully!");
        setTimeout(() => setMessage(""), 3000);
      } else {
        const error = await res.json();
        setMessage(error.error || "Failed to update settings");
      }
    } catch (error) {
      console.error("Error updating settings:", error);
      setMessage("Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-black px-6 py-12">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-light text-white mb-2 tracking-tight">
            My Account
          </h1>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent mb-4"></div>
          <p className="text-gray-400">Customize your developer experience</p>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="text-white">Loading...</div>
          </div>
        ) : (
          <>
            {/* Message */}
            {message && (
              <div className={`mb-6 p-4 rounded-lg text-sm ${
                message.includes("successfully") 
                  ? "bg-green-500/20 text-green-400 border border-green-500/30" 
                  : "bg-red-500/20 text-red-400 border border-red-500/30"
              }`}>
                {message}
              </div>
            )}

            <div className="space-y-8">
          {/* Profile Section */}
          <section className="p-6 border border-gray-700 rounded-xl bg-gray-900/20">
            <h2 className="text-xl text-white mb-6 font-medium">Profile</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Display Name
                </label>
                <input
                  type="text"
                  value={settings.displayName}
                  onChange={(e) => handleChange("displayName", e.target.value)}
                  className="w-full px-4 py-3 bg-neutral-800 border border-gray-700 rounded-lg text-white focus:border-gray-500 focus:outline-none transition-colors duration-200"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="w-full px-4 py-3 bg-neutral-800 border border-gray-700 rounded-lg text-white focus:border-gray-500 focus:outline-none transition-colors duration-200"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">Bio</label>
                <textarea
                  value={settings.bio}
                  onChange={(e) => handleChange("bio", e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 bg-neutral-800 border border-gray-700 rounded-lg text-white focus:border-gray-500 focus:outline-none transition-colors duration-200 resize-none"
                />
              </div>
            </div>
          </section>

          {/* Account Connections Section */}
          <section className="p-6 border border-gray-700 rounded-xl bg-gray-900/20">
            <h2 className="text-xl text-white mb-6 font-medium">Account Connections</h2>
            <p className="text-gray-400 text-sm mb-6">Connect your accounts to see real-time stats on your dashboard</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  GitHub Username
                </label>
                <div className="flex items-center space-x-3">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={settings.githubUsername}
                      onChange={(e) => handleChange("githubUsername", e.target.value)}
                      placeholder="Enter your GitHub username"
                      className="w-full px-4 py-3 bg-neutral-800 border border-gray-700 rounded-lg text-white focus:border-gray-500 focus:outline-none transition-colors duration-200"
                    />
                  </div>
                  <div className="text-gray-400">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                    </svg>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  This will be used to fetch your GitHub commits and repositories
                </p>
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  LeetCode Username
                </label>
                <div className="flex items-center space-x-3">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={settings.leetcodeUsername}
                      onChange={(e) => handleChange("leetcodeUsername", e.target.value)}
                      placeholder="Enter your LeetCode username"
                      className="w-full px-4 py-3 bg-neutral-800 border border-gray-700 rounded-lg text-white focus:border-gray-500 focus:outline-none transition-colors duration-200"
                    />
                  </div>
                  <div className="text-gray-400">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a1.64 1.64 0 0 0-.049 2.229 1.644 1.644 0 0 0 2.233.049L8.293 9.93l.926 1.05a1.64 1.64 0 0 0 2.229.049l3.854-4.126 5.274 5.274a1.374 1.374 0 0 0 1.943 0 1.374 1.374 0 0 0 0-1.943L13.483 0z"/>
                    </svg>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  This will be used to fetch your LeetCode problem solving statistics
                </p>
              </div>
            </div>
          </section>

          {/* Preferences Section */}
          <section className="p-6 border border-gray-700 rounded-xl bg-gray-900/20">
            <h2 className="text-xl text-white mb-6 font-medium">Preferences</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm text-gray-300 mb-3">
                  Preferred Language
                </label>
                <select
                  value={settings.language}
                  onChange={(e) => handleChange("language", e.target.value)}
                  className="w-full px-4 py-3 bg-neutral-800 border border-gray-700 rounded-lg text-white focus:border-gray-500 focus:outline-none transition-colors duration-200"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="typescript">TypeScript</option>
                  <option value="go">Go</option>
                  <option value="rust">Rust</option>
                  <option value="java">Java</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-medium">Push Notifications</h3>
                  <p className="text-sm text-gray-400">
                    Get notified about updates
                  </p>
                </div>
                <button
                  onClick={() =>
                    handleChange("notifications", !settings.notifications)
                  }
                  className={`relative w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none ${
                    settings.notifications ? "bg-white" : "bg-gray-700"
                  }`}
                >
                  <div
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-black rounded-full transition-transform duration-200 ${
                      settings.notifications ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-medium">Email Updates</h3>
                  <p className="text-sm text-gray-400">
                    Weekly digest and news
                  </p>
                </div>
                <button
                  onClick={() =>
                    handleChange("emailUpdates", !settings.emailUpdates)
                  }
                  className={`relative w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none ${
                    settings.emailUpdates ? "bg-white" : "bg-gray-700"
                  }`}
                >
                  <div
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-black rounded-full transition-transform duration-200 ${
                      settings.emailUpdates ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>
          </section>

          {/* Privacy Section */}
          <section className="p-6 border border-gray-700 rounded-xl bg-gray-900/20">
            <h2 className="text-xl text-white mb-6 font-medium">Privacy</h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-medium">Public Profile</h3>
                  <p className="text-sm text-gray-400">
                    Make your profile visible to others
                  </p>
                </div>
                <button
                  onClick={() =>
                    handleChange("profilePublic", !settings.profilePublic)
                  }
                  className={`relative w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none ${
                    settings.profilePublic ? "bg-white" : "bg-gray-700"
                  }`}
                >
                  <div
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-black rounded-full transition-transform duration-200 ${
                      settings.profilePublic ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-medium">Show Email</h3>
                  <p className="text-sm text-gray-400">
                    Display email on public profile
                  </p>
                </div>
                <button
                  onClick={() => handleChange("showEmail", !settings.showEmail)}
                  className={`relative w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none ${
                    settings.showEmail ? "bg-white" : "bg-gray-700"
                  }`}
                >
                  <div
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-black rounded-full transition-transform duration-200 ${
                      settings.showEmail ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>
          </section>

          {/* Actions */}
          <div className="flex items-center justify-between pt-6">
            <button className="px-6 py-3 text-gray-400 hover:text-white transition-colors duration-200">
              Reset to defaults
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-8 py-3 bg-white text-black rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "Saving..." : "Save changes"}
            </button>
          </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
