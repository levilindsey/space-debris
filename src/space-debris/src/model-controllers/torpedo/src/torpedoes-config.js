/**
 * This module handles configuration parameters relating to the torpedo model.
 */

const torpedoesConfig = {};

torpedoesConfig.shaderProgram = 'flat-color-program';

torpedoesConfig.mass = 10;

torpedoesConfig.alpha = {
  start: 0.5,
  min: 0,
  max: 1,
};

// Should probably try to keep this in-sync with sceneConfig.chunkSideLength.
torpedoesConfig.removalDistance = 300;

torpedoesConfig._removalCheckThrottleDelay = 300;
torpedoesConfig._removalSquaredDistance = null;

function _updateRemovalSquaredDistance() {
  torpedoesConfig._removalSquaredDistance =
      torpedoesConfig.removalDistance * torpedoesConfig.removalDistance;
}

_updateRemovalSquaredDistance();

const torpedoesFolderConfig = {
  label: 'Torpedoes',
  config: torpedoesConfig,
  isOpen: false,
  onChangeListeners: {
    'removalDistance': _updateRemovalSquaredDistance,
  },
};

export {torpedoesConfig, torpedoesFolderConfig};
