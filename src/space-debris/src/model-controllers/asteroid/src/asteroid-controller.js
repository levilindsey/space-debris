import {
  getOtherControllerFromCollision,
  CollidablePhysicsModelController,
}
from '../../../../../gamex';

import { asteroidsConfig } from './asteroids-config';

/**
 * This class controls an asteroid.
 */
class AsteroidController extends CollidablePhysicsModelController {
  /**
   * @param {ModelControllerConfig} modelControllerParams
   * @param {DynamicsConfig} dynamicsParams
   * @param {vec3} scale
   * @param {number} divisionsCount
   * @param {ScoreController} scoreCtrl
   * @param {Function} onDestroyedCallback
   */
  constructor(modelControllerParams, dynamicsParams, scale, divisionsCount, scoreCtrl,
    onDestroyedCallback) {
    modelControllerParams.programWrapperId = asteroidsConfig.shaderProgram;
    modelControllerParams.texturePath = asteroidsConfig.texturePath;

    const shapeParams = {
      shapeId: 'ASTEROID',
      collidableShapeId: 'SPHERE',
      isUsingSphericalNormals: true,
      divisionsCount: divisionsCount,
      scale: scale,
      isStationary: false,
    };
    const forceAppliers = [];

    super(modelControllerParams, dynamicsParams, shapeParams, forceAppliers);

    this._scoreCtrl = scoreCtrl;
    this._onDestroyedCallback = onDestroyedCallback;
  }

  /**
   * This callback is triggered in response to a collision.
   *
   * @param {Collision} collision
   * @returns {boolean} True if this needs the standard collision restitution to proceed.
   */
  handleCollision(collision) {
    const collidableType = getOtherControllerFromCollision(collision, this).constructor.name;
    if (collidableType === 'TorpedoController') {
      this._scoreCtrl.onAsteroidShot();
      this._onDestroyedCallback(this);
      return false;
    }
    else {
      return true;
    }
  }
}

export { AsteroidController };
