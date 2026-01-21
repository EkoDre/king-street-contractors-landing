export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, phone, projectType, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Get Resend API key from environment variable
    const RESEND_API_KEY = process.env.RESEND_API_KEY;

    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not set in environment variables');
      return res.status(500).json({ 
        error: 'Email service not configured',
        message: 'RESEND_API_KEY environment variable is missing. Please add it in Vercel settings.'
      });
    }

    // Format the email content
    const emailSubject = `New Contact Form Submission - ${projectType || 'General Inquiry'}`;
    const emailBody = `
New contact form submission from King Street Contractors website:

Name: ${name}
Email: ${email}
Phone: ${phone || 'Not provided'}
Project Type: ${projectType || 'Not specified'}

Message:
${message}

---
This email was sent from the contact form on kingstreetcontractors.com
    `.trim();

    // Send email using Resend API
    // Use Resend's default domain for testing (change to your domain after verification)
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'King Street Contractors <onboarding@resend.dev>', // Use Resend's default domain
        to: ['mete@kingstreetcontractors.com'], // Use lowercase - Resend verified email
        subject: emailSubject,
        text: emailBody,
        reply_to: email, // Allow replying directly to the customer
      }),
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { message: `HTTP ${response.status}: ${response.statusText}` };
      }
      console.error('Resend API error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      });
      return res.status(500).json({ 
        error: 'Failed to send email', 
        details: errorData.message || errorData.error || `HTTP ${response.status}`,
        status: response.status
      });
    }

    const data = await response.json();
    return res.status(200).json({ success: true, messageId: data.id });
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message || 'Unknown error occurred'
    });
  }
}
