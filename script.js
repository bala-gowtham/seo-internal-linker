console.log('🔌 script.js loaded');

const form      = document.getElementById('seo-form');
const inputSect = document.getElementById('input-section');
const outputSect= document.getElementById('output-section');
const genPre    = document.getElementById('generated');
const preview   = document.getElementById('preview');
const btnBack   = document.getElementById('btn-back');
const btnRetry  = document.getElementById('btn-retry');

// ← Here’s the corrected line:
const WEBHOOK = '/.netlify/functions/process-article';

console.log('🖊️ Attaching submit handler to', form, 'using WEBHOOK', WEBHOOK);

form.addEventListener('submit', async (e) => {
  console.log('✋ submit intercepted');
  e.preventDefault();
  // …the rest of your code…
});
