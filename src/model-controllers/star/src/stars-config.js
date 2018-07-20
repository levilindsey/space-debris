/**
 * This module handles configuration parameters relating to the stars model.
 */

const starsConfig = {};

starsConfig.shaderProgram = 'star-points-program';

starsConfig.starCountPerChunk = 8;

starsConfig.minSize = 6;
starsConfig.maxSize = 12;

starsConfig.minHue = 0.0;
starsConfig.maxHue = 1.0;

starsConfig.minSaturation = 0.0;
starsConfig.maxSaturation = 0.95;

starsConfig.minLightness = 0.75;
starsConfig.maxLightness = 0.9;

const starsFolderConfig = {
  label: 'Stars',
  config: starsConfig,
  isOpen: false
};

export {starsConfig, starsFolderConfig};
