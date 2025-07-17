// netlify/functions/process-article.js
exports.handler = async (event) => {
  const N8N_ENDPOINT = process.env.N8N_ENDPOINT;
  if (!N8N_ENDPOINT) {
    return { statusCode: 500, body: 'N8N_ENDPOINT not set' };
  }

  const payload = JSON.parse(event.body || '{}');
  payload.client_domain = 'https://seo-internal-linker.netlify.app/';

  try {
    const r   = await fetch(N8N_ENDPOINT, {
      method : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body   : JSON.stringify(payload),
    });
    const html = await r.text();
    return { statusCode: r.status,
             headers: { 'Content-Type': 'text/html' },
             body: html };
  } catch (e) {
    console.error('Proxy error', e);
    return { statusCode: 500, body: 'Function proxy error' };
  }
};

