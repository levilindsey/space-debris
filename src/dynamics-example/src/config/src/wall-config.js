/**
 * This module handles configuration parameters relating to the floor.
 */

const wallConfig = {};

wallConfig.halfSideLength = 8000;
wallConfig.thickness = 8000;
wallConfig.zPosition = 8000;
wallConfig.useSmoothShading = false;
wallConfig.texturePath = 'images/textures/metal/metal8.png';
wallConfig.shaderProgram = 'general-model-program';
wallConfig.textureSpan = {
  minX: 0,
  minY: 0,
  maxX: 700,
  maxY: 700
};

const wallFolderConfig = {
  label: 'Wall',
  config: wallConfig
};

export {wallConfig, wallFolderConfig};
