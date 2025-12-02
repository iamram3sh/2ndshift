/**
 * Demo File Storage
 * Stores files locally in ./tmp/uploads for staging
 */

import * as fs from 'fs';
import * as path from 'path';
import { randomUUID } from 'crypto';

const UPLOAD_DIR = path.join(process.cwd(), 'tmp', 'uploads');
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const RETENTION_DAYS = 7;

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Clean old files periodically
function cleanOldFiles() {
  try {
    const files = fs.readdirSync(UPLOAD_DIR);
    const now = Date.now();
    const maxAge = RETENTION_DAYS * 24 * 60 * 60 * 1000;

    files.forEach(file => {
      const filePath = path.join(UPLOAD_DIR, file);
      const stats = fs.statSync(filePath);
      if (now - stats.mtimeMs > maxAge) {
        fs.unlinkSync(filePath);
      }
    });
  } catch (error) {
    console.error('Error cleaning old files:', error);
  }
}

// Run cleanup on startup
cleanOldFiles();

export interface UploadResult {
  url: string;
  key: string;
  size: number;
}

export async function uploadFile(
  file: Buffer | Uint8Array,
  filename: string,
  contentType?: string
): Promise<UploadResult> {
  if (file.length > MAX_FILE_SIZE) {
    throw new Error(`File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit`);
  }

  const ext = path.extname(filename);
  const key = `${randomUUID()}${ext}`;
  const filePath = path.join(UPLOAD_DIR, key);

  fs.writeFileSync(filePath, file);

  return {
    url: `/api/storage/demo/${key}`,
    key,
    size: file.length,
  };
}

export async function getFileUrl(key: string): Promise<string> {
  const filePath = path.join(UPLOAD_DIR, key);
  if (!fs.existsSync(filePath)) {
    throw new Error('File not found');
  }
  return `/api/storage/demo/${key}`;
}

export async function deleteFile(key: string): Promise<void> {
  const filePath = path.join(UPLOAD_DIR, key);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}
