/**
 * THE GAURAV GAUTAM COSMOS — Space Audio Synthesizer
 * Built entirely with Web Audio API (Zero external MP3/WAV assets)
 * Supports Warp Drives, Orbit Locks, Telemetry Scans & Thrusters
 */

class SpaceAudioSynthesizer {
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
    this.masterGain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);
  }

  toggle() {
    if (!this.ctx) this.init();
    if (this.ctx && this.ctx.state === "suspended") this.ctx.resume();
    this.isEnabled = !this.isEnabled;
    return this.isEnabled;
  }

  // Cinematic Warp Drive Surge
  playWarp() {
    if (!this.isEnabled || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(80, now);
      osc.frequency.exponentialRampToValueAtTime(420, now + 0.35);
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.85);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.09, now + 0.25);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.85);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.9);
    } catch (e) {}
  }

  // Planetary Orbit Lock Chime
  playOrbitLock() {
    if (!this.isEnabled || !this.ctx) return;
    try {
      const freqs = [329.63, 440, 659.25, 880]; // E4, A4, E5, A5
      const now = this.ctx.currentTime;

      freqs.forEach((f, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const st = now + idx * 0.04;

        osc.type = "sine";
        osc.frequency.setValueAtTime(f, st);

        gain.gain.setValueAtTime(0.05, st);
        gain.gain.exponentialRampToValueAtTime(0.0001, st + 0.35);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(st);
        osc.stop(st + 0.4);
      });
    } catch (e) {}
  }

  // Scanner UI Blip
  playChime() {
    this.playOrbitLock();
  }

  playTick() {
    if (!this.isEnabled || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = "sine";
      osc.frequency.setValueAtTime(1800, now);
      osc.frequency.exponentialRampToValueAtTime(900, now + 0.025);

      gain.gain.setValueAtTime(0.03, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.03);
    } catch (e) {}
  }
}

window.spaceAudio = new SpaceAudioSynthesizer();
