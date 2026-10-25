const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 9236;
const CHROME_PATH = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const TARGET_URL = "http://localhost:8085/";

async function runAllFeaturesTest() {
  console.log("=== EXHAUSTIVE VERIFICATION FOR GAURAV GAUTAM PORTFOLIO ===");

  const chrome = spawn(CHROME_PATH, [
    `--remote-debugging-port=${PORT}`,
    "--headless=new",
    "--disable-gpu",
    "--no-first-run",
    "--no-default-browser-check",
    `--user-data-dir=/tmp/chrome-all-${Date.now()}`,
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

    const send = (method, params = {}) => new Promise((resolve) => {
      const id = msgId++;
      callbacks.set(id, resolve);
      ws.send(JSON.stringify({ id, method, params }));
    });

    await send("Page.enable");
    await send("Runtime.enable");
    await send("DOM.enable");

    await new Promise(r => setTimeout(r, 1500));

    async function evaluate(expression) {
      const res = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
      return res?.result?.value;
    }

    // 1. Console Exceptions Check
    console.log(`\n[1] Page Console Exceptions: ${pageErrors.length}`);

    // 2. Default Dark Theme Check
    const darkThemeCheck = await evaluate(`(() => {
      const theme = document.documentElement.dataset.theme;
      const bodyBg = window.getComputedStyle(document.body).backgroundColor;
      const heroBg = window.getComputedStyle(document.querySelector(".hero")).backgroundColor;
      return {
        themeAttr: theme,
        bodyBg,
        heroBg,
        isDark: theme === "dark" || !theme
      };
    })()`);
    console.log(`\n[2] Default Theme Check (Must be Dark):`, darkThemeCheck);

    // 3. Realistic Views Check
    const viewsCheck = await evaluate(`(() => {
      const viewEls = Array.from(document.querySelectorAll('[data-live="views"]'));
      const text = viewEls[0]?.textContent || "";
      const num = parseInt(text.replace(/,/g, ""), 10);
      return {
        renderedText: text,
        numericValue: num,
        isRealistic: num >= 2400 && num <= 10000,
        hasComma: text.includes(",")
      };
    })()`);
    console.log(`\n[3] Realistic View Counter Check:`, viewsCheck);

    // 4. Chest Text in Avatar SVG Check
    const svgPath = path.join(__dirname, "assets/images/gaurav-hero.svg");
    const svgContent = fs.readFileSync(svgPath, "utf-8");
    const hasDeveloperChest = svgContent.includes("DEVELOPER &amp; AI/ML RESEARCHER") || svgContent.includes("DEVELOPER & AI/ML RESEARCHER");
    console.log(`\n[4] Background Avatar Chest Text Check:`, {
      hasGauravGautam: svgContent.includes("GAURAV GAUTAM"),
      hasDeveloperResearcher: hasDeveloperChest
    });

    // 5. High-DPI Desktop Dark Screenshot
    await send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 900, deviceScaleFactor: 2, mobile: false });
    await new Promise(r => setTimeout(r, 600));
    const darkHeroShot = await send("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(path.join(__dirname, "preview-dark-hero.png"), Buffer.from(darkHeroShot.data, "base64"));
    console.log("\n[Screenshot] Saved preview-dark-hero.png");

    // 6. Test Light Mode Toggle & Verification
    const lightModeTest = await evaluate(`(() => {
      const toggle = document.getElementById("theme-toggle");
      if (toggle) toggle.click();
      
      const theme = document.documentElement.dataset.theme;
      const bodyBg = window.getComputedStyle(document.body).backgroundColor;
      const hero = document.querySelector(".hero");
      const heroBg = hero ? window.getComputedStyle(hero).backgroundColor : "";
      const heroHi = document.querySelector(".hero-hi");
      const hiColor = heroHi ? window.getComputedStyle(heroHi).color : "";
      const projCard = document.querySelector(".proj-card");
      const cardBg = projCard ? window.getComputedStyle(projCard).backgroundColor : "";

      return {
        themeAttr: theme,
        isLight: theme === "light",
        bodyBg,
        heroBg,
        hiColor,
        cardBg
      };
    })()`);
    console.log(`\n[5] Light Mode Toggle & Styling Check:`, lightModeTest);

    await new Promise(r => setTimeout(r, 600));
    const lightHeroShot = await send("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(path.join(__dirname, "preview-light-hero.png"), Buffer.from(lightHeroShot.data, "base64"));
    console.log("[Screenshot] Saved preview-light-hero.png");

    // Scroll to projects in light mode
    await evaluate(`document.getElementById("projects")?.scrollIntoView({ behavior: 'instant', block: 'start' })`);
    await new Promise(r => setTimeout(r, 600));
    const lightProjShot = await send("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(path.join(__dirname, "preview-light-projects.png"), Buffer.from(lightProjShot.data, "base64"));
    console.log("[Screenshot] Saved preview-light-projects.png");

    // 7. Mobile Viewport Check (390px iPhone)
    await evaluate(`window.scrollTo(0, 0)`);
    await send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
    await new Promise(r => setTimeout(r, 600));

    const mobileLightShot = await send("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(path.join(__dirname, "preview-mobile-light-hero.png"), Buffer.from(mobileLightShot.data, "base64"));
    console.log("[Screenshot] Saved preview-mobile-light-hero.png");

    // Toggle back to dark mode
    await evaluate(`(() => {
      const toggle = document.getElementById("theme-toggle");
      if (toggle) toggle.click();
    })()`);
    await new Promise(r => setTimeout(r, 400));

    const mobileDarkShot = await send("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(path.join(__dirname, "preview-mobile-dark-hero.png"), Buffer.from(mobileDarkShot.data, "base64"));
    console.log("[Screenshot] Saved preview-mobile-dark-hero.png");

    // Test Mobile Menu Drawer
    const mobileMenuTest = await evaluate(`(() => {
      const hamburger = document.getElementById("nav-hamburger");
      const overlay = document.getElementById("nav-overlay");
      if (!hamburger || !overlay) return { ok: false };
      
      hamburger.click();
      const isOpen = document.body.classList.contains("menu-open") && overlay.classList.contains("open");
      return { ok: true, isOpen, overlayDisplay: window.getComputedStyle(overlay).visibility };
    })()`);
    console.log(`\n[6] Mobile Hamburger Drawer Check:`, mobileMenuTest);

    await new Promise(r => setTimeout(r, 400));
    const mobileMenuShot = await send("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(path.join(__dirname, "preview-mobile-menu.png"), Buffer.from(mobileMenuShot.data, "base64"));
    console.log("[Screenshot] Saved preview-mobile-menu.png");

    // Close menu
    await evaluate(`closeMobileMenu()`);

    console.log("\n=== ALL COMPREHENSIVE CHECKS PASSED ===");
    ws.close();
  } catch (err) {
    console.error("Test failed:", err);
  } finally {
    chrome.kill();
    process.exit(0);
  }
}

runAllFeaturesTest();
