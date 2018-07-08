import {PhysicsModelController} from './physics-model-controller';
import {CollidablePhysicsJob, PhysicsState} from '../../../physx';

/**
 * This class represents a collidable physics-based model-controller.
 *
 * @abstract
 */
class CollidablePhysicsModelController extends PhysicsModelController {
  /**
   * @param {ModelControllerConfig} modelControllerParams
   * @param {DynamicsConfig} dynamicsParams
   * @param {RenderableShapeConfig} shapeParams
   * @param {Array.<ForceApplier>} forceAppliers
   */
  constructor(modelControllerParams, dynamicsParams, shapeParams, forceAppliers) {
    super(modelControllerParams, dynamicsParams, shapeParams, forceAppliers);

    // CollidablePhysicsModelController is an abstract class. It should not be instantiated directly.
    if (new.target === CollidablePhysicsModelController) {
      throw new TypeError('Cannot construct CollidablePhysicsModelController instances directly');
    }
  }

  /**
   * @param {RenderableAndCollidableShapeConfig} shapeParams
   * @param {Array.<ForceApplier>} forceAppliers
   * @protected
   */
  _createPhysicsJob(shapeParams, forceAppliers) {
    const state = new PhysicsState(this._dynamicsParams);
    return new CollidablePhysicsJob(shapeParams, state, forceAppliers, this,
        collision => this.handleCollision(collision));
  }

  /**
   * This callback is triggered in response to a collision.
   *
   * @param {Collision} collision
   * @returns {boolean} True if this needs the standard collision restitution to proceed.
   * @abstract
   */
  handleCollision(collision) {
    // Extending classes should implement this method.
    throw new TypeError('Method not implemented');
  }
}

export {CollidablePhysicsModelController};

/**
 * @typedef {RenderableShapeConfig&CollidableShapeConfig} RenderableAndCollidableShapeConfig
 */
