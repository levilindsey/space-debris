/**
 * This module handles configuration parameters relating to the physics engine.
 */

const physicsConfig = {};

physicsConfig.timeStepDuration = {
  start: 10,
  min: 1,
  max: 1000
};
physicsConfig.gravity = {
  start: 0.0001,
  min: -0.001,
  max: 0.001
};
physicsConfig._gravityVec = vec3.create();

physicsConfig.linearDragCoefficient = {
  start: 0.0001,
  min: 0.0,
  max: 1.0
};
physicsConfig.angularDragCoefficient = {
  start: 0.000005,
  min: 0.0,
  max: 1.0
};
physicsConfig.coefficientOfRestitution = {
  start: 0.8,
  min: 0.0,
  max: 1.0
};
physicsConfig.coefficientOfFriction = {
  start: 0.03,
  min: 0.0,
  max: 1.0
};
physicsConfig.lowMomentumSuppressionThreshold = {
  start: 0.000000002,
  min: 0.0,
  max: 2.0
};
physicsConfig.lowAngularMomentumSuppressionThreshold = {
  start: 0.000000001,
  min: 0.0,
  max: 2.0
};

const physicsConfigUpdaters = {
  updateGravity: () => vec3.set(physicsConfig._gravityVec, 0, 0, -physicsConfig.gravity)
};

export {physicsConfig, physicsConfigUpdaters};
