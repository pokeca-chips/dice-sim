import { createDefaultState, normalizeMarkId, MARKS } from './marks.js';

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

function normalizeMarks(marks) {
  if (!Array.isArray(marks) || marks.length === 0) {
    return [MARKS[0].id];
  }
  return marks.slice(0, 2).map(normalizeMarkId);
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
        marks: normalizeMarks(face.marks),
      }));
    }
  });

  let lastRoll = null;
  if (Array.isArray(parsed.lastRoll)) {
    lastRoll = parsed.lastRoll.map((r) => ({
      faceIndex: typeof r?.faceIndex === 'number' ? r.faceIndex : 0,
      marks: normalizeMarks(r?.marks),
    }));
  }

  return {
    diceCount,
    dice,
    lastRoll,
  };
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}
