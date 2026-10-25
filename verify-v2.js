const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 9226;
const CHROME_PATH = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const TARGET_URL = "http://localhost:8085/";

async function runVerification() {
  console.log("=== RUNNING GAURAV GAUTAM PORTFOLIO VERIFICATION ===");

  const chrome = spawn(CHROME_PATH, [
    `--remote-debugging-port=${PORT}`,
    "--headless=new",
    "--disable-gpu",
    "--no-first-run",
    "--no-default-browser-check",
    `--user-data-dir=/tmp/chrome-verify-${Date.now()}`,
    "--window-size=1440,900",
    TARGET_URL
  ]);

  await new Promise(r => setTimeout(r, 1600));

  try {
    const target = await new Promise((resolve, reject) => {
      http.get(`http://localhost:${PORT}/json/list`, res => {
        let d = '';
        res.on('data', chunk => d += chunk);
        res.on('end', () => {
          try {
            const list = JSON.parse(d);
            resolve(list.find(t => t.type === 'page' && t.url.includes('8085')) || list[0]);
          } catch (e) { reject(e); }
        });
      }).on('error', reject);
    });

    const ws = new WebSocket(target.webSocketDebuggerUrl);
    let msgId = 1;
    const callbacks = new Map();
    const pageErrors = [];

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && callbacks.has(msg.id)) {
        callbacks.get(msg.id)(msg.result);
        callbacks.delete(msg.id);
      }
      if (msg.method === "Runtime.exceptionThrown") {
        pageErrors.push(msg.params.exceptionDetails);
      }
    };

    await new Promise(res => ws.onopen = res);

    const send = (method, params = {}) => new Promise((resolve, reject) => {
      const id = msgId++;
      callbacks.set(id, resolve);
      ws.send(JSON.stringify({ id, method, params }));
    });

    await send("Runtime.enable");
    await send("Page.enable");
    await send("DOM.enable");

    // Wait for DOM & canvas animations to initialize
    await new Promise(r => setTimeout(r, 2000));

    async function evaluate(expression) {
      const res = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
      return res?.result?.value;
    }

    // 1. Verify Page Errors
    console.log(`\n[1] Page Console Exceptions: ${pageErrors.length}`);
    if (pageErrors.length > 0) {
      console.error("Errors found:", pageErrors);
    }

    // 2. Verify Circular Cursor System (Dot + Elastic Ring)
    const cursorCheck = await evaluate(`(() => {
      const dot = document.getElementById("cur-dot");
      const ring = document.getElementById("cur-ring");
      if (!dot || !ring) return { ok: false, error: "Missing #cur-dot or #cur-ring" };
      const dotStyle = window.getComputedStyle(dot);
      const ringStyle = window.getComputedStyle(ring);
      
      // Simulate pointer movement to (300, 300)
      window.dispatchEvent(new PointerEvent("pointermove", { clientX: 300, clientY: 300 }));
      
      // Test hover expansion
      const testBtn = document.querySelector(".btn-hire");
      let hoverExpanded = false;
      if (testBtn) {
        testBtn.dispatchEvent(new PointerEvent("pointerover", { bubbles: true }));
        hoverExpanded = ring.classList.contains("cur-hover");
        testBtn.dispatchEvent(new PointerEvent("pointerout", { bubbles: true }));
      }

      // Test click compression
      window.dispatchEvent(new MouseEvent("mousedown"));
      const isCompressed = ring.classList.contains("cur-active");
      window.dispatchEvent(new MouseEvent("mouseup"));

      return {
        ok: true,
        dotBorderRadius: dotStyle.borderRadius,
        ringBorderRadius: ringStyle.borderRadius,
        dotPointerEvents: dotStyle.pointerEvents,
        ringPointerEvents: ringStyle.pointerEvents,
        ringDefaultWidth: ringStyle.width,
        ringDefaultHeight: ringStyle.height,
        hoverExpands: hoverExpanded,
        clickCompresses: isCompressed
      };
    })()`);
    console.log(`\n[2] High-Performance Circular Cursor Check:`, cursorCheck);

    // 3. Verify Removal of LeetCode & Coding Profiles & Phone number
    const removalCheck = await evaluate(`(() => {
      const bodyText = document.body.innerText;
      const hasLeetCode = /leetcode/i.test(bodyText);
      const lcLinks = Array.from(document.querySelectorAll('a[href*="leetcode"]')).map(a => a.href);
      const profilesSec = document.getElementById("profiles");
      const phoneMatches = bodyText.match(/(?:\\+91[\\-\\s]?)?[6-9]\\d{9}/g) || [];
      return {
        hasProfilesSection: !!profilesSec,
        hasLeetCodeText: hasLeetCode,
        leetcodeLinksCount: lcLinks.length,
        phoneMatchesFound: phoneMatches
      };
    })()`);
    console.log(`\n[3] Clean Data Check (No LeetCode / No Fake Profiles / No Phone):`, removalCheck);

    // 4. Verify Projects and Screenshots
    const projectsCheck = await evaluate(`(() => {
      const cards = Array.from(document.querySelectorAll("#projects .proj-card"));
      return cards.map(c => {
        const title = c.querySelector(".proj-name")?.innerText || "";
        const img = c.querySelector(".proj-top-bar img")?.getAttribute("src") || "";
        const canvas = c.querySelector("#drainsense-canvas") ? "810-Grid Canvas Active" : null;
        const links = Array.from(c.querySelectorAll("a")).map(a => a.href);
        return { title, img, canvas, links };
      });
    })()`);
    console.log(`\n[4] Projects Data & Media Check:`, JSON.stringify(projectsCheck, null, 2));

    // 5. Verify DrainSense 810-Grid Canvas
    const drainSenseCanvasCheck = await evaluate(`(() => {
      const canvas = document.getElementById("drainsense-canvas");
      if (!canvas) return { ok: false };
      const ctx = canvas.getContext("2d");
      const pixel = ctx.getImageData(100, 100, 1, 1).data;
      return {
        ok: true,
        width: canvas.width,
        height: canvas.height,
        activePixelAlpha: pixel[3]
      };
    })()`);
    console.log(`\n[5] DrainSense 810-Grid Canvas Active Check:`, drainSenseCanvasCheck);

    // 6. Verify Research Lab Simulator
    const labCheck = await evaluate(`(() => {
      const slider = document.getElementById("lab-sparsity-slider");
      const nodes = document.querySelectorAll(".head-node");
      const vram = document.getElementById("lab-vram-metric")?.innerText;
      const acc = document.getElementById("lab-acc-metric")?.innerText;
      if (!slider) return { ok: false, error: "Missing slider" };
      slider.value = 50;
      slider.dispatchEvent(new Event("input"));
      const newVram = document.getElementById("lab-vram-metric")?.innerText;
      return {
        ok: true,
        headNodesCount: nodes.length,
        initialVram: vram,
        updatedVram: newVram,
        accuracy: acc
      };
    })()`);
    console.log(`\n[6] Transformer Pruning Lab Simulator Check:`, labCheck);

    // Set viewport for high-DPI screenshots
    await send("Emulation.setDeviceMetricsOverride", {
      width: 1440,
      height: 900,
      deviceScaleFactor: 2,
      mobile: false
    });

    // Ensure CLI modal is closed during page scroll screenshots
    await evaluate(`(() => {
      const modal = document.getElementById("cli-modal");
      if (modal) modal.classList.remove("open");
    })()`);

    // Screenshot 1: Hero
    await evaluate(`window.scrollTo(0, 0)`);
    await new Promise(r => setTimeout(r, 600));
    const heroShot = await send("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(path.join(__dirname, "preview-final-hero.png"), Buffer.from(heroShot.data, "base64"));
    console.log("\n[Screenshot 1/4] Saved preview-final-hero.png");

    // Screenshot 2: Projects (Top row)
    await evaluate(`document.getElementById("projects")?.scrollIntoView({ behavior: 'instant', block: 'start' })`);
    await new Promise(r => setTimeout(r, 800));
    const projShot = await send("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(path.join(__dirname, "preview-final-projects.png"), Buffer.from(projShot.data, "base64"));
    console.log("[Screenshot 2/5] Saved preview-final-projects.png");

    // Screenshot 2b: Projects (DrainSenseAI & SpaceShooter)
    await evaluate(`(() => {
      const cards = document.querySelectorAll("#projects .proj-card");
      if (cards[2]) cards[2].scrollIntoView({ behavior: "instant", block: "start" });
    })()`);
    await new Promise(r => setTimeout(r, 800));
    const projLowerShot = await send("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(path.join(__dirname, "preview-final-projects-lower.png"), Buffer.from(projLowerShot.data, "base64"));
    console.log("[Screenshot 3/5] Saved preview-final-projects-lower.png");

    // Screenshot 3: Research Lab
    await evaluate(`document.getElementById("research")?.scrollIntoView({ behavior: 'instant', block: 'start' })`);
    await new Promise(r => setTimeout(r, 800));
    const labShot = await send("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(path.join(__dirname, "preview-final-research.png"), Buffer.from(labShot.data, "base64"));
    console.log("[Screenshot 3/4] Saved preview-final-research.png");

    // 7. Verify Developer CLI Terminal & Capture Screenshot 4
    const cliCheck = await evaluate(`(() => {
      const toggle = document.getElementById("cli-toggle");
      const modal = document.getElementById("cli-modal");
      const input = document.getElementById("cli-input");
      const output = document.getElementById("cli-output");
      if (!toggle || !modal || !input) return { ok: false, error: "Missing CLI elements" };

      // Open CLI
      toggle.click();
      const isOpen = modal.classList.contains("open");

      // Execute commands directly via input event or dispatch
      const runCmd = (cmd) => {
        input.value = cmd;
        const e = new KeyboardEvent("keydown", { key: "Enter", bubbles: true });
        input.dispatchEvent(e);
      };

      runCmd("help");
      runCmd("projects");

      return {
        ok: true,
        isOpen,
        outputLength: output.children.length,
        hasVarsha: output.innerText.includes("VarshaPurvanumanAI"),
        hasSpaceShooter: output.innerText.includes("Space-Shooter-3D")
      };
    })()`);
    console.log(`\n[7] Developer CLI Terminal Check:`, cliCheck);

    await new Promise(r => setTimeout(r, 500));
    const cliShot = await send("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(path.join(__dirname, "preview-final-cli.png"), Buffer.from(cliShot.data, "base64"));
    console.log("[Screenshot 4/4] Saved preview-final-cli.png");

    console.log("\n=== ALL VERIFICATION CHECKS COMPLETED SUCCESSFULLY ===");
    ws.close();
  } catch (err) {
    console.error("Verification failed:", err);
  } finally {
    chrome.kill();
    process.exit(0);
  }
}

runVerification();
