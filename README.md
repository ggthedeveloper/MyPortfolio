# Gaurav Gautam — Personal Portfolio & Research Dossier

> High-performance developer & AI/ML researcher portfolio for **Gaurav Gautam** (Undergraduate Researcher & Software Engineer at SRM University-AP).



---

## 🌟 Highlights & Core Features

- **Dark Mode by Default & Full Light Theme:** Boots by default in cyber dark mode (`#0a0a0a`), with a high-contrast editorial light mode (`#fafafa` with `#ffffff` cards). Theme preference is preserved across visits in `localStorage`.
- **Dynamic Avatar with Custom Insignia:** Vector hero insignia rendered with glowing dual-line typography: `GAURAV GAUTAM` and `<DEVELOPER & AI/ML RESEARCHER>`.
- **Custom Precision Cursor:** Smooth dual-element pointer with lerp-interpolated lagging ring (`#cursor-ring`) and responsive scaling over interactive targets, auto-disabled on touch screens.
- **Realistic Telemetry Counter:** Authentic, organic visitor telemetry displaying localized counts (`3,800+` views) calibrated for continuous visitor tracking.
- **Interactive Research Lab:** Dedicated interactive Transformer Compression matrix detailing research at IIT Bhubaneswar & SRM-AP on CoFi structured pruning and QA-LoRA retaining >95% accuracy.
- **Command Palette (`Ctrl / Cmd + K`):** Quick-jump terminal palette to search projects, research papers, certifications, and skills instantly.
- **Cyber Dossier CLI & Audio Synthesis:** Interactive terminal mode and ambient Web Audio synthesizer with mute toggle.
- **Mobile-First Responsive Drawer:** Zero horizontal overflow from 360px phones up to 4K ultra-wide screens, complete with an animated hamburger drawer.

---

## 📁 Repository Structure

```
MyPortfolio/
├── index.html                   # Semantic HTML5 document with Open Graph & SEO metadata
├── README.md                    # Project documentation & deployment instructions
├── .gitignore                   # Ignores local screenshots, logs, and OS caches
├── test-all-features.js         # Comprehensive CDP verification suite
├── test-responsive.js           # 7-viewport responsive overflow tester
├── assets/
│   ├── css/
│   │   ├── style.css            # Primary stylesheet (Doppelrand, responsive grid, theme variables)
│   │   ├── base.css             # Base reset & typography rules
│   │   ├── components.css       # Cards, badges, buttons, command palette
│   │   ├── layout.css           # Grid layouts & section flow
│   │   ├── animations.css       # Keyframe animations & smooth transitions
│   │   └── variables.css        # CSS custom properties for light/dark modes
│   ├── js/
│   │   ├── data.js              # Single source of truth for all projects, research & education
│   │   ├── main.js              # Theme manager, cursor physics, view counter & mobile drawer
│   │   ├── render.js            # Dynamic DOM renderer for projects, research, and skills
│   │   ├── palette.js           # Command palette (Cmd+K) modal engine
│   │   ├── github.js            # GitHub public repository fetcher & offline fallback
│   │   ├── heatmap.js           # Activity telemetry visualizer
│   │   └── stack-icons.js       # SVG devicon mapping helper
│   ├── images/
│   │   ├── favicon.svg          # Portfolio favicon
│   │   ├── gaurav-hero.svg      # Vector hero avatar with chest insignia
│   │   └── projects/            # Real hero covers for Varsha, RailSamanvay, etc.
│   └── docs/
│       └── Gaurav-Gautam-CV.pdf # Authenticated curriculum vitae
```

---

## 🚀 Running Locally

This portfolio is built on vanilla web standards (HTML5, CSS3, ES6+ JavaScript) and requires **no build tool, bundler, or package installation**.

### Using Python:
```bash
python3 -m http.server 8085
```
Open [http://localhost:8085](http://localhost:8085) in any modern browser.

### Using Node / npx:
```bash
npx serve . -l 8085
```

---

## 🧪 Automated Testing Suite

The repository includes headless Chrome DevTools Protocol (CDP) test scripts:

```bash
# Test all features (theme toggle, views counter, avatar text, mobile menu):
node test-all-features.js

# Test responsiveness across 7 viewports (360px to 1920px):
node test-responsive.js
```

---

## 🌐 Verified Project Showcases

| Project | Role / Context | Live Demo / Link |
|---|---|---|
| **VarshaPurvanumanAI** | Team Lead · SIH 2026 Finalist (SIH26080, MoES / IMD) | [Demo](https://varsha-purvanuman-ai.vercel.app/) \| [GitHub](https://github.com/ggthedeveloper/VarshaPurvanumanAI) |
| **RailSamanvayAI** | System Architect · SIH 2026 Finalist (SIH26027, Railways) | [Demo](https://rail-samanvay-ai.vercel.app/) \| [GitHub](https://github.com/ggthedeveloper/RailSamanvayAI) |
| **DrainSense AI** | Geospatial ML Research (Vijayawada Urban Drainage) | [GitHub](https://github.com/ggthedeveloper/DrainSenseAI) |
| **Smart Route Finder** | Graph Navigation Engine (Dijkstra / A* on OSMnx) | [Demo](https://smart-route-finder-n52n.onrender.com/) \| [GitHub](https://github.com/ggthedeveloper/Smart-Route-Finder) |
| **Space-Shooter-3D** | Interactive Procedural Three.js Flight Simulator | [Demo](https://ggthedeveloper.github.io/Space-Shooter-3D/) \| [GitHub](https://github.com/ggthedeveloper/Space-Shooter-3D) |

---

## 👤 Author

**Gaurav Gautam**
- GitHub: [@ggthedeveloper](https://github.com/ggthedeveloper)
- LinkedIn: [linkedin.com/in/ggthedeveloper](https://www.linkedin.com/in/ggthedeveloper)
- Academic Email: `gaurav_gautam@srmuniv.edu.in`
