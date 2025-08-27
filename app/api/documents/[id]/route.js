// app/api/documents/[id]/route.js
import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data', 'uploads');

async function getUserId(request) {
  try {
    const meUrl = new URL('/api/me', request.url);
    const res = await fetch(meUrl, {
      cache: 'no-store',
      headers: {
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

export async function GET(request, { params }) {
  const userId = await getUserId(request);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = params;
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  const userDir = path.join(DATA_DIR, userId);
  const metaPath = path.join(userDir, 'files.json');
  try {
    const current = await fs.readFile(metaPath, 'utf8').catch(() => '[]');
    const list = JSON.parse(current);
    const record = list.find((f) => f.id === id);
    if (!record) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const fileBuffer = await fs.readFile(record.path);
    const headers = new Headers();
    headers.set('Content-Type', 'application/octet-stream');
    headers.set('Content-Disposition', `attachment; filename="${record.originalName.replace(/"/g, '')}"`);
    return new NextResponse(fileBuffer, { status: 200, headers });
  } catch (e) {
    return NextResponse.json({ error: 'Download failed' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const userId = await getUserId(request);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = params;
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  const userDir = path.join(DATA_DIR, userId);
  const metaPath = path.join(userDir, 'files.json');
  try {
    const current = await fs.readFile(metaPath, 'utf8').catch(() => '[]');
    const list = JSON.parse(current);
    const index = list.findIndex((f) => f.id === id);
    if (index === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const record = list[index];
    try {
      await fs.unlink(record.path);
    } catch {}

    list.splice(index, 1);
    await fs.writeFile(metaPath, JSON.stringify(list, null, 2), 'utf8');

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}
