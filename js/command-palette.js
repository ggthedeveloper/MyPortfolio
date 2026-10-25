/**
 * Gaurav Gautam Portfolio — Command Palette Engine (`Cmd+K` / `Ctrl+K`)
 * High-speed developer interface for recruiters, researchers & collaborators.
 * Fully keyboard accessible (Arrow keys, Enter, Escape).
 */

document.addEventListener("DOMContentLoaded", () => {
  const paletteModal = document.getElementById("command-palette-modal");
  const paletteInput = document.getElementById("palette-search-input");
  const paletteResults = document.getElementById("palette-results-list");
  const paletteTriggerBtn = document.getElementById("palette-trigger-btn");
  const mobilePaletteTrigger = document.getElementById("mobile-palette-trigger");

  if (!paletteModal || !paletteInput || !paletteResults) return;

  const COMMANDS = [
    {
      category: "Navigation & Sections",
      items: [
        { title: "Selected Work & Systems", desc: "Jump to hackathon finalists & live deployments", action: () => navigateTo("#work") },
        { title: "Transformer Compression Research", desc: "Explore CoFi pruning & QA-LoRA adaptation", action: () => navigateTo("#research") },
        { title: "Interactive Research Lab", desc: "Play with the live pruning & sparsity simulator", action: () => navigateTo("#interactive-lab") },
        { title: "About & Academic Foundation", desc: "View SRM University-AP education & CGPA 9.49", action: () => navigateTo("#about") },
        { title: "Leadership & Credentials", desc: "Coding Club Convenor & MongoDB certification", action: () => navigateTo("#credentials") },
        { title: "Contact & Collaboration", desc: "Get in touch via email or professional links", action: () => navigateTo("#contact") }
      ]
    },
    {
      category: "Projects & Live Prototypes",
      items: [
        { title: "VarshaPurvanumanAI (MoES / IMD)", desc: "SIH26080 rainfall downscaling & 150 automated tests", action: () => openProject("varshapurvanuman") },
        { title: "RailSamanvayAI (Ministry of Railways)", desc: "SIH26027 maintenance block optimization system", action: () => openProject("railsamanvay") },
        { title: "DrainSense AI (Vijayawada Hydrology)", desc: "810 grid cells urban flood forecasting with TreeSHAP", action: () => openProject("drainsense") },
        { title: "Smart Route Finder (OpenStreetMap)", desc: "Custom Dijkstra & A* pathfinding graph engine", action: () => openProject("smartroutefinder") },
        { title: "Space-Shooter-3D (WebGL / Three.js)", desc: "60-FPS arcade combat simulation in browser", action: () => window.open("https://ggthedeveloper.github.io/Space-Shooter-3D/", "_blank") }
      ]
    },
    {
      category: "Quick Actions & External",
      items: [
        { title: "Download Resume (PDF)", desc: "Verified authentic single-page ATS standard resume", action: () => downloadResume() },
        { title: "Toggle Theme (Dark / Light)", desc: "Switch between OLED dark and crisp balanced light", action: () => toggleTheme() },
        { title: "Toggle Audio Micro-Haptics", desc: "Turn sound feedback on or off (Web Audio API)", action: () => toggleSound() },
        { title: "Copy Email (ggraipurchor@gmail.com)", desc: "Copy primary contact email to clipboard", action: () => copyEmail() },
        { title: "GitHub Profile (@ggthedeveloper)", desc: "Inspect public repositories & commits", action: () => window.open("https://github.com/ggthedeveloper", "_blank") },
        { title: "LinkedIn Profile", desc: "View Gaurav's professional network & background", action: () => window.open("https://linkedin.com/in/ggthedeveloper", "_blank") }
      ]
    }
  ];

  let selectedIndex = 0;
  let flattenedItems = [];

  function openPalette() {
    paletteModal.classList.add("is-open");
    paletteModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    paletteInput.value = "";
    renderResults("");
    paletteInput.focus();
    window.soundFx?.playChime();
  }

  function closePalette() {
    paletteModal.classList.remove("is-open");
    paletteModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function navigateTo(hash) {
    closePalette();
    const target = document.querySelector(hash);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
      window.soundFx?.playTick();
    }
  }

  function openProject(projectId) {
    closePalette();
    const btn = document.querySelector(`[data-open-case-study="${projectId}"]`);
    if (btn) btn.click();
  }

  function downloadResume() {
    closePalette();
    const a = document.createElement("a");
    a.href = "assets/Gaurav_Gautam_Resume.pdf";
    a.download = "Gaurav_Gautam_Resume.pdf";
    a.click();
    window.soundFx?.playSuccess();
  }

  function toggleTheme() {
    closePalette();
    document.getElementById("theme-toggle-btn")?.click();
  }

  function toggleSound() {
    closePalette();
    document.getElementById("sound-toggle-btn")?.click();
  }

  function copyEmail() {
    closePalette();
    navigator.clipboard.writeText("ggraipurchor@gmail.com").then(() => {
      const toast = document.getElementById("copy-toast");
      if (toast) {
        toast.textContent = "Copied ggraipurchor@gmail.com to clipboard!";
        toast.classList.add("show");
        setTimeout(() => toast.classList.remove("show"), 3000);
      }
      window.soundFx?.playSuccess();
    });
  }

  function renderResults(query) {
    const q = query.toLowerCase().trim();
    flattenedItems = [];
    let html = "";

    COMMANDS.forEach((section) => {
      const filtered = section.items.filter(
        (item) => item.title.toLowerCase().includes(q) || item.desc.toLowerCase().includes(q)
      );

      if (filtered.length > 0) {
        html += `<div class="palette-category-title">${section.category}</div>`;
        filtered.forEach((item) => {
          const currentIndex = flattenedItems.length;
          flattenedItems.push(item);
          const isSelected = currentIndex === selectedIndex;
          html += `
            <div class="palette-item ${isSelected ? "selected" : ""}" data-index="${currentIndex}" role="option" aria-selected="${isSelected}">
              <div class="palette-item-text">
                <div class="palette-item-title">${item.title}</div>
                <div class="palette-item-desc">${item.desc}</div>
              </div>
              <div class="palette-item-key">↵</div>
            </div>`;
        });
      }
    });

    if (flattenedItems.length === 0) {
      html = `<div class="palette-empty-state">No matching commands found for "${query}"</div>`;
    }

    paletteResults.innerHTML = html;

    // Bind click events
    paletteResults.querySelectorAll(".palette-item").forEach((el) => {
      el.addEventListener("click", () => {
        const idx = parseInt(el.getAttribute("data-index"), 10);
        executeItem(idx);
      });
      el.addEventListener("mouseenter", () => {
        const idx = parseInt(el.getAttribute("data-index"), 10);
        selectedIndex = idx;
        updateSelectedVisuals();
      });
    });
  }

  function updateSelectedVisuals() {
    const items = paletteResults.querySelectorAll(".palette-item");
    items.forEach((item, idx) => {
      if (idx === selectedIndex) {
        item.classList.add("selected");
        item.scrollIntoView({ block: "nearest" });
      } else {
        item.classList.remove("selected");
      }
    });
  }

  function executeItem(index) {
    if (flattenedItems[index]) {
      flattenedItems[index].action();
      window.soundFx?.playTick();
    }
  }

  // Keyboard navigation & Shortcuts
  window.addEventListener("keydown", (e) => {
    // Cmd + K or Ctrl + K
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      if (paletteModal.classList.contains("is-open")) closePalette();
      else openPalette();
    }

    if (!paletteModal.classList.contains("is-open")) return;

    if (e.key === "Escape") {
      e.preventDefault();
      closePalette();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (flattenedItems.length > 0) {
        selectedIndex = (selectedIndex + 1) % flattenedItems.length;
        updateSelectedVisuals();
        window.soundFx?.playTick();
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (flattenedItems.length > 0) {
        selectedIndex = (selectedIndex - 1 + flattenedItems.length) % flattenedItems.length;
        updateSelectedVisuals();
        window.soundFx?.playTick();
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
      executeItem(selectedIndex);
    }
  });

  paletteInput.addEventListener("input", (e) => {
    selectedIndex = 0;
    renderResults(e.target.value);
  });

  paletteTriggerBtn?.addEventListener("click", openPalette);
  mobilePaletteTrigger?.addEventListener("click", openPalette);

  paletteModal.addEventListener("click", (e) => {
    if (e.target === paletteModal) closePalette();
  });
});
