/* ---------- script.js  ---------- */
console.log('🔌 script.js loaded');

/* 1️⃣ grab DOM elements first */
const form      = document.getElementById('seo-form');
const inputSect = document.getElementById('input-section');
const outputSect= document.getElementById('output-section');
const genPre    = document.getElementById('generated');
const preview   = document.getElementById('preview');
const btnBack   = document.getElementById('btn-back');
const btnRetry  = document.getElementById('btn-retry');

/* 2️⃣ endpoint for the Netlify Function */
const WEBHOOK = '/.netlify/functions/process-article';
console.log('🎯 WEBHOOK =', WEBHOOK);

/* ---------- main submit handler ---------- */
form.addEventListener('submit', async (e) => {
  console.log('✋ submit intercepted');
  e.preventDefault();

  /* collect form data */
  const data = Object.fromEntries(new FormData(form));
  console.log('🚀 sending', data);

  /* switch UI to “loading” */
  inputSect.classList.add('hidden');
  outputSect.classList.remove('hidden');
  genPre.textContent = 'Generating, please wait…';
  preview.srcdoc = '<p style="font-family:sans-serif;text-align:center;">Loading…</p>';

  try {
    const res = await fetch(WEBHOOK, {
      method : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body   : JSON.stringify(data),
    });
    console.log('📥 status', res.status);

    /* if n8n returned JSON error */
    if (res.headers.get('content-type')?.includes('application/json')) {
      const json = await res.json();
      if (json.status === 'error') {
        genPre.textContent = `Error: ${json.message}`;
        preview.srcdoc = `<p style="color:red;">${json.message}</p>`;
        return;
      }
    }

    /* otherwise treat as HTML */
    const html = await res.text();
    console.log('🎉 html', html.slice(0, 80) + '…');

    genPre.textContent = html;   // raw view
    preview.srcdoc     = html;   // rendered view

  } catch (err) {
    console.error(err);
    genPre.textContent = 'Network / server error:\n' + err.message;
    preview.srcdoc     = `<p style="color:red;">${err.message}</p>`;
  }
});

/* ---------- optional buttons ---------- */
btnBack.addEventListener('click', () => {
  outputSect.classList.add('hidden');
  inputSect.classList.remove('hidden');
});
btnRetry.addEventListener('click', () => form.reset());
