import {
  configController,
  findIntersectingCollidablesForCollidable,
} from '../../../../gamex';

import {SimulationConfigController} from '../simulation-config-controller';

import {
  generalConfig,
  physicsConfig
} from '../../config';
import {SingleObjectController} from '../single-object/single-object-controller';
import {
  triggerCollisionConfig,
  object1Config,
  object2Config,
  triggerCollisionFolderConfig
} from './trigger-collision-config';

/**
 * This class updates a drop-object simulation according to configuration-change events triggered
 * through the dat.GUI menu.
 */
class TriggerCollisionConfigController extends SimulationConfigController {
  /**
   * @param {ModelGroupControllerConfig} params
   */
  constructor(params) {
    super(params);

    configController.createFolder(triggerCollisionFolderConfig, null, {
      'triggerCollision': () => this._triggerCollision()
    });
  }

  _triggerCollision() {
    // Turn off gravity.
    vec3.set(physicsConfig._gravityVec, 0, 0, 0);

    this._createNewObject(true, object1Config);
    this._createNewObject(false, object2Config);
  }

  /**
   * @param {boolean} isFirstObject
   * @param {Object} objectConfig
   * @returns {SingleObjectController}
   * @private
   */
  _createNewObject(isFirstObject, objectConfig) {
    const modelControllerParams = {
      gl: this._gl,
      getViewMatrix: this._getViewMatrix,
      getProjectionMatrix: this._getProjectionMatrix,
      getParentWorldTransform: this._getParentWorldTransform,
      programWrapperId: generalConfig.shaderProgram,
      texturePath: generalConfig.texturePath,
    };

    // Set the initial offset.
    const xOffset = isFirstObject
        ? -triggerCollisionConfig.distance / 2
        : triggerCollisionConfig.distance / 2;
    const startPosition = vec3.fromValues(xOffset, 0, 0);
    vec3.add(startPosition, startPosition, objectConfig.displacement);

    const dynamicsParams = {
      position: startPosition,
      mass: objectConfig.mass,
    };

    const object = new SingleObjectController(modelControllerParams, dynamicsParams,
        objectConfig.shape);
    this._startModelController(object).then(() => {
      // Set the initial orientation.
      const orientation = quat.create();
      quat.rotateX(orientation, orientation, objectConfig.rotationX);
      quat.rotateX(orientation, orientation, objectConfig.rotationY);
      quat.rotateX(orientation, orientation, objectConfig.rotationZ);
      object.physicsJob.previousState.orientation = orientation;
      object.physicsJob.currentState.orientation = quat.clone(orientation);

      // Set the initial velocity.
      const xVelocity = isFirstObject ? triggerCollisionConfig.speed : -triggerCollisionConfig.speed;
      const xMomentum = xVelocity * object.physicsJob.currentState.mass;
      object.physicsJob.previousState.momentum = vec3.fromValues(xMomentum, 0, 0);
      object.physicsJob.currentState.momentum = vec3.fromValues(xMomentum, 0, 0);

      _ensureObjectIsNotColliding(object);
    });
  }
}

/**
 * Adds an x offset to the new object so that it does not collide with any pre-existing objects.
 *
 * @param {SingleObjectController} object
 * @private
 */
function _ensureObjectIsNotColliding(object) {
  const collidable = object.physicsJob.collidable;
  const startPosition = object.position;
  let collidingCollidables = findIntersectingCollidablesForCollidable(collidable);
  while (collidingCollidables.length) {
    startPosition[0] *= Math.random() + 1;
    object.position = startPosition;
    collidingCollidables = findIntersectingCollidablesForCollidable(collidable);
  }
}

export {TriggerCollisionConfigController};
