import connectDB from "@/lib/db/mongodb";
import Note from "@/lib/models/Note";
import { getUserFromToken } from "@/lib/auth";

export async function GET() {
  try {
    await connectDB();
    const userId = await getUserFromToken();
    if (!userId) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const notes = await Note.find({ userId }).sort({ updatedAt: -1 });
    return new Response(JSON.stringify(notes), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch notes" }), {
      status: 500,
    });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const userId = await getUserFromToken();
    if (!userId) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const { title, content, starred } = await request.json();

    const newNote = new Note({
      title: title || "Untitled Note",
      content: content || "",
      starred: starred || false,
      userId,
    });

    await newNote.save();
    return new Response(JSON.stringify(newNote), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to create note" }), {
      status: 500,
    });
  }
}
