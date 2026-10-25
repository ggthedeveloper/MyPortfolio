/**
 * Gaurav Gautam Portfolio — Audio Haptics Engine
 * Pure Web Audio API synthesized sound effects (Zero external MP3/WAV files)
 * STRICT MUTE-BY-DEFAULT: Requires explicit user action to unmute.
 * Complies with strict browser autoplay policies and accessibility guidelines.
 */

class AudioHapticsEngine {
  constructor() {
    this.ctx = null;
    this.isEnabled = false;
    this.masterGain = null;
  }

  init() {
    if (this.ctx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    this.ctx = new AudioContext();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.08, this.ctx.currentTime); // Gentle ambient level
    this.masterGain.connect(this.ctx.destination);
  }

  toggle() {
    if (!this.ctx) this.init();
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
    this.isEnabled = !this.isEnabled;
    return this.isEnabled;
  }

  // Soft high-frequency haptic tick (button hover)
  playTick() {
    if (!this.isEnabled || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(1400, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.035);

      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.035);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch (e) {}
  }

  // Resonant holographic chime (card click / modal open)
  playChime() {
    if (!this.isEnabled || !this.ctx) return;
    try {
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.03);

        const startTime = this.ctx.currentTime + idx * 0.03;
        gain.gain.setValueAtTime(0.05, startTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.28);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(startTime);
        osc.stop(startTime + 0.3);
      });
    } catch (e) {}
  }

  // Soft low-frequency pulse (pruning slider drag / mode warp)
  playPulse() {
    if (!this.isEnabled || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(120, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(280, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.09);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.1);
    } catch (e) {}
  }

  // Success chord (command execution / email copy)
  playSuccess() {
    if (!this.isEnabled || !this.ctx) return;
    try {
      [440, 554.37, 659.25, 880].forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sine";
        const st = this.ctx.currentTime + i * 0.04;
        osc.frequency.setValueAtTime(freq, st);
        gain.gain.setValueAtTime(0.04, st);
        gain.gain.exponentialRampToValueAtTime(0.0001, st + 0.22);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(st);
        osc.stop(st + 0.25);
      });
    } catch (e) {}
  }
}

// Global instance
window.soundFx = new AudioHapticsEngine();
