import confetti from "canvas-confetti";

// above the modal overlay (z-index 99999)
const Z_INDEX = 100000;

const randomInRange = (min, max) => Math.random() * (max - min) + min;

// Bursts from random points on both sides for a couple of seconds.
export const fireworks = (duration = 2500) => {
  const end = Date.now() + duration;
  const defaults = {
    startVelocity: 30,
    spread: 360,
    ticks: 60,
    zIndex: Z_INDEX,
    disableForReducedMotion: true,
  };

  const intervalId = setInterval(() => {
    const timeLeft = end - Date.now();

    if (timeLeft <= 0) {
      clearInterval(intervalId);
      return;
    }

    const particleCount = 50 * (timeLeft / duration);

    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
    });
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
    });
  }, 250);
};

// Two confetti cannons from the bottom corners.
export const confettiCannons = () => {
  const defaults = {
    particleCount: 120,
    spread: 70,
    startVelocity: 60,
    zIndex: Z_INDEX,
    disableForReducedMotion: true,
  };

  confetti({ ...defaults, angle: 60, origin: { x: 0, y: 1 } });
  confetti({ ...defaults, angle: 120, origin: { x: 1, y: 1 } });
};

// Short rising chime, synthesized so no sound file is needed.
export const chime = () => {
  const AudioContext = window.AudioContext || window.webkitAudioContext;

  if (!AudioContext) {
    return;
  }

  const ctx = new AudioContext();
  const notes = [523.25, 659.25, 783.99, 1046.5]; // C5 E5 G5 C6

  notes.forEach((frequency, index) => {
    const start = ctx.currentTime + index * 0.1;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.value = frequency;
    gain.gain.setValueAtTime(0.25, start);
    gain.gain.exponentialRampToValueAtTime(0.001, start + 0.5);

    osc.connect(gain).connect(ctx.destination);
    osc.start(start);
    osc.stop(start + 0.5);
  });

  setTimeout(() => ctx.close(), 1500);
};

// Called on the buzz queue's "correct" button; name is who got the points. Pick the effects here.
export const celebrate = ({ name } = {}) => {
  fireworks();
  chime();
};
