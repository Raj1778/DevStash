// app/api/documents/route.js
import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// Simple helper to get user id from /api/me
async function getUserId(request) {
  try {
    const meUrl = new URL('/api/me', request.url);
    const res = await fetch(meUrl, {
      cache: 'no-store',
      headers: {
        // Forward cookies so the auth route can detect the user
        cookie: request.headers.get('cookie') || ''
      }
    });
    if (res.ok) {
      const data = await res.json();
      return data?.user?._id || data?.user?.id || null;
    }
  } catch {}
  return null;
}

const DATA_DIR = path.join(process.cwd(), 'data', 'uploads');

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

export async function GET(request) {
  const userId = await getUserId(request);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const userDir = path.join(DATA_DIR, userId);
  const metaPath = path.join(userDir, 'files.json');
  try {
    await ensureDir(userDir);
    const exists = await fs.readFile(metaPath, 'utf8').catch(() => null);
    const files = exists ? JSON.parse(exists) : [];
    return NextResponse.json({ files });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to list files' }, { status: 500 });
  }
}

export async function POST(request) {
  const userId = await getUserId(request);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const formData = await request.formData();
    const file = formData.get('file');
    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const userDir = path.join(DATA_DIR, userId);
    await ensureDir(userDir);

    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const safeName = file.name.replace(/[^a-zA-Z0-9_.-]/g, '_');
    const savePath = path.join(userDir, `${id}__${safeName}`);
    await fs.writeFile(savePath, buffer);

    const metaPath = path.join(userDir, 'files.json');
    const current = await fs.readFile(metaPath, 'utf8').catch(() => '[]');
    const list = JSON.parse(current);
    const record = {
      id,
      originalName: file.name,
      path: savePath,
      size: buffer.length,
      createdAt: new Date().toISOString(),
    };
    list.unshift(record);
    await fs.writeFile(metaPath, JSON.stringify(list, null, 2), 'utf8');

    return NextResponse.json({ ok: true, file: { id: record.id, originalName: record.originalName, size: record.size, createdAt: record.createdAt } });
  } catch (e) {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}


