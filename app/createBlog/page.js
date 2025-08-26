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

    fetchUser();
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
    <div className="min-h-screen bg-black text-white">
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

      <div className="max-w-3xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-light text-white mb-3">
            What are you thinking?
          </h1>
          <p className="text-gray-400 text-lg">
            Share your thoughts with the world...
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
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Author Name */}
          <div>
            <label className="block text-gray-300 text-sm mb-2 font-medium">
              Author
            </label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder={loading ? "Loading..." : "Your name"}
              className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              required
              disabled={isSubmitting || loading}
            />
            {loading && (
              <p className="text-gray-500 text-sm mt-1">Loading your profile...</p>
            )}
          </div>

          {/* Blog Title */}
          <div>
            <label className="block text-gray-300 text-sm mb-2 font-medium">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Blog title"
              className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-gray-300 text-sm mb-2 font-medium">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="technology, programming, webdev"
              className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              disabled={isSubmitting}
            />
          </div>

          {/* Blog Content */}
          <div>
            <label className="block text-gray-300 text-sm mb-2 font-medium">
              Content
            </label>
            <textarea
              rows={15}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your blog content here..."
              className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={
                !title.trim() ||
                !content.trim() ||
                !author.trim() ||
                isSubmitting
              }
              className="px-8 py-3 bg-white text-black rounded-full font-medium hover:bg-gray-200 transition-all duration-200 active:scale-95 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {!isSubmitting && (
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              )}
              <span>{isSubmitting ? "Publishing..." : "Publish Blog"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
