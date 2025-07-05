const form = document.getElementById('seo-form');
const resultPanel = document.getElementById('result-panel');
const resultContent = document.getElementById('result-content');
const tryAgainBtn = document.getElementById('try-again');

// Hide the result panel initially
resultPanel.style.display = 'none';

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const payload = {};
  data.forEach((v, k) => payload[k] = v);

  // Show loading
  resultContent.textContent = 'Generating...';
  resultPanel.style.display = 'block';
  form.parentElement.style.display = 'none';

  try {
    const response = await fetch('YOUR_N8N_WEBHOOK_URL', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const html = await response.text();
    resultContent.innerHTML = html;
  } catch (err) {
    resultContent.textContent = 'Error: ' + err.message;
  }
});

tryAgainBtn.addEventListener('click', () => {
  resultPanel.style.display = 'none';
  form.parentElement.style.display = 'flex';
});
