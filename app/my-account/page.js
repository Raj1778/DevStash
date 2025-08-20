// app/settings/page.js
"use client";
import { useState } from "react";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    // Profile
    displayName: "John Developer",
    email: "john@example.com",
    bio: "Full-stack developer passionate about clean code",

    // Preferences
    theme: "dark",
    language: "javascript",
    notifications: true,
    emailUpdates: false,

    // Privacy
    profilePublic: true,
    showEmail: false,
  });

  const handleChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    console.log("Saving settings:", settings);
    // Handle save logic
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
              className="px-8 py-3 bg-white text-black rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
