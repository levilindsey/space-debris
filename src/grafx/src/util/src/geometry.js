/**
 * This module defines a collection of static geometry utility functions.
 */

import {randomFloatInRange} from './util';

const EPSILON = 0.0000001;
const DEG_TO_RAD_RATIO = Math.PI / 180;
const RAD_TO_DEG_RATIO = 180 / Math.PI;
const HALF_PI = Math.PI / 2;
const TWO_PI = Math.PI * 2;

/**
 * @param {number} deg
 * @returns {number}
 */
function degToRad(deg) {
  return deg * DEG_TO_RAD_RATIO;
}

/**
 * @param {number} rad
 * @returns {number}
 */
function radToDeg(rad) {
  return rad * RAD_TO_DEG_RATIO;
}

/**
 * This checks whether two floating-point numbers are close enough that they could be equal if not
 * for round-off errors.
 *
 * @param {number} a
 * @param {number} b
 * @returns {boolean}
 */
function areClose(a, b) {
  const diff = a - b;
  return (diff > 0 ? diff : -diff) < EPSILON;
}

/**
 * @param {vec3} a
 * @param {vec3} b
 * @returns {boolean}
 */
function areVec3sEqual(a, b) {
  return a[0] === b[0] &&
      a[1] === b[1] &&
      a[2] === b[2];
}

/**
 * @param {vec3} v
 * @returns {string}
 */
function vec3ToString(v) {
  return `(${v[0]},${v[1]},${v[2]})`;
}

/**
 * TODO: This finds a random point with uniform probability within a cubic area, which biases the resulting vector toward the corners of this cubic area. Re-write this to produce an unbiased vector.
 *
 * @param {number} [scale=1]
 * @returns {vec3}
 */
function createRandomVec3(scale = 1) {
  const v = vec3.fromValues(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5);
  vec3.normalize(v, v);
  vec3.scale(v, v, scale);
  return v;
}

/**
 * @param {vec3} avg
 * @param {vec3} range
 * @returns {vec3}
 * @private
 */
function randomVec3InRange(avg, range) {
  const position = vec3.create();
  for (let i = 0; i < 3; i++) {
    const min = avg[i] - range[i] / 2;
    const max = avg[i] + range[i] / 2;
    position[i] = randomFloatInRange(min, max);
  }
  return position;
}

/**
 * Rotates the given vector around a random orthogonal axis by a random angle within the given angle
 * bounds.
 *
 * @param {vec3} v
 * @param {number} minRotationAngle
 * @param {number} maxRotationAngle
 */
function addRandomRotationToVector(v, minRotationAngle, maxRotationAngle) {
  // Create a random orthogonal axis.
  const rotationAxis = createRandomVec3();
  vec3.cross(rotationAxis, rotationAxis, v);
  vec3.normalize(rotationAxis, rotationAxis);

  // Create a random angle.
  const rotationAngle = randomFloatInRange(minRotationAngle, maxRotationAngle);

  // Create a rotation quaternion.
  const rotation = quat.create();
  quat.setAxisAngle(rotation, rotationAxis, rotationAngle);

  // Apply the rotation to the vector.
  vec3.transformQuat(v, v, rotation);
}

/**
 * @param {quat} out
 * @param {quat} a
 * @param {quat} b
 * @param {number} scale
 * @returns {quat}
 */
function scaleAndAddQuat(out, a, b, scale) {
  return quat.set(out,
      a[0] + b[0] * scale,
      a[1] + b[1] * scale,
      a[2] + b[2] * scale,
      a[3] + b[3] * scale);
}

/**
 * @param {vec3} v
 * @returns {number}
 */
function getMaxVec3Dimension(v) {
  let max = v[0] > v[1] ? v[0] : v[1];
  max = max > v[2] ? max : v[2];
  return max;
}

export {
  EPSILON,
  HALF_PI,
  TWO_PI,
  degToRad,
  radToDeg,
  areClose,
  areVec3sEqual,
  vec3ToString,
  createRandomVec3,
  randomVec3InRange,
  addRandomRotationToVector,
  scaleAndAddQuat,
  getMaxVec3Dimension,
};
