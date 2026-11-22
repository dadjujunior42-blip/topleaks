/* TOPLEAKS : enchaînement automatique + pub de 20 s avant la vidéo suivante.
   Fichier autonome : il ne modifie pas app.js, il écoute le lecteur (#vid) et clique comme un utilisateur. */
(function(){
  'use strict';

  /* ---------- Réglages ---------- */
  var AD_SECONDS=20;       /* durée de la pub */
  var SKIP_AFTER=5;        /* le bouton « Passer » apparaît après 5 s (mettre 0 pour le retirer) */
  var AD_START_TIMEOUT=8;  /* si la pub ne démarre pas en 8 s (réseau), on passe directement à la vidéo */
  /* Liste des pubs : mets ici les vidéos de pub uploadées sur R2.
     Exemple : {src:'https://pub-e3f10db5a5ee4cbea0471157bd183fbf.r2.dev/pub-1.mp4', link:'https://wa.me/243845629514', label:'En savoir plus'}
     Liste vide = aucune pub, l'enchaînement automatique marche quand même. */
  var ADS=[
    /* {src:'', link:'', label:''} */
  ];
  /* Les membres qui ont au moins un achat confirmé ne voient pas de pub */
  var SKIP_FOR_BUYERS=true;
  var SB_URL='https://hivmcstxtciynbdwgmpl.supabase.co',SB_KEY='sb_publishable_ioVVYvSUx040k5zA-lmRow_uTkpyabC';

  var $=function(s){return document.querySelector(s)};
  var vid=$('#vid'),player=$('#player'),detail=$('#detail');
  if(!vid||!player||!detail)return;

  var busy=false,own=false,overlay=null,adEl=null,idx=0,guard=null;

  /* ---------- Acheteur ? (mis en cache 5 min) ---------- */
  var buyerCache={v:false,t:0};
  function isBuyer(){
    if(!SKIP_FOR_BUYERS)return Promise.resolve(false);
    if(Date.now()-buyerCache.t<300000)return Promise.resolve(buyerCache.v);
    var tk='';
    try{var s=JSON.parse(localStorage.getItem('tl_auth_v1')||'null');tk=s&&s.access_token||''}catch(e){}
    if(!tk)return Promise.resolve(false);
    return fetch(SB_URL+'/rest/v1/purchases?select=video_id&status=eq.paid&limit=1',{headers:{apikey:SB_KEY,Authorization:'Bearer '+tk}})
      .then(function(r){return r.ok?r.json():[]})
      .then(function(rows){buyerCache={v:rows.length>0,t:Date.now()};return buyerCache.v})
      .catch(function(){return false});
  }

  /* ---------- Vidéo suivante : première suggestion gratuite de « Autres vidéos » ---------- */
  function nextId(){
    var cards=document.querySelectorAll('#relgrid .card');
    for(var i=0;i<cards.length;i++){
      if(cards[i].querySelector('.vip'))continue; /* on saute les VIP verrouillées */
      var b=cards[i].querySelector('[data-open]');
      if(b)return b.getAttribute('data-open');
    }
    return '';
  }
  function openById(id){
    var cards=document.querySelectorAll('#relgrid [data-open]');
    for(var i=0;i<cards.length;i++){
      if(cards[i].getAttribute('data-open')===id){own=true;cards[i].click();own=false;return true}
    }
    return false;
  }
  function startNext(){
    busy=false;
    var b=$('#watchnow');
    if(b)b.click(); /* même chemin que le clic « Regarder maintenant » : session, verrou VIP, reprise */
  }

  /* ---------- Pub ---------- */
  function cleanup(){
    clearTimeout(guard);
    if(adEl){try{adEl.pause();adEl.removeAttribute('src');adEl.load()}catch(e){}adEl=null}
    if(overlay&&overlay.parentNode)overlay.parentNode.removeChild(overlay);
    overlay=null;
  }
  function cancelAd(){if(!busy&&!overlay)return;busy=false;cleanup()}
  function showAd(done){
    var ad=ADS[idx%ADS.length];idx++;
    if(!ad||!ad.src){done();return}
    cleanup();
    try{vid.pause()}catch(e){}
    overlay=document.createElement('div');
    overlay.className='tl-ad';
    overlay.innerHTML='<video class="tl-ad-v" playsinline webkit-playsinline preload="auto"></video>'+
      '<div class="tl-ad-top"><span class="tl-ad-tag">Pub</span><span class="tl-ad-count">'+AD_SECONDS+'</span></div>'+
      '<div class="tl-ad-bot"><span>Votre vidéo démarre après la pub</span>'+
      (ad.link?'<a class="tl-ad-link" href="'+ad.link.replace(/"/g,'')+'" target="_blank" rel="noopener">'+(ad.label||'En savoir plus')+'</a>':'')+'</div>';
    if(SKIP_AFTER>0){
      var sk0=document.createElement('button');
      sk0.type='button';sk0.className='tl-ad-skip';sk0.disabled=true;sk0.textContent='Passer dans '+SKIP_AFTER;
      overlay.appendChild(sk0);
    }
    player.appendChild(overlay);
    adEl=overlay.querySelector('video');
    var count=overlay.querySelector('.tl-ad-count'),ended=false;
    function finish(){if(ended||!overlay)return;ended=true;cleanup();done()}
    var skip=overlay.querySelector('.tl-ad-skip');
    if(skip)skip.addEventListener('click',function(){if(!skip.disabled)finish()});
    adEl.addEventListener('timeupdate',function(){
      var left=Math.ceil(AD_SECONDS-adEl.currentTime);
      count.textContent=Math.max(0,left);
      if(skip){
        var s=Math.ceil(SKIP_AFTER-adEl.currentTime);
        if(s>0)skip.textContent='Passer dans '+s;
        else if(skip.disabled){skip.disabled=false;skip.textContent='Passer ›'}
      }
      if(adEl.currentTime>=AD_SECONDS)finish();
    });
    adEl.addEventListener('ended',finish);
    adEl.addEventListener('error',finish);
    adEl.addEventListener('playing',function(){clearTimeout(guard)});
    guard=setTimeout(finish,AD_START_TIMEOUT*1000);
    adEl.src=ad.src;
    var p=adEl.play();
    if(p&&p.catch)p.catch(function(){adEl.muted=true;var p2=adEl.play();if(p2&&p2.catch)p2.catch(finish)});
  }

  /* ---------- Fin d'une vidéo : suivante automatique, avec pub ---------- */
  vid.addEventListener('ended',function(){
    if(busy||detail.hidden)return;
    var id=nextId();if(!id)return;
    busy=true;
    isBuyer().then(function(buyer){
      if(detail.hidden){busy=false;return}
      if(!openById(id)){busy=false;return}
      if(buyer||!ADS.length)startNext();else showAd(startNext);
    });
  });

  /* L'utilisateur choisit lui-même une autre vidéo, ou quitte l'écran : on annule la pub en cours */
  document.addEventListener('click',function(e){
    if(!own&&busy&&e.target.closest('[data-open]'))cancelAd();
  },true);
  try{new MutationObserver(function(){if(detail.hidden)cancelAd()}).observe(detail,{attributes:true,attributeFilter:['hidden']})}catch(e){}
})();
