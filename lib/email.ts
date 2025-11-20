// Email service using Resend
import { Resend } from 'resend'

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY)

// Default sender email
const DEFAULT_FROM = process.env.EMAIL_FROM || 'noreply@2ndshift.in'

/**
 * Send email using Resend
 * @param to - Recipient email address
 * @param template - Email template with subject, html, and text
 * @param from - Sender email (optional, uses default if not provided)
 */
export async function sendEmail(
  to: string,
  template: { subject: string; html: string; text: string },
  from?: string
) {
  try {
    // If no API key is configured, log and return (development mode)
    if (!process.env.RESEND_API_KEY) {
      console.log('⚠️  RESEND_API_KEY not configured. Email would be sent to:', to)
      console.log('📧 Subject:', template.subject)
      console.log('📝 Preview:', template.text.substring(0, 100) + '...')
      return { 
        success: true, 
        messageId: 'dev-mode-' + Date.now(),
        mode: 'development'
      }
    }

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: from || DEFAULT_FROM,
      to,
      subject: template.subject,
      html: template.html,
      text: template.text,
    })

    if (error) {
      console.error('❌ Failed to send email:', error)
      throw new Error(`Email sending failed: ${error.message}`)
    }

    console.log('✅ Email sent successfully to:', to)
    console.log('📧 Message ID:', data?.id)

    return {
      success: true,
      messageId: data?.id,
      mode: 'production'
    }
  } catch (error: any) {
    console.error('❌ Email service error:', error)
    
    // Don't throw error - log it and return failure
    // This prevents email failures from breaking the main flow
    return {
      success: false,
      error: error.message,
      mode: 'error'
    }
  }
}

/**
 * Send bulk emails (for notifications, newsletters, etc.)
 * @param recipients - Array of recipient emails
 * @param template - Email template
 * @param from - Sender email (optional)
 */
export async function sendBulkEmails(
  recipients: string[],
  template: { subject: string; html: string; text: string },
  from?: string
) {
  const results = await Promise.allSettled(
    recipients.map(to => sendEmail(to, template, from))
  )

  const successful = results.filter(r => r.status === 'fulfilled').length
  const failed = results.filter(r => r.status === 'rejected').length

  console.log(`📊 Bulk email results: ${successful} sent, ${failed} failed`)

  return {
    total: recipients.length,
    successful,
    failed,
    results
  }
}

/**
 * Validate email address format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}
