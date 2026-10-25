/**
 * Gaurav Gautam Portfolio — Interactive Research Lab & Project Simulators
 * Tactile, adventurous, and educational playgrounds showcasing Gaurav's
 * actual research and system architectures.
 */

document.addEventListener("DOMContentLoaded", () => {
  // =========================================================================
  // 1. INTERACTIVE RESEARCH LAB: TRANSFORMER COMPRESSION SIMULATOR
  // =========================================================================
  const sparsitySlider = document.getElementById("sparsity-slider");
  const sparsityValueDisplay = document.getElementById("sparsity-value-display");
  const retainedAccuracyDisplay = document.getElementById("retained-accuracy-display");
  const paramCountDisplay = document.getElementById("param-count-display");
  const vramDisplay = document.getElementById("vram-display");
  const latencyDisplay = document.getElementById("latency-display");
  const attentionHeadsGrid = document.getElementById("attention-heads-grid");
  const mlpLayersGrid = document.getElementById("mlp-layers-grid");
  const strategyBtns = document.querySelectorAll("[data-prune-strategy]");

  let activeStrategy = "cofi"; // "cofi" | "heads" | "mlp" | "qalora"

  // Strategy button click handlers
  strategyBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      strategyBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      activeStrategy = btn.getAttribute("data-prune-strategy");
      window.soundFx?.playTick();
      updateCompressionSimulator();
    });
  });

  if (sparsitySlider) {
    sparsitySlider.addEventListener("input", () => {
      window.soundFx?.playPulse();
      updateCompressionSimulator();
    });
  }

  function updateCompressionSimulator() {
    if (!sparsitySlider) return;
    const sparsity = parseInt(sparsitySlider.value, 10);
    if (sparsityValueDisplay) sparsityValueDisplay.textContent = `${sparsity}%`;

    // Baseline stats: Base model = 125M params, 520MB VRAM, 28ms latency
    const baseParams = 125;
    const currentParams = (baseParams * (1 - sparsity / 100)).toFixed(1);

    // Resume empirical evidence: at high compression, accuracy is preserved >95%
    let accuracy;
    if (activeStrategy === "cofi" || activeStrategy === "qalora") {
      // CoFi & QA-LoRA retain high accuracy even up to 55-60% sparsity
      if (sparsity <= 20) accuracy = (100 - sparsity * 0.08).toFixed(1);
      else if (sparsity <= 50) accuracy = (98.4 - (sparsity - 20) * 0.1).toFixed(1);
      else accuracy = (95.4 - (sparsity - 50) * 0.28).toFixed(1);
    } else {
      // Unstructured or naive pruning drops faster
      accuracy = Math.max(72, (100 - sparsity * 0.38)).toFixed(1);
    }

    // VRAM & Latency calculation
    let vramMB, latencyMs;
    if (activeStrategy === "qalora") {
      // 4-bit quantization reduces baseline VRAM by 3.5x
      vramMB = Math.round((520 / 3.5) * (1 - (sparsity / 100) * 0.6));
      latencyMs = Math.round(18 * (1 - (sparsity / 100) * 0.45));
    } else {
      vramMB = Math.round(520 * (1 - (sparsity / 100) * 0.7));
      latencyMs = Math.round(28 * (1 - (sparsity / 100) * 0.5));
    }

    if (retainedAccuracyDisplay) retainedAccuracyDisplay.textContent = `${accuracy}%`;
    if (paramCountDisplay) paramCountDisplay.textContent = `${currentParams}M`;
    if (vramDisplay) vramDisplay.textContent = `${vramMB} MB`;
    if (latencyDisplay) latencyDisplay.textContent = `${latencyMs} ms`;

    // Render 12 Attention Heads state
    if (attentionHeadsGrid) {
      let headsHtml = "";
      const totalHeads = 12;
      const prunedHeadsCount = Math.round((sparsity / 100) * totalHeads);

      for (let i = 0; i < totalHeads; i++) {
        const isPruned = i < prunedHeadsCount;
        headsHtml += `
          <div class="matrix-cell head-cell ${isPruned ? "is-pruned" : "is-active"}" title="Head ${i + 1}: ${isPruned ? "Pruned (Mask = 0)" : "Active (Mask = 1)"}">
            <span>H${i + 1}</span>
            <span class="cell-status">${isPruned ? "0" : "1"}</span>
          </div>`;
      }
      attentionHeadsGrid.innerHTML = headsHtml;
    }

    // Render MLP Hidden Dimension Layer state
    if (mlpLayersGrid) {
      let mlpHtml = "";
      const totalBlocks = 16;
      const prunedBlocksCount = Math.round((sparsity / 100) * totalBlocks);

      for (let j = 0; j < totalBlocks; j++) {
        const isPruned = j < prunedBlocksCount;
        mlpHtml += `
          <div class="matrix-cell mlp-cell ${isPruned ? "is-pruned" : "is-active"}" title="Intermediate Channel ${j + 1}: ${isPruned ? "Pruned" : "Active"}">
            <span>D${j + 1}</span>
          </div>`;
      }
      mlpLayersGrid.innerHTML = mlpHtml;
    }
  }

  // Initial call
  updateCompressionSimulator();

  // =========================================================================
  // 2. PROJECT INTERACTIVE DEMOS (RADAR, CONFLICT, DRAINAGE, ROUTE)
  // =========================================================================

  // Demo A: VarshaPurvanumanAI — Rainfall Downscaling Resolution Slider
  const rainfallIntensitySlider = document.getElementById("rainfall-intensity-slider");
  const coarseGridVisual = document.getElementById("coarse-grid-visual");
  const downscaledGridVisual = document.getElementById("downscaled-grid-visual");
  const rainfallAlertBadge = document.getElementById("rainfall-alert-badge");

  if (rainfallIntensitySlider) {
    rainfallIntensitySlider.addEventListener("input", (e) => {
      const val = parseInt(e.target.value, 10);
      window.soundFx?.playTick();

      // Update Coarse grid (blurry 4x4)
      if (coarseGridVisual) {
        coarseGridVisual.style.filter = `blur(${Math.max(4, 16 - val / 8)}px) saturate(${100 + val}%)`;
      }

      // Update Downscaled grid (sharp convective cells)
      if (downscaledGridVisual) {
        downscaledGridVisual.style.opacity = (0.5 + (val / 200)).toString();
      }

      if (rainfallAlertBadge) {
        if (val < 35) {
          rainfallAlertBadge.textContent = "Regime: Normal Orographic (Low Risk)";
          rainfallAlertBadge.className = "sim-badge badge-green";
        } else if (val < 70) {
          rainfallAlertBadge.textContent = "Regime: Monsoon Depression (Moderate Alert)";
          rainfallAlertBadge.className = "sim-badge badge-amber";
        } else {
          rainfallAlertBadge.textContent = "Regime: Localized Cloudburst Anomaly (Critical Alert)";
          rainfallAlertBadge.className = "sim-badge badge-red";
        }
      }
    });
  }

  // Demo B: RailSamanvayAI — Maintenance Block Conflict Resolver
  const triggerConflictBtn = document.getElementById("trigger-conflict-btn");
  const resolveConflictBtn = document.getElementById("resolve-conflict-btn");
  const conflictStatusText = document.getElementById("conflict-status-text");
  const trackBlockA = document.getElementById("track-block-a");
  const trackBlockB = document.getElementById("track-block-b");

  if (triggerConflictBtn && resolveConflictBtn) {
    triggerConflictBtn.addEventListener("click", () => {
      window.soundFx?.playPulse();
      if (trackBlockA) trackBlockA.style.transform = "translateX(45px)";
      if (trackBlockB) {
        trackBlockB.style.transform = "translateX(25px)";
        trackBlockB.classList.add("has-conflict");
      }
      if (conflictStatusText) {
        conflictStatusText.textContent = "⚠️ Collision Alert: Track possession overlaps with Express 12805 window!";
        conflictStatusText.style.color = "#ef4444";
      }
    });

    resolveConflictBtn.addEventListener("click", () => {
      window.soundFx?.playSuccess();
      if (trackBlockA) trackBlockA.style.transform = "translateX(0px)";
      if (trackBlockB) {
        trackBlockB.style.transform = "translateX(110px)";
        trackBlockB.classList.remove("has-conflict");
      }
      if (conflictStatusText) {
        conflictStatusText.textContent = "✔ Optimization Complete: Conflict eliminated; 45min safety headway enforced.";
        conflictStatusText.style.color = "#10b981";
      }
    });
  }

  // Demo C: DrainSense AI — 810-Grid Cell Inspector (Vijayawada / Amaravati)
  const drainCells = document.querySelectorAll(".drain-interactive-cell");
  const cellDetailName = document.getElementById("cell-detail-name");
  const cellDetailElevation = document.getElementById("cell-detail-elevation");
  const cellDetailCanal = document.getElementById("cell-detail-canal");
  const cellDetailShap = document.getElementById("cell-detail-shap");
  const cellDetailRisk = document.getElementById("cell-detail-risk");

  drainCells.forEach((cell) => {
    cell.addEventListener("mouseenter", () => {
      window.soundFx?.playTick();
      const cellId = cell.getAttribute("data-cell-id");
      const name = cell.getAttribute("data-cell-name");
      const elev = cell.getAttribute("data-cell-elev");
      const canal = cell.getAttribute("data-cell-canal");
      const risk = cell.getAttribute("data-cell-risk");
      const shap = cell.getAttribute("data-cell-shap");

      if (cellDetailName) cellDetailName.textContent = `Cell #${cellId}: ${name}`;
      if (cellDetailElevation) cellDetailElevation.textContent = elev;
      if (cellDetailCanal) cellDetailCanal.textContent = canal;
      if (cellDetailShap) cellDetailShap.textContent = shap;
      if (cellDetailRisk) {
        cellDetailRisk.textContent = risk;
        cellDetailRisk.className = `risk-badge risk-${risk.toLowerCase()}`;
      }
    });
  });

  // Demo D: Smart Route Finder — Dijkstra vs A* Traversal Stepper
  const algoToggleBtns = document.querySelectorAll("[data-algo-choice]");
  const algoStepsDisplay = document.getElementById("algo-steps-display");
  const algoExploredNodes = document.getElementById("algo-explored-nodes");
  const graphCanvas = document.getElementById("route-graph-canvas");

  algoToggleBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      algoToggleBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const algo = btn.getAttribute("data-algo-choice");
      window.soundFx?.playTick();

      if (algo === "astar") {
        if (algoStepsDisplay) algoStepsDisplay.textContent = "42 Nodes Explored (Directed Haversine Cone)";
        if (algoExploredNodes) algoExploredNodes.textContent = "64% Fewer Operations vs Dijkstra";
        if (graphCanvas) graphCanvas.setAttribute("data-active-algo", "astar");
      } else {
        if (algoStepsDisplay) algoStepsDisplay.textContent = "118 Nodes Explored (Uniform Radial Expansion)";
        if (algoExploredNodes) algoExploredNodes.textContent = "Full Exhaustive Dijkstra Frontier";
        if (graphCanvas) graphCanvas.setAttribute("data-active-algo", "dijkstra");
      }
    });
  });
});
