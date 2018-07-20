import {
  addRandomRotationToVector,
  animator,
  createRandomVec3,
  createSphereInertiaTensor,
  findIntersectingCollidablesForCollidable,
  getMaxVec3Dimension,
  ModelGroupController,
  randomFloatInRange,
  randomIntInRange,
  throttle,
  TWO_PI,
}
from 'gamex';

import { calculateInterceptVelocity } from '../../../util';
import { AsteroidController } from './asteroid-controller';
import { asteroidsConfig } from './asteroids-config';

/**
 * This class controls the collection of asteroids.
 *
 * - New asteroids are added at a regular time interval.
 *   - New asteroids are created within a wide cone region around the ship's current trajectory.
 *   - New asteroids are given a trajectory that is slightly offset from what would cause them to
 *     intercept the ship at its current trajectory.
 *   - The asteroid count will always be within a configured min and max.
 * - Old asteroids are removed when they move too far from the ship.
 */
class AsteroidsController extends ModelGroupController {
  /**
   * @param {ModelGroupControllerConfig} modelControllerParams
   * @param {Function.<vec3>} getShipPosition
   * @param {Function.<vec3>} getShipVelocity
   */
  constructor(modelControllerParams, scoreCtrl, getShipPosition, getShipVelocity) {
    super(modelControllerParams);
    this._scoreCtrl = scoreCtrl;
    this._getShipPosition = getShipPosition;
    this._getShipVelocity = getShipVelocity;
    this._throttledRemoveDistantAsteroids =
      throttle(() => this._removeDistantAsteroids(), asteroidsConfig._removalCheckThrottleDelay);
    this._lastAsteroidSpawnTime = null;
  }

  reset() {
    this.clearModelControllers();
    this._createInitialAsteroids();
    this._lastAsteroidSpawnTime = animator.currentTime;
  }

  /**
   * @param {DOMHighResTimeStamp} currentTime
   * @param {DOMHighResTimeStamp} deltaTime
   */
  update(currentTime, deltaTime) {
    this._throttledRemoveDistantAsteroids();
    this._handleInFlightAsteroidCreation(currentTime);
  }

  /**
   * @param {number} currentTime
   * @private
   */
  _handleInFlightAsteroidCreation(currentTime) {
    const elapsedTime = currentTime - this._lastAsteroidSpawnTime;
    const spawnPeriod = asteroidsConfig._spawnPeriodShipSpeedMultiplier /
      vec3.length(this._getShipVelocity());
    if (elapsedTime > spawnPeriod) {
      this._lastAsteroidSpawnTime = currentTime;
      this._createInFlightAsteroid().then(asteroid => this._ensureAsteroidIsNotColliding(asteroid));
    }
  }

  /**
   * @private
   */
  _createInitialAsteroids() {
    const promises = [];
    for (let i = 0; i < asteroidsConfig.initialAsteroidCount; i++) {
      promises.push(this._createInitialAsteroid());
    }
    Promise.all(promises).then(() => this._ensureNoAsteroidsCollide());
  }

  /**
   * @returns {Promise.<ModelController>}
   * @private
   */
  _createInitialAsteroid() {
    const position = this._createRandomInitialAsteroidPosition();
    const velocity = this._createRandomAsteroidVelocity(position,
      asteroidsConfig._initialMinSpeed, asteroidsConfig._initialMaxSpeed);
    return this._createAsteroid(position, velocity);
  }

  /**
   * @returns {Promise.<ModelController>}
   * @private
   */
  _createInFlightAsteroid() {
    // Make sure we don't create too many asteroids.
    if (this._modelCtrls.length >= asteroidsConfig.maxAsteroidCount) return Promise.reject();

    const position = this._createRandomInFlightAsteroidPosition();
    const velocity = this._createRandomAsteroidVelocity(position, asteroidsConfig.minSpeed,
      asteroidsConfig.maxSpeed);
    return this._createAsteroid(position, velocity);
  }

