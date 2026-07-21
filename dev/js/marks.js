export const MARKS = [
  { id: 'circle',   name: '丸',     symbol: '●', color: '#e74c3c' },
  { id: 'triangle', name: '三角',   symbol: '▲', color: '#e67e22' },
  { id: 'square',   name: '四角',   symbol: '■', color: '#f1c40f' },
  { id: 'star',     name: '星',     symbol: '★', color: '#2ecc71' },
  { id: 'diamond',  name: '菱形',   symbol: '◆', color: '#1abc9c' },
  { id: 'cross',    name: '十字',   symbol: '✚', color: '#3498db' },
  { id: 'moon',     name: '月',     symbol: '☽', color: '#9b59b6' },
  { id: 'sun',      name: '太陽',   symbol: '☀', color: '#f39c12' },
  { id: 'heart',    name: 'ハート', symbol: '♥', color: '#e84393' },
  { id: 'clover',   name: 'クローバー', symbol: '♣', color: '#27ae60' },
  { id: 'spade',    name: 'スペード', symbol: '♠', color: '#2c3e50' },
];

export const MARK_MAP = Object.fromEntries(MARKS.map((m) => [m.id, m]));

export const MIN_DICE = 3;
export const MAX_DICE = 10;
export const FACES_PER_DIE = 6;
export const MAX_DOUBLE_FACES = 2;

export function createDefaultFace() {
  return { marks: ['circle'] };
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
  const mark = MARK_MAP[markId];
  if (!mark) return '';
  return `<span class="mark mark-${size}" style="color:${mark.color}" title="${mark.name}">${mark.symbol}</span>`;
}

export function renderFaceMarks(marks, size = 'md') {
  const cls = marks.length === 2 ? 'face-marks double' : 'face-marks';
  return `<div class="${cls}">${marks.map((id) => renderMark(id, size)).join('')}</div>`;
}
