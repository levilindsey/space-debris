/**
 * This module handles configuration parameters relating to a sphere object.
 */

const sphereConfig = {};

sphereConfig.sphericalTesselationCount = {
  start: 8,
  min: 0,
  max: 20
};
sphereConfig.radius = {
  start: 1,
  min: 0,
  max: 16
};

const sphereFolderConfig = {
  label: 'Sphere',
  config: sphereConfig,
  isOpen: true
};

export {sphereConfig, sphereFolderConfig};
