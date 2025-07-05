const form=document.getElementById('seo-form');
const output=document.getElementById('output');
const genBox=document.getElementById('generated');
const preview=document.getElementById('preview');
const tryBtn=document.getElementById('try-again');

output.classList.add('hidden');

form.addEventListener('submit',async e=>{
  e.preventDefault();
  const data=Object.fromEntries(new FormData(form));
  genBox.textContent='Generating...';
  preview.srcdoc='';
  output.classList.remove('hidden');
  form.closest('.form-panel').style.maxHeight='0';

  try{
    const res=await fetch('YOUR_N8N_WEBHOOK_URL',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
    const html=await res.text();
    genBox.textContent=html;
    preview.srcdoc=html;
  }catch(err){genBox.textContent='Error: '+err;}
});

tryBtn.addEventListener('click',()=>{
  output.classList.add('hidden');
  document.querySelector('.form-panel').style.maxHeight='none';
});
