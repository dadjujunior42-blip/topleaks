(function(){
  'use strict';

  /* ---------- Réglages à modifier ---------- */
  var CONTACT={whatsapp:'243845629514',phone:'243845629514',email:'',display:'0845629514'};
  var DEMO_MODE=false; /* false : aucun déblocage simulé ; le paiement est confirmé par WhatsApp puis validé dans l'Espace admin (Valider un achat) */
  var PAY_NUMBER='0972494288'; /* numéro de paiement officiel : affiché au paiement et dans le filigrane des vidéos payantes */
  var PROMOS={LANCEMENT:20,BIENVENUE:10}; /* démonstration : à valider côté serveur pour de vrai */
  var NEW_DAYS=14;
  var APP_VERSION='2.0.0',APP_BUILD='Novembre 2026';
  var SB_URL='https://hivmcstxtciynbdwgmpl.supabase.co',SB_KEY='sb_publishable_ioVVYvSUx040k5zA-lmRow_uTkpyabC';

  /* ---------- Textes : français, swahili, lingala (à faire relire par un locuteur) ---------- */
  var I={
    fr:{search:'Rechercher',watch:'Regarder maintenant',all:'Tous',free:'Gratuit',isnew:'Nouveau',
      gate:'Cette vidéo est réservée. Débloquez-la pour la regarder.',unlock:'DÉBLOQUER CE SPECTACLE ({p})',unlocked:'Spectacle débloqué',
      fav:'Favoris',fav_on:'Dans mes favoris',share:'Partager',fav_add:'Ajouté aux favoris',fav_del:'Retiré des favoris',
      shared:'Texte copié, prêt à partager',nocopy:'Copie impossible ici',pay_title:'Paiement',secure:'Sécurisé',choose_op:'Choisissez votre opérateur',
      mm_number:'Numéro Mobile Money',mm_hint:'Le numéro du compte qui paie, 10 chiffres.',err_op:'Choisissez un opérateur : M-Pesa, Orange Money ou Airtel Money.',
      err_phone:'Entrez un numéro à 10 chiffres, par exemple 0812345678.',promo_label:'Code promo',apply:'Appliquer',promo_ok:'Code appliqué : −{n} %',
      promo_bad:'Code invalide.',promo_empty:'Entrez un code.',price:'Prix',total:'Montant à payer',confirm:'Confirmer le paiement ({p})',cancel:'Annuler',
      demo_note:'Prototype de démonstration : aucun montant n’est débité.',help:'Un souci de paiement ? Écrivez-nous sur WhatsApp',
      wait_title:'Validez sur votre téléphone',wait_txt:'Une demande de {p} a été envoyée à votre compte {op} ({num}). Saisissez votre code PIN pour valider.',
      ok_title:'Paiement confirmé',ok_video:'{p} payés avec {op}. « {i} » est débloqué.',ok_other:'{p} payés avec {op}. {i} est activé.',ref:'Référence',
      browse:'Parcourir les spectacles',contact_title:'Contactez-nous',contact_text:'Une question, un souci de paiement ou une proposition de spectacle ? Écrivez-nous.',
      our_number:'Notre numéro',copy:'Copier',copied:'Numéro copié',selected:'Sélectionné : copiez-le',call:'Appeler',choose:'Choisir',about:'À propos',terms:'Conditions d’utilisation',privacy:'Confidentialité',
      data_saver:'Économie de data',loading:'Chargement des vidéos…',none:'Aucune vidéo pour le moment.',fail:'Impossible de charger les vidéos.',retry:'Réessayer',
      no_result:'Aucun résultat pour « {q} ». Essayez un nom d’artiste ou un titre.',res_one:'{n} résultat pour « {q} »',res_many:'{n} résultats pour « {q} »',
      draft:'Version provisoire, à faire valider avant publication.'},
    sw:{search:'Tafuta',watch:'Tazama sasa',all:'Zote',free:'Bure',isnew:'Mpya',
      gate:'Video hii ni ya kulipia. Ifungue ili kuitazama.',unlock:'FUNGUA ONYESHO HILI ({p})',unlocked:'Onyesho limefunguliwa',
      fav:'Vipendwa',fav_on:'Katika vipendwa vyangu',share:'Shiriki',fav_add:'Imeongezwa kwenye vipendwa',fav_del:'Imeondolewa kwenye vipendwa',
      pay_title:'Malipo',secure:'Salama',choose_op:'Chagua mtandao wako',mm_number:'Namba ya Mobile Money',mm_hint:'Namba ya akaunti inayolipa, tarakimu 10.',
      promo_label:'Msimbo wa punguzo',apply:'Tumia',promo_ok:'Msimbo umetumika: −{n} %',promo_bad:'Msimbo si sahihi.',price:'Bei',total:'Kiasi cha kulipa',
      confirm:'Thibitisha malipo ({p})',cancel:'Ghairi',wait_title:'Thibitisha kwenye simu yako',ok_title:'Malipo yamethibitishwa',browse:'Angalia maonyesho',
      contact_title:'Wasiliana nasi',contact_text:'Una swali, tatizo la malipo au pendekezo la onyesho? Tuandikie.',our_number:'Namba yetu',copy:'Nakili',call:'Piga simu',
      choose:'Chagua',about:'Kuhusu sisi',terms:'Masharti ya matumizi',privacy:'Faragha',data_saver:'Okoa data',loading:'Inapakia video…',none:'Hakuna video kwa sasa.',retry:'Jaribu tena'},
    ln:{search:'Luka',watch:'Tala sikoyo',all:'Nyonso',free:'Ya ofele',isnew:'Ya sika',
      gate:'Video oyo ezali ya kofuta. Fungola yango mpo na kotala.',unlock:'FUNGOLA SHOW OYO ({p})',unlocked:'Show efungwami',
      fav:'Oyo nalingi',fav_on:'Na oyo nalingi',share:'Kabola',fav_add:'Ebakisami na oyo nalingi',fav_del:'Elongolami na oyo nalingi',
      pay_title:'Kofuta',secure:'Na libateli',choose_op:'Pona réseau na yo',mm_number:'Nimero ya Mobile Money',mm_hint:'Nimero ya compte oyo ekofuta, ba chiffres 10.',
      promo_label:'Code ya promo',apply:'Tia',promo_ok:'Code ekangami: −{n} %',promo_bad:'Code ezali malamu te.',price:'Ntalo',total:'Mbongo ya kofuta',
      confirm:'Ndimisa kofuta ({p})',cancel:'Tika',wait_title:'Ndimisa na telefone na yo',ok_title:'Kofuta endimami',browse:'Tala ba show',
      contact_title:'Benga biso',contact_text:'Ozali na motuna, mokakatano ya kofuta to likanisi ya show? Koma biso.',our_number:'Nimero na biso',copy:'Copier',call:'Benga',
      choose:'Pona',about:'Mpo na biso',terms:'Mibeko ya kosalela',privacy:'Bobombi ya makambo',data_saver:'Bokebi na data',loading:'Ezali kozwa ba video…',none:'Video moko te mpo na sikoyo.',retry:'Meka lisusu'}
  };
  var NEWFR={acct:'Compte',acct_title:'Compte TOPLEAKS',login:'Se connecter',signup:'Créer un compte',logout:'Déconnexion',email:'Adresse e-mail',
    password:'Mot de passe (6 caractères minimum)',username:'Nom ou pseudo',country:'Pays (facultatif)',country_none:'Ne pas préciser',google:'Continuer avec Google',
    not_logged:'Non connecté',logged_as:'Connecté : {e}',otp_copy:'Un code a été envoyé à {e}. Saisissez-le ici, ou ouvrez le lien reçu par e-mail.',
    otp_confirm:'Confirmer le code',otp_resend:'Renvoyer le code',otp_edit:'Modifier l’adresse e-mail',like:'J’aime',comments:'Commentaires',
    like_need:'Connectez-vous pour aimer cette vidéo.',com_need:'Connectez-vous pour publier un commentaire.',com_ph:'Écrire un commentaire…',com_send:'Publier',
    com_none:'Pas encore de commentaire. Soyez le premier.',com_posted:'Commentaire publié.',com_fail:'Publication impossible.',com_loading:'Chargement…',
    com_load_fail:'Commentaires indisponibles.',com_login_hint:'Connectez-vous pour commenter.',user_anon:'Utilisateur',
    social_off:'J’aime et commentaires indisponibles : les tables Supabase ne sont pas installées ou l’accès est refusé.',
    link_copied:'Lien copié',share_fail:'Copie impossible ici',not_found_video:'Vidéo introuvable.',
    e_invalid:'E-mail ou mot de passe incorrect.',e_exists:'Cette adresse a déjà un compte. Choisissez « Se connecter ».',e_unconf:'Adresse non confirmée. Demandez un nouveau code.',
    e_rate:'Trop de tentatives. Attendez quelques minutes.',e_net:'Connexion réseau impossible. Vérifiez votre connexion internet.',e_otp:'Code invalide ou expiré.',
    e_weak:'Mot de passe trop court (6 caractères minimum).',e_name:'Saisissez un pseudo d’au moins 2 caractères.',e_email:'Saisissez une adresse e-mail valide.',
    e_code:'Saisissez le code reçu par e-mail.',e_google_file:'La connexion Google n’est disponible que sur l’adresse web de l’application.',
    connected:'Connecté.',created_signed:'Compte créé et connecté.',confirmed:'Adresse confirmée. Votre compte est actif.',signedout:'Déconnexion effectuée.',
    sending:'Envoi…',code_sent:'Nouveau code envoyé.',
    admin_need:'Connectez-vous avec le compte administrateur pour gérer les vidéos.',admin_not:'Ce compte n’est pas administrateur. Ajoutez-le dans la table admins.',
    demo_banner:'MODE DÉMO : le paiement est simulé. Aucun argent n’est débité et rien n’est vérifié par un serveur.',
    ok_title:'Simulation terminée (démo)',ok_video:'Simulation de {p} avec {op}. « {i} » est débloqué en mode démo.',ok_other:'Simulation de {p} avec {op}. {i} est activé en mode démo.',
    wait_title:'Simulation en cours…',wait_txt:'Mode démo : aucune demande n’est envoyée à {op} ({num}) et aucun argent n’est débité.',secure:(DEMO_MODE?'Démo':'Sécurisé')};
  for(var nk in NEWFR)I.fr[nk]=NEWFR[nk];
  var V7={lib_title:'Ma bibliothèque',lib_bought:'Mes achats',lib_favs:'Mes favoris',lib_none_b:'Aucun spectacle débloqué pour le moment.',lib_none_f:'Aucun favori pour le moment.',
    lib_note:'Les favoris et les déblocages en mode démo sont enregistrés sur cet appareil uniquement. Les achats confirmés par le serveur suivent votre compte.',
    f_all:'Tous',f_short:'Court (moins de 10 min)',f_long:'Long (10 min et +)',f_artist:'Tous les artistes',f_none:'Aucun spectacle ne correspond à ces filtres.',
    resume:'Reprise à {t}',forgot:'Mot de passe oublié ?',forgot_sent:'Si cette adresse a un compte, un lien de réinitialisation vient d’être envoyé.',
    reset_copy:'Choisissez un nouveau mot de passe.',reset_save:'Enregistrer le mot de passe',reset_ok:'Mot de passe modifié.',
    new_videos:'{n} nouveau(x) spectacle(s) depuis votre dernière visite',com_del:'Supprimer',com_del_ask:'Supprimer ce commentaire ?'};
  for(var vk in V7)I.fr[vk]=V7[vk];
  I.fr.pw_label='Mot de passe';I.fr.no_account='Pas encore de compte ?';I.fr.have_account='Déjà un compte ?';I.fr.otp_copy='Un code de confirmation vient d’être envoyé à {e}. Saisissez-le ici pour activer votre compte.';I.fr.e_nouser='Aucun compte avec cette adresse. Choisissez « Créer un compte ».';
  ['sw','ln'].forEach(function(l){delete I[l].otp_copy;delete I[l].send_code});
  I.fr.priv_demo='Démo : aucun accès réel. Cette vidéo est protégée : elle ne s’ouvre qu’après un achat confirmé par le serveur.';
  I.fr.pay_to='Numéro de paiement';
  I.fr.play_need='Connectez-vous pour regarder cette vidéo.';
  I.fr.pay_manual_note='Payez par Mobile Money au numéro indiqué, puis confirmez sur WhatsApp. L’accès est activé sur votre compte après vérification.';
  I.fr.pay_sent_title='Demande enregistrée';
  I.fr.pay_sent_txt='Envoyez {p} par {op} au {n}, puis confirmez sur WhatsApp avec votre référence de paiement. L’accès est activé après vérification.';
  I.fr.pay_wa='Confirmer sur WhatsApp';
  I.fr.pay_login='Connectez-vous pour acheter : l’accès sera activé sur votre compte.';
  I.fr.pay_wa_msg='Bonjour TOPLEAKS, je souhaite débloquer « {i} » ({p}). Opérateur : {op}. Mon numéro : {num}. E-mail de mon compte : {e}. Référence du paiement : ';
  if(!DEMO_MODE)I.fr.lib_note='Vos favoris sont enregistrés sur cet appareil uniquement. Les achats validés suivent votre compte.';I.fr.more='Charger plus';I.sw.more='Pakia zaidi';I.ln.more='Bimisa mosusu';
  I.fr.net_check='Vérification du réseau…';I.sw.net_check='Inakagua mtandao…';I.ln.net_check='Ezali kotala réseau…';
  I.fr.net_off='Pas de connexion internet. Vérifiez votre réseau puis réessayez : les vidéos ne s’afficheraient pas.';I.sw.net_off='Hakuna mtandao. Angalia muunganisho wako kisha ujaribu tena.';I.ln.net_off='Internet ezali te. Tala réseau na yo mpe meka lisusu.';
  I.fr.net_slow='Connexion instable ou très lente : les nouvelles vidéos risquent de rester vides.';I.sw.net_slow='Muunganisho ni dhaifu sana: video mpya zinaweza kubaki tupu.';I.ln.net_slow='Réseau ezali na makasi te : ba video ya sika ekoki kotikala pamba.';
  I.fr.net_retry='Réessayer';I.sw.net_retry='Jaribu tena';I.ln.net_retry='Meka lisusu';
  I.fr.net_force='Charger quand même';I.sw.net_force='Pakia hata hivyo';I.ln.net_force='Bimisa ata boye';
  I.fr.priv_fail='Lecture protégée indisponible pour le moment.';
  I.fr.related='Autres vidéos';I.sw.related='Video zingine';I.ln.related='Ba video mosusu';
  (function(){
    var N={
      fr:{settings:'Paramètres',set_theme:'Apparence',theme_dark:'Sombre',theme_light:'Clair',set_lang:'Langue',set_favs:'Favoris',set_favs_btn:'Voir mes favoris',set_data:'Données',clear_cache:'Vider le cache local',cache_hint:'Efface les données temporaires de cet appareil. Vos favoris, achats et connexion sont conservés.',cache_confirm:'Vider le cache local ? Vos favoris, achats et connexion sont conservés.',cache_done:'Cache vidé',set_close:'Fermer',set_version:'Version',fav_empty:'Aucun favori pour le moment. Touchez le cœur d’une vidéo pour l’ajouter.'},
      sw:{settings:'Mipangilio',set_theme:'Mwonekano',theme_dark:'Giza',theme_light:'Mwanga',set_lang:'Lugha',set_favs:'Vipendwa',set_favs_btn:'Tazama vipendwa vyangu',set_data:'Data',clear_cache:'Futa akiba ya kifaa',cache_hint:'Hufuta data za muda kwenye kifaa hiki. Vipendwa, manunuzi na akaunti yako vinabaki.',cache_confirm:'Kufuta akiba? Vipendwa, manunuzi na akaunti yako vitabaki.',cache_done:'Akiba imefutwa',set_close:'Funga',set_version:'Toleo',fav_empty:'Hakuna kipendwa bado. Gusa moyo wa video ili kuiongeza.'},
      ln:{settings:'Paramètres',set_theme:'Lolenge',theme_dark:'Molili',theme_light:'Pole',set_lang:'Monoko',set_favs:'Oyo nalingi',set_favs_btn:'Tala oyo nalingi',set_data:'Données',clear_cache:'Longola cache ya telefone',cache_hint:'Elongoli ba données ya mwa ntango na telefone oyo. Oyo nalingi, ba achats mpe compte na yo ekotikala.',cache_confirm:'Longola cache? Oyo nalingi, ba achats mpe compte na yo ekotikala.',cache_done:'Cache elongwe',set_close:'Kanga',set_version:'Version',fav_empty:'Oyo nalingi ezali naino te. Finá motema ya video mpo na kobakisa yango.'}
    };
    for(var L in N)for(var k in N[L])I[L][k]=N[L][k];
  })();
  delete I.sw.ok_title;delete I.ln.ok_title;delete I.sw.wait_title;delete I.ln.wait_title;delete I.sw.secure;delete I.ln.secure;
  var LANGS=['fr','sw','ln'],LABEL={fr:'FR',sw:'SW',ln:'LN'};
  var lang='fr';
  function t(k,v){
    var s=(I[lang]&&I[lang][k])||I.fr[k]||k;
    if(v)for(var x in v)s=s.split('{'+x+'}').join(v[x]);
    return s;
  }

  /* ---------- État mémorisé sur l'appareil ---------- */
  var ST={unlocked:{},favs:{},saver:false,lang:'fr',phone:'',pos:{},seen:0,ori:{}};
  try{var saved=JSON.parse(localStorage.getItem('tl_state_v1')||'{}');for(var k0 in ST)if(saved[k0]!==undefined)ST[k0]=saved[k0]}catch(e){}
  function saveState(){try{localStorage.setItem('tl_state_v1',JSON.stringify(ST))}catch(e){}}
  lang=LANGS.indexOf(ST.lang)>-1?ST.lang:'fr';

  /* ---------- Utilitaires ---------- */
  var A={},V=[],byId={},FEATURED=[],loading=true,failed=false,ADMUI=false,PINOK=false;
  var SRV={},FIL={price:'all',dur:'all',artist:'',cat:'',fav:false},CATS=[];
  /* Raccourcis PWA : ?filtre=gratuit ou ?filtre=vip */
  try{var _pf=new URLSearchParams(location.search).get('filtre');if(_pf==='gratuit')FIL.price='free';else if(_pf==='vip')FIL.price='vip'}catch(e){}
  function reindex(){byId={};V.forEach(function(v){byId[v.id]=v});FEATURED=V.slice(0,3).map(function(v){return v.id})}
  var $=function(s){return document.querySelector(s)};
  var p2=function(n){return String(n).padStart(2,'0')};
  var FC=function(n){return String(n)+' FC'};
  var fmt=function(s){s=Math.floor(s);var h=Math.floor(s/3600),m=Math.floor(s%3600/60),x=s%60;return h?h+':'+p2(m)+':'+p2(x):m+':'+p2(x)};
  var rate=function(r){return String(r).replace('.',',')};
  /* Fond noir profond partout (cartes, bannière, lecteur) : plus aucun dégradé coloré */
  var grad=function(){return 'linear-gradient(160deg,#1a1a1f,#050506)'};
  var flatBg=function(){return '#050506'};
  /* Miniature d'une carte, par ordre de priorité :
     1) thumbnail_url, si elle est renseignée en base ; 2) image déjà extraite de la vidéo et gardée sur l'appareil ;
     3) sinon extraction automatique : vidéo temporaire hors écran -> 1re seconde -> canvas 480 px -> image injectée.
     Aucune balise <video> n'est insérée dans la page : seule l'image finale est affichée. */
  var CAPKEY='tl_caps_v1',CAPS={},CAPMAX=60,FAILTTL=72e5,capPend={},capQ=[],capBusy=0;
  try{CAPS=JSON.parse(localStorage.getItem(CAPKEY)||'{}')||{}}catch(e){CAPS={}}
  function capSave(){
    var ks=Object.keys(CAPS);
    if(ks.length>CAPMAX){ks.sort(function(a,b){return (CAPS[a].t||0)-(CAPS[b].t||0)}).slice(0,ks.length-CAPMAX).forEach(function(k){delete CAPS[k]})}
    try{localStorage.setItem(CAPKEY,JSON.stringify(CAPS))}
    catch(e){ /* quota ou mode privé : on garde la moitié la plus récente, sinon uniquement en mémoire */
      try{var a=Object.keys(CAPS).sort(function(x,y){return (CAPS[x].t||0)-(CAPS[y].t||0)});a.slice(0,Math.ceil(a.length/2)).forEach(function(k){delete CAPS[k]});localStorage.setItem(CAPKEY,JSON.stringify(CAPS))}catch(e2){}
    }
  }
  function capOf(v){var c=CAPS[v.id];return c&&c.u&&c.s===capSrc(v)?c.u:''}
  function capFailed(v){var c=CAPS[v.id];return !!(c&&c.f&&c.s===capSrc(v)&&Date.now()-c.f<FAILTTL)}
  function canCap(v){return !!capSrc(v)&&!ST.saver&&!capFailed(v)&&('IntersectionObserver' in window)}
  /* Cas sans image possible (économie de data, source absente ou illisible) : fond noir uni #050506, aucun bloc décoratif */
  function blankHTML(v){return '<div class="thumb-blank" role="img" aria-label="'+esc(v.t||'')+'"></div>'}
  /* Source utilisée pour capturer la vignette : le lien vidéo exploitable. Jamais une vidéo protégée (VIP privée) ni une URL signée qui expire. */
  function capSrc(v){return v.priv?'':(v.video_url||'')}
  function imgTag(v,src,fade){
    return '<img class="thumb-img thumbnail-img'+(fade?' cap-in':'')+'" src="'+esc(src)+'" data-id="'+esc(v.id)+'" alt="'+esc(v.t||'')+'" loading="lazy" decoding="async" style="width:100%;height:100%;object-fit:cover">';
  }
  function slotHTML(v){return '<div class="sk cap-slot" data-cap="'+esc(v.id)+'" role="img" aria-label="'+esc(v.t||'')+'"></div>'}
  var thumbImg=function(v){
    if(v.img)return imgTag(v,v.img);
    var c=capOf(v);if(c)return imgTag(v,c);
    return canCap(v)?slotHTML(v):blankHTML(v);
  };
  /* Extraction : vidéo temporaire (jamais ajoutée à la page, crossOrigin anonymous pour que le canvas reste lisible),
     1re seconde, canvas 480 px max, WebP 65 % (repli JPEG). Si l'image est quasi noire (fondu d'ouverture), on retente plus loin. */
  var RAT={}; /* ratio largeur/hauteur relevé pendant l'extraction, par URL */
  function grabFrame(url){
    return new Promise(function(res,rej){
      var vd=document.createElement('video'),done=false,tm,tries=0,dur=0;
      function fin(err,u){
        if(done)return;done=true;clearTimeout(tm);
        try{vd.onloadedmetadata=vd.onseeked=vd.onerror=null;vd.removeAttribute('src');vd.load()}catch(e){}
        err?rej(err):res(u);
      }
      function snap(){
        try{
          var W=vd.videoWidth,H=vd.videoHeight;
          if(!(W>0&&H>0))throw new Error('image vide');
          RAT[url]=W/H;
          var w=Math.min(480,W),h=Math.round(w*H/W);
          var c=document.createElement('canvas');c.width=w;c.height=h;
          var cx=c.getContext('2d');cx.drawImage(vd,0,0,w,h);
          var px=cx.getImageData(0,0,w,h).data,sum=0,n=0;
          for(var i=0;i<px.length;i+=64){sum+=px[i]+px[i+1]+px[i+2];n+=3}
          if(n&&sum/n<10&&tries<2&&dur>4){tries++;vd.currentTime=Math.min(dur/2,tries*5);return}
          var u=c.toDataURL('image/webp',.65);if(u.indexOf('data:image/webp')!==0)u=c.toDataURL('image/jpeg',.7);
          fin(null,u);
        }catch(e){fin(e)}
      }
      vd.crossOrigin='anonymous';
      vd.muted=true;vd.defaultMuted=true;vd.playsInline=true;vd.preload='metadata';
      vd.setAttribute('playsinline','');vd.setAttribute('webkit-playsinline','');
      vd.onerror=function(){fin(new Error('lecture impossible'))};
      tm=setTimeout(function(){fin(new Error('délai dépassé'))},20000);
      vd.onloadedmetadata=function(){
        dur=isFinite(vd.duration)?vd.duration:0;
        vd.onseeked=snap;
        try{vd.currentTime=(dur>0&&dur<1.5)?dur/2:1}catch(e){fin(e)}
      };
      vd.src=url;
    });
  }
  function paintSlots(id,html,v){
    Array.prototype.forEach.call(document.querySelectorAll('[data-cap]'),function(el){
      if(el.getAttribute('data-cap')!==id)return;
      el.insertAdjacentHTML('afterend',html);el.parentNode.removeChild(el);
    });
  }
  /* File d'attente : 2 extractions à la fois, uniquement pour les cartes réellement affichées à l'écran */
  function capPump(){
    while(capBusy<2&&capQ.length){
      var id=capQ.shift(),v=byId[id];
      if(!v||!document.querySelector('[data-cap="'+id.replace(/["\\]/g,'')+'"]')){delete capPend[id];continue}
      capBusy++;
      (function(id,v){
        var src=capSrc(v);
        grabFrame(src).then(function(u){
          CAPS[id]={u:u,s:src,t:Date.now()};capSave();
          if(RAT[src])setOri(id,RAT[src]);
          paintSlots(id,imgTag(v,u,true),v);
        },function(err){
          CAPS[id]={f:Date.now(),s:src,t:Date.now()};capSave();
          console.warn('Miniature automatique impossible :',v.t,err&&err.message);
          paintSlots(id,blankHTML(v),v);
        }).then(function(){capBusy--;delete capPend[id];capPump()});
      })(id,v);
    }
  }
  function capEnqueue(id){if(capPend[id])return;capPend[id]=1;capQ.push(id);capPump()}
  var capIO=null;
  function hydrateCaps(){
    var list=document.querySelectorAll('.cap-slot[data-cap]:not([data-obs])');
    if(!list.length)return;
    if(!('IntersectionObserver' in window)){Array.prototype.forEach.call(list,function(el){var v=byId[el.getAttribute('data-cap')];if(v)paintSlots(v.id,blankHTML(v),v)});return}
    if(!capIO)capIO=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){capIO.unobserve(en.target);capEnqueue(en.target.getAttribute('data-cap'))}})},{rootMargin:'300px'});
    Array.prototype.forEach.call(list,function(el){el.setAttribute('data-obs','1');capIO.observe(el)});
  }
  /* thumbnail_url qui ne charge pas : on retombe sur l'extraction depuis la vidéo */
  document.addEventListener('error',function(e){
    var im=e.target;
    if(!(im&&im.tagName==='IMG'&&im.classList&&im.classList.contains('thumb-img')))return;
    var v=byId[im.getAttribute('data-id')];if(!v)return;
    var c=capOf(v),html=c&&c!==im.getAttribute('src')?imgTag(v,c):(canCap(v)?slotHTML(v):blankHTML(v));
    im.insertAdjacentHTML('afterend',html);im.parentNode.removeChild(im);
  },true);
  /* miniature téléchargée : on coupe le balayage lumineux (l'événement load ne remonte pas, d'où la phase de capture) */
  document.addEventListener('load',function(e){
    var im=e.target;
    if(im&&im.tagName==='IMG'&&im.classList&&im.classList.contains('thumb-img'))im.classList.add('ld');
  },true);
  var plain=function(s){return s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase()};
  var esc=function(x){return String(x==null?'':x).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
  var toastT;
  /* Copie fiable : API Clipboard, sinon champ texte temporaire invisible + execCommand, sinon invite manuelle */
  function copyText(text){
    text=String(text==null?'':text);
    function legacy(){
      return new Promise(function(res,rej){
        var ta=document.createElement('textarea'),ok=false,prev=document.activeElement;
        ta.value=text;ta.setAttribute('readonly','');ta.setAttribute('aria-hidden','true');ta.tabIndex=-1;
        ta.style.cssText='position:fixed;top:0;left:0;width:1px;height:1px;padding:0;border:0;outline:0;opacity:0;font-size:16px;pointer-events:none';
        document.body.appendChild(ta);
        try{ta.focus({preventScroll:true})}catch(e){}
        try{ta.select();ta.setSelectionRange(0,text.length);ok=document.execCommand('copy')}catch(e){ok=false}
        document.body.removeChild(ta);
        if(prev&&prev.focus)try{prev.focus({preventScroll:true})}catch(e){}
        if(ok)return res();
        try{window.prompt('Copiez ce lien :',text);res()}catch(e){rej(e)}
      });
    }
    if(navigator.clipboard&&navigator.clipboard.writeText&&window.isSecureContext){
      return navigator.clipboard.writeText(text).catch(legacy);
    }
    return legacy();
  }
  function toast(msg){var el=$('#toast');el.textContent=msg;el.classList.add('show');clearTimeout(toastT);toastT=setTimeout(function(){el.classList.remove('show')},2200)}
  var isNew=function(v){return v.created&&(Date.now()-new Date(v.created).getTime())<NEW_DAYS*864e5};
  var aName=function(v){return (A[v.a]&&A[v.a].n)||'TOPLEAKS'};

  /* ---------- Langue ---------- */
  function applyLang(){
    document.documentElement.lang=lang;
    Array.prototype.forEach.call(document.querySelectorAll('[data-i18n]'),function(el){el.textContent=t(el.getAttribute('data-i18n'))});
    Array.prototype.forEach.call(document.querySelectorAll('[data-i18n-ph]'),function(el){el.placeholder=t(el.getAttribute('data-i18n-ph'))});
    $('#lang').textContent=LABEL[lang];
    $('#settingsbtn').setAttribute('aria-label',t('settings'));
    $('#setclose').setAttribute('aria-label',t('set_close'));
    $('#lchips').innerHTML=LANGS.map(function(l){return '<button class="lchip" type="button" data-lang="'+l+'" aria-pressed="'+(l===lang)+'">'+LABEL[l]+'</button>'}).join('');
  }
  function setLang(l){
    lang=l;ST.lang=l;saveState();applyLang();
    renderHome();renderContact();renderAccount();
    if(cur&&!views.detail.hidden){renderMeta();renderRelated()}
    if(payItem&&!views.pay.hidden&&!$('#payform').hidden)renderPaySum();
    search();
  }

  /* ---------- Couvertures et cartes ---------- */
  /* Appareil limité (mobile, ancien WebKit, Data Saver) : pas de <video> en arrière-plan des cartes, on garde l'image de couverture ou le dégradé de secours */
  var LITE=(function(){
    try{
      var ua=navigator.userAgent||'',c=navigator.connection||{};
      var mobile=/iPhone|iPad|iPod|Android|Mobile|Silk/i.test(ua)||(navigator.maxTouchPoints>1&&/Mac/.test(navigator.platform||''));
      var noAR=!(window.CSS&&CSS.supports&&CSS.supports('aspect-ratio','1/1'));
      var small=window.matchMedia&&(matchMedia('(max-width:820px)').matches||matchMedia('(pointer:coarse)').matches);
      return mobile||small||noAR||!('IntersectionObserver' in window)||c.saveData===true;
    }catch(e){return true}
  })();
  /* Le feed n'embarque aucune balise <video> : la vidéo ne se charge qu'au clic sur la carte (écran de lecture) */
  try{if(window.MutationObserver)new MutationObserver(function(){hydrateCaps()}).observe(document.querySelector('.app'),{childList:true,subtree:true})}catch(e){}
  function slideHTML(v){
    return '<article class="slide" style="--g:'+flatBg(v)+'">'+thumbImg(v)+'<span class="glyph" aria-hidden="true">“</span><div class="scrim"></div><div class="slide-body">'+
      '<div class="tags"><span class="tag'+(v.p?' tag-vip':'')+'">'+(v.p?'VIP':t('free'))+'</span>'+(isNew(v)?'<span class="tag">'+t('isnew')+'</span>':'')+'</div>'+
      '<h2 class="slide-title">'+esc(v.t)+'</h2>'+
      '<p class="slide-meta">'+esc(aName(v))+'</p>'+
      '<button class="btn btn-primary" type="button" data-open="'+esc(v.id)+'"><svg class="ic f"><use href="#i-play"/></svg>'+t('watch')+'</button></div></article>';
  }
  /* Carte : image (ou jaquette) + bouton Play en surimpression + cœur de favori. Aucune balise <video> dans le catalogue. */
  function heartBtn(v){
    var on=!!ST.favs[v.id];
    return '<button class="heart" type="button" data-fav="'+esc(v.id)+'" aria-pressed="'+on+'" aria-label="'+esc(t('fav')+' : '+v.t)+'"><svg class="ic"><use href="#i-heart"/></svg></button>';
  }
  /* Menu ⋮ visible uniquement quand l'administrateur est connecté : modifier, masquer ou supprimer en 1 clic */
  function admMenu(v){
    var id=esc(v.id);
    return '<div class="ckebab"><button class="ckbtn" type="button" data-ckebab="'+id+'" aria-haspopup="menu" aria-expanded="false" aria-label="Options admin : '+esc(v.t)+'"><svg class="ic"><use href="#i-dots"/></svg></button>'+
      '<div class="ckmenu" role="menu" hidden>'+
      '<button type="button" role="menuitem" data-cact="edit" data-cid="'+id+'">Modifier</button>'+
      '<button type="button" role="menuitem" class="pinact" data-cact="pin" data-cid="'+id+'">'+(v.pin?'Désépingler':'⚡ Épingler en haut')+'</button>'+
      '<button type="button" role="menuitem" data-cact="hide" data-cid="'+id+'">Masquer</button>'+
      '<button type="button" role="menuitem" class="danger" data-cact="del" data-cid="'+id+'">Supprimer</button></div></div>';
  }
  function cardHTML(v){
    return '<div class="card'+(ADMUI?' adm':'')+(v.pin?' pinned':'')+'">'+
      '<button class="card-hit" type="button" data-open="'+esc(v.id)+'" aria-label="'+esc(v.t)+', '+esc(aName(v))+(v.p?', VIP, '+FC(v.p):', '+t('free'))+'">'+
      '<div class="thumb" style="--g:'+flatBg(v)+'">'+thumbImg(v)+'<span class="glyph" aria-hidden="true">“</span><span class="play-ov" aria-hidden="true"><svg class="ic f"><use href="#i-play"/></svg></span>'+
      (v.p?'<span class="vip"><svg class="ic"><use href="#i-lock"/></svg>VIP</span>':'')+
      (isNew(v)?'<span class="new">'+t('isnew')+'</span>':'')+
      (v.pin?'<span class="pin-b"><i aria-hidden="true">⚡</i>À la une</span>':'')+
      '</div>'+
      '<span class="c-title">'+esc(v.t)+'</span><span class="c-meta">'+esc(aName(v))+' · '+(v.p?FC(v.p):t('free'))+'</span></button>'+
      heartBtn(v)+(ADMUI?admMenu(v):'')+'</div>';
  }
  function skeletonCards(n){var h='';for(var i=0;i<n;i++)h+='<div class="card" aria-hidden="true"><div class="sk thumb-sk"></div><div class="sk line"></div><div class="sk line short"></div></div>';return h}
  function renderHome(){
    if(loading){
      $('#hero').style.display='';
      $('#slides').innerHTML='<div class="sk slide-sk"></div>';$('#dots').innerHTML='';
      $('#rows').innerHTML='<section class="row"><h2>'+t('all')+'</h2><div class="grid">'+skeletonCards(6)+'</div></section>';
      return;
    }
    $('#slides').innerHTML=FEATURED.map(function(id){return slideHTML(byId[id])}).join('');
    $('#dots').innerHTML=FEATURED.map(function(_,i){return '<i'+(i===0?' class="on"':'')+'></i>'}).join('');
    $('#hero').style.display=V.length?'':'none';
    $('#rows').innerHTML=V.length
      ?'<section class="row"><h2>'+t('all')+'</h2><div id="filters" class="filters"></div><div id="gridbox" class="grid"></div><div id="morebox" class="more"></div></section>'
      :'<div class="empty"><p>'+esc(failed?t('fail'):t('none'))+'</p>'+(failed?'<button id="retry" class="btn btn-ghost" type="button">'+t('retry')+'</button>':'')+'</div>';
    if(V.length){renderFilters();renderGrid()}
  }
  function filtered(){
    return V.filter(function(v){
      if(FIL.fav&&!ST.favs[v.id])return false;
      if(FIL.price==='free'&&v.p)return false;if(FIL.price==='vip'&&!v.p)return false;
      if(FIL.dur==='short'&&!(v.dur>0&&v.dur<600))return false;if(FIL.dur==='long'&&!(v.dur>=600))return false;
      if(FIL.artist&&v.a!==FIL.artist)return false;if(FIL.cat&&v.cat!==FIL.cat)return false;return true;
    });
  }
  function favCount(){return V.filter(function(v){return ST.favs[v.id]}).length}
  function favChip(){var n=favCount();return '<button class="fchip fchip-fav" type="button" data-f="fav:1" aria-pressed="'+!!FIL.fav+'"><svg class="ic"><use href="#i-heart"/></svg>'+esc(t('fav'))+(n?' <small>'+n+'</small>':'')+'</button>'}
  function renderFilters(){
    var box=$('#filters');if(!box)return;
    function ch(g,v,l){return '<button class="fchip" type="button" data-f="'+esc(g+':'+v)+'" aria-pressed="'+(FIL[g]===v)+'">'+esc(l)+'</button>'}
    var h=favChip()+ch('price','all',t('f_all'))+ch('price','free',t('free'))+ch('price','vip','VIP')+ch('dur','short',t('f_short'))+ch('dur','long',t('f_long'));
    var arts=Object.keys(A);
    if(arts.length>1)h+='<select id="fart" class="fsel" aria-label="Artiste"><option value="">'+esc(t('f_artist'))+'</option>'+arts.map(function(a){return '<option value="'+esc(a)+'"'+(FIL.artist===a?' selected':'')+'>'+esc(a)+'</option>'}).join('')+'</select>';
    CATS.filter(function(c){return V.some(function(v){return v.cat===String(c.id)})}).forEach(function(c){h+=ch('cat',String(c.id),c.name)});
    box.innerHTML=h;
  }
  var PER=6,SHOWN=PER;
  function renderGrid(){
    var rows=filtered(),g=$('#gridbox');if(!g)return;
    g.innerHTML=rows.length?rows.slice(0,SHOWN).map(cardHTML).join(''):'<p class="hint" style="grid-column:1/-1">'+esc(t(FIL.fav?'fav_empty':'f_none'))+'</p>';
    var mb=$('#morebox');if(mb)mb.innerHTML=rows.length>SHOWN?'<button id="moreb" class="btn btn-ghost" type="button">'+esc(t('more'))+' ('+(rows.length-SHOWN)+')</button>':'';
  }
  /* ---------- Vérification réseau avant « Charger plus » ----------
     1) navigator.onLine === false : réponse immédiate, aucun test.
     2) sinon test rapide de joignabilité de Supabase (mode no-cors : toute réponse, même 401, prouve que le réseau passe ; seul un échec réseau rejette).
     Plus de 4 s sans réponse = connexion instable. Un test réussi est retenu 10 s pour ne pas retarder les clics suivants. */
  var netOkAt=0,NET_TTL=10000,NET_TIMEOUT=4000,moreBusy=false;
  function checkNet(){
    if(navigator.onLine===false)return Promise.resolve('offline');
    if(Date.now()-netOkAt<NET_TTL)return Promise.resolve('ok');
    return new Promise(function(res){
      var ctl=('AbortController' in window)?new AbortController():null,done=false,t0=Date.now();
      var tm=setTimeout(function(){if(done)return;done=true;if(ctl){try{ctl.abort()}catch(e){}}res('slow')},NET_TIMEOUT);
      fetch(SB_URL+'/auth/v1/health?_='+t0,{method:'GET',mode:'no-cors',cache:'no-store',signal:ctl?ctl.signal:undefined}).then(function(){
        if(done)return;done=true;clearTimeout(tm);netOkAt=Date.now();res('ok');
      },function(){
        if(done)return;done=true;clearTimeout(tm);res('offline');
      });
    });
  }
  function clearNetWarn(){var w=document.querySelector('#morebox .netwarn');if(w)w.parentNode.removeChild(w)}
  function netWarn(kind){
    var mb=$('#morebox');if(!mb)return;
    clearNetWarn();
    mb.insertAdjacentHTML('beforeend','<div class="netwarn" role="alert"><p>'+esc(t(kind==='slow'?'net_slow':'net_off'))+'</p><div class="netact"><button id="netretry" class="btn btn-ghost" type="button">'+esc(t('net_retry'))+'</button>'+(kind==='slow'?'<button id="netforce" class="btn btn-ghost" type="button">'+esc(t('net_force'))+'</button>':'')+'</div></div>');
  }
  function doMore(){SHOWN+=PER;renderGrid()}
  function loadMore(){
    if(moreBusy)return;moreBusy=true;
    var b=$('#moreb'),old=b?b.textContent:'';
    clearNetWarn();
    if(b){b.disabled=true;b.textContent=t('net_check')}
    checkNet().then(function(r){
      moreBusy=false;
      if(r==='ok'){doMore();return}
      var b2=$('#moreb');if(b2&&b2===b){b2.disabled=false;b2.textContent=old}
      netWarn(r);
    });
  }
  window.addEventListener('online',function(){netOkAt=0;clearNetWarn()});
  window.addEventListener('offline',function(){netOkAt=0});
  $('#rows').addEventListener('click',function(e){
    if(e.target.closest('#moreb')||e.target.closest('#netretry')){loadMore();return}
    if(e.target.closest('#netforce')){doMore();return}
    var b=e.target.closest('[data-f]');if(!b)return;
    var fs=b.getAttribute('data-f'),fi=fs.indexOf(':'),fg=fs.slice(0,fi),fv=fs.slice(fi+1);SHOWN=PER;
    FIL[fg]=(fg==='fav')?!FIL.fav:(fg==='cat')?(FIL.cat===fv?'':fv):((fg==='dur'&&FIL.dur===fv)?'all':fv);renderFilters();renderGrid();
  });
  $('#rows').addEventListener('change',function(e){if(e.target.id==='fart'){FIL.artist=e.target.value;SHOWN=PER;renderGrid()}});
  /* ---------- Bannière ---------- */
  var slides=$('#slides'),auto=null,reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  function dotIndex(){return Math.round(slides.scrollLeft/Math.max(1,slides.clientWidth))}
  slides.addEventListener('scroll',function(){
    var i=dotIndex();
    Array.prototype.forEach.call($('#dots').children,function(d,k){d.classList.toggle('on',k===i)});
  },{passive:true});
  ['pointerdown','touchstart','wheel','focusin'].forEach(function(ev){slides.addEventListener(ev,function(){clearInterval(auto)},{passive:true})});
  if(!reduce){
    auto=setInterval(function(){
      if(document.hidden||$('#home').hidden||$('#hero').hidden||FEATURED.length<2)return;
      slides.scrollTo({left:((dotIndex()+1)%FEATURED.length)*slides.clientWidth,behavior:'smooth'});
    },6000);
  }

  /* ---------- Navigation ---------- */
  var views={home:$('#home'),detail:$('#detail'),pay:$('#pay'),doc:$('#doc'),admin:$('#admin'),lib:$('#lib')},homeY=0;
  function show(name){
    if(!views.home.hidden&&name!=='home')homeY=window.scrollY;
    Object.keys(views).forEach(function(k){views[k].hidden=(k!==name)});
    document.documentElement.classList.toggle('adm-wide',name==='admin');
    var el=views[name];el.classList.remove('view-in');void el.offsetWidth;el.classList.add('view-in');
    window.scrollTo(0,name==='home'?homeY:0);
  }
  function toggleFav(id){
    if(!byId[id])return;
    if(ST.favs[id])delete ST.favs[id];else ST.favs[id]=true;
    saveState();
    var on=!!ST.favs[id];
    Array.prototype.forEach.call(document.querySelectorAll('[data-fav]'),function(b){if(b.getAttribute('data-fav')===id)b.setAttribute('aria-pressed',on)});
    if(cur&&cur.id===id&&!views.detail.hidden)renderFav();
    toast(t(on?'fav_add':'fav_del'));
    renderFilters();if(FIL.fav)renderGrid();
    try{updateSetFavs()}catch(e){}
  }
  document.addEventListener('click',function(e){
    var fb=e.target.closest('[data-fav]');
    if(fb){toggleFav(fb.getAttribute('data-fav'));return}
    var c=e.target.closest('[data-open]');
    if(c){openDetail(c.getAttribute('data-open'));return}
    var d=e.target.closest('[data-doc]');
    if(d){openDoc(d.getAttribute('data-doc'));return}
    var l=e.target.closest('[data-lang]');
    if(l){setLang(l.getAttribute('data-lang'));return}
    if(e.target.closest('#retry'))loadVideos();
  });
  $('#lang').addEventListener('click',function(){setLang(LANGS[(LANGS.indexOf(lang)+1)%LANGS.length])});
  $('#saver').addEventListener('change',function(){ST.saver=this.checked;saveState();renderHome()});

  /* ---------- Recherche ---------- */
  var q=$('#q');
  function search(){
    var s=plain(q.value.trim());
    $('#qclear').hidden=!s;
    var on=!!s;
    $('#hero').hidden=on;$('#rows').hidden=on;$('#results').hidden=!on;
    if(!on)return;
    var list=V.filter(function(v){return plain(v.t+' '+aName(v)).indexOf(s)>-1});
    var raw=q.value.trim();
    $('#rescount').textContent=list.length?t(list.length>1?'res_many':'res_one',{n:list.length,q:raw}):'';
    $('#resgrid').innerHTML=list.length?list.map(cardHTML).join(''):'<p class="empty" style="grid-column:1/-1">'+esc(t('no_result',{q:raw}))+'</p>';
  }
  q.addEventListener('input',search);
  function goHome(){
    q.value='';FIL.price='all';FIL.dur='all';FIL.artist='';FIL.cat='';FIL.fav=false;SHOWN=PER;search();renderFilters();renderGrid();
    homeY=0;show('home');window.scrollTo(0,0);
  }
  $('#logo').addEventListener('click',goHome);
  $('#logo').addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();goHome()}});
  $('#qclear').addEventListener('click',function(){q.value='';search();q.focus()});

  /* ---------- Détail et lecteur ---------- */
  var cur=null,pos=0,playing=false,timer=null,viewed=false,wmT=null;
  var seek=$('#seek'),vid=$('#vid'),buffer=$('#buffer'),wm=$('#wm');
  var ADM=false;
  /* Vidéo protégée (cur.priv) : seul un achat confirmé par le serveur ou un compte admin l'ouvre. Le déblocage démo n'y donne aucun accès. */
  /* VIP (prix > 0) non payée, non débloquée et hors admin : verrouillée, sans aucun extrait */
  var locked=function(){if(!(cur.p>0)||ADM||ADMUI||SRV[cur.id])return false;return cur.priv?true:!ST.unlocked[cur.id]};
  var limit=function(){return cur.dur};

  function setPos(v){
    pos=Math.max(0,Math.min(v,limit()));
    seek.value=pos;
    seek.style.setProperty('--p',(cur.dur?pos/cur.dur*100:0)+'%');
    $('#tnow').textContent=fmt(pos);
  }
  function setPlayIcon(){
    $('#pplayuse').setAttribute('href',playing?'#i-pause':'#i-play');
    $('#pplay').setAttribute('aria-label',playing?'Pause':'Lire');
    $('#pplay').classList.toggle('on',playing);
  }
  function moveWm(){wm.style.left=(6+Math.random()*50)+'%';wm.style.top=(12+Math.random()*55)+'%'}
  function startWm(){
    if(!cur||!cur.p){wm.hidden=true;return}
    wm.textContent='TOPLEAKS · '+PAY_NUMBER;wm.hidden=false;moveWm();
    clearInterval(wmT);wmT=setInterval(moveWm,7000);
  }
  function stopWm(){clearInterval(wmT)}
  function trackView(){
    if(viewed||!cur||!cur.db)return;viewed=true;
    try{fetch(SB_URL+'/rest/v1/video_views',{method:'POST',headers:{apikey:SB_KEY,'Content-Type':'application/json',Prefer:'return=minimal'},body:JSON.stringify({video_id:cur.id})}).catch(function(){})}catch(e){}
  }
  function pause(){playing=false;clearInterval(timer);setPlayIcon();stopWm();if(!vid.paused)vid.pause()}
  function showGate(){
    pause();
    $('#gatebtn').innerHTML='<svg class="ic"><use href="#i-lock"/></svg>'+esc(t('unlock',{p:FC(cur.p)}));
    $('#gate').hidden=false;
  }
  function play(){
    /* Verrou immédiat : la source n'est jamais touchée tant que la vidéo n'est pas payée */
    if(locked()){showGate();return}
    /* Lecture réservée aux comptes connectés : sinon on ouvre la fenêtre de connexion */
    if(!session){pause();openAuth(t('play_need'),function(){if(cur&&views.detail&&!views.detail.hidden)play()});return}
    if(cur.video_url){
      $('#gate').hidden=true;
      /* Mobile : le fichier vidéo n'est chargé qu'ici, au clic sur lecture ; avant, seule l'image de couverture est affichée */
      if(!vid.getAttribute('src'))vid.src=cur.video_url;
      var pr=vid.play();if(pr&&pr.catch)pr.catch(function(){});
      return;
    }
    if(pos>=limit())setPos(0);
    $('#gate').hidden=true;
    playing=true;setPlayIcon();clearInterval(timer);startWm();trackView();
    timer=setInterval(function(){
      setPos(pos+1);
      if(pos>=limit())pause();
    },1000);
  }
  $('#pplay').addEventListener('click',function(){playing?pause():play()});
  seek.addEventListener('input',function(){
    var v=+seek.value;
    setPos(v);
    if(locked())showGate();
  });
  $('#gatebtn').addEventListener('click',function(){if(cur&&locked())openPay(videoItem(cur),'detail')});
  function guardVid(){
    /* Garde-fou : si un lecteur démarre malgré le verrou, on coupe la source et on affiche le paiement */
    if(!cur||!locked()||vid.paused)return;
    vid.pause();vid.removeAttribute('src');try{vid.load()}catch(e){}
    showGate();
  }
  vid.addEventListener('timeupdate',guardVid);
  vid.addEventListener('seeking',guardVid);
  vid.addEventListener('play',guardVid);
  /* ---------- Compteur de chargement du lecteur ----------
     Pourcentage = secondes déjà en mémoire devant la position de lecture / secondes nécessaires pour démarrer (BUF_NEED, ajustable).
     Il monte de 1 % à 99 % pendant le tampon, passe à 100 % dès que la lecture est prête, puis l'overlay disparaît.
     Affiché seulement quand on attend vraiment des données : lecture lancée, manque de tampon, déplacement dans la vidéo. */
  var bufPct=$('#bufpct'),BUF_NEED=4,bufShown=0,bufHold=0;
  function bufAhead(){
    var b=vid.buffered,t0=vid.currentTime||0;
    for(var i=0;i<b.length;i++)if(b.start(i)<=t0+.3&&b.end(i)>=t0)return b.end(i)-t0;
    return 0;
  }
  function bufCalc(){
    var left=isFinite(vid.duration)?vid.duration-(vid.currentTime||0):BUF_NEED,need=Math.max(.5,Math.min(BUF_NEED,left));
    return Math.max(1,Math.min(99,Math.floor(bufAhead()/need*100)));
  }
  function bufUpdate(){
    if(buffer.hidden)return;
    bufShown=Math.max(bufShown,bufCalc()); /* jamais de recul pendant un même chargement */
    bufPct.textContent=bufShown+'%';
  }
  function bufShow(){
    clearTimeout(bufHold);
    if(buffer.hidden||bufShown>=100)bufShown=0;
    buffer.hidden=false;bufUpdate();
  }
  function bufHide(ready){
    clearTimeout(bufHold);
    if(buffer.hidden)return;
    if(ready){bufShown=100;bufPct.textContent='100%';bufHold=setTimeout(function(){buffer.hidden=true;bufShown=0},200)}
    else{buffer.hidden=true;bufShown=0}
  }
  vid.addEventListener('waiting',bufShow);
  vid.addEventListener('stalled',function(){if(!vid.paused)bufShow()});
  vid.addEventListener('play',function(){if(vid.readyState<3)bufShow()});
  vid.addEventListener('seeking',function(){if(vid.readyState<3)bufShow()});
  ['progress','loadeddata','durationchange'].forEach(function(ev){vid.addEventListener(ev,bufUpdate)});
  ['canplay','playing'].forEach(function(ev){vid.addEventListener(ev,function(){bufHide(true)})});
  ['pause','error','ended','emptied','abort'].forEach(function(ev){vid.addEventListener(ev,function(){bufHide(false)})});
  vid.addEventListener('timeupdate',function(){if(!buffer.hidden&&vid.readyState>=3&&!vid.paused)bufHide(true)}); /* filet de sécurité si un événement est manqué */
  vid.addEventListener('play',function(){startWm();trackView()});
  vid.addEventListener('pause',stopWm);
  /* Reprise de lecture : position mémorisée sur l'appareil, enregistrée toutes les 5 s */
  var lastSave=0;
  function saveProgress(){
    if(!cur||!cur.video_url||vid.hidden)return;
    var c=Math.floor(vid.currentTime||0),d=cur.dur||0;
    if(d&&c>=d-5)delete ST.pos[cur.id];else if(c>5)ST.pos[cur.id]=c;else return;
    saveState();
  }
  vid.addEventListener('timeupdate',function(){var n=Date.now();if(!vid.paused&&!vid.seeking&&n-lastSave>5000){lastSave=n;saveProgress()}});
  vid.addEventListener('ended',function(){if(cur){delete ST.pos[cur.id];saveState()}});
  $('#pback').addEventListener('click',saveProgress);
  window.addEventListener('pagehide',saveProgress);
  vid.addEventListener('loadedmetadata',function(){
    if(!cur||!cur.video_url||!isFinite(vid.duration))return;
    var p=ST.pos[cur.id];
    if(p>5&&p<vid.duration-5){var m=p;if(m>5){try{vid.currentTime=m;toast(t('resume',{t:fmt(m)}))}catch(e){}}}
  });
  vid.addEventListener('loadedmetadata',function(){
    if(cur&&cur.video_url&&isFinite(vid.duration)&&!cur.dur){cur.dur=Math.ceil(vid.duration)}
  });

  /* ---------- Lecteur adaptatif : paysage (16:9, pleine largeur) ou vertical (9:16, colonne centrée) ---------- */
  function setOri(id,r){
    r=Math.round(r*1000)/1000;if(!(r>0)||ST.ori[id]===r)return;
    ST.ori[id]=r;saveState();
  }
  function applyOri(r){
    var pl=$('#player'),vert=r>0&&r<0.9;
    pl.classList.toggle('vertical',vert);
    if(vert)pl.style.setProperty('--arn',Math.max(.4,r));else pl.style.removeProperty('--arn');
  }
  vid.addEventListener('loadedmetadata',function(){
    if(!cur||!cur.video_url||!(vid.videoWidth>0&&vid.videoHeight>0))return;
    var r=vid.videoWidth/vid.videoHeight;setOri(cur.id,r);applyOri(r);
  });

  /* ---------- Lecteur personnalisé (vidéo réelle) : mêmes règles d'aperçu que le lecteur natif (guardVid) ---------- */
  var vseek=$('#vseek'),idleT=null;
  var fsEl=function(){return document.fullscreenElement||document.webkitFullscreenElement};
  function exitFs(){if(!fsEl())return;try{(document.exitFullscreen||document.webkitExitFullscreen).call(document)}catch(e){}}
  function vmax(){
    var d=isFinite(vid.duration)?vid.duration:((cur&&cur.dur)||0);
    return d;
  }
  function vSync(){
    if(!cur||vid.hidden)return;
    var m=vmax(),c=vid.currentTime||0,f=m?Math.min(1,c/m):0;
    vseek.value=Math.round(f*1000);vseek.style.setProperty('--p',(f*100)+'%');
    $('#vnow').textContent=fmt(m?Math.min(c,m):c);$('#vtot').textContent=fmt(m);
  }
  function vIcon(){
    var on=!vid.paused&&!vid.ended,h=on?'#i-pause':'#i-play',lab=on?'Pause':'Lire';
    $('#vplayuse').setAttribute('href',h);$('#vbiguse').setAttribute('href',h);
    $('#vplay').setAttribute('aria-label',lab);$('#vbig').setAttribute('aria-label',lab);
    $('#player').classList.toggle('vplaying',on);
  }
  function showCtl(){
    var pl=$('#player');pl.classList.remove('idle');clearTimeout(idleT);
    if(!vid.paused&&!vid.hidden)idleT=setTimeout(function(){pl.classList.add('idle')},3000);
  }
  function vToggle(){
    if(!cur||vid.hidden)return;
    if(vid.paused||vid.ended)play();else pause();
    showCtl();
  }
  ['timeupdate','loadedmetadata','durationchange','seeked'].forEach(function(ev){vid.addEventListener(ev,vSync)});
  ['play','pause','ended','playing'].forEach(function(ev){vid.addEventListener(ev,function(){vIcon();showCtl()})});
  vid.addEventListener('playing',function(){vid.classList.add('live')});
  vid.addEventListener('click',vToggle);
  $('#vplay').addEventListener('click',vToggle);
  $('#vbig').addEventListener('click',vToggle);
  vseek.addEventListener('input',function(){
    var m=vmax();if(!m)return;
    var tt=vseek.value/1000*m;
    try{vid.currentTime=tt}catch(e){}
    vseek.style.setProperty('--p',(vseek.value/10)+'%');$('#vnow').textContent=fmt(tt);showCtl();
  });
  $('#player').addEventListener('touchstart',showCtl,{passive:true});
  $('#player').addEventListener('mousemove',showCtl);
  (function(){
    var el=$('#player');
    if(!(el.requestFullscreen||el.webkitRequestFullscreen||vid.webkitEnterFullscreen))$('#vfs').hidden=true;
    $('#vfs').addEventListener('click',function(){
      if(fsEl()){exitFs();return}
      try{
        if(el.requestFullscreen){var pr=el.requestFullscreen();if(pr&&pr.catch)pr.catch(function(){})}
        else if(el.webkitRequestFullscreen)el.webkitRequestFullscreen();
        else if(vid.webkitEnterFullscreen)vid.webkitEnterFullscreen(); /* iPhone : plein écran natif de la vidéo */
      }catch(e){}
    });
  })();

  function stars(r){
    return '<span class="stars" role="img" aria-label="Note '+rate(r)+' / 5"><span class="stars-base" aria-hidden="true">★★★★★</span><span class="stars-fill" aria-hidden="true" style="width:'+(r/5*100)+'%">★★★★★</span></span>';
  }
  function renderCta(){
    var box=$('#dcta');
    if(locked()){
      box.innerHTML='<button id="unlock" class="btn btn-primary" type="button"><svg class="ic"><use href="#i-lock"/></svg>'+esc(t('unlock',{p:FC(cur.p)}))+'</button>';
      $('#unlock').addEventListener('click',function(){openPay(videoItem(cur),'detail')});
    }else{
      box.innerHTML=(cur.p?'<span class="ok-note"><svg class="ic"><use href="#i-check"/></svg>'+t('unlocked')+'</span>':'')+
        '<button id="watchnow" class="btn btn-primary" type="button"><svg class="ic f"><use href="#i-play"/></svg>'+t('watch')+'</button>';
      $('#watchnow').addEventListener('click',function(){window.scrollTo(0,0);if(!cur.video_url&&pos>=limit())setPos(0);play()});
    }
  }
  function renderFav(){
    var on=!!ST.favs[cur.id];
    $('#fav').setAttribute('aria-pressed',on);
    $('#fav span').textContent=on?t('fav_on'):t('fav');
  }
  function renderMeta(){
    $('#dchips').innerHTML=(cur.p?'<span class="chip vipc">VIP</span>':'<span class="chip">'+t('free')+'</span>')+(isNew(cur)?'<span class="chip">'+t('isnew')+'</span>':'');
    renderCta();renderFav();
  }
  /* Vidéos suggérées : même artiste et même catégorie d'abord, puis les plus récentes */
  function renderRelated(){
    var box=$('#related'),grid=$('#relgrid');
    if(!box||!cur)return;
    var list=V.filter(function(v){return v.id!==cur.id}).map(function(v){
      var s=0;
      if(v.a===cur.a)s+=2;
      if(cur.cat&&v.cat===cur.cat)s+=2;
      if(!!v.p===!!cur.p)s+=1;
      return {v:v,s:s};
    });
    list.sort(function(a,b){return (b.s-a.s)||(new Date(b.v.created||0)-new Date(a.v.created||0))});
    list=list.slice(0,6).map(function(x){return x.v});
    box.hidden=!list.length;
    grid.innerHTML=list.map(cardHTML).join('');
  }
  function openDetail(id){
    if(cur&&!views.detail.hidden)saveProgress();
    cur=byId[id];if(!cur)return;
    pause();viewed=false;wm.hidden=true;buffer.hidden=true;
    $('#player').style.setProperty('--g','#000');applyOri(ST.ori[cur.id]||0);
    seek.max=cur.dur||100;
    var hv=!!cur.video_url&&!locked();
    vid.hidden=!hv;$('#pplay').hidden=hv;document.querySelector('.p-ctl').hidden=hv;
    $('#vctl').hidden=!hv;$('#vbig').hidden=!hv;vid.classList.remove('live');$('#player').classList.remove('vplaying','idle');$('#vnow').textContent='0:00';$('#vtot').textContent=fmt(cur.dur);$('#vseek').value=0;$('#vseek').style.setProperty('--p','0%');
    vid.preload=(ST.saver||LITE)?'none':'metadata';
    if(hv){vid.controls=false;vid.poster=cur.img||capOf(cur)||'';if(LITE){vid.removeAttribute('src');vid.load()}else vid.src=cur.video_url}else{vid.removeAttribute('poster');vid.removeAttribute('src');vid.load()}
    $('#ttot').textContent=fmt(cur.dur);
    $('#gate').hidden=true;
    $('#dtitle').textContent=cur.t;
    $('#drating').innerHTML=cur.r?stars(cur.r)+'<span class="score">'+rate(cur.r)+'<small>/5</small></span>':'';
    $('#ddesc').textContent=(cur.db&&cur.d)||'';
    $('#ddesc').hidden=!(cur.db&&cur.d);
    var a=aName(cur);
    var ini=a.split(' ').filter(function(w){return /^[A-ZÉ]/.test(w)}).slice(0,2).map(function(w){return w[0]}).join('')||'TL';
    $('#dartist').innerHTML='<div class="avatar" style="--g:'+grad({h:(cur.h+120)%360})+'" aria-hidden="true">'+esc(ini)+'</div><div><h3>'+esc(a)+'</h3></div>';
    setPos(0);renderMeta();renderRelated();
    show('detail');refreshSocial();
    if(locked()){$('#pplay').hidden=true;$('#vbig').hidden=true;$('#vctl').hidden=true;document.querySelector('.p-ctl').hidden=true;showGate()}
    if(cur.priv)resolveSource();
  }
  /* Vidéo protégée : lien signé d'une heure, demandé avec le jeton du compte ; le serveur refuse sans achat confirmé */
  function resolveSource(){
    if(!cur||!cur.priv)return;
    var id=cur.id;
    Promise.resolve(session?isAdmin():false).then(function(a){
      ADM=!!a;if(!cur||cur.id!==id)return;renderMeta();
      if(locked())return;
      return authedFetch(SB_URL+'/storage/v1/object/sign/videos-private/'+cur.priv.split('/').map(encodeURIComponent).join('/'),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({expiresIn:3600})}).then(function(r){return r.ok?r.json():restErr(r)}).then(function(j){
        if(!cur||cur.id!==id)return;
        cur.video_url=SB_URL+'/storage/v1'+j.signedURL;
        $('#gate').hidden=true;vid.hidden=false;$('#pplay').hidden=true;document.querySelector('.p-ctl').hidden=true;
        vid.controls=false;$('#vctl').hidden=false;$('#vbig').hidden=false;vid.poster=cur.img||capOf(cur)||'';if(!LITE)vid.src=cur.video_url;
      });
    }).catch(function(){if(cur&&cur.id===id&&!locked())toast(t('priv_fail'))});
  }
  $('#pback').addEventListener('click',function(){pause();exitFs();show('home')});
  $('#fav').addEventListener('click',function(){if(cur)toggleFav(cur.id)});
  $('#share').addEventListener('click',function(){
    if(!cur)return;
    var url=shareUrl(),title=cur.t;
    function copy(){copyText(url).then(function(){toast(t('link_copied'))},function(){toast(t('share_fail'))})}
    if(navigator.share){try{navigator.share({title:title,text:title+' · TOPLEAKS',url:url}).catch(function(err){if(err&&err.name!=='AbortError')copy()})}catch(e){copy()}}
    else copy();
  });

  /* ---------- Paiement ---------- */
  var OPS=[
    {n:'M-Pesa',sub:'Vodacom',c:'#0b57d0',t:'#ffffff'},
    {n:'Orange Money',sub:'',c:'#ff7900',t:'#111111'},
    {n:'Airtel Money',sub:'',c:'#e4002b',t:'#ffffff'}
  ];
  var LOGOS={'M-Pesa':'','Orange Money':'','Airtel Money':''}; /* images officielles fournies par les opérateurs (data:image/...) */
  $('#ops').insertAdjacentHTML('beforeend',OPS.map(function(o){
    var inner=LOGOS[o.n]?'<img class="oplogo" src="'+LOGOS[o.n]+'" alt="'+o.n+'">':'<b>'+o.n+'</b>'+(o.sub?'<small>'+o.sub+'</small>':'');
    return '<label class="op"><input type="radio" name="op" value="'+o.n+'" aria-label="'+o.n+'"><span style="--c:'+o.c+';--t:'+o.t+'">'+inner+'</span></label>';
  }).join(''));

  var payItem=null,payFrom='detail',promoPct=0,promoCode='',payT=null;
  function videoItem(v){return {kind:'video',price:v.p,title:v.t,sub:aName(v),vid:v}}
  function payTotal(){return Math.max(0,Math.round(payItem.price*(100-promoPct)/100))}
  function payState(s){$('#payform').hidden=s!=='form';$('#paywait').hidden=s!=='wait';$('#payok').hidden=s!=='ok'}
  function renderPaySum(){
    var it=payItem;
    var thumb=it.vid
      ?'<div class="thumb" style="--g:'+flatBg(it.vid)+'">'+thumbImg(it.vid)+'<span class="glyph" aria-hidden="true">“</span></div>'
      :'<div class="thumb offer-thumb" style="--g:linear-gradient(160deg,hsl(38 70% 40%),hsl(275 60% 16%))"><span class="glyph" aria-hidden="true">“</span></div>';
    var h='<div class="sum-top">'+thumb+'<div><b>'+esc(it.title)+'</b><span>'+esc(it.sub)+'</span></div></div>'+
      '<div class="sum-row"><span>'+t('price')+'</span><span>'+FC(it.price)+'</span></div>';
    h+='<div class="sum-row"><span>'+t('pay_to')+'</span><span>'+esc(PAY_NUMBER)+'</span></div>';
    if(promoPct)h+='<div class="sum-row"><span>'+t('promo_label')+' '+esc(promoCode)+'</span><span>−'+promoPct+' %</span></div>';
    h+='<div class="sum-row total"><span>'+t('total')+'</span><span class="amount">'+FC(payTotal())+'</span></div>';
    $('#psum').innerHTML=h;
    $('#confirm').textContent=t('confirm',{p:FC(payTotal())});
  }
  function openPay(item,from){
    pause();payItem=item;payFrom=from;promoPct=0;promoCode='';
    $('#promo').value='';$('#promomsg').textContent='';$('#promomsg').className='hint';
    $('#perr').textContent='';$('#phone').classList.remove('bad');
    if(ST.phone&&!$('#phone').value)$('#phone').value=ST.phone;
    $('#watch').removeAttribute('data-wa');
    renderPaySum();payState('form');show('pay');loadPayNumber();
  }
  function backFromPay(){clearTimeout(payT);show(payFrom==='detail'&&cur?'detail':'home')}
  ['#payclose','#cancel','#waitcancel'].forEach(function(s){$(s).addEventListener('click',backFromPay)});
  $('#phone').addEventListener('input',function(){this.classList.remove('bad');$('#perr').textContent=''});
  $('#ops').addEventListener('change',function(){$('#perr').textContent=''});
  $('#promoapply').addEventListener('click',function(){
    var c=$('#promo').value.trim().toUpperCase(),m=$('#promomsg');
    if(!c){m.textContent=t('promo_empty');m.className='hint bad';return}
    if(Object.prototype.hasOwnProperty.call(PROMOS,c)){promoPct=PROMOS[c];promoCode=c;m.textContent=t('promo_ok',{n:promoPct});m.className='hint ok'}
    else{promoPct=0;promoCode='';m.textContent=t('promo_bad');m.className='hint bad'}
    renderPaySum();
  });
  /* Paiement réel : aucune simulation. L'acheteur paie au numéro officiel, confirme sur WhatsApp, puis l'admin accorde l'accès à son compte. */
  function manualPay(op,num){
    var it=payItem;
    freshSession().then(function(x){
      if(!x){$('#perr').textContent=t('pay_login');openAuth(t('pay_login'),null);return}
      ST.phone=num;saveState();
      var amount=FC(payTotal()),wa=String(CONTACT.whatsapp||'').replace(/\D/g,'');
      var msg=t('pay_wa_msg',{i:it.title,p:amount,op:op,num:num,e:(x.user&&x.user.email)||''});
      $('#oktxt').textContent=t('pay_sent_txt',{p:amount,op:op,n:PAY_NUMBER});
      $('#okref').textContent='';
      $('#watch').innerHTML=esc(t('pay_wa'));
      if(wa)$('#watch').setAttribute('data-wa','https://wa.me/'+wa+'?text='+encodeURIComponent(msg));else $('#watch').removeAttribute('data-wa');
      payState('ok');window.scrollTo(0,0);
    },function(){$('#perr').textContent=t('e_net')});
  }
  $('#confirm').addEventListener('click',function(){
    var opEl=document.querySelector('input[name=op]:checked');
    var num=$('#phone').value.replace(/[\s.\-]/g,'');
    if(!opEl){$('#perr').textContent=t('err_op');return}
    if(!/^0[89]\d{8}$/.test(num)){
      $('#phone').classList.add('bad');$('#perr').textContent=t('err_phone');$('#phone').focus();return;
    }
    if(!DEMO_MODE){manualPay(opEl.value,num);return}
    var amount=FC(payTotal());
    $('#waittxt').textContent=t('wait_txt',{p:amount,op:opEl.value,num:num});
    payState('wait');window.scrollTo(0,0);
    payT=setTimeout(function(){
      var it=payItem;ST.phone=num;
      if(it.kind==='video'){if(!it.vid.priv)ST.unlocked[it.vid.id]=true}
      saveState();
      $('#oktxt').textContent=t(it.kind==='video'?'ok_video':'ok_other',{p:amount,op:opEl.value,i:it.title});
      if(it.kind==='video'&&it.vid.priv)$('#oktxt').textContent=t('priv_demo');
      $('#okref').textContent=t('ref')+' DEMO-'+String(Math.floor(100000+Math.random()*900000));
      $('#watch').innerHTML=it.kind==='video'?'<svg class="ic f"><use href="#i-play"/></svg>'+t('watch'):t('browse');
      payState('ok');
    },3500);
  });
  $('#watch').addEventListener('click',function(){
    var waUrl=this.getAttribute('data-wa');
    if(waUrl){try{window.open(waUrl,'_blank','noopener')}catch(e){location.href=waUrl}return}
    if(payItem&&payItem.kind==='video'&&cur){
      show('detail');renderMeta();$('#gate').hidden=true;setPos(0);if(cur.video_url&&vid.getAttribute('src')){try{vid.currentTime=0}catch(e){}}play();
    }else show('home');
  });

  /* ---------- Pages d'information ---------- */
  function docHTML(k){
    var n=esc(CONTACT.display||'');
    var draft='<p class="draft">'+t('draft')+'</p>';
    if(k==='about')return draft+
      '<p>TOPLEAKS est une plateforme de vidéo à la demande consacrée à l’humour local : sketchs, one-man shows et documentaires.</p>'+
      '<h3>Une plateforme éditée</h3><p>Tous les contenus sont choisis et publiés par TOPLEAKS. Les utilisateurs ne publient pas de vidéos.</p>'+
      '<h3>Gratuit ou payant</h3><p>Certains spectacles sont gratuits. Les spectacles VIP se débloquent en francs congolais (FC) par Mobile Money : M-Pesa, Orange Money ou Airtel Money. Chaque spectacle payant propose un aperçu gratuit de 5 secondes.</p>'+
      '<h3>Nous contacter</h3><p>Écrivez-nous sur WhatsApp ou appelez le '+n+'.</p>';
    if(k==='terms')return draft+
      '<h3>1. Objet</h3><p>Ces conditions encadrent l’utilisation de l’application TOPLEAKS, service de vidéo à la demande édité par TOPLEAKS.</p>'+
      '<h3>2. Accès aux contenus</h3><p>Les contenus gratuits sont accessibles à tous. Les contenus VIP sont accessibles après paiement. Un aperçu de 5 secondes est offert avant l’achat.</p>'+
      '<h3>3. Prix et paiement</h3><p>Les prix sont indiqués en francs congolais (FC), toutes taxes comprises. Le paiement se fait par Mobile Money. Le contenu est débloqué après confirmation du paiement par l’opérateur.</p>'+
      '<h3>4. Prix et codes promo</h3><p>Chaque spectacle VIP a son prix, indiqué avant le paiement. Les codes promo ne se cumulent pas.</p>'+
      '<h3>5. Usage personnel</h3><p>Les contenus sont réservés à un usage personnel. Il est interdit de les copier, enregistrer, partager ou diffuser. Les vidéos payantes portent un filigrane qui permet d’identifier la source d’une fuite.</p>'+
      '<h3>6. Remboursement</h3><p>Un contenu numérique débloqué n’est pas remboursable. En cas de double paiement ou d’erreur technique, contactez-nous au '+n+' dans les 7 jours avec votre référence de paiement.</p>'+
      '<h3>7. Disponibilité</h3><p>Nous faisons le maximum pour que le service soit disponible, sans garantie d’accès continu.</p>'+
      '<h3>Commentaires</h3><p>Les commentaires sont publics. Les propos injurieux, haineux ou illégaux peuvent être supprimés.</p><h3>8. Modifications</h3><p>Ces conditions peuvent évoluer. La version en vigueur est celle affichée dans l’application.</p>'+
      '<h3>9. Contact</h3><p>WhatsApp et téléphone : '+n+'.</p>';
    return draft+
      '<h3>Données que nous utilisons</h3><ul><li>Pour un compte : votre adresse e-mail, votre pseudo, votre pays (facultatif), vos commentaires et vos J’aime. Vos J’aime sont publics.</li><li>Votre numéro Mobile Money et l’opérateur choisi, pour traiter le paiement.</li><li>Les références de transaction, pour vous aider en cas de problème.</li><li>Des statistiques de visionnage, sans nom, pour savoir quels spectacles sont regardés.</li><li>Vos préférences (langue, favoris, économie de data), conservées sur votre téléphone.</li></ul>'+
      '<h3>Pourquoi</h3><p>Pour débloquer vos achats, améliorer le catalogue et prévenir le piratage des vidéos payantes.</p>'+
      '<h3>Partage</h3><p>Vos données ne sont pas vendues. Elles sont partagées uniquement avec le service de paiement et l’hébergeur technique nécessaires au fonctionnement de l’application.</p>'+
      '<h3>Conservation</h3><p>Les données de paiement sont conservées le temps nécessaire à la gestion des achats et des réclamations.</p>'+
      '<h3>Vos droits</h3><p>Vous pouvez demander l’accès à vos données ou leur suppression en nous contactant au '+n+'.</p>';
  }
  function openDoc(k){$('#doctitle').textContent=t(k);$('#docbody').innerHTML=docHTML(k);show('doc')}
  $('#docclose').addEventListener('click',function(){show('home')});

  /* ---------- Contact ---------- */
  function renderContact(){
    var box=$('#contactlinks'),h='';
    var wa=String(CONTACT.whatsapp||'').replace(/\D/g,''),ph=String(CONTACT.phone||'').replace(/\D/g,''),em=String(CONTACT.email||'').trim();
    if(wa)h+='<a class="clink main" href="https://wa.me/'+wa+'" target="_blank" rel="noopener">WhatsApp</a>';
    if(ph)h+='<a class="clink" href="tel:+'+ph+'">'+t('call')+'</a>';
    if(em)h+='<a class="clink" href="mailto:'+esc(em)+'">E-mail</a>';
    if(CONTACT.display)h+='<label class="clabel" for="cnum">'+t('our_number')+'</label><div class="cnumrow"><input id="cnum" class="cnum" type="text" readonly value="'+esc(CONTACT.display)+'"><button id="ccopy" class="clink" type="button">'+t('copy')+'</button></div>';
    box.innerHTML=h;
    var help=$('#payhelp');
    if(wa){help.href='https://wa.me/'+wa+'?text='+encodeURIComponent('Bonjour TOPLEAKS, j’ai un souci de paiement.');help.hidden=false}else help.hidden=true;
  }
  $('#contactlinks').addEventListener('click',function(e){
    if(!e.target.closest('#ccopy'))return;
    var inp=$('#cnum');
    copyText(inp.value).then(function(){toast(t('copied'))},function(){try{inp.select()}catch(x){}toast(t('selected'))});
  });

  /* ---------- Supabase : lecture des vidéos publiées ---------- */
  function hue(str){var h=0;for(var i=0;i<str.length;i++)h=(h*31+str.charCodeAt(i))%360;return h}
  function https(u){u=u==null?'':String(u).trim();return /^https:\/\//.test(u)?u:''}
  function loadVideos(){
    loading=true;failed=false;renderHome();
    var url=SB_URL+'/rest/v1/videos?select=id,title,artist,description,thumbnail_url,video_url,duration_seconds,price_fc,created_at,video_path,category_id,pinned&is_published=eq.true&order=pinned.desc.nullslast,created_at.desc';
    (function go(){return fetch(url,{headers:{apikey:SB_KEY}}).then(function(r){if(r.status===400){var n=url.replace(',pinned','').replace('order=pinned.desc.nullslast,created_at.desc','order=created_at.desc');if(n===url)n=url.replace(',category_id','');if(n===url)n=url.replace(',video_path','');if(n!==url){url=n;return go()}}return r})})().then(function(r){
      if(!r.ok)return r.text().then(function(tx){
        var m='';try{m=JSON.parse(tx).message||''}catch(x){}
        var err=new Error('HTTP '+r.status+(m?' · '+m:''));err.status=r.status;throw err;
      });
      return r.json();
    }).then(function(rows){
      V=rows.map(function(r){
        var name=r.artist||'TOPLEAKS';
        if(!A[name])A[name]={n:name};
        return {id:String(r.id),a:name,t:r.title||'Sans titre',dur:r.duration_seconds||0,r:0,p:+r.price_fc||0,
          created:r.created_at,h:hue(r.title||''),d:r.description||'',db:true,img:https(r.thumbnail_url),video_url:r.video_path?'':https(r.video_url),cat:String(r.category_id==null?'':r.category_id),priv:r.video_path||'',pin:!!r.pinned};
      });
      PINOK=/,pinned/.test(url);
      /* tri de sécurité : épinglées d'abord, puis plus récentes */
      V.sort(function(a,b){return (b.pin-a.pin)||(new Date(b.created||0)-new Date(a.created||0))});
      loading=false;failed=false;reindex();renderHome();search();openShared();notifyNew();
    }).catch(function(e){
      loading=false;failed=true;V=[];reindex();renderHome();
    });
  }

  /* ---------- Compte : Supabase Auth par l'API REST (clé publique uniquement) ---------- */
  var AUTH_KEY='tl_auth_v1',session=null,pendingEmail='',authPending=null,refreshing=null,lastFocus=null,sharedDone=false;
  var enc=encodeURIComponent,web=/^https?:$/.test(location.protocol);
  function appUrl(){return web?location.origin+location.pathname:location.href.split('#')[0].split('?')[0]}
  function shareUrl(){return appUrl()+'?video='+enc(cur.id)}
  function loadSession(){try{var x=JSON.parse(localStorage.getItem(AUTH_KEY)||'null');session=(x&&x.access_token&&x.refresh_token)?x:null}catch(e){session=null}}
  function storeSession(x){session=x;try{if(x)localStorage.setItem(AUTH_KEY,JSON.stringify(x));else localStorage.removeItem(AUTH_KEY)}catch(e){}renderAccount();if(x)setTimeout(touchSeen,0)}
  function normSession(j){
    if(!j||!j.access_token)return null;
    var u=j.user||(session&&session.user)||null;
    return {access_token:j.access_token,refresh_token:j.refresh_token,expires_at:j.expires_at||Math.floor(Date.now()/1000)+(+j.expires_in||3600),
      user:u?{id:u.id,email:u.email||'',name:(u.user_metadata&&u.user_metadata.username)||''}:null};
  }
  function authApi(method,path,body,token){
    var h={apikey:SB_KEY,'Content-Type':'application/json'};if(token)h.Authorization='Bearer '+token;
    return fetch(SB_URL+'/auth/v1/'+path,{method:method,headers:h,body:body?JSON.stringify(body):undefined}).then(function(r){
      return r.text().then(function(tx){
        var j=null;try{j=tx?JSON.parse(tx):null}catch(x){}
        if(!r.ok){var err=new Error((j&&(j.msg||j.error_description||j.message||j.error))||('HTTP '+r.status));err.status=r.status;err.code=(j&&j.error_code)||'';throw err}
        return j;
      });
    },function(){var e=new Error('network');e.network=true;throw e});
  }
  function restErr(r){return r.text().then(function(tx){var m='';try{var j=JSON.parse(tx);m=j.message||j.hint||''}catch(x){}var e=new Error(m||('HTTP '+r.status));e.status=r.status;throw e})}
  function friendlyErr(e){
    if(!e)return t('e_net');
    var c=e.code||'',m=e.message||'';
    if(e.network)return t('e_net');
    if(c==='invalid_credentials'||/invalid login credentials/i.test(m))return t('e_invalid');
    if(c==='user_already_exists'||c==='email_exists'||/already (been )?registered/i.test(m))return t('e_exists');
    if(c==='email_not_confirmed'||/not confirmed/i.test(m))return t('e_unconf');
    if(/rate.?limit|too many/i.test(m)||c==='over_email_send_rate_limit'||c==='over_request_rate_limit')return t('e_rate');
    if(c==='otp_expired'||/expired|invalid.*(token|otp)|token.*invalid/i.test(m))return t('e_otp');
    if(/signups? not allowed|otp_disabled/i.test(c+' '+m))return t('e_nouser');
    if(c==='weak_password')return t('e_weak');
    return m||t('e_net');
  }
  function refreshSession(){
    if(refreshing)return refreshing;
    if(!session)return Promise.resolve(null);
    refreshing=authApi('POST','token?grant_type=refresh_token',{refresh_token:session.refresh_token}).then(function(j){
      var x=normSession(j);if(!x)throw new Error('session');storeSession(x);return x;
    },function(e){
      if(e.network)throw e;
      storeSession(null);return null; /* refresh refusé : la session n'est plus valable */
    }).then(function(x){refreshing=null;return x},function(e){refreshing=null;throw e});
    return refreshing;
  }
  /* Session valide juste avant chaque écriture (jamais de session obsolète) */
  function freshSession(){
    if(!session)return Promise.resolve(null);
    if(session.expires_at-60>Date.now()/1000)return Promise.resolve(session);
    return refreshSession();
  }
  function noSession(){var e=new Error('Connexion requise');e.noSession=true;return e}
  function authedFetch(url,opts,retried){
    return freshSession().then(function(x){
      if(!x)throw noSession();
      var o=opts||{},h={apikey:SB_KEY,Authorization:'Bearer '+x.access_token};
      for(var k in (o.headers||{}))h[k]=o.headers[k];
      return fetch(url,{method:o.method||'GET',headers:h,body:o.body}).then(function(r){
        if(r.status===401&&!retried)return refreshSession().then(function(x2){if(!x2)throw noSession();return authedFetch(url,opts,true)});
        return r;
      },function(){var e=new Error('network');e.network=true;throw e});
    });
  }
  function authMsg(x,bad){var el=$('#signm').hidden?$('#authmsg'):$('#signmsg');el.textContent=x||'';el.className='hint'+(x&&bad?' bad':'')}
  var MODALS=['#authm','#signm','#comm','#qedit','#apkm'];
  function openModal(sel){
    lastFocus=document.activeElement;$(sel).hidden=false;document.body.style.overflow='hidden';
    setTimeout(function(){var f=null,q2=$(sel).querySelectorAll('input,textarea');for(var i=0;i<q2.length;i++){if(!q2[i].closest('[hidden]')){f=q2[i];break}}if(!f)f=$(sel).querySelector('.xclose');if(f)try{f.focus()}catch(e){}},40);
  }
  function closeModal(sel){
    $(sel).hidden=true;
    if(MODALS.every(function(m){return $(m).hidden}))document.body.style.overflow='';
    if(lastFocus&&lastFocus.focus)try{lastFocus.focus()}catch(e){}
  }
  function closeAuthModals(){['#authm','#signm'].forEach(function(m){if(!$(m).hidden)closeModal(m)})}
  /* Connexion : fenêtre #authm (e-mail + mot de passe ou Google). Inscription : fenêtre #signm (création + code de confirmation). */
  function openAuth(msg,after){authPending=after||null;if(!$('#signm').hidden)closeModal('#signm');renderAccount();openModal('#authm');authMsg(msg||'',!!msg)}
  function openSignup(){
    if(!$('#authm').hidden)closeModal('#authm');
    $('#signform').hidden=false;$('#signalt').hidden=false;$('#otpstep').hidden=true;
    openModal('#signm');authMsg('');
  }
  function showOtp(email){
    pendingEmail=email;$('#otpcopy').textContent=t('otp_copy',{e:email});
    $('#signform').hidden=true;$('#signalt').hidden=true;$('#otpstep').hidden=false;authMsg('');
    try{$('#otpcode').focus()}catch(e){}
  }
  function renderAccount(){
    var on=!!session,mail=(session&&session.user&&session.user.email)||'';
    $('#acct').classList.toggle('on',on);
    $('#acct').setAttribute('aria-label',on?t('logged_as',{e:mail}):t('acct'));
    $('#authuser').textContent=on?t('logged_as',{e:mail}):'';
    $('#authtitle').textContent=t(on?'acct_title':'login');
    $('#loginbox').hidden=on;$('#signout').hidden=!on;$('#comlogin').hidden=on;
    syncAdminBtn();
  }
  function afterLogin(j,msg){
    var x=normSession(j);if(!x)throw new Error('session');
    storeSession(x);authMsg('');toast(msg);closeAuthModals();
    $('#otpstep').hidden=true;$('#otpcode').value='';
    var cb=authPending;authPending=null;
    loadPurchases();
    if(cur&&!views.detail.hidden)refreshSocial();
    if(!views.admin.hidden)renderAdmin();
    if(cb)cb();
  }
  function busy(b){['#authsubmit','#signsubmit','#otpverify','#gbtn','#sgbtn'].forEach(function(id){$(id).disabled=b})}
  $('#acct').addEventListener('click',function(){openAuth('')});
  $('#authclose').addEventListener('click',function(){closeModal('#authm')});
  $('#signclose').addEventListener('click',function(){closeModal('#signm')});
  $('#gosignup').addEventListener('click',openSignup);
  $('#gologin').addEventListener('click',function(){openAuth('')});
  /* Connexion directe : aucun code demandé */
  $('#authform').addEventListener('submit',function(e){
    e.preventDefault();
    var email=$('#aemailin').value.trim(),pw=$('#apwin').value;
    if(!/^\S+@\S+\.\S+$/.test(email)){authMsg(t('e_email'),true);return}
    if(!pw){authMsg(t('e_invalid'),true);return}
    busy(true);authMsg(t('sending'));
    authApi('POST','token?grant_type=password',{email:email,password:pw}).then(function(j){afterLogin(j,t('connected'))}).catch(function(err){
      if(err&&(err.code==='email_not_confirmed'||/not confirmed/i.test(err.message||''))){
        /* compte créé mais jamais confirmé : on renvoie le code et on ouvre l'étape de confirmation */
        authApi('POST','resend',{type:'signup',email:email}).catch(function(){});
        openSignup();showOtp(email);return;
      }
      authMsg(friendlyErr(err),true);
    }).then(function(){busy(false)});
  });
  /* Inscription : création du compte, puis code de confirmation reçu par e-mail */
  $('#signform').addEventListener('submit',function(e){
    e.preventDefault();
    var email=$('#semail').value.trim(),pw=$('#spw').value,name=$('#aname').value.trim();
    if(name.length<2){authMsg(t('e_name'),true);return}
    if(!/^\S+@\S+\.\S+$/.test(email)){authMsg(t('e_email'),true);return}
    if(pw.length<6){authMsg(t('e_weak'),true);return}
    busy(true);authMsg(t('sending'));
    authApi('POST','signup',{email:email,password:pw,data:{username:name,country:$('#acountry').value||null}}).then(function(j){
      if(j&&j.access_token){afterLogin(j,t('created_signed'));return}
      var u=j&&(j.user||j);
      if(u&&Array.isArray(u.identities)&&u.identities.length===0){authMsg(t('e_exists'),true);return}
      showOtp(email);
    }).catch(function(err){authMsg(friendlyErr(err),true)}).then(function(){busy(false)});
  });
  $('#otpverify').addEventListener('click',function(){
    var code=$('#otpcode').value.replace(/\s+/g,'');
    if(!/^\d{6,10}$/.test(code)){authMsg(t('e_code'),true);return}
    busy(true);authMsg(t('sending'));
    authApi('POST','verify',{type:'signup',email:pendingEmail,token:code}).then(function(j){afterLogin(j,t('confirmed'))}).catch(function(err){authMsg(friendlyErr(err),true)}).then(function(){busy(false)});
  });
  $('#otpcode').addEventListener('keydown',function(e){if(e.key==='Enter'){e.preventDefault();$('#otpverify').click()}});
  $('#otpresend').addEventListener('click',function(){
    authMsg(t('sending'));
    authApi('POST','resend',{type:'signup',email:pendingEmail}).then(function(){authMsg(t('code_sent'))}).catch(function(err){authMsg(friendlyErr(err),true)});
  });
  $('#otpedit').addEventListener('click',function(){$('#otpstep').hidden=true;$('#otpcode').value='';$('#signform').hidden=false;$('#signalt').hidden=false;authMsg('')});
  /* Mot de passe oublié : lien reçu par e-mail, puis nouveau mot de passe dans la fenêtre de connexion */
  $('#forgot').addEventListener('click',function(){
    var email=$('#aemailin').value.trim();
    if(!/^\S+@\S+\.\S+$/.test(email)){authMsg(t('e_email'),true);return}
    authMsg(t('sending'));
    authApi('POST','recover',{email:email}).then(function(){authMsg(t('forgot_sent'))}).catch(function(err){authMsg(friendlyErr(err),true)});
  });
  $('#resetsave').addEventListener('click',function(){
    var pw=$('#newpw').value;
    if(pw.length<6){authMsg(t('e_weak'),true);return}
    authMsg(t('sending'));
    authedFetch(SB_URL+'/auth/v1/user',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({password:pw})}).then(function(r){
      if(!r.ok)return restErr(r);
      $('#newpw').value='';$('#resetstep').hidden=true;authMsg('');toast(t('reset_ok'));closeAuthModals();renderAccount();
    }).catch(function(err){authMsg(friendlyErr(err),true)});
  });
  function googleLogin(){
    if(!web){authMsg(t('e_google_file'),true);return}
    authMsg(t('sending'));
    location.href=SB_URL+'/auth/v1/authorize?provider=google&redirect_to='+enc(appUrl());
  }
  $('#gbtn').addEventListener('click',googleLogin);
  $('#sgbtn').addEventListener('click',googleLogin);
  $('#signout').addEventListener('click',function(){
    var tk=session&&session.access_token;
    if(tk)authApi('POST','logout',null,tk).catch(function(){});
    storeSession(null);SRV={};ADM=false;admCache=null;toast(t('signedout'));closeAuthModals();
    if(cur&&!views.detail.hidden)refreshSocial();
    if(!views.admin.hidden)renderAdmin();
  });
  /* Retour d'un lien e-mail ou de Google : les jetons arrivent dans l'adresse (#access_token=…) */
  function consumeHash(){
    var h=location.hash.replace(/^#/,'');
    if(!/(^|&)(access_token|error)=/.test(h))return Promise.resolve();
    var p=new URLSearchParams(h);
    try{history.replaceState(null,'',location.pathname+location.search)}catch(e){}
    if(p.get('error')){openAuth(p.get('error_description')||p.get('error'));return Promise.resolve()}
    var at=p.get('access_token'),rt=p.get('refresh_token');
    if(!at||!rt)return Promise.resolve();
    return authApi('GET','user',null,at).then(function(u){
      storeSession({access_token:at,refresh_token:rt,expires_at:+p.get('expires_at')||Math.floor(Date.now()/1000)+(+p.get('expires_in')||3600),
        user:{id:u.id,email:u.email||'',name:(u.user_metadata&&u.user_metadata.username)||''}});
      if(p.get('type')==='recovery'){$('#resetstep').hidden=false;openAuth(t('reset_copy'))}else toast(t('connected'));
    }).catch(function(err){openAuth(friendlyErr(err),null)});
  }
  window.addEventListener('storage',function(e){if(e.key===AUTH_KEY){loadSession();renderAccount()}});
  document.addEventListener('keydown',function(e){
    if(e.key!=='Escape')return;
    if(!$('#signm').hidden)closeModal('#signm');else if(!$('#authm').hidden)closeModal('#authm');else if(!$('#comm').hidden)closeModal('#comm');
  });
  ['#authm','#signm','#comm'].forEach(function(sel){$(sel).addEventListener('click',function(e){if(e.target===$(sel))closeModal(sel)})});

  /* ---------- J'aime et commentaires ---------- */
  var REST=SB_URL+'/rest/v1/';
  function countOf(r){var m=(r.headers.get('content-range')||'').match(/\/(\d+)$/);return m?+m[1]:0}
  function setLiked(on){$('#like').setAttribute('aria-pressed',on?'true':'false')}
  function refreshSocial(){
    if(!cur)return;
    var id=cur.id,h={apikey:SB_KEY,Prefer:'count=exact',Range:'0-0'};
    $('#socialnote').hidden=true;
    Promise.all([fetch(REST+'video_likes?select=id&video_id=eq.'+enc(id),{headers:h}),fetch(REST+'video_comments?select=id&video_id=eq.'+enc(id),{headers:h})]).then(function(rs){
      if(!cur||cur.id!==id)return;
      if(!rs[0].ok||!rs[1].ok)throw new Error('social');
      $('#likecount').textContent=countOf(rs[0]);$('#comcount').textContent=countOf(rs[1]);
      return freshSession().then(function(x){
        if(!x){setLiked(false);return}
        return authedFetch(REST+'video_likes?select=id&video_id=eq.'+enc(id)+'&user_id=eq.'+enc(x.user.id)).then(function(r){return r.ok?r.json():[]}).then(function(rows){if(cur&&cur.id===id)setLiked(rows.length>0)});
      });
    }).catch(function(){if(!cur||cur.id!==id)return;$('#socialnote').textContent=t('social_off');$('#socialnote').hidden=false});
  }
  function requireLogin(msgKey){
    return freshSession().then(function(x){if(x)return x;openAuth(t(msgKey));return null},function(){toast(t('e_net'));return null});
  }
  $('#like').addEventListener('click',function(){
    if(!cur)return;
    var id=cur.id,b=$('#like');
    requireLogin('like_need').then(function(x){
      if(!x)return;
      var liked=b.getAttribute('aria-pressed')==='true';b.disabled=true;
      var req=liked
        ?authedFetch(REST+'video_likes?video_id=eq.'+enc(id)+'&user_id=eq.'+enc(x.user.id),{method:'DELETE',headers:{Prefer:'return=minimal'}})
        :authedFetch(REST+'video_likes',{method:'POST',headers:{'Content-Type':'application/json',Prefer:'return=minimal'},body:JSON.stringify({video_id:id,user_id:x.user.id})});
      return req.then(function(r){if(!r.ok&&r.status!==409)return restErr(r);refreshSocial()})
        .catch(function(err){if(err.noSession)openAuth(t('like_need'));else toast(friendlyErr(err))})
        .then(function(){b.disabled=false});
    });
  });
  function loadComments(){
    var list=$('#clist'),id=cur.id;list.textContent=t('com_loading');
    fetch(REST+'rpc/list_comments',{method:'POST',headers:{apikey:SB_KEY,'Content-Type':'application/json'},body:JSON.stringify({p_video_id:id,p_limit:100})}).then(function(r){
      if(r.status===404)return fetch(REST+'video_comments?select=id,body,created_at&video_id=eq.'+enc(id)+'&order=created_at.desc&limit=100',{headers:{apikey:SB_KEY}}).then(function(r2){return r2.ok?r2.json():restErr(r2)});
      return r.ok?r.json():restErr(r);
    }).then(function(rows){return isAdmin().then(function(adm){return {rows:rows,adm:adm}})}).then(function(o){
      var rows=o.rows,adm=o.adm;
      if(!cur||cur.id!==id)return;
      list.innerHTML='';
      if(!rows.length){list.textContent=t('com_none');return}
      rows.forEach(function(row){
        var a=document.createElement('article'),sm=document.createElement('small'),bd=document.createElement('div');
        a.className='cmt';sm.textContent=(row.username||t('user_anon'))+' · '+new Date(row.created_at).toLocaleString();bd.textContent=row.body;
        a.appendChild(sm);a.appendChild(bd);
        if(row.id!=null&&(adm||(session&&session.user&&row.user_id&&row.user_id===session.user.id))){
          var del=document.createElement('button');del.type='button';del.className='cdel';del.textContent=t('com_del');
          del.addEventListener('click',function(){
            if(!confirm(t('com_del_ask')))return;
            del.disabled=true;
            authedFetch(REST+'video_comments?id=eq.'+enc(row.id),{method:'DELETE'}).then(function(r){if(!r.ok)return restErr(r);loadComments();refreshSocial()}).catch(function(err){del.disabled=false;$('#commsg').textContent=t('com_fail')+' '+(err.message||'')});
          });
          a.appendChild(del);
        }
        list.appendChild(a);
      });
    }).catch(function(err){list.textContent=t('com_load_fail')+' '+(err.message||'')});
  }
  $('#comopen').addEventListener('click',function(){
    if(!cur)return;
    $('#commsg').textContent='';renderAccount();openModal('#comm');loadComments();
  });
  $('#comclose').addEventListener('click',function(){closeModal('#comm')});
  $('#comlogbtn').addEventListener('click',function(){openAuth(t('com_need'))});
  $('#comform').addEventListener('submit',function(e){
    e.preventDefault();
    var body=$('#cominput').value.trim(),msg=$('#commsg');
    if(!body||!cur)return;
    var id=cur.id,btn=$('#comsend');btn.disabled=true;msg.textContent='';
    /* La session est vérifiée juste avant l'écriture ; sans session, rien n'est envoyé */
    freshSession().then(function(x){
      if(!x){openAuth(t('com_need'),function(){openModal('#comm')});msg.textContent=t('com_need');return}
      return authedFetch(REST+'video_comments',{method:'POST',headers:{'Content-Type':'application/json',Prefer:'return=minimal'},body:JSON.stringify({video_id:id,user_id:x.user.id,body:body})}).then(function(r){
        if(!r.ok)return restErr(r);
        $('#cominput').value='';msg.textContent=t('com_posted');loadComments();refreshSocial();
      });
    }).catch(function(err){
      if(err.noSession){openAuth(t('com_need'),function(){openModal('#comm')});msg.textContent=t('com_need')}
      else msg.textContent=t('com_fail')+' '+(err.network?t('e_net'):err.message);
    }).then(function(){btn.disabled=false});
  });
  /* Lien partagé : ?video=<id> ouvre la vidéo une fois le catalogue chargé */
  function openShared(){
    if(sharedDone)return;sharedDone=true;
    var id=new URLSearchParams(location.search).get('video');
    if(!id)return;
    if(byId[id])openDetail(id);else toast(t('not_found_video'));
  }

  /* ---------- Ma bibliothèque : achats confirmés par le serveur + favoris de l'appareil ---------- */
  function loadPurchases(){
    if(!session)return;
    authedFetch(REST+'purchases?select=video_id&status=eq.paid&video_id=not.is.null').then(function(r){return r.ok?r.json():[]}).then(function(rows){
      rows.forEach(function(x){SRV[x.video_id]=true});
      if(cur&&!views.detail.hidden){renderMeta();if(!cur.priv&&cur.video_url&&!locked()&&vid.hidden)openDetail(cur.id)}
      if(!views.lib.hidden)renderLib();
      resolveSource();
    }).catch(function(){});
  }
  function renderLib(){
    var un=V.filter(function(v){return v.p>0&&(ST.unlocked[v.id]||SRV[v.id])}),fv=V.filter(function(v){return ST.favs[v.id]}),h='';
    h+='<section class="row"><h2>'+esc(t('lib_bought'))+'<small>'+un.length+'</small></h2>'+(un.length?'<div class="grid">'+un.map(cardHTML).join('')+'</div>':'<p class="hint">'+esc(t('lib_none_b'))+'</p>')+'</section>';
    h+='<section class="row"><h2>'+esc(t('lib_favs'))+'<small>'+fv.length+'</small></h2>'+(fv.length?'<div class="grid">'+fv.map(cardHTML).join('')+'</div>':'<p class="hint">'+esc(t('lib_none_f'))+'</p>')+'</section>';
    h+='<p class="hint" style="margin:22px 0 30px">'+esc(t('lib_note'))+'</p>';
    $('#libbody').innerHTML=h;
  }
  $('#libopen').addEventListener('click',function(){renderLib();show('lib');loadPurchases()});
  $('#libclose').addEventListener('click',function(){show('home')});
  /* Notification locale : nouveautés depuis la dernière visite (ce n'est pas une notification push) */
  function notifyNew(){
    var s=ST.seen||0,n=0;
    if(s)V.forEach(function(v){if(v.created&&new Date(v.created).getTime()>s)n++});
    ST.seen=Date.now();saveState();
    if(n)setTimeout(function(){toast(t('new_videos',{n:n}))},600);
  }
  var admCache=null;
  function syncAdminBtn(){
    var b=$('#adminopen');if(!b)return;
    if(!session||!session.user){b.hidden=true;setAdminUI(false);if(views.admin&&!views.admin.hidden)show('home');return}
    isAdmin().then(function(v){b.hidden=!v;setAdminUI(v);if(!v&&views.admin&&!views.admin.hidden)show('home')});
  }
  /* Affiche ou retire le menu ⋮ sur les cartes selon le statut administrateur */
  function setAdminUI(v){
    v=!!v;if(v===ADMUI)return;
    ADMUI=v;
    if(loading)return;
    renderGrid();search();
    if(views.lib&&!views.lib.hidden)renderLib();
  }
  function isAdmin(){
    if(!session||!session.user)return Promise.resolve(false);
    if(admCache&&admCache.uid===session.user.id)return Promise.resolve(admCache.v);
    return authedFetch(REST+'admins?select=user_id&user_id=eq.'+enc(session.user.id)).then(function(r){return r.ok?r.json():[]}).then(function(rows){admCache={uid:session.user.id,v:rows.length>0};return admCache.v}).catch(function(){return false});
  }

  /* ---------- Espace admin (même compte ; droits vérifiés par les règles RLS) ---------- */
  var BUCKET='videos'; /* nom du bucket Storage public */
  function amsg(x,bad){var el=$('#amsg');el.textContent=x||'';el.className='hint'+(x?(bad?' bad':' ok'):'')}
  function renderAdmin(){
    amsg('');$('#aneedtxt').textContent=t('admin_need');$('#aopenauth').hidden=false;$('#apanel').hidden=true;
    freshSession().then(function(x){
      $('#aneed').hidden=!!x;
      if(!x)return;
      return authedFetch(REST+'admins?select=user_id&user_id=eq.'+enc(x.user.id)).then(function(r){return r.ok?r.json():restErr(r)}).then(function(rows){
        if(!rows.length){$('#aneed').hidden=false;$('#aneedtxt').textContent=t('admin_not');$('#aopenauth').hidden=true;return}
        $('#apanel').hidden=false;restoreAdminTab();$('#apaynum').value=PAY_NUMBER;loadPayNumber();loadCats();refreshDash();
      });
    }).catch(function(err){$('#aneed').hidden=false;amsg(friendlyErr(err),true)});
  }
  $('#adminopen').addEventListener('click',function(){show('admin');renderAdmin()});
  $('#adminclose').addEventListener('click',function(){show('home')});
  $('#aopenauth').addEventListener('click',function(){openAuth('',renderAdmin)});
  var ADMV={},editId=null;
  /* Catégories : table « categories » (id, name) et colonne videos.category_id, gérées par l'admin */
  function fillCatSelect(){
    var sel=$('#acat');if(!sel)return;var cv=sel.value;
    sel.innerHTML='<option value="">Aucune</option>'+CATS.map(function(c){return '<option value="'+esc(c.id)+'">'+esc(c.name)+'</option>'}).join('');
    sel.value=cv;
    var r2=$('#rcat');if(r2){var rv=r2.value;r2.innerHTML=sel.innerHTML;r2.value=rv}
  }
  function renderCats(){
    var box=$('#acats');if(!box)return;
    box.innerHTML=CATS.length?CATS.map(function(c){return '<div class="arow"><div><b>'+esc(c.name)+'</b></div><div class="abtns"><button class="btn btn-ghost" type="button" data-cedit="'+esc(c.id)+'">Modifier</button><button class="btn btn-ghost" type="button" data-cdel="'+esc(c.id)+'">Supprimer</button></div></div>'}).join(''):'<p class="hint">Aucune catégorie.</p>';
  }
  function loadCats(){
    return fetch(REST+'categories?select=id,name&order=name.asc',{headers:{apikey:SB_KEY}}).then(function(r){return r.ok?r.json():[]}).then(function(rows){CATS=Array.isArray(rows)?rows:[]}).catch(function(){CATS=[]}).then(function(){fillCatSelect();renderCats();renderFilters()});
  }
  function catErr(err){return (err.noSession?t('admin_need'):err.message)+' (table « categories » installée ?)'}
  $('#acatform').addEventListener('submit',function(e){
    e.preventDefault();var n=$('#acatname').value.trim();
    if(n.length<2){amsg('Nom de catégorie trop court.',true);return}
    authedFetch(REST+'categories',{method:'POST',headers:{'Content-Type':'application/json',Prefer:'return=minimal'},body:JSON.stringify({name:n})}).then(function(r){
      if(!r.ok)return restErr(r);
      $('#acatname').value='';amsg('Catégorie ajoutée.');return loadCats();
    }).catch(function(err){amsg('Échec : '+catErr(err),true)});
  });
  $('#acats').addEventListener('click',function(e){
    var ed=e.target.closest('[data-cedit]'),dl=e.target.closest('[data-cdel]');
    function find(id){return CATS.filter(function(c){return String(c.id)===id})[0]}
    if(ed){
      var id=ed.getAttribute('data-cedit'),c=find(id),n=prompt('Nouveau nom de la catégorie',c?c.name:'');
      if(n===null)return;n=n.trim();
      if(n.length<2){amsg('Nom de catégorie trop court.',true);return}
      authedFetch(REST+'categories?id=eq.'+enc(id),{method:'PATCH',headers:{'Content-Type':'application/json',Prefer:'return=minimal'},body:JSON.stringify({name:n})}).then(function(r){
        if(!r.ok)return restErr(r);amsg('Catégorie modifiée.');return loadCats();
      }).catch(function(err){amsg('Échec : '+catErr(err),true)});
    }else if(dl){
      var id2=dl.getAttribute('data-cdel'),c2=find(id2);
      if(!confirm('Supprimer la catégorie « '+(c2?c2.name:'')+' » ? Les vidéos qui l’utilisent resteront publiées, sans catégorie.'))return;
      dl.disabled=true;
      authedFetch(REST+'videos?category_id=eq.'+enc(id2),{method:'PATCH',headers:{'Content-Type':'application/json',Prefer:'return=minimal'},body:JSON.stringify({category_id:null})}).then(function(){
        return authedFetch(REST+'categories?id=eq.'+enc(id2),{method:'DELETE'});
      }).then(function(r){
        if(!r.ok)return restErr(r);
        if(FIL.cat===id2)FIL.cat='';
        amsg('Catégorie supprimée.');return loadCats().then(function(){loadVideos()});
      }).catch(function(err){dl.disabled=false;amsg('Échec : '+catErr(err),true)});
    }
  });
  function loadStats(){
    var box=$('#astats');box.innerHTML='<div class="sk" style="height:56px"></div>';kpiReset('…');
    return authedFetch(REST+'video_stats?select=*&order=created_at.desc').then(function(r){return r.ok?r.json():restErr(r)}).then(function(rows){
      ADMV={};renderKpis(rows);
      return authedFetch(REST+'videos?select=id,pinned').then(function(r){return r.ok?r.json():[]}).catch(function(){return []}).then(function(pr){var pm={};pr.forEach(function(x){pm[String(x.id)]=!!x.pinned});rows.forEach(function(r){r.pinned=!!pm[String(r.id)]});return rows});
    }).then(function(rows){
      if(!rows.length){box.innerHTML='<p class="hint">Aucune vidéo.</p>';return}
      var tv=0,ts=0,tr=0;
      box.innerHTML=rows.map(function(r){
        ADMV[r.id]=r;tv+=+r.views||0;ts+=+r.sales||0;tr+=+r.revenue_fc||0;
        return '<div class="arow'+(r.is_published?'':' off')+'"><div><b>'+esc(r.title)+(r.pinned?'<em class="pin-tag" style="font-style:normal">⚡ À la une</em>':'')+'</b><span>'+(r.price_fc>0?FC(r.price_fc):t('free'))+' · '+(+r.views||0)+' vues · '+(+r.sales||0)+' ventes · '+FC(+r.revenue_fc||0)+'</span></div>'+
          '<div class="kebab"><button class="kbtn" type="button" data-kebab aria-haspopup="menu" aria-expanded="false" aria-label="Options"><svg class="ic"><use href="#i-dots"/></svg></button>'+
          '<div class="kmenu" role="menu" hidden><button type="button" role="menuitem" data-edit="'+esc(r.id)+'">Modifier</button>'+
          '<button type="button" role="menuitem" class="pinact" data-pin="'+esc(r.id)+'" data-state="'+(r.pinned?'1':'0')+'">'+(r.pinned?'Désépingler':'⚡ Épingler en haut')+'</button>'+
          '<button type="button" role="menuitem" data-pub="'+esc(r.id)+'" data-state="'+(r.is_published?'1':'0')+'">'+(r.is_published?'Masquer':'Publier')+'</button>'+
          '<button type="button" role="menuitem" class="danger" data-del="'+esc(r.id)+'">Supprimer</button></div></div></div>';
      }).join('')+'<p class="hint">Total : '+tv+' vues · '+ts+' ventes · '+FC(tr)+'</p>';
    }).then(function(){var sel=$('#gvideo');if(sel)sel.innerHTML=Object.keys(ADMV).filter(function(k){return ADMV[k].price_fc>0}).map(function(k){return '<option value="'+esc(k)+'">'+esc(ADMV[k].title)+' · '+FC(ADMV[k].price_fc)+'</option>'}).join('')}).catch(function(err){kpiReset('—');box.innerHTML='<p class="hint bad">Statistiques indisponibles : '+esc(err.message)+'</p>'});
  }
  /* Efface les fichiers de la vidéo supprimée (au mieux : une erreur de stockage n'arrête rien) */
  function cleanFiles(v){
    var list=[];
    if(v.video_path)list.push(['videos-private',v.video_path]);
    [v.video_url,v.thumbnail_url].forEach(function(u){var m=u&&String(u).match(/\/storage\/v1\/object\/public\/videos\/(.+)$/);if(m)list.push(['videos',decodeURIComponent(m[1])])});
    return Promise.all(list.map(function(x){return authedFetch(SB_URL+'/storage/v1/object/'+x[0]+'/'+x[1].split('/').map(encodeURIComponent).join('/'),{method:'DELETE'}).catch(function(){})}));
  }
  $('#agrant').addEventListener('submit',function(e){
    e.preventDefault();var btn=$('#gsubmit');btn.disabled=true;amsg('Enregistrement…');
    authedFetch(REST+'rpc/grant_purchase',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({p_email:$('#gmail').value.trim(),p_video_id:$('#gvideo').value,p_reference:$('#gref').value.trim()||null})}).then(function(r){
      if(!r.ok)return restErr(r);
      $('#agrant').reset();amsg('Accès accordé : l’acheteur peut regarder la vidéo.');loadStats();
    }).catch(function(err){amsg('Échec : '+(err.noSession?t('admin_need'):err.message),true)}).then(function(){btn.disabled=false});
  });
  function stopEdit(){editId=null;$('#aadd').reset();resetMulti();showCoverPreview(null);$('#asubmit').textContent='Publier la vidéo';$('#acancel').hidden=true}
  function startEdit(id){
    amsg('Chargement…');
    authedFetch(REST+'videos?select=title,artist,description,price_fc,category_id,pinned&id=eq.'+enc(id)).then(function(r){if(r.status===400)return authedFetch(REST+'videos?select=title,artist,description,price_fc&id=eq.'+enc(id)).then(function(r2){return r2.ok?r2.json():restErr(r2)});return r.ok?r.json():restErr(r)}).then(function(rows){
      var v=rows[0];if(!v){amsg('Vidéo introuvable.',true);return}
      showAdminTab('catalog');resetMulti();editId=id;$('#atitle').value=v.title||'';$('#aartist').value=v.artist||'';$('#aprice').value=v.price_fc||0;$('#adesc').value=v.description||'';fillCatSelect();$('#acat').value=(v.category_id==null?'':String(v.category_id));$('#apin').checked=!!v.pinned;
      $('#afile').value='';$('#aurl').value='';$('#asubmit').textContent='Enregistrer les modifications';$('#acancel').hidden=false;
      amsg('Modification en cours. Laissez fichier et lien vides pour garder la vidéo actuelle.');
      try{$('#aadd').scrollIntoView({behavior:'smooth'})}catch(e){}
    }).catch(function(err){amsg('Échec : '+err.message,true)});
  }
  $('#acancel').addEventListener('click',function(){stopEdit();amsg('')});
  function closeKmenus(){Array.prototype.forEach.call(document.querySelectorAll('.kmenu'),function(m){m.hidden=true;var k=m.parentNode.querySelector('.kbtn');if(k)k.setAttribute('aria-expanded','false')})}
  document.addEventListener('click',function(e){if(!e.target.closest('.kebab'))closeKmenus()});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')closeKmenus()});
  $('#astats').addEventListener('click',function(e){
    var kb=e.target.closest('[data-kebab]');
    if(kb){var m=kb.parentNode.querySelector('.kmenu'),was=m.hidden;closeKmenus();m.hidden=!was;kb.setAttribute('aria-expanded',was?'true':'false');return}
    if(e.target.closest('.kmenu'))closeKmenus();
    var b=e.target.closest('[data-pub]'),ed=e.target.closest('[data-edit]'),dl=e.target.closest('[data-del]'),pn=e.target.closest('[data-pin]');
    if(pn){
      pn.disabled=true;
      setPin(pn.getAttribute('data-pin'),pn.getAttribute('data-state')!=='1').catch(function(err){pn.disabled=false;amsg('Échec : '+err.message,true)});
    }else if(b){
      var next=b.getAttribute('data-state')!=='1';b.disabled=true;
      authedFetch(REST+'videos?id=eq.'+enc(b.getAttribute('data-pub')),{method:'PATCH',headers:{'Content-Type':'application/json',Prefer:'return=minimal'},body:JSON.stringify({is_published:next})})
      .then(function(r){if(!r.ok)return restErr(r);loadStats();loadVideos()})
      .catch(function(err){b.disabled=false;amsg('Échec : '+err.message,true)});
    }else if(ed){startEdit(ed.getAttribute('data-edit'))}
    else if(dl){
      var id=dl.getAttribute('data-del'),row=ADMV[id];
      if(!confirm('Supprimer « '+(row?row.title:'cette vidéo')+' » définitivement ? Ses statistiques seront perdues.'))return;
      dl.disabled=true;
      authedFetch(REST+'videos?select=video_url,thumbnail_url,video_path&id=eq.'+enc(id)).then(function(r){return r.ok?r.json():[]}).then(function(rows){
        var v=rows[0]||{};
        return authedFetch(REST+'videos?id=eq.'+enc(id),{method:'DELETE'}).then(function(r){if(!r.ok)return restErr(r);return cleanFiles(v)});
      }).then(function(){if(editId===id)stopEdit();amsg('Vidéo supprimée, fichiers effacés.');loadStats();loadVideos()})
      .catch(function(err){dl.disabled=false;amsg('Échec : '+err.message,true)});
    }
  });
  /* ---------- Actions rapides du menu ⋮ des cartes ---------- */
  function closeCkMenus(){
    Array.prototype.forEach.call(document.querySelectorAll('.ckmenu'),function(m){
      m.hidden=true;var b=m.parentNode.querySelector('.ckbtn');if(b)b.setAttribute('aria-expanded','false');
      var c=m.closest('.card');if(c)c.classList.remove('menu-open');
    });
  }
  function refreshAdminLists(){var ap=$('#apanel');if(ap&&!ap.hidden)loadStats()}
  function quickErr(err){toast('Échec : '+(err.noSession?t('admin_need'):(err.network?t('e_net'):err.message)))}
  function quickHide(id){
    authedFetch(REST+'videos?id=eq.'+enc(id),{method:'PATCH',headers:{'Content-Type':'application/json',Prefer:'return=minimal'},body:JSON.stringify({is_published:false})})
    .then(function(r){if(!r.ok)return restErr(r);toast('Vidéo masquée du catalogue');loadVideos();refreshAdminLists()})
    .catch(quickErr);
  }
  /* Épingle ou désépingle une vidéo : elle passe tout en haut de l'accueil */
  function setPin(id,next){
    return authedFetch(REST+'videos?id=eq.'+enc(id),{method:'PATCH',headers:{'Content-Type':'application/json',Prefer:'return=minimal'},body:JSON.stringify({pinned:next})})
    .then(function(r){if(r.status===400)throw new Error('Colonne « pinned » absente : lancez le script SQL.');if(!r.ok)return restErr(r);loadVideos();refreshAdminLists()});
  }
  function quickPin(id){
    var v=byId[id];if(!v)return;var next=!v.pin;
    setPin(id,next).then(function(){toast(next?'Vidéo épinglée en haut':'Vidéo désépinglée')}).catch(quickErr);
  }
  function quickDelete(id){
    var v=byId[id];if(!v)return;
    if(!confirm('Supprimer « '+v.t+' » définitivement ? Ses statistiques seront perdues.'))return;
    authedFetch(REST+'videos?select=video_url,thumbnail_url,video_path&id=eq.'+enc(id)).then(function(r){return r.ok?r.json():[]}).then(function(rows){
      var row=rows[0]||{};
      return authedFetch(REST+'videos?id=eq.'+enc(id),{method:'DELETE'}).then(function(r){if(!r.ok)return restErr(r);return cleanFiles(row)});
    }).then(function(){
      if(editId===id)stopEdit();
      if(ST.favs[id]){delete ST.favs[id];saveState()}
      toast('Vidéo supprimée, fichiers effacés');loadVideos();refreshAdminLists();
    }).catch(quickErr);
  }
  var qeId=null,qePicker=null,qeOld='';
  function qeClean(){
    if(qePicker){qePicker.destroy();qePicker=null}
    var h=$('#qeframe');if(h){h.innerHTML='';h.hidden=true}
    var c=$('#qecur');if(c){c.innerHTML='';c.hidden=true}
  }
  function closeQE(){qeClean();closeModal('#qedit')}
  /* Mini-lecteur de la vidéo existante : lien public direct, ou lien signé d'une heure pour une vidéo VIP (fichier privé) */
  function qeFrame(id,v){
    var cur=$('#qecur'),host=$('#qeframe');
    if(v.thumbnail_url){cur.innerHTML='<img alt="Miniature actuelle" src="'+esc(v.thumbnail_url)+'"><span>Miniature actuelle</span>';cur.hidden=false}
    else{cur.innerHTML='';cur.hidden=true}
    host.hidden=false;host.innerHTML='<p class="fp-info">Chargement de la vidéo…</p>';
    function fail(){
      if(qeId!==id)return;
      if(qePicker){qePicker.destroy();qePicker=null}
      host.innerHTML='<p class="fp-info">Aperçu indisponible pour cette vidéo (lien externe ou fichier protégé). Le reste reste modifiable.</p>';
    }
    function go(src){if(qeId!==id)return;qePicker=FramePicker(host,{src:src,compact:true,onError:fail})}
    if(v.video_path){
      authedFetch(SB_URL+'/storage/v1/object/sign/videos-private/'+v.video_path.split('/').map(encodeURIComponent).join('/'),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({expiresIn:3600})})
      .then(function(r){return r.ok?r.json():restErr(r)}).then(function(j){go(SB_URL+'/storage/v1'+j.signedURL)}).catch(fail);
    }else if(v.video_url)go(v.video_url);
    else fail();
  }
  function qeMsg(x,bad){var el=$('#qemsg');el.textContent=x||'';el.className='hint'+(x&&bad?' bad':'')}
  function openQuickEdit(id){
    qeId=id;qeClean();qeOld='';$('#qeform').reset();
    $('#qecat').innerHTML='<option value="">Aucune</option>'+CATS.map(function(c){return '<option value="'+esc(c.id)+'">'+esc(c.name)+'</option>'}).join('');
    qeMsg('Chargement…');openModal('#qedit');
    function ok(r){return r.ok?r.json():restErr(r)}
    authedFetch(REST+'videos?select=title,artist,description,price_fc,category_id,pinned,video_url,video_path,thumbnail_url&id=eq.'+enc(id)).then(function(r){
      return r.status===400?authedFetch(REST+'videos?select=title,artist,description,price_fc,video_url,video_path,thumbnail_url&id=eq.'+enc(id)).then(ok):ok(r);
    }).then(function(rows){
      if(qeId!==id)return;
      var v=rows[0];if(!v){qeMsg('Vidéo introuvable.',true);return}
      $('#qetitleinp').value=v.title||'';$('#qeartist').value=v.artist||'';$('#qeprice').value=v.price_fc||0;$('#qedesc').value=v.description||'';
      $('#qecat').value=(v.category_id==null?'':String(v.category_id));$('#qepin').checked=!!v.pinned;qeMsg('');qeOld=v.thumbnail_url||'';qeFrame(id,v);
    }).catch(function(err){qeMsg('Échec : '+(err.noSession?t('admin_need'):err.message),true)});
  }
  document.addEventListener('click',function(e){
    var kb=e.target.closest('[data-ckebab]');
    if(kb){
      var m=kb.parentNode.querySelector('.ckmenu'),was=m.hidden;closeCkMenus();
      m.hidden=!was;kb.setAttribute('aria-expanded',was?'true':'false');
      var cd=kb.closest('.card');if(cd)cd.classList.toggle('menu-open',was);
      return;
    }
    var ac=e.target.closest('[data-cact]');
    if(ac){
      var id=ac.getAttribute('data-cid'),act=ac.getAttribute('data-cact');closeCkMenus();
      if(act==='edit')openQuickEdit(id);else if(act==='pin')quickPin(id);else if(act==='hide')quickHide(id);else if(act==='del')quickDelete(id);
      return;
    }
    if(!e.target.closest('.ckebab'))closeCkMenus();
  });
  document.addEventListener('keydown',function(e){
    if(e.key!=='Escape')return;
    closeCkMenus();
    if(!$('#qedit').hidden)closeQE();
  });
  $('#qeclose').addEventListener('click',closeQE);
  $('#qecancel').addEventListener('click',closeQE);
  $('#qedit').addEventListener('click',function(e){if(e.target===this)closeQE()});
  $('#qeform').addEventListener('submit',function(e){
    e.preventDefault();var id=qeId;if(!id)return;
    var title=$('#qetitleinp').value.trim(),price=parseInt($('#qeprice').value,10);
    if(title.length<2){qeMsg('Titre trop court.',true);return}
    if(!(price>=0)){qeMsg('Prix invalide.',true);return}
    var body={title:title,artist:$('#qeartist').value.trim()||null,description:$('#qedesc').value.trim()||null,price_fc:price};
    if($('#qecat').value||CATS.length)body.category_id=$('#qecat').value||null;
    if($('#qepin').checked||PINOK)body.pinned=$('#qepin').checked;
    var btn=$('#qesave'),newThumb=null,oldThumb=qeOld,saved=false;btn.disabled=true;qeMsg('Enregistrement…');
    /* frame choisie : capture -> envoi dans le bucket -> thumbnail_url mis à jour avec le titre, le prix, etc. */
    var pick=qePicker&&qePicker.touched()?qePicker.capture():Promise.resolve(null);
    pick.then(function(blob){
      if(!blob)return;
      qeMsg('Envoi de la miniature…');
      return uploadFile(blob,'cover.'+(blob.type==='image/webp'?'webp':'jpg')).then(function(u){newThumb=u;body.thumbnail_url=u});
    }).then(function(){
      qeMsg('Enregistrement…');
      return authedFetch(REST+'videos?id=eq.'+enc(id),{method:'PATCH',headers:{'Content-Type':'application/json',Prefer:'return=minimal'},body:JSON.stringify(body)});
    }).then(function(r){
      if(!r.ok)return restErr(r);
      saved=true;
      closeQE();toast('Modifications enregistrées');loadVideos();refreshAdminLists();
      if(newThumb&&oldThumb)cleanFiles({thumbnail_url:oldThumb}); /* ancienne image effacée du bucket (au mieux) */
    }).catch(function(err){
      if(newThumb&&!saved)cleanFiles({thumbnail_url:newThumb}); /* fiche refusée : pas d'image orpheline */
      qeMsg('Échec : '+(err.noSession?t('admin_need'):(err.network?t('e_net'):err.message)),true);
    }).then(function(){btn.disabled=false});
  });
  /* VIP : le fichier est privé, aucune image ne peut en être extraite côté visiteur. La vignette calculée ici part dans le bucket public Supabase.
     Au mieux : en cas d'échec la carte reste simplement noire. */
  function upThumb(info,priv){
    if(!(priv||(info&&info.custom))||!info||!info.blob)return Promise.resolve(null);
    return uploadFile(info.blob,'cover.'+(info.blob.type==='image/webp'?'webp':'jpg')).catch(function(){return null});
  }
  function uploadFile(file,fname,bucket){
    bucket=bucket||BUCKET;
    var name=Date.now()+'-'+(fname||file.name).normalize('NFD').replace(/[^\w.\-]+/g,'_');
    return authedFetch(SB_URL+'/storage/v1/object/'+enc(bucket)+'/'+enc(name),{method:'POST',headers:{'Content-Type':file.type||'video/mp4','x-upsert':'false'},body:file})
    .then(function(r){return r.ok?(bucket===BUCKET?SB_URL+'/storage/v1/object/public/'+enc(bucket)+'/'+enc(name):name):restErr(r)});
  }
  /* ---------- Sélecteur de frame (façon TikTok / Facebook) ----------
     Mini-lecteur muet + curseur à l'image près (30 i/s), utilisé par #aadd (1 fichier), #amulti (une ligne par fichier) et #qedit (vidéo déjà publiée).
     La frame choisie est capturée dans un <canvas> ; l'image part dans le bucket Supabase et son lien va dans videos.thumbnail_url.
     Ce lecteur n'existe que dans l'espace admin : aucune balise <video> n'est ajoutée au catalogue. */
  var FPS=30;
  function fmtT(s){s=Math.max(0,s||0);var m=Math.floor(s/60),x=Math.floor(s%60),d=Math.floor(s*10)%10;return m+':'+(x<10?'0':'')+x+','+d}
  function FramePicker(host,o){
    var self={},v=document.createElement('video'),blobUrl=null,dur=0,frames=0,tgt=0,seeking=false,want=null,touched=false,dead=false,guard=0;
    var root=document.createElement('div');
    root.className='fp'+(o.compact?' compact':'');
    root.innerHTML='<div class="fp-stage"></div><div class="fp-bar"><button type="button" class="fp-btn" data-step="-1" aria-label="Image précédente">‹</button><input class="fp-range" type="range" min="0" max="1" step="1" value="0" disabled aria-label="Choisir l’image de la miniature"><button type="button" class="fp-btn" data-step="1" aria-label="Image suivante">›</button></div>'+
      (o.compact?'':'<div class="fp-chips">'+[10,30,50,70,90].map(function(p){return '<button type="button" class="fp-btn fp-chip" data-p="'+p+'">'+p+' %</button>'}).join('')+'</div>')+
      '<div class="fp-info" aria-live="polite">Chargement de la vidéo…</div>';
    host.innerHTML='';host.appendChild(root);
    var rg=root.querySelector('.fp-range'),info=root.querySelector('.fp-info');
    root.querySelector('.fp-stage').appendChild(v);
    v.muted=true;v.playsInline=true;v.setAttribute('playsinline','');v.setAttribute('webkit-playsinline','');v.preload='metadata';v.controls=false;
    if(o.file){blobUrl=URL.createObjectURL(o.file);v.src=blobUrl}
    else{v.crossOrigin='anonymous';v.src=o.src}  /* crossOrigin avant src : sinon le canvas serait « taché » et la capture refusée */
    function label(){info.textContent=touched?'Miniature choisie : '+fmtT(tgt)+' sur '+fmtT(dur):'Image automatique. Bougez le curseur pour choisir la miniature.'}
    function fail(){if(dead)return;rg.disabled=true;touched=false;info.textContent='Aperçu impossible pour cette vidéo.';if(o.onError)o.onError()}
    /* un seul déplacement à la fois : on garde seulement la dernière position demandée pendant qu'un seek est en cours */
    function seek(t){
      if(seeking){want=t;return}
      seeking=true;want=null;
      clearTimeout(guard);guard=setTimeout(function(){if(!seeking)return;seeking=false;if(want!==null){var w=want;want=null;seek(w)}},3000);
      try{v.currentTime=t}catch(e){seeking=false}
    }
    v.addEventListener('seeked',function(){
      if(dead)return;
      seeking=false;clearTimeout(guard);
      if(want!==null){var w=want;want=null;seek(w)}
    });
    function go(f,user){
      if(!frames)return;
      f=Math.max(0,Math.min(frames,Math.round(f)));
      rg.value=f;tgt=Math.min(f/FPS,Math.max(0,dur-.1));
      if(user)touched=true;
      label();seek(tgt);
    }
    v.addEventListener('loadedmetadata',function(){
      if(dead)return;
      dur=v.duration;
      if(!isFinite(dur)||dur<=0){fail();return}
      frames=Math.max(1,Math.floor(dur*FPS));rg.max=frames;rg.disabled=false;
      go((o.time!=null?o.time:Math.min(1,Math.max(.1,dur/2)))*FPS,false); /* départ à ~1 s, comme l'extraction automatique */
    });
    v.addEventListener('error',fail);
    rg.addEventListener('input',function(){go(+rg.value,true)});
    root.addEventListener('click',function(e){
      var b=e.target.closest('button');if(!b||!frames)return;
      if(b.hasAttribute('data-step'))go(+rg.value+(+b.getAttribute('data-step')),true);
      else if(b.hasAttribute('data-p'))go(frames*(+b.getAttribute('data-p'))/100,true);
    });
    function settled(){
      return new Promise(function(res){
        if(!seeking&&want===null){res();return}
        var tm=setTimeout(function(){v.removeEventListener('seeked',h);res()},4000);
        function h(){if(!seeking&&want===null){clearTimeout(tm);v.removeEventListener('seeked',h);res()}}
        v.addEventListener('seeked',h);
      });
    }
    self.touched=function(){return touched};
    self.time=function(){return tgt};
    /* Capture la frame affichée : Blob WebP (repli JPEG pour Safari). Rejette si le canvas est refusé (vidéo externe sans CORS). */
    self.capture=function(){
      return settled().then(function(){
        return new Promise(function(res,rej){
          if(!v.videoWidth){rej(new Error('Capture impossible : vidéo non chargée.'));return}
          try{
            var w=Math.min(640,v.videoWidth),c=document.createElement('canvas');
            c.width=w;c.height=Math.round(w*v.videoHeight/v.videoWidth);
            c.getContext('2d').drawImage(v,0,0,c.width,c.height);
            c.toBlob(function(b){
              if(b&&b.type==='image/webp'){res(b);return}
              c.toBlob(function(j){(j||b)?res(j||b):rej(new Error('Capture impossible.'))},'image/jpeg',.8);
            },'image/webp',.8);
          }catch(e){rej(new Error('Capture refusée : la vidéo vient d’un autre site sans autorisation CORS.'))}
        });
      });
    };
    self.destroy=function(){
      dead=true;clearTimeout(guard);
      try{v.pause();v.removeAttribute('src');v.load()}catch(e){}
      if(blobUrl){try{URL.revokeObjectURL(blobUrl)}catch(e){}blobUrl=null}
      host.innerHTML='';
    };
    return self;
  }
  /* Image finale d'une vidéo : la frame choisie si l'admin a bougé le curseur (ou une frame déjà validée), sinon la couverture automatique */
  function coverWith(file,picker,saved){
    return getCover(file).then(function(info){
      var p=picker&&picker.touched()?picker.capture().catch(function(){return null}):Promise.resolve(null);
      return p.then(function(blob){
        blob=blob||saved;
        return blob?{dur:info.dur,blob:blob,custom:true}:info;
      });
    });
  }
  /* Couverture automatique : image figée de la vidéo choisie + durée, calculées dans le navigateur */
  function probeVideo(file){
    return new Promise(function(res){
      var v=document.createElement('video'),u=URL.createObjectURL(file),done=false;
      function fin(o){if(done)return;done=true;try{URL.revokeObjectURL(u)}catch(e){}res(o||{})}
      v.muted=true;v.playsInline=true;v.setAttribute('webkit-playsinline','');v.preload='metadata';v.onerror=function(){fin()};setTimeout(function(){fin()},12000);
      v.onloadedmetadata=function(){
        var d=isFinite(v.duration)?Math.round(v.duration):0;
        v.onseeked=function(){
          try{
            var w=Math.min(480,v.videoWidth||480),c=document.createElement('canvas');
            c.width=w;c.height=Math.round(w*(v.videoHeight||360)/(v.videoWidth||640));
            c.getContext('2d').drawImage(v,0,0,c.width,c.height);
            c.toBlob(function(b){if(b&&b.type==='image/webp'){fin({dur:d,blob:b});return}c.toBlob(function(j){fin({dur:d,blob:j||b})},'image/jpeg',.7)},'image/webp',.65); /* Safari ne sait pas encoder le WebP : repli JPEG */
          }catch(e){fin({dur:d})}
        };
        try{v.currentTime=Math.min(1,Math.max(.1,d/2))}catch(e){fin({dur:d})} /* image à ~1 seconde */
      };
      v.src=u;
    });
  }
  /* ---------- Miniatures : aperçu local uniquement (aucun hébergement d'image) ----------
     À la sélection du fichier : durée + image à ~1 s, calculées dans le navigateur.
     Sans choix de l'admin rien n'est envoyé (thumbnail_url vide : le catalogue extrait l'image). Si l'admin choisit une frame, elle est envoyée et enregistrée dans thumbnail_url. */
  var COVERS=typeof WeakMap!=='undefined'?new WeakMap():null;
  function prepCover(file){
    var c=COVERS&&COVERS.get(file);if(c)return c;
    c=probeVideo(file);
    if(COVERS)COVERS.set(file,c);return c;
  }
  function getCover(file){return prepCover(file)}
  var singlePicker=null;
  function showCoverPreview(file){
    var box=$('#athumb');if(!box)return;
    if(singlePicker){singlePicker.destroy();singlePicker=null}
    if(!file){box.hidden=true;box.innerHTML='';return}
    box.hidden=false;
    singlePicker=FramePicker(box,{file:file});
  }
  /* ---------- Envoi de plusieurs vidéos à la fois ----------
     Chaque fichier a son titre et son prix. Envoi un par un : analyse (couverture + durée), fichier,
     puis fiche dans la table. Un échec n'arrête pas les autres ; un nouveau clic ne renvoie que les échecs. */
  var multi=[];
  function baseTitle(n){return n.replace(/\.[^.]+$/,'').replace(/^\d{8,}-/,'').replace(/[_\-]+/g,' ').replace(/\s+/g,' ').trim()}
  function sizeMb(f){return (f.size/1048576).toFixed(1)+' Mo'}
  function resetMulti(){
    multi.forEach(function(m){if(m.picker){m.picker.destroy();m.picker=null}});
    multi=[];var box=$('#amulti');if(box){box.hidden=true;box.innerHTML=''}
    $('#atitle').required=true;
    $('#asubmit').textContent='Publier la vidéo';
  }
  function renderMulti(){
    var box=$('#amulti'),price=$('#aprice').value||'0';
    box.innerHTML='<p class="mhead">'+multi.length+' vidéos : titre et prix pour chacune. L’artiste et la description ci-dessus sont communs. Prix 0 = gratuite, sinon la vidéo part dans le stockage privé.</p>'+
      multi.map(function(m,i){return '<div class="mrow" data-i="'+i+'" data-state="wait"><input class="field mt" type="text" maxlength="120" aria-label="Titre" value="'+esc(m.title)+'"><input class="field mp" type="number" inputmode="numeric" min="0" step="100" aria-label="Prix en FC" value="'+esc(price)+'"><div class="mcov"><img class="mimg" alt="Miniature" hidden><button type="button" class="fp-btn mpick">Choisir la miniature</button></div><div class="mfp" hidden></div><small>'+esc(m.file.name)+' · '+sizeMb(m.file)+'</small><span class="mst">En attente</span></div>'}).join('');
    box.hidden=false;
  }
  $('#afile').addEventListener('change',function(){
    var fs=Array.prototype.slice.call(this.files||[]);
    showCoverPreview(fs.length===1?fs[0]:null);
    if(editId||fs.length<2){resetMulti();return}
    multi=fs.map(function(f){return {file:f,title:baseTitle(f.name)}});
    $('#atitle').required=false;
    $('#asubmit').textContent='Publier '+fs.length+' vidéos';
    renderMulti();
    /* plusieurs fichiers : miniatures préparées une par une en arrière-plan */
    fs.reduce(function(p,f){return p.then(function(){return prepCover(f)}).then(function(info){paintRowCover(f,info)})},Promise.resolve());
  });
  $('#aprice').addEventListener('input',function(){
    if(!multi.length)return;
    Array.prototype.forEach.call(document.querySelectorAll('#amulti .mrow:not([data-state=ok]) .mp'),function(i){i.value=$('#aprice').value});
  });
  function paintRowCover(f,info){
    if(!info||!info.blob)return;
    multi.forEach(function(m,i){
      if(m.file!==f||m.custom)return;
      var im=document.querySelector('#amulti .mrow[data-i="'+i+'"] .mimg');
      if(im){im.src=URL.createObjectURL(info.blob);im.hidden=false}
    });
  }
  function closeRowPicker(row,m){
    var b=row.querySelector('.mpick'),host=row.querySelector('.mfp'),im=row.querySelector('.mimg'),pk=m.picker;
    var p=pk&&pk.touched()?pk.capture().then(function(blob){if(blob){m.custom=blob;m.time=pk.time();im.src=URL.createObjectURL(blob);im.hidden=false}}).catch(function(err){amsg('Miniature : '+err.message,true)}):Promise.resolve();
    p.then(function(){
      if(m.picker){m.picker.destroy();m.picker=null}
      host.hidden=true;b.textContent=m.custom?'Changer la miniature':'Choisir la miniature';
    });
  }
  $('#amulti').addEventListener('click',function(e){
    var b=e.target.closest('.mpick');if(!b)return;
    var row=b.closest('.mrow'),m=multi[+row.getAttribute('data-i')];
    if(!m||row.getAttribute('data-state')==='ok'||row.getAttribute('data-state')==='busy')return;
    if(m.picker){closeRowPicker(row,m);return}
    var host=row.querySelector('.mfp');host.hidden=false;b.textContent='Valider la miniature';
    m.picker=FramePicker(host,{file:m.file,compact:true,time:m.time});
  });
  function markRow(row,state,txt){row.setAttribute('data-state',state);row.querySelector('.mst').textContent=txt}
  function uploadOne(row){
    var m=multi[+row.getAttribute('data-i')],title=row.querySelector('.mt').value.trim(),price=parseInt(row.querySelector('.mp').value,10);
    if(title.length<2)return Promise.reject(new Error('Titre trop court'));
    if(!(price>=0))return Promise.reject(new Error('Prix invalide'));
    var priv=price>0,up={};
    markRow(row,'busy','Miniature…');
    return coverWith(m.file,m.picker,m.custom).then(function(info){
      markRow(row,'busy','Envoi du fichier…');
      return (priv?uploadFile(m.file,null,'videos-private'):uploadFile(m.file)).then(function(u){
        if(priv)up.video_path=u;else up.video_url=u;
        return upThumb(info,priv).then(function(tu){
        up.thumb=tu;markRow(row,'busy','Enregistrement…');
        var body={title:title,artist:$('#aartist').value.trim()||null,description:$('#adesc').value.trim()||null,price_fc:price,is_published:true};
        if(priv)body.video_path=up.video_path;else body.video_url=up.video_url;
        if($('#acat').value||CATS.length)body.category_id=$('#acat').value||null;
        if($('#apin').checked||PINOK)body.pinned=$('#apin').checked;
        if(info.dur)body.duration_seconds=info.dur;
        if(tu)body.thumbnail_url=tu;
        return authedFetch(REST+'videos',{method:'POST',headers:{'Content-Type':'application/json',Prefer:'return=minimal'},body:JSON.stringify(body)}).then(function(r){if(!r.ok)return restErr(r)});
        });
      });
    }).then(function(){
      markRow(row,'ok','Publiée'+(priv?' (protégée)':''));
      Array.prototype.forEach.call(row.querySelectorAll('input,button'),function(i){i.disabled=true});
      if(m.picker){m.picker.destroy();m.picker=null;row.querySelector('.mfp').hidden=true}
    },function(err){
      /* fichier déjà envoyé mais fiche refusée : on efface les fichiers pour ne pas laisser d'orphelins */
      return cleanFiles({video_path:up.video_path,video_url:up.video_url,thumbnail_url:up.thumb}).then(function(){throw err});
    });
  }
  function runBatch(){
    var rows=Array.prototype.slice.call(document.querySelectorAll('#amulti .mrow')).filter(function(r){return r.getAttribute('data-state')!=='ok'});
    if(!rows.length)return;
    var btn=$('#asubmit'),okN=0,failN=0;btn.disabled=true;amsg('Envoi de '+rows.length+' vidéo(s), un fichier après l’autre. Gardez cette page ouverte.');
    rows.reduce(function(p,row){
      return p.then(function(){return uploadOne(row)}).then(function(){okN++},function(err){failN++;markRow(row,'err','Échec : '+(err.noSession?t('admin_need'):err.message))});
    },Promise.resolve()).then(function(){
      loadStats();loadVideos();
      if(!failN){$('#aadd').reset();resetMulti();amsg(okN+' vidéo(s) publiée(s).')}
      else amsg(okN+' publiée(s), '+failN+' en échec. Corrigez si besoin puis cliquez à nouveau : seules les vidéos en échec sont renvoyées.',true);
    }).then(function(){btn.disabled=false});
  }
  $('#aadd').addEventListener('submit',function(e){
    e.preventDefault();
    if(multi.length>1&&!editId){runBatch();return}
    var file=$('#afile').files[0],link=$('#aurl').value.trim(),price=parseInt($('#aprice').value,10),eid=editId;
    if(!eid&&!file&&!/^https:\/\//.test(link)){amsg('Choisissez un fichier vidéo ou collez un lien https.',true);return}
    if(link&&!file&&!/^https:\/\//.test(link)){amsg('Le lien doit commencer par https://',true);return}
    if(!(price>=0)){amsg('Prix invalide.',true);return}
    var btn=$('#asubmit');btn.disabled=true;amsg(file?'Analyse puis envoi du fichier, patientez…':'Enregistrement…');
    var priv=!!file&&price>0;
    var media=file?coverWith(file,singlePicker,null).then(function(info){
      return (priv?uploadFile(file,null,'videos-private'):uploadFile(file)).then(function(u){
        return upThumb(info,priv).then(function(tu){
          return priv?{path:u,thumb:tu,dur:info.dur||null}:{url:u,thumb:tu,dur:info.dur||null};
        });
      });
    }):Promise.resolve(link?{url:link}:null);
    media.then(function(m){
      var body={title:$('#atitle').value.trim(),artist:$('#aartist').value.trim()||null,description:$('#adesc').value.trim()||null,price_fc:price};
      if(m){body.video_url=m.url||null;if(m.path||eid)body.video_path=m.path||null;if(file)body.thumbnail_url=m.thumb||null;if(m.dur)body.duration_seconds=m.dur}
      if($('#acat').value||CATS.length)body.category_id=$('#acat').value||null;
        if($('#apin').checked||PINOK)body.pinned=$('#apin').checked;
      if(!eid)body.is_published=true;
      return authedFetch(REST+'videos'+(eid?'?id=eq.'+enc(eid):''),{method:eid?'PATCH':'POST',headers:{'Content-Type':'application/json',Prefer:'return=minimal'},body:JSON.stringify(body)});
    }).then(function(r){
      if(!r.ok)return restErr(r);
      stopEdit();amsg((eid?'Modifications enregistrées.':'Vidéo publiée.')+(price>0&&!priv?' Attention : sans fichier envoyé (lien https), la vidéo payante n’est pas protégée.':''));loadStats();loadVideos();
    }).catch(function(err){amsg('Échec : '+(err.noSession?t('admin_need'):err.message),true)}).then(function(){btn.disabled=false});
  });


  /* ---------- Upload 1 clic : navigateur → Worker Cloudflare → R2 (cdn.topleaks.online) → table videos ---------- */
  var R2_WORKER='https://floral-disk-8bf2.dadjuJunior42.workers.dev',R2_CDN='https://pub-e3f10db5a5ee4cbea0471157bd183fbf.r2.dev',r2xhr=null,r2body=null;
  /* sans accents, sans espaces ; préfixe horodaté pour qu'un PUT n'écrase jamais un fichier déjà en ligne */
  function cleanName(n){
    var dot=n.lastIndexOf('.'),ext=dot>0?n.slice(dot+1):'',base=dot>0?n.slice(0,dot):n;
    base=base.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^A-Za-z0-9_-]+/g,'_').replace(/^_+|_+$/g,'').slice(0,80)||'video';
    ext=ext.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^A-Za-z0-9]/g,'').toLowerCase()||'mp4';
    return Date.now()+'-'+base+'.'+ext;
  }
  function mb(n){return (n/1048576).toFixed(n>=10485760?0:1).replace('.',',')+' Mo'}
  function r2ui(state,st,pct,sub){
    var pr=$('#r2prog');pr.hidden=false;pr.setAttribute('data-state',state);
    $('#r2st').textContent=st;
    if(pct!=null){$('#r2pct').textContent=pct+' %';$('#r2bar').style.width=pct+'%';pr.querySelector('.r2-bar').setAttribute('aria-valuenow',pct)}
    $('#r2sub').textContent=sub||'';
    var busy=state==='up'||state==='save';
    $('#r2go').disabled=busy;$('#r2cancel').hidden=state!=='up';$('#r2retry').hidden=state!=='retry';
    window.onbeforeunload=busy?function(e){e.preventDefault();e.returnValue='';return ''}:null;
  }
  function r2put(file,name,cb){
    return new Promise(function(res,rej){
      var x=new XMLHttpRequest();r2xhr=x;
      x.open('PUT',R2_WORKER+'/'+encodeURIComponent(name));
      x.setRequestHeader('Content-Type',file.type||'video/mp4');
      x.upload.onprogress=function(e){if(e.lengthComputable)cb(e.loaded,e.total)};
      x.onload=function(){r2xhr=null;if(x.status>=200&&x.status<300)res();else rej(new Error('Le Worker a répondu HTTP '+x.status+(x.responseText?' : '+x.responseText.slice(0,120):'')))};
      x.onerror=function(){r2xhr=null;rej(new Error('Envoi impossible (réseau ou CORS : le Worker doit autoriser PUT et Content-Type depuis ce site)'))};
      x.onabort=function(){r2xhr=null;var e=new Error('Envoi annulé');e.aborted=true;rej(e)};
      x.send(file);
    });
  }
  function r2save(body){
    r2ui('save','Enregistrement dans le catalogue…',100,body.video_url);
    return authedFetch(REST+'videos',{method:'POST',headers:{'Content-Type':'application/json',Prefer:'return=minimal'},body:JSON.stringify(body)}).then(function(r){
      if(!r.ok)return restErr(r);
      r2body=null;
      r2ui('ok','Vidéo publiée',100,body.video_url+(body.price_fc>0?' · Attention : le lien CDN est public, la vidéo payante n’est pas protégée.':''));
      $('#r2form').reset();loadStats();loadVideos();
    }).catch(function(err){
      r2body=body;
      r2ui('retry','Fichier envoyé, enregistrement refusé',100,(err.noSession?t('admin_need'):err.message)+' · Le fichier est déjà sur le CDN : cliquez sur « Réessayer ».');
      $('#r2prog').setAttribute('data-state','err');
    });
  }
  $('#r2form').addEventListener('submit',function(e){
    e.preventDefault();
    if(($('#r2file').files||[]).length>1){r2batch();return}
    var file=$('#r2file').files[0],title=$('#r2title').value.trim(),price=parseInt($('#r2price').value,10);
    if(!file){r2ui('err','Choisissez un fichier vidéo',0,'');return}
    if(title.length<2){r2ui('err','Titre trop court (2 caractères minimum)',0,'');return}
    if(!(price>=0)){r2ui('err','Prix invalide',0,'');return}
    var name=cleanName(file.name),url=R2_CDN+'/'+encodeURIComponent(name),t0=Date.now();
    r2body=null;r2ui('up','Préparation…',0,name);
    getCover(file).catch(function(){return null}).then(function(info){
      r2ui('up','Envoi vers le CDN…',0,name);
      return r2put(file,name,function(l,tt){
        var pct=Math.min(100,Math.floor(l/tt*100)),sp=l/Math.max(1,(Date.now()-t0)/1000);
        r2ui('up','Envoi vers le CDN…',pct,mb(l)+' / '+mb(tt)+' · '+mb(sp)+'/s');
      }).then(function(){
        return (info&&info.blob?upThumb(info,true):Promise.resolve(null)).then(function(tu){
          var body={title:title,artist:$('#r2artist').value.trim()||null,description:$('#r2desc').value.trim()||null,price_fc:price,video_url:url,is_published:true};
          if($('#rcat').value||CATS.length)body.category_id=$('#rcat').value||null;
          if($('#r2pin').checked||PINOK)body.pinned=$('#r2pin').checked;
          if(info&&info.dur)body.duration_seconds=info.dur;
          if(tu)body.thumbnail_url=tu;
          return r2save(body);
        });
      });
    }).catch(function(err){r2ui('err',err.aborted?'Envoi annulé':'Échec de l’envoi',err.aborted?0:null,err.aborted?'':err.message)});
  });
  $('#r2cancel').addEventListener('click',function(){if(r2xhr)r2xhr.abort()});
  $('#r2retry').addEventListener('click',function(){if(r2body)r2save(r2body)});

  /* ===== ENVOI MULTIPLE R2 AVEC MINIATURES (v2) ===== */
  var r2files=[],r2halt=false;
  function r2paint(f,info){
    if(!info||!info.blob)return;
    r2files.forEach(function(m,i){
      if(m.file!==f||m.custom)return;
      var im=document.querySelector('#r2list .mrow[data-i="'+i+'"] .mimg');
      if(im){im.src=URL.createObjectURL(info.blob);im.hidden=false}
    });
  }
  function r2reset(){
    r2files.forEach(function(m){if(m&&m.picker){m.picker.destroy();m.picker=null}});
    r2files=[];var box=$('#r2list');box.hidden=true;box.innerHTML='';$('#r2go').textContent='Envoyer et publier';
  }
  $('#r2file').addEventListener('change',function(){
    var fs=Array.prototype.slice.call(this.files||[]);
    r2reset();
    if(fs.length<2)return;
    r2files=fs.map(function(f){return {file:f,title:baseTitle(f.name)}});
    var price=$('#r2price').value||'0',box=$('#r2list');
    box.hidden=false;
    box.innerHTML='<p class="mhead">'+fs.length+' vidéos : titre, prix et miniature pour chacune. L’artiste, la catégorie, la description et l’épinglage du formulaire sont communs.</p>'+
      r2files.map(function(m,i){return '<div class="mrow" data-i="'+i+'" data-state="wait"><input class="field mt" type="text" maxlength="120" aria-label="Titre" value="'+esc(m.title)+'"><input class="field mp" type="number" inputmode="numeric" min="0" step="100" aria-label="Prix en FC" value="'+esc(price)+'"><div class="mcov"><img class="mimg" alt="Miniature" hidden><button type="button" class="fp-btn mpick">Choisir la miniature</button></div><div class="mfp" hidden></div><small>'+esc(m.file.name)+' · '+sizeMb(m.file)+'</small><span class="mst">En attente</span></div>'}).join('');
    $('#r2go').textContent='Envoyer et publier '+fs.length+' vidéos';
    fs.reduce(function(p,f){return p.then(function(){return prepCover(f)}).then(function(info){r2paint(f,info)})},Promise.resolve());
  });
  $('#r2price').addEventListener('input',function(){
    if(!r2files.length)return;
    Array.prototype.forEach.call(document.querySelectorAll('#r2list .mrow:not([data-state=ok]) .mp'),function(i){i.value=$('#r2price').value});
  });
  $('#r2list').addEventListener('click',function(e){
    var b=e.target.closest('.mpick');if(!b)return;
    var row=b.closest('.mrow'),m=r2files[+row.getAttribute('data-i')];
    if(!m||row.getAttribute('data-state')==='ok'||row.getAttribute('data-state')==='busy')return;
    if(m.picker){closeRowPicker(row,m);return}
    var host=row.querySelector('.mfp');host.hidden=false;b.textContent='Valider la miniature';
    m.picker=FramePicker(host,{file:m.file,compact:true,time:m.time});
  });
  /* « Annuler l'envoi » arrête la vidéo en cours ET tout le reste du lot */
  $('#r2cancel').addEventListener('click',function(){r2halt=true});
  function r2batch(){
    var rows=Array.prototype.slice.call(document.querySelectorAll('#r2list .mrow')).filter(function(r){return r.getAttribute('data-state')!=='ok'});
    var okN=0,failN=0,vipN=0,total=rows.length;
    if(!total)return;
    r2halt=false;
    r2ui('up','Envoi de '+total+' vidéos, une par une…',0,'Gardez cette page ouverte.');
    rows.reduce(function(p,row,idx){
      var m=r2files[+row.getAttribute('data-i')];
      return p.then(function(){
        if(r2halt){var ce=new Error('Annulé');ce.aborted=true;throw ce}
        var title=row.querySelector('.mt').value.trim(),price=parseInt(row.querySelector('.mp').value,10);
        if(title.length<2)throw new Error('Titre trop court');
        if(!(price>=0))throw new Error('Prix invalide');
        var name=cleanName(m.file.name),url=R2_CDN+'/'+encodeURIComponent(name);
        r2ui('up','Vidéo '+(idx+1)+' sur '+total+'…',Math.round(idx/total*100),m.file.name);
        markRow(row,'busy','Miniature…');
        return coverWith(m.file,m.picker,m.custom).then(function(info){
          return r2put(m.file,name,function(l,tt){
            markRow(row,'busy','Envoi '+Math.floor(l/tt*100)+' %');
            r2ui('up','Vidéo '+(idx+1)+' sur '+total+' · '+Math.floor(l/tt*100)+' %',Math.floor((idx+l/tt)/total*100),m.file.name);
          }).then(function(){
            markRow(row,'busy','Enregistrement…');
            return (info&&info.blob?upThumb(info,true):Promise.resolve(null)).then(function(tu){
              var body={title:title,artist:$('#r2artist').value.trim()||null,description:$('#r2desc').value.trim()||null,price_fc:price,video_url:url,is_published:true};
              if($('#rcat').value||CATS.length)body.category_id=$('#rcat').value||null;
              if($('#r2pin').checked||PINOK)body.pinned=$('#r2pin').checked;
              if(info&&info.dur)body.duration_seconds=info.dur;
              if(tu)body.thumbnail_url=tu;
              return authedFetch(REST+'videos',{method:'POST',headers:{'Content-Type':'application/json',Prefer:'return=minimal'},body:JSON.stringify(body)}).then(function(r){if(!r.ok)return restErr(r)});
            });
          });
        }).then(function(){
          markRow(row,'ok','Publiée');
          if(price>0)vipN++;
          Array.prototype.forEach.call(row.querySelectorAll('input,button'),function(i){i.disabled=true});
          if(m.picker){m.picker.destroy();m.picker=null;row.querySelector('.mfp').hidden=true}
        });
      }).then(function(){okN++},function(err){failN++;markRow(row,'err',err.aborted?'Annulé':'Échec : '+(err.noSession?t('admin_need'):err.message))});
    },Promise.resolve()).then(function(){
      loadStats();loadVideos();
      if(r2halt){r2ui('err','Envoi annulé',100,okN+' publiée(s). Cliquez à nouveau pour envoyer le reste.');return}
      if(!failN){
        $('#r2form').reset();r2reset();
        r2ui('ok',okN+' vidéo(s) publiée(s)',100,vipN?'Attention : les liens CDN sont publics, les vidéos payantes ne sont pas protégées.':'');
      }else r2ui('err',okN+' publiée(s), '+failN+' en échec',100,'Corrigez puis cliquez à nouveau : seules les vidéos en échec sont renvoyées.');
    });
  }

  /* ---------- Admin : onglets et cartes KPI ---------- */
  var ATABS=['overview','catalog','sales'],ATAB_KEY='tl_admin_tab';
  function showAdminTab(name,focus){
    if(ATABS.indexOf(name)<0)name='overview';
    ATABS.forEach(function(k){
      var on=k===name,b=$('#tab-'+k),p=$('#pane-'+k);
      b.setAttribute('aria-selected',on?'true':'false');b.tabIndex=on?0:-1;p.hidden=!on;
    });
    closeKmenus();
    var cr=$('#adm-crumb');if(cr)cr.textContent={overview:'Dashboard',catalog:'Vidéos & Catalogue',sales:'Achats & Réglages'}[name];
    try{sessionStorage.setItem(ATAB_KEY,name)}catch(e){}
    var tb=$('#tab-'+name);
    if(focus)tb.focus();
    try{tb.scrollIntoView({block:'nearest',inline:'center'})}catch(e){}
  }
  function restoreAdminTab(){var n='overview';try{n=sessionStorage.getItem(ATAB_KEY)||n}catch(e){}showAdminTab(n)}
  $('#apanel').addEventListener('click',function(e){
    var b=e.target.closest('[data-atab]');if(b)showAdminTab(b.getAttribute('data-atab'));
  });
  /* Clavier : flèches gauche/droite, Début, Fin (motif WAI-ARIA des onglets) */
  $('#apanel').addEventListener('keydown',function(e){
    var b=e.target.closest('[data-atab]');if(!b)return;
    var i=ATABS.indexOf(b.getAttribute('data-atab')),n=-1;
    if(e.key==='ArrowRight')n=(i+1)%ATABS.length;
    else if(e.key==='ArrowLeft')n=(i+ATABS.length-1)%ATABS.length;
    else if(e.key==='Home')n=0;else if(e.key==='End')n=ATABS.length-1;
    if(n>-1){e.preventDefault();showAdminTab(ATABS[n],true)}
  });

  var nf=function(n){return (+n||0).toLocaleString('fr-FR')};
  function setKpi(id,txt){var el=$('#'+id);if(el)el.textContent=txt}
  function kpiReset(txt){
    ['kpi-online','kpi-views','kpi-sales','kpi-rev'].forEach(function(i){setKpi(i,txt)});
    ['kpi-online-sub','kpi-views-sub','kpi-sales-sub','kpi-online-d','kpi-views-d','kpi-sales-d','kpi-rev-d'].forEach(function(i){setKpi(i,'')});
    if(txt==='—')$('#atop').innerHTML='<p class="hint">Statistiques indisponibles.</p>';
  }
  /* rows = lignes de la vue video_stats (déjà chargées par loadStats) */
  function renderKpis(rows){
    var on=0,vip=0,tv=0,ts=0,tr=0;
    rows.forEach(function(r){
      if(r.is_published){on++;if(+r.price_fc>0)vip++}
      tv+=+r.views||0;ts+=+r.sales||0;tr+=+r.revenue_fc||0;
    });
    setKpi('kpi-online',nf(on));setKpi('kpi-online-sub','sur '+nf(rows.length)+' au total');
    setKpi('kpi-views',nf(tv));setKpi('kpi-views-sub',rows.length?'≈ '+nf(Math.round(tv/rows.length))+' par vidéo':'');
    setKpi('kpi-sales',nf(ts));setKpi('kpi-sales-sub',nf(vip)+' vidéo(s) VIP en ligne');
    setKpi('kpi-rev',nf(tr)+' FC');
    /* tendances calculées sur les données réelles de la vue video_stats */
    var wk=Date.now()-7*864e5,added=rows.filter(function(r){return r.created_at&&new Date(r.created_at).getTime()>wk}).length;
    setPill('kpi-online-d',added?'+'+added+' cette semaine':'Stable',added?'':'neu');
    setPill('kpi-views-d',rows.length&&tv?'≈ '+nf(Math.round(tv/rows.length))+' / vidéo':'—','neu');
    setPill('kpi-sales-d',ts&&tv?(ts/tv*100).toFixed(1).replace('.',',')+' % des vues':'—','neu');
    setPill('kpi-rev-d',ts?'≈ '+nf(Math.round(tr/ts))+' FC / vente':'—','neu');
    var byDate=rows.filter(function(r){return r.created_at}).sort(function(a,b){return new Date(a.created_at)-new Date(b.created_at)}),cum=0;
    spark('sp-online',byDate.map(function(r){return r.is_published?++cum:cum}));
    var top8=rows.slice().sort(function(a,b){return (+b.views||0)-(+a.views||0)}).slice(0,8);
    sparkBars('sp-views',top8.map(function(r){return +r.views||0}));
    sparkBars('sp-sales',top8.map(function(r){return +r.sales||0}));
    sparkBars('sp-rev',top8.map(function(r){return +r.revenue_fc||0}));
    var top=rows.slice().sort(function(a,b){return (+b.views||0)-(+a.views||0)}).slice(0,5).filter(function(r){return (+r.views||0)>0});
    $('#atop').innerHTML=top.length?top.map(function(r){
      return '<div class="arow"><div><b>'+esc(r.title)+'</b><span>'+nf(r.views)+' vues · '+nf(r.sales)+' ventes · '+FC(+r.revenue_fc||0)+'</span></div></div>';
    }).join(''):'<p class="hint">Pas encore de vues enregistrées.</p>';
  }
  $('#kpi-apkcopy').addEventListener('click',function(){
    var url=new URL('TOPLEAKS.apk',location.href).href;
    copyText(url).then(function(){toast(t('link_copied'))},function(){toast(t('share_fail'))});
  });


  /* ---------- Admin : tendances, membres (table profiles), activité ---------- */
  function setPill(id,txt,cls){var el=$('#'+id);if(!el)return;el.textContent=txt;el.className='kpi-d'+(cls?' '+cls:'')}
  function spark(id,vals){
    var el=$('#'+id);if(!el)return;
    if(!vals||vals.length<2){el.innerHTML='';return}
    var mx=Math.max.apply(null,vals),mn=Math.min.apply(null,vals),rg=(mx-mn)||1,n=vals.length;
    var pts=vals.map(function(v,i){return [(i/(n-1)*100).toFixed(1),(26-(v-mn)/rg*22).toFixed(1)]});
    var d='M'+pts.map(function(p){return p.join(' ')}).join(' L');
    el.innerHTML='<path class="a" d="'+d+' L100 28 L0 28Z"/><path class="l" d="'+d+'"/>';
  }
  function sparkBars(id,vals){
    var el=$('#'+id);if(!el)return;
    if(!vals||!vals.length||!Math.max.apply(null,vals)){el.innerHTML='';return}
    var mx=Math.max.apply(null,vals),w=100/vals.length;
    el.innerHTML=vals.map(function(v,i){var h=Math.max(2,v/mx*26);return '<rect x="'+(i*w+w*.18).toFixed(1)+'" y="'+(28-h).toFixed(1)+'" width="'+(w*.64).toFixed(1)+'" height="'+h.toFixed(1)+'" rx="1.5"/>'}).join('');
  }
  var MEMBERS=[],MEMSHOWN=10,MEMQ='',PROFOK=true,lastUpd=0;
  function fdate(x){if(!x)return 'Jamais';var d=new Date(x);return isNaN(d)?'—':d.toLocaleString('fr-FR',{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'})}
  function isActive(m){return m.last_seen&&Date.now()-new Date(m.last_seen).getTime()<7*864e5}
  function renderMembers(){
    var body=$('#amembody'),more=$('#amemmore');
    if(!PROFOK){body.innerHTML='<tr><td colspan="4" class="adm-empty">Table « profiles » indisponible : lancez le script SQL.</td></tr>';more.hidden=true;return}
    var qq=plain(MEMQ.trim()),list=MEMBERS.filter(function(m){return !qq||plain(m.email||'').indexOf(qq)>-1});
    if(!list.length){body.innerHTML='<tr><td colspan="4" class="adm-empty">'+(MEMBERS.length?'Aucun résultat.':'Aucun membre pour l’instant.')+'</td></tr>';more.hidden=true;return}
    body.innerHTML=list.slice(0,MEMSHOWN).map(function(m,i){
      var st=isActive(m)?'<span class="bdg">Actif</span>':(m.last_seen?'<span class="bdg off">Inactif</span>':'<span class="bdg wait">Jamais connecté</span>');
      return '<tr><td>'+(i+1)+'</td><td class="mail">'+esc(m.email||'—')+'</td><td>'+esc(fdate(m.last_seen))+'</td><td>'+st+'</td></tr>';
    }).join('');
    more.hidden=list.length<=MEMSHOWN;more.textContent='Voir plus ('+(list.length-MEMSHOWN)+')';
  }
  function dayBuckets(items,key,days){
    var out=[],now=new Date();now.setHours(23,59,59,999);
    for(var i=days-1;i>=0;i--){var end=now.getTime()-i*864e5,st=end-864e5,c=0;items.forEach(function(m){var t0=m[key]&&new Date(m[key]).getTime();if(t0&&t0>st&&t0<=end)c++});out.push(c)}
    return out;
  }
  function loadMembers(){
    return authedFetch(REST+'profiles?select=id,email,created_at,last_seen&order=last_seen.desc.nullslast&limit=1000',{headers:{Prefer:'count=exact'}}).then(function(r){
      if(!r.ok){PROFOK=false;return restErr(r)}
      var cr=r.headers.get('content-range'),tot=cr&&+cr.split('/')[1];
      return r.json().then(function(rows){return {rows:rows,total:tot>0?tot:rows.length}});
    }).then(function(o){
      PROFOK=true;MEMBERS=o.rows;var tot=o.total,act=MEMBERS.filter(isActive).length,wk=Date.now()-7*864e5,w2=Date.now()-14*864e5;
      var n1=MEMBERS.filter(function(m){return m.created_at&&new Date(m.created_at).getTime()>wk}).length;
      var n0=MEMBERS.filter(function(m){var t0=m.created_at&&new Date(m.created_at).getTime();return t0&&t0>w2&&t0<=wk}).length;
      setKpi('kpi-accounts',nf(tot));setKpi('adm-count',nf(tot));
      setPill('kpi-accounts-d',n1?'+'+n1+(n0?' ('+(n1>=n0?'+':'−')+Math.abs(Math.round((n1-n0)/n0*100))+' %)':'')+' / 7 j':'0 nouveau / 7 j',n1?'':'neu');
      setKpi('kpi-accounts-sub','');
      setKpi('kpi-active',nf(act));setPill('kpi-active-d',tot?Math.round(act/tot*100)+' % des comptes':'—','neu');
      var cum=0,pre=MEMBERS.filter(function(m){return m.created_at&&new Date(m.created_at).getTime()<=Date.now()-14*864e5}).length;
      spark('sp-accounts',dayBuckets(MEMBERS,'created_at',14).map(function(c){cum+=c;return pre+cum}));
      sparkBars('sp-active',dayBuckets(MEMBERS,'last_seen',7));
      renderMembers();
    }).catch(function(err){
      PROFOK=false;setKpi('kpi-accounts','—');setKpi('kpi-active','—');setKpi('adm-count','–');
      setPill('kpi-accounts-d','Voir script SQL','neu');renderMembers();
    });
  }
  $('#amemq').addEventListener('input',function(){MEMQ=this.value;MEMSHOWN=10;renderMembers()});
  $('#amemmore').addEventListener('click',function(){MEMSHOWN+=15;renderMembers()});
  function loadActivity(){
    var body=$('#aactbody'),mail={};
    MEMBERS.forEach(function(m){mail[m.id]=m.email});
    return authedFetch(REST+'purchases?select=*&order=created_at.desc&limit=10').then(function(r){return r.ok?r.json():[]}).catch(function(){return []}).then(function(pp){
      var ev=[];
      pp.forEach(function(p){
        var v=ADMV[p.video_id],paid=String(p.status||'').toLowerCase()==='paid';
        ev.push({t:p.created_at,mail:p.email||p.user_email||mail[p.user_id]||'—',d:'Achat VIP · '+(v?v.title:'vidéo')+(p.reference?' · réf. '+p.reference:''),st:paid?'<span class="bdg">Payé</span>':'<span class="bdg wait">En attente</span>'});
      });
      MEMBERS.filter(isActive).slice(0,6).forEach(function(m){ev.push({t:m.last_seen,mail:m.email||'—',d:'Connexion à l’application',st:'<span class="bdg">Actif</span>'})});
      ev.sort(function(a,b){return new Date(b.t||0)-new Date(a.t||0)});
      ev=ev.slice(0,8);
      body.innerHTML=ev.length?ev.map(function(e,i){return '<tr><td>'+(i+1)+'</td><td class="mail">'+esc(e.mail)+'</td><td>'+esc(e.d)+'<br><span style="color:var(--muted);font-size:12px">'+esc(fdate(e.t))+'</span></td><td>'+e.st+'</td></tr>'}).join(''):'<tr><td colspan="4" class="adm-empty">Aucune activité récente.</td></tr>';
    });
  }
  function tickUpd(){var el=$('#adm-upd');if(!el)return;if(!lastUpd){el.textContent='…';return}var s2=Math.round((Date.now()-lastUpd)/1000);el.textContent=s2<10?'à l’instant':s2<60?'il y a '+s2+' s':'il y a '+Math.round(s2/60)+' min'}
  setInterval(tickUpd,15000);
  function refreshDash(){
    lastUpd=0;tickUpd();
    var sl=$('#adm-sess');if(sl&&session&&session.user)sl.textContent='Session active · '+session.user.email;
    return Promise.all([loadStats(),loadMembers()]).then(function(){return loadActivity()}).then(function(){lastUpd=Date.now();tickUpd()});
  }
  $('#adm-refresh').addEventListener('click',refreshDash);
  /* raccourcis de la barre latérale : onglet + défilement vers la section */
  $('#apanel').addEventListener('click',function(e){
    var g=e.target.closest('[data-go]');if(!g)return;
    var p=g.getAttribute('data-go').split(':');showAdminTab(p[0]);
    var el=$(p[1]);if(el)try{el.scrollIntoView({behavior:'smooth',block:'start'})}catch(x){}
  });
  /* dernière connexion : enregistrée côté serveur (fonction touch_last_seen du script SQL) */
  var seenAt=0;
  function touchSeen(){
    if(!session||Date.now()-seenAt<5*60*1000)return;seenAt=Date.now();
    authedFetch(REST+'rpc/touch_last_seen',{method:'POST',headers:{'Content-Type':'application/json'},body:'{}'}).catch(function(){});
  }

  /* ---------- Thème, Paramètres ---------- */
  var THEME_KEY='tl_theme';
  function curTheme(){return document.documentElement.getAttribute('data-theme')==='light'?'light':'dark'}
  function syncThemeUI(){
    var m=curTheme();
    Array.prototype.forEach.call(document.querySelectorAll('[data-theme-set]'),function(b){b.setAttribute('aria-pressed',b.getAttribute('data-theme-set')===m)});
  }
  function setTheme(m,persist){
    m=m==='light'?'light':'dark';
    document.documentElement.setAttribute('data-theme',m);
    var mt=document.querySelector('meta[name=theme-color]');if(mt)mt.setAttribute('content',m==='light'?'#faf8f4':'#0b0b0d');
    if(persist){try{localStorage.setItem(THEME_KEY,m)}catch(e){}}
    syncThemeUI();
  }
  var setEl=$('#settings'),setOv=$('#setov'),setLast=null;
  function updateSetFavs(){var n=favCount(),el=$('#setfavn');if(el)el.textContent=n?'('+n+')':''}
  function openSettings(){
    if(!setEl.hidden)return;
    setLast=document.activeElement;
    updateSetFavs();syncThemeUI();
    setOv.hidden=false;setEl.hidden=false;
    document.documentElement.classList.add('noscroll');
    setTimeout(function(){try{$('#setclose').focus()}catch(e){}},40);
  }
  function closeSettings(){
    if(setEl.hidden)return;
    setEl.hidden=true;setOv.hidden=true;
    document.documentElement.classList.remove('noscroll');
    if(setLast&&setLast.focus){try{setLast.focus()}catch(e){}}
  }
  function showFavs(){
    closeSettings();
    q.value='';search();FIL.fav=true;SHOWN=PER;show('home');renderFilters();renderGrid();
    setTimeout(function(){var g=$('#filters')||$('#rows');try{g.scrollIntoView({behavior:'smooth',block:'start'})}catch(e){}},60);
  }
  /* Vide uniquement les données temporaires : favoris, achats et connexion restent */
  function clearLocalCache(){
    if(!confirm(t('cache_confirm')))return;
    try{sessionStorage.clear()}catch(e){}
    ST.pos={};saveState();
    var jobs=[];
    try{if(window.caches&&caches.keys)jobs.push(caches.keys().then(function(ks){return Promise.all(ks.map(function(k){return caches.delete(k)}))}))}catch(e){}
    Promise.all(jobs).catch(function(){}).then(function(){toast(t('cache_done'));loadVideos()});
  }
  $('#settingsbtn').addEventListener('click',openSettings);
  $('#setfoot').addEventListener('click',openSettings);
  $('#setclose').addEventListener('click',closeSettings);
  setOv.addEventListener('click',closeSettings);
  $('#setfavs').addEventListener('click',showFavs);
  $('#clearcache').addEventListener('click',clearLocalCache);
  setEl.addEventListener('click',function(e){
    var b=e.target.closest('[data-theme-set]');if(b){setTheme(b.getAttribute('data-theme-set'),true);return}
    if(e.target.closest('[data-doc]'))closeSettings();
  });
  document.addEventListener('keydown',function(e){
    if(setEl.hidden)return;
    if(e.key==='Escape'){closeSettings();return}
    if(e.key!=='Tab')return;
    var f=Array.prototype.filter.call(setEl.querySelectorAll('button,input,select,a[href]'),function(x){return !x.disabled&&x.offsetParent!==null});
    if(!f.length)return;
    var a=f[0],z=f[f.length-1];
    if(e.shiftKey&&document.activeElement===a){e.preventDefault();z.focus()}
    else if(!e.shiftKey&&document.activeElement===z){e.preventDefault();a.focus()}
  });
  $('#appver').textContent=APP_VERSION+' · '+APP_BUILD;
  syncThemeUI();

  /* ---------- Numéro de paiement officiel : table Supabase « app_settings » (key = payment_number) ----------
     La valeur de PAY_NUMBER tout en haut du script ne sert que de secours (réseau coupé ou table absente). */
  var PAYNUM_CACHE='tl_paynum_v1',payNumLoaded=false;
  function cleanPayNum(s){return String(s||'').replace(/[^\d+\s.\-]/g,'').replace(/\s+/g,' ').trim()}
  function validPayNum(s){var d=String(s).replace(/\D/g,'');return d.length>=9&&d.length<=15}
  function applyPayNum(n){
    n=cleanPayNum(n);if(!validPayNum(n))return;
    PAY_NUMBER=n;
    if(wm&&!wm.hidden)wm.textContent='TOPLEAKS · '+PAY_NUMBER;
    if(payItem&&!views.pay.hidden&&!$('#payform').hidden)renderPaySum();
    var inp=$('#apaynum');if(inp&&document.activeElement!==inp)inp.value=PAY_NUMBER;
  }
  function payNumFallback(){
    if(payNumLoaded)return;
    var c=null;try{c=localStorage.getItem(PAYNUM_CACHE)}catch(e){}
    if(c)applyPayNum(c);
  }
  function loadPayNumber(){
    return fetch(REST+'app_settings?select=value&key=eq.payment_number',{headers:{apikey:SB_KEY},cache:'no-store'})
    .then(function(r){return r.ok?r.json():[]})
    .then(function(rows){
      if(rows&&rows[0]&&rows[0].value){
        payNumLoaded=true;applyPayNum(rows[0].value);
        try{localStorage.setItem(PAYNUM_CACHE,PAY_NUMBER)}catch(e){}
      }else payNumFallback();
    }).catch(payNumFallback);
  }
  $('#apayform').addEventListener('submit',function(e){
    e.preventDefault();
    var n=cleanPayNum($('#apaynum').value),btn=$('#apaysave');
    if(!validPayNum(n)){amsg('Numéro invalide : entrez 9 à 15 chiffres.',true);return}
    btn.disabled=true;amsg('Enregistrement…');
    authedFetch(REST+'app_settings?on_conflict=key',{method:'POST',headers:{'Content-Type':'application/json',Prefer:'resolution=merge-duplicates,return=minimal'},body:JSON.stringify({key:'payment_number',value:n,updated_at:new Date().toISOString()})}).then(function(r){
      if(!r.ok)return restErr(r);
      payNumLoaded=true;applyPayNum(n);
      try{localStorage.setItem(PAYNUM_CACHE,n)}catch(e){}
      amsg('Numéro de paiement enregistré : '+n+'. Il s’affiche maintenant pour tous les utilisateurs.');
    }).catch(function(err){
      amsg('Échec : '+(err.noSession?t('admin_need'):(err.network?t('e_net'):err.message))+' (table « app_settings » installée ? voir le script SQL)',true);
    }).then(function(){btn.disabled=false});
  });

  /* ---------- Bannière de téléchargement APK ----------
     Apparaît 1,5 s après l'arrivée, reste 6 s, puis disparaît. Une fois fermée (×) ou cliquée (Télécharger), elle ne revient plus (localStorage).
     Non affichée sur iPhone/iPad (pas d'APK) ni dans l'application installée elle-même. */
  var APK_KEY='tl_apk_banner_v2',APK_QUIET=3*864e5,apkT1=null,apkT2=null;
  var APKT={
    apk_title:'Application TOPLEAKS pour Android',apk_how:'Comment installer ?',apk_dl:'Télécharger',
    apk_help_title:'Installer l’application sur Android',
    apk_help_intro:'L’installation prend moins d’une minute. Suivez ces étapes :',
    apk_s1_t:'Téléchargez le fichier',apk_s1:'Touchez « Télécharger ». Si Chrome demande une confirmation, choisissez « Télécharger quand même ».',
    apk_s2_t:'Ouvrez topleaks.apk',apk_s2:'Touchez la notification de téléchargement, ou ouvrez l’appli Fichiers puis le dossier Téléchargements.',
    apk_s3_t:'Autorisez l’installation',apk_s3:'Si Android affiche « Installation bloquée », touchez Paramètres et activez « Autoriser depuis cette source » pour Chrome (ou pour Fichiers), puis revenez en arrière.',
    apk_s4_t:'Installez',apk_s4:'Touchez Installer, puis Ouvrir. Si Play Protect affiche un avertissement, touchez « Plus de détails » puis « Installer quand même ».',
    apk_note:'Téléchargez l’APK uniquement depuis le site officiel TOPLEAKS.'
  };
  for(var ak in APKT)I.fr[ak]=APKT[ak];
  function apkSeen(){try{var v=+localStorage.getItem(APK_KEY)||0;return v>0&&Date.now()-v<APK_QUIET}catch(e){return false}}
  function apkDone(){try{localStorage.setItem(APK_KEY,String(Date.now()))}catch(e){}}
  function apkHide(){
    clearTimeout(apkT1);clearTimeout(apkT2);
    var b=$('#apkb');b.classList.remove('show');b.setAttribute('aria-hidden','true');
  }
  function initApkBanner(){
    var ua=navigator.userAgent||'';
    var ios=/iPhone|iPad|iPod/i.test(ua)||(navigator.maxTouchPoints>1&&/Mac/.test(navigator.platform||''));
    var inApp=!!(window.Capacitor&&window.Capacitor.isNativePlatform&&window.Capacitor.isNativePlatform())||(window.matchMedia&&matchMedia('(display-mode: standalone)').matches)||/; wv\)/.test(ua);
    if(ios||inApp||apkSeen())return;
    /* Android : la bannière reste affichée jusqu'à ce qu'on la ferme ou qu'on la touche. Ailleurs : 20 s. */
    var android=/Android/i.test(ua);
    apkT1=setTimeout(function(){
      var b=$('#apkb');b.classList.add('show');b.setAttribute('aria-hidden','false');
      if(!android)apkT2=setTimeout(apkHide,20000);
    },1200);
  }
  /* l'utilisateur touche la bannière : on arrête la disparition automatique le temps qu'il choisisse */
  $('#apkb').addEventListener('pointerdown',function(){clearTimeout(apkT2)});
  $('#apkclose').addEventListener('click',function(){apkDone();apkHide()});
  $('#apkdl').addEventListener('click',function(){apkDone();apkHide();setTimeout(function(){openModal('#apkm')},500)}); /* pas de preventDefault : le téléchargement démarre */
  $('#apkhow').addEventListener('click',function(){apkHide();openModal('#apkm')});
  $('#apkmdl').addEventListener('click',apkDone);
  $('#apkmclose').addEventListener('click',function(){closeModal('#apkm')});
  $('#apkm').addEventListener('click',function(e){if(e.target===this)closeModal('#apkm')});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!$('#apkm').hidden)closeModal('#apkm')});
  $('#yr').textContent=new Date().getFullYear();

  /* ---------- Bouton Retour du téléphone ----------
     Une entrée « garde » est toujours posée au-dessus de l'historique. Un retour physique la consomme,
     on ferme alors la couche la plus haute (fenêtre, tiroir, sous-écran, recherche) puis on repose la garde.
     Quand il ne reste rien à fermer, un second retour dans les 2 s quitte réellement l'application. */
  var backTs=0,guardOn=false;
  function armGuard(){try{history.pushState({tlGuard:1},'',location.href);guardOn=true}catch(e){}}
  function topLayer(){
    for(var i=0;i<MODALS.length;i++)if(!$(MODALS[i]).hidden)return {k:'modal',sel:MODALS[i]};
    if(!setEl.hidden)return {k:'settings'};
    for(var n in views)if(n!=='home'&&!views[n].hidden)return {k:'screen'};
    if($('#q').value.trim())return {k:'search'};
    return null;
  }
  function closeTop(l){
    if(l.k==='modal'){if(l.sel==='#qedit')closeQE();else closeModal(l.sel)}
    else if(l.k==='settings')closeSettings();
    else if(l.k==='screen'){try{pause()}catch(e){}try{exitFs()}catch(e){}show('home')}
    else if(l.k==='search'){q.value='';search();q.blur()}
  }
  try{history.replaceState({tlBase:1},'',location.href)}catch(e){}
  armGuard();
  window.addEventListener('popstate',function(){
    var l=topLayer();
    if(l){closeTop(l);armGuard();return}
    if(Date.now()-backTs<2000){backTs=0;try{history.back()}catch(e){}return}
    backTs=Date.now();toast('Appuyez encore sur Retour pour quitter');armGuard();
  });

  /* ---------- Démarrage ---------- */
  $('#saver').checked=!!ST.saver;
  if(!DEMO_MODE){
    var dbn=document.querySelector('.demo-banner');if(dbn)dbn.hidden=true;
    var dn=document.querySelector('[data-i18n="demo_note"]');if(dn)dn.setAttribute('data-i18n','pay_manual_note');
    var okh=document.querySelector('#payok h3');if(okh)okh.setAttribute('data-i18n','pay_sent_title');
  }
  applyLang();renderContact();
  loadSession();renderAccount();
  loadPayNumber();initApkBanner();touchSeen();
  consumeHash().then(function(){renderAccount();loadCats();loadVideos();loadPurchases()});
})();
