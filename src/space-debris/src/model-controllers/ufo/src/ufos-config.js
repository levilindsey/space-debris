/**
 * This module handles configuration parameters relating to the ufos model.
 */

const ufosConfig = {};

ufosConfig.texturePath = 'images/textures/metal/metal1.png';
ufosConfig.initialUfoCount = 10;
ufosConfig.initialUfoDistanceFromShip = 40;

// Scene coordinates per millisecond.
ufosConfig.minSpeed = 0.0001;
ufosConfig.maxSpeed = 0.001;

ufosConfig.minInterceptVelocityDeviationAngle = Math.PI * 0.1;
ufosConfig.maxInterceptVelocityDeviationAngle = Math.PI * 0.3;

const ufosFolderConfig = {
  label: 'UFOs',
  config: ufosConfig,
  isOpen: false
};

export {ufosConfig, ufosFolderConfig};
