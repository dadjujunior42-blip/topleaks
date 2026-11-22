/* TOPLEAKS : tableau de bord visuel avec miniatures (fichier autonome, ne touche pas à app.js) */
(function(){
  'use strict';
  var SB_URL='https://hivmcstxtciynbdwgmpl.supabase.co',SB_KEY='sb_publishable_ioVVYvSUx040k5zA-lmRow_uTkpyabC';
  var REST=SB_URL+'/rest/v1/',ROWS=[],SORT='views',N=8,busy=false,lastLoad=0;
  var $=function(s){return document.querySelector(s)};
  var nf=function(n){return (+n||0).toLocaleString('fr-FR')};
  function esc(x){return String(x==null?'':x).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
  function https(u){u=u==null?'':String(u).trim();return /^https:\/\//.test(u)?u:''}
  function token(){try{var s=JSON.parse(localStorage.getItem('tl_auth_v1')||'null');return s&&s.access_token||''}catch(e){return ''}}
  function get(path){
    var tk=token();
    return fetch(REST+path,{headers:{apikey:SB_KEY,Authorization:'Bearer '+(tk||SB_KEY)}}).then(function(r){return r.ok?r.json():[]}).catch(function(){return []});
  }
  function fdate(x){var d=new Date(x);return isNaN(d)?'':d.toLocaleDateString('fr-FR',{day:'2-digit',month:'2-digit',year:'numeric'})}

  var HTML='<div class="cd-grid">'+
    '<div class="cd-card cd-hero"><div class="cd-hero-tx"><small>Tableau de bord</small><h3>Pilotez<br>votre chaîne</h3><button id="cd-add" class="cd-cta" type="button">Ajouter une vidéo</button></div>'+
    '<div id="cd-heroimg" class="cd-heroimg"></div>'+
    '<div class="cd-stats"><div><b id="cd-s-users">…</b><span>Comptes</span></div><div><b id="cd-s-views">…</b><span>Vues</span></div><div><b id="cd-s-sales">…</b><span>Ventes VIP</span></div><div><b id="cd-s-rev">…</b><span>Revenus</span></div></div></div>'+
    '<div class="cd-card cd-chart"><h4>Activité des 14 derniers jours</h4><svg id="cd-svg" viewBox="0 0 320 140" preserveAspectRatio="none" aria-hidden="true"></svg><p class="cd-leg"><i class="a"></i>Connexions <i class="b"></i>Nouveaux comptes</p></div>'+
    '<div class="cd-card cd-sale"><div class="cd-sale-tx"><h4>Dernière vente</h4><strong id="cd-total">…</strong><span>Revenus totaux</span><small id="cd-last">Aucune vente pour l’instant</small></div><div id="cd-saleimg" class="cd-saleimg"></div></div>'+
    '</div>'+
    '<div class="cd-card cd-top"><div class="cd-top-h"><h4>Vos vidéos</h4><select id="cd-sort" class="cd-sel" aria-label="Trier"><option value="views">Popularité</option><option value="rev">Revenus</option><option value="sales">Ventes</option><option value="recent">Récentes</option></select></div><div id="cd-rows"></div><div class="stack"><button id="cd-more" class="btn btn-ghost" type="button" hidden>Voir plus</button></div></div>';

  function thumb(r){
    var t=https(r.thumbnail_url);
    if(t)return '<img src="'+esc(t)+'" alt="" loading="lazy">';
    var v=https(r.video_url);
    if(v&&!r.video_path)return '<video src="'+esc(v)+'#t=1" muted playsinline preload="metadata" tabindex="-1"></video>';
    return '';
  }
  function day(items,key,days){
    var out=[],now=new Date();now.setHours(23,59,59,999);
    for(var i=days-1;i>=0;i--){var end=now.getTime()-i*864e5,st=end-864e5,c=0;
      items.forEach(function(m){var t0=m[key]&&new Date(m[key]).getTime();if(t0&&t0>st&&t0<=end)c++});out.push(c)}
    return out;
  }
  function path(v,mx){
    var n=v.length,p=v.map(function(y,i){return [i/(n-1)*320,125-(y/mx)*105]});
    var d='M'+p[0][0].toFixed(1)+' '+p[0][1].toFixed(1);
    for(var i=1;i<n;i++){var cx=((p[i-1][0]+p[i][0])/2).toFixed(1);d+=' C'+cx+' '+p[i-1][1].toFixed(1)+' '+cx+' '+p[i][1].toFixed(1)+' '+p[i][0].toFixed(1)+' '+p[i][1].toFixed(1)}
    return d;
  }
  function sorted(){
    var a=ROWS.slice(),k=SORT;
    a.sort(function(x,y){
      if(k==='recent')return new Date(y.created_at||0)-new Date(x.created_at||0);
      var f=k==='sales'?'sales':(k==='rev'?'revenue_fc':'views');
      return (+y[f]||0)-(+x[f]||0);
    });
    return a;
  }
  function set(id,x){var e=$('#'+id);if(e)e.textContent=x}
  function render(){
    var mx=1,tv=0,ts=0,tr=0,best=null;
    ROWS.forEach(function(r){var v=+r.views||0;if(v>mx)mx=v;if(!best||v>(+best.views||0))best=r;tv+=v;ts+=+r.sales||0;tr+=+r.revenue_fc||0});
    set('cd-s-views',nf(tv));set('cd-s-sales',nf(ts));set('cd-s-rev',nf(tr)+' FC');set('cd-total',nf(tr)+' FC');
    var hi=$('#cd-heroimg');
    if(hi)hi.innerHTML=best?'<div class="cd-th">'+thumb(best)+'</div><span>N°1 · '+esc(best.title)+'</span>':'';
    var rows=sorted(),box=$('#cd-rows');if(!box)return;
    box.innerHTML=rows.length?rows.slice(0,N).map(function(r){
      var v=+r.views||0,pct=Math.max(3,Math.round(v/mx*100));
      return '<div class="cd-row'+(r.is_published?'':' off')+'">'+
        '<div class="cd-th">'+thumb(r)+'</div>'+
        '<div class="cd-ti"><b>'+esc(r.title)+'</b><span>'+esc(r.artist||'TOPLEAKS')+' · '+(r.price_fc>0?esc(r.price_fc)+' FC':'Gratuit')+(r.is_published?'':' · masquée')+'</span></div>'+
        '<div class="cd-n"><i class="y"></i>'+nf(v)+' vues<div class="cd-bar"><u style="width:'+pct+'%"></u></div></div>'+
        '<div class="cd-n"><i class="g"></i>'+nf(r.sales)+' ventes</div>'+
        '<div class="cd-n cd-rv">'+nf(r.revenue_fc)+' FC</div>'+
        '<button class="cd-ed" type="button">Modifier</button></div>';
    }).join(''):'<p class="hint">Aucune vidéo.</p>';
    var m=$('#cd-more');if(m){m.hidden=rows.length<=N;m.textContent='Voir plus ('+(rows.length-N)+')'}
  }
  function load(){
    if(busy)return;busy=true;lastLoad=Date.now();
    Promise.all([
      get('video_stats?select=*&order=created_at.desc'),
      get('videos?select=id,thumbnail_url,video_url,video_path,artist'),
      get('profiles?select=created_at,last_seen&limit=1000'),
      get('purchases?select=*&order=created_at.desc&limit=10')
    ]).then(function(a){
      var stats=Array.isArray(a[0])?a[0]:[],vids=Array.isArray(a[1])?a[1]:[],prof=Array.isArray(a[2])?a[2]:[],pur=Array.isArray(a[3])?a[3]:[];
      var vm={};vids.forEach(function(v){vm[String(v.id)]=v});
      ROWS=stats.map(function(r){var v=vm[String(r.id)]||{};r.thumbnail_url=r.thumbnail_url||v.thumbnail_url;r.video_url=r.video_url||v.video_url;r.video_path=r.video_path||v.video_path;r.artist=r.artist||v.artist;return r});
      render();
      set('cd-s-users',nf(prof.length));
      var A=day(prof,'last_seen',14),B=day(prof,'created_at',14),mx=Math.max.apply(null,A.concat(B).concat([1])),svg=$('#cd-svg');
      if(svg)svg.innerHTML='<path class="b" d="'+path(B,mx)+'"/><path class="a" d="'+path(A,mx)+'"/>';
      var p=pur.filter(function(x){return String(x.status||'').toLowerCase()==='paid'})[0],lt=$('#cd-last'),im=$('#cd-saleimg');
      if(p&&lt&&im){
        var r=ROWS.filter(function(x){return String(x.id)===String(p.video_id)})[0];
        lt.textContent=(r?r.title+' · '+r.price_fc+' FC':'Vidéo VIP')+' · '+fdate(p.created_at);
        im.innerHTML=r?'<div class="cd-th">'+thumb(r)+'</div>':'';
      }
    }).then(function(){busy=false},function(){busy=false});
  }
  function mount(){
    if($('#cd'))return true;
    var h=document.querySelector('#pane-overview .adm-h');if(!h)return false;
    var s=document.createElement('section');s.className='cd';s.id='cd';s.innerHTML=HTML;
    h.parentNode.insertBefore(s,h.nextSibling);
    $('#cd-sort').addEventListener('change',function(){SORT=this.value;N=8;render()});
    $('#cd-more').addEventListener('click',function(){N+=8;render()});
    $('#cd-add').addEventListener('click',function(){var t=$('#tab-catalog');if(t)t.click()});
    $('#cd-rows').addEventListener('click',function(e){if(e.target.closest('.cd-row')){var t=$('#tab-catalog');if(t)t.click()}});
    var rf=$('#adm-refresh');if(rf)rf.addEventListener('click',function(){setTimeout(load,1200)});
    return true;
  }
  /* se déclenche quand le panneau admin est visible */
  setInterval(function(){
    var ap=$('#apanel');
    if(!ap||ap.hidden)return;
    if(mount()&&(!lastLoad||Date.now()-lastLoad>60000))load();
  },1500);
})();
