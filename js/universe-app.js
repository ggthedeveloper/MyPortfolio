/**
 * THE GAURAV GAUTAM COSMOS — Application Orchestrator
 * Integrates 3D Solar System, Planetary Telemetry HUD, Recruiter Dossier, and Audio
 */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Initialize Universe Engine
  const universe = new UniverseEngine("universe-canvas");
  window.universe = universe;

  // 2. DOM Elements
  const planetaryTerminal = document.getElementById("planetary-terminal");
  const terminalMeta = document.getElementById("terminal-meta");
  const terminalTitle = document.getElementById("terminal-title");
  const terminalSubtitle = document.getElementById("terminal-subtitle");
  const terminalContent = document.getElementById("terminal-content");
  const terminalCloseBtn = document.getElementById("terminal-close-btn");
  const terminalDemoLink = document.getElementById("terminal-demo-link");
  const terminalGithubLink = document.getElementById("terminal-github-link");

  const soundBtn = document.getElementById("hud-sound-btn");
  const dossierBtn = document.getElementById("hud-dossier-btn");
  const dossierOverlay = document.getElementById("recruiter-dossier-modal");
  const dossierCloseBtn = document.getElementById("dossier-close-btn");
  const warpPills = document.querySelectorAll(".warp-pill-btn");

  // 3. Audio Toggle
  if (soundBtn) {
    soundBtn.addEventListener("click", () => {
      const isEnabled = window.spaceAudio?.toggle();
      if (isEnabled) {
        soundBtn.classList.add("is-active");
        soundBtn.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
        `;
        window.spaceAudio?.playOrbitLock();
      } else {
        soundBtn.classList.remove("is-active");
        soundBtn.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>
        `;
      }
    });
  }

  // 4. Dossier Mode Toggle
  function openDossier() {
    dossierOverlay?.classList.add("is-open");
    dossierOverlay?.setAttribute("aria-hidden", "false");
    window.spaceAudio?.playOrbitLock();
  }

  function closeDossier() {
    dossierOverlay?.classList.remove("is-open");
    dossierOverlay?.setAttribute("aria-hidden", "true");
    window.spaceAudio?.playTick();
  }

  dossierBtn?.addEventListener("click", openDossier);
  dossierCloseBtn?.addEventListener("click", closeDossier);

  // 5. Warp Dock Pill Buttons
  warpPills.forEach((pill) => {
    pill.addEventListener("click", () => {
      const targetId = pill.getAttribute("data-warp-target");
      warpPills.forEach((p) => p.classList.remove("active"));
      pill.classList.add("active");
      universe.warpToBody(targetId);
    });
  });

  // 6. Global Hook: When a planet is clicked or selected
  window.onPlanetSelected = function (data) {
    if (!planetaryTerminal || typeof PORTFOLIO_DATA === "undefined") return;

    // Update Warp Pill Active State
    warpPills.forEach((pill) => {
      if (pill.getAttribute("data-warp-target") === data.id) pill.classList.add("active");
      else pill.classList.remove("active");
    });

    terminalMeta.textContent = `ORBITAL SECTOR // ${data.category || "CELESTIAL SYSTEM"}`;
    terminalTitle.textContent = data.name;
    terminalSubtitle.textContent = data.subtitle;

    let contentHtml = "";

    // A. If Central Star
    if (data.id === "core") {
      contentHtml = `
        <div class="terminal-field-box">
          <div class="terminal-field-title">Stellar Nexus Profile</div>
          <div class="terminal-field-body">
            Gaurav Gautam is an undergraduate researcher and software engineer at SRM University-AP maintaining a <strong>9.49/10.0 CGPA</strong>. Specialized in efficient deep learning, structured Transformer pruning, and high-reliability systems engineering.
          </div>
          <div class="terminal-metrics-callout">
            ★ Core Star: 21 Public Repositories · 150+ Automated Tests · &gt;95% Retained Accuracy
          </div>
        </div>

        <div class="terminal-field-box">
          <div class="terminal-field-title">Planetary Navigation Guide</div>
          <div class="terminal-field-body">
            Use the Warp Dock below or click directly on any orbiting planet to initiate warp flight and inspect the project architecture, verified metrics, and live deployments.
          </div>
        </div>
      `;
      if (terminalDemoLink) terminalDemoLink.style.display = "none";
      if (terminalGithubLink) {
        terminalGithubLink.href = "https://github.com/ggthedeveloper";
        terminalGithubLink.style.display = "inline-flex";
      }
    }
    // B. If Research Observatory
    else if (data.id === "research") {
      const iit = PORTFOLIO_DATA.research[0];
      const srm = PORTFOLIO_DATA.research[1];
      contentHtml = `
        <div class="terminal-field-box">
          <div class="terminal-field-title">IIT Bhubaneswar Research Internship</div>
          <div class="terminal-field-body">
            <strong>${iit.role}</strong> (${iit.period})<br>
            ${iit.summary}
          </div>
          <div class="terminal-metrics-callout">
            ✔ Resume-Reported Result: Sharply reduced model parameter footprints while retaining &gt;95% benchmark task accuracy.
          </div>
        </div>

        <div class="terminal-field-box">
          <div class="terminal-field-title">SRM University-AP Research Fellowship</div>
          <div class="terminal-field-body">
            <strong>${srm.role}</strong> (${srm.period})<br>
            ${srm.summary}
          </div>
        </div>
      `;
      if (terminalDemoLink) terminalDemoLink.style.display = "none";
      if (terminalGithubLink) {
        terminalGithubLink.href = "https://github.com/ggthedeveloper";
        terminalGithubLink.style.display = "inline-flex";
      }
    }
    // C. If The Academy Citadel
    else if (data.id === "about") {
      contentHtml = `
        <div class="terminal-field-box">
          <div class="terminal-field-title">Academic & Leadership Command</div>
          <div class="terminal-field-body">
            <strong>SRM University-AP (2024–2028)</strong><br>
            B.Tech in Computer Science and Engineering (Minor in Mathematics)<br>
            <strong>CGPA: 9.49 / 10.0</strong> through 4th semester.
          </div>
        </div>

        <div class="terminal-field-box">
          <div class="terminal-field-title">Leadership Responsibilities</div>
          <div class="terminal-field-body">
            • <strong>Associate Convenor, Coding Club SRMAP:</strong> Leading 500+ student developers.<br>
            • <strong>Class Representative (CR):</strong> Representing 60+ engineering undergraduates across 4 semesters.<br>
            • <strong>SIH 2026 Finalist:</strong> Smart India Hackathon internal round screening.
          </div>
        </div>
      `;
      if (terminalDemoLink) terminalDemoLink.style.display = "none";
      if (terminalGithubLink) terminalGithubLink.style.display = "none";
    }
    // D. If Quantum Beacon
    else if (data.id === "contact") {
      contentHtml = `
        <div class="terminal-field-box">
          <div class="terminal-field-title">Subspace Transmissions</div>
          <div class="terminal-field-body">
            Based in Amaravati, Andhra Pradesh, India.<br>
            Primary Dispatch: <strong>ggraipurchor@gmail.com</strong>
          </div>
          <div style="margin-top: 1rem; display: flex; flex-direction: column; gap: 0.6rem;">
            <a href="mailto:ggraipurchor@gmail.com" class="hud-btn hud-btn-primary" style="justify-content: center;">Send Direct Email ✉</a>
            <a href="assets/Gaurav_Gautam_Resume.pdf" download="Gaurav_Gautam_Resume.pdf" class="hud-btn" style="justify-content: center;">Download Verified Resume (PDF) ↓</a>
          </div>
        </div>
      `;
      if (terminalDemoLink) terminalDemoLink.style.display = "none";
      if (terminalGithubLink) {
        terminalGithubLink.href = "https://linkedin.com/in/ggthedeveloper";
        terminalGithubLink.style.display = "inline-flex";
        terminalGithubLink.querySelector("span").textContent = "LinkedIn Profile";
      }
    }
    // E. Featured Projects (Varsha, Samanvay, Hydros, Waypoint)
    else {
      const project = PORTFOLIO_DATA.projects.find((p) => p.id === data.id);
      if (project) {
        contentHtml = `
          <div class="terminal-field-box">
            <div class="terminal-field-title">Mission Objective & Problem</div>
            <div class="terminal-field-body">${project.problem}</div>
          </div>

          <div class="terminal-field-box">
            <div class="terminal-field-title">Architectural Solution</div>
            <div class="terminal-field-body">${project.solution}</div>
            <div class="terminal-metrics-callout">${project.metrics}</div>
          </div>

          <div class="terminal-field-box">
            <div class="terminal-field-title">Engineered Stack</div>
            <div class="terminal-stack-tags">
              ${project.stack.map((t) => `<span class="terminal-tag">${t}</span>`).join("")}
            </div>
          </div>
        `;

        if (terminalDemoLink) {
          if (project.demoUrl) {
            terminalDemoLink.href = project.demoUrl;
            terminalDemoLink.style.display = "inline-flex";
          } else {
            terminalDemoLink.style.display = "none";
          }
        }

        if (terminalGithubLink) {
          terminalGithubLink.href = project.githubUrl;
          terminalGithubLink.style.display = "inline-flex";
          terminalGithubLink.querySelector("span").textContent = "GitHub Codebase";
        }
      }
    }

    terminalContent.innerHTML = contentHtml;
    planetaryTerminal.classList.add("is-open");
  };

  // 7. Global Hook: When Orbit is Disengaged
  window.onOrbitDisengaged = function () {
    planetaryTerminal?.classList.remove("is-open");
    warpPills.forEach((p) => p.classList.remove("active"));
  };

  terminalCloseBtn?.addEventListener("click", () => {
    universe.disengageOrbit();
  });

  // 8. Keyboard Shortcuts
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (dossierOverlay?.classList.contains("is-open")) closeDossier();
      else universe.disengageOrbit();
    } else if (e.key.toLowerCase() === "d" && !e.target.matches("input, textarea")) {
      if (dossierOverlay?.classList.contains("is-open")) closeDossier();
      else openDossier();
    }
  });

  // 9. Initial Warp sequence: start at macroscopic overview
  universe.warpToBody("core");
});
