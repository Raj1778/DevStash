"use client";

import { useState } from "react";

export default function CreateBlogPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ title, content, author });
    // Later: send data to API (POST request)
  };

  return (
    <div className="min-h-screen bg-black text-white">
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

        {/* Form */}
        <div className="space-y-6">
          {/* Author Name */}
          <div>
            <label className="block text-gray-400 text-sm mb-2">Author</label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Your name"
              className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Blog Title */}
          <div>
            <label className="block text-gray-400 text-sm mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Blog title"
              className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Blog Content */}
          <div>
            <label className="block text-gray-400 text-sm mb-2">Content</label>
            <textarea
              rows={15}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your blog content here..."
              className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={!title.trim() || !content.trim() || !author.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded 
             hover:bg-blue-700 
             transition-transform duration-150 
             active:scale-95 active:translate-y-[2px]
             disabled:bg-neutral-900 disabled:text-gray-600 disabled:cursor-not-allowed"
          >
            Publish Blog
          </button>
        </div>
      </div>
    </div>
  );
}
