import { createDefaultState } from './marks.js';

const STORAGE_KEY = 'dice-simulator-state';

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createDefaultState();
    const parsed = JSON.parse(raw);
    return normalizeState(parsed);
  } catch {
    return createDefaultState();
  }
}

export function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function normalizeState(parsed) {
  const diceCount = clamp(parsed.diceCount ?? 4, 3, 10);
  const dice = Array.isArray(parsed.dice) ? parsed.dice.slice(0, diceCount) : [];

  while (dice.length < diceCount) {
    dice.push(createDefaultState(1).dice[0]);
  }

  dice.forEach((die, i) => {
    if (!die?.faces || die.faces.length !== 6) {
      dice[i] = createDefaultState(1).dice[0];
    } else {
      die.faces = die.faces.map((face) => ({
        marks: Array.isArray(face.marks) ? face.marks.slice(0, 2) : ['circle'],
      }));
    }
  });

  return {
    diceCount,
    dice,
    lastRoll: Array.isArray(parsed.lastRoll) ? parsed.lastRoll : null,
  };
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}
