// Web Audio API Focus Sound Generator (Binaural Beats, Pink Noise, Gentle Rain synth)

class FocusAudioEngine {
  private ctx: AudioContext | null = null;
  private currentType: "none" | "binaural" | "noise" | "rain" = "none";
  private nodes: {
    oscLeft?: OscillatorNode;
    oscRight?: OscillatorNode;
    gain?: GainNode;
    noiseNode?: AudioNode;
  } = {};
  private isPlaying = false;

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
  }

  public playBinaural(frequency = 210, beatDiff = 10, volume = 0.2) {
    this.stop();
    this.initContext();
    if (!this.ctx) return;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(volume, this.ctx.currentTime);

    // Left channel
    const oscLeft = this.ctx.createOscillator();
    const panLeft = this.ctx.createStereoPanner ? this.ctx.createStereoPanner() : null;
    oscLeft.type = "sine";
    oscLeft.frequency.value = frequency;

    // Right channel (Alpha/Theta wave differential, e.g. 210Hz vs 220Hz = 10Hz focus beat)
    const oscRight = this.ctx.createOscillator();
    const panRight = this.ctx.createStereoPanner ? this.ctx.createStereoPanner() : null;
    oscRight.type = "sine";
    oscRight.frequency.value = frequency + beatDiff;

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

    gain.connect(this.ctx.destination);
    oscLeft.start();
    oscRight.start();

    this.nodes = { oscLeft, oscRight, gain };
    this.currentType = "binaural";
    this.isPlaying = true;
  }

  public playNoise(type: "pink" | "white" = "pink", volume = 0.15) {
    this.stop();
    this.initContext();
    if (!this.ctx) return;

    const bufferSize = 2 * this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      if (type === "pink") {
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
        b6 = white * 0.115926;
      } else {
        output[i] = white * 0.2;
      }
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 1200;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(volume, this.ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    whiteNoise.start();

    this.nodes = { noiseNode: whiteNoise, gain };
    this.currentType = "noise";
    this.isPlaying = true;
  }

  public setVolume(vol: number) {
    if (this.nodes.gain && this.ctx) {
      this.nodes.gain.gain.setValueAtTime(Math.max(0, Math.min(1, vol)), this.ctx.currentTime);
    }
  }

  public stop() {
    try {
      if (this.nodes.oscLeft) {
        this.nodes.oscLeft.stop();
        this.nodes.oscLeft.disconnect();
      }
      if (this.nodes.oscRight) {
        this.nodes.oscRight.stop();
        this.nodes.oscRight.disconnect();
      }
      if (this.nodes.noiseNode && (this.nodes.noiseNode as any).stop) {
        (this.nodes.noiseNode as any).stop();
        this.nodes.noiseNode.disconnect();
      }
      if (this.nodes.gain) {
        this.nodes.gain.disconnect();
      }
    } catch {
      // Ignore disconnect errors
    }
    this.nodes = {};
    this.isPlaying = false;
    this.currentType = "none";
  }

  public getStatus() {
    return {
      isPlaying: this.isPlaying,
      currentType: this.currentType,
    };
  }
}

export const focusAudio = new FocusAudioEngine();
