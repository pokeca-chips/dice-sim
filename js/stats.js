import { MARKS, FACE_DIRECTION_LABELS, renderMark } from './marks.js';

export const SIMULATION_BATCH_SIZE = 100;

const COLOR_SORT_KEYS = {
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

const DIRECTION_SORT_KEYS = {
  direction: {
    label: '方向',
    compare: (a, b) => {
      const ai = FACE_DIRECTION_LABELS.indexOf(a.name);
      const bi = FACE_DIRECTION_LABELS.indexOf(b.name);
      return ai - bi;
    },
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

function emptyColorBuckets() {
  return Object.fromEntries(MARKS.map((m) => [m.id, 0]));
}

function emptyDirectionBuckets() {
  return Object.fromEntries(FACE_DIRECTION_LABELS.map((label) => [label, 0]));
}

export function createEmptySimulation() {
  return {
    rounds: 0,
    totals: emptyColorBuckets(),
    twoPlusCounts: emptyColorBuckets(),
    averages: emptyColorBuckets(),
    directionTotals: emptyDirectionBuckets(),
    directionTwoPlus: emptyDirectionBuckets(),
    directionAverages: emptyDirectionBuckets(),
  };
}

/**
 * シミュレーションを実行する。previous を渡すと結果を累積する。
 * 色マークと方向（前後左右上下）は別集計。
 */
export function runSimulation(dice, batchSize = SIMULATION_BATCH_SIZE, previous = null) {
  const base = previous ?? createEmptySimulation();
  const stats = {
    rounds: base.rounds,
    totals: { ...emptyColorBuckets(), ...base.totals },
    twoPlusCounts: { ...emptyColorBuckets(), ...base.twoPlusCounts },
    directionTotals: { ...emptyDirectionBuckets(), ...(base.directionTotals || {}) },
    directionTwoPlus: { ...emptyDirectionBuckets(), ...(base.directionTwoPlus || {}) },
  };

  for (let round = 0; round < batchSize; round++) {
    const roll = rollOnce(dice);
    const colorCounts = countMarksInRoll(roll);
    const directionCounts = countDirectionsInRoll(roll);

    for (const mark of MARKS) {
      stats.totals[mark.id] += colorCounts[mark.id];
      if (colorCounts[mark.id] >= 2) {
        stats.twoPlusCounts[mark.id] += 1;
      }
    }

    for (const label of FACE_DIRECTION_LABELS) {
      stats.directionTotals[label] += directionCounts[label];
      if (directionCounts[label] >= 2) {
        stats.directionTwoPlus[label] += 1;
      }
    }
  }

  stats.rounds += batchSize;
  stats.averages = Object.fromEntries(
    MARKS.map((m) => [m.id, stats.totals[m.id] / stats.rounds])
  );
  stats.directionAverages = Object.fromEntries(
    FACE_DIRECTION_LABELS.map((label) => [
      label,
      stats.directionTotals[label] / stats.rounds,
    ])
  );
  return stats;
}

export function rollOnce(dice) {
  return dice.map((die) => {
    const faceIndex = Math.floor(Math.random() * die.faces.length);
    const face = die.faces[faceIndex];
    if (face?.direction) {
      return { faceIndex, marks: [], direction: face.direction };
    }
    return {
      faceIndex,
      marks: Array.isArray(face?.marks) ? [...face.marks] : [],
      direction: null,
    };
  });
}

function countMarksInRoll(roll) {
  const counts = emptyColorBuckets();
  for (const result of roll) {
    for (const markId of result.marks || []) {
      if (counts[markId] !== undefined) counts[markId] += 1;
    }
  }
  return counts;
}

function countDirectionsInRoll(roll) {
  const counts = emptyDirectionBuckets();
  for (const result of roll) {
    if (result.direction && counts[result.direction] !== undefined) {
      counts[result.direction] += 1;
    }
  }
  return counts;
}

function buildColorRows(stats) {
  return MARKS.map((mark) => ({
    id: mark.id,
    name: mark.name,
    avg: stats.averages[mark.id],
    twoPlus: stats.twoPlusCounts[mark.id],
    rounds: stats.rounds,
  }));
}

function buildDirectionRows(stats) {
  return FACE_DIRECTION_LABELS.map((label) => ({
    id: label,
    name: label,
    avg: stats.directionAverages?.[label] ?? 0,
    twoPlus: stats.directionTwoPlus?.[label] ?? 0,
    rounds: stats.rounds,
  }));
}

function sortRows(rows, sortKeys, { key, dir }) {
  const sorter = sortKeys[key] ?? Object.values(sortKeys)[0];
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

function renderSortableHeader(sortKeys, sort, tableId) {
  return Object.entries(sortKeys)
    .map(([key, { label }]) => {
      const active = sort.key === key;
      const ariaSort = active ? (sort.dir === 'asc' ? 'ascending' : 'descending') : 'none';
      const isLabelCol = key === 'color' || key === 'direction';
      const alignClass = isLabelCol ? '' : ' class="stats-num"';
      return `
        <th${alignClass} aria-sort="${ariaSort}">
          <button
            type="button"
            class="sort-btn${active ? ' is-active' : ''}"
            data-sort-key="${key}"
            data-stats-table="${tableId}"
          >
            <span>${label}</span>
            ${sortIndicator(active, sort.dir)}
          </button>
        </th>
      `;
    })
    .join('');
}

function renderColorBody(rows) {
  return rows
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
}

function renderDirectionBody(rows) {
  return rows
    .map(
      (row) => `
      <tr>
        <td class="stats-mark">
          <span class="direction-stats-name">${row.name}</span>
        </td>
        <td class="stats-num">${row.avg.toFixed(2)}</td>
        <td class="stats-num">${row.twoPlus} / ${row.rounds}</td>
      </tr>
    `
    )
    .join('');
}

export function renderStats(
  stats,
  sort = {
    color: { key: 'color', dir: 'asc' },
    direction: { key: 'direction', dir: 'asc' },
  }
) {
  const colorSort = sort.color ?? { key: 'color', dir: 'asc' };
  const directionSort = sort.direction ?? { key: 'direction', dir: 'asc' };
  const colorRows = sortRows(buildColorRows(stats), COLOR_SORT_KEYS, colorSort);
  const directionRows = sortRows(
    buildDirectionRows(stats),
    DIRECTION_SORT_KEYS,
    directionSort
  );

  return `
    <p class="stats-summary">累計試行回数: <strong>${stats.rounds}</strong> 回</p>

    <h3 class="stats-section-title">方向（前後左右上下）</h3>
    <p class="stats-section-hint">固定ダイスの出目。色マークとは別集計です。</p>
    <table class="stats-table">
      <thead>
        <tr>${renderSortableHeader(DIRECTION_SORT_KEYS, directionSort, 'direction')}</tr>
      </thead>
      <tbody>${renderDirectionBody(directionRows)}</tbody>
    </table>

    <h3 class="stats-section-title">色</h3>
    <p class="stats-section-hint">カスタマイズ可能な色ダイスの出目です。</p>
    <table class="stats-table">
      <thead>
        <tr>${renderSortableHeader(COLOR_SORT_KEYS, colorSort, 'color')}</tr>
      </thead>
      <tbody>${renderColorBody(colorRows)}</tbody>
    </table>
  `;
}

/**
 * 統計テーブルを描画し、列ヘッダーでのソート操作を有効化する。
 * @returns {{ getSort: () => { color: object, direction: object } }}
 */
export function mountStatsTable(
  container,
  stats,
  initialSort = {
    color: { key: 'color', dir: 'asc' },
    direction: { key: 'direction', dir: 'asc' },
  }
) {
  let sort = {
    color: { ...(initialSort.color ?? { key: 'color', dir: 'asc' }) },
    direction: { ...(initialSort.direction ?? { key: 'direction', dir: 'asc' }) },
  };

  function paint() {
    container.innerHTML = renderStats(stats, sort);
    container.querySelectorAll('.sort-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const tableId = btn.dataset.statsTable;
        const key = btn.dataset.sortKey;
        const current = sort[tableId] ?? { key, dir: 'asc' };
        if (current.key === key) {
          sort = {
            ...sort,
            [tableId]: { key, dir: current.dir === 'asc' ? 'desc' : 'asc' },
          };
        } else {
          const defaultDir = key === 'color' || key === 'direction' ? 'asc' : 'desc';
          sort = {
            ...sort,
            [tableId]: { key, dir: defaultDir },
          };
        }
        paint();
      });
    });
  }

  paint();
  return {
    getSort: () => ({
      color: { ...sort.color },
      direction: { ...sort.direction },
    }),
  };
}
