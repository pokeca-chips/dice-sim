import { createDefaultState, createDefaultDie, normalizeMarkId, MARKS } from './marks.js';

const STORAGE_KEY = 'dice-simulator-state';
const DEFAULTS_VERSION = 2;

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createDefaultState();
    const parsed = JSON.parse(raw);
    // 初期ダイス構成を更新したバージョンでは、保存済みの旧デフォルトを置き換える
    if (parsed?.defaultsVersion !== DEFAULTS_VERSION) {
      const count = clamp(parsed?.diceCount ?? 4, 3, 10);
      return withDefaultsVersion(createDefaultState(count));
    }
    return withDefaultsVersion(normalizeState(parsed));
  } catch {
    return withDefaultsVersion(createDefaultState());
  }
}

export function saveState(state) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(withDefaultsVersion(state))
  );
}

function withDefaultsVersion(state) {
  return { ...state, defaultsVersion: DEFAULTS_VERSION };
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
    dice.push(createDefaultDie());
  }

  dice.forEach((die, i) => {
    if (!die?.faces || die.faces.length !== 6) {
      dice[i] = createDefaultDie();
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
