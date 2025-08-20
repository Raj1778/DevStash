"use client";
import React, { useState, useRef, useEffect } from "react";

// SVG Icons
const Plus = ({ size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M12 5v14M5 12h14" />
  </svg>
);

const Menu = ({ size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <line x1="4" y1="12" x2="20" y2="12" />
    <line x1="4" y1="6" x2="20" y2="6" />
    <line x1="4" y1="18" x2="20" y2="18" />
  </svg>
);

const Trash = ({ size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <polyline points="3,6 5,6 21,6" />
    <path d="m19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
  </svg>
);

const Star = ({ size = 20, filled = false }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="2"
  >
    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26 12,2" />
  </svg>
);

const FileText = ({ size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2-2V8z" />
    <polyline points="14,2 14,8 20,8" />
  </svg>
);

const X = ({ size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentTitle, setCurrentTitle] = useState("");
  const [currentContent, setCurrentContent] = useState("");
  const [showSidebar, setShowSidebar] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const saveTimeoutRef = useRef(null);

  // Handle responsive behavior
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setShowSidebar(!mobile);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    // Initialize with sample data
    const sampleNotes = [
      {
        id: 1,
        title: "Welcome to DevStash Notes",
        content:
          "Welcome to your minimal notes app. Just click anywhere to start writing - your changes will be saved automatically.",
        starred: false,
        createdAt: new Date().toISOString(),
      },
    ];
    setNotes(sampleNotes);
    setSelectedNote(sampleNotes[0]);
    setCurrentTitle(sampleNotes[0].title);
    setCurrentContent(sampleNotes[0].content);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Auto-save with debouncing
  useEffect(() => {
    if (!selectedNote) return;

    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

    saveTimeoutRef.current = setTimeout(() => {
      setNotes((prev) =>
        prev.map((note) =>
          note.id === selectedNote.id
            ? { ...note, title: currentTitle, content: currentContent }
            : note
        )
      );
      setSelectedNote((prev) => ({
        ...prev,
        title: currentTitle,
        content: currentContent,
      }));
    }, 1000);

    return () => clearTimeout(saveTimeoutRef.current);
  }, [currentTitle, currentContent, selectedNote]);

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const createNewNote = () => {
    const newNote = {
      id: Date.now(),
      title: "Untitled Note",
      content: "",
      starred: false,
      createdAt: new Date().toISOString(),
    };
    setNotes([newNote, ...notes]);
    selectNote(newNote);
    if (isMobile) setShowSidebar(false);
  };

  const selectNote = (note) => {
    setSelectedNote(note);
    setCurrentTitle(note.title);
    setCurrentContent(note.content);
    if (isMobile) setShowSidebar(false);
  };

  const deleteNote = (noteId) => {
    const updatedNotes = notes.filter((note) => note.id !== noteId);
    setNotes(updatedNotes);
    if (selectedNote?.id === noteId) {
      const nextNote = updatedNotes[0] || null;
      setSelectedNote(nextNote);
      setCurrentTitle(nextNote?.title || "");
      setCurrentContent(nextNote?.content || "");
    }
  };

  const toggleStar = (noteId) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === noteId ? { ...note, starred: !note.starred } : note
      )
    );
    if (selectedNote?.id === noteId) {
      setSelectedNote((prev) => ({ ...prev, starred: !selectedNote.starred }));
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex relative">
      {/* Mobile Backdrop */}
      {isMobile && showSidebar && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setShowSidebar(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`${showSidebar ? "translate-x-0" : "-translate-x-full"} ${
          isMobile ? "fixed z-50" : "relative"
        } w-80 md:w-80 bg-zinc-900 border-r border-zinc-800 flex flex-col transition-transform duration-300 ease-in-out h-screen`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-zinc-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Notes</h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={createNewNote}
                className="p-2 hover:bg-zinc-800 rounded transition-colors"
              >
                <Plus size={18} />
              </button>
              {isMobile && (
                <button
                  onClick={() => setShowSidebar(false)}
                  className="p-2 hover:bg-zinc-800 rounded transition-colors"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </div>
          <input
            type="text"
            placeholder="🔍 Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-zinc-600"
          />
        </div>

        {/* Notes List */}
        <div className="flex-1 overflow-y-auto">
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              onClick={() => selectNote(note)}
              className={`group p-4 border-b border-zinc-800 cursor-pointer hover:bg-zinc-800 transition-colors ${
                selectedNote?.id === note.id
                  ? "bg-zinc-800 border-l-2 border-l-white"
                  : ""
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-medium truncate">{note.title}</h3>
                    {note.starred && (
                      <Star
                        size={14}
                        filled
                        className="text-yellow-500 flex-shrink-0"
                      />
                    )}
                  </div>
                  <p className="text-sm text-zinc-400 line-clamp-2">
                    {note.content.substring(0, 100)}...
                  </p>
                  <p className="text-xs text-zinc-500 mt-1">
                    {new Date(note.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-1 ml-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleStar(note.id);
                    }}
                    className="p-1 hover:bg-zinc-700 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Star
                      size={14}
                      filled={note.starred}
                      className={
                        note.starred ? "text-yellow-500" : "text-zinc-500"
                      }
                    />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNote(note.id);
                    }}
                    className="p-1 hover:bg-zinc-700 rounded text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="h-16 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between px-4 md:px-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="p-2 hover:bg-zinc-800 rounded transition-colors"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-lg md:text-xl font-bold truncate">
              DevStash Notes
            </h1>
          </div>

          {selectedNote && (
            <button
              onClick={() => toggleStar(selectedNote.id)}
              className={`p-2 rounded transition-colors ${
                selectedNote.starred
                  ? "text-yellow-500"
                  : "text-zinc-500 hover:text-white"
              }`}
            >
              <Star size={20} filled={selectedNote.starred} />
            </button>
          )}
        </div>

        {/* Editor Area */}
        <div className="flex-1 overflow-hidden">
          {selectedNote ? (
            <div className="h-full flex flex-col">
              {/* Title */}
              <div className="p-4 md:p-6 border-b border-zinc-800">
                <input
                  type="text"
                  value={currentTitle}
                  onChange={(e) => setCurrentTitle(e.target.value)}
                  className="text-xl md:text-2xl font-bold bg-transparent border-none outline-none text-white w-full placeholder-zinc-500"
                  placeholder="Note title..."
                />
              </div>

              {/* Content */}
              <div className="flex-1 p-4 md:p-6 overflow-y-auto">
                <textarea
                  value={currentContent}
                  onChange={(e) => setCurrentContent(e.target.value)}
                  className="w-full h-full bg-transparent border-none outline-none text-white placeholder-zinc-500 resize-none text-base leading-relaxed p-2 md:p-4"
                  placeholder="Start writing..."
                />
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-zinc-500 p-4">
              <div className="text-center">
                <FileText size={48} className="mx-auto mb-4 opacity-50" />
                <p className="text-lg mb-2">No note selected</p>
                <p className="text-sm text-center">
                  Choose a note from the sidebar or create a new one
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notes;
