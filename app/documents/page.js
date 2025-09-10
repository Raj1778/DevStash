"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import { showError, showSuccess, showInfo } from "@/lib/toast";

export default function DocumentsPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadCount, setUploadCount] = useState(0);
  const fileInputRef = useRef(null);
  const folderInputRef = useRef(null);

  useEffect(() => {
    const init = async () => {
      try {
        const me = await fetch("/api/me");
        if (me.ok) {
          const data = await me.json();
          setUser(data.user);
          await fetchFiles();
        } else {
          setUser(null);
        }
      } catch (e) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const fetchFiles = async () => {
    try {
      console.log('Fetching documents...');
      const res = await fetch("/api/documents");
      if (res.ok) {
        const data = await res.json();
        console.log('Documents fetched:', data);
        setFiles(data.files || []);
      } else if (res.status === 401) {
        console.log('User not authenticated');
        setFiles([]);
      } else {
        const errorData = await res.json().catch(() => ({}));
        console.error('Failed to load documents:', res.status, errorData);
        showError(`Failed to load documents: ${errorData.error || 'Unknown error'}`);
      }
    } catch (e) {
      console.error('Failed to load documents:', e);
      showError("Failed to load documents");
    }
  };

  const uploadOne = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/documents", {
      method: "POST",
      body: formData,
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error('Upload failed:', res.status, errorData);
      throw new Error(`Upload failed: ${res.status} ${errorData.error || 'Unknown error'}`);
    }
    return res.json();
  };

  const handleFiles = useCallback(async (fileList) => {
    if (!fileList || fileList.length === 0) return;
    setUploading(true);
    setUploadCount(fileList.length);
    let success = 0;
    let errors = [];
    try {
      // Convert FileList to array
      const filesArray = Array.from(fileList);
      console.log(`Uploading ${filesArray.length} files...`);
      
      for (const f of filesArray) {
        try {
          console.log(`Uploading file: ${f.name}`);
          await uploadOne(f);
          success += 1;
        } catch (error) {
          console.error(`Failed to upload ${f.name}:`, error.message);
          errors.push(`${f.name}: ${error.message}`);
        }
      }
      
      if (success > 0) {
        showSuccess(`${success} file${success>1?'s':''} uploaded successfully`);
        await fetchFiles();
      }
      
      if (errors.length > 0) {
        showError(`Failed to upload ${errors.length} file(s): ${errors.slice(0, 2).join(', ')}${errors.length > 2 ? '...' : ''}`);
      }
      
      if (success === 0 && errors.length === 0) {
        showError("No files uploaded");
      }
    } catch (error) {
      console.error('Upload process failed:', error);
      showError("Upload process failed");
    } finally {
      setUploading(false);
      setUploadCount(0);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }, []);

  const handleUpload = async (e) => {
    await handleFiles(e.target.files);
  };

  const onDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (!user) {
      showInfo("Please login to upload");
      return;
    }
    const items = e.dataTransfer.items;
    if (items && items.length) {
      // Collect files including directories
      const filePromises = [];
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const entry = item.webkitGetAsEntry?.();
        if (entry && entry.isDirectory) {
          // Traverse directory
          filePromises.push(new Promise((resolve) => {
            const reader = entry.createReader();
            const all = [];
            const readEntries = () => {
              reader.readEntries((entries) => {
                if (!entries.length) {
                  resolve(all);
                } else {
                  entries.forEach((ent) => {
                    if (ent.isFile) {
                      ent.file((file) => all.push(file));
                    }
                  });
                  readEntries();
                }
              });
            };
            readEntries();
          }));
        } else {
          const f = item.getAsFile?.();
          if (f) filePromises.push(Promise.resolve([f]));
        }
      }
      const nested = await Promise.all(filePromises);
      const files = nested.flat();
      await handleFiles(files);
      return;
    }
    await handleFiles(e.dataTransfer.files);
  };

  const onDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };
  const onDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDownload = async (id) => {
    try {
      const res = await fetch(`/api/documents/${id}`);
      if (!res.ok) return showError("Download failed");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const cd = res.headers.get("Content-Disposition");
      const filename = cd?.split("filename=")[1]?.replace(/"/g, "") || "download";
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      showError("Download failed");
    }
  };

  const handleDelete = async (id, name) => {
    const confirmed = window.confirm(`Delete \"${name}\"? This action cannot be undone.`);
    if (!confirmed) return;
    try {
      const res = await fetch(`/api/documents/${id}`, { method: "DELETE" });
      if (!res.ok) return showError("Delete failed");
      showSuccess("Deleted");
      await fetchFiles();
    } catch (e) {
      showError("Delete failed");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-light">My Documents</h1>
          <p className="text-zinc-400 mt-2">Upload, manage and download your files.</p>
        </div>

        {!loading && !user && (
          <div className="p-4 border border-amber-500/30 bg-amber-500/10 rounded-lg mb-6">
            <p className="text-amber-300 text-sm">Please login to use Documents.</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={!user || uploading}
              className="px-4 py-2 bg-white text-black rounded-lg text-sm font-medium hover:bg-gray-200 disabled:opacity-50"
            >
              {uploading ? `Uploading ${uploadCount || ''}` : "Upload Files"}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleUpload}
              multiple
              accept="*/*"
            />
            <button
              onClick={() => folderInputRef.current?.click()}
              disabled={!user || uploading}
              className="px-4 py-2 bg-zinc-800 text-white rounded-lg text-sm font-medium hover:bg-zinc-700 disabled:opacity-50"
            >
              {uploading ? "Please wait..." : "Upload Folder"}
            </button>
            <input
              ref={folderInputRef}
              type="file"
              className="hidden"
              onChange={handleUpload}
              // @ts-ignore vendor-specific folder selection attributes
              webkitdirectory="true"
              directory="true"
              mozdirectory="true"
              accept="*/*"
            />
            <span className="text-xs text-zinc-500">Drag & drop also supports folders and all file types (PDF, DOCX, images, etc.).</span>
          </div>
        </div>

        

        <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl overflow-hidden">
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 px-4 py-3 text-xs text-zinc-400 border-b border-zinc-800">
            <div className="col-span-2 sm:col-span-3">Name</div>
            <div className="hidden sm:block">Size</div>
            <div className="hidden sm:block">Uploaded</div>
            <div className="text-right">Actions</div>
          </div>

          <div className="divide-y divide-zinc-800">
            {files.length === 0 ? (
              <div className="px-4 py-6 text-zinc-500 text-sm">No files yet.</div>
            ) : (
              files.map((f) => (
                <div key={f.id} className="px-4 py-3 grid grid-cols-3 sm:grid-cols-6 gap-2 items-center text-sm">
                  <div className="col-span-2 sm:col-span-3 truncate">{f.originalName}</div>
                  <div className="hidden sm:block">{Math.round((f.size || 0) / 1024)} KB</div>
                  <div className="hidden sm:block">{new Date(f.createdAt).toLocaleString()}</div>
                  <div className="text-right flex items-center justify-end gap-2">
                    <button onClick={() => handleDownload(f.id)} className="px-3 py-1 bg-emerald-600/80 hover:bg-emerald-600 rounded">Download</button>
                    <button onClick={() => handleDelete(f.id, f.originalName)} aria-label="Delete" className="p-1 rounded hover:bg-red-900/20">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-red-500">
                        <path d="M9 3.75A1.5 1.5 0 0 1 10.5 2.25h3A1.5 1.5 0 0 1 15 3.75V5h4.5a.75.75 0 0 1 0 1.5h-15A.75.75 0 0 1 4.5 5H9V3.75ZM6.75 8.5a.75.75 0 0 1 .75-.75h9a.75.75 0 0 1 .75.75v10.5A2.25 2.25 0 0 1 15 21.25H9A2.25 2.25 0 0 1 6.75 19V8.5Zm3 1.75a.75.75 0 0 0-1.5 0v8a.75.75 0 0 0 1.5 0v-8Zm5 0a.75.75 0 0 0-1.5 0v8a.75.75 0 0 0 1.5 0v-8Z" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
