let S={biz:'services',cx:'s1',camps:JSON.parse(JSON.stringify(DATA.services))};

function buildCxPills(){
  const list=CX[S.biz];
  const firstVal=list[0].val;
  if(!list.find(c=>c.val===S.cx))S.cx=firstVal;
  document.getElementById('cxpills').innerHTML=list.map(cx=>`
    <button class="cxp ${cx.val===S.cx?'on':''}" onclick="setCx(this,'${cx.val}')">
      ${cx.t}<small>${cx.add}</small>
    </button>`).join('');
}

function render(){
  const cr=document.getElementById('crows');
  cr.innerHTML=S.camps.map((c,i)=>`
    <div class="cr ${c.on?'on':''}" onclick="tog(${i})">
      <div class="tog ${c.on?'on':''}"></div>
      <div class="cri"><div class="crn">${c.n}${c.perf?'<span class="crp"> ·</span>':''}</div><div class="crs">${c.s}</div></div>
      ${c.badge?`<div class="crbadge">${c.badge}</div>`:''}
      <div class="crcost">+$${c.setup}</div>
    </div>`).join('');
  upd();
}

function upd(){
  const cxList=CX[S.biz];
  const cx=cxList.find(c=>c.val===S.cx)||cxList[0];
  const mult=cx.mult;
  const act=S.camps.filter(c=>c.on);
  const perf=act.filter(c=>c.perf);
  const fixed=act.filter(c=>!c.perf);
  let pS=0,pM=0,fS=0,fM=0;
  perf.forEach(c=>{pS+=c.setup;pM+=c.mgmt;});
  fixed.forEach(c=>{fS+=c.setup;fM+=c.mgmt;});
  const n=act.length;
  const scale=n>=5?1.20:n>=3?1.10:1.00;
  const scaleLabel=n>=5?'+20%':n>=3?'+10%':'';
  const campS=Math.round(pS*mult)+fS,campM=Math.round(pM*mult)+fM;
  const subS=BASE_S+campS,subM=BASE_M+campM;
  const totS=Math.round(subS*scale),totM=Math.round(subM*scale);
  const first=totS+totM,rec=Math.round(first*0.85);
  an('pS',first);
  document.getElementById('pM').textContent='$'+rec;
  document.getElementById('pC').textContent=act.length;
  const mbd=document.getElementById('mbd');
  let rows=`<div class="mbdr"><span style="display:flex;align-items:center;gap:3px;"><span class="mbdd" style="background:var(--g)"></span>Базова ставка</span><span>$${BASE_S}/$${BASE_M}</span></div>`;
  if(perf.length)rows+=`<div class="mbdr"><span style="display:flex;align-items:center;gap:3px;"><span class="mbdd" style="background:var(--bl)"></span>Основні · (×${mult})</span><span>$${Math.round(pS*mult)}/$${Math.round(pM*mult)}</span></div>`;
  if(fixed.length)rows+=`<div class="mbdr"><span style="display:flex;align-items:center;gap:3px;"><span class="mbdd" style="background:var(--m)"></span>Фіксовані</span><span>$${fS}/$${fM}</span></div>`;
  if(scaleLabel)rows+=`<div class="mbdr"><span style="display:flex;align-items:center;gap:3px;"><span class="mbdd" style="background:var(--gold)"></span>Масштаб ${scaleLabel}</span><span>+$${totS-subS}/+$${totM-subM}</span></div>`;
  rows+=`<div class="mbdr hi"><span>1-й міс. / далі</span><span>$${first}/$${rec}</span></div>`;
  mbd.innerHTML=rows;
  document.getElementById('sels').innerHTML=act.length?act.map(c=>`<div class="si"><div class="sdot"></div>${c.n}</div>`).join(''):`<div style="font-size:10px;color:var(--m)">Оберіть кампанії</div>`;
}

function an(id,to){
  const el=document.getElementById(id),from=parseInt(el.textContent)||0,diff=to-from,steps=18;let i=0;
  clearInterval(el._t);el._t=setInterval(()=>{i++;el.textContent=Math.round(from+diff*(i/steps));if(i>=steps){clearInterval(el._t);el.textContent=to;}},14);
}
function tog(i){S.camps[i].on=!S.camps[i].on;render();}
function setBiz(btn,biz){document.querySelectorAll('.bt').forEach(b=>b.classList.remove('on'));btn.classList.add('on');S.biz=biz;S.camps=JSON.parse(JSON.stringify(DATA[biz]));buildCxPills();render();}
function setCx(btn,val){document.querySelectorAll('.cxp').forEach(b=>b.classList.remove('on'));btn.classList.add('on');S.cx=val;upd();}

function handleCTA(){
  const cx=CX[S.biz].find(c=>c.val===S.cx)||CX[S.biz][0];
  const act=S.camps.filter(c=>c.on),perf=act.filter(c=>c.perf),fixed=act.filter(c=>!c.perf);
  let pS=0,pM=0,fS=0,fM=0;perf.forEach(c=>{pS+=c.setup;pM+=c.mgmt;});fixed.forEach(c=>{fS+=c.setup;fM+=c.mgmt;});
  const n=act.length,scale=n>=5?1.20:n>=3?1.10:1.00,campS=Math.round(pS*cx.mult)+fS,campM=Math.round(pM*cx.mult)+fM;
  const first=Math.round((BASE_S+campS)*scale)+Math.round((BASE_M+campM)*scale);
  const bizL={services:'Послуги',ecom:'E-commerce',lead:'Ліди/B2B'}[S.biz]||'';
  openDrawer({setup:first,mgmt:Math.round(first*0.85),tags:[bizL+' · '+cx.t,...act.map(c=>c.n)]});
}

function openDrawer(data){
  document.getElementById('drawerOverlay').classList.add('open');
  document.body.style.overflow='hidden';
  const dc=document.getElementById('drawerContent');
  if(!dc._mounted){
    const ff=document.getElementById('ffph').querySelector('#fform');
    if(ff){dc.appendChild(ff);ff.style.display='block';dc._mounted=true;}
  }
  if(data)prefillFromCalc(data);
  const fa=document.getElementById('formArea'),ss=document.getElementById('successScreen'),sm=document.getElementById('summary');
  if(fa)fa.style.display='block';if(ss)ss.style.display='none';if(sm)sm.style.display='flex';
}
function closeDrawer(){document.getElementById('drawerOverlay').classList.remove('open');document.body.style.overflow='';}
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeDrawer();});
