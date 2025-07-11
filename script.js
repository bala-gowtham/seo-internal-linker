form.addEventListener('submit', async (e) => {
  console.log('✋ submit intercepted');
  e.preventDefault();

  // 1️⃣  collect form data
  const data = Object.fromEntries(new FormData(form));
  console.log('🚀 sending', data);

  // 2️⃣  show the output section + loading animation
  inputSect.classList.add('hidden');
  outputSect.classList.remove('hidden');
  genPre.textContent = 'Generating, please wait…';
  preview.srcdoc = '<p style="font-family:sans-serif;text-align:center;">Loading…</p>';

  try {
    // 3️⃣  call your Netlify Function → n8n
    const res = await fetch(WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    console.log('📥 status', res.status);

    // If your n8n error branch returns JSON
    if (res.headers.get('content-type')?.includes('application/json')) {
      const json = await res.json();
      if (json.status === 'error') {
        genPre.textContent = `Error: ${json.message}`;
        preview.srcdoc = `<p style="color:red;">${json.message}</p>`;
        return;
      }
    }

    // 4️⃣  assume HTML body on success
    const html = await res.text();
    console.log('🎉 html', html.slice(0, 80) + '…');

    genPre.textContent = html;   // raw HTML in <pre>
    preview.srcdoc = html;       // rendered in <iframe>

  } catch (err) {
    console.error(err);
    genPre.textContent = 'Network / server error:\n' + err.message;
    preview.srcdoc = `<p style="color:red;">${err.message}</p>`;
  }
});
