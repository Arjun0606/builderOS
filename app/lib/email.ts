/**
 * Email Service using SendGrid
 * For sending notifications, reminders, and alerts
 */

import sgMail from '@sendgrid/mail';

// Initialize SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * Send email using SendGrid
 */
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    if (!process.env.SENDGRID_API_KEY) {
      console.warn('SendGrid API key not configured');
      return false;
    }

    const msg = {
      to: options.to,
      from: process.env.SENDGRID_FROM_EMAIL || 'noreply@legalos.in',
      subject: options.subject,
      text: options.text || options.html.replace(/<[^>]*>/g, ''),
      html: options.html,
    };

    await sgMail.send(msg);
    return true;
  } catch (error: any) {
    console.error('Error sending email:', error);
    return false;
  }
}

/**
 * Send court date reminder email
 */
export async function sendCourtDateReminder(
  email: string,
  lawyerName: string,
  courtDate: {
    case_title: string;
    case_number: string;
    court_name: string;
    hearing_date: string;
    hearing_time?: string;
    hearing_type: string;
  }
): Promise<boolean> {
  const subject = `Court Hearing Reminder: ${courtDate.case_title}`;
  
  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #1e3a8a; color: white; padding: 20px; text-align: center; }
    .content { background: #f8fafc; padding: 20px; }
    .details { background: white; padding: 15px; border-left: 4px solid #1e3a8a; margin: 20px 0; }
    .footer { text-align: center; padding: 20px; color: #64748b; font-size: 12px; }
    .button { display: inline-block; padding: 12px 24px; background: #1e3a8a; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>⚖️ Court Hearing Reminder</h1>
    </div>
    <div class="content">
      <p>Dear ${lawyerName},</p>
      
      <p>This is a reminder for your upcoming court hearing:</p>
      
      <div class="details">
        <p><strong>Case Title:</strong> ${courtDate.case_title}</p>
        <p><strong>Case Number:</strong> ${courtDate.case_number}</p>
        <p><strong>Court:</strong> ${courtDate.court_name}</p>
        <p><strong>Date:</strong> ${new Date(courtDate.hearing_date).toLocaleDateString('en-IN', { 
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}</p>
        ${courtDate.hearing_time ? `<p><strong>Time:</strong> ${courtDate.hearing_time}</p>` : ''}
        <p><strong>Type:</strong> ${courtDate.hearing_type}</p>
      </div>
      
      <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/court-dates" class="button">View in LegalOS</a></p>
      
      <p>Please ensure all documents and preparations are complete.</p>
      
      <p>Best regards,<br>LegalOS Team</p>
    </div>
    <div class="footer">
      <p>This is an automated reminder from LegalOS</p>
      <p>${process.env.NEXT_PUBLIC_APP_URL}</p>
    </div>
  </div>
</body>
</html>
  `;

  return sendEmail({
    to: email,
    subject,
    html,
  });
}

/**
 * Send case status update email
 */
export async function sendCaseUpdateEmail(
  email: string,
  lawyerName: string,
  caseUpdate: {
    case_title: string;
    case_number: string;
    update_type: string;
    update_description: string;
  }
): Promise<boolean> {
  const subject = `Case Update: ${caseUpdate.case_title}`;
  
  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #1e3a8a; color: white; padding: 20px; text-align: center; }
    .content { background: #f8fafc; padding: 20px; }
    .details { background: white; padding: 15px; border-left: 4px solid #10b981; margin: 20px 0; }
    .footer { text-align: center; padding: 20px; color: #64748b; font-size: 12px; }
    .button { display: inline-block; padding: 12px 24px; background: #1e3a8a; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📋 Case Update</h1>
    </div>
    <div class="content">
      <p>Dear ${lawyerName},</p>
      
      <p>There has been an update to your case:</p>
      
      <div class="details">
        <p><strong>Case:</strong> ${caseUpdate.case_title}</p>
        <p><strong>Case Number:</strong> ${caseUpdate.case_number}</p>
        <p><strong>Update Type:</strong> ${caseUpdate.update_type}</p>
        <p><strong>Details:</strong> ${caseUpdate.update_description}</p>
      </div>
      
      <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/cases" class="button">View Full Details</a></p>
      
      <p>Best regards,<br>LegalOS Team</p>
    </div>
    <div class="footer">
      <p>This is an automated notification from LegalOS</p>
      <p>${process.env.NEXT_PUBLIC_APP_URL}</p>
    </div>
  </div>
</body>
</html>
  `;

  return sendEmail({
    to: email,
    subject,
    html,
  });
}

/**
 * Send welcome email to new user
 */
export async function sendWelcomeEmail(
  email: string,
  userName: string,
  firmName: string
): Promise<boolean> {
  const subject = 'Welcome to LegalOS!';
  
  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #1e3a8a; color: white; padding: 30px; text-align: center; }
    .content { background: #f8fafc; padding: 30px; }
    .features { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; }
    .footer { text-align: center; padding: 20px; color: #64748b; font-size: 12px; }
    .button { display: inline-block; padding: 12px 24px; background: #1e3a8a; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0; }
    ul { list-style: none; padding: 0; }
    li { padding: 8px 0; padding-left: 25px; position: relative; }
    li:before { content: "✓"; position: absolute; left: 0; color: #10b981; font-weight: bold; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>⚖️ Welcome to LegalOS!</h1>
    </div>
    <div class="content">
      <p>Dear ${userName},</p>
      
      <p>Welcome to LegalOS - Your AI-powered legal assistant! We're excited to have ${firmName} on board.</p>
      
      <div class="features">
        <h3>What you can do with LegalOS:</h3>
        <ul>
          <li>Chat with AI Legal Assistant (trained on Indian law)</li>
          <li>Search case law across Indian Kanoon database</li>
          <li>Generate legal documents from 500+ templates</li>
          <li>Manage cases, clients, and court dates</li>
          <li>Track time and generate bills</li>
          <li>Build your firm's knowledge base</li>
        </ul>
      </div>
      
      <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" class="button">Get Started</a></p>
      
      <p>Need help? Our support team is available at support@legalos.in</p>
      
      <p>Best regards,<br>The LegalOS Team</p>
    </div>
    <div class="footer">
      <p>LegalOS - AI-Powered Legal Assistant for Indian Law Firms</p>
      <p>${process.env.NEXT_PUBLIC_APP_URL}</p>
    </div>
  </div>
</body>
</html>
  `;

  return sendEmail({
    to: email,
    subject,
    html,
  });
}

