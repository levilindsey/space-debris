/**
 * This module defines the shape configuration for the ship's forward-thruster.
 *
 * The forward thruster follows the shape of the back side of the ship, but with a margin around the
 * edges. Also, the thruster sticks out slightly from the ship.
 */

import {calculateOrthogonalVertexNormals} from '../../../../../gamex';

const shipForwardThrusterRenderableShapeFactory = {
  shapeId: 'SHIP_FORWARD_THRUSTER',

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

// For the calculation of the vertex normals, it is important to specify the vertices for a face in
// clockwise order (as seen when looking at the exterior side).
const _faceVertexPositionIndices = [
  // Top-left face
  vec3.fromValues(4, 1, 0),
  // Top-right face
  vec3.fromValues(4, 3, 1),
  // Bottom-left face
  vec3.fromValues(4, 0, 2),
  // Bottom-right face
  vec3.fromValues(4, 2, 3),
  // Front-left face
  vec3.fromValues(0, 1, 2),
  // Front-right face
  vec3.fromValues(2, 1, 3),
];

/**
 * @param {ShipShapeConfig} params
 * @returns {Array.<vec3>}
 * @private
 */
function _calculateFacelessVertexPositions(params) {
  const halfWidth = params.shipWidth / 2 * params.shipForwardThrusterMarginRatio;
  const halfDepth = params.shipDepth / 2 * params.shipForwardThrusterMarginRatio;
  const halfShipLength = params.shipLength / 2;
  const marginDepthOffset =
      params.shipRearWingExtensionLength * (1 - params.shipForwardThrusterMarginRatio);
  const epsilon = 0.001;
  const middleZ = halfShipLength - params.shipRearWingExtensionLength + epsilon;
  const outerZ = halfShipLength - marginDepthOffset + epsilon;

  return [
    // Front-left corner
    vec3.fromValues(-halfWidth, 0, outerZ),
    // Front-middle-top corner
    vec3.fromValues(0, halfDepth, middleZ),
    // Front-middle-bottom corner
    vec3.fromValues(0, -halfDepth, middleZ),
    // Front-right corner
    vec3.fromValues(halfWidth, 0, outerZ),
    // Back corner
    vec3.fromValues(0, 0, middleZ + params.shipForwardThrusterLength),
  ];
}

/**
 * @param {Array.<vec3>} facelessVertexPositions
 * @returns {Array.<Number>}
 * @private
 */
function _calculateVertexPositions(facelessVertexPositions) {
  const vertexPositions = [];
  // TODO: Consolidate with the duplicated logic in ship-shape-config.js.
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
  return [
    // TODO
  ];
}

export {shipForwardThrusterRenderableShapeFactory};
