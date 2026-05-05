interface Env {
  ASSETS: Fetcher;
  RESEND_API_KEY: string;
  RECIPIENT_EMAIL: string;
}

interface ContactPayload {
  fullName: string;
  email: string;
  org: string;
  message: string;
}

const escapeHtml = (s: string) =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/api/contact' && request.method === 'POST') {
      let body: ContactPayload;
      try {
        body = await request.json();
      } catch {
        return Response.json({ error: 'Invalid JSON' }, { status: 400 });
      }

      const { fullName, email, org, message } = body;
      if (!fullName?.trim() || !email?.trim() || !message?.trim()) {
        return Response.json({ error: 'Missing required fields' }, { status: 400 });
      }

      const subject = `[ajblood.com Contact] ${fullName} — ${org || 'No organization'}`;
      const html = `
        <p><strong>Name:</strong> ${escapeHtml(fullName)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Organization:</strong> ${escapeHtml(org || '—')}</p>
        <p><strong>Message:</strong></p>
        <pre style="white-space:pre-wrap;font-family:inherit">${escapeHtml(message)}</pre>
      `.trim();

      const resp = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'AJBlood Website <onboarding@resend.dev>',
          to: env.RECIPIENT_EMAIL,
          reply_to: email,
          subject,
          html,
        }),
      });

      if (!resp.ok) {
        const detail = await resp.text();
        console.error('Resend error', resp.status, detail);
        return Response.json({ error: 'Email send failed' }, { status: 502 });
      }

      return Response.json({ ok: true });
    }

    return env.ASSETS.fetch(request);
  },
};
