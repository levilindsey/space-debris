import {
  getOtherControllerFromCollision,
  CollidablePhysicsModelController,
} from '../../../../../gamex';

import {flatColorProgramWrapperConfig} from '../../../programs';
import {torpedoesConfig} from './torpedoes-config';

/**
 * This class controls a torpedo.
 */
class TorpedoController extends CollidablePhysicsModelController {
  /**
   * @param {ModelControllerConfig} modelControllerParams
   * @param {TorpedoConfig} torpedoParams
   * @param {Function} onDestroyedCallback
   */
  constructor(modelControllerParams, torpedoParams, onDestroyedCallback) {
    modelControllerParams.programWrapperId = torpedoesConfig.shaderProgram;

    const shapeParams = _createShapeParams(torpedoParams);
    const dynamicsParams = _createDynamicsParams(torpedoParams);
    const forceAppliers = [];

    super(modelControllerParams, dynamicsParams, shapeParams, forceAppliers);

    this.source = torpedoParams.source;
    this._onDestroyedCallback = onDestroyedCallback;

    this.modelCtrl._color = vec4.fromValues(torpedoParams.color[0], torpedoParams.color[1],
        torpedoParams.color[2], torpedoesConfig.alpha);

    // Re-use some methods that are common for the flat-color program.
    this._patchModelController({
      draw: flatColorProgramWrapperConfig.draw,
      _setUpProgramVariablesConfig: flatColorProgramWrapperConfig.setUpProgramVariablesConfig,
    });
  }

  reset() {
    super.reset();

    // Clear some unused inherited properties.
    delete this.modelCtrl._normalMatrix;
    delete this._model._vertexNormalsBuffer;
    delete this._model._textureCoordinatesBuffer;
    delete this._model._textureCoordinatesConfig;
    delete this._model._vertexNormalsConfig;
  }

  /**
   * @param {Collision} collision
   * @returns {boolean} True if this needs the standard collision restitution to proceed.
   */
  handleCollision(collision) {
    const other = getOtherControllerFromCollision(collision, this);

    // Ignore collisions with the object that created this torpedo (this shouldn't happen, but
    // there's a bug somewhere).
    if (other === this.source) return false;

    this._onDestroyedCallback(this);

    const collidableType = getOtherControllerFromCollision(collision, this).constructor.name;
    return collidableType === 'AsteroidController' ? false : true;
  }
}

/**
 * @param {TorpedoConfig} torpedoParams
 * @returns {RenderableAndCollidableShapeConfig}
 * @private
 */
function _createShapeParams(torpedoParams) {
  return {
    shapeId: 'CAPSULE',
    collidableShapeId: 'CAPSULE',
    isStationary: false,
    isUsingSphericalNormals: true,
    divisionsCount: 4,// FIXME: Check this
    capsuleEndPointsDistance: torpedoParams.length - torpedoParams.width,
    radius: torpedoParams.width / 2,
    scale: vec3.fromValues(1, 1, 1),
  };
}

/**
 * @param {TorpedoConfig} torpedoParams
 * @returns {DynamicsConfig}
 * @private
 */
function _createDynamicsParams(torpedoParams) {
  const momentum = vec3.create();
  vec3.scale(momentum, torpedoParams.velocity, torpedoesConfig.mass);
  return {
    mass: torpedoesConfig.mass,
    position: torpedoParams.position,
    momentum: momentum,
    orientation: torpedoParams.orientation,
  };
}

export {TorpedoController};

/**
 * @typedef {Object} TorpedoConfig
 * @property {vec3} position
 * @property {vec3} velocity
 * @property {vec3} orientation
 * @property {number} length
 * @property {number} width
 * @property {vec3} color
 * @property {ModelController} source
 */
