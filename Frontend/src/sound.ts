/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

let audioCtx: AudioContext | null = null;
let bgOscillator: OscillatorNode | null = null;
let bgGain: GainNode | null = null;
let isMusicPlaying = false;
let activeTrack: 'menu' | 'game' = 'menu';
let musicVolume = 0.5; // Starts at 50%

let savedVolume: string | null = null;
try {
  if (typeof window !== 'undefined') {
    savedVolume = localStorage.getItem('retro_coder_music_volume');
    if (savedVolume !== null) {
      musicVolume = parseFloat(savedVolume);
    }
  }
} catch (e) {}

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export const sound = {
  playClick() {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.08);
      
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch (e) {
      console.warn("Audio play failed: ", e);
    }
  },

  playTick() {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'square';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch (e) {
      console.warn("Audio play failed: ", e);
    }
  },

  playCorrect() {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      
      const now = ctx.currentTime;
      // Synthesize a retro ascending arpeggio
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);
        
        gain.gain.setValueAtTime(0.0, now + idx * 0.07);
        gain.gain.linearRampToValueAtTime(0.1, now + idx * 0.07 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.18);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 0.2);
      });
    } catch (e) {
      console.warn("Audio play failed: ", e);
    }
  },

  playWrong() {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      
      const now = ctx.currentTime;
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(130, now);
      osc1.frequency.linearRampToValueAtTime(85, now + 0.25);
      
      osc2.type = 'square';
      osc2.frequency.setValueAtTime(135, now);
      osc2.frequency.linearRampToValueAtTime(88, now + 0.25);
      
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.25);
      
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);
      
      osc1.start();
      osc2.start();
      
      osc1.stop(now + 0.25);
      osc2.stop(now + 0.25);
    } catch (e) {
      console.warn("Audio play failed: ", e);
    }
  },

  playVictory() {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      
      const now = ctx.currentTime;
      const fanFare = [
        { note: 261.63, duration: 0.1 }, // C4
        { note: 329.63, duration: 0.1 }, // E4
        { note: 392.00, duration: 0.1 }, // G4
        { note: 523.25, duration: 0.15 }, // C5
        { note: 392.00, duration: 0.1 }, // G4
        { note: 523.25, duration: 0.4 }  // C5 (Hold)
      ];
      
      let currentDelay = 0;
      fanFare.forEach((item) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(item.note, now + currentDelay);
        
        gain.gain.setValueAtTime(0.15, now + currentDelay);
        gain.gain.exponentialRampToValueAtTime(0.01, now + currentDelay + item.duration);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start(now + currentDelay);
        osc.stop(now + currentDelay + item.duration);
        
        currentDelay += item.duration + 0.02;
      });
    } catch (e) {
      console.warn("Audio play failed: ", e);
    }
  },

  playFail() {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      
      const now = ctx.currentTime;
      const notes = [293.66, 277.18, 261.63, 220.00, 146.83]; // D4, C#4, C4, A3, D3
      
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now + idx * 0.18);
        
        gain.gain.setValueAtTime(0.18, now + idx * 0.18);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.18 + 0.22);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start(now + idx * 0.18);
        osc.stop(now + idx * 0.18 + 0.25);
      });
    } catch (e) {
      console.warn("Audio play failed: ", e);
    }
  },

  setMusicVolume(vol: number) {
    musicVolume = Math.max(0, Math.min(1, vol));
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('retro_coder_music_volume', musicVolume.toString());
      }
    } catch (e) {}
    if (bgGain && audioCtx) {
      bgGain.gain.setValueAtTime(musicVolume * 0.18, audioCtx.currentTime);
    }
  },

  getMusicVolume() {
    return musicVolume;
  },

  getActiveTrack() {
    return activeTrack;
  },

  startMusic(track: 'menu' | 'game') {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      activeTrack = track;
      if (isMusicPlaying) {
        // Just update volume dynamic and return
        if (bgGain) {
          bgGain.gain.setValueAtTime(musicVolume * 0.18, ctx.currentTime);
        }
        return;
      }

      isMusicPlaying = true;

      bgGain = ctx.createGain();
      bgGain.gain.setValueAtTime(musicVolume * 0.18, ctx.currentTime);
      bgGain.connect(ctx.destination);

      let step = 0;
      const runSynthBeat = () => {
        if (!isMusicPlaying || !ctx) return;

        const osc = ctx.createOscillator();
        const amp = ctx.createGain();

        if (activeTrack === 'menu') {
          // Track 2: Nostalgic, pleasant boot-up synth arpeggios
          const chords = [
            [220.00, 261.63, 329.63, 440.00], // Am
            [196.00, 246.94, 293.66, 392.00], // G major
            [174.61, 220.00, 261.63, 349.23], // F major
            [164.81, 196.00, 246.94, 329.63]  // Em
          ];

          const chordIndex = Math.floor(step / 8) % chords.length;
          const noteIndex = step % 4;
          const rootNote = chords[chordIndex][noteIndex];

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(rootNote, ctx.currentTime);

          amp.gain.setValueAtTime(0.04 * musicVolume, ctx.currentTime);
          amp.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.28);

          // Sub-melody/delay echo on odd beats
          if (step % 2 === 1) {
            const echoOsc = ctx.createOscillator();
            const echoAmp = ctx.createGain();
            echoOsc.type = 'sine';
            echoOsc.frequency.setValueAtTime(rootNote * 2, ctx.currentTime);
            echoAmp.gain.setValueAtTime(0.012 * musicVolume, ctx.currentTime);
            echoAmp.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
            echoOsc.connect(echoAmp);
            echoAmp.connect(bgGain!);
            echoOsc.start();
            echoOsc.stop(ctx.currentTime + 0.16);
          }

          osc.connect(amp);
          amp.connect(bgGain!);

          osc.start();
          osc.stop(ctx.currentTime + 0.3);

          step = (step + 1) % 32;
          setTimeout(runSynthBeat, 300); // Relaxed melodic tempo

        } else {
          // Track 1: Fast-paced heartbeat warning simulation for active game
          const gameFreqs = [110.00, 110.00, 98.00, 87.31];
          const beatIndex = Math.floor(step / 2) % gameFreqs.length;
          const isOddIndex = step % 2 === 1;

          osc.type = isOddIndex ? 'sawtooth' : 'triangle';
          osc.frequency.setValueAtTime(isOddIndex ? gameFreqs[beatIndex] * 1.5 : gameFreqs[beatIndex], ctx.currentTime);

          if (step % 4 === 3) {
            osc.frequency.exponentialRampToValueAtTime(gameFreqs[beatIndex] * 1.25, ctx.currentTime + 0.18);
          }

          amp.gain.setValueAtTime(0.05 * musicVolume, ctx.currentTime);
          amp.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);

          osc.connect(amp);
          amp.connect(bgGain!);

          osc.start();
          osc.stop(ctx.currentTime + 0.24);

          // Retro warning click
          if (step % 2 === 0) {
            const clickOsc = ctx.createOscillator();
            const clickGain = ctx.createGain();
            clickOsc.type = 'square';
            clickOsc.frequency.setValueAtTime(1200, ctx.currentTime);
            clickGain.gain.setValueAtTime(0.015 * musicVolume, ctx.currentTime);
            clickGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.04);
            clickOsc.connect(clickGain);
            clickGain.connect(bgGain!);
            clickOsc.start();
            clickOsc.stop(ctx.currentTime + 0.05);
          }

          step = (step + 1) % 16;
          setTimeout(runSynthBeat, 240); // Rapid adrenaline tempos
        }
      };

      runSynthBeat();
    } catch (e) {
      console.warn("Could not start retro game music synthesis: ", e);
    }
  },

  toggleMusic(track: 'menu' | 'game' = 'menu') {
    if (isMusicPlaying) {
      this.stopMusic();
      return false;
    } else {
      this.startMusic(track);
      return true;
    }
  },

  stopMusic() {
    isMusicPlaying = false;
    if (bgOscillator) {
      try {
        bgOscillator.stop();
        bgOscillator.disconnect();
      } catch (e) {}
      bgOscillator = null;
    }
    if (bgGain) {
      try {
        bgGain.disconnect();
      } catch (e) {}
      bgGain = null;
    }
  },

  isMusicActive() {
    return isMusicPlaying;
  }
};
