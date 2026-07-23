import {
  MARKS,
  MIN_DICE,
  MAX_DICE,
  MAX_DOUBLE_FACES,
  createDefaultDie,
  countDoubleFaces,
  renderMark,
  renderFaceMarks,
} from './marks.js';
import { loadState, saveState } from './storage.js';
import { runSimulation, rollOnce, renderStats } from './stats.js';
import { createDiceElement, rollDice, setInitialRotation } from './dice.js';

let state = loadState();
let isRolling = false;
let cubeElements = [];

const diceCountDisplay = document.getElementById('dice-count-display');
const diceCountMinus = document.getElementById('dice-count-minus');
const diceCountPlus = document.getElementById('dice-count-plus');
const rollBtn = document.getElementById('roll-btn');
const simulateBtn = document.getElementById('simulate-btn');
const diceArena = document.getElementById('dice-arena');
const rollResult = document.getElementById('roll-result');
const diceEditor = document.getElementById('dice-editor');
const statsContent = document.getElementById('stats-content');

function init() {
  renderAll();
  bindEvents();
}

function bindEvents() {
  diceCountMinus.addEventListener('click', () => changeDiceCount(-1));
  diceCountPlus.addEventListener('click', () => changeDiceCount(1));
  rollBtn.addEventListener('click', handleRoll);
  simulateBtn.addEventListener('click', handleSimulate);
}

function changeDiceCount(delta) {
  const next = state.diceCount + delta;
  if (next < MIN_DICE || next > MAX_DICE) return;

  if (next > state.diceCount) {
    state.dice.push(createDefaultDie());
  } else {
    state.dice.pop();
  }
  state.diceCount = next;
  state.lastRoll = null;
  persistAndRender();
}

function handleRoll() {
  if (isRolling) return;
  isRolling = true;
  rollBtn.disabled = true;

  const results = rollOnce(state.dice);
  state.lastRoll = results;
  persist();

  rollDice(cubeElements, results).then(() => {
    showRollResult(results);
    isRolling = false;
    rollBtn.disabled = false;
  });
}

function handleSimulate() {
  simulateBtn.disabled = true;
  simulateBtn.textContent = '計算中...';

  requestAnimationFrame(() => {
    const stats = runSimulation(state.dice);
    statsContent.innerHTML = renderStats(stats);
    simulateBtn.disabled = false;
    simulateBtn.textContent = '100回シミュレーション';
  });
}

function showRollResult(results) {
  const counts = {};
  for (const r of results) {
    for (const markId of r.marks) {
      counts[markId] = (counts[markId] || 0) + 1;
    }
  }

  const summary = MARKS.filter((m) => counts[m.id])
    .map((m) => `${renderMark(m.id)} ${m.name}: ${counts[m.id]}個`)
    .join('　');

  rollResult.innerHTML = summary
    ? `<strong>出目:</strong> ${summary}`
    : '';
}

function renderAll() {
  renderDiceCount();
  renderArena();
  renderEditor();
}

function renderDiceCount() {
  diceCountDisplay.textContent = state.diceCount;
  diceCountMinus.disabled = state.diceCount <= MIN_DICE;
  diceCountPlus.disabled = state.diceCount >= MAX_DICE;
}

function renderArena() {
  diceArena.innerHTML = '';
  cubeElements = [];

  state.dice.forEach((die, i) => {
    const { wrapper, cube } = createDiceElement(die, i);
    const faceIndex = state.lastRoll?.[i]?.faceIndex ?? 0;
    setInitialRotation(cube, faceIndex);
    diceArena.appendChild(wrapper);
    cubeElements.push(cube);
  });

  if (state.lastRoll) {
    showRollResult(state.lastRoll);
  } else {
    rollResult.innerHTML = '';
  }
}

function renderEditor() {
  diceEditor.innerHTML = '';

  state.dice.forEach((die, dieIndex) => {
    const card = document.createElement('div');
    card.className = 'die-card';
    card.innerHTML = `<h3>ダイス ${dieIndex + 1}</h3>`;

    const facesGrid = document.createElement('div');
    facesGrid.className = 'faces-grid';

    die.faces.forEach((face, faceIndex) => {
      const faceEl = document.createElement('div');
      faceEl.className = 'face-editor';
      faceEl.innerHTML = `
        <div class="face-preview">${renderFaceMarks(face.marks)}</div>
        <span class="face-label">面 ${faceIndex + 1}</span>
      `;

      const controls = document.createElement('div');
      controls.className = 'mark-controls';

      face.marks.forEach((markId, markIndex) => {
        const select = createMarkSelect(markId, dieIndex, faceIndex, markIndex);
        controls.appendChild(select);

        if (face.marks.length === 2) {
          const removeBtn = document.createElement('button');
          removeBtn.type = 'button';
          removeBtn.className = 'btn-icon';
          removeBtn.textContent = '−';
          removeBtn.title = 'マークを削除';
          removeBtn.addEventListener('click', () => removeMark(dieIndex, faceIndex, markIndex));
          controls.appendChild(removeBtn);
        }
      });

      if (face.marks.length < 2 && countDoubleFaces(die) < MAX_DOUBLE_FACES) {
        const addBtn = document.createElement('button');
        addBtn.type = 'button';
        addBtn.className = 'btn-icon';
        addBtn.textContent = '+';
        addBtn.title = 'マークを追加';
        addBtn.addEventListener('click', () => addMark(dieIndex, faceIndex));
        controls.appendChild(addBtn);
      }

      faceEl.appendChild(controls);
      facesGrid.appendChild(faceEl);
    });

    card.appendChild(facesGrid);
    diceEditor.appendChild(card);
  });
}

function createMarkSelect(currentId, dieIndex, faceIndex, markIndex) {
  const select = document.createElement('select');
  select.className = 'mark-select';
  MARKS.forEach((mark) => {
    const opt = document.createElement('option');
    opt.value = mark.id;
    opt.textContent = mark.name;
    if (mark.id === currentId) opt.selected = true;
    select.appendChild(opt);
  });
  select.addEventListener('change', () => {
    state.dice[dieIndex].faces[faceIndex].marks[markIndex] = select.value;
    persistAndRender();
  });
  return select;
}

function addMark(dieIndex, faceIndex) {
  const die = state.dice[dieIndex];
  if (countDoubleFaces(die) >= MAX_DOUBLE_FACES) return;
  const face = die.faces[faceIndex];
  if (face.marks.length >= 2) return;
  face.marks.push(MARKS[0].id);
  persistAndRender();
}

function removeMark(dieIndex, faceIndex, markIndex) {
  const face = state.dice[dieIndex].faces[faceIndex];
  if (face.marks.length <= 1) return;
  face.marks.splice(markIndex, 1);
  persistAndRender();
}

function persist() {
  saveState(state);
}

function persistAndRender() {
  persist();
  renderAll();
}

init();
