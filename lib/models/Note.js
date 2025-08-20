// lib/models/Note.js
import mongoose from "mongoose";

const NoteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      default: "",
    },
    starred: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: String,
      default: "anonymous", // You can implement user auth later
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

// Prevent model overwrite in development
export default mongoose.models.Note || mongoose.model("Note", NoteSchema);
