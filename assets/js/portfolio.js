(() => {
  const T = {
    pt: {
      title: "PORTFOLIO",
      lead: "Games, apps e experimentos — compilados por Philippe Wanuty.",
      homeLabel: "Voltar ao início — Philippe Wanuty Studio",
      count: "1 arquivo encontrado",
      kType: "tipo", kPlat: "plataforma",
      iskeldDesc: "Um RPG online em 3D que roda direto na aba do navegador, sem download, no PC e no celular. Um mundo que remete a eras antigas, com regras de MMO dos anos 2000: lute, explore, colete e colecione.",
      iskeldType: "MMORPG 3D de fã",
      iskeldPlat: "navegador · PC · celular",
      wip: "em desenvolvimento",
      visit: "visitar",
      about1: "Olá! Sou o Philippe, de Natal-RN, e transformo imaginação em código. Depois de mais de 10 anos no comércio — de vendedor a gerente —, mudei de rota para a tecnologia, levando na bagagem comunicação, colaboração, negociação e liderança.",
      about2: "Hoje crio games e apps no Philippe Wanuty Studio, e sigo estudando todo dia para programar melhor.",
      // carreira + certificados: seções comentadas em portfolio.html, textos guardados para quando voltarem
      log1: "Análise e Desenvolvimento de Sistemas — Faculdade Descomplica",
      log2: "Gestor — Casa das Cortinas e Persianas",
      log3: "Líder de equipe de vendas — Casa das Cortinas e Persianas",
      log4: "Vendedor — Casa das Cortinas e Persianas",
      verify: "verificar",
      place: "Natal-RN, Brasil"
    },
    en: {
      title: "PORTFOLIO",
      lead: "Games, apps and experiments — compiled by Philippe Wanuty.",
      homeLabel: "Back to home — Philippe Wanuty Studio",
      count: "1 file found",
      kType: "type", kPlat: "platform",
      iskeldDesc: "A 3D online RPG that runs right in the browser tab, no download, on PC and mobile. A world that echoes ancient ages, with 2000s MMO rules: fight, explore, gather and collect.",
      iskeldType: "fan-made 3D MMORPG",
      iskeldPlat: "browser · PC · mobile",
      wip: "in development",
      visit: "visit",
      about1: "Hi! I'm Philippe, from Natal, Brazil, and I turn imagination into code. After more than 10 years in retail — from salesman to manager — I changed course into tech, bringing communication, collaboration, negotiation and leadership along.",
      about2: "Today I build games and apps at Philippe Wanuty Studio, and I keep studying every day to code better.",
      // career + certificates: sections commented out in portfolio.html
      log1: "Systems Analysis and Development — Faculdade Descomplica",
      log2: "Manager — Casa das Cortinas e Persianas",
      log3: "Sales team lead — Casa das Cortinas e Persianas",
      log4: "Salesman — Casa das Cortinas e Persianas",
      verify: "verify",
      place: "Natal, Brazil"
    }
  };

  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = id => document.getElementById(id);
  const title = $("title");

  /* ---------- text decode effect (same as the landing page) ---------- */
  const GLYPHS = "!<>-_\\/[]{}=+*^?#01░▒▓";
  function scramble(el, text){
    if (reduce){ el.textContent = text; return; }
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

  /* ---------- language ---------- */
  let lang;
  try { lang = localStorage.getItem("pw-lang"); } catch(e) {}
  if (!T[lang]) lang = (navigator.language || "pt").toLowerCase().startsWith("pt") ? "pt" : "en";

  function apply(animate){
    document.documentElement.lang = lang === "pt" ? "pt-BR" : "en";
    document.title = (lang === "pt" ? "Portfólio" : "Portfolio") + " — Philippe Wanuty Studio";
    document.querySelectorAll(".lang button").forEach(b =>
      b.setAttribute("aria-pressed", b.dataset.lang === lang ? "true" : "false"));
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const s = T[lang][el.dataset.i18n];
      if (s == null) return;
      animate && el === title ? scramble(el, s) : (el.textContent = s);
    });
    document.querySelectorAll("[data-i18n-label]").forEach(el =>
      el.setAttribute("aria-label", T[lang][el.dataset.i18nLabel]));
  }
  apply(false);

  document.querySelectorAll(".lang button").forEach(b => b.addEventListener("click", () => {
    if (b.dataset.lang === lang) return;
    lang = b.dataset.lang;
    try { localStorage.setItem("pw-lang", lang); } catch(e) {}
    apply(true);
    titleGlitch();
  }));

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

  /* ---------- glitches ---------- */
  function titleGlitch(){
    if (reduce) return;
    title.classList.remove("glitch"); void title.offsetWidth; title.classList.add("glitch");
  }
  title.addEventListener("animationend", () => title.classList.remove("glitch"));
  function pane(){
    if (reduce || document.body.classList.contains("pane")) return;
    document.documentElement.classList.add("flash");
    setTimeout(() => document.documentElement.classList.remove("flash"), 60);
    document.body.classList.add("pane");
    cv.style.opacity = .3;
    setTimeout(() => { document.body.classList.remove("pane"); cv.style.opacity = .05; }, 450);
  }
  // the bottom-left terminal asks for a glitch on wrong / right codes
  document.addEventListener("pw:glitch", e => e.detail.big ? pane() : titleGlitch());
  if (!reduce) (function idle(){ setTimeout(() => { titleGlitch(); idle(); }, 3500 + Math.random() * 5000); })();

  /* ---------- section commands type themselves when scrolled into view ---------- */
  const cmds = document.querySelectorAll("[data-type]");
  if (!reduce && "IntersectionObserver" in window){
    const type = async el => {
      const full = el.dataset.full;
      el.classList.add("typing");
      for (const ch of full){ el.textContent += ch; await new Promise(r => setTimeout(r, 28)); }
      setTimeout(() => el.classList.remove("typing"), 900);
    };
    const io = new IntersectionObserver(entries => entries.forEach(en => {
      if (!en.isIntersecting) return;
      io.unobserve(en.target);
      type(en.target);
    }), { threshold: 0.6 });
    cmds.forEach(el => {
      el.dataset.full = el.textContent;
      el.setAttribute("aria-label", el.textContent.replace(/^>\s*/, ""));
      el.textContent = "";
      io.observe(el);
    });
    // intro: decode the title once the first command is typed
    const t = title.textContent; title.textContent = "";
    setTimeout(() => scramble(title, t), 420);
  }
})();
