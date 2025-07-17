// process-article.js (ES Modules style for Node 18)
export default async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();

  /* 1. env-vars --------------------------------------------------------- */
  const OPENAI_KEY = process.env.OPENAI_API_KEY;   //  ➜ add in Netlify UI
  if (!OPENAI_KEY) return res.status(500).send('OPENAI_API_KEY not set');

  /* 2. read JSON sent from the form ------------------------------------ */
  const body = await req.json();   // { client_domain, industry, primary_kw, ... }

  /* 3. build a *concise* prompt ---------------------------------------- */
  const prompt = `
ROLE
You are an SEO content editor focused on internal & external linking.

ARTICLE (raw or HTML)
${body.article}

CONTEXT
CLIENT DOMAIN: ${body.client_domain}
PRIMARY KEYWORD: ${body.primary_kw}
SECONDARY KEYWORDS: ${body.secondary_kws}
INDUSTRY: ${body.industry}

TASK
1. If plain-text, add <h1>/<h2>/<h3> and wrap paragraphs in <p>.
2. Append " - H1/H2/H3" to each heading when missing.
3. Insert up to 5 internal links from ${body.client_domain} and exactly 2 authoritative .gov/.edu links. No links in headings. Max 1 internal link per 150 words.
4. Return HTML only. After the article, list each inserted internal URL on its own line.`;

  /* 4. call OpenAI (o3) ------------------------------------------------- */
  const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
    method : 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      temperature: 0.3,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!openaiRes.ok) {
    const err = await openaiRes.text();
    console.error('OpenAI error', err);
    return res.status(500).send('OpenAI proxy error');
  }

  const data = await openaiRes.json();
  const html = data.choices?.[0]?.message?.content || 'NO_OUTPUT';

  /* 5. return HTML back to the browser --------------------------------- */
  res.status(200).type('html').send(html);
};
