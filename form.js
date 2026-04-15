const touched={};
const LIMITS={name:60,site:120,msg:400};

function sanitizeName(value){
  const cleaned=(value||'')
    .replace(/[^A-Za-zА-Яа-яІіЇїЄєҐґ'`\-\s]/g,'')
    .replace(/\s+/g,' ')
    .trimStart()
    .slice(0,LIMITS.name);
  return cleaned.replace(/(^|[\s-])([A-Za-zА-Яа-яІіЇїЄєҐґ])/g,(m,sep,char)=>sep+char.toUpperCase());
}

function sanitizeSite(value){
  return (value||'').replace(/\s+/g,'').slice(0,LIMITS.site);
}

function sanitizeMsg(value){
  return (value||'').replace(/\s{3,}/g,'  ').slice(0,LIMITS.msg);
}

function isLikelySpamText(value){
  const v=(value||'').trim();
  if(!v)return false;
  if(/(.)\1{6,}/.test(v))return true;
  if((v.match(/https?:\/\//gi)||[]).length>2)return true;
  const nonAlpha=(v.match(/[^A-Za-zА-Яа-яІіЇїЄєҐґ0-9\s]/g)||[]).length;
  if(nonAlpha>0 && nonAlpha/Math.max(v.length,1)>0.45)return true;
  return false;
}

function onFocus(id){const f=document.getElementById(id);if(f)f.classList.add('up');}
function onBlur(id,type){
  const f=document.getElementById(id);if(!f)return;
  const inp=f.querySelector('input,textarea');
  if(inp){
    if(type==='name')inp.value=sanitizeName(inp.value.trim());
    if(type==='site')inp.value=sanitizeSite(inp.value.trim());
    if(type==='none')inp.value=sanitizeMsg(inp.value.trim());
  }
  if(inp && !inp.value.trim())f.classList.remove('up');
  touched[id]=true;validate(id,type);syncBtn();
}
function onInput(id,type){
  const f=document.getElementById(id);if(!f)return;
  const inp=f.querySelector('input,textarea');
  if(inp){
    if(type==='name')inp.value=sanitizeName(inp.value);
    if(type==='site')inp.value=sanitizeSite(inp.value);
    if(type==='none')inp.value=sanitizeMsg(inp.value);
  }
  f.classList.toggle('up',!!(inp&&inp.value.trim()));
  if(touched[id])validate(id,type);
  syncBtn();
}

function formatPhone(digits){const d=digits.slice(0,9);let out='';if(d.length>0)out='('+d.slice(0,2);if(d.length>=2)out+=') '+d.slice(2,5);if(d.length>=5)out+='-'+d.slice(5,7);if(d.length>=7)out+='-'+d.slice(7,9);return out;}
function getDigits(){const p=document.getElementById('iPhone');return p?p.value.replace(/\D/g,''):'';}
function caretFromDigitPos(masked,digitPos){if(digitPos<=0)return 0;let seen=0;for(let i=0;i<masked.length;i++){if(/\d/.test(masked[i])){seen++;if(seen===digitPos)return i+1;}}return masked.length;}
function attachPhoneTracking(inp){if(inp._phoneTrackAttached)return;inp._phoneTrackAttached=true;inp.addEventListener('keydown',()=>{inp._prevValue=inp.value;inp._prevSelStart=inp.selectionStart??0;inp._prevSelEnd=inp.selectionEnd??0;});}
function onPhoneFocus(){const inp=document.getElementById('iPhone');if(!inp)return;attachPhoneTracking(inp);setTimeout(()=>{const len=inp.value.length;inp.setSelectionRange(len,len);},0);}
function onPhoneBlur(){touched.fPhone=true;validatePhone();syncBtn();}
function onPhoneInput(){
  const inp=document.getElementById('iPhone');if(!inp)return;
  attachPhoneTracking(inp);
  const value=inp.value;const caret=inp.selectionStart??value.length;
  const prevValue=inp._prevValue??value;const prevSelStart=inp._prevSelStart??caret;const prevSelEnd=inp._prevSelEnd??caret;
  let raw=value.replace(/\D/g,'');let digitsBeforeCaret=value.slice(0,caret).replace(/\D/g,'').length;
  const hadCollapsedSelection=prevSelStart===prevSelEnd;
  const backspaceOnSeparator=hadCollapsedSelection&&prevSelStart>0&&!/\d/.test(prevValue[prevSelStart-1]||'');
  if(backspaceOnSeparator)digitsBeforeCaret=Math.max(0,digitsBeforeCaret-1);
  if(raw.startsWith('380')){raw=raw.slice(3);digitsBeforeCaret=Math.max(0,digitsBeforeCaret-3);}
  else if(raw.startsWith('38')){raw=raw.slice(2);digitsBeforeCaret=Math.max(0,digitsBeforeCaret-2);}
  else if(raw.startsWith('0')){raw=raw.slice(1);digitsBeforeCaret=Math.max(0,digitsBeforeCaret-1);}
  raw=raw.slice(0,9);digitsBeforeCaret=Math.min(digitsBeforeCaret,raw.length);
  const masked=formatPhone(raw);inp.value=masked;
  const newCaret=caretFromDigitPos(masked,digitsBeforeCaret);inp.setSelectionRange(newCaret,newCaret);
  buildDots(raw.length);updatePhoneHint(raw);if(touched.fPhone)validatePhone();syncBtn();
}

function buildDots(n){const container=document.getElementById('phDots');if(!container)return;container.innerHTML='';for(let i=0;i<9;i++){const d=document.createElement('div');d.className='ph-dot'+(i<n?(n===9?' done':' filled'):'');container.appendChild(d);}}
function updatePhoneHint(digits){const hint=document.getElementById('phHint');const txt=document.getElementById('phHintText');if(!hint||!txt)return;if(digits.length===0){hint.className='ph-hint';txt.textContent='Введіть 9 цифр після +380';}else if(digits.length<9){hint.className='ph-hint';txt.textContent='Ще '+(9-digits.length)+' цифр';}else{hint.className='ph-hint valid-hint';txt.textContent='Номер прийнято';}}
function validatePhone(){const f=document.getElementById('fPhone');if(!f)return;const d=getDigits();if(d.length===0){f.classList.remove('ok','err');}else if(d.length<9){setErr(f,'ePhone','Потрібно 9 цифр: (XX) XXX-XX-XX');}else{setOk(f);}}

function validate(id,type){
  const f=document.getElementById(id);if(!f)return;
  if(type==='name'){
    const v=(document.getElementById('iName')?.value||'').trim();
    if(!v){setErr(f,'eName','Введіть ваше ім\'я');return;}
    if(v.length<2){setErr(f,'eName','Мінімум 2 символи');return;}
    if(isLikelySpamText(v)){setErr(f,'eName','Некоректне ім\'я');return;}
    setOk(f);
  }
  if(type==='site'){
    const v=(document.getElementById('iSite')?.value||'').trim();
    if(!v){setErr(f,'eSite','Введіть адресу сайту');return;}
    const ok=/^(https?:\/\/)?[\w\-]+\.[\w\-]{2,}/.test(v);
    ok?setOk(f):setErr(f,'eSite','Введіть коректний URL (наприклад site.ua)');
  }
  if(type==='none')setNeutral(f);
}
function setErr(fld,errId,msg){fld.classList.remove('ok');fld.classList.add('err');if(errId){const e=document.getElementById(errId);if(e)e.textContent=msg;}}
function setOk(fld){fld.classList.remove('err');fld.classList.add('ok');}
function setNeutral(fld){fld.classList.remove('err','ok');}
function syncBtn(){const name=(document.getElementById('iName')?.value||'').trim();const phone=getDigits().length===9;const site=(document.getElementById('iSite')?.value||'').trim();const siteOk=site&&/^(https?:\/\/)?[\w\-]+\.[\w\-]{2,}/.test(site);const btn=document.getElementById('btnSub');if(btn)btn.disabled=!(name&&phone&&siteOk);}

function doSubmit(){
  touched.fName=true;touched.fPhone=true;touched.fSite=true;
  const msgInput=document.getElementById('iMsg');
  if(msgInput){
    msgInput.value=sanitizeMsg(msgInput.value.trim());
    if(isLikelySpamText(msgInput.value)){
      const fMsg=document.getElementById('fMsg');
      if(fMsg){setErr(fMsg,null,'');}
      alert('Схоже на спам у полі коментаря. Перевірте текст.');
      return;
    }
  }
  validate('fName','name');validatePhone();validate('fSite','site');
  if(document.querySelector('.fld.err'))return;
  const fa=document.getElementById('formArea');const ss=document.getElementById('successScreen');const sm=document.getElementById('summary');
  if(fa)fa.style.display='none';if(sm)sm.style.display='none';if(ss)ss.style.display='block';
}
function prefillFromCalc(data){if(!data)return;if(data.setup!=null){const total=document.getElementById('sumTotal');if(total)total.textContent=data.setup;}if(data.mgmt!=null){const mgmt=document.getElementById('sumMgmt');if(mgmt)mgmt.textContent=data.mgmt;}if(data.tags&&data.tags.length){const tags=document.getElementById('sumTags');if(tags)tags.innerHTML=data.tags.map(t=>'<span class="sum-tag">'+t+'</span>').join('');}}
