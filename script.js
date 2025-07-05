const form=document.getElementById('seo-form');
const inputSection=document.querySelector('.input-section');
const outputSection=document.getElementById('output');
const genPre=document.getElementById('generated');
const preview=document.getElementById('preview');
const tryInput=document.getElementById('try-again-input');
const tryAgain=document.getElementById('try-again');

// Show input, hide output initially
inputSection.classList.remove('hidden');
outputSection.classList.add('hidden');

// Form submit → fetch & display
form.addEventListener('submit',async e=>{
  e.preventDefault();
  const data=Object.fromEntries(new FormData(form));
  genPre.textContent='Generating...';
  preview.srcdoc='';
  outputSection.classList.remove('hidden');
  inputSection.classList.add('hidden');
  try {
    const res=await fetch('YOUR_N8N_WEBHOOK_URL',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
    const html=await res.text();
    genPre.textContent=html;
    preview.srcdoc=html;
  } catch(err){genPre.textContent='Error: '+err.message;}
});

// Try again from output
tryAgain.addEventListener('click',()=>{
  outputSection.classList.add('hidden');
  inputSection.classList.remove('hidden');
});

// Allow clicking Try Again in input to reset
tryInput.addEventListener('click',()=>{
  form.reset();
});
