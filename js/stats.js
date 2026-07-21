import { MARKS } from './marks.js';

const SIMULATION_ROUNDS = 100;

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

export function renderStats(stats) {
  const rows = MARKS.map((mark) => {
    const avg = stats.averages[mark.id];
    const twoPlus = stats.twoPlusCounts[mark.id];
    return `
      <tr>
        <td class="stats-mark">
          <span class="mark" style="color:${mark.color}">${mark.symbol}</span>
          <span>${mark.name}</span>
        </td>
        <td class="stats-num">${avg.toFixed(2)}</td>
        <td class="stats-num">${twoPlus} / ${stats.rounds}</td>
      </tr>
    `;
  }).join('');

  return `
    <table class="stats-table">
      <thead>
        <tr>
          <th>マーク</th>
          <th>平均出現数</th>
          <th>2個以上の回数</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}
