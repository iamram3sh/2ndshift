import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email'
import { emailTemplates } from '@/lib/email-templates'

/**
 * Test Email API Route
 * 
 * Usage: POST to /api/test-email
 * Body: { email: "your-email@example.com", type: "welcome" }
 * 
 * Available types: welcome, verification, application, payment, form16a, referral
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, type = 'welcome' } = body

    if (!email) {
      return NextResponse.json(
        { error: 'Email address is required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address format' },
        { status: 400 }
      )
    }

    // Get the appropriate template
    let template
    switch (type) {
      case 'welcome':
        template = emailTemplates.welcome('Test User', 'worker')
        break
      case 'verification':
        template = emailTemplates.emailVerification(
          'Test User',
          `${process.env.NEXT_PUBLIC_APP_URL}/verify?token=test123`
        )
        break
      case 'application':
        template = emailTemplates.projectApplication(
          'John Worker',
          'Sample Project',
          'Jane Client'
        )
        break
      case 'payment':
        template = emailTemplates.paymentReceipt(
          'Test User',
          5000,
          'Sample Project',
          'https://example.com/invoice.pdf'
        )
        break
      case 'form16a':
        template = emailTemplates.form16A(
          'Test User',
          500,
          'https://example.com/form16a.pdf'
        )
        break
      case 'referral':
        template = emailTemplates.referralBonus('Test User', 500, 'Friend Name')
        break
      default:
        return NextResponse.json(
          { error: `Unknown email type: ${type}` },
          { status: 400 }
        )
    }

    // Send the email
    console.log(`📧 Attempting to send ${type} email to ${email}`)
    const result = await sendEmail(email, template)

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: `Test ${type} email sent successfully!`,
        details: {
          to: email,
          subject: template.subject,
          messageId: result.messageId,
          mode: result.mode
        }
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to send email',
          details: result.error
        },
        { status: 500 }
      )
    }
  } catch (error: any) {
    console.error('❌ Test email API error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        details: error.message
      },
      { status: 500 }
    )
  }
}

// GET request to show usage
export async function GET(request: NextRequest) {
  const isConfigured = !!process.env.RESEND_API_KEY
  
  return NextResponse.json({
    message: 'Email Test API',
    configured: isConfigured,
    status: isConfigured 
      ? '✅ Email service is configured' 
      : '⚠️ RESEND_API_KEY not configured',
    usage: {
      method: 'POST',
      endpoint: '/api/test-email',
      body: {
        email: 'your-email@example.com',
        type: 'welcome | verification | application | payment | form16a | referral'
      },
      example: {
        email: 'test@example.com',
        type: 'welcome'
      }
    },
    availableTypes: [
      { type: 'welcome', description: 'Welcome email for new users' },
      { type: 'verification', description: 'Email verification link' },
      { type: 'application', description: 'Job application notification' },
      { type: 'payment', description: 'Payment receipt' },
      { type: 'form16a', description: 'TDS certificate notification' },
      { type: 'referral', description: 'Referral bonus notification' }
    ]
  })
}
