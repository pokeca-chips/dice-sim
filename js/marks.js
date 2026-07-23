/** 白塗り SVG アイコン（色付きバッジ上に表示） */
function icon(paths) {
  return `<svg class="mark-icon" viewBox="0 0 24 24" aria-hidden="true">${paths}</svg>`;
}

const ICONS = {
  // 葉
  green: icon(
    '<path fill="#fff" d="M12 3c4 2 7 6 7 10a7 7 0 0 1-6 6.9V21h-2v-1.1A7 7 0 0 1 5 13c0-4 3-8 7-10zm0 3.2C9.2 8 7.2 10.8 7.2 13a4.8 4.8 0 0 0 4.8 4.8V12l.2-5.8z"/>'
  ),
  // 炎
  red: icon(
    '<path fill="#fff" d="M12 2c1.5 3 1 5.5-.5 7.2 2.2-.4 4 1.2 4.3 3.5.3 2.5-1.3 4.8-3.8 5.5 2.8-.2 4.5-2 5-4.2.6 4.2-2.2 7.5-5.5 8-3.5.5-6.8-2-7-5.8C4.3 11.5 7.5 7.8 12 2z"/>'
  ),
  // 水滴
  blue: icon(
    '<path fill="#fff" d="M12 2c4.5 5.2 7 9 7 12a7 7 0 1 1-14 0c0-3 2.5-6.8 7-12zm0 6.2C9.2 12 8 14.2 8 16a4 4 0 0 0 8 0c0-1.8-1.2-4-4-7.8z"/>'
  ),
  // 稲妻
  yellow: icon(
    '<path fill="#fff" d="M13 2 4 14h6l-1 8 11-14h-7l0-6z"/>'
  ),
  // 目
  pink: icon(
    '<ellipse fill="#fff" cx="12" cy="12" rx="9" ry="5.5"/><circle fill="var(--mark-color, #D81B60)" cx="12" cy="12" r="3"/><circle fill="#fff" cx="12.8" cy="11.2" r="1"/>'
  ),
  // 拳
  orange: icon(
    '<path fill="#fff" d="M9.2 10.2V7.8c0-1.2.8-2.2 2-2.4V4.2c0-.7.5-1.2 1.2-1.2s1.2.5 1.2 1.2v1.2c1.2.2 2 1.2 2 2.4v2.4h.8c.9 0 1.6.7 1.6 1.6v7.2c0 .9-.7 1.6-1.6 1.6H8.4c-.9 0-1.6-.7-1.6-1.6v-7.2c0-.9.7-1.6 1.6-1.6h.8zm2 0h2.4V7.8c0-.4-.3-.8-.8-.8h-.8c-.4 0-.8.3-.8.8v2.4z"/>'
  ),
  // 三日月
  navy: icon(
    '<path fill="#fff" d="M14 3a9 9 0 1 0 7 14.5A9 9 0 0 1 14 3z"/>'
  ),
  // ダイヤモンド（鋼）
  gray: icon(
    '<path fill="#fff" d="M12 2 4.5 9.5 12 22l7.5-12.5L12 2zm0 3.2 4.2 4.3L12 17.5 7.8 9.5 12 5.2z"/>'
  ),
  // 翼
  lightblue: icon(
    '<path fill="#fff" d="M3 14c4-1 7-4 8.5-8 1 3 3.5 5.5 7.5 6.5-3 .8-5 2.5-6 5-.8-2.2-2.8-3.8-5.5-4.5C5.5 12.5 4 13 3 14zm9.5-1.5c2.2 1.2 4.2 1.8 6.5 2-2.5.5-4.2 1.8-5.2 3.8-.5-1.8-1.8-3.2-3.5-4.2 1-.4 1.6-.9 2.2-1.6z"/>'
  ),
  // ドラゴン風の渦
  olive: icon(
    '<path fill="#fff" d="M12 3c4.5 0 8 3 8 7.2 0 3.2-2 5.5-4.8 6.5 1.5 1 2.3 2.3 2.3 4.3h-2.2c0-1.5-.6-2.3-1.8-3.1l-1.5-.9-1.5.9c-1.2.8-1.8 1.6-1.8 3.1H7.5c0-2 0.8-3.3 2.3-4.3C7 15.7 5 13.4 5 10.2 5 6 8.5 3 12 3zm0 2.2c-2.8 0-4.8 1.9-4.8 5 0 2.2 1.3 3.8 3.3 4.4l1.5.5 1.5-.5c2-.6 3.3-2.2 3.3-4.4 0-3.1-2-5-4.8-5z"/>'
  ),
  // 星
  white: icon(
    '<path fill="#fff" d="m12 2 2.4 6.8H22l-5.5 4.2 2.1 7-6.6-4.5L5.4 20l2.1-7L2 8.8h7.6L12 2z"/>'
  ),
};

