const form      = document.getElementById('seo-form');
const inputSect = document.getElementById('input-section');
const outputSect= document.getElementById('output-section');
const genPre    = document.getElementById('generated');
const preview   = document.getElementById('preview');
const btnBack   = document.getElementById('btn-back');
const btnRetry  = document.getElementById('btn-retry');

const WEBHOOK   = 'YOUR_N8N_WEBHOOK_URL';   // <-- replace

function show(el){ el.classList.remove('hidden'); }
function hide(el){ el.classList.add('hidden'); }

// initial
show(inputSect); hide(outputSect);

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form));
  hide(inputSect);
  show(outputSect);
  genPre.textContent = 'Generating...';
  preview.srcdoc = '';

  try {
    const res = await fetch(WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const contentType = res.headers.get("content-type");

    if (contentType && contentType.includes("application/json")) {
      const json = await res.json();
      if (json.status === "error") {
        genPre.textContent = `Error: ${json.message}`;
        preview.srcdoc = `<div style="color: red; font-weight: bold;">${json.message}</div>`;
        return;
      }
    }

    // Assume it's HTML if it's not JSON
    const html = await res.text();
    genPre.textContent = html;
    preview.srcdoc = html;

  } catch (err) {
    genPre.textContent = 'Error: ' + err.message;
  }
});

btnBack.addEventListener('click',()=>{ show(inputSect); hide(outputSect);} );
btnRetry.addEventListener('click',()=> form.reset());
