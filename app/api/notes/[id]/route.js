// app/api/notes/[id]/route.js
import connectDB from "@/lib/db/mongodb";
import Note from "@/lib/models/Note";

// GET a specific note
export async function GET(request, { params }) {
  try {
    await connectDB();
    const note = await Note.findById(params.id);

    if (!note) {
      return new Response(JSON.stringify({ error: "Note not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(note), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch note" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// PUT (update) a specific note
export async function PUT(request, { params }) {
  try {
    await connectDB();
    const { title, content, starred } = await request.json();

    const updatedNote = await Note.findByIdAndUpdate(
      params.id,
      { title, content, starred, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!updatedNote) {
      return new Response(JSON.stringify({ error: "Note not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(updatedNote), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to update note" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// DELETE a specific note
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const deletedNote = await Note.findByIdAndDelete(params.id);

    if (!deletedNote) {
      return new Response(JSON.stringify({ error: "Note not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ message: "Note deleted successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to delete note" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
