(() => {
  const T = {
    pt: {
      tag: "Criação de games e apps inteligentes",
      hint: "clique para pular",
      pane: "!! PANE NO SISTEMA !!",
      recover: "recuperando...",
      boot: [
        "> iniciando pw_studio.exe",
        "> carregando módulos de IA .......... OK",
        "> compilando sprites ................ OK",
        "> ERRO 0x0F4: pane no núcleo gráfico",
        "> reiniciando ...",
        "> acesso liberado"
      ]
    },
    en: {
      tag: "Games and smart apps, built from scratch",
      hint: "click to skip",
      pane: "!! SYSTEM FAILURE !!",
      recover: "recovering...",
      boot: [
        "> starting pw_studio.exe",
        "> loading AI modules ............... OK",
        "> compiling sprites ................ OK",
        "> ERROR 0x0F4: graphics core failure",
        "> rebooting ...",
        "> access granted"
      ]
    }
  };

  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = id => document.getElementById(id);
  const logo = $("logo"), title = $("title"), tag = $("tag"), mail = $("mail"), paneMsg = $("paneMsg");
  const sleep = ms => new Promise(r => setTimeout(r, ms));

  /* ---------- language ---------- */
  let lang;
  try { lang = localStorage.getItem("pw-lang"); } catch(e) {}
  if (!T[lang]) lang = (navigator.language || "pt").toLowerCase().startsWith("pt") ? "pt" : "en";

  function markFlags(){
    document.querySelectorAll(".lang button").forEach(b =>
      b.setAttribute("aria-pressed", b.dataset.lang === lang ? "true" : "false"));
    document.documentElement.lang = lang === "pt" ? "pt-BR" : "en";
  }
  markFlags();

  document.querySelectorAll(".lang button").forEach(b => b.addEventListener("click", () => {
    if (b.dataset.lang === lang) return;
    lang = b.dataset.lang;
    try { localStorage.setItem("pw-lang", lang); } catch(e) {}
    markFlags();
    minorGlitch();
    reduce ? (tag.textContent = T[lang].tag) : scramble(tag, T[lang].tag);
  }));

  /* ---------- text decode effect ---------- */
  const GLYPHS = "!<>-_\\/[]{}=+*^?#01░▒▓";
  function scramble(el, text){
    const old = el.textContent, len = Math.max(old.length, text.length), q = [];
    for (let i = 0; i < len; i++){
      const s = Math.random() * 18 | 0;
      q.push({ from: old[i] || "", to: text[i] || "", s, e: s + 8 + (Math.random() * 22 | 0) });
    }
    let f = 0; cancelAnimationFrame(el._raf);
    const tick = () => {
      let out = "", done = 0;
      for (const c of q){
        if (f >= c.e){ out += c.to; done++; }
        else if (f >= c.s) out += GLYPHS[Math.random() * GLYPHS.length | 0];
        else out += c.from;
      }
      el.textContent = out;
      if (done < q.length){ f++; el._raf = requestAnimationFrame(tick); }
    };
    tick();
  }

  /* ---------- noise ---------- */
  const cv = $("noise"), ctx = cv.getContext("2d");
  cv.width = 160; cv.height = 100;
  const img = ctx.createImageData(160, 100);
  function noise(){
    const d = img.data;
    for (let i = 0; i < d.length; i += 4){ const v = Math.random() * 255 | 0; d[i] = d[i+1] = d[i+2] = v; d[i+3] = 255; }
    ctx.putImageData(img, 0, 0);
  }
  noise();
  if (!reduce) setInterval(noise, 70);
  const setNoise = v => cv.style.opacity = v;

  /* ---------- glitches ---------- */
  function minorGlitch(){
    if (reduce) return;
    logo.classList.add("glitch");
    setTimeout(() => logo.classList.remove("glitch"), 110 + Math.random() * 240);
  }
  function flash(ms = 70){
    if (reduce) return;
    document.documentElement.classList.add("flash");
    setTimeout(() => document.documentElement.classList.remove("flash"), ms);
  }
  function pane(){
    if (reduce || document.body.classList.contains("pane")) return;
    flash();
    document.body.classList.add("pane");
    logo.classList.add("glitch");
    paneMsg.textContent = T[lang].pane;
    setNoise(.3);
    setTimeout(() => paneMsg.textContent = T[lang].recover, 650);
    setTimeout(() => {
      document.body.classList.remove("pane");
      logo.classList.remove("glitch");
      setNoise(.05);
      scramble(title, "PHILIPPE WANUTY STUDIO");
    }, 1150);
  }
  // glitch into the Hero portrait, hold it for a moment, glitch back to the mark
  function faceGlitch(){
    if (reduce || logo.classList.contains("face-on") || document.body.classList.contains("pane")) return;
    const hold = 900 + Math.random() * 600;
    logo.classList.add("glitch");
    setTimeout(() => logo.classList.add("face-on"), 140);
    setTimeout(() => logo.classList.remove("glitch"), 300);
    setTimeout(() => logo.classList.add("glitch"), 300 + hold);
    setTimeout(() => logo.classList.remove("face-on"), 440 + hold);
    setTimeout(() => logo.classList.remove("glitch"), 600 + hold);
  }
  let firstIdle = true;
  function idle(){
    setTimeout(() => {
      const r = Math.random();
      if (firstIdle) faceGlitch();
      else if (r < .16) pane();
      else if (r < .34) faceGlitch();
      else minorGlitch();
      firstIdle = false;
      idle();
    }, 2200 + Math.random() * 4200);
  }
  logo.addEventListener("click", pane);
  // the bottom-left terminal asks for a glitch on wrong / right codes
  document.addEventListener("pw:glitch", e => e.detail.big ? pane() : minorGlitch());
  const term = $("term");

  /* ---------- reveal ---------- */
  async function reveal(){
    tag.textContent = "";
    if (reduce){
      logo.classList.add("filled");
      tag.textContent = T[lang].tag;
      [title, tag, mail, term].forEach(e => e.classList.replace("hidden", "show"));
      return;
    }
    logo.classList.add("draw");
    await sleep(1500);
    flash(50);
    logo.classList.add("filled");
    minorGlitch();
    title.classList.replace("hidden", "show");
    title.textContent = "";
    scramble(title, "PHILIPPE WANUTY STUDIO");
    await sleep(450);
    tag.classList.replace("hidden", "show");
    scramble(tag, T[lang].tag);
    await sleep(600);
    mail.classList.replace("hidden", "show");
    term.classList.replace("hidden", "show");
    idle();
  }

  /* ---------- boot sequence ---------- */
  async function boot(){
    const box = $("boot"), lines = $("bootLines");
    if (reduce){ box.remove(); reveal(); return; }
    let skip = false;
    const doSkip = () => skip = true;
    box.addEventListener("click", doSkip);
    addEventListener("keydown", doSkip, { once: true });
    $("bootHint").textContent = T[lang].hint;

    for (const l of T[lang].boot){
      if (skip) break;
      const row = document.createElement("div");
      const err = /0x0F4/.test(l);
      if (err) row.className = "err";
      lines.appendChild(row);
      for (const ch of l){ if (skip) break; row.textContent += ch; await sleep(11); }
      if (err){ flash(60); setNoise(.25); await sleep(380); setNoise(.05); }
      else await sleep(110);
    }
    box.classList.add("out");
    await sleep(350);
    box.remove();
    reveal();
  }

  boot();
})();
