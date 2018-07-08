import {
  applyAngularDrag,
  applyLinearDrag,
  createBoxInertiaTensor,
  EPSILON,
  getOtherControllerFromCollision,
  shallowCopy,
  CollidablePhysicsModelController,
  throttle,
}
from '../../../../../gamex';

import {
  inputConfig,
  physicsConfig,
}
from '../../../config';

import { shipConfig } from './ship-config';
import { ShipForwardThrusterController } from './ship-forward-thruster-controller';

/**
 * This class controls the ship.
 */
class ShipController extends CollidablePhysicsModelController {
  /**
   * @param {ModelControllerConfig} modelControllerParams
   * @param {InputController} inputCtrl
   * @param {HealthController} healthCtrl
   * @param {TorpedoesController} torpedoesCtrl
   */
  constructor(modelControllerParams, inputCtrl, healthCtrl, torpedoesCtrl) {
    modelControllerParams.programWrapperId = shipConfig.shaderProgram;
    modelControllerParams.texturePath = shipConfig.texturePath;

    const shapeParams = {
      shapeId: 'SHIP',
      collidableShapeId: 'SPHERE',
      shipWidth: shipConfig.shipWidth,
      shipLength: shipConfig.shipLength,
      shipDepth: shipConfig.shipDepth,
      shipRearWingExtensionLength: shipConfig.shipRearWingExtensionLength,
      shipForwardThrusterMarginRatio: shipConfig.forwardThrusterMarginRatio,
      shipForwardThrusterLength: shipConfig.forwardThrusterLength,
      isStationary: false,
      scale: vec3.fromValues(1, 1, 1),
    };
    const dynamicsParams = {
      mass: shipConfig.mass,
      position: vec3.create(),
      momentum: _getInitialMomentum(),
      orientation: quat.create(),
      angularMomentum: vec3.create(),
      unrotatedInertiaTensor: _createInertiaTensor(shapeParams),
    };
    const forceAppliers = [
      (output, input) => this._applySpinSlowdown(output, input),
      applyLinearDrag.bind(null, physicsConfig),
      applyAngularDrag.bind(null, physicsConfig),
    ];

    super(modelControllerParams, dynamicsParams, shapeParams, forceAppliers);

    this._inputCtrl = inputCtrl;
    this._healthCtrl = healthCtrl;
    this._torpedoesCtrl = torpedoesCtrl;
    this._forwardThrusterCtrl = null;
    this._activeThrusters = null;
    this._thrusterConfig = null;
    this._isShipSpinningOutOfControl = false;

    this._setUpThrusterModelControllers(shallowCopy(modelControllerParams));
    this._setUpInputListeners();

    this._patchModelController({
      updateChildren: (currentTime, deltaTime) => {
        this._forwardThrusterCtrl.updateSelfAndChildren(currentTime, deltaTime);
      },
      getIsReady: (superVersion) => {
        return Promise.all([
          superVersion(),
          this._forwardThrusterCtrl.getIsReady(),
        ]);
      }
    });
  }

  /**
   * @param {ModelControllerConfig} modelControllerParams
   * @private
   */
  _setUpThrusterModelControllers(modelControllerParams) {
    modelControllerParams.getParentWorldTransform = () => this.modelCtrl._worldTransform;

    const getIsForwardThrusterActive = () => this._activeThrusters.has('forward');
    this._forwardThrusterCtrl =
      new ShipForwardThrusterController(modelControllerParams, getIsForwardThrusterActive);

    // TODO: Create the pitch and azimuth thruster models
  }

  /**
   * @private
   */
  _setUpInputListeners() {
    this._setUpThrusters();
    const throttledShootTorpedo =
      throttle(() => this._shootTorpedo(), shipConfig._shootTorpedoThrottleDelay, true);
    this._inputCtrl.addKeyDownListener(inputConfig.shipShootTorpedoKey,
      throttledShootTorpedo);
  }

