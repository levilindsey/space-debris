/**
 * This module handles configuration parameters relating to the physics engine.
 */

const physicsConfig = {};

physicsConfig.timeStepDuration = {
  start: 10,
  min: 1,
  max: 1000
};

physicsConfig.linearDragCoefficient = {
  start: 0.00001,
  min: 0.0,
  max: 0.0001
};
physicsConfig.angularDragCoefficient = {
  start: 0.000001,
  min: 0.0,
  max: 0.00005
};
physicsConfig.coefficientOfRestitution = {
  start: 0.8,
  min: 0.0001,
  max: 1.0
};
physicsConfig.coefficientOfFriction = {
  start: 0.03,
  min: 0.0001,
  max: 1.0
};
physicsConfig.lowMomentumSuppressionThreshold = {
  start: 0.000000002,
  min: 0.0,
  max: 0.00000002
};
physicsConfig.lowAngularMomentumSuppressionThreshold = {
  start: 0.000000001,
  min: 0.0,
  max: 0.00000001
};

export {physicsConfig};
