/* TOPLEAKS : onglet « Pubs » de l'espace admin.
   Fichier autonome : il ajoute l'onglet dans le menu, envoie la vidéo de pub vers R2
   et enregistre la liste dans la table app_settings (clé ads_config). app.js n'est pas modifié. */
(function(){
  'use strict';
  var SB_URL='https://hivmcstxtciynbdwgmpl.supabase.co',SB_KEY='sb_publishable_ioVVYvSUx040k5zA-lmRow_uTkpyabC';
  var R2_WORKER='https://floral-disk-8bf2.dadjuJunior42.workers.dev',R2_CDN='https://pub-e3f10db5a5ee4cbea0471157bd183fbf.r2.dev';
  var REST=SB_URL+'/rest/v1/';

  var $=function(s){return document.querySelector(s)};
  var nav=$('.atabs'),main=$('.adm-main');
  if(!nav||!main)return;

  var cfg={on:true,list:[]},xhr=null;
  var esc=function(x){return String(x==null?'':x).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};

  /* ---------- Onglet dans le menu + panneau ---------- */
  var secs=nav.querySelectorAll('.adm-sec'),others=null;
  Array.prototype.forEach.call(secs,function(s){if(/others/i.test(s.textContent))others=s});
  var sec=document.createElement('span');sec.className='adm-sec';sec.textContent='Ads';
  var btn=document.createElement('button');
  btn.type='button';btn.className='atab';btn.id='tab-pubs';btn.setAttribute('role','tab');
  btn.setAttribute('aria-controls','pane-pubs');btn.setAttribute('aria-selected','false');btn.tabIndex=-1;
  btn.innerHTML='<svg class="ic"><use href="#i-play"/></svg>Pubs<i class="adm-led" aria-hidden="true"></i>';
  if(others){nav.insertBefore(sec,others);nav.insertBefore(btn,others)}else{nav.appendChild(sec);nav.appendChild(btn)}

  var pane=document.createElement('div');
  pane.id='pane-pubs';pane.className='apane';pane.setAttribute('role','tabpanel');pane.setAttribute('aria-labelledby','tab-pubs');pane.hidden=true;
  pane.innerHTML=
    '<h3 class="ah">Pubs avant la vidéo suivante</h3>'+
    '<div class="aform">'+
      '<p class="hint">Une pub de 20 s s’affiche avant chaque vidéo qui s’enchaîne toute seule (avec un bouton « Passer » après 5 s). Les membres qui ont un achat confirmé ne la voient pas. Plusieurs pubs : elles tournent à tour de rôle.</p>'+
      '<label class="pin-opt" for="adson"><input id="adson" type="checkbox"><span>Pubs activées<small>Décochez pour couper toutes les pubs, sans les supprimer.</small></span></label>'+
    '</div>'+
    '<h3 class="ah">Ajouter une pub</h3>'+
    '<form id="adsform" class="aform" novalidate>'+
      '<label class="label" for="adsfile">Vidéo de la pub (mp4, environ 20 s)</label>'+
      '<input id="adsfile" class="field aemail afile" type="file" accept="video/*">'+
      '<div id="adsprog" class="r2-prog" hidden aria-live="polite"><div class="r2-top"><span id="adsst">Prêt</span><b id="adspct">0 %</b></div><div class="r2-bar"><i id="adsbar"></i></div></div>'+
      '<div class="stack"><button id="adsgo" class="btn btn-primary" type="submit">Envoyer la pub</button><button id="adscancel" class="btn btn-ghost" type="button" hidden>Annuler l’envoi</button></div>'+
    '</form>'+
    '<h3 class="ah">Mes pubs</h3>'+
    '<p id="adsmsg" class="hint" role="status"></p>'+
    '<div id="adslist"></div>';
  main.appendChild(pane);

  function msg(x,bad){var el=$('#adsmsg');el.textContent=x||'';el.className='hint'+(x?(bad?' bad':' ok'):'')}

  var tabsOf=function(){return document.querySelectorAll('#apanel .atab[role=tab]')};
  function showPane(){
    Array.prototype.forEach.call(main.querySelectorAll('.apane'),function(p){p.hidden=true});
    pane.hidden=false;
    Array.prototype.forEach.call(tabsOf(),function(b){b.setAttribute('aria-selected','false');b.tabIndex=-1});
    btn.setAttribute('aria-selected','true');btn.tabIndex=0;
    var cr=$('#adm-crumb');if(cr)cr.textContent='Pubs';
    load();
  }
  function leave(){pane.hidden=true;btn.setAttribute('aria-selected','false');btn.tabIndex=-1}
  btn.addEventListener('click',showPane);
  /* quand l'admin choisit un autre onglet, app.js réaffiche son panneau : on cache le nôtre */
  try{
    var mo=new MutationObserver(function(){
      var shown=['#pane-overview','#pane-catalog','#pane-sales'].some(function(s){var p=$(s);return p&&!p.hidden});
      if(shown&&!pane.hidden)leave();
    });
    ['#pane-overview','#pane-catalog','#pane-sales'].forEach(function(s){var p=$(s);if(p)mo.observe(p,{attributes:true,attributeFilter:['hidden']})});
  }catch(e){}

  /* ---------- Lecture / écriture de la liste (table app_settings) ---------- */
  function parse(v){
    if(typeof v==='string'){try{v=JSON.parse(v)}catch(e){return null}}
    return v&&typeof v==='object'?v:null;
  }
  function load(){
    msg('Chargement…');
    fetch(REST+'app_settings?select=value&key=eq.ads_config',{headers:{apikey:SB_KEY},cache:'no-store'})
      .then(function(r){return r.ok?r.json():[]})
      .then(function(rows){
        var v=parse(rows&&rows[0]&&rows[0].value);
        cfg={on:!v||v.on!==false,list:(v&&Array.isArray(v.list))?v.list.filter(Boolean):[]};
        msg('');render();
      }).catch(function(){msg('Chargement impossible. Vérifiez votre connexion.',true);render()});
  }
  function readSess(){try{return JSON.parse(localStorage.getItem('tl_auth_v1')||'null')}catch(e){return null}}
  /* Jeton de l'admin : lu dans la session de l'application. S'il expire, on déclenche l'actualisation de l'admin (qui renouvelle la session). */
  function getToken(){
    return new Promise(function(res,rej){
      var s=readSess();
      if(!s||!s.access_token){rej(new Error('Connexion requise'));return}
      if(s.expires_at-60>Date.now()/1000){res(s.access_token);return}
      var b=$('#adm-refresh');if(b)b.click();
      var n=0,iv=setInterval(function(){
        var x=readSess();
        if(x&&x.expires_at-60>Date.now()/1000){clearInterval(iv);res(x.access_token)}
        else if(++n>40){clearInterval(iv);rej(new Error('Session expirée : reconnectez-vous'))}
      },250);
    });
  }
  function save(){
    return getToken().then(function(tk){
      return fetch(REST+'app_settings?on_conflict=key',{method:'POST',headers:{apikey:SB_KEY,Authorization:'Bearer '+tk,'Content-Type':'application/json',Prefer:'resolution=merge-duplicates,return=minimal'},
        body:JSON.stringify({key:'ads_config',value:JSON.stringify(cfg),updated_at:new Date().toISOString()})});
    }).then(function(r){
      if(!r.ok)return r.text().then(function(tx){var m='';try{m=JSON.parse(tx).message||''}catch(e){}throw new Error(m||('HTTP '+r.status))});
    });
  }

  /* ---------- Affichage ---------- */
  function render(){
    $('#adson').checked=!!cfg.on;
    $('#adslist').innerHTML=cfg.list.length?cfg.list.map(function(u,i){
      return '<div class="arow"><div><b>Pub '+(i+1)+'</b><span style="word-break:break-all">'+esc(u)+'</span></div>'+
        '<div class="abtns"><a class="btn btn-ghost" href="'+esc(u)+'" target="_blank" rel="noopener">Voir</a><button class="btn btn-ghost" type="button" data-pdel="'+i+'">Supprimer</button></div></div>';
    }).join(''):'<p class="hint">Aucune pub pour l’instant : l’enchaînement automatique marche, sans pub.</p>';
  }
  $('#adson').addEventListener('change',function(){
    var cb=this;cfg.on=cb.checked;msg('Enregistrement…');
    save().then(function(){msg(cfg.on?'Pubs activées.':'Pubs coupées.')}).catch(function(e){cb.checked=!cb.checked;cfg.on=cb.checked;msg('Échec : '+e.message,true)});
  });
  $('#adslist').addEventListener('click',function(e){
    var b=e.target.closest('[data-pdel]');if(!b)return;
    var i=+b.getAttribute('data-pdel');
    if(!confirm('Retirer cette pub de la liste ? (le fichier reste sur R2)'))return;
    var old=cfg.list.slice();cfg.list.splice(i,1);b.disabled=true;msg('Enregistrement…');
    save().then(function(){msg('Pub retirée.');render()}).catch(function(err){cfg.list=old;render();msg('Échec : '+err.message,true)});
  });

  /* ---------- Envoi de la vidéo vers R2 ---------- */
  function cleanName(n){
    var dot=n.lastIndexOf('.'),ext=dot>0?n.slice(dot+1):'',base=dot>0?n.slice(0,dot):n;
    base=base.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^A-Za-z0-9_-]+/g,'_').replace(/^_+|_+$/g,'').slice(0,60)||'pub';
    ext=ext.normalize('NFD').replace(/[^A-Za-z0-9]/g,'').toLowerCase()||'mp4';
    return Date.now()+'-pub-'+base+'.'+ext;
  }
  function prog(st,pct){
    $('#adsprog').hidden=false;$('#adsst').textContent=st;
    if(pct!=null){$('#adspct').textContent=pct+' %';$('#adsbar').style.width=pct+'%'}
  }
  function busy(b){$('#adsgo').disabled=b;$('#adscancel').hidden=!b;window.onbeforeunload=b?function(e){e.preventDefault();e.returnValue='';return ''}:null}
  function put(file,name){
    return new Promise(function(res,rej){
      var x=new XMLHttpRequest();xhr=x;
      x.open('PUT',R2_WORKER+'/'+encodeURIComponent(name));
      x.setRequestHeader('Content-Type',file.type||'video/mp4');
      x.upload.onprogress=function(e){if(e.lengthComputable)prog('Envoi vers le CDN…',Math.min(100,Math.floor(e.loaded/e.total*100)))};
      x.onload=function(){xhr=null;if(x.status>=200&&x.status<300)res();else rej(new Error('Le Worker a répondu HTTP '+x.status))};
      x.onerror=function(){xhr=null;rej(new Error('Envoi impossible (réseau)'))};
      x.onabort=function(){xhr=null;var e=new Error('Envoi annulé');e.aborted=true;rej(e)};
      x.send(file);
    });
  }
  $('#adscancel').addEventListener('click',function(){if(xhr)xhr.abort()});
  $('#adsform').addEventListener('submit',function(e){
    e.preventDefault();
    var f=$('#adsfile').files[0];
    if(!f){msg('Choisissez la vidéo de la pub.',true);return}
    var name=cleanName(f.name),url=R2_CDN+'/'+encodeURIComponent(name);
    msg('');busy(true);prog('Préparation…',0);
    put(f,name).then(function(){
      prog('Enregistrement…',100);
      cfg.list.push(url);
      return save().catch(function(err){cfg.list.pop();throw err});
    }).then(function(){
      $('#adsform').reset();prog('Pub ajoutée',100);msg('Pub ajoutée. Elle s’affichera dès la prochaine vidéo enchaînée.');render();
    }).catch(function(err){
      prog(err.aborted?'Envoi annulé':'Échec',null);if(!err.aborted)msg('Échec : '+err.message,true);
    }).then(function(){busy(false)});
  });
})();
