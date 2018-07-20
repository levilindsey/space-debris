/**
 * This module defines the ship shape configuration.
 */

import {
  calculateOrthogonalVertexNormals
} from 'gamex';

const shipRenderableShapeFactory = {
  shapeId: 'SHIP',

  /**
   * @param {ShipShapeConfig} params
   * @returns {RenderableShape}
   */
  getRenderableShape: (params) => {
    const facelessVertexPositions = _calculateFacelessVertexPositions(params);
    const vertexPositions = _calculateVertexPositions(facelessVertexPositions);
    const vertexNormals = _calculateVertexNormals(vertexPositions);
    const textureCoordinates = _calculateTextureCoordinates(params);

    return {
      vertexPositions: vertexPositions,
      vertexNormals: vertexNormals,
      textureCoordinates: textureCoordinates,
      vertexIndices: null,
      elementCount: vertexPositions.length / 3,
    };
  },

  /**
   * @param {ShipShapeConfig} params
   * @returns {string}
   */
  getCacheId(params) {
    return `${params.shapeId}:${params.shipWidth}:${params.shipLength}` +
        `:${params.shipDepth}:${params.shipRearWingExtensionLength}`;
  }
};

//             4:(0,0,5)
//                  |
//                  |
//
//                  ^
//                 /|\
//                / | \
//               /  |  \
//              /   |   \
//             /    |    \
//            /     o     \  ------- Local origin
//           /      |      \
//          /       |       \
//         /        |        \
//        /       __^__       \
//       /   __---     ---__   \
//      /_---               ---_\
//
//      |           |           |
//      |           |           |
// 0:(-2,0,0)       |           |
//                  |           |
//          1,2:(0,.5,.5)       |
//                              |
//                         3:(2,0,0)

// For the calculation of the vertex normals, it is important to specify the vertices for a face in
// clockwise order (as seen when looking at the exterior side).
const _faceVertexPositionIndices = [
  // Top-left face
  vec3.fromValues(1, 0, 4),
  // Top-right face
  vec3.fromValues(3, 1, 4),
  // Bottom-left face
  vec3.fromValues(0, 2, 4),
  // Bottom-right face
  vec3.fromValues(2, 3, 4),
  // Back-left face
  vec3.fromValues(0, 1, 2),
  // Back-right face
  vec3.fromValues(2, 1, 3),
];

/**
 * @param {ShipShapeConfig} params
 * @returns {Array.<vec3>}
 * @private
 */
function _calculateFacelessVertexPositions(params) {
  const halfWidth = params.shipWidth / 2;
  const halfDepth = params.shipDepth / 2;
  const halfLength = params.shipLength / 2;

  return [
    // Back-left corner
    vec3.fromValues(-halfWidth, 0, halfLength),
    // Back-middle-top corner
    vec3.fromValues(0, halfDepth, halfLength - params.shipRearWingExtensionLength),
    // Back-middle-bottom corner
    vec3.fromValues(0, -halfDepth, halfLength - params.shipRearWingExtensionLength),
    // Back-right corner
    vec3.fromValues(halfWidth, 0, halfLength),
    // Front corner
    vec3.fromValues(0, 0, -halfLength),
  ];
}

/**
 * @param {Array.<vec3>} facelessVertexPositions
 * @returns {Array.<Number>}
 * @private
 */
function _calculateVertexPositions(facelessVertexPositions) {
  const vertexPositions = [];
  // TODO: find a better way of flattening this.
  // Create the flat array that is needed for the rendering pipeline.
  for (let i = 0, count = _faceVertexPositionIndices.length; i < count; i++) {
    const currentFaceVertexPositionIndices = _faceVertexPositionIndices[i];
    for (let j = 0; j < 3; j++) {
      const currentPosition = facelessVertexPositions[currentFaceVertexPositionIndices[j]];
      for (let k = 0; k < 3; k++) {
        vertexPositions[i * 9 + j * 3 + k] = currentPosition[k];
      }
    }
  }
  return vertexPositions;
}

/**
 * @param {Array.<Number>} vertexPositions
 * @returns {Array.<Number>}
 * @private
 */
function _calculateVertexNormals(vertexPositions) {
  return calculateOrthogonalVertexNormals(vertexPositions);
}

/**
 * @param {ShipShapeConfig} params
 * @returns {Array.<vec3>}
 * @private
 */
function _calculateTextureCoordinates(params) {
  const shipRearWingExtensionRatio = params.shipRearWingExtensionLength / params.shipLength;
  const oneMinusShipRearWingExtensionRatio = 1 - shipRearWingExtensionRatio;

  return [
    // Top-left face
    .5, oneMinusShipRearWingExtensionRatio,
    0, 1,
    .5, 0,
    // Top-right face
    1, 1,
    .5, oneMinusShipRearWingExtensionRatio,
    .5, 0,
    // Bottom-left face
    1, 1,
    .5, oneMinusShipRearWingExtensionRatio,
    .5, 0,
    // Bottom-right face
    .5, oneMinusShipRearWingExtensionRatio,
    0, 1,
    .5, 0,
    // Back-left face
    0, .5,
    .5, 0,
    .5, 1,
    // Back-right face
    .5, 1,
    .5, 0,
    1, .5
  ];
}

export {
  shipRenderableShapeFactory,
  _faceVertexPositionIndices,
  _calculateFacelessVertexPositions,
};

/**
 * @typedef {RenderableShapeConfig} ShipShapeConfig
 * @property {number} shipWidth
 * @property {number} shipLength
 * @property {number} shipDepth
 * @property {number} shipRearWingExtensionLength
 * @property {number} shipForwardThrusterMarginRatio
 * @property {number} shipForwardThrusterLength
 */
