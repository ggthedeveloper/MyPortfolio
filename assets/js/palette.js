// Command palette: Ctrl+K / ⌘K (or the footer hint) opens a searchable list of sections and actions.
(() => {
  const onHome = !!document.getElementById("about");
  const data = typeof PORTFOLIO_DATA !== "undefined" ? PORTFOLIO_DATA : {};
  const EMAIL = "ggraipurchor@gmail.com";

  const go = (id) => {
    if (onHome) document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    else window.location.href = `index.html#${id}`;
  };
  const open = (url) => window.open(url, "_blank", "noopener");

  const toast = (text) => {
    let el = document.querySelector(".cmd-toast");
    if (!el) {
      el = document.createElement("div");
      el.className = "cmd-toast";
      el.setAttribute("role", "status");
      document.body.appendChild(el);
    }
    el.textContent = text;
    el.classList.add("show");
    clearTimeout(el._t);
    el._t = setTimeout(() => el.classList.remove("show"), 1800);
  };

  const commands = [
    ...[
      ["experience", "Experience"], ["projects", "Projects"], ["research", "Research & Simulator"], ["education", "Education"],
      ["skills", "Skills"], ["achievements", "Achievements & Certifications"],
      ["leadership", "Leadership & Volunteering"], ["journey", "Timeline"], ["contact", "Contact"]
    ].map(([id, label]) => ({ group: "Go to", label, keywords: id, run: () => go(id) })),
    ...(data.projects || []).map((p) => ({
      group: "Projects",
      label: p.title.split(":")[0].trim(),
      keywords: p.title,
      run: () => { window.open(p.link, "_blank", "noopener"); }
    })),
    { group: "Actions", label: "Open Developer CLI Terminal (`~`)", keywords: "terminal cli console bash", run: () => {
      document.getElementById("cli-modal")?.classList.add("open");
      setTimeout(() => document.getElementById("cli-input")?.focus(), 100);
    } },
    ...(typeof setChatMode === "function" && document.getElementById("chat-panel") ? [
      { group: "Actions", label: "Ask my AI assistant", keywords: "chat ai question", run: () => setChatMode("ai") },
      { group: "Actions", label: "Send a message", keywords: "chat contact email hire", run: () => setChatMode("message") }
    ] : []),
    { group: "Actions", label: "Copy email address", keywords: EMAIL, run: () => {
      navigator.clipboard?.writeText(EMAIL).then(() => toast("Email copied"), () => toast(EMAIL));
    } },
    { group: "Actions", label: "Switch light / dark theme", keywords: "theme mode", run: () => document.getElementById("theme-toggle")?.click() },
    { group: "Links", label: "GitHub · ggthedeveloper", keywords: "code repos", run: () => open("https://github.com/ggthedeveloper") },
    { group: "Links", label: "LinkedIn · ggthedeveloper", keywords: "profile", run: () => open("https://www.linkedin.com/in/ggthedeveloper") }
  ];

  const root = document.createElement("div");
  root.className = "cmd";
  root.hidden = true;
  root.innerHTML = `
    <div class="cmd-backdrop" data-cmd-close></div>
    <div class="cmd-box" role="dialog" aria-modal="true" aria-label="Command menu">
      <div class="cmd-search">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
        <input type="text" placeholder="Search sections and actions…" aria-label="Search commands" autocomplete="off" spellcheck="false">
        <kbd>Esc</kbd>
      </div>
      <ul class="cmd-list" role="listbox"></ul>
      <div class="cmd-foot"><span><kbd>↑</kbd><kbd>↓</kbd> navigate</span><span><kbd>↵</kbd> select</span></div>
    </div>`;
  document.body.appendChild(root);

  const input = root.querySelector("input");
  const list = root.querySelector(".cmd-list");
  let results = commands;
  let active = 0;
  let lastFocus = null;

  function renderList() {
    const q = input.value.trim().toLowerCase();
    results = commands.filter((c) => !q || `${c.label} ${c.keywords} ${c.group}`.toLowerCase().includes(q));
    active = Math.min(active, Math.max(results.length - 1, 0));
    let group = "";
    list.innerHTML = results.length ? results.map((c, i) => {
      const header = c.group !== group ? `<li class="cmd-group" role="presentation">${(group = c.group)}</li>` : "";
      return `${header}<li class="cmd-item${i === active ? " active" : ""}" role="option" aria-selected="${i === active}" data-i="${i}">${c.label}</li>`;
    }).join("") : '<li class="cmd-empty">No matches</li>';
    list.querySelector(".cmd-item.active")?.scrollIntoView({ block: "nearest" });
  }

  function openPalette() {
    lastFocus = document.activeElement;
    root.hidden = false;
    input.value = "";
    active = 0;
    renderList();
    input.focus();
  }

  function closePalette() {
    root.hidden = true;
    lastFocus?.focus?.();
  }

  function runActive(i = active) {
    const cmd = results[i];
    if (!cmd) return;
    closePalette();
    cmd.run();
  }

  input.addEventListener("input", () => { active = 0; renderList(); });
  list.addEventListener("click", (e) => {
    const item = e.target.closest(".cmd-item");
    if (item) runActive(Number(item.dataset.i));
  });
  list.addEventListener("mousemove", (e) => {
    const item = e.target.closest(".cmd-item");
    if (item && Number(item.dataset.i) !== active) { active = Number(item.dataset.i); renderList(); }
  });
  root.addEventListener("click", (e) => { if (e.target.closest("[data-cmd-close]")) closePalette(); });

  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      root.hidden ? openPalette() : closePalette();
      return;
    }
    if (root.hidden) return;
    if (e.key === "Escape") { e.preventDefault(); closePalette(); }
    else if (e.key === "ArrowDown") { e.preventDefault(); active = (active + 1) % Math.max(results.length, 1); renderList(); }
    else if (e.key === "ArrowUp") { e.preventDefault(); active = (active - 1 + results.length) % Math.max(results.length, 1); renderList(); }
    else if (e.key === "Enter") { e.preventDefault(); runActive(); }
  });

  document.querySelectorAll("[data-open-palette]").forEach((btn) => btn.addEventListener("click", openPalette));

  // Show the shortcut the visitor's keyboard actually uses.
  if (/Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent)) {
    document.querySelectorAll(".nav-kbd").forEach((k) => { k.textContent = "⌘K"; });
    document.querySelectorAll(".footer-cmd kbd:first-child").forEach((k) => { k.textContent = "⌘"; });
  }
})();
