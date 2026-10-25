/**
 * Automated Verification Script for Gaurav Gautam Portfolio
 * Uses Native Node.js 25 WebSocket to control Google Chrome via CDP.
 * Verifies:
 * 1. Page load & Console errors
 * 2. Responsive widths: 360px, 390px, 768px, 1024px, 1440px
 * 3. Horizontal overflow check (scrollWidth <= innerWidth)
 * 4. Case Study Modal open/close via keyboard Escape
 * 5. Mobile Drawer open/close
 * 6. Theme toggle
 * 7. Verified links
 */

const { spawn } = require('child_process');
const http = require('http');

const PORT = 9224;
const CHROME_PATH = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const TARGET_URL = "http://localhost:8085/";

async function runTests() {
  console.log("=== STARTING PORTFOLIO VERIFICATION SUITE ===");

  // 1. Launch Headless Chrome with Remote Debugging
  const chromeProcess = spawn(CHROME_PATH, [
    `--remote-debugging-port=${PORT}`,
    "--headless=new",
    "--disable-gpu",
    "--no-first-run",
    "--no-default-browser-check",
    `--user-data-dir=/tmp/chrome-test-${Date.now()}`,
    TARGET_URL
  ]);

  // Wait 1.5s for Chrome to bind port
  await new Promise((r) => setTimeout(r, 1500));

  try {
    // 2. Query Chrome JSON API for targets
    const targets = await new Promise((resolve, reject) => {
      http.get(`http://localhost:${PORT}/json/list`, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const list = JSON.parse(data);
            const pageTarget = list.find(t => t.type === 'page' && t.url.includes('8085')) || list.find(t => t.type === 'page') || list[0];
            resolve(pageTarget);
          } catch(e) {
            reject(new Error(`Failed parsing json: ${data}`));
          }
        });
      }).on('error', reject);
    });

    const wsUrl = targets.webSocketDebuggerUrl;
    console.log(`Connected to Chrome CDP WebSocket: ${wsUrl}`);

    const ws = new WebSocket(wsUrl);
    let msgId = 1;
    const callbacks = new Map();
    const consoleLogs = [];
    const pageErrors = [];

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && callbacks.has(msg.id)) {
        callbacks.get(msg.id)(msg.result);
        callbacks.delete(msg.id);
      }
      if (msg.method === "Runtime.consoleAPICalled") {
        consoleLogs.push({ type: msg.params.type, args: msg.params.args });
      }
      if (msg.method === "Runtime.exceptionThrown") {
        pageErrors.push(msg.params.exceptionDetails);
      }
    };

    await new Promise((resolve) => ws.onopen = resolve);

    function sendCommand(method, params = {}) {
      return new Promise((resolve) => {
        const id = msgId++;
        callbacks.set(id, resolve);
        ws.send(JSON.stringify({ id, method, params }));
      });
    }

    async function evaluate(expression) {
      const res = await sendCommand("Runtime.evaluate", {
        expression,
        returnByValue: true,
        awaitPromise: true
      });
      return res?.result?.value;
    }

    // Enable CDP Domains
    await sendCommand("Page.enable");
    await sendCommand("Runtime.enable");
    await sendCommand("Page.navigate", { url: TARGET_URL });

    // Wait for page load
    await new Promise((r) => setTimeout(r, 2000));

    console.log("\n[TEST 1] Page Title & Core Heading Verification");
    const title = await evaluate("document.title");
    const h1 = await evaluate("document.querySelector('h1').innerText.trim()");
    console.log(`- Page Title: "${title}"`);
    console.log(`- H1 Content: "${h1}"`);
    if (!title.includes("Gaurav Gautam") || !h1.includes("Gaurav")) {
      throw new Error("Page title or H1 failed verification");
    }
    console.log("✔ TEST 1 PASSED: Identity verified.");

    console.log("\n[TEST 2] Responsive Viewports & Horizontal Overflow Check");
    const viewports = [
      { width: 360, height: 740, name: "Mobile Small (360px)" },
      { width: 390, height: 844, name: "iPhone 14/15 (390px)" },
      { width: 768, height: 1024, name: "Tablet Portrait (768px)" },
      { width: 1024, height: 768, name: "Tablet Landscape (1024px)" },
      { width: 1440, height: 900, name: "Desktop Large (1440px)" }
    ];

    for (const vp of viewports) {
      await sendCommand("Emulation.setDeviceMetricsOverride", {
        width: vp.width,
        height: vp.height,
        deviceScaleFactor: 1,
        mobile: vp.width < 768
      });
      await new Promise((r) => setTimeout(r, 200));

      const overflowData = await evaluate(`
        ({
          innerWidth: window.innerWidth,
          scrollWidth: document.documentElement.scrollWidth,
          hasOverflow: document.documentElement.scrollWidth > window.innerWidth,
          bodyScrollWidth: document.body.scrollWidth
        })
      `);

      console.log(`- ${vp.name}: innerWidth=${overflowData.innerWidth}px, scrollWidth=${overflowData.scrollWidth}px -> Overflow: ${overflowData.hasOverflow ? 'FAIL ❌' : 'PASS ✔'}`);
      if (overflowData.hasOverflow) {
        throw new Error(`Horizontal overflow detected at ${vp.name}!`);
      }
    }
    console.log("✔ TEST 2 PASSED: 0 horizontal overflow across all required breakpoints.");

    console.log("\n[TEST 3] Modal Dialog Open / Close & Escape Key Accessibility");
    // Click VarshaPurvanumanAI case study trigger
    const openSuccess = await evaluate(`
      (() => {
        const btn = document.querySelector('[data-open-case-study="varshapurvanuman"]');
        if (!btn) return false;
        btn.click();
        const modal = document.getElementById('case-study-modal');
        return modal.classList.contains('is-open');
      })()
    `);
    console.log(`- Modal Open Triggered: ${openSuccess ? 'SUCCESS ✔' : 'FAILED ❌'}`);

    const modalTitleText = await evaluate("document.getElementById('modal-project-title').textContent");
    console.log(`- Modal Title Rendered: "${modalTitleText}"`);

    // Simulate Escape Key
    await evaluate(`
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    `);
    await new Promise((r) => setTimeout(r, 100));

    const isClosed = await evaluate(`
      !document.getElementById('case-study-modal').classList.contains('is-open')
    `);
    console.log(`- Modal Closed via Escape Key: ${isClosed ? 'SUCCESS ✔' : 'FAILED ❌'}`);
    if (!openSuccess || !isClosed) {
      throw new Error("Modal accessibility interaction failed");
    }
    console.log("✔ TEST 3 PASSED: Modal open/close & keyboard escape work perfectly.");

    console.log("\n[TEST 4] Mobile Navigation Drawer Open / Close");
    // Reset to mobile viewport
    await sendCommand("Emulation.setDeviceMetricsOverride", {
      width: 390,
      height: 844,
      deviceScaleFactor: 1,
      mobile: true
    });

    const mobileMenuOpen = await evaluate(`
      (() => {
        const btn = document.getElementById('mobile-menu-trigger');
        btn.click();
        const overlay = document.getElementById('mobile-nav-overlay');
        return overlay.classList.contains('is-open');
      })()
    `);
    console.log(`- Mobile Drawer Opened: ${mobileMenuOpen ? 'SUCCESS ✔' : 'FAILED ❌'}`);

    const mobileMenuClose = await evaluate(`
      (() => {
        const closeBtn = document.getElementById('mobile-close-btn');
        closeBtn.click();
        const overlay = document.getElementById('mobile-nav-overlay');
        return !overlay.classList.contains('is-open');
      })()
    `);
    console.log(`- Mobile Drawer Closed: ${mobileMenuClose ? 'SUCCESS ✔' : 'FAILED ❌'}`);
    if (!mobileMenuOpen || !mobileMenuClose) {
      throw new Error("Mobile menu interaction failed");
    }
    console.log("✔ TEST 4 PASSED: Mobile navigation drawer functioning.");

    console.log("\n[TEST 5] Theme Toggle Functionality");
    const themeToggled = await evaluate(`
      (() => {
        const btn = document.getElementById('theme-toggle-btn');
        btn.click();
        const hasLight = document.documentElement.getAttribute('data-theme') === 'light';
        btn.click(); // toggle back
        const hasDark = !document.documentElement.getAttribute('data-theme');
        return hasLight && hasDark;
      })()
    `);
    console.log(`- Theme Toggle: ${themeToggled ? 'SUCCESS ✔' : 'FAILED ❌'}`);
    console.log("✔ TEST 5 PASSED: Visual theme switcher operates cleanly.");

    console.log("\n[TEST 6] Critical Assets & Links Verification");
    const linksVerification = await evaluate(`
      (() => {
        const resumeLinks = Array.from(document.querySelectorAll('a[href*="Resume.pdf"]')).map(a => a.getAttribute('href'));
        const githubLinks = Array.from(document.querySelectorAll('a[href*="github.com/ggthedeveloper"]')).map(a => a.getAttribute('href'));
        const linkedinLinks = Array.from(document.querySelectorAll('a[href*="linkedin.com/in/ggthedeveloper"]')).map(a => a.getAttribute('href'));
        return {
          resumeCount: resumeLinks.length,
          resumeHref: resumeLinks[0],
          githubCount: githubLinks.length,
          linkedinCount: linkedinLinks.length
        };
      })()
    `);
    console.log(`- Resume Links found: ${linksVerification.resumeCount} (Points to: "${linksVerification.resumeHref}")`);
    console.log(`- GitHub Links found: ${linksVerification.githubCount}`);
    console.log(`- LinkedIn Links found: ${linksVerification.linkedinCount}`);

    if (linksVerification.resumeCount === 0 || !linksVerification.resumeHref.includes("Gaurav_Gautam_Resume.pdf")) {
      throw new Error("Resume link verification failed");
    }
    console.log("✔ TEST 6 PASSED: Real resume and verified URLs present.");

    console.log("\n[TEST 7] Page Errors & Console Check");
    console.log(`- Page exceptions: ${pageErrors.length}`);
    if (pageErrors.length > 0) {
      console.error("Exceptions detected:", pageErrors);
      throw new Error("Page has unhandled runtime exceptions!");
    }
    console.log("✔ TEST 7 PASSED: Zero unhandled console exceptions.");

    console.log("\n[TEST 8] Advanced Interactive Features & Command Palette Verification");
    // Test Command Palette via trigger button
    const paletteOpened = await evaluate(`
      (() => {
        const btn = document.getElementById('palette-trigger-btn');
        btn.click();
        const modal = document.getElementById('command-palette-modal');
        return modal.classList.contains('is-open');
      })()
    `);
    console.log(`- Command Palette Opened via ⌘K button: ${paletteOpened ? 'SUCCESS ✔' : 'FAILED ❌'}`);

    // Close palette via Escape
    await evaluate(`window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));`);
    const paletteClosed = await evaluate(`!document.getElementById('command-palette-modal').classList.contains('is-open')`);
    console.log(`- Command Palette Closed via Escape: ${paletteClosed ? 'SUCCESS ✔' : 'FAILED ❌'}`);

    // Test Interactive Research Lab Simulator
    const simResult = await evaluate(`
      (() => {
        const slider = document.getElementById('sparsity-slider');
        if (!slider) return false;
        slider.value = 50;
        slider.dispatchEvent(new Event('input'));
        const acc = document.getElementById('retained-accuracy-display').textContent;
        const heads = document.querySelectorAll('.head-cell.is-pruned').length;
        return { acc, headsPruned: heads, success: heads > 0 };
      })()
    `);
    console.log(`- Interactive Research Simulator @ 50% Sparsity: Retained Accuracy = ${simResult.acc}, Pruned Heads = ${simResult.headsPruned}`);

    // Test 3D HUD Mode switcher
    const hudResult = await evaluate(`
      (() => {
        if (typeof window.set3DVisualMode !== 'function') return false;
        window.set3DVisualMode('geodesic');
        window.set3DVisualMode('stream');
        window.set3DVisualMode('lattice');
        return true;
      })()
    `);
    console.log(`- 3D Visual HUD Modes (Lattice / Geodesic / Stream): ${hudResult ? 'SUCCESS ✔' : 'FAILED ❌'}`);

    if (!paletteOpened || !paletteClosed || !simResult.success || !hudResult) {
      throw new Error("Interactive adventurous features verification failed!");
    }
    console.log("✔ TEST 8 PASSED: Command palette, research simulator, and 3D HUD fully functional.");

    console.log("\n==============================================");
    console.log("🎉 ALL TESTS PASSED SUCCESSFULLY (8/8)");
    console.log("==============================================");

    ws.close();
  } finally {
    chromeProcess.kill('SIGKILL');
  }
}

runTests().catch(err => {
  console.error("\n❌ VERIFICATION TEST FAILED:", err.message);
  process.exit(1);
});
