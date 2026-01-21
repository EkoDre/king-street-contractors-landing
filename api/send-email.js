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

    // Format the notification email to business
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

    // Format the confirmation email to customer
    const confirmationSubject = "We've Got Your Inquiry";
    const confirmationBody = `Hi ${name},

Thanks for reaching out to King Street Contractors. We've received your message and will get back to you shortly to discuss your project.

Best,

The King Street Contractors Team`;

    // Send notification email to business
    const businessEmailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'King Street Contractors <noreply@kingstreetcontractors.com>', // Using verified domain
        to: ['mete@kingstreetcontractors.com'],
        subject: emailSubject,
        text: emailBody,
        reply_to: email,
      }),
    });

    if (!businessEmailResponse.ok) {
      let errorData;
      try {
        errorData = await businessEmailResponse.json();
      } catch (e) {
        errorData = { message: `HTTP ${businessEmailResponse.status}: ${businessEmailResponse.statusText}` };
      }
      console.error('Resend API error (business email):', {
        status: businessEmailResponse.status,
        statusText: businessEmailResponse.statusText,
        error: errorData
      });
      return res.status(500).json({ 
        error: 'Failed to send email', 
        details: errorData.message || errorData.error || `HTTP ${businessEmailResponse.status}`,
        status: businessEmailResponse.status
      });
    }

    // Send confirmation email to customer
    // Domain is verified - can now send to any email address
    let confirmationSent = false;
    try {
      const confirmationEmailResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: 'King Street Contractors <noreply@kingstreetcontractors.com>', // Using verified domain
          to: [email], // Customer's email
          subject: confirmationSubject,
          text: confirmationBody,
        }),
      });

      if (confirmationEmailResponse.ok) {
        confirmationSent = true;
        const confirmationData = await confirmationEmailResponse.json();
        console.log('Confirmation email sent successfully:', confirmationData.id);
      } else {
        // Log error but don't fail the request if confirmation fails
        let errorData;
        try {
          errorData = await confirmationEmailResponse.json();
        } catch (e) {
          errorData = { message: `HTTP ${confirmationEmailResponse.status}: ${confirmationEmailResponse.statusText}` };
        }
        console.error('Resend API error (confirmation email):', {
          status: confirmationEmailResponse.status,
          statusText: confirmationEmailResponse.statusText,
          error: errorData,
          customerEmail: email,
          note: 'Confirmation email failed - likely because customer email is not verified. Domain verification required to send to all emails.'
        });
      }
    } catch (confirmationError) {
      console.error('Error sending confirmation email:', confirmationError);
    }

    const businessData = await businessEmailResponse.json();
    return res.status(200).json({ 
      success: true, 
      messageId: businessData.id,
      confirmationSent: confirmationSent
    });
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message || 'Unknown error occurred'
    });
  }
}