  /**
   * @private
   */
  _shootTorpedo() {
    const state = this.physicsJob.currentState;
    const sphere = this.physicsJob.collidable;

    const orientation = quat.clone(state.orientation);

    // Calculate the velocity.
    const velocity = vec3.fromValues(0, 0, -shipConfig.torpedoSpeed);
    vec3.transformQuat(velocity, velocity, orientation);
    vec3.add(velocity, velocity, state.velocity);

    // Calculate the position.
    const shipSpeed = vec3.length(state.velocity);
    const shipDistanceNextFrame = shipSpeed * physicsConfig.timeStepDuration *
      _torpedoDistanceMultiplier;
    const torpedoDistance =
      sphere.radius + shipConfig.torpedoLength / 2 + shipDistanceNextFrame + EPSILON;
    const position = vec3.fromValues(0, 0, -torpedoDistance);
    vec3.transformQuat(position, position, orientation);
    vec3.add(position, position, sphere.centerOfVolume);

    const torpedoParams = {
      position: position,
      velocity: velocity,
      orientation: orientation,
      length: shipConfig.torpedoLength,
      width: shipConfig.torpedoWidth,
      color: shipConfig.torpedoColor.rgbVec,
      source: this,
    };
    this._torpedoesCtrl.createTorpedo(torpedoParams);
  }

  /**
   * @private
   */
  _setUpThrusters() {
    this._activeThrusters = new Set();

    this._thrusterConfig = {
      'forward': {
        key: inputConfig.shipForwardThrusterKey,
        forceApplier: _applyForwardThrust
      },
      'stabilizer': {
        key: inputConfig.shipStabilizerKey,
        forceApplier: _applyStabilizerThrust
      },
      'leftwardYaw': {
        key: inputConfig.shipYawThrusterLeftKey,
        forceApplier: _applyYawThrust.bind(this, true)
      },
      'rightwardYaw': {
        key: inputConfig.shipYawThrusterRightKey,
        forceApplier: _applyYawThrust.bind(this, false)
      },
      'upwardPitch': {
        key: inputConfig.shipPitchThrusterUpKey,
        forceApplier: _applyPitchThrust.bind(this, true)
      },
      'downwardPitch': {
        key: inputConfig.shipPitchThrusterDownKey,
        forceApplier: _applyPitchThrust.bind(this, false)
      },
    };

    Object.keys(this._thrusterConfig)
      .forEach(thrusterName => this.registerThrusterInputListeners(thrusterName));
  }

  /**
   * @param {string} thrusterName
   */
  registerThrusterInputListeners(thrusterName) {
    const key = this._thrusterConfig[thrusterName].key;
    this._inputCtrl.addKeyDownListener(key, () => this._activateThruster(thrusterName));
    this._inputCtrl.addKeyUpListener(key, () => this._deactivateThruster(thrusterName));
  }

  /**
   * @param {string} thrusterName
   * @private
   */
  _activateThruster(thrusterName) {
    this.physicsJob.addForceApplier(this._thrusterConfig[thrusterName].forceApplier);
    this._activeThrusters.add(thrusterName);
    if (thrusterName !== 'forward') {
      this._isShipSpinningOutOfControl = false;
    }
    // console.debug(`Started applying ${thrusterName} thrust`);
  }

  /**
   * @param {string} thrusterName
   * @private
   */
  _deactivateThruster(thrusterName) {
    this.physicsJob.removeForceApplier(this._thrusterConfig[thrusterName].forceApplier);
    this._activeThrusters.delete(thrusterName);
    // console.debug(`Stopped applying ${thrusterName} thrust`);
  }

  /**
   * @param {ForceApplierOutput} output
   * @param {ForceApplierInput} input
   * @private
   */
  _applySpinSlowdown(output, input) {
    // If the user is currently telling the ship to rotate, then don't slow the spin.
    if (this._isShipSpinningOutOfControl || this._isSomeShipRotationThrusterActive()) {
      return;
    }

    _applySpinSlowdown(output, input);
  }

  /**
   * @returns {boolean}
   * @private
   */
  _isSomeShipRotationThrusterActive() {
    return ![
      'leftwardYaw',
      'rightwardYaw',
      'upwardPitch',
      'downwardPitch',
    ].every(thruster => !this._activeThrusters.has(thruster));
  }

