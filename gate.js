(function(){
  var BASE='https://jchenmortgage.github.io/marketing/';
  var H=52;

  // ---------- global site menu bar (on every page) ----------
  function link(href,label,on){
    return '<a href="'+href+'" style="text-decoration:none;font-weight:800;font-size:14px;padding:8px 15px;border-radius:999px;white-space:nowrap;color:'+(on?'#fff':'#cbbfae')+';background:'+(on?'#D8842F':'transparent')+'">'+label+'</a>';
  }
  function buildNav(){
    if(document.getElementById('jcmnav')) return;
    var p=location.pathname.replace(/\/+$/,'');
    var isRate = p.indexOf('/rate')!==-1;
    var isPosts = p.indexOf('/posts')!==-1;
    var isHome = !isRate && !isPosts;
    var bar=document.createElement('div');
    bar.id='jcmnav';
    bar.style.cssText='position:fixed;top:0;left:0;right:0;height:'+H+'px;background:#2E2A24;display:flex;align-items:center;gap:6px;padding:0 12px;z-index:2147483646;font-family:"Nunito Sans",Arial,sans-serif;box-shadow:0 2px 10px rgba(0,0,0,.3);overflow-x:auto;-webkit-overflow-scrolling:touch';
    bar.innerHTML=''
      + '<a href="'+BASE+'" title="Home" style="display:flex;align-items:center;text-decoration:none;margin-right:4px;flex:none"><img src="'+BASE+'jcm-logo-white.svg" alt="Jack Chen Mortgage" style="height:30px"></a>'
      + link(BASE,'Home',isHome)
      + link(BASE+'rate/','Today’s Rate',isRate)
      + link(BASE+'#posts','Social Posts',isPosts);
    document.body.insertBefore(bar, document.body.firstChild);
    document.body.style.paddingTop=H+'px';
    var ex=document.querySelector('.nav');
    if(ex && ex.id!=='jcmnav'){ try{ if(getComputedStyle(ex).position==='sticky') ex.style.top=H+'px'; }catch(e){} }
  }
  if(document.body) buildNav(); else document.addEventListener('DOMContentLoaded',buildNav);

  // ---------- cross-device cloud sync for editors ----------
  // Any page that defines global collect(), restore() and KEY (the editor pattern)
  // gets automatic Firebase sync keyed by KEY, with no per-page code.
  var DB='https://jc-rates-default-rtdb.firebaseio.com';
  function syncStatus(txt){ var b=document.getElementById('saveBtn'); if(b){ var prop=('innerHTML' in b)?'innerHTML':'textContent'; b[prop]=txt; } }
  function wireSync(){
    if(typeof window.collect!=='function' || !window.KEY) return; // not an editor
    var path=DB+'/carousels/'+window.KEY+'.json';
    // 1) load from cloud; if none yet, seed cloud from this device's local save
    fetch(path).then(function(r){ return r.ok? r.json() : null; }).then(function(data){
      if(data){
        try{ localStorage.setItem(window.KEY, JSON.stringify(data)); }catch(e){}
        if(typeof window.restore==='function') window.restore();
        if(typeof window.layout==='function') window.layout();
      } else {
        var loc=null; try{ loc=localStorage.getItem(window.KEY); }catch(e){}
        if(loc){ fetch(path,{method:'PUT',headers:{'Content-Type':'application/json'},body:loc}).catch(function(){}); }
      }
    }).catch(function(){});
    // 2) wrap Save so every save also pushes to the cloud
    var orig=window.save;
    window.save=function(){
      if(typeof orig==='function'){ try{ orig(); }catch(e){} }
      var d; try{ d=window.collect(); }catch(e){ return; }
      fetch(path,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(d)})
        .then(function(r){ if(r.ok) setTimeout(function(){ syncStatus('✓ Synced'); },120); })
        .catch(function(){});
    };
  }
  if(document.readyState!=='loading') wireSync(); else document.addEventListener('DOMContentLoaded',wireSync);

  // ---------- password gate (24h, whole site) ----------
  var PW='serve';
  var DUR=24*60*60*1000;
  if(Date.now() < (parseInt(localStorage.getItem('jcm_gate')||'0',10))) return;
  var ov=document.createElement('div');
  ov.id='jcmgate';
  ov.style.cssText='position:fixed;inset:0;background:#2E2A24;display:flex;align-items:center;justify-content:center;z-index:2147483647;font-family:Arial,sans-serif';
  ov.innerHTML='<div style="text-align:center"><div style="color:#EFA45C;font-size:13px;letter-spacing:4px;margin-bottom:14px">JACK CHEN MORTGAGE</div><div style="color:#fff;font-size:20px;margin-bottom:16px">Enter password</div><input id="jcmpw" type="password" style="padding:11px 14px;font-size:16px;border-radius:8px;border:none;width:200px"><button id="jcmbtn" style="padding:11px 18px;margin-left:8px;background:#D8842F;color:#fff;border:none;border-radius:8px;font-size:16px;cursor:pointer">Enter</button><div id="jcmerr" style="color:#E24B4A;font-size:13px;margin-top:12px;height:16px"></div></div>';
  function add(){
    document.body.appendChild(ov);
    function tryit(){ if(document.getElementById('jcmpw').value===PW){ localStorage.setItem('jcm_gate',String(Date.now()+DUR)); ov.remove(); } else { document.getElementById('jcmerr').textContent='Incorrect password'; } }
    document.getElementById('jcmbtn').onclick=tryit;
    document.getElementById('jcmpw').addEventListener('keydown',function(e){ if(e.key==='Enter') tryit(); });
    document.getElementById('jcmpw').focus();
  }
  if(document.body) add(); else document.addEventListener('DOMContentLoaded',add);
})();
