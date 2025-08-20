import React from "react";

const Blog = ({ title, author, date, image, content, tags }) => (
  <article className="max-w-2xl w-full mb-16 last:mb-0">
    <div className="mb-6">
      <img
        src={image}
        alt={title}
        className="w-full h-64 object-cover rounded-sm"
      />
    </div>

    <div className="space-y-4">
      <h1 className="text-2xl md:text-3xl font-light text-white leading-tight">
        {title}
      </h1>

      <div className="flex items-center space-x-4 text-sm text-gray-400">
        <span>{author}</span>
        <span>•</span>
        <span>{date}</span>
      </div>

      <div className="space-y-4 text-gray-300 leading-relaxed">
        {content.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 pt-4">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="px-3 py-1 text-xs bg-gray-800 text-gray-300 rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  </article>
);

const BlogPage = () => {
  const blogs = [
    {
      title: "Drone Detection System",
      author: "Ajatshatru Singh",
      date: "August 19, 2025",
      image: "/drone.webp",
      content: [
        "With the rise of commercial and hobby drones, security threats have evolved in ways we never imagined. Drone detection systems are becoming essential for airports, government buildings, and even private properties to ensure safety and privacy.",
        "Modern drone detection combines radar, radio frequency (RF) scanners, and AI-powered video analysis to identify drones in real-time. These systems can detect drones before they enter restricted zones, classify the type of drone, and even predict its flight path.",
        "In addition to security, drone detection technology is also being used for wildlife protection, event management, and airspace monitoring. As drones become more accessible, integrating smart detection solutions is no longer optional—it's a necessity for anyone looking to protect sensitive spaces.",
        "Stay tuned as we explore the latest innovations in anti-drone technology and how they are shaping the future of aerial security.",
      ],
      tags: ["Security", "Drones", "AI Tech"],
    },
    {
      title: "Cryptocurrency Websites: The Future of Finance",
      author: "Pallavi Jaiswal",
      date: "August 15, 2025",
      image: "/crypto.webp",
      content: [
        "Cryptocurrency has transformed the way we think about finance and transactions. Websites dedicated to crypto trading, wallets, and news have become a central hub for both beginners and experts.",
        "These platforms combine blockchain technology, AI analytics, and user-friendly design to make crypto accessible and secure.",
        "As digital currencies continue to grow in popularity, investing in and understanding crypto websites is essential for staying ahead in the financial world.",
      ],
      tags: ["Cryptocurrency", "Finance", "Blockchain"],
    },
    {
      title:
        "Leveling Up Code: How Gaming Shapes the Next Generation of Developers",
      author: "Sparsh Srivastava",
      date: "August 10, 2025",
      image: "/unreal.webp",
      content: [
        "Gaming is more than entertainment—it's shaping how coders approach problem-solving and software development.",
        "From AI in games to graphics engines and real-time simulations, developers are learning valuable programming concepts through gaming platforms.",
        "Gaming fosters creativity, logic, and collaboration, which translates into innovations in coding and tech across industries.",
      ],
      tags: ["Gaming", "Programming", "Innovation"],
    },
  ];

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <header className="mb-16">
          <h1 className="text-4xl md:text-5xl font-light text-white mb-2">
            Blog
          </h1>
          <p className="text-gray-400">Thoughts on technology and innovation</p>
        </header>

        <div className="flex flex-col items-center">
          {blogs.map((blog, idx) => (
            <Blog key={idx} {...blog} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
