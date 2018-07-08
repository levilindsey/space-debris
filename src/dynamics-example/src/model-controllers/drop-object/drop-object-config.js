/**
 * This module handles configuration parameters relating to simulations that drop objects.
 */

const dropObjectConfig = {};

dropObjectConfig.shape = {
  start: 'RANDOM',
  options: [
    'CUBE',
    'ICOSAHEDRON',
    'ICOSPHERE',
    'LAT_LONG_SPHERE',
    'CAPSULE',
    'TETRAHEDRON',
    'RANDOM'
  ]
};
dropObjectConfig.startPositionAvg = {
  start: vec3.fromValues(0, 10, 0),
  min: vec3.fromValues(-100, 0, -100),
  max: vec3.fromValues(100, 300, 100)
};
dropObjectConfig.startPositionRange = {
  start: vec3.fromValues(30, 30, 30),
  min: vec3.fromValues(0, 0, 0),
  max: vec3.fromValues(100, 100, 100)
};
dropObjectConfig.count = {
  start: 30,
  min: 1,
  max: 100
};
dropObjectConfig.triggerDrop = () => {};

const dropObjectFolderConfig = {
  label: 'Drop Simulation',
  config: dropObjectConfig,
  isOpen: true
};

export {dropObjectConfig, dropObjectFolderConfig};
