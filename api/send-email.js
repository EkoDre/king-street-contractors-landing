export default async function handler(req, res) {
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
      console.error('RESEND_API_KEY is not set');
      return res.status(500).json({ error: 'Email service not configured' });
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
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'King Street Contractors <noreply@kingstreetcontractors.com>',
        to: ['Mete@kingstreetcontractors.com'],
        subject: emailSubject,
        text: emailBody,
        reply_to: email, // Allow replying directly to the customer
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Resend API error:', errorData);
      return res.status(500).json({ error: 'Failed to send email' });
    }

    const data = await response.json();
    return res.status(200).json({ success: true, messageId: data.id });
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
