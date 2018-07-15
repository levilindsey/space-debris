import {
  applyGravity,
  applyAngularDrag,
  applyLinearDrag,
  CollidablePhysicsModelController,
  pickRandom,
} from '../../../../gamex';

import {
  boxConfig,
  capsuleConfig,
  generalConfig,
  physicsConfig,
  sphereConfig,
} from '../../config';

const _shapeConfigs = {
  'CUBE': boxConfig,
  'ICOSAHEDRON': sphereConfig,
  'ICOSPHERE': sphereConfig,
  'LAT_LONG_SPHERE': sphereConfig,
  'CAPSULE': capsuleConfig,
  'TETRAHEDRON': sphereConfig,
};

const _renderableShapesToCollidaleShapes = {
  'CUBE': 'CUBE',
  'ICOSAHEDRON': 'SPHERE_OR_CAPSULE',
  'ICOSPHERE': 'SPHERE_OR_CAPSULE',
  'LAT_LONG_SPHERE': 'SPHERE_OR_CAPSULE',
  'CAPSULE': 'SPHERE_OR_CAPSULE',
  'TETRAHEDRON': 'SPHERE_OR_CAPSULE',
};

/**
 * This class that controls a single object.
 */
class SingleObjectController extends CollidablePhysicsModelController {
  /**
   * @param {ModelControllerConfig} modelControllerParams
   * @param {DynamicsConfig} dynamicsParams
   * @param {string} shapeId
   */
  constructor(modelControllerParams, dynamicsParams, shapeId) {
    shapeId = shapeId === 'RANDOM' ? pickRandom(Object.keys(_shapeConfigs)) : shapeId;
    const collidableShapeId = _renderableShapesToCollidaleShapes[shapeId];
    const scale = shapeId === 'CUBE' ? boxConfig.scale : vec3.fromValues(1, 1, 1);
    const config = _shapeConfigs[shapeId];
    const shapeParams = {
      shapeId: shapeId,
      collidableShapeId: collidableShapeId,
      isUsingSphericalNormals: generalConfig.useSmoothShading,
      divisionsCount: config.sphericalTesselationCount,
      capsuleEndPointsDistance: config.capsuleEndPointsDistance,
      radius: config.radius,
      scale: scale,
      isStationary: false,
    };
    const forceAppliers = [
      applyGravity.bind(null, physicsConfig),
      applyLinearDrag.bind(null, physicsConfig),
      applyAngularDrag.bind(null, physicsConfig),
    ];

    super(modelControllerParams, dynamicsParams, shapeParams, forceAppliers)
  }

  /**
   * This callback is triggered in response to a collision.
   *
   * @param {Collision} collision
   * @returns {boolean} True if this needs the standard collision restitution to proceed.
   */
  handleCollision(collision) {
    return true;
  }
}

export {SingleObjectController};
