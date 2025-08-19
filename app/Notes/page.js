"use client";
import React, { useState, useRef, useEffect } from "react";

// Simple SVG Icons
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

const Search = ({ size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
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

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentTitle, setCurrentTitle] = useState("");
  const [currentContent, setCurrentContent] = useState("");
  const [showSidebar, setShowSidebar] = useState(true);
  const [mounted, setMounted] = useState(false);

  const titleRef = useRef(null);
  const contentRef = useRef(null);
  const saveTimeoutRef = useRef(null);

  // Handle hydration
  useEffect(() => {
    setMounted(true);
    // Initialize with sample data only on client
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
  }, []);

  // Auto-save function with debouncing
  const autoSave = () => {
    if (!selectedNote) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      const updatedNotes = notes.map((note) =>
        note.id === selectedNote.id
          ? { ...note, title: currentTitle, content: currentContent }
          : note
      );

      setNotes(updatedNotes);
      setSelectedNote({
        ...selectedNote,
        title: currentTitle,
        content: currentContent,
      });
    }, 1000); // Save after 1 second of inactivity
  };

  // Trigger auto-save when title or content changes
  useEffect(() => {
    if (selectedNote && mounted) {
      autoSave();
    }
  }, [currentTitle, currentContent, selectedNote, mounted]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  if (!mounted) {
    return <div className="min-h-screen bg-black"></div>;
  }

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
    setSelectedNote(newNote);
    setCurrentTitle(newNote.title);
    setCurrentContent(newNote.content);
  };

  const selectNote = (note) => {
    setSelectedNote(note);
    setCurrentTitle(note.title);
    setCurrentContent(note.content);
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
    setNotes(
      notes.map((note) =>
        note.id === noteId ? { ...note, starred: !note.starred } : note
      )
    );
    if (selectedNote?.id === noteId) {
      setSelectedNote({ ...selectedNote, starred: !selectedNote.starred });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Collapsible Sidebar */}
      {showSidebar && (
        <div className="w-80 bg-zinc-900 border-r border-zinc-800 flex flex-col">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-zinc-800">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Notes</h2>
              <button
                onClick={createNewNote}
                className="p-2 hover:bg-zinc-800 rounded transition-colors"
              >
                <Plus size={18} />
              </button>
            </div>
            <div className="relative flex-row">
              <input
                type="text"
                placeholder=" 🔍 Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-zinc-600"
              />
            </div>
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
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="h-16 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="p-2 hover:bg-zinc-800 rounded transition-colors"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-xl font-bold">DevStash Notes</h1>
          </div>

          {selectedNote && (
            <div className="flex items-center space-x-2">
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
            </div>
          )}
        </div>

        {/* Editor Area */}
        <div className="flex-1 overflow-hidden">
          {selectedNote ? (
            <div className="h-full flex flex-col">
              {/* Title */}
              <div className="p-6 border-b border-zinc-800">
                <input
                  ref={titleRef}
                  type="text"
                  value={currentTitle}
                  onChange={(e) => setCurrentTitle(e.target.value)}
                  className="text-2xl font-bold bg-transparent border-none outline-none text-white w-full placeholder-zinc-500"
                  placeholder="Note title..."
                />
              </div>

              {/* Content */}
              <div className="flex-1 p-6 overflow-y-auto">
                <textarea
                  ref={contentRef}
                  value={currentContent}
                  onChange={(e) => setCurrentContent(e.target.value)}
                  className="w-full h-full bg-transparent border-none outline-none text-white placeholder-zinc-500 resize-none text-base leading-relaxed"
                  placeholder="Start writing..."
                />
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-zinc-500">
              <div className="text-center">
                <FileText size={48} className="mx-auto mb-4 opacity-50" />
                <p className="text-lg mb-2">No note selected</p>
                <p className="text-sm">
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
