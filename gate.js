(function(){
  var PW='serve';
  var DUR=24*60*60*1000; // 24 hours
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
