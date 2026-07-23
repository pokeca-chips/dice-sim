import { renderFaceContent } from './marks.js';

const FACE_ROTATIONS = [
  { x: 0, y: 0 },
  { x: 0, y: 90 },
  { x: 0, y: 180 },
  { x: 0, y: -90 },
  { x: -90, y: 0 },
  { x: 90, y: 0 },
];

const FACE_CLASSES = ['front', 'right', 'back', 'left', 'top', 'bottom'];

export function createDiceElement(die, index) {
  const wrapper = document.createElement('div');
  wrapper.className = 'dice-wrapper';
  wrapper.dataset.index = index;

  const cube = document.createElement('div');
  cube.className = 'dice-cube';

  die.faces.forEach((face, faceIndex) => {
    const faceEl = document.createElement('div');
    faceEl.className = `dice-face ${FACE_CLASSES[faceIndex]}`;
    faceEl.dataset.faceIndex = faceIndex;
    faceEl.innerHTML = renderFaceContent(face, 'lg');
    cube.appendChild(faceEl);
  });

  wrapper.appendChild(cube);
  return { wrapper, cube };
}

export function rollDice(cubes, results) {
  const animations = cubes.map((cube, i) => {
    const faceIndex = results[i].faceIndex;
    const target = FACE_ROTATIONS[faceIndex];
    const extraX = (Math.floor(Math.random() * 3) + 2) * 360;
    const extraY = (Math.floor(Math.random() * 3) + 2) * 360;

    cube.style.transition = 'transform 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    cube.style.transform = `rotateX(${target.x + extraX}deg) rotateY(${target.y + extraY}deg)`;

    return new Promise((resolve) => {
      const onEnd = () => {
        cube.removeEventListener('transitionend', onEnd);
        cube.style.transition = 'none';
        cube.style.transform = `rotateX(${target.x}deg) rotateY(${target.y}deg)`;
        requestAnimationFrame(() => {
          cube.style.transition = '';
          resolve();
        });
      };
      cube.addEventListener('transitionend', onEnd);
    });
  });

  return Promise.all(animations);
}

export function setInitialRotation(cube, faceIndex) {
  const rot = FACE_ROTATIONS[faceIndex];
  cube.style.transform = `rotateX(${rot.x}deg) rotateY(${rot.y}deg)`;
}

export function addRollingClass(cubes) {
  cubes.forEach((cube) => cube.classList.add('is-rolling'));
}

export function removeRollingClass(cubes) {
  cubes.forEach((cube) => cube.classList.remove('is-rolling'));
}