  /**
   * @param {vec3} position
   * @param {vec3} velocity
   * @returns {Promise.<ModelController>}
   * @private
   */
  _createAsteroid(position, velocity) {
    const scale = this._createRandomAsteroidScale();
    const rotationRate = this._createRandomAsteroidRotationRate();
    const divisionsCount = this._createRandomAsteroidDivisionsCount();

    const modelControllerParams = {
      gl: this._gl,
      getViewMatrix: this._getViewMatrix,
      getProjectionMatrix: this._getProjectionMatrix,
      getParentWorldTransform: this._getParentWorldTransform,
    };

    const dynamicsParams = _calculateAsteroidDynamicsConfig(asteroidsConfig.density, position,
      velocity, rotationRate, scale);

    const asteroid = new AsteroidController(
      modelControllerParams,
      dynamicsParams,
      scale,
      divisionsCount,
      this._scoreCtrl,
      asteroid => this._onModelControllerDestroyed(asteroid));
    return this._startModelController(asteroid);
  }

  /**
   * @returns {vec3}
   * @private
   */
  _createRandomInitialAsteroidPosition() {
    const distanceFromShip = randomFloatInRange(asteroidsConfig._initialAsteroidMinDistanceFromShip,
      asteroidsConfig._initialAsteroidMaxDistanceFromShip);
    const shipPosition = this._getShipPosition();

    // Direction from ship.
    const asteroidPosition = createRandomVec3();
    // Displacement from ship.
    vec3.scale(asteroidPosition, asteroidPosition, distanceFromShip);
    // Asteroid position.
    vec3.add(asteroidPosition, asteroidPosition, shipPosition);

    return asteroidPosition;
  }

  /**
   * Creates a random position within a wide cone region around the ship's current trajectory.
   *
   * @returns {vec3}
   * @private
   */
  _createRandomInFlightAsteroidPosition() {
    // Calculate some parameters for the position within a virtual cone.
    let r = randomFloatInRange(0, 1);
    // Weight the angle to be further toward the outside of the the virtual cone.
    let ratio = 1 - r * r;
    const lateralAngle = ratio * asteroidsConfig.positionMaxAngleFromShipTrajectory;
    r = randomFloatInRange(0, 1);
    // Weight the distance to favor being further away.
    ratio = 1 - r * r;
    const distance = asteroidsConfig.minDistanceFromShip +
      (asteroidsConfig.maxDistanceFromShip - asteroidsConfig.minDistanceFromShip) * ratio;
    const axialAngle = randomFloatInRange(0, TWO_PI);
    const origin = vec3.create();

    // Start with a position at the given distance.
    const position = vec3.fromValues(0, 0, -distance);

    // Rotate the position within the virtual cone.
    vec3.rotateX(position, position, origin, lateralAngle);
    vec3.rotateZ(position, position, origin, axialAngle);

    // Rotate to match the direction of the ship's velocity.
    const shipVelocity = this._getShipVelocity();
    vec3.normalize(shipVelocity, shipVelocity);
    const rotationX = Math.asin(shipVelocity[1]);
    const rotationY = -Math.atan2(shipVelocity[0], -shipVelocity[2]);
    vec3.rotateX(position, position, origin, rotationX);
    vec3.rotateY(position, position, origin, rotationY);

    vec3.add(position, position, this._getShipPosition());

    return position;
  }

  /**
   * Adds any needed offset to any asteroid so that it does not collide with any pre-existing
   * objects.
   *
   * @private
   */
  _ensureNoAsteroidsCollide() {
    // Loop in reverse order so we only move the asteroids that are added later.
    for (let i = this._modelCtrls.length - 1; i >= 0; i--) {
      this._ensureAsteroidIsNotColliding(this._modelCtrls[i]);
    }
  }

  /**
   * Adds any needed offset to the new asteroid so that it does not collide with any pre-existing
   * objects.
   *
   * @param {AsteroidController} asteroid
   * @private
   */
  _ensureAsteroidIsNotColliding(asteroid) {
    const collidable = asteroid.physicsJob.collidable;
    const radius = getMaxVec3Dimension(asteroid.scale);
    const asteroidPosition = asteroid.position;

    const shipToAsteroidOffset = vec3.create();
    vec3.subtract(shipToAsteroidOffset, asteroidPosition, this._getShipPosition());
    vec3.normalize(shipToAsteroidOffset, shipToAsteroidOffset);
    vec3.scale(shipToAsteroidOffset, shipToAsteroidOffset, radius);

    let collidingCollidables = findIntersectingCollidablesForCollidable(collidable);
    while (collidingCollidables.length) {
      vec3.add(asteroidPosition, asteroidPosition, shipToAsteroidOffset);
      asteroid.position = asteroidPosition;
      collidingCollidables = findIntersectingCollidablesForCollidable(collidable);
    }
  }

