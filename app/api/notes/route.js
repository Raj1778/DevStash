// app/api/notes/route.js
import connectDB from "@/lib/db/mongodb";
import Note from "@/lib/models/Note";

// GET all notes
export async function GET() {
  try {
    await connectDB();
    const notes = await Note.find({}).sort({ updatedAt: -1 });

    return new Response(JSON.stringify(notes), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch notes" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// POST a new note
export async function POST(request) {
  try {
    await connectDB();
    const { title, content, starred } = await request.json();

    const newNote = new Note({
      title: title || "Untitled Note",
      content: content || "",
      starred: starred || false,
    });

    await newNote.save();

    return new Response(JSON.stringify(newNote), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to create note" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
