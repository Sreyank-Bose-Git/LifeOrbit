// Web Audio API Ambient Soundscapes & Procedural Audio Engine
// 100% offline, zero external audio assets, zero latency Web Audio API

export type AmbientSoundType =
  | "none"
  | "cyberpunk"
  | "space"
  | "rain"
  | "zen"
  | "lofi"
  | "binaural-alpha"
  | "binaural-gamma";

class ProceduralAudioEngine {
  private ctx: AudioContext | null = null;
  private currentType: AmbientSoundType = "none";
  private isPlaying = false;
  private masterVolume = 0.25;
  private soundEffectsEnabled = true;

  // Active audio nodes
  private masterGain: GainNode | null = null;
  private ambientGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private activeNodes: Array<AudioNode | { stop: () => void; disconnect: () => void }> = [];
  private activeIntervals: number[] = [];

  private initContext() {
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtxClass) {
        this.ctx = new AudioCtxClass();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }

    if (this.ctx && !this.masterGain) {
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.masterVolume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(1, this.ctx.currentTime);
      this.ambientGain.connect(this.masterGain);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(0.5, this.ctx.currentTime);
      this.sfxGain.connect(this.masterGain);
    }
  }

  // ==========================================
  // AMBIENT SOUNDSCAPES
  // ==========================================

  public playSoundscape(type: AmbientSoundType, volume = 0.25) {
    this.stopAmbient();
    if (type === "none") return;

    this.initContext();
    if (!this.ctx || !this.ambientGain) return;

    this.currentType = type;
    this.isPlaying = true;
    this.setVolume(volume);

    switch (type) {
      case "cyberpunk":
        this.startCyberpunkDrone();
        break;
      case "space":
        this.startDeepSpaceNebula();
        break;
      case "rain":
        this.startGentleRainAndThunder();
        break;
      case "zen":
        this.startZenSingingBowls();
        break;
      case "lofi":
        this.startLoFiVinylAmbience();
        break;
      case "binaural-alpha":
        this.startBinauralBeats(216, 10); // 10Hz Alpha Focus
        break;
      case "binaural-gamma":
        this.startBinauralBeats(240, 40); // 40Hz Gamma Peak Cognition
        break;
    }
  }

  // 1. Cyberpunk Synthwave Ambient Drone
  private startCyberpunkDrone() {
    if (!this.ctx || !this.ambientGain) return;

    const baseFreqs = [55, 110, 164.81, 220]; // A1, A2, E3, A3
    baseFreqs.forEach((freq, i) => {
      const osc = this.ctx!.createOscillator();
      const filter = this.ctx!.createBiquadFilter();
      const gain = this.ctx!.createGain();

      osc.type = i % 2 === 0 ? "sawtooth" : "triangle";
      osc.frequency.setValueAtTime(freq + (Math.random() - 0.5) * 0.8, this.ctx!.currentTime);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(280 + i * 80, this.ctx!.currentTime);
      filter.Q.setValueAtTime(4.0, this.ctx!.currentTime);

      // Low frequency modulation on filter
      const lfo = this.ctx!.createOscillator();
      const lfoGain = this.ctx!.createGain();
      lfo.frequency.setValueAtTime(0.08 + i * 0.03, this.ctx!.currentTime);
      lfoGain.gain.setValueAtTime(120, this.ctx!.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);
      lfo.start();

      gain.gain.setValueAtTime(0.08 / (i + 1), this.ctx!.currentTime);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ambientGain!);

      osc.start();
      this.activeNodes.push(osc, lfo, filter, gain, lfoGain);
    });
  }

  // 2. Deep Space Nebula & Cosmic Shimmer
  private startDeepSpaceNebula() {
    if (!this.ctx || !this.ambientGain) return;

    // Pink noise floor
    this.createPinkNoise(0.06, 400);

    // Warm sub drone
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = "sine";
    subOsc.frequency.setValueAtTime(65.41, this.ctx.currentTime); // C2
    subGain.gain.setValueAtTime(0.18, this.ctx.currentTime);
    subOsc.connect(subGain);
    subGain.connect(this.ambientGain);
    subOsc.start();
    this.activeNodes.push(subOsc, subGain);

    // Harmonic cosmic intervals (C3, G3, D#3)
    [130.81, 196.0, 155.56].forEach((f) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      const filter = this.ctx!.createBiquadFilter();

      osc.type = "sine";
      osc.frequency.setValueAtTime(f, this.ctx!.currentTime);

      filter.type = "bandpass";
      filter.frequency.setValueAtTime(f, this.ctx!.currentTime);
      filter.Q.setValueAtTime(6.0, this.ctx!.currentTime);

      gain.gain.setValueAtTime(0.05, this.ctx!.currentTime);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ambientGain!);

      osc.start();
      this.activeNodes.push(osc, filter, gain);
    });
  }

  // 3. Gentle Rain & Occasional Soft Thunder
  private startGentleRainAndThunder() {
    if (!this.ctx || !this.ambientGain) return;

    // Rain sound (filtered noise)
    const bufferSize = 2 * this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * 0.3;
    }

    const rainSrc = this.ctx.createBufferSource();
    rainSrc.buffer = noiseBuffer;
    rainSrc.loop = true;

    const bandpass = this.ctx.createBiquadFilter();
    bandpass.type = "bandpass";
    bandpass.frequency.setValueAtTime(900, this.ctx.currentTime);
    bandpass.Q.setValueAtTime(0.7, this.ctx.currentTime);

    const lowpass = this.ctx.createBiquadFilter();
    lowpass.type = "lowpass";
    lowpass.frequency.setValueAtTime(2800, this.ctx.currentTime);

    const rainGain = this.ctx.createGain();
    rainGain.gain.setValueAtTime(0.2, this.ctx.currentTime);

    rainSrc.connect(bandpass);
    bandpass.connect(lowpass);
    lowpass.connect(rainGain);
    rainGain.connect(this.ambientGain);

    rainSrc.start();
    this.activeNodes.push(rainSrc, bandpass, lowpass, rainGain);

    // Random soft thunder rumble every 12-25s
    const triggerThunder = () => {
      if (!this.ctx || !this.isPlaying || !this.ambientGain) return;
      const thundBuffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 4, this.ctx.sampleRate);
      const thundData = thundBuffer.getChannelData(0);
      for (let i = 0; i < thundData.length; i++) {
        thundData[i] = (Math.random() * 2 - 1) * (1 - i / thundData.length);
      }
      const thundSrc = this.ctx.createBufferSource();
      thundSrc.buffer = thundBuffer;

      const thundFilter = this.ctx.createBiquadFilter();
      thundFilter.type = "lowpass";
      thundFilter.frequency.setValueAtTime(140, this.ctx.currentTime);

      const thundGain = this.ctx.createGain();
      thundGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      thundGain.gain.exponentialRampToValueAtTime(0.12, this.ctx.currentTime + 0.5);
      thundGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 3.8);

      thundSrc.connect(thundFilter);
      thundFilter.connect(thundGain);
      thundGain.connect(this.ambientGain);
      thundSrc.start();
    };

    const intervalId = window.setInterval(triggerThunder, 16000);
    this.activeIntervals.push(intervalId);
  }

  // 4. Zen Temple Singing Bowls & Mindfulness
  private startZenSingingBowls() {
    if (!this.ctx || !this.ambientGain) return;

    // Soft warm background air
    this.createPinkNoise(0.03, 300);

    const playBowl = (freq: number) => {
      if (!this.ctx || !this.isPlaying || !this.ambientGain) return;
      const fundamentals = [freq, freq * 2.76, freq * 5.4];
      fundamentals.forEach((f, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(f, this.ctx!.currentTime);

        const dur = 6 - idx * 1.5;
        gain.gain.setValueAtTime(0.001, this.ctx!.currentTime);
        gain.gain.linearRampToValueAtTime(0.1 / (idx + 1), this.ctx!.currentTime + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx!.currentTime + dur);

        osc.connect(gain);
        gain.connect(this.ambientGain!);
        osc.start();
        osc.stop(this.ctx!.currentTime + dur);
      });
    };

    playBowl(261.63); // C4 initial strike
    const bowlInterval = window.setInterval(() => {
      const notes = [220, 261.63, 293.66, 329.63, 392.0];
      const randomNote = notes[Math.floor(Math.random() * notes.length)];
      playBowl(randomNote);
    }, 7000);
    this.activeIntervals.push(bowlInterval);
  }

  // 5. Lo-Fi Vinyl & Electric Piano Ambient
  private startLoFiVinylAmbience() {
    if (!this.ctx || !this.ambientGain) return;

    // Vinyl crackle simulation
    const vinylBuffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 2, this.ctx.sampleRate);
    const data = vinylBuffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      // Occasional crackle spikes
      if (Math.random() < 0.004) {
        data[i] = (Math.random() * 2 - 1) * 0.4;
      } else {
        data[i] = (Math.random() * 2 - 1) * 0.02;
      }
    }

    const vinylSrc = this.ctx.createBufferSource();
    vinylSrc.buffer = vinylBuffer;
    vinylSrc.loop = true;

    const vinylFilter = this.ctx.createBiquadFilter();
    vinylFilter.type = "highpass";
    vinylFilter.frequency.setValueAtTime(600, this.ctx.currentTime);

    const vinylGain = this.ctx.createGain();
    vinylGain.gain.setValueAtTime(0.08, this.ctx.currentTime);

    vinylSrc.connect(vinylFilter);
    vinylFilter.connect(vinylGain);
    vinylGain.connect(this.ambientGain);
    vinylSrc.start();
    this.activeNodes.push(vinylSrc, vinylFilter, vinylGain);

    // Warm Lo-Fi Rhodes chord pad
    const chords = [
      [174.61, 220.0, 261.63, 329.63], // Fmaj7
      [146.83, 174.61, 220.0, 261.63], // Dm7
      [130.81, 164.81, 196.0, 246.94], // Cmaj7
      [164.81, 196.0, 246.94, 293.66], // Em7
    ];

    let chordIndex = 0;
    const playChord = () => {
      if (!this.ctx || !this.isPlaying || !this.ambientGain) return;
      const currentChord = chords[chordIndex % chords.length];
      chordIndex++;

      currentChord.forEach((f) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        const filter = this.ctx!.createBiquadFilter();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(f, this.ctx!.currentTime);

        filter.type = "lowpass";
        filter.frequency.setValueAtTime(650, this.ctx!.currentTime);

        gain.gain.setValueAtTime(0.001, this.ctx!.currentTime);
        gain.gain.linearRampToValueAtTime(0.04, this.ctx!.currentTime + 1.2);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx!.currentTime + 5.5);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ambientGain!);

        osc.start();
        osc.stop(this.ctx!.currentTime + 5.8);
      });
    };

    playChord();
    const lofiInterval = window.setInterval(playChord, 6000);
    this.activeIntervals.push(lofiInterval);
  }

  // 6. Binaural Beats Generator
  private startBinauralBeats(frequency: number, beatDiff: number) {
    if (!this.ctx || !this.ambientGain) return;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.18, this.ctx.currentTime);

    const oscLeft = this.ctx.createOscillator();
    const panLeft = this.ctx.createStereoPanner ? this.ctx.createStereoPanner() : null;
    oscLeft.type = "sine";
    oscLeft.frequency.setValueAtTime(frequency, this.ctx.currentTime);

    const oscRight = this.ctx.createOscillator();
    const panRight = this.ctx.createStereoPanner ? this.ctx.createStereoPanner() : null;
    oscRight.type = "sine";
    oscRight.frequency.setValueAtTime(frequency + beatDiff, this.ctx.currentTime);

    if (panLeft && panRight) {
      panLeft.pan.value = -1;
      panRight.pan.value = 1;
      oscLeft.connect(panLeft);
      panLeft.connect(gain);
      oscRight.connect(panRight);
      panRight.connect(gain);
    } else {
      oscLeft.connect(gain);
      oscRight.connect(gain);
    }

    gain.connect(this.ambientGain);
    oscLeft.start();
    oscRight.start();

    this.activeNodes.push(oscLeft, oscRight, gain);
  }

  private createPinkNoise(volume = 0.08, cutoff = 1000) {
    if (!this.ctx || !this.ambientGain) return;
    const bufferSize = 2 * this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
      b6 = white * 0.115926;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(cutoff, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(volume, this.ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ambientGain);

    whiteNoise.start();
    this.activeNodes.push(whiteNoise, filter, gain);
  }

  // ==========================================
  // SHORT INTERACTIVE UI SOUND EFFECTS
  // ==========================================

  public setSoundEffectsEnabled(enabled: boolean) {
    this.soundEffectsEnabled = enabled;
  }

  public getSoundEffectsEnabled() {
    return this.soundEffectsEnabled;
  }

  // Soft tactile click pop
  public playClick() {
    if (!this.soundEffectsEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(200, this.ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch {
      // Audio safety
    }
  }

  // Major triad success chime
  public playSuccess() {
    if (!this.soundEffectsEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    try {
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((f, i) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(f, this.ctx!.currentTime + i * 0.07);

        gain.gain.setValueAtTime(0.001, this.ctx!.currentTime + i * 0.07);
        gain.gain.linearRampToValueAtTime(0.15, this.ctx!.currentTime + i * 0.07 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx!.currentTime + i * 0.07 + 0.45);

        osc.connect(gain);
        gain.connect(this.sfxGain!);

        osc.start(this.ctx!.currentTime + i * 0.07);
        osc.stop(this.ctx!.currentTime + i * 0.07 + 0.5);
      });
    } catch {
      // Audio safety
    }
  }

  // Level Up / Big Goal Celebration Fanfare
  public playLevelUp() {
    if (!this.soundEffectsEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    try {
      const melody = [440, 554.37, 659.25, 880, 1108.73, 1318.51];
      melody.forEach((f, i) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = i === melody.length - 1 ? "triangle" : "sine";
        osc.frequency.setValueAtTime(f, this.ctx!.currentTime + i * 0.08);

        const dur = i === melody.length - 1 ? 0.9 : 0.25;
        gain.gain.setValueAtTime(0.001, this.ctx!.currentTime + i * 0.08);
        gain.gain.linearRampToValueAtTime(0.2, this.ctx!.currentTime + i * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx!.currentTime + i * 0.08 + dur);

        osc.connect(gain);
        gain.connect(this.sfxGain!);

        osc.start(this.ctx!.currentTime + i * 0.08);
        osc.stop(this.ctx!.currentTime + i * 0.08 + dur + 0.1);
      });
    } catch {
      // Audio safety
    }
  }

  // Cinematic Intro Logo Sound Effect (Deep bass swell + shimmering harmonic chime)
  public playIntroLogoSound() {
    if (!this.soundEffectsEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    try {
      // 1. Sub Bass cinematic impact
      const subOsc = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      subOsc.type = "sine";
      subOsc.frequency.setValueAtTime(120, this.ctx.currentTime);
      subOsc.frequency.exponentialRampToValueAtTime(42, this.ctx.currentTime + 1.2);

      subGain.gain.setValueAtTime(0.25, this.ctx.currentTime);
      subGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1.8);

      subOsc.connect(subGain);
      subGain.connect(this.sfxGain);
      subOsc.start();
      subOsc.stop(this.ctx.currentTime + 2.0);

      // 2. Cosmic shimmer chords
      [523.25, 783.99, 1046.5, 1318.51, 1567.98].forEach((f, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(f, this.ctx!.currentTime + 0.3 + idx * 0.08);

        gain.gain.setValueAtTime(0.001, this.ctx!.currentTime + 0.3 + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.12, this.ctx!.currentTime + 0.3 + idx * 0.08 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx!.currentTime + 0.3 + idx * 0.08 + 1.6);

        osc.connect(gain);
        gain.connect(this.sfxGain!);

        osc.start(this.ctx!.currentTime + 0.3 + idx * 0.08);
        osc.stop(this.ctx!.currentTime + 2.5);
      });
    } catch {
      // Audio safety
    }
  }

  // Zen Optic Relaxation Chime (Warm singing bowl tone for eye breaks)
  public playZenChime() {
    if (!this.soundEffectsEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    try {
      [392, 587.33, 880].forEach((freq, i) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, this.ctx!.currentTime);

        const dur = 2.4 + i * 0.4;
        gain.gain.setValueAtTime(0.001, this.ctx!.currentTime);
        gain.gain.linearRampToValueAtTime(0.08 / (i + 1), this.ctx!.currentTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx!.currentTime + dur);

        osc.connect(gain);
        gain.connect(this.sfxGain!);

        osc.start(this.ctx!.currentTime);
        osc.stop(this.ctx!.currentTime + dur + 0.1);
      });
    } catch {
      // Audio safety
    }
  }

  // ==========================================
  // CONTROLS & STATE
  // ==========================================

  public setVolume(vol: number) {
    this.masterVolume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.masterVolume, this.ctx.currentTime);
    }
  }

  public getVolume() {
    return this.masterVolume;
  }

  public stopAmbient() {
    this.activeIntervals.forEach((id) => clearInterval(id));
    this.activeIntervals = [];

    this.activeNodes.forEach((node) => {
      try {
        if ("stop" in node && typeof (node as any).stop === "function") {
          (node as any).stop();
        }
        if ("disconnect" in node && typeof (node as any).disconnect === "function") {
          (node as any).disconnect();
        }
      } catch {
        // Disconnect safety
      }
    });

    this.activeNodes = [];
    this.isPlaying = false;
    this.currentType = "none";
  }

  public stop() {
    this.stopAmbient();
  }

  public playBinaural(frequency = 210, beatDiff = 10, volume = 0.2) {
    this.playSoundscape("binaural-alpha", volume);
  }

  public playRain(volume = 0.18) {
    this.playSoundscape("rain", volume);
  }

  public playNoise(type: "pink" | "white" = "pink", volume = 0.15) {
    this.playSoundscape("space", volume);
  }

  public getStatus() {
    return {
      isPlaying: this.isPlaying,
      currentType: this.currentType,
      volume: this.masterVolume,
      soundEffectsEnabled: this.soundEffectsEnabled,
    };
  }
}

export const focusAudio = new ProceduralAudioEngine();
