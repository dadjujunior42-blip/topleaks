/* TOPLEAKS : publicité de 20 s avant la vidéo suivante (fichier autonome, ne modifie pas app.js)
   Règle : quand une vidéo se termine, la prochaine vidéo lue commence par la pub. */
(function(){
  'use strict';
  /* ---------- Réglages ---------- */
  var AD_VIDEO='';          /* facultatif : lien https d'un fichier .mp4 de pub ; vide = animation intégrée */
  var DUR=20;               /* durée de l'animation en secondes */
  var SKIP_AFTER=5;         /* bouton « Passer » après X secondes ; 0 = pas de bouton */
  var WA='243845629514',PHONE='0845629514';

  var vid=document.getElementById('vid'),player=document.getElementById('player');
  if(!vid||!player)return;
  var pending=false,active=false,ov=null,tick=null,t0=0;

  /* ---------- Style ---------- */
  var css='.ta{position:absolute;inset:0;z-index:60;overflow:hidden;background:#07070a;color:#fff;container-type:size}.ta *{box-sizing:border-box}'+
  '.ta-bg{position:absolute;inset:-20%;background:radial-gradient(40% 40% at 25% 30%,rgba(255,178,30,.38),transparent 70%),radial-gradient(45% 45% at 80% 75%,rgba(130,90,200,.38),transparent 70%);animation:ta-drift 20s linear both}'+
  '@keyframes ta-drift{from{transform:translate(-4%,-3%) scale(1)}to{transform:translate(5%,4%) scale(1.15)}}'+
  '.ta-s{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2.6cqmin;padding:7cqmin 5cqmin;text-align:center;opacity:0;animation:ta-sc var(--d) linear var(--t) both}'+
  '@keyframes ta-sc{0%{opacity:0}6%{opacity:1}94%{opacity:1}100%{opacity:0}}'+
  '.ta-i{opacity:0;animation:ta-up .7s cubic-bezier(.2,.8,.2,1) calc(var(--t) + var(--o,0s)) both}'+
  '@keyframes ta-up{from{opacity:0;transform:translateY(4cqmin) scale(.96)}to{opacity:1;transform:none}}'+
  '.ta-logo{font-weight:800;font-size:13cqmin;letter-spacing:-.02em;line-height:1}.ta-logo b{color:#ffb21e}'+
  '.ta-h1{font-weight:800;font-size:7.6cqmin;line-height:1.1}.ta-h1 em{font-style:normal;color:#ffb21e}'+
  '.ta-p{font-size:3.5cqmin;color:#c9c4ba}'+
  '.ta-row{display:flex;flex-wrap:wrap;gap:1.8cqmin;justify-content:center}'+
  '.ta-chip{padding:1.5cqmin 3.2cqmin;border:1px solid rgba(255,255,255,.2);background:rgba(255,255,255,.08);border-radius:99px;font-size:3.4cqmin;font-weight:700}'+
  '.ta-cnt{font-size:13cqmin;font-weight:800;color:#ffb21e;line-height:1}'+
  '.ta-heart{position:absolute;bottom:8%;font-size:6cqmin;color:#ff4d6d;opacity:0;animation:ta-fl 2.6s ease-in infinite backwards;animation-delay:calc(var(--t) + var(--o))}'+
  '@keyframes ta-fl{0%{opacity:0;transform:translateY(0) scale(.6)}15%{opacity:1}100%{opacity:0;transform:translateY(-55cqmin) scale(1.2)}}'+
  '.ta-br{width:min(66cqmin,84cqw);border-radius:2.4cqmin;background:#14141a;border:1px solid rgba(255,255,255,.16);overflow:hidden}'+
  '.ta-bar{display:flex;gap:1.2cqmin;padding:1.8cqmin 2.2cqmin;background:#1d1d25}.ta-bar i{width:1.8cqmin;height:1.8cqmin;border-radius:50%;background:#ffb21e;opacity:.8}.ta-bar i:nth-child(2){background:#7f7f8a}.ta-bar i:nth-child(3){background:#4a4a55}'+
  '.ta-bd{padding:2.6cqmin;display:flex;flex-direction:column;gap:1.8cqmin}'+
  '.ta-l{height:2cqmin;border-radius:99px;background:rgba(255,255,255,.2);transform-origin:left;animation:ta-gr .6s ease calc(var(--t) + var(--o)) both}.ta-l.a{background:#ffb21e;height:7cqmin;border-radius:1.4cqmin}'+
  '@keyframes ta-gr{from{transform:scaleX(0);opacity:0}to{transform:none;opacity:1}}'+
  '.ta-ph{width:25cqmin;height:40cqmin;border-radius:4cqmin;border:.8cqmin solid #2e2e38;background:#0e0e13;padding:3cqmin;display:grid;grid-template-columns:repeat(3,1fr);gap:2cqmin;align-content:start}'+
  '.ta-tile{aspect-ratio:1;border-radius:1.8cqmin;background:linear-gradient(135deg,#ffb21e,#ff6a3d);animation:ta-pop .5s cubic-bezier(.3,1.6,.5,1) calc(var(--t) + var(--o)) both}.ta-tile:nth-child(3n){background:linear-gradient(135deg,#8a63ff,#4f8bff)}.ta-tile:nth-child(3n+2){background:linear-gradient(135deg,#34c46a,#1f9d8f)}'+
  '@keyframes ta-pop{from{transform:scale(0);opacity:0}to{transform:none;opacity:1}}'+
  '.ta-num{font-size:9cqmin;font-weight:800;color:#25d366}'+
  '.ta-btn{display:inline-block;margin-top:1cqmin;background:#25d366;color:#04200f;font-weight:800;font-size:3.8cqmin;padding:2cqmin 5cqmin;border-radius:99px;text-decoration:none;animation:ta-pulse 1.4s ease-in-out infinite}'+
  '@keyframes ta-pulse{50%{transform:scale(1.06)}}'+
  '.ta-top{position:absolute;top:0;left:0;right:0;display:flex;justify-content:space-between;align-items:center;padding:2.4cqmin 2.8cqmin;z-index:3}'+
  '.ta-back{background:rgba(0,0,0,.45);border:0;color:#fff;width:9cqmin;height:9cqmin;min-width:34px;min-height:34px;border-radius:50%;font-size:5cqmin;cursor:pointer}'+
  '.ta-lab{background:rgba(0,0,0,.5);padding:1.1cqmin 2.6cqmin;border-radius:99px;font-size:3cqmin;font-weight:700}'+
  '.ta-skip{position:absolute;right:2.8cqmin;bottom:5cqmin;z-index:3;background:rgba(0,0,0,.6);color:#fff;border:1px solid rgba(255,255,255,.35);border-radius:99px;padding:1.4cqmin 3.4cqmin;font-size:3.2cqmin;font-weight:700;cursor:pointer}'+
  '.ta-pg{position:absolute;left:0;right:0;bottom:0;height:1.1cqmin;min-height:3px;background:rgba(255,255,255,.15);z-index:3}.ta-pg i{display:block;height:100%;background:#ffb21e;transform-origin:left;animation:ta-bar var(--dur) linear both}'+
  '@keyframes ta-bar{from{transform:scaleX(0)}to{transform:scaleX(1)}}'+
  '.ta video{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;background:#000}';
  var st=document.createElement('style');st.textContent=css;document.head.appendChild(st);

  /* ---------- Contenu de l'animation (20 s : 4 + 4,5 + 4 + 3,5 + 4) ---------- */
  function scenes(){
    var hearts='';for(var i=0;i<7;i++)hearts+='<span class="ta-heart" style="left:'+(10+i*13)+'%;--o:'+(i*.35).toFixed(2)+'s">♥</span>';
    var lines='';[['',0],['',.25],['',.5],['a',.8],['',1.1],['',1.35]].forEach(function(l,i){lines+='<div class="ta-l '+l[0]+'" style="--o:'+(.4+l[1])+'s;width:'+[90,70,82,100,60,76][i]+'%"></div>'});
    var tiles='';for(var j=0;j<9;j++)tiles+='<div class="ta-tile" style="--o:'+(.5+j*.2).toFixed(2)+'s"></div>';
    var msg=encodeURIComponent('Bonjour TOPLEAKS, je veux booster mes réseaux / créer un site ou une application.');
    return ''+
    '<div class="ta-s" style="--t:0s;--d:4s"><div class="ta-i ta-logo">TOP<b>LEAKS</b></div><div class="ta-i ta-h1" style="--o:.6s">Votre présence digitale,<br><em>à un autre niveau</em></div></div>'+
    '<div class="ta-s" style="--t:4s;--d:4.5s">'+hearts+'<div class="ta-i ta-h1">Boostez vos <em>réseaux sociaux</em></div><div class="ta-i ta-cnt" id="ta-cnt" style="--o:.4s">0</div><div class="ta-i ta-p" style="--o:.5s">likes gagnés pour nos clients</div><div class="ta-i ta-row" style="--o:.9s"><span class="ta-chip">Likes</span><span class="ta-chip">Abonnés</span><span class="ta-chip">Vues</span></div></div>'+
    '<div class="ta-s" style="--t:8.5s;--d:4s"><div class="ta-i ta-h1">Sites web <em>professionnels</em></div><div class="ta-i ta-br" style="--o:.3s"><div class="ta-bar"><i></i><i></i><i></i></div><div class="ta-bd">'+lines+'</div></div></div>'+
    '<div class="ta-s" style="--t:12.5s;--d:3.5s"><div class="ta-i ta-h1">Applications <em>mobiles</em></div><div class="ta-i ta-ph" style="--o:.3s">'+tiles+'</div></div>'+
    '<div class="ta-s" style="--t:16s;--d:4s"><div class="ta-i ta-h1">Lancez votre <em>projet</em></div><div class="ta-i ta-num" style="--o:.3s">'+PHONE+'</div><a class="ta-i ta-btn" style="--o:.6s" href="https://wa.me/'+WA+'?text='+msg+'" target="_blank" rel="noopener">Écrire sur WhatsApp</a></div>';
  }

  /* ---------- Lecture de la pub ---------- */
  function startAd(){
    active=true;t0=Date.now();
    ov=document.createElement('div');ov.className='ta';ov.setAttribute('role','region');ov.setAttribute('aria-label','Publicité');
    ov.style.setProperty('--dur',DUR+'s');
    ov.innerHTML=(AD_VIDEO?'<video id="ta-v" src="'+AD_VIDEO+'" autoplay playsinline></video>':'<div class="ta-bg"></div>'+scenes())+
      '<div class="ta-top"><button class="ta-back" type="button" aria-label="Retour">‹</button><span class="ta-lab">Publicité · <span id="ta-t">'+DUR+'</span> s</span></div>'+
      (SKIP_AFTER>0?'<button class="ta-skip" type="button" hidden>Passer ›</button>':'')+
      (AD_VIDEO?'':'<div class="ta-pg"><i></i></div>');
    if(getComputedStyle(player).position==='static')player.style.position='relative';
    player.appendChild(ov);
    ov.querySelector('.ta-back').addEventListener('click',function(){var b=document.getElementById('pback');endAd(false);if(b)b.click()});
    var sk=ov.querySelector('.ta-skip');if(sk)sk.addEventListener('click',function(){endAd(true)});
    var av=ov.querySelector('#ta-v');if(av)av.addEventListener('ended',function(){endAd(true)});
    tick=setInterval(function(){
      var s=(Date.now()-t0)/1000,det=document.getElementById('detail');
      if(det&&det.hidden){endAd(false);return}
      var t=ov.querySelector('#ta-t');if(t)t.textContent=Math.max(0,Math.ceil(DUR-s));
      var c=ov.querySelector('#ta-cnt');
      if(c){var k=Math.min(1,Math.max(0,(s-4.4)/3.4));c.textContent=Math.round(12500*(1-Math.pow(1-k,3))).toLocaleString('fr-FR')}
      if(sk&&s>=SKIP_AFTER)sk.hidden=false;
      if(!AD_VIDEO&&s>=DUR)endAd(true);
    },100);
  }
  function endAd(done){
    clearInterval(tick);
    if(ov&&ov.parentNode)ov.parentNode.removeChild(ov);
    ov=null;active=false;
    if(!done)return;           /* sortie sans finir : la pub reviendra à la prochaine lecture */
    pending=false;
    var p=vid.play();if(p&&p.catch)p.catch(function(){});
  }

  /* ---------- Déclencheurs : fin d'une vidéo, puis lecture de la suivante ---------- */
  document.addEventListener('ended',function(e){if(e.target===vid)pending=true},true);
  document.addEventListener('play',function(e){
    if(e.target!==vid||!pending||active)return;
    vid.pause();startAd();
  },true);
})();