  /**
   * This callback is triggered in response to a collision.
   *
   * @param {Collision} collision
   * @returns {boolean} True if this needs the standard collision restitution to proceed.
   */
  handleCollision(collision) {
    const other = getOtherControllerFromCollision(collision, this);

    // Ignore collisions with torpedoes that this ship created (this shouldn't happen, but there's
    // a bug somewhere).
    if (other.source === this) return false;

    this._isShipSpinningOutOfControl = true;

    console.debug('Ship collided');

    // TODO: trigger a camera jitter crash animation

    this._healthCtrl.decrement();

    return true;
  }
}

/**
 * @param {ShipShapeConfig} shapeParams
 * @returns {mat3}
 * @private
 */
function _createInertiaTensor(shapeParams) {
  // This inertia tensor assumes the origin is at the center of the shape, but the ship shape
  // calculates its origin on the back side. However, this should have the effect of slightly
  // exaggerating the spin response of the ship when it collides, which I think is desirable.
  return createBoxInertiaTensor(shapeParams.shipWidth, shapeParams.shipLength,
    shapeParams.shipDepth, shipConfig.mass);
}

/**
 * Applies a forward thrust force in response to user input.
 *
 * @param {ForceApplierOutput} output
 * @param {ForceApplierInput} input
 * @private
 */
function _applyForwardThrust(output, input) {
  // Create an acceleration vector.
  const acceleration = vec3.fromValues(0, 0, -shipConfig.forwardThrustAccelerationMagnitude);

  // Rotate the acceleration to apply from the ship's current orientation.
  vec3.transformQuat(acceleration, acceleration, input.state.orientation);

  // Apply the force.
  vec3.scaleAndAdd(output.force, output.force, acceleration, input.state.mass);

  _applyMaxSpeedLimiter(output, input);
}

/**
 * @param {boolean} isLeftward
 * @param {ForceApplierOutput} output
 * @param {ForceApplierInput} input
 * @private
 */
function _applyYawThrust(isLeftward, output, input) {
  // Create an angular acceleration vector.
  const accelerationMagnitude = shipConfig.yawAngularAcceleration * (isLeftward ? 1 : -1);
  const acceleration = vec3.fromValues(0, accelerationMagnitude, 0);

  _applyLocalAngularAcceleration(output, input, acceleration);
  _applyMaxSpinLimiter(output, input);
}

/**
 * @param {boolean} isUpward
 * @param {ForceApplierOutput} output
 * @param {ForceApplierInput} input
 * @private
 */
function _applyPitchThrust(isUpward, output, input) {
  // Create an angular acceleration vector.
  const accelerationMagnitude = shipConfig.yawAngularAcceleration * (isUpward ? -1 : 1);
  const acceleration = vec3.fromValues(accelerationMagnitude, 0, 0);

  _applyLocalAngularAcceleration(output, input, acceleration);
  _applyMaxSpinLimiter(output, input);
}

/**
 * @param {ForceApplierOutput} output
 * @param {ForceApplierInput} input
 * @private
 */
function _applyMaxSpeedLimiter(output, input) {
  const speed = vec3.length(input.state.velocity);

  // If the ship isn't moving too fast, then we don't need to slow it down.
  if (speed < shipConfig.maxSpeed) {
    return;
  }

  // Calculate how far over the max speed the ship is moving.
  const speedDiff = speed - shipConfig.maxSpeed;

  // Calculate the change in velocity that is needed to reduce speed to the limit.
  const counterAcceleration = vec3.create();
  vec3.negate(counterAcceleration, input.state.velocity);
  vec3.normalize(counterAcceleration, counterAcceleration);

  // Calculate the slow-down acceleration.
  vec3.scale(counterAcceleration, counterAcceleration, speedDiff);

  // Apply the slow-down force.
  vec3.scaleAndAdd(output.force, output.force, counterAcceleration, input.state.mass);
}

/**
 * @param {ForceApplierOutput} output
 * @param {ForceApplierInput} input
 * @private
 */
