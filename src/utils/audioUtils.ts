let audioCtx: AudioContext | null = null;
let soundEnabled = false;

export const setSoundEnabled = (enabled: boolean) => {
  soundEnabled = enabled;
  if (enabled && !audioCtx) {
    audioCtx = new window.AudioContext();
  }
};

const playTone = (freq: number, type: OscillatorType, duration: number, startTimeOffset = 0, vol = 0.1) => {
  if (!soundEnabled || !audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  
  osc.type = type;
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime + startTimeOffset);
  
  gain.gain.setValueAtTime(0, audioCtx.currentTime + startTimeOffset);
  gain.gain.linearRampToValueAtTime(vol, audioCtx.currentTime + startTimeOffset + 0.05);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + startTimeOffset + duration);

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start(audioCtx.currentTime + startTimeOffset);
  osc.stop(audioCtx.currentTime + startTimeOffset + duration);
};

export const playSound = (event: 'Birthday' | 'Anniversary' | 'Festival' | 'Holiday' | 'Meeting') => {
  if (!soundEnabled) return;

  switch (event) {
    case 'Birthday':
      // Cheerful Arpeggio
      playTone(440, 'sine', 0.3, 0, 0.1);    // A4
      playTone(554.37, 'sine', 0.3, 0.1, 0.1); // C#5
      playTone(659.25, 'sine', 0.3, 0.2, 0.1); // E5
      playTone(880, 'sine', 0.5, 0.3, 0.15);   // A5
      break;
    case 'Anniversary':
      // Soft bell
      playTone(523.25, 'sine', 1.0, 0, 0.2); // C5
      playTone(1046.5, 'sine', 1.0, 0, 0.05); // C6
      break;
    case 'Festival':
      // Warm chord
      playTone(392, 'triangle', 1.0, 0, 0.1); // G4
      playTone(493.88, 'triangle', 1.0, 0, 0.1); // B4
      playTone(587.33, 'triangle', 1.0, 0, 0.1); // D5
      break;
    case 'Holiday':
      // Wind chime sweep
      playTone(880, 'sine', 0.5, 0, 0.05);
      playTone(987.77, 'sine', 0.5, 0.1, 0.05);
      playTone(1174.66, 'sine', 0.5, 0.2, 0.05);
      playTone(1318.51, 'sine', 0.7, 0.3, 0.05);
      break;
    case 'Meeting':
      // Clean notification
      playTone(783.99, 'sine', 0.2, 0, 0.1); // G5
      playTone(1046.50, 'sine', 0.4, 0.15, 0.1); // C6
      break;
  }
};
