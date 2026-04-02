interface Env {
  BUSINESS_EMAIL: string;
  BUSINESS_NAME: string;
}

interface ContactPayload {
  name: string;
  email?: string;
  phone: string;
  service?: string;
  message?: string;
  formType: 'contact' | 'appointment';
}

function validatePayload(body: unknown): body is ContactPayload {
  if (!body || typeof body !== 'object') return false;
  const b = body as Record<string, unknown>;
  return typeof b.name === 'string' && b.name.length > 0 && typeof b.phone === 'string' && b.phone.length > 0;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  // CORS headers
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  };

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400, headers });
  }

  if (!validatePayload(body)) {
    return new Response(JSON.stringify({ error: 'Name and phone are required' }), { status: 400, headers });
  }

  const subject =
    body.formType === 'appointment'
      ? `Appointment Request from ${body.name}`
      : `Contact Form from ${body.name}`;

  const textBody = [
    `Name: ${body.name}`,
    `Phone: ${body.phone}`,
    body.email ? `Email: ${body.email}` : null,
    body.service ? `Service: ${body.service}` : null,
    body.message ? `\nMessage:\n${body.message}` : null,
    `\nForm Type: ${body.formType}`,
    `Submitted: ${new Date().toISOString()}`,
  ]
    .filter(Boolean)
    .join('\n');

  // Send email via MailChannels (free on Cloudflare Workers)
  try {
    const businessEmail = env.BUSINESS_EMAIL || 'info@allensautotow.com';
    const businessName = env.BUSINESS_NAME || "Allen's Automotive & Towing Inc";

    const emailResponse = await fetch('https://api.mailchannels.net/tx/v1/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: businessEmail, name: businessName }],
          },
        ],
        from: {
          email: 'noreply@allensautotow.com',
          name: 'Website Contact Form',
        },
        reply_to: body.email ? { email: body.email, name: body.name } : undefined,
        subject,
        content: [{ type: 'text/plain', value: textBody }],
      }),
    });

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      console.error('MailChannels error:', errorText);
      // Still return success to user — log the error for debugging
      // In production, you'd want alerting here
    }
  } catch (err) {
    console.error('Email send error:', err);
    // Don't fail the request — the form submission is still valid
  }

  return new Response(JSON.stringify({ success: true, message: 'Message received! We will get back to you within one business day.' }), {
    status: 200,
    headers,
  });
};

// Handle CORS preflight
export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
};
