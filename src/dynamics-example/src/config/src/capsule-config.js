/**
 * This module handles configuration parameters relating to a capsule object.
 */

const capsuleConfig = {};

capsuleConfig.sphericalTesselationCount = {
  start: 8,
  min: 0,
  max: 20
};
capsuleConfig.radius = {
  start: 1,
  min: 0,
  max: 16
};
capsuleConfig.capsuleEndPointsDistance = {
  start: 3,
  min: 0,
  max: 16
};

const capsuleFolderConfig = {
  label: 'Capsule',
  config: capsuleConfig,
  isOpen: true
};

export {capsuleConfig, capsuleFolderConfig};
