// ---------- Revendeurs ----------
const SHOPS = {
  "spareka.fr":{label:"Spareka"}, "sos-accessoire.com":{label:"SOS Accessoire"}, "manomano.fr":{label:"ManoMano"}, "amazon":{label:"Amazon"}
};
function shopUrl(shop, app, part){
  const q = `${part.name} ${app.brand} ${app.model}`;
  if(shop==="amazon") return "https://www.amazon.fr/s?k="+encodeURIComponent(q);
  return "https://www.google.com/search?q="+encodeURIComponent(q+" site:"+shop);
}

// ---------- État ----------
let app = APPS[0], suspects = new Set(), selected = null, activeSym = null;
const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/[&<>"]/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const norm = s => String(s).toUpperCase().replace(/[^A-Z0-9]/g,"");

function findApp(q){
  const n = norm(q); if(n.length<3) return null;
  return APPS.find(a => [a.model, a.brand+" "+a.model, ...Object.values(a.codes)].some(v => { const m=norm(v); return m===n || m.includes(n) || (m.length>=6 && n.includes(m)); })) || null;
}

// ---------- Rendu ----------
function renderApp(){
  $("app-type").textContent = app.type;
  $("h-app").textContent = app.brand+" "+app.model;
  $("ident").innerHTML = Object.entries(app.codes).map(([k,v])=>`<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join("");
  $("symptoms").innerHTML = app.symptoms.map(s=>`<button type="button" class="chip" data-sym="${s.id}" aria-pressed="${activeSym===s.id}">${esc(s.label)}</button>`).join("");
  renderDiag(); renderDraw(); renderParts();
}

function renderDiag(){
  const box = $("diag"), s = app.symptoms.find(x=>x.id===activeSym);
  if(!s){ box.hidden = true; return; }
  box.hidden = false;
  const names = s.parts.map(n=>app.parts.find(p=>p.n===n)).map(p=>`<b>${p.n}. ${esc(p.name)}</b>`).join(", ");
  box.innerHTML = `<div class="eyebrow">Diagnostic probable · difficulté ${esc(s.level)}</div>
    <p>${esc(s.why)}</p><p>Pièces à contrôler, par ordre de probabilité : ${names}.</p>
    <ol>${s.steps.map(t=>`<li>${esc(t)}</li>`).join("")}</ol>
    <p class="note">Débranchez toujours l'appareil (et coupez l'eau) avant d'intervenir.</p>`;
}

function shapeSvg(sh, cls, attrs){
  const a = Object.entries(sh).filter(([k])=>k!=="k").map(([k,v])=>`${k==="w"?"width":k==="h"?"height":k}="${v}"`).join(" ");
  return `<${sh.k} class="${cls}" ${a} ${attrs}/>`;
}
function centre(sh){
  if(sh.k==="rect") return [sh.x+sh.w/2, sh.y+sh.h/2];
  if(sh.k==="circle"||sh.k==="ellipse") return [sh.cx, sh.cy];
  const nums = sh.d.match(/-?\d+(\.\d+)?/g).map(Number); return [nums[0]+40, nums[1]];
}
function renderDraw(){
  let g = app.axes.map(d=>`<path class="axis" d="${d}"/>`).join("");
  for(const p of app.parts){
    const hl = suspects.has(p.n), sel = selected===p.n;
    const cls = "p"+(hl?" hl":"")+(sel?" sel":"");
    g += `<g data-part="${p.n}" role="button" tabindex="0" aria-label="${p.n}. ${esc(p.name)}">`;
    g += p.s.map(sh=>shapeSvg(sh, cls, "")).join("");
    g += (p.d||[]).map(d=>`<path class="detail${hl?" hl-d":""}" d="${d}"/>`).join("");
    g += `</g>`;
  }
  for(const p of app.parts){
    const [cx,cy] = centre(p.s[0]), [tx,ty] = p.t;
    g += `<line class="lead" x1="${cx}" y1="${cy}" x2="${tx}" y2="${ty}"/>`;
  }
  for(const p of app.parts){
    const [tx,ty] = p.t;
    g += `<g class="tag${suspects.has(p.n)?" hl":""}" data-part="${p.n}"><circle cx="${tx}" cy="${ty}" r="10"/><text x="${tx}" y="${ty}">${p.n}</text></g>`;
  }
  $("draw").innerHTML = `<svg viewBox="0 0 400 510" role="img" aria-label="Vue éclatée ${esc(app.brand+" "+app.model)}">${g}</svg>`;
}

function renderParts(){
  const list = [...app.parts].sort((a,b)=>(suspects.has(b.n)-suspects.has(a.n)) || a.n-b.n);
  $("parts-count").textContent = app.parts.length+" pièces"+(suspects.size?` · ${suspects.size} suspectée${suspects.size>1?"s":""}`:"");
  $("parts").innerHTML = list.map(p=>`<li class="part${suspects.has(p.n)?" hl":""}${selected===p.n?" sel":""}" id="part-${p.n}">
    <span class="num">${p.n}</span>
    <div class="pname">${esc(p.name)}${suspects.has(p.n)?'<span class="tag-s">suspectée</span>':""}<div class="pref">${esc(p.ref)}</div></div>
    <span class="price">${p.price.toFixed(2).replace(".",",")} €</span>
    <div class="shops">${app.shops.map(s=>`<a href="${shopUrl(s,app,p)}" target="_blank" rel="noopener">${SHOPS[s].label}</a>`).join("")}</div>
  </li>`).join("");
}

function load(a, msg){
  app = a; suspects = new Set(); selected = null; activeSym = null;
  $("free").value = ""; $("ai-msg").textContent = "";
  renderApp();
  $("id-msg").className = "msg"; $("id-msg").textContent = msg || "";
}
function lookup(q, how){
  const a = findApp(q);
  if(a){ load(a, `${how} « ${q} » : ${a.brand} ${a.model} trouvé.`); $("p-app").scrollIntoView({behavior:"smooth",block:"start"}); }
  else { $("id-msg").className="msg err"; $("id-msg").textContent = `${how} « ${q} » : aucun appareil correspondant dans le catalogue de démo. Essayez un appareil de démo ci-dessous.`; }
}

// ---------- Interactions ----------
$("demos").innerHTML = APPS.map(a=>`<button type="button" class="chip" data-demo="${a.id}">${esc(a.brand+" "+a.model)} <span class="pref">${a.codes.EAN}</span></button>`).join("");
$("demos").addEventListener("click", e=>{ const b=e.target.closest("[data-demo]"); if(!b) return; const a=APPS.find(x=>x.id===b.dataset.demo); $("ref").value=a.codes.EAN; lookup(a.codes.EAN,"Code"); });
$("f-ref").addEventListener("submit", e=>{ e.preventDefault(); const v=$("ref").value.trim(); if(v) lookup(v,"Référence"); });

$("symptoms").addEventListener("click", e=>{
  const b=e.target.closest("[data-sym]"); if(!b) return;
  activeSym = activeSym===b.dataset.sym ? null : b.dataset.sym;
  const s = app.symptoms.find(x=>x.id===activeSym);
  suspects = new Set(s ? s.parts : []); selected = null;
  renderApp();
});
function pick(n){
  selected = selected===n ? null : n; renderDraw(); renderParts();
  if(selected) $("part-"+n).scrollIntoView({behavior:"smooth",block:"center"});
}
$("draw").addEventListener("click", e=>{ const g=e.target.closest("[data-part]"); if(g) pick(+g.dataset.part); });
$("draw").addEventListener("keydown", e=>{ if(e.key!=="Enter"&&e.key!==" ") return; const g=e.target.closest("[data-part]"); if(g){ e.preventDefault(); pick(+g.dataset.part); } });

// Scan de code-barres depuis une photo (BarcodeDetector natif, sinon ZXing)
$("cam").addEventListener("change", async e=>{
  const f = e.target.files[0]; e.target.value=""; if(!f) return;
  $("id-msg").className="msg"; $("id-msg").textContent="Lecture du code-barres…";
  try{
    let code = null;
    if("BarcodeDetector" in window){
      try{ const r = await new BarcodeDetector().detect(await createImageBitmap(f)); code = r[0]?.rawValue || null; }catch(_){}
    }
    if(!code && window.ZXing){
      const url = URL.createObjectURL(f);
      try{ code = (await new ZXing.BrowserMultiFormatReader().decodeFromImageUrl(url)).getText(); }catch(_){} finally{ URL.revokeObjectURL(url); }
    }
    if(code){ $("ref").value = code; lookup(code,"Code-barres"); }
    else { $("id-msg").className="msg err"; $("id-msg").textContent="Aucun code-barres lisible sur la photo. Rapprochez-vous, évitez les reflets, ou tapez la référence de la plaque signalétique."; }
  }catch(err){ $("id-msg").className="msg err"; $("id-msg").textContent="Impossible de lire cette image. Essayez une autre photo."; }
});

// ---------- Claude (optionnel) : lecture de plaque et diagnostic libre ----------
let sample = null, ctl = null;
const SAMPLE_ERR = c => ({rate_limited:"Trop de demandes pour le moment, réessayez dans un instant.", image_rejected:"Cette image n'est pas exploitable, essayez une autre photo.", refused:"Claude n'a pas pu traiter cette demande, reformulez-la.", invalid_json:"Réponse illisible, réessayez.", session_expired:"Reconnectez-vous à Claude pour utiliser cette fonction."}[c] || "Le service n'a pas répondu, réessayez.");
const HIDE = ["not_granted","sampling_disabled","not_declared","capability_disabled","capability_removed"];

(async()=>{
  try{ sample = await window.claude?.use?.("sample"); }catch(_){ sample = null; }
  if(!sample) return;
  $("ai").hidden = false;
  const lim = await sample.limits().catch(()=>null);
  if(lim?.images){ $("plate-lbl").hidden = false; $("plate").accept = lim.images.mediaTypes.join(","); }
})();

$("plate").addEventListener("change", async e=>{
  const f = e.target.files[0]; e.target.value=""; if(!f||!sample) return;
  $("id-msg").className="msg"; $("id-msg").textContent="Lecture de la plaque signalétique…";
  try{
    const r = await sample.json('Cette photo montre la plaque signalétique d\'un appareil électroménager ou électroportatif. Lis-la et réponds uniquement avec un objet JSON {"marque": string|null, "modele": string|null, "codes": string[]} où "codes" liste les références produit lisibles (E-Nr, PNC, 12NC, Type, EAN…). Exemple : {"marque":"Bosch","modele":"WAN28208FF","codes":["WAN28208FF/01"]}', {images:f, modelTier:"quick"});
    const cands = [r?.modele, ...(Array.isArray(r?.codes)?r.codes:[])].filter(Boolean).map(String);
    const hit = cands.map(findApp).find(Boolean);
    if(hit){ $("ref").value = cands[0]; load(hit, `Plaque lue : ${[r.marque, r.modele].filter(Boolean).join(" ")}. Appareil trouvé.`); }
    else { $("id-msg").className="msg err"; $("id-msg").textContent = `Plaque lue : ${[r?.marque, r?.modele, ...cands.slice(1)].filter(Boolean).join(" · ") || "aucune référence lisible"}. Cet appareil n'est pas dans le catalogue de démo.`; }
  }catch(err){
    if(HIDE.includes(err.code)||err.code==="images_unavailable"){ $("plate-lbl").hidden = true; $("id-msg").textContent=""; }
    else { $("id-msg").className="msg err"; $("id-msg").textContent = SAMPLE_ERR(err.code); }
  }
});

$("stop").addEventListener("click", ()=>ctl?.abort());
$("ask").addEventListener("click", async ()=>{
  const txt = $("free").value.trim(); if(!txt||!sample) return;
  ctl = new AbortController();
  $("ask").disabled = true; $("stop").hidden = false; $("ai-msg").className="msg"; $("ai-msg").textContent="Analyse en cours…";
  const nomenclature = app.parts.map(p=>`${p.n}. ${p.name}`).join("\n");
  const prompt = `Tu es technicien SAV en électroménager et outillage. Appareil : ${app.type}, ${app.brand} ${app.model}.
Nomenclature (numéro. pièce) :
${nomenclature}

Symptôme décrit par l'utilisateur : """${txt.slice(0,2000)}"""

Réponds uniquement avec un objet JSON :
{"diagnostic": "2 phrases max, en français", "pieces": [numéros des pièces à contrôler, de la plus probable à la moins probable, 3 max], "etapes": ["3 étapes de contrôle concrètes et sûres, courtes"], "difficulte": "Facile"|"Moyen"|"Difficile", "pro": true si l'intervention est dangereuse (gaz, haute tension, fluide frigorigène) sinon false}`;
  try{
    const r = await sample.json(prompt, {signal:ctl.signal});
    const nums = (Array.isArray(r?.pieces)?r.pieces:[]).map(Number).filter(n=>app.parts.some(p=>p.n===n)).slice(0,3);
    activeSym = null; suspects = new Set(nums); selected = null; renderApp();
    const box = $("diag"); box.hidden = false;
    const names = nums.map(n=>app.parts.find(p=>p.n===n)).map(p=>`<b>${p.n}. ${esc(p.name)}</b>`).join(", ") || "aucune pièce identifiée";
    box.innerHTML = `<div class="eyebrow">Diagnostic Claude · difficulté ${esc(r?.difficulte||"?")}</div>
      <p>${esc(r?.diagnostic||"")}</p><p>Pièces à contrôler : ${names}.</p>
      <ol>${(Array.isArray(r?.etapes)?r.etapes:[]).slice(0,4).map(t=>`<li>${esc(t)}</li>`).join("")}</ol>
      <p class="note">${r?.pro ? "Intervention à confier à un professionnel." : "Débranchez toujours l'appareil avant d'intervenir."}</p>`;
    $("ai-msg").textContent = "";
  }catch(err){
    if(err.code==="cancelled") $("ai-msg").textContent="";
    else if(HIDE.includes(err.code)) $("ai").hidden = true;
    else { $("ai-msg").className="msg err"; $("ai-msg").textContent = SAMPLE_ERR(err.code); }
  }finally{ $("ask").disabled=false; $("stop").hidden=true; }
});

// État initial : lave-linge de démo, symptôme « ne vidange plus » sélectionné
activeSym = "vid"; suspects = new Set([10]);
renderApp();
