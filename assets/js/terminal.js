/* Command prompt in the bottom-left corner, shared by every page.
   Anything that means "work / portfolio / projects" opens the portfolio; anything else gets an error. */
(() => {
  const term = document.getElementById("term");
  if (!term) return;
  const input = term.querySelector("input"), text = term.querySelector(".term-text"),
        ph = term.querySelector(".term-ph"), out = term.querySelector(".term-out");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const page = document.body.dataset.page; // "home" | "portfolio"

  const T = {
    pt: {
      ph: "digite o código",
      label: "Terminal: digite o código",
      open: "acesso liberado › abrindo",
      here: "você já está aqui ;)",
      hint: "dica: procurando meus trabalhos? tente “portfolio”",
      errors: [
        "ERRO 0x404: código “$” não encontrado",
        "acesso negado: “$” não é um código válido",
        "“$” não é reconhecido como um comando interno",
        "PANE 0xDEAD: o código “$” corrompeu a memória",
        "segmentation fault (core dumped)",
        "ERRO 418: eu sou um bule de chá",
        "permissão negada. nível de acesso insuficiente",
        "kernel panic: tente outro código"
      ]
    },
    en: {
      ph: "enter the code",
      label: "Terminal: enter the code",
      open: "access granted › opening",
      here: "you are already here ;)",
      hint: "hint: looking for my work? try “portfolio”",
      errors: [
        "ERROR 0x404: code “$” not found",
        "access denied: “$” is not a valid code",
        "“$” is not recognized as an internal command",
        "FAILURE 0xDEAD: code “$” corrupted memory",
        "segmentation fault (core dumped)",
        "ERROR 418: I'm a teapot",
        "permission denied. insufficient access level",
        "kernel panic: try another code"
      ]
    }
  };
  const lang = () => document.documentElement.lang.startsWith("pt") ? "pt" : "en";

  // keys are matched against the input without accents, spaces or symbols ("cd ./Portfólio" -> "cdportfolio")
  const ROUTES = [
    { name: "iskeld",       to: "portfolio.html#iskeld",       has: ["iskeld", "valinor", "mmorpg"] },
    // section commented out in portfolio.html; uncomment together with it
    // { name: "certificados", to: "portfolio.html#certificados", has: ["certif"] },
    { name: "sobre",        to: "portfolio.html#sobre",        has: ["sobre", "about", "whoami", "curriculo", "resume", "cv"] },
    { name: "contato",      to: "portfolio.html#contato",      has: ["contat", "contact", "email"] },
    { name: "portfolio",    to: "portfolio.html",
      has: ["portf", "portif", "trabalh", "projet", "project", "work", "job", "case", "jogo", "game", "app", "apps","codigo", "code", "ls", "dir"] },
    { name: "home",         to: "index.html",                  is: ["home", "inicio", "voltar", "back", "cd", "exit", "sair", "index", "studio"] }
  ];
  const norm = s => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]/g, "");
  const match = s => ROUTES.find(r => (r.is && r.is.includes(s)) || (r.has && r.has.some(k => k.length <= 3 ? s === k : s.includes(k))));

  /* ---------- drawing our own text + blinking cursor ---------- */
  function render(){
    text.textContent = input.value;
    ph.textContent = input.value ? "" : T[lang()].ph;
  }
  function setLang(){ input.setAttribute("aria-label", T[lang()].label); render(); }
  new MutationObserver(setLang).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
  setLang();
  input.addEventListener("input", render);

  function say(msg, cls, ms = 4200){
    const row = document.createElement("div");
    row.className = cls;
    row.textContent = "> " + msg;
    out.appendChild(row);
    while (out.children.length > 3) out.firstChild.remove();
    setTimeout(() => { row.classList.add("gone"); setTimeout(() => row.remove(), 600); }, ms);
  }
  const glitch = big => document.dispatchEvent(new CustomEvent("pw:glitch", { detail: { big } }));

  let fails = 0, lastErr = -1;
  term.addEventListener("submit", e => {
    e.preventDefault();
    const raw = input.value.trim(), s = norm(raw);
    input.value = ""; render();
    if (!raw) return;
    const r = s && match(s);

    if (!r){
      const list = T[lang()].errors;
      let i; do { i = Math.random() * list.length | 0; } while (i === lastErr && list.length > 1);
      lastErr = i;
      say(list[i].replace("$", raw.slice(0, 18)), "err");
      if (++fails >= 2 && fails % 2 === 0) setTimeout(() => say(T[lang()].hint, "hint", 6000), 350);
      glitch(fails % 3 === 0);
      if (!reduce){ term.classList.remove("shake"); void term.offsetWidth; term.classList.add("shake"); }
      return;
    }

    fails = 0;
    const [file, hash] = r.to.split("#");
    const samePage = (page === "home" && file === "index.html") || (page === "portfolio" && file === "portfolio.html");
    if (samePage && !hash){
      if (page === "portfolio") scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
      say(T[lang()].here, "ok");
      return;
    }
    say(`${T[lang()].open} ${r.name}...`, "ok");
    glitch(true);
    if (samePage){
      document.getElementById(hash)?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
      history.replaceState(null, "", "#" + hash);
      return;
    }
    setTimeout(() => { location.href = r.to; }, reduce ? 0 : 650);
  });
  term.addEventListener("animationend", () => term.classList.remove("shake"));

  // typing anywhere on the page jumps into the prompt
  addEventListener("keydown", e => {
    if (term.classList.contains("hidden") || e.ctrlKey || e.metaKey || e.altKey || e.key.length !== 1) return;
    const a = document.activeElement;
    if (a === input || (a && (a.tagName === "INPUT" || a.tagName === "TEXTAREA" || a.isContentEditable))) return;
    if (e.key === " " && a && a !== document.body) return; // keep space for buttons/links
    input.focus();
  });
})();
