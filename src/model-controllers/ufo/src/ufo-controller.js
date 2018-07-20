import {
  CollidablePhysicsModelController,
} from 'gamex';

/**
 * This class controls an ufo.
 */
class UfoController extends CollidablePhysicsModelController {
  // TODO

  // TODO: This old logic from AsteroidsController should be useful for calculating intercept courses
  //       for the UFOs to start off with.
  // /**
  //  * Calculates a random velocity that moves the asteroid close to the ship.
  //  *
  //  * @param {vec3} asteroidPosition
  //  * @returns {vec3}
  //  * @private
  //  */
  // _createRandomAsteroidVelocity(asteroidPosition) {
  //   const shipPosition = this._getShipPosition();
  //   const shipVelocity = this._getShipVelocity();
  //
  //   // Calculate a random speed for the asteroid.
  //   const asteroidSpeed = randomFloatInRange(asteroidsConfig.minSpeed, asteroidsConfig.maxSpeed);
  //
  //   // Calculate in what direction the asteroid needs to travel in order to collide with the ship if
  //   // the ship were to maintain it's current velocity.
  //   const interceptVelocity = vec3.create();
  //   calculateInterceptVelocity(
  //       interceptVelocity, asteroidPosition, asteroidSpeed, shipPosition, shipVelocity);
  //
  //   // Add a random deviation to the velocity calculated above.
  //   addRandomRotationToVector(interceptVelocity,
  //       asteroidsConfig.minInterceptVelocityDeviationAngle,
  //       asteroidsConfig.maxInterceptVelocityDeviationAngle);
  //
  //   return interceptVelocity;
  // }
}
