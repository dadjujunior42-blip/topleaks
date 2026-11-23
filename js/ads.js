/* TOPLEAKS : enchaînement automatique intelligent + pub avant la vidéo suivante.
   Fichier autonome : il ne modifie pas app.js, il écoute le lecteur (#vid) et clique comme un utilisateur.

   Ce que fait ce fichier :
   1) À la fin d'une vidéo, il choisit la suivante dans TOUT le catalogue gratuit (plus seulement la 1re suggestion),
      en évitant les vidéos déjà regardées pendant la session. Les vidéos de même artiste ou même catégorie sont favorisées.
   2) Il affiche un écran « Prochaine vidéo dans 5 s » (Lancer maintenant / Annuler).
   3) Puis, si une pub est configurée dans l'admin (onglet Pubs) et que la personne n'a aucun achat confirmé,
      il joue la pub (20 s max, bouton « Passer » après 5 s), puis lance la vidéo.
   4) La liste des pubs est relue à chaque fin de vidéo (une pub ajoutée à l'instant apparaît sans recharger la page)
      et la pub est préchargée pendant la fin de la vidéo pour démarrer sans attente. */
(function(){
  'use strict';

  /* ---------- Réglages ---------- */
  var AD_SECONDS=20;        /* durée maximale de la pub */
  var SKIP_AFTER=5;         /* le bouton « Passer » apparaît après 5 s (0 = pas de bouton) */
  var AD_START_TIMEOUT=15;  /* si la pub ne démarre pas en 15 s (réseau lent), on passe à la vidéo */
  var NEXT_SECONDS=5;       /* compte à rebours avant la vidéo suivante */
  var SKIP_FOR_BUYERS=true; /* les membres avec au moins un achat confirmé ne voient pas de pub */
  var CFG_TTL=60000;        /* la liste des pubs est relue au plus toutes les 60 s */
  var CAT_TTL=180000;       /* le catalogue est relu au plus toutes les 3 min */
  var HIST_MAX=60,HK='tl_watched_v1';
  var SB_URL='https://hivmcstxtciynbdwgmpl.supabase.co',SB_KEY='sb_publishable_ioVVYvSUx040k5zA-lmRow_uTkpyabC';

  var $=function(s){return document.querySelector(s)};
  var vid=$('#vid'),player=$('#player'),detail=$('#detail');
  if(!vid||!player||!detail)return;

  var ADS=[],adsOn=true,cfgAt=0,cfgBusy=null;
  var CAT=[],catAt=0,catBusy=null;
  var busy=false,own=false,stage='',runId=0,overlay=null,adEl=null,guard=null,tick=null;
  var lastOpened='',lastAd='',nextAd=null,pre=null,prepped=false;
  var buyerCache={v:false,t:0};

  /* ---------- Utilitaires ---------- */
  function tmo(p,ms){
    return new Promise(function(res,rej){
      var t=setTimeout(function(){rej(new Error('timeout'))},ms);
      p.then(function(v){clearTimeout(t);res(v)},function(e){clearTimeout(t);rej(e)});
    });
  }
  function wait(ms){return new Promise(function(r){setTimeout(r,ms)})}
  function https(u){u=u==null?'':String(u).trim();return /^https:\/\//.test(u)?u:''}
  function saveData(){try{return !!(navigator.connection&&navigator.connection.saveData)}catch(e){return false}}

  /* ---------- Liste des pubs (table app_settings, clé ads_config) ---------- */
  function loadConfig(force){
    if(!force&&cfgAt&&Date.now()-cfgAt<CFG_TTL)return Promise.resolve();
    if(cfgBusy)return cfgBusy;
    cfgBusy=tmo(fetch(SB_URL+'/rest/v1/app_settings?select=value&key=eq.ads_config',{headers:{apikey:SB_KEY},cache:'no-store'}),5000)
      .then(function(r){return r.ok?r.json():null})
      .then(function(rows){
        if(!rows)return; /* erreur réseau ou accès refusé : on garde la dernière liste connue */
        var v=rows[0]&&rows[0].value;
        if(typeof v==='string'){try{v=JSON.parse(v)}catch(e){v=null}}
        cfgAt=Date.now();
        if(!v||typeof v!=='object'){ADS=[];adsOn=true;return}
        adsOn=v.on!==false;
        ADS=Array.isArray(v.list)?v.list.filter(Boolean).map(function(s){return typeof s==='string'?{src:s}:s}).filter(function(a){return a&&https(a.src)}):[];
      })
      .catch(function(){})
      .then(function(){cfgBusy=null});
    return cfgBusy;
  }

  /* ---------- Catalogue (pour choisir la vidéo suivante) ---------- */
  function loadCat(force){
    if(!force&&CAT.length&&Date.now()-catAt<CAT_TTL)return Promise.resolve();
    if(catBusy)return catBusy;
    var base=SB_URL+'/rest/v1/videos?select=',tail='&is_published=eq.true&order=created_at.desc&limit=500';
    function get(f){return fetch(base+f+tail,{headers:{apikey:SB_KEY}})}
    catBusy=tmo(get('id,title,artist,category_id,price_fc').then(function(r){return r.status===400?get('id,title,artist,price_fc'):r}),6000)
      .then(function(r){return r.ok?r.json():null})
      .then(function(rows){
        if(!Array.isArray(rows))return;
        CAT=rows.map(function(r){
          return {id:String(r.id),t:r.title||'Sans titre',a:r.artist||'',c:r.category_id==null?'':String(r.category_id),p:+r.price_fc||0};
        });
        catAt=Date.now();
      })
      .catch(function(){})
      .then(function(){catBusy=null});
    return catBusy;
  }

  /* ---------- Acheteur ? (mis en cache 5 min) ---------- */
  function isBuyer(){
    if(!SKIP_FOR_BUYERS)return Promise.resolve(false);
    if(Date.now()-buyerCache.t<300000)return Promise.resolve(buyerCache.v);
    var tk='';
    try{var s=JSON.parse(localStorage.getItem('tl_auth_v1')||'null');tk=s&&s.access_token||''}catch(e){}
    if(!tk)return Promise.resolve(false);
    return tmo(fetch(SB_URL+'/rest/v1/purchases?select=video_id&status=eq.paid&limit=1',{headers:{apikey:SB_KEY,Authorization:'Bearer '+tk}}),3000)
      .then(function(r){return r.ok?r.json():[]})
      .then(function(rows){buyerCache={v:rows.length>0,t:Date.now()};return buyerCache.v})
      .catch(function(){return false});
  }

  /* ---------- Historique des vidéos vues (cette session) ---------- */
  function hist(){try{var a=JSON.parse(sessionStorage.getItem(HK)||'[]');return Array.isArray(a)?a:[]}catch(e){return []}}
  function setHist(a){try{sessionStorage.setItem(HK,JSON.stringify(a.slice(-HIST_MAX)))}catch(e){}}
  function mark(id){
    if(!id)return;
    var h=hist().filter(function(x){return x!==id});h.push(id);setHist(h);
  }
  /* Vidéo actuellement ouverte : dernier clic connu, vérifié avec le titre affiché (couvre aussi les liens partagés ?video=) */
  function curId(){
    var el=$('#dtitle'),title=(el&&el.textContent||'').trim(),found='';
    for(var i=0;i<CAT.length;i++){
      if(CAT[i].t===title){
        if(CAT[i].id===lastOpened)return lastOpened;
        if(!found)found=CAT[i].id;
      }
    }
    return found||lastOpened;
  }

  /* ---------- Choix de la vidéo suivante ---------- */
  function pickNext(){
    if(!CAT.length)return null;
    var cur=curId(),h=hist(),curV=null,i;
    for(i=0;i<CAT.length;i++)if(CAT[i].id===cur)curV=CAT[i];
    var free=CAT.filter(function(x){return x.p===0&&x.id!==cur});
    if(!free.length)return null;
    var fresh=free.filter(function(x){return h.indexOf(x.id)<0});
    if(!fresh.length){
      /* tout a été vu : on repart de zéro, sans reprendre la vidéo précédente si possible */
      var prev=h.filter(function(x){return x!==cur}).pop();
      setHist(cur?[cur]:[]);
      fresh=free.filter(function(x){return x.id!==prev});
      if(!fresh.length)fresh=free;
    }
    var tot=0,w=fresh.map(function(x){
      var s=1;
      if(curV){if(x.a&&x.a===curV.a)s+=3;if(x.c&&x.c===curV.c)s+=3}
      tot+=s;return s;
    });
    var r=Math.random()*tot;
    for(i=0;i<fresh.length;i++){r-=w[i];if(r<=0)return fresh[i]}
    return fresh[fresh.length-1];
  }
  /* Repli si le catalogue n'a pas pu être chargé : suggestions gratuites de « Autres vidéos » pas encore vues */
  function domNext(){
    var h=hist(),cards=document.querySelectorAll('#relgrid .card');
    for(var i=0;i<cards.length;i++){
      var c=cards[i];
      if(c.querySelector('.vip'))continue;
      var b=c.querySelector('[data-open]');if(!b)continue;
      var id=b.getAttribute('data-open');if(h.indexOf(id)>-1)continue;
      var t=c.querySelector('.c-title');
      return {id:id,t:t?t.textContent:'',a:'',c:'',p:0};
    }
    return null;
  }
  function domThumb(id){
    var im=document.querySelector('[data-open="'+String(id).replace(/["\\]/g,'')+'"] img.thumb-img');
    return im?(im.getAttribute('src')||''):'';
  }
  /* Ouvre la vidéo comme si l'utilisateur touchait sa carte */
  function openById(nx){
    var b=document.createElement('button');
    b.type='button';b.hidden=true;b.setAttribute('data-open',nx.id);
    document.body.appendChild(b);
    own=true;
    try{b.click()}finally{own=false;document.body.removeChild(b)}
    var el=$('#dtitle');
    return !nx.t||!el||el.textContent===nx.t;
  }
  function startNext(){
    busy=false;stage='';
    var b=$('#watchnow');
    if(b)b.click(); /* même chemin que « Regarder maintenant » : session, verrou VIP, reprise */
  }

  /* ---------- Nettoyage / annulation ---------- */
  function cleanup(){
    clearTimeout(guard);clearInterval(tick);
    if(adEl){try{adEl.pause();adEl.removeAttribute('src');adEl.load()}catch(e){}adEl=null}
    if(overlay&&overlay.parentNode)overlay.parentNode.removeChild(overlay);
    overlay=null;
  }
  function cancelAll(){
    runId++;busy=false;stage='';cleanup();
  }

  /* ---------- Pub : choix et préchargement ---------- */
  function pickAd(){
    if(!adsOn||!ADS.length)return null;
    var c=ADS.filter(function(a){return a&&https(a.src)});
    if(!c.length)return null;
    if(c.length>1){var d=c.filter(function(a){return a.src!==lastAd});if(d.length)c=d}
    return c[Math.floor(Math.random()*c.length)];
  }
  function prepAd(){
    try{
      if(saveData()||buyerCache.v)return;
      if(nextAd&&!ADS.some(function(a){return a.src===nextAd.src})){nextAd=null;pre=null}
      if(!nextAd)nextAd=pickAd();
      if(!nextAd)return;
      if(pre&&pre.getAttribute('data-src')===nextAd.src)return;
      var v=document.createElement('video');
      v.className='tl-ad-v';v.preload='auto';v.playsInline=true;
      v.setAttribute('playsinline','');v.setAttribute('webkit-playsinline','');
      v.setAttribute('data-src',nextAd.src);
      v.src=nextAd.src;
      try{v.load()}catch(e){}
      pre=v;
    }catch(e){}
  }

  /* ---------- Écran « Prochaine vidéo dans 5 s » ---------- */
  function showNext(nx,onDone){
    cleanup();
    stage='next';
    var left=NEXT_SECONDS,fired=false;
    overlay=document.createElement('div');
    overlay.className='tl-next';
    overlay.innerHTML='<div class="tl-next-box"><div class="tl-next-tx"><span class="tl-next-lab">Prochaine vidéo dans <b class="tl-next-n">'+left+'</b> s</span>'+
      '<b class="tl-next-t"></b>'+
      '<div class="tl-next-act"><button type="button" class="tl-next-go">Lancer maintenant</button><button type="button" class="tl-next-no">Annuler</button></div></div></div>'+
      '<div class="tl-next-bar"><i></i></div>';
    overlay.querySelector('.tl-next-t').textContent=nx.t||'';
    var th=domThumb(nx.id);
    if(th){
      var im=document.createElement('img');im.className='tl-next-img';im.alt='';im.src=th;
      im.addEventListener('error',function(){if(im.parentNode)im.parentNode.removeChild(im)});
      overlay.querySelector('.tl-next-box').insertBefore(im,overlay.querySelector('.tl-next-tx'));
    }
    player.appendChild(overlay);
    var ov=overlay,bar=ov.querySelector('.tl-next-bar i'),nEl=ov.querySelector('.tl-next-n');
    void bar.offsetWidth;
    bar.style.transitionDuration=NEXT_SECONDS+'s';bar.style.width='100%';
    function fire(){if(fired)return;fired=true;clearInterval(tick);onDone()}
    ov.querySelector('.tl-next-go').addEventListener('click',fire);
    ov.querySelector('.tl-next-no').addEventListener('click',cancelAll);
    tick=setInterval(function(){
      left--;nEl.textContent=Math.max(0,left);
      if(left<=0)fire();
    },1000);
  }

  /* ---------- Pub ---------- */
  function showAd(done){
    if(!nextAd||!pre)prepAd();
    var ad=nextAd,v=pre;
    if(!ad||!v){busy=false;done();return}
    nextAd=null;pre=null;lastAd=ad.src;
    cleanup();
    stage='ad';
    try{vid.pause()}catch(e){}
    overlay=document.createElement('div');
    overlay.className='tl-ad';
    overlay.appendChild(v);
    adEl=v;
    overlay.insertAdjacentHTML('beforeend',
      '<div class="tl-ad-top"><span class="tl-ad-tag">Pub</span><span class="tl-ad-count">'+AD_SECONDS+'</span></div>'+
      '<div class="tl-ad-bot"><span>Votre vidéo démarre après la pub</span></div>');
    var link=https(ad.link);
    if(link){
      var a=document.createElement('a');
      a.className='tl-ad-link';a.href=link;a.target='_blank';a.rel='noopener';
      a.textContent=ad.label||'En savoir plus';
      overlay.querySelector('.tl-ad-bot').appendChild(a);
    }
    var skip=null;
    if(SKIP_AFTER>0){
      skip=document.createElement('button');
      skip.type='button';skip.className='tl-ad-skip';skip.disabled=true;skip.textContent='Passer dans '+SKIP_AFTER;
      overlay.appendChild(skip);
    }
    player.appendChild(overlay);
    var ov=overlay,count=ov.querySelector('.tl-ad-count'),ended=false;
    function finish(){
      if(ended)return;ended=true;
      if(overlay!==ov)return; /* annulée entre-temps */
      cleanup();done();
    }
    if(skip)skip.addEventListener('click',function(){if(!skip.disabled)finish()});
    v.addEventListener('timeupdate',function(){
      var lim=(isFinite(v.duration)&&v.duration>0)?Math.min(AD_SECONDS,v.duration):AD_SECONDS;
      count.textContent=Math.max(0,Math.ceil(lim-v.currentTime));
      if(skip){
        var s=Math.ceil(SKIP_AFTER-v.currentTime);
        if(s>0)skip.textContent='Passer dans '+s;
        else if(skip.disabled){skip.disabled=false;skip.textContent='Passer ›'}
      }
      if(v.currentTime>=lim)finish();
    });
    v.addEventListener('ended',finish);
    v.addEventListener('error',finish);
    v.addEventListener('playing',function(){clearTimeout(guard)});
    if(v.error){finish();return}
    guard=setTimeout(finish,AD_START_TIMEOUT*1000);
    var p=v.play();
    if(p&&p.catch)p.catch(function(){v.muted=true;var p2=v.play();if(p2&&p2.catch)p2.catch(finish)});
  }

  /* ---------- Ouverture de la vidéo suivante, puis pub, puis lecture ---------- */
  function go(nx,pBuyer,pCfg,token){
    stage='open';
    Promise.all([pBuyer,pCfg]).then(function(r){
      if(token!==runId||detail.hidden)return;
      if(!openById(nx)){cancelAll();return}
      mark(nx.id);
      var buyer=r[0];
      if(buyer||!adsOn||!ADS.length){cleanup();startNext()}
      else showAd(startNext);
    }).catch(function(){if(token===runId)cancelAll()});
  }

  /* ---------- Fin d'une vidéo ---------- */
  vid.addEventListener('ended',function(){
    if(busy||detail.hidden)return;
    mark(curId());
    busy=true;stage='prep';
    var token=++runId;
    Promise.race([loadCat(false),wait(2500)]).then(function(){
      if(token!==runId||detail.hidden){if(token===runId)cancelAll();return}
      var nx=pickNext()||domNext();
      if(!nx){busy=false;stage='';return}
      var pBuyer=isBuyer(),pCfg=loadConfig(false).then(prepAd);
      showNext(nx,function(){go(nx,pBuyer,pCfg,token)});
    });
  });

  /* Pendant la lecture : on note la vidéo, et vers 60 % on prépare la pub (sans gaspiller de data avant) */
  vid.addEventListener('loadstart',function(){prepped=false});
  vid.addEventListener('playing',function(){mark(curId())});
  vid.addEventListener('timeupdate',function(){
    if(prepped||busy||!isFinite(vid.duration)||vid.duration<=0)return;
    if(vid.currentTime/vid.duration>0.6){
      prepped=true;
      isBuyer().then(function(b){if(!b)loadConfig(false).then(prepAd)});
    }
  });

  /* L'utilisateur reprend la main : on annule le compte à rebours */
  vid.addEventListener('play',function(){if(!own&&busy&&stage==='next')cancelAll()});
  document.addEventListener('click',function(e){
    var o=e.target.closest&&e.target.closest('[data-open]');
    if(!o)return;
    lastOpened=o.getAttribute('data-open');
    if(!own&&busy)cancelAll();
  },true);
  try{new MutationObserver(function(){if(detail.hidden)cancelAll()}).observe(detail,{attributes:true,attributeFilter:['hidden']})}catch(e){}

  /* Démarrage : catalogue et liste des pubs prêts avant la fin de la première vidéo */
  loadCat(false);
  loadConfig(false);
})();
