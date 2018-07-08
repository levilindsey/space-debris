/**
 * This module defines the asteroid shape configuration.
 *
 * The asteroid shape is formed from giving random offsets to the vertices of a icosphere.
 *
 * The shape is centered around the origin.
 */

import {
  createRandomVec3,
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

    const vertexPositions = icosphereRenderableShape.vertexPositions;
    //_addRandomOffsetsToPositions(vertexPositions); // TODO: ADD BACK IN

    return {
      vertexPositions: vertexPositions,
      vertexNormals: icosphereRenderableShape.vertexNormals,
      textureCoordinates: icosphereRenderableShape.textureCoordinates,
      vertexIndices: icosphereRenderableShape.vertexIndices,
      elementCount: icosphereRenderableShape.elementCount,
    };
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
 * Adds a random orthogonal and tangential offset to each of the given positions.
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
  let tangentialOffset;
  let tangentialOffsetVector;

  for (i = 0, count = vertexPositions.length; i < count; i += 3) {
    vec3.set(vertexPosition, vertexPositions[i], vertexPositions[i + 1], vertexPositions[i + 2]);

    // Orthogonal offset.
    orthogonalOffset = randomFloatInRange(asteroidsConfig.minVertexOrthogonalDeviation,
        asteroidsConfig.maxVertexOrthogonalDeviation);
    vec3.copy(orthogonalOffsetVector, vertexPositions);
    vec3.scale(orthogonalOffset, orthogonalOffset, orthogonalOffset);

    // Tangential offset (also contributes slightly to the orthogonal offset).
    tangentialOffset = randomFloatInRange(asteroidsConfig.minVertexTangentialDeviation,
        asteroidsConfig.maxVertexTangentialDeviation);
    tangentialOffsetVector = createRandomVec3();
    vec3.scale(tangentialOffsetVector, tangentialOffsetVector, tangentialOffset);

    vec3.add(vertexPosition, vertexPosition, orthogonalOffset);
    vec3.add(vertexPosition, vertexPosition, tangentialOffset);

    vertexPositions[i] = vertexPosition[0];
    vertexPositions[i + 1] = vertexPosition[1];
    vertexPositions[i + 2] = vertexPosition[2];
  }
}

export {asteroidRenderableShapeFactory};
