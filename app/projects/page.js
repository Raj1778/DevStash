// app/projects/page.js
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ProjectCardSkeleton } from "@/components/Skeleton";

const ProjectCard = ({ project }) => {
  const getLanguageColor = (lang) => {
    const colors = {
      JavaScript: "#f1c40f",
      TypeScript: "#3498db",
      Python: "#2ecc71",
      React: "#61dafb",
      "Next.js": "#000000",
      "Node.js": "#27ae60",
      Go: "#00add8",
      Rust: "#ce422b",
      Java: "#f39c12",
      PHP: "#9b59b6",
    };
    return colors[lang] || "#95a5a6";
  };

  const getStatusColor = (status) => {
    const colors = {
      Active: "text-green-400 bg-green-400/10 border-green-400/20",
      Completed: "text-blue-400 bg-blue-400/10 border-blue-400/20",
      Paused: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
      Archived: "text-gray-400 bg-gray-400/10 border-gray-400/20",
    };
    return colors[status] || "text-gray-400 bg-gray-400/10 border-gray-400/20";
  };

  return (
    <div className="group p-6 border border-gray-700 rounded-xl bg-gray-900/20 hover:bg-gray-900/40 hover:border-gray-500 transition-all duration-300">
      {/* Header with Folder Icon */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
              <path
                d="M10 4H4C2.89543 4 2 4.89543 2 6V18C2 19.1046 2.89543 20 4 20H20C21.1046 20 22 19.1046 22 18V8C22 6.89543 21.1046 6 20 6H12L10 4Z"
                fill={getLanguageColor(project.language)}
                className="opacity-90"
              />
              <path
                d="M10 4H4C2.89543 4 2 4.89543 2 6V18C2 19.1046 2.89543 20 4 20H20C21.1046 20 22 19.1046 22 18V8C22 6.89543 21.1046 6 20 6H12L10 4Z"
                stroke={getLanguageColor(project.language)}
                strokeWidth="1.5"
                fill="none"
                className="opacity-60"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-medium text-white group-hover:text-gray-100 transition-colors">
              {project.name}
            </h3>
            <p className="text-sm text-gray-400">{project.language}</p>
          </div>
        </div>

        <span
          className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(
            project.status
          )}`}
        >
          {project.status}
        </span>
      </div>

      {/* Description */}
      <p className="text-gray-300 text-sm mb-4 leading-relaxed">
        {project.description}
      </p>

      {/* Stats */}
      <div className="flex items-center space-x-4 mb-4 text-xs text-gray-400">
        <span className="flex items-center">
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
              clipRule="evenodd"
            />
          </svg>
          {project.lastUpdated}
        </span>
        <span className="flex items-center">
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          {project.stars}
        </span>
        {project.forks !== undefined && (
          <span className="flex items-center">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" />
            </svg>
            {project.forks}
          </span>
        )}
        <span className="flex items-center">
          <div
            className="w-2 h-2 rounded-full mr-1"
            style={{ backgroundColor: getLanguageColor(project.language) }}
          ></div>
          {project.size}
        </span>
      </div>

      {/* Tech Stack */}
      <div className="flex flex-wrap gap-1 mb-5">
        {project.techStack && project.techStack.length > 0 ? (
          <>
            {project.techStack.slice(0, 4).map((tech, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs bg-gray-800/60 text-gray-300 rounded border border-gray-700"
              >
                {tech}
              </span>
            ))}
            {project.techStack.length > 4 && (
              <span className="px-2 py-1 text-xs bg-gray-800/40 text-gray-500 rounded border border-gray-800">
                +{project.techStack.length - 4}
              </span>
            )}
          </>
        ) : (
          <span className="px-2 py-1 text-xs bg-gray-800/40 text-gray-500 rounded border border-gray-800">
            No topics
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800/60 rounded-lg transition-all duration-200"
            title="View on GitHub"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
          </a>
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-800/60 rounded-lg transition-all duration-200"
              title="Live Demo"
            >
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
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          )}
          <button
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800/60 rounded-lg transition-all duration-200"
            title="Clone Repository"
          >
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
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </button>
        </div>

        <button className="text-sm text-gray-400 hover:text-white transition-colors duration-200">
          Manage →
        </button>
      </div>
    </div>
  );
};

export default function ProjectsPage() {
  const [filter, setFilter] = useState("all");
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // Get user data first
        const userRes = await fetch("/api/me");
        if (userRes.ok) {
          const userData = await userRes.json();
          if (userData && userData.user) {
            setUser(userData.user);
            
            // Fetch GitHub repositories if username is available
            if (userData.user.githubUsername) {
              const githubRes = await fetch(`/api/github?username=${userData.user.githubUsername}`);
              if (githubRes.ok) {
                const githubData = await githubRes.json();
                
                // Convert GitHub repos to project format
                const processedProjects = githubData.repositories
                  .filter(repo => !repo.private && !repo.archived) // Only show public, non-archived repos
                  .map(repo => ({
                    id: repo.id,
                    name: repo.name,
                    description: repo.description || "No description available",
                    language: repo.language || "Unknown",
                    status: repo.fork ? "Forked" : "Active",
                    lastUpdated: formatDate(repo.lastUpdated),
                    stars: repo.stars,
                    size: formatSize(repo.size),
                    techStack: repo.topics || [],
                    github: repo.url,
                    demo: repo.homepage || null,
                    fork: repo.fork,
                    forks: repo.forks
                  }));
                
                setProjects(processedProjects);
              }
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Helper functions
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  const formatSize = (sizeInKB) => {
    if (sizeInKB < 1024) return `${sizeInKB} KB`;
    return `${(sizeInKB / 1024).toFixed(1)} MB`;
  };

  const filteredProjects =
    filter === "all"
      ? projects
      : projects.filter((p) => p.status.toLowerCase() === filter || 
          (filter === "active" && !p.fork) ||
          (filter === "completed" && p.fork));

  return (
    <div className="min-h-screen bg-black px-6 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-light text-white mb-2 tracking-tight">
                Projects
              </h1>
              <div className="w-16 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent mb-4"></div>
              <p className="text-gray-400">Your development portfolio</p>
            </div>

            <Link
              href="/projects/new"
              className="px-6 py-3 bg-white text-black rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200 flex items-center"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              New Project
            </Link>
          </div>

          {/* Filter Tabs */}
          <div className="flex space-x-1 bg-gray-800/30 p-1 rounded-lg inline-flex">
            {["all", "active", "completed", "paused"].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 capitalize ${
                  filter === tab
                    ? "bg-white text-black"
                    : "text-gray-400 hover:text-white hover:bg-gray-700/50"
                }`}
              >
                {tab === "all" ? "All Projects" : tab}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ProjectCardSkeleton />
            <ProjectCardSkeleton />
            <ProjectCardSkeleton />
            <ProjectCardSkeleton />
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto p-8 border border-gray-700 rounded-xl bg-gray-900/20">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gray-800 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <p className="text-gray-400 text-lg mb-6">
                {user && user.githubUsername 
                  ? "No public repositories found" 
                  : "Connect your GitHub account to see your projects"
                }
              </p>
              {!user && (
                <Link
                  href="/login"
                  className="inline-flex items-center px-6 py-3 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium"
                >
                  Connect GitHub
                </Link>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredProjects.map((project, index) => (
              <ProjectCard key={project.id || index} project={project} />
            ))}
          </div>
        )}

        {/* Stats Footer */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 text-sm">
            {projects.length} {projects.length === 1 ? "project" : "projects"} •
            {projects.filter((p) => !p.fork).length} original •
            {projects.reduce((acc, p) => acc + p.stars, 0)} total stars
          </p>
        </div>
      </div>
    </div>
  );
}
