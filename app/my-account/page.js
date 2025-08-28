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
    linkedinUsername: "",

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
              leetcodeUsername: data.user.leetcodeUsername || "",
              linkedinUsername: data.user.linkedinUsername || ""
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

    // Small delay to ensure skeleton is visible for better UX
    const timer = setTimeout(() => {
      fetchUser();
    }, 100);

    return () => clearTimeout(timer);
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
          leetcodeUsername: settings.leetcodeUsername,
          linkedinUsername: settings.linkedinUsername
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
                {loading ? (
                  <div className="h-12 bg-neutral-800 rounded-lg animate-pulse"></div>
                ) : (
                  <input
                    type="text"
                    value={settings.displayName}
                    onChange={(e) => handleChange("displayName", e.target.value)}
                    className="w-full px-4 py-3 bg-neutral-800 border border-gray-700 rounded-lg text-white focus:border-gray-500 focus:outline-none transition-colors duration-200"
                  />
                )}
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Email
                </label>
                {loading ? (
                  <div className="h-12 bg-neutral-800 rounded-lg animate-pulse"></div>
                ) : (
                  <input
                    type="email"
                    value={settings.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className="w-full px-4 py-3 bg-neutral-800 border border-gray-700 rounded-lg text-white focus:border-gray-500 focus:outline-none transition-colors duration-200"
                  />
                )}
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">Bio</label>
                {loading ? (
                  <div className="h-24 bg-neutral-800 rounded-lg animate-pulse"></div>
                ) : (
                  <textarea
                    value={settings.bio}
                    onChange={(e) => handleChange("bio", e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 bg-neutral-800 border border-gray-700 rounded-lg text-white focus:border-gray-500 focus:outline-none transition-colors duration-200 resize-none"
                  />
                )}
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
                    {loading ? (
                      <div className="h-12 bg-neutral-800 rounded-lg animate-pulse"></div>
                    ) : (
                      <input
                        type="text"
                        value={settings.githubUsername}
                        onChange={(e) => handleChange("githubUsername", e.target.value)}
                        placeholder="Enter your GitHub username"
                        className="w-full px-4 py-3 bg-neutral-800 border border-gray-700 rounded-lg text-white focus:border-gray-500 focus:outline-none transition-colors duration-200"
                      />
                    )}
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
                    {loading ? (
                      <div className="h-12 bg-neutral-800 rounded-lg animate-pulse"></div>
                    ) : (
                      <input
                        type="text"
                        value={settings.leetcodeUsername}
                        onChange={(e) => handleChange("leetcodeUsername", e.target.value)}
                        placeholder="Enter your LeetCode username"
                        className="w-full px-4 py-3 bg-neutral-800 border border-gray-700 rounded-lg text-white focus:border-gray-500 focus:outline-none transition-colors duration-200"
                      />
                    )}
                  </div>
                  <div className="text-gray-400">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.01 3.5c0-.828-.656-1.5-1.5-1.5h-15c-.828 0-1.5.672-1.5 1.5v17c0 .828.672 1.5 1.5 1.5h15c.844 0 1.5-.672 1.5-1.5v-17zm-1.5 0v17h-15v-17h15z"/>
                      <path d="M14.5 7.5c0-.828-.656-1.5-1.5-1.5h-3c-.828 0-1.5.672-1.5 1.5v3c0 .828.672 1.5 1.5 1.5h3c.844 0 1.5-.672 1.5-1.5v-3zm-1.5 0v3h-3v-3h3z"/>
                    </svg>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  This will be used to fetch your LeetCode problem solving stats
                </p>
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  LinkedIn Username
                </label>
                <div className="flex items-center space-x-3">
                  <div className="flex-1">
                    {loading ? (
                      <div className="h-12 bg-neutral-800 rounded-lg animate-pulse"></div>
                    ) : (
                      <input
                        type="text"
                        value={settings.linkedinUsername}
                        onChange={(e) => handleChange("linkedinUsername", e.target.value)}
                        placeholder="Enter your LinkedIn username"
                        className="w-full px-4 py-3 bg-neutral-800 border border-gray-700 rounded-lg text-white focus:border-gray-500 focus:outline-none transition-colors duration-200"
                      />
                    )}
                  </div>
                  <div className="text-gray-400">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.01 3.5c0-.828-.656-1.5-1.5-1.5h-15c-.828 0-1.5.672-1.5 1.5v17c0 .828.672 1.5 1.5 1.5h15c.844 0 1.5-.672 1.5-1.5v-17zm-1.5 0v17h-15v-17h15z"/>
                      <path d="M14.5 7.5c0-.828-.656-1.5-1.5-1.5h-3c-.828 0-1.5.672-1.5 1.5v3c0 .828.672 1.5 1.5 1.5h3c.844 0 1.5-.672 1.5-1.5v-3zm-1.5 0v3h-3v-3h3z"/>
                    </svg>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  This will be used to fetch your LinkedIn profile and connections
                </p>
              </div>
            </div>
          </section>

         

          {/* Actions */}
          <div className="flex items-center justify-between pt-6">
            
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
