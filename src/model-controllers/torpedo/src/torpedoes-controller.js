import {
  ModelGroupController,
  throttle,
} from 'gamex';

import {TorpedoController} from './torpedo-controller';
import {torpedoesConfig} from './torpedoes-config';

/**
 * This class controls all torpedoes in the scene.
 *
 * - New torpedoes are added from either the ship or a UFO.
 * - Old torpedoes are removed when they move too far from the ship.
 */
class TorpedoesController extends ModelGroupController {
  /**
   * @param {ModelGroupControllerConfig} modelControllerParams
   * @param {Function.<vec3>} getShipPosition
   */
  constructor(modelControllerParams, getShipPosition) {
    super(modelControllerParams);
    this._getShipPosition = getShipPosition;
    this._throttledRemoveDistantTorpedoes =
        throttle(() => this._removeDistantTorpedoes(), torpedoesConfig._removalCheckThrottleDelay);
  }

  reset() {
    this.clearModelControllers();
  }

  /**
   * @param {TorpedoConfig} torpedoParams
   */
  createTorpedo(torpedoParams) {
    const modelControllerParams = {
      gl: this._gl,
      getViewMatrix: this._getViewMatrix,
      getProjectionMatrix: this._getProjectionMatrix,
      getParentWorldTransform: this._getParentWorldTransform,
    };
    const torpedo = new TorpedoController(modelControllerParams, torpedoParams,
        torpedo => this._onModelControllerDestroyed(torpedo));
    this._startModelController(torpedo);
  }

  _removeDistantTorpedoes() {
    this._removeDistantModelControllers(this._getShipPosition(),
        torpedoesConfig._removalSquaredDistance);
  }

  /**
   * @param {DOMHighResTimeStamp} currentTime
   * @param {DOMHighResTimeStamp} deltaTime
   */
  update(currentTime, deltaTime) {
    this._throttledRemoveDistantTorpedoes();
  }

  /**
   * @param {string} id
   */
  // TODO: Call this from dat.GUI trigger.
  updateProgramWrapper(id) {
    this._modelCtrls.forEach(object => object.programWrapperId = id);
  }
}

export {TorpedoesController};