/** ポケモンカードのエネルギータイプ色に対応したマーク定義（色名で表示） */
export const MARKS = [
  { id: 'green',     name: '緑',       color: '#4CAF50' },
  { id: 'red',       name: '赤',       color: '#E53935' },
  { id: 'blue',      name: '青',       color: '#1E88E5' },
  { id: 'yellow',    name: '黄',       color: '#F9A825' },
  { id: 'pink',      name: 'ピンク',   color: '#D81B60' },
  { id: 'orange',    name: 'オレンジ', color: '#EF6C00' },
  { id: 'navy',      name: '紺',       color: '#283593' },
  { id: 'gray',      name: 'グレー',   color: '#78909C' },
  { id: 'lightblue', name: '水色',     color: '#29B6F6' },
  { id: 'olive',     name: 'オリーブ', color: '#9E9D24' },
  { id: 'white',     name: '白',       color: '#90A4AE' },
];

/** 旧バージョンの形名 ID → 色 ID への移行マップ */
const LEGACY_MARK_IDS = {
  circle: 'green',
  triangle: 'red',
  square: 'yellow',
  star: 'white',
  diamond: 'gray',
  cross: 'blue',
  moon: 'navy',
  sun: 'orange',
  heart: 'pink',
  clover: 'green',
  spade: 'navy',
};

export const MARK_MAP = Object.fromEntries(MARKS.map((m) => [m.id, m]));

export const MIN_DICE = 3;
export const MAX_DICE = 10;
export const FACES_PER_DIE = 6;
export const MAX_DOUBLE_FACES = 2;

/** 3Dダイスの面クラス順（front, right, back, left, top, bottom）に対応 */
export const FACE_DIRECTION_LABELS = ['前', '右', '後', '左', '上', '下'];

export function normalizeMarkId(markId) {
  if (MARK_MAP[markId]) return markId;
  if (LEGACY_MARK_IDS[markId]) return LEGACY_MARK_IDS[markId];
  return MARKS[0].id;
}

export function createDefaultFace() {
  return { marks: [MARKS[0].id] };
}

/** 全面が同じ色のダイス */
export function createSolidDie(markId = MARKS[0].id) {
  const id = normalizeMarkId(markId);
  return {
    faces: Array.from({ length: FACES_PER_DIE }, () => ({
      marks: [id],
    })),
  };
}

/**
 * 前後左右上下の6面がすべて異なる色のダイス（ダイス1固定用）。
 * 面順は FACE_DIRECTION_LABELS と同じ。
 */
export function createSixPatternDie() {
  return {
    faces: Array.from({ length: FACES_PER_DIE }, (_, i) => ({
      marks: [MARKS[i % FACES_PER_DIE].id],
    })),
  };
}

/** カスタマイズ可能なダイスの追加時デフォルト（単色） */
export function createDefaultDie() {
  return createSolidDie(MARKS[0].id);
}

/** ダイス1（index 0）は前後左右上下パターンに固定 */
export const FIXED_DIRECTION_DIE_INDEX = 0;

export function isFixedDirectionDie(dieIndex) {
  return dieIndex === FIXED_DIRECTION_DIE_INDEX;
}

/** ダイス1を固定パターンで上書きした配列を返す */
export function ensureFixedDirectionDie(dice) {
  if (!Array.isArray(dice) || dice.length === 0) {
    return [createSixPatternDie()];
  }
  const next = dice.slice();
  next[FIXED_DIRECTION_DIE_INDEX] = createSixPatternDie();
  return next;
}

/**
 * 初期配置: 1個目は前後左右上下の固定6色パターン、
 * 残りは単色（カスタマイズ前提のベース）。
 */
export function createDefaultState(diceCount = 4) {
  const count = Math.max(MIN_DICE, diceCount);
  const dice = Array.from({ length: count }, (_, i) => {
    if (isFixedDirectionDie(i)) return createSixPatternDie();
    return createSolidDie(MARKS[(i - 1) % MARKS.length].id);
  });
  return {
    diceCount: count,
    dice,
    lastRoll: null,
  };
}

export function countDoubleFaces(die) {
  return die.faces.filter((f) => f.marks.length === 2).length;
}

export function renderMark(markId, size = 'md') {
  const id = normalizeMarkId(markId);
  const mark = MARK_MAP[id];
  if (!mark) return '';
  const svg = ICONS[id] || '';
  return `<span class="mark mark-${size}" style="--mark-color:${mark.color}" title="${mark.name}">${svg}</span>`;
}

export function renderFaceMarks(marks, size = 'md') {
  const cls = marks.length === 2 ? 'face-marks double' : 'face-marks';
  return `<div class="${cls}">${marks.map((id) => renderMark(id, size)).join('')}</div>`;
}
