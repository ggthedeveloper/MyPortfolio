/**
 * Automated Verification Suite for THE GAURAV GAUTAM COSMOS (3D Universe Simulation)
 * Uses Native Node.js 25 WebSocket & Chrome CDP.
 */

const { spawn } = require('child_process');
const http = require('http');

const PORT = 9224;
const CHROME_PATH = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const TARGET_URL = "http://localhost:8085/";

async function runUniverseTests() {
  console.log("=== STARTING 3D UNIVERSE PORTFOLIO VERIFICATION SUITE ===");

  const chromeProcess = spawn(CHROME_PATH, [
    `--remote-debugging-port=${PORT}`,
    "--headless=new",
    "--enable-webgl",
    "--ignore-gpu-blocklist",
    "--no-first-run",
    "--no-default-browser-check",
    `--user-data-dir=/tmp/chrome-test-universe-${Date.now()}`,
    TARGET_URL
  ]);

  await new Promise((r) => setTimeout(r, 1500));

  try {
    const list = await new Promise((resolve, reject) => {
      http.get(`http://localhost:${PORT}/json/list`, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch(e) {
            reject(new Error(`Failed parsing json: ${data}`));
          }
        });
      }).on('error', reject);
    });

    const pageTarget = list.find(t => t.type === 'page' && t.url.includes('8085')) || list.find(t => t.type === 'page') || list[0];
    const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
    let msgId = 1;
    const callbacks = new Map();
    const pageErrors = [];

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && callbacks.has(msg.id)) {
        callbacks.get(msg.id)(msg.result);
        callbacks.delete(msg.id);
      }
      if (msg.method === "Runtime.consoleAPICalled") {
        console.log("BROWSER LOG:", msg.params.args.map(a => a.value || a.description).join(" "));
      }
      if (msg.method === "Runtime.exceptionThrown") {
        console.error("BROWSER EXCEPTION:", msg.params.exceptionDetails);
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

    await sendCommand("Page.enable");
    await sendCommand("Runtime.enable");
    await sendCommand("Page.navigate", { url: TARGET_URL });

    // Wait 2s for Three.js universe initialization
    await new Promise((r) => setTimeout(r, 2000));

    console.log("\n[TEST 1] Page Identity & Cosmos Title Verification");
    const title = await evaluate("document.title");
    console.log(`- Page Title: "${title}"`);
    if (!title.includes("Gaurav Gautam") || !title.includes("Universe")) {
      throw new Error("Page title failed verification");
    }
    console.log("✔ TEST 1 PASSED: Cosmos identity confirmed.");

    console.log("\n[TEST 2] 3D Solar System & Planetary Bodies Verification");
    const cosmosState = await evaluate(`
      (() => {
        const hasCanvas = !!document.getElementById('universe-canvas');
        const hasUniverseObj = !!window.universe;
        const planetCount = window.universe ? window.universe.planets.length : 0;
        const hasSun = !!(window.universe && window.universe.sun);
        return { hasCanvas, hasUniverseObj, planetCount, hasSun };
      })()
    `);
    console.log(`- WebGL Canvas Present: ${cosmosState.hasCanvas}`);
    console.log(`- Universe Engine Initialized: ${cosmosState.hasUniverseObj}`);
    console.log(`- Central Star (Star Gaurav): ${cosmosState.hasSun}`);
    console.log(`- Orbiting Celestial Bodies: ${cosmosState.planetCount} planets & stations`);

    if (!cosmosState.hasCanvas || !cosmosState.hasUniverseObj || cosmosState.planetCount < 6 || !cosmosState.hasSun) {
      throw new Error("3D Universe planetary system failed initialization!");
    }
    console.log("✔ TEST 2 PASSED: 3D Universe and planetary system fully initialized.");

    console.log("\n[TEST 3] Warp Drive & Planetary Terminal Interaction");
    const warpResult = await evaluate(`
      (() => {
        window.universe.warpToBody('varshapurvanuman');
        const terminal = document.getElementById('planetary-terminal');
        const title = document.getElementById('terminal-title').textContent;
        return {
          isOpen: terminal.classList.contains('is-open'),
          title: title,
          hasDemoLink: !!document.getElementById('terminal-demo-link').getAttribute('href')
        };
      })()
    `);
    console.log(`- Warp Drive Engaged (Planet Varsha): ${warpResult.isOpen ? 'SUCCESS ✔' : 'FAILED ❌'}`);
    console.log(`- Holographic Terminal Title: "${warpResult.title}"`);
    console.log(`- Verified Live Demo Link Attached: ${warpResult.hasDemoLink ? 'YES ✔' : 'NO ❌'}`);

    if (!warpResult.isOpen || !warpResult.title.includes("VARSHA")) {
      throw new Error("Planetary warp drive failed!");
    }
    console.log("✔ TEST 3 PASSED: Cinematic warp drive & planetary scanner functioning.");

    console.log("\n[TEST 4] Disengage Orbit & Return to Solar System View");
    const disengageResult = await evaluate(`
      (() => {
        window.universe.disengageOrbit();
        const terminal = document.getElementById('planetary-terminal');
        return {
          isClosed: !terminal.classList.contains('is-open'),
          isWarping: window.universe.isWarping
        };
      })()
    `);
    console.log(`- Orbit Disengaged: ${disengageResult.isClosed ? 'SUCCESS ✔' : 'FAILED ❌'}`);
    if (!disengageResult.isClosed) {
      throw new Error("Orbit disengagement failed!");
    }
    console.log("✔ TEST 4 PASSED: Smooth return to macroscopic solar system view.");

    console.log("\n[TEST 5] Recruiter Cyber-Dossier Mode Toggle");
    const dossierResult = await evaluate(`
      (() => {
        const btn = document.getElementById('hud-dossier-btn');
        btn.click();
        const modal = document.getElementById('recruiter-dossier-modal');
        const isOpen = modal.classList.contains('is-open');
        const closeBtn = document.getElementById('dossier-close-btn');
        closeBtn.click();
        const isClosed = !modal.classList.contains('is-open');
        return { isOpen, isClosed };
      })()
    `);
    console.log(`- Dossier Opened: ${dossierResult.isOpen ? 'SUCCESS ✔' : 'FAILED ❌'}`);
    console.log(`- Dossier Closed: ${dossierResult.isClosed ? 'SUCCESS ✔' : 'FAILED ❌'}`);
    if (!dossierResult.isOpen || !dossierResult.isClosed) {
      throw new Error("Dossier mode interaction failed!");
    }
    console.log("✔ TEST 5 PASSED: Full Recruiter Cyber-Dossier toggle operational.");

    console.log("\n[TEST 6] Critical Links & Verified Email Verification");
    const linksData = await evaluate(`
      (() => {
        const resumeLinks = Array.from(document.querySelectorAll('a[href*="Resume.pdf"], a[href*="CV.pdf"]')).map(a => a.getAttribute('href'));
        const githubLinks = Array.from(document.querySelectorAll('a[href*="github.com/ggthedeveloper"]')).map(a => a.getAttribute('href'));
        const emailLinks = Array.from(document.querySelectorAll('a[href*="ggraipurchor@gmail.com"]')).map(a => a.getAttribute('href'));
        return {
          resumeCount: resumeLinks.length,
          githubCount: githubLinks.length,
          emailCount: emailLinks.length
        };
      })()
    `);
    console.log(`- Verified Resume PDF Links: ${linksData.resumeCount} (Must be 0 as CV button was removed)`);
    console.log(`- Verified GitHub Links: ${linksData.githubCount}`);
    console.log(`- Verified Email Links: ${linksData.emailCount}`);
    if (linksData.resumeCount !== 0) {
      throw new Error("CV/Resume button should be removed!");
    }
    if (linksData.emailCount === 0) {
      throw new Error("Contact email verification failed: ggraipurchor@gmail.com not found!");
    }
    console.log("✔ TEST 6 PASSED: CV removed and verified contact email confirmed.");

    console.log("\n[TEST 7] Page Errors & Console Check");
    console.log(`- Page exceptions: ${pageErrors.length}`);
    if (pageErrors.length > 0) {
      console.error("Exceptions detected:", pageErrors);
      throw new Error("Page has unhandled runtime exceptions!");
    }
    console.log("✔ TEST 7 PASSED: Zero unhandled console exceptions.");

    console.log("\n==============================================");
    console.log("🎉 ALL UNIVERSE TESTS PASSED (7/7)");
    console.log("==============================================");

    ws.close();
  } finally {
    chromeProcess.kill('SIGKILL');
  }
}

runUniverseTests().catch(err => {
  console.error("\n❌ UNIVERSE TEST FAILED:", err.message);
  process.exit(1);
});
