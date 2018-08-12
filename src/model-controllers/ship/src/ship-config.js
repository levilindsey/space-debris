/**
 * This module handles configuration parameters relating to the ship model.
 */

const shipConfig = {};

shipConfig.shaderProgram = 'general-model-program';
shipConfig.texturePath = 'images/textures/metal/metal4.png';

shipConfig.shipWidth = {
  start: 1.2,
  min: 0.1,
  max: 10,
};
shipConfig.shipLength = {
  start: 1.7,
  min: 0.1,
  max: 10,
};
shipConfig.shipDepth = {
  start: 0.4,
  min: 0.1,
  max: 10,
};
shipConfig.shipRearWingExtensionLength = {
  start: 0.5,
  min: -4,
  max: 4,
};

shipConfig.forwardThrustAccelerationMagnitude = {
  start: 0.000025,
  min: 0.000001,
  max: 0.0005,
};
shipConfig.pitchAngularAcceleration = {
  start: 0.000008,
  min: 0.000001,
  max: 0.0001,
};
shipConfig.yawAngularAcceleration = {
  start: 0.000008,
  min: 0.000001,
  max: 0.0001,
};

shipConfig.slowdownAcceleration = {
  start: 0.00008,
  min: 0.0,
  max: 0.005,
};
shipConfig.angularSlowdownAcceleration = {
  start: 0.000008,
  min: 0.0,
  max: 0.0005,
};

shipConfig.maxSpeed = {
  start: 0.095,
  min: 0.001,
  max: 1.0,
};
shipConfig.maxAngularSpeed = {
  start: 0.0095,
  min: 0.0001,
  max: 0.1,
};

shipConfig.mass = {
  start: 1,
  min: 0,
  max: 100,
};

shipConfig.torpedoSpeed = {
  start: 0.3,
  min: 0.03,
  max: 3.0,
};
shipConfig.torpedoLength = {
  start: 6.0,
  min: 0.01,
  max: 30.0,
};
shipConfig.torpedoWidth = {
  start: 0.8,
  min: 0.01,
  max: 5.0,
};
shipConfig.torpedoColor = {
  h: 0.29,
  s: 0.99,
  l: 0.6,
};

shipConfig.forwardThrusterShaderProgram = 'flat-color-program';

shipConfig.forwardThrusterColor = {
  h: 0.55,
  s: 0.99,
  l: 0.9,
};
shipConfig.forwardThrusterColorAlpha = {
  start: 0.95,
  min: 0.01,
  max: 1,
};

shipConfig.forwardThrusterMarginRatio = {
  start: 0.7,
  min: 0.01,
  max: 2,
};
shipConfig.forwardThrusterLength = {
  start: 0.5,
  min: 0,
  max: 10,
};

shipConfig._shootTorpedoThrottleDelay = 150;

const shipFolderConfig = {
  label: 'Ship',
  config: shipConfig,
  isOpen: false
};

export {shipConfig, shipFolderConfig};