function _applyMaxSpinLimiter(output, input) {
  const angularSpeed = vec3.length(input.state.angularVelocity);

  // If the ship isn't rotating too fast, then we don't need to slow it down.
  if (angularSpeed < shipConfig.maxAngularSpeed) {
    return;
  }

  // Calculate how far over the max angular speed the ship is rotating.
  const angularSpeedDiff = angularSpeed - shipConfig.maxAngularSpeed;

  // Calculate the change in angular velocity that is needed to reduce rotation to the limit.
  const counterAcceleration = vec3.create();
  vec3.negate(counterAcceleration, input.state.angularVelocity);
  vec3.normalize(counterAcceleration, counterAcceleration);

  // Calculate the slow-down angular acceleration.
  vec3.scale(counterAcceleration, counterAcceleration, angularSpeedDiff);

  _applyWorldAngularAcceleration(output, input, counterAcceleration);
}

/**
 * Applies stabilizing thrust force (aka brakes) in response to user input.
 *
 * @param {ForceApplierOutput} output
 * @param {ForceApplierInput} input
 * @private
 */
function _applyStabilizerThrust(output, input) {
  _applySpeedSlowdown(output, input);
  _applySpinSlowdown(output, input);
}

/**
 * @param {ForceApplierOutput} output
 * @param {ForceApplierInput} input
 * @private
 */
function _applySpeedSlowdown(output, input) {
  const speed = vec3.length(input.state.velocity);

  // If the ship isn't moving, we don't need to slow it.
  if (speed === 0) {
    return;
  }

  // Determine the direction to apply the slowdown in.
  const acceleration = vec3.create();
  vec3.normalize(acceleration, input.state.velocity);

  // Slow down by configured acceleration, unless it exceeds the current speed.
  const slowDownMagnitude = speed > shipConfig.slowdownAcceleration ?
    shipConfig.slowdownAcceleration : speed;
  vec3.scale(acceleration, acceleration, -slowDownMagnitude);

  // Apply the slowdown force.
  vec3.scaleAndAdd(output.force, output.force, acceleration, input.state.mass);
}

/**
 * @param {ForceApplierOutput} output
 * @param {ForceApplierInput} input
 * @private
 */
function _applySpinSlowdown(output, input) {
  const angularSpeed = vec3.length(input.state.angularVelocity);

  // If the ship isn't rotating, we don't need to slow the spin.
  if (angularSpeed === 0) {
    return;
  }

  // Determine the direction to apply the slowdown in.
  const acceleration = vec3.create();
  vec3.normalize(acceleration, input.state.angularVelocity);

  // Slow down by configured acceleration, unless it exceeds the current spin.
  const slowDownMagnitude = angularSpeed > shipConfig.angularSlowdownAcceleration ?
    shipConfig.angularSlowdownAcceleration : angularSpeed;
  vec3.scale(acceleration, acceleration, -slowDownMagnitude);

  _applyWorldAngularAcceleration(output, input, acceleration);
}

/**
 * @param {ForceApplierOutput} output
 * @param {ForceApplierInput} input
 * @param {vec3} acceleration
 * @private
 */
function _applyWorldAngularAcceleration(output, input, acceleration) {
  // Convert the acceleration to local ship coordinates (so we can re-use
  // _applyLocalAngularAcceleration).
  const reverseRotation = quat.create();
  quat.invert(reverseRotation, input.state.orientation);
  vec3.transformQuat(acceleration, acceleration, reverseRotation);

  _applyLocalAngularAcceleration(output, input, acceleration);
}

/**
 * @param {ForceApplierOutput} output
 * @param {ForceApplierInput} input
 * @param {vec3} acceleration
 * @private
 */
function _applyLocalAngularAcceleration(output, input, acceleration) {
  // Get torque from acceleration and mass moment of inertia.
  vec3.transformMat3(acceleration, acceleration, input.state.unrotatedInertiaTensor);

  // Rotate the torque to apply from the ship's current orientation.
  vec3.transformQuat(acceleration, acceleration, input.state.orientation);

  // Apply the torque.
  vec3.add(output.torque, output.torque, acceleration);
}

/**
 * Gives the ship a little initial momentum, which causes the far stars to glitter right at the
 * start.
 *
 * @returns {vec3}
 * @private
 */
function _getInitialMomentum() {
  return vec3.fromValues(0, 0, -_initialSpeed * shipConfig.mass);
}
const _initialSpeed = 0.002;

// For some unknown reason, a newly created torpedo sometimes collides with the ship. This
// multiplier helps to decrease the likelihood of that happening.
const _torpedoDistanceMultiplier = 1.1;

export { ShipController };
