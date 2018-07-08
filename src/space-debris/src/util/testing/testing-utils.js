/**
 * This module defines a collection of static general utility functions for testing.
 */

/**
 * @param {vec3} v1
 * @param {vec3} v2
 * @param {vec3} [v3] If given, then if v1 != v2, v1 == v3 will be checked instead.
 * @param {vec3} [v4] If given, then if v1 != v3, v1 == v4 will be checked instead.
 */
function checkVec3(v1, v2, v3, v4) {
  let result = _compareVertices(v1, v2);
  if (result !== 0 && typeof v3 !== 'undefined') {
    result = _compareVertices(v1, v3);
    if (result !== 0 && typeof v4 !== 'undefined') {
      result = _compareVertices(v1, v4);
    }
  }
  expect(result).toEqual(0, `Expected (${v1}) to match (${v2})`);
}

const EPSILON = 0.00001;

/**
 * @param {vec3} a
 * @param {vec3} b
 * @returns {number}
 */
function _compareVertices(a, b) {
  let diff = a[0] - b[0];
  if (Math.abs(diff) > EPSILON) {
    return diff;
  }
  diff = a[1] - b[1];
  if (Math.abs(diff) > EPSILON) {
    return diff;
  }
  diff = a[2] - b[2];
  if (Math.abs(diff) > EPSILON) {
    return diff;
  }
  return 0;
}

export {
  checkVec3
};
