"use client";
import React from "react";

const AboutDevelopers = () => {
  const developers = [
    {
      name: "Raj",
      title: "Full Stack Web Developer",
      description:
        "Architect of digital solutions who transforms complex ideas into elegant, scalable web applications. Masters the art of seamless user experiences backed by robust server architecture.",
      skills: [
        "JavaScript",
        "React",
        "Node.js",
        "MongoDB",
        "Express",
        "Next.js",
        "TypeScript",
        "PostgreSQL",
      ],
      linkedin: "https://linkedin.com/in/raj", // Replace with actual LinkedIn
      gradient: "from-blue-500/20 to-cyan-500/20",
      border: "border-blue-500/30",
      accent: "text-blue-400",
    },
    {
      name: "Pallavi Jaiswal",
      title: "Frontend Developer & UI/UX Maestro",
      description:
        "Visual storyteller who crafts pixel-perfect interfaces and intuitive user journeys. Bridges the gap between artistic vision and functional design with meticulous attention to detail.",
      skills: [
        "React",
        "Figma",
        "Canva",
        "Bootstrap",
        "Tailwind CSS",
        "JavaScript",
        "Adobe XD",
        "Responsive Design",
      ],
      linkedin: "https://linkedin.com/in/pallavi-jaiswal", // Replace with actual LinkedIn
      gradient: "from-purple-500/20 to-pink-500/20",
      border: "border-purple-500/30",
      accent: "text-purple-400",
    },
  ];

  return (
    <div className="bg-[#0a0a0a] min-h-screen py-6 px-4 md:px-6 relative overflow-hidden">
      {/* Ambient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-zinc-900/20 via-transparent to-zinc-800/20 pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-light text-white mb-4">
            Meet the Team
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            The creative minds behind the code, crafting digital experiences
            that matter.
          </p>
        </div>

        {/* Developer Cards */}
        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          {developers.map((dev, index) => (
            <DeveloperCard key={index} developer={dev} />
          ))}
        </div>
      </div>
    </div>
  );
};

const DeveloperCard = ({ developer }) => {
  const handleClick = () => {
    window.open(developer.linkedin, "_blank");
  };

  return (
    <div
      onClick={handleClick}
      className={`bg-gradient-to-br ${developer.gradient} backdrop-blur-xl border ${developer.border} 
                 rounded-2xl p-8 cursor-pointer group hover:scale-105 transition-all duration-300 
                 shadow-xl hover:shadow-2xl active:scale-95`}
    >
      {/* Name & Title */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-white mb-2 group-hover:text-white transition-colors">
          {developer.name}
        </h2>
        <p
          className={`${developer.accent} font-medium text-sm tracking-wide uppercase`}
        >
          {developer.title}
        </p>
      </div>

      {/* Description */}
      <p className="text-zinc-300 leading-relaxed mb-8 text-sm md:text-base">
        {developer.description}
      </p>

      {/* Skills */}
      <div className="mb-6">
        <h3 className="text-white font-medium mb-4 text-sm">
          Technical Arsenal
        </h3>
        <div className="flex flex-wrap gap-2">
          {developer.skills.map((skill, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-black/30 text-zinc-300 text-xs rounded-full border border-zinc-700/50
                         group-hover:bg-black/40 group-hover:border-zinc-600/50 transition-all duration-200"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* LinkedIn CTA */}
      <div className="flex items-center space-x-2 text-zinc-400 group-hover:text-white transition-colors">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
        <span className="text-xs font-medium">Connect on LinkedIn</span>
      </div>

      {/* Hover indicator */}
      <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-white/20 group-hover:bg-white/40 transition-all duration-300" />
    </div>
  );
};

export default AboutDevelopers;
