/**
 * Demo Email Service
 * Captures emails to logs and provides dev preview endpoint
 */

interface Email {
  id: string;
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
  timestamp: Date;
}

// In-memory email store (in production, use Redis or database)
const emailStore: Email[] = [];
const MAX_STORED_EMAILS = 100;

export async function sendEmail(options: {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
}): Promise<{ success: boolean; messageId?: string; error?: string }> {
  if (process.env.NODE_ENV === 'production' && !process.env.ALLOW_DEMO_EMAILS) {
    // In production, use real email service
    return { success: false, error: 'Demo emails not allowed in production' };
  }

  const email: Email = {
    id: `demo_email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    to: options.to,
    subject: options.subject,
    html: options.html,
    text: options.text,
    from: options.from || 'noreply@2ndshift.com',
    timestamp: new Date(),
  };

  // Store email
  emailStore.unshift(email);
  if (emailStore.length > MAX_STORED_EMAILS) {
    emailStore.pop();
  }

  // Log email
  console.log('📧 [DEMO EMAIL]', {
    to: email.to,
    subject: email.subject,
    id: email.id,
  });

  return {
    success: true,
    messageId: email.id,
  };
}

export function getStoredEmails(): Email[] {
  return emailStore;
}

export function getEmailById(id: string): Email | undefined {
  return emailStore.find(e => e.id === id);
}

export function clearStoredEmails(): void {
  emailStore.length = 0;
}
