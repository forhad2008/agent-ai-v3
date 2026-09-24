// Real Audio Ringtone & Web Audio Service for Agent-sigma08
// Supports Authentic Pirates of the Caribbean ("He's a Pirate") Master Audio Track, Looping & Web Audio Fallback

class SoundService {
  private activeAudio: HTMLAudioElement | null = null;
  private activeContext: AudioContext | null = null;
  private activeOscillators: OscillatorNode[] = [];
  private isPlayingPirates: boolean = false;
  private listeners: Set<(playing: boolean) => void> = new Set();

  private getAudioContext(): AudioContext | null {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      return AudioCtx ? new AudioCtx() : null;
    } catch {
      return null;
    }
  }

  public subscribePiratesState(callback: (playing: boolean) => void): () => void {
    this.listeners.add(callback);
    callback(this.isPlayingPirates);
    return () => {
      this.listeners.delete(callback);
    };
  }

  private notifyState(playing: boolean) {
    this.isPlayingPirates = playing;
    this.listeners.forEach((cb) => cb(playing));
  }

  public isPiratesPlaying(): boolean {
    return this.isPlayingPirates;
  }

  // Soft digital upward sweep on message send
  public playSendSound() {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(420, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(840, ctx.currentTime + 0.14);

      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.14);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.14);
    } catch (e) {
      console.warn('Audio send chime failed:', e);
    }
  }

  // Double-beep high-tech chime on reply accept / receive
  public playReceiveSound() {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      // First high chime
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.connect(gain1);
      gain1.connect(ctx.destination);

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(580, ctx.currentTime);
      gain1.gain.setValueAtTime(0.05, ctx.currentTime);
      gain1.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.08);

      osc1.start(ctx.currentTime);
      osc1.stop(ctx.currentTime + 0.08);

      // Second higher chime
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.connect(gain2);
      gain2.connect(ctx.destination);

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(780, ctx.currentTime + 0.09);
      gain2.gain.setValueAtTime(0.05, ctx.currentTime + 0.09);
      gain2.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.24);

      osc2.start(ctx.currentTime + 0.09);
      osc2.stop(ctx.currentTime + 0.24);
    } catch (e) {
      console.warn('Audio receive chime failed:', e);
    }
  }

  // Subtle futuristic UI click sound
  public playClick() {
    const ctx = this.getAudioContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.04);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.04);
    } catch (e) {
      console.warn('Audio click failed:', e);
    }
  }

  // Pop sound for pipeline progression
  public playPop() {
    const ctx = this.getAudioContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.06);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.06);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.06);
    } catch (e) {
      console.warn('Audio pop failed:', e);
    }
  }

  // Success chime on completing a task or pipeline
  public playSuccess() {
    const ctx = this.getAudioContext();
    if (!ctx) return;
    try {
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        const start = ctx.currentTime + idx * 0.07;
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.05, start);
        gain.gain.linearRampToValueAtTime(0.001, start + 0.18);
        osc.start(start);
        osc.stop(start + 0.18);
      });
    } catch (e) {
      console.warn('Audio success failed:', e);
    }
  }

  // Play authentic "Pirates of the Caribbean" theme song (Real MP3/WAV Audio Track with Fallback)
  public playPiratesTheme(loop: boolean = true) {
    this.stopPiratesTheme();

    // 1. Try real audio track from public directory
    try {
      const audio = new Audio('/pirates_theme.mp3');
      audio.loop = loop;
      audio.volume = 0.95;
      this.activeAudio = audio;

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            this.notifyState(true);
          })
          .catch((err) => {
            console.warn('HTML5 Audio autoplay restricted, engaging Web Audio synthesis engine:', err);
            // Try wav fallback or synthesize
            this.playSynthesizedPirates(loop);
          });
      }

      audio.onended = () => {
        if (!loop) {
          this.notifyState(false);
        }
      };

      audio.onerror = () => {
        console.warn('Audio file error, falling back to Web Audio synthesis');
        this.playSynthesizedPirates(loop);
      };
    } catch (e) {
      console.warn('Direct audio instantiation error:', e);
      this.playSynthesizedPirates(loop);
    }
  }

  // Stop any playing Pirates of the Caribbean audio or synthesizer
  public stopPiratesTheme() {
    if (this.activeAudio) {
      try {
        this.activeAudio.pause();
        this.activeAudio.currentTime = 0;
      } catch (e) {}
      this.activeAudio = null;
    }

    if (this.activeOscillators.length > 0) {
      this.activeOscillators.forEach((osc) => {
        try {
          osc.stop();
          osc.disconnect();
        } catch (e) {}
      });
      this.activeOscillators = [];
    }

    if (this.activeContext) {
      try {
        this.activeContext.close();
      } catch (e) {}
      this.activeContext = null;
    }

    this.notifyState(false);
  }

  // Toggle play/stop for test buttons
  public togglePiratesTheme(loop: boolean = false) {
    if (this.isPlayingPirates) {
      this.stopPiratesTheme();
    } else {
      this.playPiratesTheme(loop);
    }
  }

  // Fallback high-fidelity polyphonic Web Audio Synthesizer
  private playSynthesizedPirates(loop: boolean = false) {
    const ctx = this.getAudioContext();
    if (!ctx) return;
    this.activeContext = ctx;
    this.notifyState(true);

    try {
      const now = ctx.currentTime;
      let timeOffset = 0;

      const notes = [
        // Intro
        { freq: 440, dur: 0.14 }, // A4
        { freq: 523, dur: 0.14 }, // C5
        // Bar 1
        { freq: 587, dur: 0.28 }, // D5
        { freq: 587, dur: 0.14 }, // D5
        { freq: 587, dur: 0.28 }, // D5
        { freq: 659, dur: 0.14 }, // E5
        // Bar 2
        { freq: 698, dur: 0.28 }, // F5
        { freq: 698, dur: 0.14 }, // F5
        { freq: 698, dur: 0.28 }, // F5
        { freq: 784, dur: 0.14 }, // G5
        // Bar 3
        { freq: 659, dur: 0.28 }, // E5
        { freq: 659, dur: 0.14 }, // E5
        { freq: 587, dur: 0.14 }, // D5
        { freq: 523, dur: 0.14 }, // C5
        { freq: 523, dur: 0.14 }, // C5
        { freq: 587, dur: 0.56 }, // D5
        // Bar 4
        { freq: 440, dur: 0.14 }, // A4
        { freq: 523, dur: 0.14 }, // C5
        // Bar 5
        { freq: 587, dur: 0.28 }, // D5
        { freq: 587, dur: 0.14 }, // D5
        { freq: 587, dur: 0.28 }, // D5
        { freq: 659, dur: 0.14 }, // E5
        // Bar 6
        { freq: 698, dur: 0.28 }, // F5
        { freq: 698, dur: 0.14 }, // F5
        { freq: 698, dur: 0.28 }, // F5
        { freq: 784, dur: 0.14 }, // G5
        // Bar 7
        { freq: 880, dur: 0.28 }, // A5
        { freq: 880, dur: 0.14 }, // A5
        { freq: 784, dur: 0.14 }, // G5
        { freq: 698, dur: 0.14 }, // F5
        { freq: 784, dur: 0.14 }, // G5
        { freq: 587, dur: 0.56 }, // D5
      ];

      notes.forEach((note) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();
        
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1200, now + timeOffset);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(note.freq, now + timeOffset);

        gain.gain.setValueAtTime(0.09, now + timeOffset);
        gain.gain.exponentialRampToValueAtTime(0.001, now + timeOffset + note.dur - 0.02);

        osc.start(now + timeOffset);
        osc.stop(now + timeOffset + note.dur);

        this.activeOscillators.push(osc);
        timeOffset += note.dur;
      });

      // Auto stop state when melody finishes if not looping
      setTimeout(() => {
        if (!loop && this.isPlayingPirates) {
          this.notifyState(false);
        }
      }, timeOffset * 1000);
    } catch (e) {
      console.warn('Synth error:', e);
    }
  }

  // General UI sound dispatcher
  public play(type: 'click' | 'success' | 'send' | 'receive' | 'error' | 'delete' | 'info' = 'click') {
    if (type === 'send') {
      this.playSendSound();
    } else if (type === 'receive' || type === 'success') {
      this.playReceiveSound();
    } else if (type === 'delete') {
      // Soft digital deletion sound
      const ctx = this.getAudioContext();
      if (!ctx) return;
      try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(320, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.08);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.08);
      } catch (e) {
        // silent
      }
    } else {
      // Subtle tactile click
      const ctx = this.getAudioContext();
      if (!ctx) return;
      try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(type === 'error' ? 220 : 640, ctx.currentTime);
        gain.gain.setValueAtTime(0.03, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.05);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.05);
      } catch (e) {
        // silent
      }
    }
  }
}

export const sound = new SoundService();
