/* ===== ENVOI MULTIPLE R2 AVEC MINIATURES (remplace l'ancien bloc r2files / r2batch) ===== */
  var r2files=[];
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
    box.innerHTML='<p class="mhead">'+fs.length+' vidéos : titre, prix et miniature pour chacune. L’artiste, la catégorie et la description du formulaire sont communs.</p>'+
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
  function r2batch(){
    var rows=Array.prototype.slice.call(document.querySelectorAll('#r2list .mrow')).filter(function(r){return r.getAttribute('data-state')!=='ok'});
    var okN=0,failN=0;
    if(!rows.length)return;
    r2ui('up','Envoi de '+rows.length+' vidéos, une par une…',0,'Gardez cette page ouverte.');
    rows.reduce(function(p,row){
      var m=r2files[+row.getAttribute('data-i')];
      return p.then(function(){
        var title=row.querySelector('.mt').value.trim(),price=parseInt(row.querySelector('.mp').value,10);
        if(title.length<2)throw new Error('Titre trop court');
        if(!(price>=0))throw new Error('Prix invalide');
        var name=cleanName(m.file.name),url=R2_CDN+'/'+encodeURIComponent(name);
        markRow(row,'busy','Miniature…');
        return coverWith(m.file,m.picker,m.custom).then(function(info){
          return r2put(m.file,name,function(l,tt){markRow(row,'busy','Envoi '+Math.floor(l/tt*100)+' %')}).then(function(){
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
          Array.prototype.forEach.call(row.querySelectorAll('input,button'),function(i){i.disabled=true});
          if(m.picker){m.picker.destroy();m.picker=null;row.querySelector('.mfp').hidden=true}
        });
      }).then(function(){okN++},function(err){failN++;markRow(row,'err','Échec : '+(err.noSession?t('admin_need'):err.message))});
    },Promise.resolve()).then(function(){
      loadStats();loadVideos();
      if(!failN){$('#r2form').reset();r2reset();r2ui('ok',okN+' vidéo(s) publiée(s)',100,'')}
      else r2ui('err',okN+' publiée(s), '+failN+' en échec',100,'Corrigez puis cliquez à nouveau : seules les vidéos en échec sont renvoyées.');
    });
  }
