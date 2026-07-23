/** ポケモンカードのエネルギータイプ色に対応したマーク定義（色名で表示） */
export const MARKS = [
  { id: 'green',     name: '緑',       symbol: '☘', color: '#4CAF50' },
  { id: 'red',       name: '赤',       symbol: '▲', color: '#E53935' },
  { id: 'blue',      name: '青',       symbol: '●', color: '#1E88E5' },
  { id: 'yellow',    name: '黄',       symbol: '⚡', color: '#F9A825' },
  { id: 'pink',      name: 'ピンク',   symbol: '◉', color: '#D81B60' },
  { id: 'orange',    name: 'オレンジ', symbol: '✊', color: '#EF6C00' },
  { id: 'navy',      name: '紺',       symbol: '☽', color: '#283593' },
  { id: 'gray',      name: 'グレー',   symbol: '⬡', color: '#78909C' },
  { id: 'lightblue', name: '水色',     symbol: '🪽', color: '#29B6F6' },
  { id: 'olive',     name: 'オリーブ', symbol: '☾', color: '#9E9D24' },
  { id: 'white',     name: '白',       symbol: '★', color: '#90A4AE' },
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

export function normalizeMarkId(markId) {
  if (MARK_MAP[markId]) return markId;
  if (LEGACY_MARK_IDS[markId]) return LEGACY_MARK_IDS[markId];
  return MARKS[0].id;
}

export function createDefaultFace() {
  return { marks: [MARKS[0].id] };
}

export function createDefaultDie() {
  return {
    faces: Array.from({ length: FACES_PER_DIE }, (_, i) => ({
      marks: [MARKS[i % MARKS.length].id],
    })),
  };
}

export function createDefaultState(diceCount = 4) {
  return {
    diceCount,
    dice: Array.from({ length: diceCount }, () => createDefaultDie()),
    lastRoll: null,
  };
}

export function countDoubleFaces(die) {
  return die.faces.filter((f) => f.marks.length === 2).length;
}

export function renderMark(markId, size = 'md') {
  const mark = MARK_MAP[normalizeMarkId(markId)];
  if (!mark) return '';
  return `<span class="mark mark-${size}" style="--mark-color:${mark.color}" title="${mark.name}"><span class="mark-symbol">${mark.symbol}</span></span>`;
}

export function renderFaceMarks(marks, size = 'md') {
  const cls = marks.length === 2 ? 'face-marks double' : 'face-marks';
  return `<div class="${cls}">${marks.map((id) => renderMark(id, size)).join('')}</div>`;
}
