const CODE='5923';let entered='',soundOn=true,holdRAF=0,holdStart=0;const HOLD_MS=1800;const screens=[...document.querySelectorAll('.screen')],pinDots=document.getElementById('pinDots'),wrongModal=document.getElementById('wrongModal');
function showScreen(name){screens.forEach(s=>s.classList.toggle('active',s.dataset.screen===name));if(name==='wish')resetCake();}
function renderDots(){pinDots.innerHTML='';for(let i=0;i<4;i++){const d=document.createElement('div');d.className='pin-dot'+(entered[i]?' filled':'');pinDots.appendChild(d)}}renderDots();
function beep(freq=520,duration=70){if(!soundOn)return;try{const C=window.AudioContext||window.webkitAudioContext;if(!C)return;const c=new C,o=c.createOscillator(),g=c.createGain();o.frequency.value=freq;o.type='sine';g.gain.setValueAtTime(.0001,c.currentTime);g.gain.exponentialRampToValueAtTime(.035,c.currentTime+.01);g.gain.exponentialRampToValueAtTime(.0001,c.currentTime+duration/1000);o.connect(g).connect(c.destination);o.start();o.stop(c.currentTime+duration/1000+.02)}catch(_){}}
document.getElementById('soundBtn').addEventListener('click',()=>{soundOn=!soundOn;document.getElementById('soundBtn').classList.toggle('on',soundOn);document.getElementById('soundBtn').textContent=soundOn?'♪':'×';beep(650,80)});
document.getElementById('keypad').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const k=b.dataset.key;beep(430+Math.random()*90,55);if(/^\d$/.test(k)&&entered.length<4)entered+=k;if(k==='clear')entered='';if(k==='delete')entered=entered.slice(0,-1);renderDots();if(entered.length===4)setTimeout(checkCode,180)});
function checkCode(){if(entered===CODE){beep(760,110);setTimeout(()=>beep(930,130),90);entered='';renderDots();showScreen('intro')}else{wrongModal.hidden=false;beep(210,130)}}document.getElementById('retryBtn').addEventListener('click',()=>{wrongModal.hidden=true;entered='';renderDots()});
document.querySelectorAll('[data-next]').forEach(b=>b.addEventListener('click',()=>{beep(650,75);showScreen(b.dataset.next)}));document.querySelectorAll('[data-back]').forEach(b=>b.addEventListener('click',()=>{beep(520,65);showScreen(b.dataset.back)}));
const candle=document.getElementById('candle'),wishMessage=document.getElementById('wishMessage'),wishNext=document.getElementById('wishNext'),candleHint=document.getElementById('candleHint'),cakeStage=document.getElementById('cakeStage');
function resetCake(){
  candle.classList.remove('blown');
  wishMessage.classList.remove('show');
  wishNext.hidden=true;
  candleHint.textContent='ဖယောင်းတိုင်လေးကို နှိပ်ပြီး မီးမှုတ်ပေးနော် 🕯️';
  const layers=[...cakeStage.querySelectorAll('.cake-layer')];
  const sparkles=[...cakeStage.querySelectorAll('.cake-sparkle')];
  layers.forEach(layer=>{layer.classList.remove('cake-drop-1','cake-drop-2','cake-drop-3','cake-drop-4');layer.style.animation='none';});
  sparkles.forEach(s=>s.style.animation='none');
  candle.style.animation='none';
  void cakeStage.offsetWidth;
  layers.forEach((layer,index)=>{layer.style.animation='';layer.classList.add('cake-drop-'+(index+1));});
  sparkles.forEach((s,index)=>{s.style.animation='';});
  candle.style.animation='';
}function blowCandle(){if(candle.classList.contains('blown'))return;candle.classList.add('blown');beep(280,90);setTimeout(()=>beep(190,130),80);candleHint.textContent='ဆုတောင်းလေးပြုထားပြီဆိုရင် ဆက်သွားလို့ရပြီနော် ♡';wishMessage.classList.add('show');setTimeout(()=>wishNext.hidden=false,500)}candle.addEventListener('click',blowCandle);candle.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();blowCandle()}});wishNext.addEventListener('click',()=>{beep(650,70);showScreen('hold')});
const holdHeart=document.getElementById('holdHeart'),ringProgress=document.getElementById('ringProgress'),holdPercent=document.getElementById('holdPercent'),holdContent=document.querySelector('.hold-content'),circumference=2*Math.PI*46;ringProgress.style.strokeDasharray=circumference;ringProgress.style.strokeDashoffset=circumference;
function updateHold(){const p=Math.min(1,(performance.now()-holdStart)/HOLD_MS);ringProgress.style.strokeDashoffset=circumference*(1-p);holdPercent.textContent=Math.round(p*100)+'%';if(p>=1){finishHold();return}holdRAF=requestAnimationFrame(updateHold)}function startHold(e){e.preventDefault();if(holdContent.classList.contains('done'))return;holdHeart.classList.add('holding');holdStart=performance.now();cancelAnimationFrame(holdRAF);holdRAF=requestAnimationFrame(updateHold)}function stopHold(){if(holdContent.classList.contains('done'))return;cancelAnimationFrame(holdRAF);holdHeart.classList.remove('holding');ringProgress.style.strokeDashoffset=circumference;holdPercent.textContent='0%'}function finishHold(){cancelAnimationFrame(holdRAF);holdHeart.classList.remove('holding');holdContent.classList.add('done');beep(760,90);setTimeout(()=>beep(980,120),100);setTimeout(()=>showScreen('gift'),700)}holdHeart.addEventListener('pointerdown',startHold);holdHeart.addEventListener('pointerup',stopHold);holdHeart.addEventListener('pointercancel',stopHold);holdHeart.addEventListener('pointerleave',stopHold);
document.querySelectorAll('[data-open]').forEach(b=>b.addEventListener('click',()=>{beep(620,75);showScreen(b.dataset.open)}));showScreen('code');
