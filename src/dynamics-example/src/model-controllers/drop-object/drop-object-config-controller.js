import {
  configController,
  findIntersectingCollidablesForCollidable,
  randomVec3InRange,
} from '../../../../gamex';

import {SimulationConfigController} from '../simulation-config-controller';

import {
  generalConfig,
  physicsConfig,
} from '../../config';
import {SingleObjectController} from '../single-object/single-object-controller';
import {dropObjectConfig, dropObjectFolderConfig} from './drop-object-config';

/**
 * This class updates a drop-object simulation according to configuration-change events triggered
 * through the dat.GUI menu.
 */
class DropObjectConfigController extends SimulationConfigController {
  /**
   * @param {ModelGroupControllerConfig} params
   */
  constructor(params) {
    super(params);

    configController.createFolder(dropObjectFolderConfig, null, {
      'triggerDrop': () => this._triggerObjectDrop()
    });
  }

  _triggerObjectDrop() {
    // Turn gravity back on (in case it was off from the collision simulator).
    vec3.set(physicsConfig._gravityVec, 0, 0, -physicsConfig.gravity);

    for (let i = 0; i < dropObjectConfig.count; i++) {
      this._createNewObject();
    }
  }

  /**
   * @private
   */
  _createNewObject() {
    const modelControllerParams = {
      gl: this._gl,
      getViewMatrix: this._getViewMatrix,
      getProjectionMatrix: this._getProjectionMatrix,
      getParentWorldTransform: this._getParentWorldTransform,
      programWrapperId: generalConfig.shaderProgram,
      texturePath: generalConfig.texturePath,
    };

    const dynamicsParams = {
      position: randomVec3InRange(dropObjectConfig.startPositionAvg,
          dropObjectConfig.startPositionRange),
      mass: 1,
    };

    const object = new SingleObjectController(modelControllerParams, dynamicsParams,
        dropObjectConfig.shape);
    this._startModelController(object).then(_ensureObjectIsNotColliding);
  }
}

/**
 * Adds a z offset to the new object so that it does not collide with any pre-existing objects.
 *
 * @param {SingleObjectController} object
 * @private
 */
function _ensureObjectIsNotColliding(object) {
  const collidable = object.physicsJob.collidable;
  let startPosition = object.position;
  let collidingCollidables = findIntersectingCollidablesForCollidable(collidable);
  while (collidingCollidables.length) {
    startPosition[2] += Math.random() * 200 + 4;
    object.position = startPosition;
    collidingCollidables = findIntersectingCollidablesForCollidable(collidable);
  }
}

export {DropObjectConfigController};
