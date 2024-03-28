import { colors } from "../../../styles/colors";

const scale = Math.max(1, window.innerWidth / 1150);
const pinScale = Math.max(1.5, window.innerWidth / 1150);
// const pinScale = 1.5 * scale;

const pins = {
  startPins: 3,
  pinSize: 3 * scale * pinScale,
  pinGap: 20 * scale,
};

const ball = {
  ballSize: 4.7 * scale,
};

const engine = {
  engineGravity: 0.8,
};

const world = {
  width: 390 * scale,
  height: 390 * scale,
};

export const config = {
  pins,
  ball,
  engine,
  world,
  colors,
  scale,
  pinScale,
};
