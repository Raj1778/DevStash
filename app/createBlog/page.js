// app/create/page.js
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CreateBlogPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [tags, setTags] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingStage, setLoadingStage] = useState("");
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/me");
        if (response.ok) {
          const userData = await response.json();
          if (userData && userData.user) {
            setUser(userData.user);
            // Auto-fill author with user's name
            setAuthor(userData.user.name || userData.user.username || "");
          }
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setLoading(false);
      }
    };

    // Small delay to ensure skeleton is visible for better UX
    const timer = setTimeout(() => {
      fetchUser();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      // Stage 1: Preparing
      setLoadingStage("preparing");
      await sleep(500);

      // Stage 2: Publishing
      setLoadingStage("publishing");

      const response = await fetch("/api/blogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
          author,
          tags: tags
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag),
        }),
      });

      if (response.ok) {
        const blog = await response.json();

        // Stage 3: Success
        setLoadingStage("success");
        await sleep(800);

        // Stage 4: Redirecting
        setLoadingStage("redirecting");
        await sleep(600);

        router.push(`/blog/${blog.slug}`);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to create blog");
        setIsSubmitting(false);
        setLoadingStage("");
      }
    } catch (error) {
      setError("An unexpected error occurred");
      console.error("Error:", error);
      setIsSubmitting(false);
      setLoadingStage("");
    }
  };

  const getLoadingText = () => {
    switch (loadingStage) {
      case "preparing":
        return "Preparing your blog...";
      case "publishing":
        return "Publishing your story...";
      case "success":
        return "Blog published successfully!";
      case "redirecting":
        return "Taking you to your blog...";
      default:
        return "Publishing...";
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white py-16">
      {/* Loading Overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8 max-w-sm w-full mx-4 text-center">
            {/* Animated Icon */}
            <div className="mb-6 flex justify-center">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-gray-700 rounded-full animate-spin border-t-white"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white animate-pulse"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Loading Text */}
            <div className="space-y-4">
              <p className="text-lg font-medium text-white">
                {getLoadingText()}
              </p>

              {/* Progress Dots */}
              <div className="flex justify-center space-x-2">
                <div
                  className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                    loadingStage === "preparing" ? "bg-white" : "bg-gray-600"
                  }`}
                ></div>
                <div
                  className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                    loadingStage === "publishing" ? "bg-white" : "bg-gray-600"
                  }`}
                ></div>
                <div
                  className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                    loadingStage === "success" ? "bg-green-500" : "bg-gray-600"
                  }`}
                ></div>
                <div
                  className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                    loadingStage === "redirecting" ? "bg-white" : "bg-gray-600"
                  }`}
                ></div>
              </div>

              {/* Success Checkmark */}
              {loadingStage === "success" && (
                <div className="mt-4 flex justify-center">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-light text-white mb-4">
            Create a New Blog
          </h1>
          <p className="text-gray-400 text-lg">
            Share your thoughts, experiences, and insights with the community
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-900 bg-opacity-50 border border-red-700 text-red-100 rounded-xl flex items-center">
            <svg
              className="w-5 h-5 mr-3 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Title Field */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
              Blog Title
            </label>
            {loading ? (
              <div className="h-12 bg-gray-800/50 rounded-lg animate-pulse"></div>
            ) : (
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your blog title..."
                required
              />
            )}
          </div>

          {/* Author Field */}
          <div>
            <label htmlFor="author" className="block text-sm font-medium text-gray-300 mb-2">
              Author
            </label>
            {loading ? (
              <div className="h-12 bg-gray-800/50 rounded-lg animate-pulse"></div>
            ) : (
              <input
                type="text"
                id="author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                placeholder={loading ? "Loading..." : "Author name"}
                disabled={loading || isSubmitting}
                required
              />
            )}
            {loading && (
              <p className="mt-2 text-sm text-gray-400">Loading your profile...</p>
            )}
          </div>

          {/* Tags Field */}
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-300 mb-2">
              Tags (comma-separated)
            </label>
            {loading ? (
              <div className="h-12 bg-gray-800/50 rounded-lg animate-pulse"></div>
            ) : (
              <input
                type="text"
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., React, JavaScript, Web Development"
              />
            )}
          </div>

          {/* Content Field */}
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-300 mb-2">
              Blog Content
            </label>
            {loading ? (
              <div className="h-64 bg-gray-800/50 rounded-lg animate-pulse"></div>
            ) : (
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={12}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                placeholder="Write your blog content here... You can use Markdown formatting."
                required
              />
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            {loading ? (
              <div className="h-12 w-32 bg-gray-800/50 rounded-lg animate-pulse"></div>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? "Creating..." : "Create Blog"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
