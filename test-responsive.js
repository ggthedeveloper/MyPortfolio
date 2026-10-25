const { spawn } = require('child_process');
const http = require('http');

const PORT = 9235;
const CHROME_PATH = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const TARGET_URL = "http://localhost:8085/";

const VIEWPORTS = [
  { name: "Mobile Small (360px)", width: 360, height: 740 },
  { name: "iPhone Standard (390px)", width: 390, height: 844 },
  { name: "iPhone Max (414px)", width: 414, height: 896 },
  { name: "Tablet Portrait (768px)", width: 768, height: 1024 },
  { name: "Tablet Landscape (1024px)", width: 1024, height: 768 },
  { name: "Desktop Standard (1440px)", width: 1440, height: 900 },
  { name: "Full HD (1920px)", width: 1920, height: 1080 }
];

async function runTest() {
  console.log("=== RUNNING RESPONSIVE OVERFLOW TEST ===");

  const chrome = spawn(CHROME_PATH, [
    `--remote-debugging-port=${PORT}`,
    "--headless=new",
    "--disable-gpu",
    "--no-first-run",
    "--no-default-browser-check",
    `--user-data-dir=/tmp/chrome-resp-${Date.now()}`,
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

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && callbacks.has(msg.id)) {
        callbacks.get(msg.id)(msg.result);
        callbacks.delete(msg.id);
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

    for (const vp of VIEWPORTS) {
      await send("Emulation.setDeviceMetricsOverride", {
        width: vp.width,
        height: vp.height,
        deviceScaleFactor: 2,
        mobile: vp.width <= 768
      });

      await new Promise(r => setTimeout(r, 400));

      const res = await send("Runtime.evaluate", {
        expression: `(() => {
          const body = document.body;
          const doc = document.documentElement;
          const scrollWidth = Math.max(body.scrollWidth, doc.scrollWidth);
          const innerWidth = window.innerWidth;
          const hasOverflow = scrollWidth > innerWidth + 1;

          // Find offending overflowing elements if any
          const overflowing = [];
          if (hasOverflow) {
            document.querySelectorAll("*").forEach(el => {
              const r = el.getBoundingClientRect();
              if (r.right > innerWidth + 2) {
                overflowing.push({
                  tag: el.tagName,
                  id: el.id,
                  cls: el.className,
                  right: Math.round(r.right),
                  width: Math.round(r.width)
                });
              }
            });
          }

          return {
            scrollWidth,
            innerWidth,
            hasOverflow,
            overflowingCount: overflowing.length,
            sample: overflowing.slice(0, 3)
          };
        })()`,
        returnByValue: true
      });

      const val = res?.result?.value;
      console.log(`[Viewport: ${vp.name}] ${val?.hasOverflow ? "FAIL (OVERFLOW)" : "PASS (NO OVERFLOW)"}`, val);
    }

    ws.close();
  } catch (err) {
    console.error("Test failed:", err);
  } finally {
    chrome.kill();
  }
}

runTest();
