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
  try {
    const userId = await getUserId(request);
    console.log('Documents GET - User ID:', userId);
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const userDir = path.join(DATA_DIR, userId);
    const metaPath = path.join(userDir, 'files.json');
    console.log('Documents GET - User dir:', userDir);
    console.log('Documents GET - Meta path:', metaPath);
    
    await ensureDir(userDir);
    const exists = await fs.readFile(metaPath, 'utf8').catch(() => null);
    const files = exists ? JSON.parse(exists) : [];
    console.log('Documents GET - Files found:', files.length);
    return NextResponse.json({ files });
  } catch (e) {
    console.error('Documents GET error:', e);
    return NextResponse.json({ error: 'Failed to list files' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const userId = await getUserId(request);
    console.log('Documents POST - User ID:', userId);
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const formData = await request.formData();
    const file = formData.get('file');
    console.log('Documents POST - File received:', file?.name, file?.size);
    
    if (!file || typeof file === 'string') {
      console.log('Documents POST - No valid file uploaded');
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    console.log('Documents POST - File buffer size:', buffer.length);

    const userDir = path.join(DATA_DIR, userId);
    await ensureDir(userDir);
    console.log('Documents POST - User dir created:', userDir);

    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const safeName = file.name.replace(/[^a-zA-Z0-9_.-]/g, '_');
    const savePath = path.join(userDir, `${id}__${safeName}`);
    await fs.writeFile(savePath, buffer);
    console.log('Documents POST - File saved to:', savePath);

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
    console.log('Documents POST - Metadata updated');

    return NextResponse.json({ ok: true, file: { id: record.id, originalName: record.originalName, size: record.size, createdAt: record.createdAt } });
  } catch (e) {
    console.error('Documents POST error:', e);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}


