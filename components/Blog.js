import React from "react";
import Image from "next/image";

const Blog = ({ title, author, date, image, content, tags }) => {
  return (
    <div className="max-w-4xl w-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-lg mb-12">
      {/* Title */}
      <h1 className="text-4xl md:text-5xl font-bold text-center text-white mb-2">
        {title}
      </h1>

      {/* Author and Date */}
      <p className="text-center text-gray-300 text-sm mb-6">
        by {author} • {date}
      </p>

      {/* Image */}
      <div className="w-full h-64 mb-6 relative rounded-xl overflow-hidden">
        <Image src={image} alt={title} fill className="object-cover" />
      </div>

      {/* Blog content */}
      <div className="prose prose-invert max-w-full text-white text-lg space-y-4">
        {content.map((paragraph, idx) => (
          <p key={idx}>{paragraph}</p>
        ))}
      </div>

      {/* Tags */}
      <div className="mt-8 flex flex-wrap gap-3">
        {tags.map((tag, idx) => (
          <span
            key={idx}
            className="bg-purple-700/50 text-white px-4 py-1 rounded-full text-sm"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Blog;
