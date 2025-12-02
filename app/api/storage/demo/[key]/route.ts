/**
 * Demo File Storage - Serve Files
 */

import { NextRequest, NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';

const UPLOAD_DIR = path.join(process.cwd(), 'tmp', 'uploads');

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  const { key } = await params;
  
  // Security: prevent directory traversal
  if (key.includes('..') || key.includes('/')) {
    return NextResponse.json({ error: 'Invalid file key' }, { status: 400 });
  }

  const filePath = path.join(UPLOAD_DIR, key);

  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }

  const fileBuffer = fs.readFileSync(filePath);
  const stats = fs.statSync(filePath);

  return new NextResponse(fileBuffer, {
    headers: {
      'Content-Type': 'application/octet-stream',
      'Content-Length': stats.size.toString(),
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
