// Netlify → n8n proxy
// Reads N8N_ENDPOINT from env-vars and forwards the form JSON.
// Returns the raw HTML that n8n’s “Respond to Webhook” node sends back.

export async function handler(event) {
  const N8N_ENDPOINT = process.env.N8N_ENDPOINT;       // set this in step 2
  if (!N8N_ENDPOINT) {
    return { statusCode: 500, body: 'N8N_ENDPOINT not set' };
  }

  try {
    const payload = JSON.parse(event.body);

    // If your n8n Function node checks client_domain, inject it here
    payload.client_domain = 'https://seo-internal-linker.netlify.app/';

    const resp  = await fetch(N8N_ENDPOINT, {
      method : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body   : JSON.stringify(payload),
    });

    const html = await resp.text();     // n8n sends back raw HTML

    return {
      statusCode: resp.status,
      headers   : { 'Content-Type': 'text/html' },
      body      : html,
    };

  } catch (err) {
    console.error('Proxy error:', err);
    return { statusCode: 500, body: 'Function proxy error' };
  }
}

