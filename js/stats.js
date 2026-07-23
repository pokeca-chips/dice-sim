import { MARKS, renderMark } from './marks.js';

const SIMULATION_ROUNDS = 100;

const SORT_KEYS = {
  color: {
    label: '色',
    compare: (a, b) => a.name.localeCompare(b.name, 'ja'),
  },
  avg: {
    label: '平均出現数',
    compare: (a, b) => a.avg - b.avg,
  },
  twoPlus: {
    label: '2個以上の回数',
    compare: (a, b) => a.twoPlus - b.twoPlus,
  },
};

export function runSimulation(dice) {
  const totals = Object.fromEntries(MARKS.map((m) => [m.id, 0]));
  const twoPlus = Object.fromEntries(MARKS.map((m) => [m.id, 0]));

  for (let round = 0; round < SIMULATION_ROUNDS; round++) {
    const counts = countMarksInRoll(rollOnce(dice));
    for (const mark of MARKS) {
      totals[mark.id] += counts[mark.id];
      if (counts[mark.id] >= 2) {
        twoPlus[mark.id] += 1;
      }
    }
  }

  return {
    rounds: SIMULATION_ROUNDS,
    averages: Object.fromEntries(
      MARKS.map((m) => [m.id, totals[m.id] / SIMULATION_ROUNDS])
    ),
    twoPlusCounts: twoPlus,
  };
}

export function rollOnce(dice) {
  return dice.map((die) => {
    const faceIndex = Math.floor(Math.random() * die.faces.length);
    return { faceIndex, marks: [...die.faces[faceIndex].marks] };
  });
}

function countMarksInRoll(roll) {
  const counts = Object.fromEntries(MARKS.map((m) => [m.id, 0]));
  for (const result of roll) {
    for (const markId of result.marks) {
      if (counts[markId] !== undefined) counts[markId] += 1;
    }
  }
  return counts;
}

function buildRows(stats) {
  return MARKS.map((mark) => ({
    id: mark.id,
    name: mark.name,
    avg: stats.averages[mark.id],
    twoPlus: stats.twoPlusCounts[mark.id],
    rounds: stats.rounds,
  }));
}

function sortRows(rows, { key, dir }) {
  const sorter = SORT_KEYS[key] ?? SORT_KEYS.color;
  const factor = dir === 'desc' ? -1 : 1;
  return [...rows].sort((a, b) => {
    const result = sorter.compare(a, b);
    if (result !== 0) return result * factor;
    return a.name.localeCompare(b.name, 'ja') * factor;
  });
}

function sortIndicator(active, dir) {
  if (!active) return '<span class="sort-indicator" aria-hidden="true"></span>';
  const arrow = dir === 'asc' ? '▲' : '▼';
  return `<span class="sort-indicator is-active" aria-hidden="true">${arrow}</span>`;
}

export function renderStats(stats, sort = { key: 'color', dir: 'asc' }) {
  const rows = sortRows(buildRows(stats), sort);

  const headerCells = Object.entries(SORT_KEYS)
    .map(([key, { label }]) => {
      const active = sort.key === key;
      const ariaSort = active ? (sort.dir === 'asc' ? 'ascending' : 'descending') : 'none';
      const alignClass = key === 'color' ? '' : ' class="stats-num"';
      return `
        <th${alignClass} aria-sort="${ariaSort}">
          <button type="button" class="sort-btn${active ? ' is-active' : ''}" data-sort-key="${key}">
            <span>${label}</span>
            ${sortIndicator(active, sort.dir)}
          </button>
        </th>
      `;
    })
    .join('');

  const bodyRows = rows
    .map(
      (row) => `
      <tr>
        <td class="stats-mark">
          ${renderMark(row.id)}
          <span>${row.name}</span>
        </td>
        <td class="stats-num">${row.avg.toFixed(2)}</td>
        <td class="stats-num">${row.twoPlus} / ${row.rounds}</td>
      </tr>
    `
    )
    .join('');

  return `
    <table class="stats-table">
      <thead>
        <tr>${headerCells}</tr>
      </thead>
      <tbody>${bodyRows}</tbody>
    </table>
  `;
}

/**
 * 統計テーブルを描画し、列ヘッダーでのソート操作を有効化する。
 * @returns {{ getSort: () => { key: string, dir: string } }}
 */
export function mountStatsTable(container, stats, initialSort = { key: 'color', dir: 'asc' }) {
  let sort = { ...initialSort };

  function paint() {
    container.innerHTML = renderStats(stats, sort);
    container.querySelectorAll('.sort-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const key = btn.dataset.sortKey;
        if (sort.key === key) {
          sort = { key, dir: sort.dir === 'asc' ? 'desc' : 'asc' };
        } else {
          // 数値列は降順、色名は昇順から開始
          sort = { key, dir: key === 'color' ? 'asc' : 'desc' };
        }
        paint();
      });
    });
  }

  paint();
  return {
    getSort: () => ({ ...sort }),
  };
}
