/**
 * This module handles configuration parameters relating to an OBB/ABB object.
 */

const boxConfig = {};

boxConfig.scale = {
  start: vec3.fromValues(1, 1, 1),
  min: vec3.fromValues(0.01, 0.01, 0.01),
  max: vec3.fromValues(100, 100, 100)
};

const boxFolderConfig = {
  label: 'Box',
  config: boxConfig,
  isOpen: true
};

export {boxConfig, boxFolderConfig};
