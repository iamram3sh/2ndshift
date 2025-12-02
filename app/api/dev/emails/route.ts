/**
 * Dev Email Preview Endpoint
 * View all captured demo emails
 */

import { NextRequest, NextResponse } from 'next/server';
import { getStoredEmails, getEmailById, clearStoredEmails } from '@/lib/email/demo';

export async function GET(request: NextRequest) {
  // Only allow in development/staging
  if (process.env.NODE_ENV === 'production' && !process.env.ALLOW_DEMO_EMAILS) {
    return NextResponse.json(
      { error: 'Not available in production' },
      { status: 403 }
    );
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const clear = searchParams.get('clear') === 'true';

  if (clear) {
    clearStoredEmails();
    return NextResponse.json({ message: 'Emails cleared' });
  }

  if (id) {
    const email = getEmailById(id);
    if (!email) {
      return NextResponse.json({ error: 'Email not found' }, { status: 404 });
    }
    return NextResponse.json({ email });
  }

  const emails = getStoredEmails();
  return NextResponse.json({ emails, count: emails.length });
}
