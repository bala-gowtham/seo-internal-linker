console.log('🔌 script.js loaded');
const form      = document.getElementById('seo-form');
const inputSect = document.getElementById('input-section');
const outputSect= document.getElementById('output-section');
const genPre    = document.getElementById('generated');
const preview   = document.getElementById('preview');
const btnBack   = document.getElementById('btn-back');
const btnRetry  = document.getElementById('btn-retry');

const WEBHOOK   = '/.netlify/functions/process-article';

function show(el){ el.classList.remove('hidden'); }
function hide(el){ el.classList.add('hidden'); }

// initial state
show(inputSect); hide(outputSect);

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form));
  hide(inputSect);
  show(outputSect);

  // Timer setup
  let seconds = 0;
  genPre.textContent = 'Generating, please wait...';
  preview.srcdoc = `
    <div id="loading-status" style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; font-family: sans-serif; color: #444;">
      <div class="spinner" style="border: 4px solid #f3f3f3; border-top: 4px solid #B90000; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite;"></div>
      <p id="timer-text" style="margin-top: 1rem;">Processing... 0s elapsed</p>
      <style>
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      </style>
    </div>
  `;

  const timer = setInterval(() => {
    seconds++;
    const iframeDoc = preview.contentDocument || preview.contentWindow.document;
    const timerText = iframeDoc.getElementById("timer-text");
    if (timerText) {
      timerText.textContent = `Processing... ${seconds}s elapsed`;
    }
  }, 1000);

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
        clearInterval(timer);
        genPre.textContent = `Error: ${json.message}`;
        preview.srcdoc = `
          <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; font-family: sans-serif; color: red;">
            <p style="font-weight: bold;">${json.message}</p>
            <p>Time elapsed: ${seconds}s</p>
          </div>
        `;
        return;
      }
    }

    // Assume it's HTML if not JSON
    const html = await res.text();
    clearInterval(timer);
    genPre.textContent = `Response received after ${seconds}s:\n\n` + html;
    preview.srcdoc = html;

  } catch (err) {
    clearInterval(timer);
    genPre.textContent = 'Error: ' + err.message;
    preview.srcdoc = `<p style="color: red;">Error: ${err.message}</p>`;
  }
});

btnBack.addEventListener('click', () => {
  show(inputSect);
  hide(outputSect);
});

btnRetry.addEventListener('click', () => {
  form.reset();
});