  /**
   * Calculates a random velocity that moves the asteroid close to the ship.
   *
   * @param {vec3} asteroidPosition
   * @param {number} minSpeed
   * @param {number} maxSpeed
   * @returns {vec3}
   * @private
   */
  _createRandomAsteroidVelocity(asteroidPosition, minSpeed, maxSpeed) {
    const shipPosition = this._getShipPosition();
    const shipVelocity = this._getShipVelocity();

    // Calculate a random speed for the asteroid.
    const asteroidSpeed = randomFloatInRange(minSpeed, maxSpeed);

    // Calculate in what direction the asteroid needs to travel in order to collide with the ship if
    // the ship were to maintain it's current velocity.
    const interceptVelocity = vec3.create();
    calculateInterceptVelocity(
      interceptVelocity, asteroidPosition, asteroidSpeed, shipPosition, shipVelocity);

    // TODO: The calculation for intercept velocity seems broken; the resulting speeds are too fast.
    // This hack slows them down.
    vec3.normalize(interceptVelocity, interceptVelocity);
    vec3.scale(interceptVelocity, interceptVelocity, asteroidSpeed / 12);

    // Add a random deviation to the velocity calculated above.
    addRandomRotationToVector(interceptVelocity,
      asteroidsConfig.minInterceptVelocityDeviationAngle,
      asteroidsConfig.maxInterceptVelocityDeviationAngle);

    return interceptVelocity;
  }

  /**
   * @returns {vec3}
   * @private
   */
  _createRandomAsteroidScale() {
    const value = randomFloatInRange(asteroidsConfig.minScale, asteroidsConfig.maxScale);
    return vec3.fromValues(value, value, value);
  }

  /**
   * @returns {number}
   * @private
   */
  _createRandomAsteroidRotationRate() {
    return randomFloatInRange(asteroidsConfig.minRotationRate,
      asteroidsConfig.maxRotationRate);
  }

  /**
   * @returns {number}
   * @private
   */
  _createRandomAsteroidDivisionsCount() {
    return randomIntInRange(asteroidsConfig.minDivisionsCount,
      asteroidsConfig.maxDivisionsCount);
  }

  _removeDistantAsteroids() {
    this._removeDistantModelControllers(this._getShipPosition(),
      asteroidsConfig._removalSquaredDistance);

    // Make sure we don't have too few asteroids.
    const asteroidDeficit = asteroidsConfig.minAsteroidCount - this._modelCtrls.length;
    if (asteroidDeficit > 0) {
      const promises = [];
      for (let i = 0; i < asteroidDeficit; i++) {
        promises.push(this._createInFlightAsteroid());
      }
      Promise.all(promises).then(() => this._ensureNoAsteroidsCollide());
    }
  }

  /**
   * @param {string} texturePath
   */
  // TODO: Call this from dat.GUI trigger.
  updateTexture(texturePath) {
    this._modelCtrls.forEach(object => object.texturePath = texturePath);
  }

  /**
   * @param {string} id
   */
  // TODO: Call this from dat.GUI trigger.
  updateProgramWrapper(id) {
    this._modelCtrls.forEach(object => object.programWrapperId = id);
  }
}

/**
 * @param {number} density
 * @param {vec3} startPosition
 * @param {vec3} velocity
 * @param {number} rotationRate
 * @param {vec3} scale
 * @returns {DynamicsConfig}
 * @private
 */
function _calculateAsteroidDynamicsConfig(density, startPosition, velocity, rotationRate, scale) {
  const radius = (scale[0] + scale[1] + scale[2]) / 3;
  const mass = density * 4 / 3 * Math.PI * radius * radius * radius;

  const momentum = vec3.create();
  vec3.scale(momentum, velocity, mass);
  const startOrientation = quat.create();
  const angularMomentum = _calculateAngularMomentumFromRotationRate(rotationRate, radius, mass);

  return {
    mass: mass,
    position: startPosition,
    momentum: momentum,
    orientation: startOrientation,
    angularMomentum: angularMomentum,
  };
}

/**
 * @param {number} rotationRate
 * @param {number} radius
 * @param {number} mass
 * @returns {vec3}
 * @private
 */
function _calculateAngularMomentumFromRotationRate(rotationRate, radius, mass) {
  const inertiaTensor = createSphereInertiaTensor(radius, mass);
  const angularMomentum = createRandomVec3(rotationRate);
  vec3.transformMat3(angularMomentum, angularMomentum, inertiaTensor);
  return angularMomentum;
}

export { AsteroidsController };
