const form = document.getElementById('seo-form');
const inputSect = document.getElementById('input-section');
const outputSect = document.getElementById('output-section');
const genPre = document.getElementById('generated');
const preview = document.getElementById('preview');
const btnBack = document.getElementById('btn-back');
const btnRetry = document.getElementById('btn-retry');

function showElement(el) {
  el.classList.remove('hidden');
}
function hideElement(el) {
  el.classList.add('hidden');
}

// Initial state
showElement(inputSect);
hideElement(outputSect);

// Generate / Submit
form.addEventListener('submit', async e => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form));

  // Show output, hide input
  hideElement(inputSect);
  showElement(outputSect);
  genPre.textContent = 'Generating...';
  preview.srcdoc = '';

  try {
    const res = await fetch('YOUR_N8N_WEBHOOK_URL', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const html = await res.text();
    genPre.textContent = html;
    preview.srcdoc = html;
  } catch (err) {
    genPre.textContent = 'Error: ' + err.message;
  }
});

// Try Again (back to form)
btnBack.addEventListener('click', () => {
  showElement(inputSect);
  hideElement(outputSect);
});

// Try Again (clear) on input panel
btnRetry.addEventListener('click', () => {
  form.reset();
});
