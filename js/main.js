/**
 * Gaurav Gautam Portfolio — Main Interactive Logic
 * Fully accessible, mobile-first, zero template slop.
 */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Dynamic Footer Year
  const yearElement = document.getElementById("current-year");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // 2. Scroll Reveal Observer (IntersectionObserver)
  const revealElements = document.querySelectorAll(".reveal-on-scroll");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if ("IntersectionObserver" in window && !prefersReducedMotion) {
    document.documentElement.classList.add("js-motion-active");
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: "0px 0px -60px 0px",
        threshold: 0.12
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    // Fallback: immediately reveal all
    revealElements.forEach((el) => el.classList.add("is-revealed"));
  }

  // 3. Navigation Active State (ScrollSpy)
  const navLinks = document.querySelectorAll(".nav-link");
  const mobileNavLinks = document.querySelectorAll(".mobile-nav-link");
  const trackedSections = document.querySelectorAll("section[id]");

  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("id");
            updateActiveNavLinks(id);
          }
        });
      },
      { rootMargin: "-25% 0px -55% 0px" }
    );

    trackedSections.forEach((section) => sectionObserver.observe(section));
  }

  function updateActiveNavLinks(activeId) {
    navLinks.forEach((link) => {
      const href = link.getAttribute("href");
      if (href === `#${activeId}`) {
        link.classList.add("active");
        link.setAttribute("aria-current", "page");
      } else {
        link.classList.remove("active");
        link.removeAttribute("aria-current");
      }
    });

    mobileNavLinks.forEach((link) => {
      const href = link.getAttribute("href");
      if (href === `#${activeId}`) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  }

  // 4. Mobile Menu Drawer (Accessible Modal Pattern)
  const mobileMenuTrigger = document.getElementById("mobile-menu-trigger");
  const mobileNavOverlay = document.getElementById("mobile-nav-overlay");
  const mobileCloseBtn = document.getElementById("mobile-close-btn");

  function openMobileMenu() {
    if (!mobileNavOverlay) return;
    mobileNavOverlay.classList.add("is-open");
    mobileNavOverlay.setAttribute("aria-hidden", "false");
    mobileMenuTrigger.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
    mobileCloseBtn?.focus();
  }

  function closeMobileMenu() {
    if (!mobileNavOverlay) return;
    mobileNavOverlay.classList.remove("is-open");
    mobileNavOverlay.setAttribute("aria-hidden", "true");
    mobileMenuTrigger.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
    mobileMenuTrigger?.focus();
  }

  if (mobileMenuTrigger && mobileNavOverlay) {
    mobileMenuTrigger.addEventListener("click", () => {
      const isOpen = mobileNavOverlay.classList.contains("is-open");
      if (isOpen) closeMobileMenu();
      else openMobileMenu();
    });

    mobileCloseBtn?.addEventListener("click", closeMobileMenu);

    mobileNavLinks.forEach((link) => {
      link.addEventListener("click", () => {
        closeMobileMenu();
      });
    });

    // Close on Escape key
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && mobileNavOverlay.classList.contains("is-open")) {
        closeMobileMenu();
      }
    });
  }

  // 5. Theme Toggle (Dark & Balanced Light Theme)
  const themeToggleBtn = document.getElementById("theme-toggle-btn");
  const savedTheme = localStorage.getItem("gg_portfolio_theme");

  if (savedTheme === "light") {
    document.documentElement.setAttribute("data-theme", "light");
    updateThemeIcon("light");
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      const currentTheme = document.documentElement.getAttribute("data-theme");
      const nextTheme = currentTheme === "light" ? "dark" : "light";

      if (nextTheme === "light") {
        document.documentElement.setAttribute("data-theme", "light");
        localStorage.setItem("gg_portfolio_theme", "light");
      } else {
        document.documentElement.removeAttribute("data-theme");
        localStorage.setItem("gg_portfolio_theme", "dark");
      }
      updateThemeIcon(nextTheme);
      window.soundFx?.playTick();
    });
  }

  function updateThemeIcon(theme) {
    if (!themeToggleBtn) return;
    themeToggleBtn.innerHTML =
      theme === "light"
        ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`
        : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
  }

  // 5b. Audio Micro-Haptics Toggle
  const soundToggleBtn = document.getElementById("sound-toggle-btn");
  if (soundToggleBtn) {
    soundToggleBtn.addEventListener("click", () => {
      const isEnabled = window.soundFx?.toggle();
      if (isEnabled) {
        soundToggleBtn.classList.add("is-active");
        soundToggleBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>`;
        window.soundFx?.playSuccess();
      } else {
        soundToggleBtn.classList.remove("is-active");
        soundToggleBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>`;
      }
    });
  }

  // 6. Accessible Case Study Modal Dialog
  const modalBackdrop = document.getElementById("case-study-modal");
  const modalTitle = document.getElementById("modal-project-title");
  const modalSubtitle = document.getElementById("modal-project-subtitle");
  const modalBadge = document.getElementById("modal-project-badge");
  const modalCategory = document.getElementById("modal-project-category");
  const modalProblem = document.getElementById("modal-project-problem");
  const modalSolution = document.getElementById("modal-project-solution");
  const modalContribution = document.getElementById("modal-project-contribution");
  const modalMetrics = document.getElementById("modal-project-metrics");
  const modalHighlightsList = document.getElementById("modal-project-highlights");
  const modalStackTags = document.getElementById("modal-project-stack");
  const modalGithubLink = document.getElementById("modal-github-link");
  const modalDemoLink = document.getElementById("modal-demo-link");
  const modalCloseBtn = document.getElementById("modal-close-btn");

  let lastActiveElement = null;

  function openProjectModal(projectId) {
    if (!modalBackdrop || typeof PORTFOLIO_DATA === "undefined") return;

    const project = PORTFOLIO_DATA.projects.find((p) => p.id === projectId);
    if (!project) return;

    lastActiveElement = document.activeElement;

    // Populate modal contents
    if (modalTitle) modalTitle.textContent = project.title;
    if (modalSubtitle) modalSubtitle.textContent = project.subtitle;
    if (modalBadge) modalBadge.textContent = project.badge;
    if (modalCategory) modalCategory.textContent = project.category;
    if (modalProblem) modalProblem.textContent = project.problem;
    if (modalSolution) modalSolution.textContent = project.solution;
    if (modalContribution) modalContribution.textContent = project.contribution;
    if (modalMetrics) modalMetrics.textContent = project.metrics;

    // Highlights
    if (modalHighlightsList) {
      modalHighlightsList.innerHTML = project.highlights
        .map(
          (h) => `
        <li class="modal-highlight-item">
          <span style="color: var(--accent-cyan); font-weight: bold;">▹</span>
          <span>${h}</span>
        </li>`
        )
        .join("");
    }

    // Stack tags
    if (modalStackTags) {
      modalStackTags.innerHTML = project.stack
        .map((tech) => `<span class="stack-tag">${tech}</span>`)
        .join("");
    }

    // Links
    if (modalGithubLink) {
      modalGithubLink.href = project.githubUrl;
      modalGithubLink.style.display = "inline-flex";
    }

    if (modalDemoLink) {
      if (project.demoUrl) {
        modalDemoLink.href = project.demoUrl;
        modalDemoLink.style.display = "inline-flex";
      } else {
        modalDemoLink.style.display = "none";
      }
    }

    // Show modal & handle accessibility
    modalBackdrop.classList.add("is-open");
    modalBackdrop.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    modalCloseBtn?.focus();
    window.soundFx?.playChime();

    // Focus trap inside modal
    trapFocus(modalBackdrop);
  }

  function closeProjectModal() {
    if (!modalBackdrop) return;
    modalBackdrop.classList.remove("is-open");
    modalBackdrop.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    window.soundFx?.playTick();

    // Return focus
    if (lastActiveElement && typeof lastActiveElement.focus === "function") {
      lastActiveElement.focus();
    }
  }

  // Bind project cards case-study buttons
  const modalTriggers = document.querySelectorAll("[data-open-case-study]");
  modalTriggers.forEach((trigger) => {
    trigger.addEventListener("click", (e) => {
      e.preventDefault();
      const projectId = trigger.getAttribute("data-open-case-study");
      openProjectModal(projectId);
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener("click", closeProjectModal);
  }

  if (modalBackdrop) {
    modalBackdrop.addEventListener("click", (e) => {
      if (e.target === modalBackdrop) {
        closeProjectModal();
      }
    });

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modalBackdrop.classList.contains("is-open")) {
        closeProjectModal();
      }
    });
  }

  function trapFocus(element) {
    const focusableEls = element.querySelectorAll(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableEls[0];
    const lastFocusable = focusableEls[focusableEls.length - 1];

    element.addEventListener("keydown", function (e) {
      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          lastFocusable.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          firstFocusable.focus();
          e.preventDefault();
        }
      }
    });
  }

  // 7. Real Public GitHub Activity API Integration
  async function fetchGitHubData() {
    const user = "ggthedeveloper";
    const profileUrl = `https://api.github.com/users/${user}`;
    const reposUrl = `https://api.github.com/users/${user}/repos?sort=updated&per_page=6`;

    const avatarEl = document.getElementById("github-user-avatar");
    const nameEl = document.getElementById("github-user-name");
    const reposCountEl = document.getElementById("github-public-repos");
    const container = document.getElementById("github-repos-container");

    try {
      // Profile fetch with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const [userRes, reposRes] = await Promise.all([
        fetch(profileUrl, { signal: controller.signal }),
        fetch(reposUrl, { signal: controller.signal })
      ]);

      clearTimeout(timeoutId);

      if (userRes.ok) {
        const userData = await userRes.json();
        if (avatarEl && userData.avatar_url) avatarEl.src = userData.avatar_url;
        if (nameEl) nameEl.textContent = userData.name || userData.login;
        if (reposCountEl) reposCountEl.textContent = `${userData.public_repos} Public Repositories`;
      }

      if (reposRes.ok && container) {
        const repos = await reposRes.json();
        if (Array.isArray(repos) && repos.length > 0) {
          container.innerHTML = repos
            .slice(0, 6)
            .map(
              (repo) => `
            <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="github-repo-card">
              <div>
                <div class="repo-card-title">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
                  <span>${repo.name}</span>
                </div>
                <p class="repo-card-desc">${repo.description || "Public repository in machine learning, algorithms, or systems."}</p>
              </div>
              <div class="repo-meta-row">
                <span>● ${repo.language || "Code"}</span>
                <span>★ ${repo.stargazers_count}</span>
              </div>
            </a>`
            )
            .join("");
        }
      }
    } catch (err) {
      console.info("[GitHub API] Graceful fallback to verified repositories list.", err.message);
      // Fallback already rendered in initial HTML
    }
  }

  fetchGitHubData();

  // 8. Copy to Clipboard Toast (e.g. Email)
  const copyButtons = document.querySelectorAll("[data-copy-value]");
  const toast = document.getElementById("copy-toast");

  copyButtons.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const val = btn.getAttribute("data-copy-value");
      if (!val) return;

      try {
        await navigator.clipboard.writeText(val);
        showToast(`Copied ${val} to clipboard!`);
      } catch (e) {
        // Fallback for older browsers
        const textarea = document.createElement("textarea");
        textarea.value = val;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
        showToast(`Copied ${val} to clipboard!`);
      }
    });
  });

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => {
      toast.classList.remove("show");
    }, 3200);
  }

  // 9. Back to Top Action
  const backToTopBtn = document.getElementById("back-to-top-btn");
  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
});
