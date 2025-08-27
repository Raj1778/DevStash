"use client";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { showNoteSaved, showNoteDeleted, showNoteStarred, showNoteUnstarred, showCopied, showError, showSuccess } from "@/lib/toast";

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

const LoadingSpinner = ({ size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className="animate-spin"
  >
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
  </svg>
);

// Code detection and formatting utilities
const detectCodeBlocks = (content) => {
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
  const inlineCodeRegex = /`([^`]+)`/g;
  
  let formattedContent = content;
  let codeBlocks = [];
  let blockIndex = 0;
  
  // Replace code blocks with placeholders
  formattedContent = formattedContent.replace(codeBlockRegex, (match, language, code) => {
    const placeholder = `__CODE_BLOCK_${blockIndex}__`;
    codeBlocks.push({
      type: 'block',
      language: language || 'text',
      code: code.trim(),
      placeholder
    });
    blockIndex++;
    return placeholder;
  });
  
  // Replace inline code with placeholders
  formattedContent = formattedContent.replace(inlineCodeRegex, (match, code) => {
    const placeholder = `__INLINE_CODE_${blockIndex}__`;
    codeBlocks.push({
      type: 'inline',
      code: code,
      placeholder
    });
    blockIndex++;
    return placeholder;
  });
  
  return { formattedContent, codeBlocks };
};

const formatCodeBlock = (codeBlock) => {
  const { type, language, code } = codeBlock;
  
  if (type === 'inline') {
    return (
      <code className="bg-zinc-800 text-green-400 px-1.5 py-0.5 rounded text-sm font-mono">
        {code}
      </code>
    );
  }
  
  return (
    <div className="my-4 rounded-lg overflow-hidden border border-zinc-700">
      <div className="bg-zinc-800 px-4 py-2 border-b border-zinc-700 flex items-center justify-between">
        <span className="text-xs text-zinc-400 font-mono uppercase">
          {language || 'text'}
        </span>
        <button
          onClick={() => {
            navigator.clipboard.writeText(code);
            showCopied();
          }}
          className="text-xs text-zinc-400 hover:text-white transition-colors"
        >
          Copy
        </button>
      </div>
      <pre className="bg-zinc-900 p-4 overflow-x-auto">
        <code className="text-sm font-mono text-zinc-100">
          {code}
        </code>
      </pre>
    </div>
  );
};

const renderFormattedContent = (content) => {
  const { formattedContent, codeBlocks } = detectCodeBlocks(content);
  
  // Split content by code block placeholders
  const parts = formattedContent.split(/(__CODE_BLOCK_\d+__|__INLINE_CODE_\d+__)/);
  
  return parts.map((part, index) => {
    const codeBlock = codeBlocks.find(block => block.placeholder === part);
    
    if (codeBlock) {
      return <React.Fragment key={index}>{formatCodeBlock(codeBlock)}</React.Fragment>;
    }
    
    // Regular text content
    return (
      <span key={index} className="whitespace-pre-wrap">
        {part}
      </span>
    );
  });
};

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentTitle, setCurrentTitle] = useState("");
  const [currentContent, setCurrentContent] = useState("");
  const [showSidebar, setShowSidebar] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const saveTimeoutRef = useRef(null);
  const lastSavedRef = useRef({ title: "", content: "" });

  const router = useRouter();

  // Check authentication status
  const checkAuth = async () => {
    try {
      const response = await fetch("/api/me");
      setIsAuthenticated(response.ok);
    } catch (error) {
      setIsAuthenticated(false);
    }
  };

  // Fetch notes from the database
  const fetchNotes = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/notes");
      if (response.ok) {
        const notesData = await response.json();
        // Sort notes by updatedAt (most recent first)
        const sortedNotes = notesData.sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
        );
        setNotes(sortedNotes);

        // Auto-select first note if none selected and notes exist
        if (sortedNotes.length > 0 && !selectedNote) {
          selectNote(sortedNotes[0]);
        }
      } else if (response.status === 401) {
        // Unauthorized - load from localStorage instead
        console.log("User not logged in, loading from localStorage");
        const localNotes = JSON.parse(
          localStorage.getItem("devstash_notes") || "[]"
        );
        setNotes(localNotes);
        if (localNotes.length > 0 && !selectedNote) {
          selectNote(localNotes[0]);
        }
      } else {
        console.error("Failed to fetch notes:", response.statusText);
        showError("Failed to load notes");
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
      showError("Failed to load notes");
      // Fallback to localStorage
      const localNotes = JSON.parse(
        localStorage.getItem("devstash_notes") || "[]"
      );
      setNotes(localNotes);
      if (localNotes.length > 0 && !selectedNote) {
        selectNote(localNotes[0]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle responsive behavior
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setShowSidebar(!mobile);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    // Check auth and fetch notes on component mount
    checkAuth();
    fetchNotes();

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Track changes and set unsaved state
  useEffect(() => {
    if (!selectedNote) {
      setHasUnsavedChanges(false);
      return;
    }

    const titleChanged = currentTitle !== lastSavedRef.current.title;
    const contentChanged = currentContent !== lastSavedRef.current.content;

    setHasUnsavedChanges(titleChanged || contentChanged);
  }, [currentTitle, currentContent, selectedNote]);

  // Auto-save with proper debouncing (only when typing stops)
  useEffect(() => {
    if (!selectedNote || !hasUnsavedChanges) return;

    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Set new timeout - save after user stops typing for 2 seconds
    saveTimeoutRef.current = setTimeout(async () => {
      // Check if content actually changed
      const titleChanged = currentTitle !== lastSavedRef.current.title;
      const contentChanged = currentContent !== lastSavedRef.current.content;

      if (!titleChanged && !contentChanged) return;

      setSaving(true);
      try {
        const response = await fetch(`/api/notes/${selectedNote._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: currentTitle || "Untitled Note",
            content: currentContent,
            starred: selectedNote.starred,
          }),
        });

        if (response.ok) {
          const updatedNote = await response.json();

          // Update the notes list
          setNotes((prev) =>
            prev
              .map((note) =>
                note._id === updatedNote._id ? updatedNote : note
              )
              .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
          );

          setSelectedNote(updatedNote);

          // Update last saved reference
          lastSavedRef.current = {
            title: currentTitle,
            content: currentContent,
          };

          setHasUnsavedChanges(false);
          showNoteSaved();
        } else if (response.status === 401) {
          // Unauthorized - save to localStorage instead
          console.log("User not logged in, saving to localStorage");
          const updatedNote = {
            ...selectedNote,
            title: currentTitle || "Untitled Note",
            content: currentContent,
            updatedAt: new Date().toISOString(),
          };

          // Update notes in state and localStorage
          const updatedNotes = notes.map((note) =>
            note._id === selectedNote._id ? updatedNote : note
          );
          setNotes(updatedNotes);
          setSelectedNote(updatedNote);
          localStorage.setItem("devstash_notes", JSON.stringify(updatedNotes));

          // Update last saved reference
          lastSavedRef.current = {
            title: currentTitle,
            content: currentContent,
          };
          setHasUnsavedChanges(false);
          showNoteSaved();
        } else {
          console.error("Failed to save note:", response.statusText);
          showError("Failed to save note");
        }
      } catch (error) {
        console.error("Error saving note:", error);
        showError("Failed to save note");
      } finally {
        setSaving(false);
      }
    }, 2000); // Save after 2 seconds of no typing

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [currentTitle, currentContent, selectedNote, hasUnsavedChanges]);

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const createNewNote = async () => {
    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: "Untitled Note",
          content: "",
          starred: false,
        }),
      });

      if (response.ok) {
        const newNote = await response.json();
        setNotes([newNote, ...notes]);
        selectNote(newNote);
        if (isMobile) setShowSidebar(false);
        showNoteSaved();
      } else if (response.status === 401) {
        // Unauthorized - create in localStorage instead
        console.log("User not logged in, creating note in localStorage");
        const newNote = {
          _id: Date.now().toString(), // Generate temporary ID
          title: "Untitled Note",
          content: "",
          starred: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        const updatedNotes = [newNote, ...notes];
        setNotes(updatedNotes);
        selectNote(newNote);
        localStorage.setItem("devstash_notes", JSON.stringify(updatedNotes));
        if (isMobile) setShowSidebar(false);
        showNoteSaved();
      } else {
        console.error("Failed to create note:", response.statusText);
        showError("Failed to create note");
      }
    } catch (error) {
      console.error("Error creating note:", error);
      showError("Failed to create note");
    }
  };

  const selectNote = (note) => {
    setSelectedNote(note);
    setCurrentTitle(note.title);
    setCurrentContent(note.content);

    // Update last saved reference
    lastSavedRef.current = {
      title: note.title,
      content: note.content,
    };

    setHasUnsavedChanges(false);
    if (isMobile) setShowSidebar(false);
  };

  const deleteNote = async (noteId) => {
    if (!confirm("Are you sure you want to delete this note?")) return;

    try {
      const response = await fetch(`/api/notes/${noteId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        const updatedNotes = notes.filter((note) => note._id !== noteId);
        setNotes(updatedNotes);

        if (selectedNote?._id === noteId) {
          const nextNote = updatedNotes[0] || null;
          if (nextNote) {
            selectNote(nextNote);
          } else {
            setSelectedNote(null);
            setCurrentTitle("");
            setCurrentContent("");
            lastSavedRef.current = { title: "", content: "" };
            setHasUnsavedChanges(false);
          }
        }
        showNoteDeleted();
      } else if (response.status === 401) {
        // Unauthorized - delete from localStorage instead
        console.log("User not logged in, deleting from localStorage");
        const updatedNotes = notes.filter((note) => note._id !== noteId);
        setNotes(updatedNotes);
        localStorage.setItem("devstash_notes", JSON.stringify(updatedNotes));

        if (selectedNote?._id === noteId) {
          const nextNote = updatedNotes[0] || null;
          if (nextNote) {
            selectNote(nextNote);
          } else {
            setSelectedNote(null);
            setCurrentTitle("");
            setCurrentContent("");
            lastSavedRef.current = { title: "", content: "" };
            setHasUnsavedChanges(false);
          }
        }
        showNoteDeleted();
      } else {
        console.error("Failed to delete note:", response.statusText);
        showError("Failed to delete note");
      }
    } catch (error) {
      console.error("Error deleting note:", error);
      showError("Failed to delete note");
    }
  };

  const toggleStar = async (noteId) => {
    try {
      const noteToUpdate = notes.find((note) => note._id === noteId);
      if (!noteToUpdate) return;

      const response = await fetch(`/api/notes/${noteId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: noteToUpdate.title,
          content: noteToUpdate.content,
          starred: !noteToUpdate.starred,
        }),
      });

      if (response.ok) {
        const updatedNote = await response.json();
        setNotes((prev) =>
          prev.map((note) =>
            note._id === updatedNote._id ? updatedNote : note
          )
        );
        if (selectedNote?._id === noteId) {
          setSelectedNote(updatedNote);
        }
        
        if (updatedNote.starred) {
          showNoteStarred();
        } else {
          showNoteUnstarred();
        }
      } else if (response.status === 401) {
        // Unauthorized - toggle star in localStorage instead
        console.log("User not logged in, toggling star in localStorage");
        const updatedNote = {
          ...noteToUpdate,
          starred: !noteToUpdate.starred,
          updatedAt: new Date().toISOString(),
        };

        const updatedNotes = notes.map((note) =>
          note._id === updatedNote._id ? updatedNote : note
        );
        setNotes(updatedNotes);
        localStorage.setItem("devstash_notes", JSON.stringify(updatedNotes));

        if (selectedNote?._id === noteId) {
          setSelectedNote(updatedNote);
        }
        
        if (updatedNote.starred) {
          showNoteStarred();
        } else {
          showNoteUnstarred();
        }
      } else {
        console.error("Failed to toggle star:", response.statusText);
        showError("Failed to update note");
      }
    } catch (error) {
      console.error("Error toggling star:", error);
      showError("Failed to update note");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size={32} className="mx-auto mb-4" />
          <p className="text-zinc-400">Loading your notes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex relative">
      {/* Info Banner for non-logged in users */}
      {!isAuthenticated && notes.length === 0 && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-blue-900/90 border border-blue-700 rounded-lg px-4 py-2 text-sm text-blue-200 backdrop-blur-sm">
          💡 Notes are saved locally in your browser. Login to sync across
          devices!
        </div>
      )}

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
                title="Create new note"
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
            placeholder="🔍 Search notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-zinc-600"
          />
        </div>

        {/* Notes List */}
        <div className="flex-1 overflow-y-auto">
          {filteredNotes.length === 0 ? (
            <div className="p-4 text-center text-zinc-500">
              <FileText size={32} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">
                {searchTerm ? "No notes found" : "No notes yet"}
              </p>
            </div>
          ) : (
            filteredNotes.map((note) => (
              <div
                key={note._id}
                onClick={() => selectNote(note)}
                className={`group p-4 border-b border-zinc-800 cursor-pointer hover:bg-zinc-800 transition-colors ${
                  selectedNote?._id === note._id
                    ? "bg-zinc-800 border-l-2 border-l-white"
                    : ""
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-medium truncate text-sm">
                        {note.title || "Untitled Note"}
                      </h3>
                      {note.starred && (
                        <Star
                          size={12}
                          filled
                          className="text-yellow-500 flex-shrink-0"
                        />
                      )}
                    </div>
                    <p className="text-xs text-zinc-400 line-clamp-2">
                      {note.content ? (
                        <>
                          {note.content.substring(0, 80)}
                          {note.content.length > 80 && "..."}
                        </>
                      ) : (
                        "No additional text"
                      )}
                    </p>
                    <p className="text-xs text-zinc-500 mt-1">
                      {new Date(note.updatedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center space-x-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleStar(note._id);
                      }}
                      className="p-1 hover:bg-zinc-700 rounded"
                      title={
                        note.starred
                          ? "Remove from favorites"
                          : "Add to favorites"
                      }
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
                        deleteNote(note._id);
                      }}
                      className="p-1 hover:bg-zinc-700 rounded text-zinc-500 hover:text-red-400"
                      title="Delete note"
                    >
                      <Trash size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
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

          <div className="flex items-center space-x-4">
            {selectedNote && (
              <button
                onClick={() => setPreviewMode(!previewMode)}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  previewMode 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                }`}
              >
                {previewMode ? 'Edit' : 'Preview'}
              </button>
            )}
            {hasUnsavedChanges && !saving && (
              <div className="flex items-center text-amber-400 text-sm">
                <div className="w-2 h-2 bg-amber-400 rounded-full mr-2"></div>
                Unsaved changes
              </div>
            )}
            {saving && (
              <div className="flex items-center text-blue-400 text-sm">
                <LoadingSpinner size={16} className="mr-2" />
                Saving...
              </div>
            )}
            {selectedNote && (
              <button
                onClick={() => toggleStar(selectedNote._id)}
                className={`p-2 rounded transition-colors ${
                  selectedNote.starred
                    ? "text-yellow-500"
                    : "text-zinc-500 hover:text-white"
                }`}
                title={
                  selectedNote.starred
                    ? "Remove from favorites"
                    : "Add to favorites"
                }
              >
                <Star size={20} filled={selectedNote.starred} />
              </button>
            )}
          </div>
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
                {previewMode ? (
                  <div className="prose prose-invert max-w-none">
                    <div className="text-base leading-relaxed text-zinc-100">
                      {renderFormattedContent(currentContent)}
                    </div>
                  </div>
                ) : (
                  <textarea
                    value={currentContent}
                    onChange={(e) => setCurrentContent(e.target.value)}
                    className="w-full h-full bg-transparent border-none outline-none text-white placeholder-zinc-500 resize-none text-base leading-relaxed font-mono"
                    placeholder="Start writing your note... Use ```language for code blocks and `code` for inline code"
                    style={{ minHeight: "400px" }}
                  />
                )}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-zinc-500 p-4">
              <div className="text-center max-w-md">
                <FileText size={48} className="mx-auto mb-4 opacity-50" />
                <p className="text-lg mb-2">No note selected</p>
                <p className="text-sm text-center mb-4">
                  {notes.length === 0
                    ? "Create your first note to get started"
                    : "Choose a note from the sidebar or create a new one"}
                </p>
                <button
                  onClick={createNewNote}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-md transition-colors inline-flex items-center space-x-2"
                >
                  <Plus size={16} />
                  <span>Create Note</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notes;
