/**
 * This module defines the asteroid shape configuration.
 *
 * The asteroid shape is formed from giving random offsets to the vertices of a icosphere.
 *
 * The shape is centered around the origin.
 */

import {
  deepCopy,
  getCacheKey,
  randomFloatInRange,
  renderableShapeFactory,
} from '../../../../../gamex';
import {asteroidsConfig} from './asteroids-config';

const asteroidRenderableShapeFactory = {
  shapeId: 'ASTEROID',

  /**
   * @param {RenderableShapeConfig} params
   * @returns {RenderableShape}
   */
  getRenderableShape: (params) => {
    const copyParams = deepCopy(params);
    copyParams.shapeId = 'ICOSPHERE';
    const icosphereRenderableShape = renderableShapeFactory.getRenderableShape(copyParams);

    // Copy the normals array, because it may have been referencing the same instance as the
    // positions array, which we're about to modify.
    icosphereRenderableShape.vertexNormals = [...icosphereRenderableShape.vertexNormals];

    _addRandomOffsetsToPositions(icosphereRenderableShape.vertexPositions);

    return icosphereRenderableShape;
  },

  /**
   * @param {RenderableShapeConfig} params
   * @returns {string}
   */
  getCacheId(params) {
    return getCacheKey(params);
  }
};

/**
 * Adds a random orthogonal offset to each of the given positions.
 *
 * @param {Array.<Number>} vertexPositions
 * @private
 */
function _addRandomOffsetsToPositions(vertexPositions) {
  const vertexPosition = vec3.create();
  const orthogonalOffsetVector = vec3.create();

  let i;
  let count;
  let orthogonalOffset;

  for (i = 0, count = vertexPositions.length; i < count; i += 3) {
    vec3.set(vertexPosition, vertexPositions[i], vertexPositions[i + 1], vertexPositions[i + 2]);

    // Orthogonal offset.
    orthogonalOffset = randomFloatInRange(asteroidsConfig.minVertexOrthogonalDeviation,
        asteroidsConfig.maxVertexOrthogonalDeviation);
    vec3.copy(orthogonalOffsetVector, vertexPosition);
    vec3.scale(orthogonalOffsetVector, orthogonalOffsetVector, orthogonalOffset);

    vec3.add(vertexPosition, vertexPosition, orthogonalOffsetVector);

    vertexPositions[i] = vertexPosition[0];
    vertexPositions[i + 1] = vertexPosition[1];
    vertexPositions[i + 2] = vertexPosition[2];
  }
}

export {asteroidRenderableShapeFactory};
