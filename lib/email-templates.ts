// Email Templates for 2ndShift

export const emailTemplates = {
  welcome: (name: string, userType: 'worker' | 'client') => ({
    subject: 'Welcome to 2ndShift! 🎉',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #334155; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%); color: white; padding: 40px 20px; text-align: center; border-radius: 10px; }
            .content { background: white; padding: 30px; border-radius: 10px; margin-top: 20px; }
            .button { display: inline-block; background: #4F46E5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #64748B; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to 2ndShift!</h1>
              <p>India's First Legal, Tax-Compliant Freelance Platform</p>
            </div>
            <div class="content">
              <h2>Hi ${name}! 👋</h2>
              <p>We're thrilled to have you join 2ndShift as a ${userType}. You're now part of India's most trusted platform for legal, tax-compliant freelance work.</p>
              
              ${userType === 'worker' ? `
                <h3>What's Next?</h3>
                <ol>
                  <li>Complete your profile with skills and experience</li>
                  <li>Get verified (takes 24 hours)</li>
                  <li>Start browsing projects and apply</li>
                  <li>Get hired and start earning!</li>
                </ol>
              ` : `
                <h3>What's Next?</h3>
                <ol>
                  <li>Post your first project for free</li>
                  <li>Receive proposals from verified professionals</li>
                  <li>Review profiles and hire the best fit</li>
                  <li>Track work and make payments securely</li>
                </ol>
              `}
              
              <a href="https://2ndshift.in/${userType}" class="button">Go to Dashboard</a>
              
              <h3>Need Help?</h3>
              <p>Our support team is here for you:</p>
              <ul>
                <li>Email: support@2ndshift.in</li>
                <li>Phone: +91 80712 34567 (Mon-Sat, 9 AM - 6 PM IST)</li>
                <li>Help Center: https://2ndshift.in/faq</li>
              </ul>
            </div>
            <div class="footer">
              <p>© 2024 2ndShift. All rights reserved.</p>
              <p>This email was sent to you because you registered on 2ndShift.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `Hi ${name}!\n\nWelcome to 2ndShift! We're excited to have you join as a ${userType}.\n\nWhat's next? Log in to your dashboard and get started.\n\nNeed help? Contact us at support@2ndshift.in\n\nBest regards,\nThe 2ndShift Team`,
  }),

  emailVerification: (name: string, verificationLink: string) => ({
    subject: 'Verify Your Email - 2ndShift',
    html: `
      <!DOCTYPE html>
      <html>
        <body>
          <h2>Hi ${name},</h2>
          <p>Thanks for signing up! Please verify your email address to activate your account.</p>
          <a href="${verificationLink}" style="display: inline-block; background: #4F46E5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0;">Verify Email</a>
          <p>Or copy this link: ${verificationLink}</p>
          <p>This link expires in 24 hours.</p>
          <p>Best regards,<br>The 2ndShift Team</p>
        </body>
      </html>
    `,
    text: `Hi ${name},\n\nPlease verify your email: ${verificationLink}\n\nThis link expires in 24 hours.`,
  }),

  projectApplication: (workerName: string, projectTitle: string, clientName: string) => ({
    subject: `New Application for "${projectTitle}"`,
    html: `
      <h2>Hi ${clientName},</h2>
      <p><strong>${workerName}</strong> has applied for your project "<strong>${projectTitle}</strong>".</p>
      <a href="https://2ndshift.in/client/applications" style="display: inline-block; background: #4F46E5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0;">View Application</a>
      <p>Review their profile, portfolio, and proposal to make an informed decision.</p>
    `,
    text: `Hi ${clientName},\n\n${workerName} has applied for "${projectTitle}". Log in to review their application.`,
  }),

  paymentReceipt: (name: string, amount: number, projectTitle: string, invoiceUrl: string) => ({
    subject: 'Payment Receipt - 2ndShift',
    html: `
      <h2>Hi ${name},</h2>
      <p>Your payment of <strong>₹${amount.toLocaleString()}</strong> for "${projectTitle}" has been processed successfully.</p>
      <p><strong>Payment Details:</strong></p>
      <ul>
        <li>Amount: ₹${amount.toLocaleString()}</li>
        <li>Project: ${projectTitle}</li>
        <li>Date: ${new Date().toLocaleDateString('en-IN')}</li>
      </ul>
      <a href="${invoiceUrl}" style="display: inline-block; background: #4F46E5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0;">Download Invoice</a>
      <p>Thank you for using 2ndShift!</p>
    `,
    text: `Payment Receipt\n\nAmount: ₹${amount}\nProject: ${projectTitle}\n\nDownload invoice: ${invoiceUrl}`,
  }),

  form16A: (name: string, tdsAmount: number, certificateUrl: string) => ({
    subject: 'Form 16A - TDS Certificate Available',
    html: `
      <h2>Hi ${name},</h2>
      <p>Your Form 16A (TDS Certificate) is now available for download.</p>
      <p><strong>TDS Details:</strong></p>
      <ul>
        <li>TDS Deducted: ₹${tdsAmount.toLocaleString()}</li>
        <li>Financial Year: ${new Date().getFullYear()}-${new Date().getFullYear() + 1}</li>
      </ul>
      <a href="${certificateUrl}" style="display: inline-block; background: #4F46E5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0;">Download Form 16A</a>
      <p>Use this certificate when filing your Income Tax Return (ITR).</p>
    `,
    text: `Form 16A is available\n\nTDS: ₹${tdsAmount}\n\nDownload: ${certificateUrl}`,
  }),

  referralBonus: (name: string, bonusAmount: number, referredName: string) => ({
    subject: '🎉 You Earned a Referral Bonus!',
    html: `
      <h2>Congratulations ${name}! 🎉</h2>
      <p>You've earned <strong>₹${bonusAmount}</strong> in referral bonus!</p>
      <p>${referredName} (referred by you) has completed their first ${bonusAmount === 500 ? 'project' : 'hire'}.</p>
      <p>Your bonus has been credited to your account and will be included in your next payout.</p>
      <p>Keep referring and earning! Share your referral code with more friends.</p>
      <a href="https://2ndshift.in/referrals" style="display: inline-block; background: #4F46E5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0;">View Referral Stats</a>
    `,
    text: `Congrats! You earned ₹${bonusAmount} referral bonus because ${referredName} completed their first transaction.`,
  }),
}

// Email sending function (to be implemented with actual email service)
export async function sendEmail(
  to: string,
  template: { subject: string; html: string; text: string }
) {
  // TODO: Implement with Resend, SendGrid, or SMTP
  console.log('Sending email to:', to)
  console.log('Subject:', template.subject)
  
  // For now, just log. In production, use:
  // await resend.emails.send({ from, to, subject, html, text })
  
  return { success: true }
}
